/*
  escape.js: o motor do escape room da Mini Loja (avaliação final de Web II, 24/11/2026).
  versão 3 · 2026-11-24 · + palco.js: a Stela guia o aluno, formulário de verdade e uma surpresa na vitrine para cada defeito

  A história ("A Mini Loja foi invadida" ou "Preso no servidor") e o defeito de cada fechadura são
  sorteados pelo e-mail do aluno. Cada etapa vale 1 ponto se ele acertar em até 2 chances; errou as duas,
  a segurança mostra a resposta e ele segue sem o ponto. O progresso fica salvo no navegador.
  Com as 5 fechaduras abertas, a entrega vai para o Placa-Mãe pelo CONTA.registrarTentativa.
  Modo demonstração: escape/?demo (sem login, nada é registrado); ?demo=2, ?demo=3... sorteia outro aluno.
  Desde 24/11 o ?demo só vale no localhost: no site no ar ele é ignorado e a sala pede o login.
*/
(function () {
  "use strict";

  var PARAMS = new URLSearchParams(location.search);
  // o ensaio (?demo, sem login e sem nota) só funciona no computador da professora; no site no ar, sempre pede o login
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var DEMO = PARAMS.has("demo") && LOCAL;
  var ATIVIDADE = "escape-mini-loja";
  var TOTAL = 5;
  var CHANCES = 2;
  var LETRAS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  // no modo demonstração a sala não pede login (precisa rodar antes do conta.js)
  if (DEMO) {
    document.querySelectorAll("[data-exige-login]").forEach(function (area) { area.removeAttribute("data-exige-login"); });
  }

  var $ = function (id) { return document.getElementById(id); };
  var raiz = document.documentElement;
  var FECH = window.FECHADURAS;

  var HISTORIAS = {
    invadida: {
      titulo: "A Mini Loja foi invadida",
      sub: "Alguém mexeu no código. A loja abre amanhã às 8h.",
      texto: "Domingo à noite, alguém entrou no servidor da <strong>Mini Loja</strong> e estragou <strong>5 linhas</strong> do código. Nada quebrou de vez: a loja continua no ar, mas cada parte está fazendo uma coisa errada. Você é a equipe de resposta. Cada defeito consertado abre uma fechadura do painel de recuperação; com as 5, sai o código que devolve a loja ao dono."
    },
    preso: {
      titulo: "Preso no servidor",
      sub: "A porta trancou. O café acabou. Só o código abre.",
      texto: "Você entrou na sala do servidor da <strong>Mini Loja</strong> para um conserto rápido... e a porta trancou atrás de você. O painel da porta tem <strong>5 fechaduras</strong>, e cada uma só abre quando um defeito do código for consertado. O ar-condicionado está no máximo. Com as 5, o painel mostra o código de saída."
    }
  };

  var email = "";
  var semente = 0;
  var estado = null;
  var atual = 0;
  var montada = null;
  var animando = false;
  var P = window.PALCO;

  // o primeiro nome, tirado do e-mail da faculdade (ana50466166@... vira Ana)
  function primeiroNome() {
    var n = email.split("@")[0].replace(/[0-9._-]+/g, "");
    if (!n || /^demo/.test(n)) return "dev";
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
  // o título do formulário, pelo botão
  function tituloForm(botao) {
    return { "Entrar": "Área do funcionário", "Cadastrar funcionário": "Novo funcionário", "Buscar": "Buscar na vitrine",
      "Excluir": "Excluir produto", "Abrir": "Editar produto" }[botao] || "Novo produto";
  }

  /* ---------- guardar no navegador (pode falhar em aba anônima: tudo continua funcionando) ---------- */
  function chave() { return "escape-php:" + email; }
  function lerEstado() {
    try { return JSON.parse(localStorage.getItem(chave()) || "null"); } catch (e) { return null; }
  }
  function salvar() {
    try { localStorage.setItem(chave(), JSON.stringify(estado)); } catch (e) { /* sem espaço: segue */ }
  }

  /* ---------- sorteio pelo e-mail (sempre o mesmo para o mesmo aluno) ---------- */
  function hash(texto) {
    var h = 5381;
    for (var i = 0; i < texto.length; i++) h = ((h * 33) ^ texto.charCodeAt(i)) >>> 0;
    return h;
  }
  function gerador(texto) {
    // mulberry32: mistura bem os bits, para o sorteio não pender para um lado
    var n = hash(texto);
    return function (limite) {
      n = (n + 0x6D2B79F5) >>> 0;
      var t = Math.imul(n ^ (n >>> 15), 1 | n);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return (((t ^ (t >>> 14)) >>> 0) % limite);
    };
  }
  function pedacoDe(id) {
    var g = gerador(email + ":codigo:" + id);
    return LETRAS[g(LETRAS.length)] + LETRAS[g(LETRAS.length)];
  }

  /* ---------- cor no código: strings, variáveis, comentários e tags ---------- */
  function esc(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function colorir(linha) {
    var re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\$\w+)|(<\?php|<\/?[a-z]+\b|\?>)/g;
    var saida = "";
    var ultimo = 0;
    var m;
    while ((m = re.exec(linha))) {
      saida += esc(linha.slice(ultimo, m.index));
      var classe = m[1] ? "com" : m[2] ? "str" : m[3] ? "var" : "tag";
      saida += '<span class="' + classe + '">' + esc(m[0]) + "</span>";
      ultimo = re.lastIndex;
    }
    return saida + esc(linha.slice(ultimo));
  }

  /* ---------- registro da sala ---------- */
  function registrar(texto, tipo) {
    var li = document.createElement("li");
    if (tipo) li.className = tipo;
    var hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    li.innerHTML = "<time>" + hora + "</time> " + texto;
    $("er-log").prepend(li);
    estado.log = estado.log || [];
    estado.log.unshift({ h: hora, t: texto, c: tipo || "" });
    estado.log = estado.log.slice(0, 40);
    salvar();
  }
  function remontarLog() {
    $("er-log").innerHTML = "";
    (estado.log || []).slice().reverse().forEach(function (item) {
      var li = document.createElement("li");
      if (item.c) li.className = item.c;
      li.innerHTML = "<time>" + item.h + "</time> " + item.t;
      $("er-log").prepend(li);
    });
  }

  /* ---------- o cofre: as 5 fechaduras e o código de saída ---------- */
  function fe(i) {
    var f = FECH[i];
    if (!f) return null;
    estado.fech[f.id] = estado.fech[f.id] || { pedido: false, tLinha: 0, pLinha: null, tCons: 0, pCons: null, aberta: false };
    return estado.fech[f.id];
  }
  function montarCofre() {
    var lista = $("er-cadeados");
    lista.innerHTML = "";
    var pedacos = [];
    for (var i = 0; i < TOTAL; i++) {
      var f = FECH[i];
      var e = f ? fe(i) : null;
      var li = document.createElement("li");
      li.className = "er-cadeado" + (e && e.aberta ? " aberto" : "") + (i === atual ? " atual" : "") + (!f ? " breve" : "");
      li.innerHTML = '<span class="er-cadeado-icone" aria-hidden="true">' + (e && e.aberta ? "🔓" : "🔒") + "</span>" +
        "<b>F" + (i + 1) + "</b><small>" + (f ? f.tema : "em breve") + "</small>";
      li.setAttribute("aria-label", "Fechadura " + (i + 1) + (e && e.aberta ? ", aberta" : ", trancada"));
      lista.appendChild(li);
      pedacos.push(e && e.aberta ? pedacoDe(f.id) : "··");
    }
    $("er-codigo-saida").textContent = pedacos.join("-");
  }

  /* ---------- abrir uma fechadura ---------- */
  function abrirFechadura(i) {
    atual = i;
    estado.atual = i;
    salvar();
    var f = FECH[i];
    var e = fe(i);
    montada = f.montar(gerador(email + ":" + f.id));

    $("er-olho").textContent = "F" + (i + 1) + " · fechadura " + (i + 1) + " · " + f.tema;
    $("er-fech-titulo").textContent = f.titulo;
    $("er-fech-historia").innerHTML = f.historia[estado.historia];
    $("er-combinado").innerHTML = f.combinado;

    // a analogia da loja
    document.querySelectorAll(".er-estacao").forEach(function (est, n) {
      var a = f.analogia[n];
      est.querySelector(".er-icone").textContent = a.icone;
      est.querySelector("strong").textContent = a.lugar;
      est.querySelector("code").textContent = a.arquivo;
      est.querySelector("p").innerHTML = a.texto;
      est.querySelector(".er-balao").textContent = "";
      est.classList.remove("ok", "erro", "acesa");
    });

    // o formulário de teste: os campos mudam a cada fechadura (e se preenchem sozinhos, no palco.js)
    P.campos($("er-campos"), montada.pedido.campos);
    $("er-pedir-texto").textContent = montada.pedido.botao;
    $("er-form-titulo").textContent = tituloForm(montada.pedido.botao);
    $("er-pedido-nota").hidden = !montada.pedido.nota;
    $("er-pedido-nota").innerHTML = montada.pedido.nota || "";
    $("er-comanda-titulo").innerHTML = montada.comandaTitulo;
    $("er-endereco").textContent = montada.sintoma.endereco.replace(/\?.*$/, "");
    $("er-vitrine").innerHTML = "Clique em <strong>" + montada.pedido.botao + "</strong> para ver o que acontece.";
    P.vitrineInicial(montada);
    $("er-comanda").hidden = true;
    $("er-resposta").value = "";
    $("er-resposta").disabled = e.aberta;
    montarOpcoes();

    montarArquivos();
    montarCofre();
    atualizarEtapas();
    if (e.pedido) mostrarSintoma(e.aberta);

    // a Stela fala: boas-vindas na primeira vez, depois o começo de cada fechadura
    if (e.aberta) {
      P.falar("joinha", "Esta fechadura você já abriu. Pode rever o código com calma ou seguir para a próxima.");
    } else if (i === 0 && !e.pedido) {
      P.falar("acenando", "Oi, " + primeiroNome() + "! Hoje você é a pessoa desenvolvedora responsável pela Mini Loja, e eu confio em você. " + f.guia.comeco);
    } else if (!e.pedido) {
      P.falar("notebook", f.guia.comeco);
    } else {
      P.falar("ideia", "Você parou aqui. Olhe o que aconteceu na vitrine e continue de onde estava.");
    }
  }

  /* ---------- os arquivos, com as linhas clicáveis ---------- */
  function montarArquivos() {
    var caixa = $("er-arquivos");
    caixa.innerHTML = "";
    montada.arquivos.forEach(function (arq, a) {
      var janela = document.createElement("div");
      janela.className = "janela er-arquivo";
      var html = '<div class="janela-barra"><span class="semaforo" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<span class="janela-titulo">' + arq.nome + " · " + arq.papel + "</span></div><div class=\"er-codigo\">";
      arq.linhas.forEach(function (linha, l) {
        var num = '<span class="er-n" aria-hidden="true">' + (l + 1) + "</span>";
        if (!linha.trim()) {
          html += '<div class="er-linha vazia">' + num + "<code> </code></div>";
        } else {
          html += '<button type="button" class="er-linha" data-a="' + a + '" data-l="' + l + '" aria-label="' +
            arq.nome + ", linha " + (l + 1) + ": " + esc(linha.trim()).replace(/"/g, "&quot;") + '">' + num +
            "<code>" + colorir(linha) + "</code></button>";
        }
      });
      janela.innerHTML = html + "</div>";
      caixa.appendChild(janela);
    });
  }

  /* ---------- conserto por escolha: as versões viram botões de rádio ---------- */
  function montarOpcoes() {
    var c = montada.conserto;
    var lista = $("er-opcoes-lista");
    lista.innerHTML = "";
    $("er-opcoes").hidden = !c.opcoes;
    $("er-resposta").hidden = !!c.opcoes;
    $("er-lacuna").hidden = !c.opcoes;
    if (!c.opcoes) return;
    $("er-opcoes-pergunta").textContent = c.pergunta;
    c.opcoes.forEach(function (texto, n) {
      var item = document.createElement("label");
      item.className = "er-opcao";
      item.innerHTML = '<input type="radio" name="er-opcao" value="' + n + '"><span class="er-letra">' + "ABCD"[n] +
        "</span><code>" + texto.split("\n").map(colorir).join("\n") + "</code>";
      lista.appendChild(item);
    });
  }
  function marcarOpcoes() {
    var c = montada.conserto;
    var e = fe(atual);
    if (!c.opcoes) return;
    document.querySelectorAll(".er-opcao").forEach(function (item, n) {
      var radio = item.querySelector("input");
      radio.disabled = e.aberta;
      item.classList.toggle("errada", (e.opErradas || []).indexOf(n) >= 0);
      item.classList.toggle("certa", e.aberta && n === c.certa);
      if (e.aberta) radio.checked = n === c.certa;
    });
  }
  function opcaoEscolhida() {
    var marcada = document.querySelector('input[name="er-opcao"]:checked');
    return marcada ? Number(marcada.value) : -1;
  }
  // a linha consertada, como ela fica no código
  function linhaConsertada() {
    var c = montada.conserto;
    if (!c.opcoes) return c.antes + c.resposta + c.depois;
    var certa = c.opcoes[c.certa];
    if (c.antes !== undefined) return c.antes + certa + c.depois;
    return certa.split("\n").map(function (l) { return c.recuo + l; }).join("\n");
  }

  function linhaDefeito() {
    return document.querySelector('.er-linha[data-a="' + montada.defeito.arquivo + '"][data-l="' + montada.defeito.linha + '"]');
  }

  /* ---------- o que aparece em cada etapa ---------- */
  function chancesTexto(tentativas) {
    var restam = CHANCES - tentativas;
    return restam === CHANCES ? "Você tem 2 chances." : "Resta " + restam + " chance. Pense bem!";
  }
  function atualizarEtapas() {
    var e = fe(atual);
    var f = FECH[atual];
    var linhaFeita = e.pLinha !== null;
    $("er-pedir").disabled = e.pedido && !e.aberta;
    $("er-etapa-linha").hidden = !e.pedido;
    $("er-etapa-conserto").hidden = !linhaFeita || e.aberta;
    $("er-aberta").hidden = !e.aberta;

    // a linha: marcada (achada ou mostrada pela segurança) e o resto travado
    document.querySelectorAll(".er-linha[data-l]").forEach(function (b) {
      b.disabled = linhaFeita;
      b.classList.remove("errada");
    });
    (e.erradas || []).forEach(function (par) {
      var b = document.querySelector('.er-linha[data-a="' + par[0] + '"][data-l="' + par[1] + '"]');
      if (b) b.classList.add("errada");
    });
    var certa = linhaDefeito();
    // fechadura aberta: a linha aparece já consertada no código
    if (certa && e.aberta) {
      var c0 = montada.conserto;
      if (!$("er-resposta").value && !c0.opcoes) $("er-resposta").value = c0.resposta;
      certa.querySelector("code").innerHTML = linhaConsertada().split("\n").map(colorir).join("\n");
    }
    if (certa) certa.classList.toggle("achada", linhaFeita);
    if (certa) certa.classList.toggle("mostrada", linhaFeita && e.pLinha === 0);
    $("er-chances-linha").textContent = linhaFeita
      ? (e.pLinha ? "✅ Achou a linha! +1 ponto." : "🚨 A segurança mostrou a linha. Sem ponto nesta etapa.")
      : chancesTexto(e.tLinha);

    // o conserto
    var c = montada.conserto;
    var arq = montada.arquivos[montada.defeito.arquivo];
    $("er-conserto-arquivo").textContent = arq.nome + ", linha " + (montada.defeito.linha + 1);
    // conserto da linha inteira (sem antes e depois): mostra a linha estragada riscada
    var inteira = c.opcoes && c.antes === undefined;
    $("er-antes").innerHTML = inteira ? '<s class="er-riscada">' + colorir(arq.linhas[montada.defeito.linha].trim()) + "</s>" : colorir(c.antes.replace(/^\s+/, ""));
    $("er-depois").innerHTML = inteira ? "" : colorir(c.depois);
    $("er-lacuna").hidden = !c.opcoes || inteira;
    if (c.tamanho) $("er-resposta").size = c.tamanho;
    $("er-chances-conserto").textContent = chancesTexto(e.tCons);
    marcarOpcoes();

    // fechadura aberta
    if (e.aberta) {
      $("er-aberta-titulo").textContent = "Fechadura " + (atual + 1) + " aberta! Pedaço do código: " + pedacoDe(f.id);
      $("er-aberta-porque").innerHTML = "<strong>O que estava acontecendo:</strong> " + montada.porque;
      $("er-aberta-pontos").textContent = "Pontos nesta fechadura: " + (e.pLinha + e.pCons) + " de 2.";
      var temProxima = !!FECH[atual + 1];
      $("er-proxima").hidden = atual + 1 >= TOTAL;
      $("er-proxima").textContent = temProxima ? "Próxima fechadura →" : "As outras fechaduras ainda estão sendo soldadas...";
      $("er-proxima").disabled = !temProxima;
      // as 5 abertas: o fim da história
      if (contas().abertas === TOTAL) {
        $("er-aberta-titulo").textContent = estado.historia === "invadida"
          ? "🏆 A Mini Loja voltou para o dono! Código de saída: " + $("er-codigo-saida").textContent
          : "🚪 A porta abriu! Você está livre (e já pode ir buscar café). Código de saída: " + $("er-codigo-saida").textContent;
      }
    }
    atualizarResumo();
  }

  /* ---------- a animação do pedido: balcão → vendedor → estoque ---------- */
  function pausado() { return raiz.classList.contains("pausado"); }
  function esperar(ms) {
    return new Promise(function (ok) { setTimeout(ok, pausado() ? 0 : ms); });
  }
  function estacao(n) { return document.querySelector('.er-estacao[data-estacao="' + n + '"]'); }
  function balao(n, texto, tipo) {
    var est = estacao(n);
    est.classList.remove("ok", "erro");
    est.classList.add("acesa");
    if (tipo) est.classList.add(tipo);
    est.querySelector(".er-balao").textContent = texto;
  }
  function pulso(n) {
    var t = document.querySelector('.er-trilha[data-trilha="' + n + '"]');
    t.classList.remove("viajando");
    void t.offsetWidth;
    t.classList.add("viajando");
    return esperar(900).then(function () { t.classList.remove("viajando"); });
  }
  function viagem(consertado) {
    animando = true;
    var f = consertado ? montada.falas.ok : montada.falas.erro;
    document.querySelectorAll(".er-estacao").forEach(function (est) {
      est.classList.remove("ok", "erro", "acesa");
      est.querySelector(".er-balao").textContent = "";
    });
    balao(0, f[0], "ok");
    return esperar(500)
      .then(function () { return pulso(0); })
      .then(function () { balao(1, f[1], consertado ? "ok" : "erro"); return esperar(700); })
      .then(function () { return pulso(1); })
      .then(function () { balao(2, f[2], consertado ? "ok" : "erro"); animando = false; });
  }

  // o que a vitrine, o endereço e a ficha mostram, com o defeito ou já consertado
  function mostrarSintoma(consertado) {
    var s = consertado ? montada.consertado : montada.sintoma;
    $("er-comanda").hidden = false;
    if (!consertado && s.endereco.indexOf("?") >= 0) P.digitarEndereco(s.endereco);
    else $("er-endereco").textContent = s.endereco;
    $("er-vitrine").innerHTML = s.vitrine;
    P.cena(montada, consertado ? montada.cenaOk : montada.cena, consertado);
    $("er-comanda-texto").textContent = s.comanda;
  }

  /* ---------- etapa 1: o pedido ---------- */
  $("er-pedir").addEventListener("click", function () {
    var e = fe(atual);
    if (animando) return;
    if (e.aberta) {
      P.carregando(true);
      viagem(true).then(function () { P.carregando(false); mostrarSintoma(true); });
      return;
    }
    $("er-pedir").disabled = true;
    P.carregando(true);
    viagem(false).then(function () {
      P.carregando(false);
      mostrarSintoma(false);
      if (!e.pedido) {
        e.pedido = true;
        registrar("F" + (atual + 1) + ": teste feito. Algo saiu errado na vitrine.", "erro");
        P.falar("neutra", "Viu só? Isso não devia acontecer. Leia a ficha amarela logo abaixo e, quando estiver pronto, desça até o código e clique na linha que causa isso. Sem pressa: pensar também é programar.");
      }
      atualizarEtapas();
      // a vitrine fica na tela: o aluno precisa ver a surpresa antes de ir para o código
      $("er-navegador").scrollIntoView({ behavior: pausado() ? "auto" : "smooth", block: "center" });
    });
  });

  /* ---------- etapa 2: achar a linha ---------- */
  $("er-arquivos").addEventListener("click", function (ev) {
    var b = ev.target.closest(".er-linha[data-l]");
    if (!b || b.disabled) return;
    var e = fe(atual);
    if (e.pLinha !== null) return;
    var a = Number(b.dataset.a);
    var l = Number(b.dataset.l);
    var nome = montada.arquivos[a].nome + ", linha " + (l + 1);
    if (a === montada.defeito.arquivo && l === montada.defeito.linha) {
      e.pLinha = 1;
      registrar("F" + (atual + 1) + ": defeito achado em " + nome + (e.tLinha === 0 ? ". Compilou de primeira!" : ". Na segunda chance!"), "ok");
      P.falar(e.tLinha === 0 ? "olhos-de-estrela" : "joinha", e.tLinha === 0
        ? "Olho de dev! Achou de primeira. Agora conserte a linha."
        : "Isso! Errar e tentar de novo é exatamente o que um bom dev faz. Agora conserte a linha.");
    } else {
      e.tLinha++;
      e.erradas = (e.erradas || []).concat([[a, l]]);
      b.classList.add("errada", "treme");
      setTimeout(function () { b.classList.remove("treme"); }, 500);
      if (e.tLinha >= CHANCES) {
        e.pLinha = 0;
        registrar("F" + (atual + 1) + ": " + nome + " não era. A segurança mostrou a linha certa.", "erro");
        P.falar("maos-em-coracao", "Tudo bem! A segurança mostrou a linha (ela está marcada no código). O ponto do conserto ainda é todo seu. Bora!");
      } else {
        registrar("F" + (atual + 1) + ": " + nome + " não era. Curto-circuito. Confere a trilha e tenta de novo.", "erro");
        P.falar("piscando", "Quase! Essa linha está inocente. " + FECH[atual].guia.pista);
      }
    }
    salvar();
    atualizarEtapas();
    if (e.pLinha !== null) $("er-resposta").focus();
  });

  /* ---------- etapa 3: consertar ---------- */
  function respostaCerta(texto) {
    var c = montada.conserto;
    var t = texto.trim();
    if (c.aceita) return c.aceita.test(t);
    if (c.minusculas) return t.toLowerCase() === c.resposta;
    if (c.semEspacos) return t.replace(/\s+/g, "") === c.resposta.replace(/\s+/g, "");
    return t === c.resposta;
  }
  function consertar() {
    var e = fe(atual);
    if (animando || e.aberta || e.pLinha === null) return;
    var c = montada.conserto;
    var campo = $("er-resposta");
    var escolha = c.opcoes ? opcaoEscolhida() : -1;
    if (c.opcoes ? escolha < 0 : !campo.value.trim()) {
      $("er-chances-conserto").textContent = c.opcoes ? "Escolha uma das versões antes de testar." : "Escreva o que falta na linha antes de testar.";
      if (!c.opcoes) campo.focus();
      return;
    }
    var certo = c.opcoes ? escolha === c.certa : respostaCerta(campo.value);
    var tentativa = c.opcoes ? "a versão " + "ABCD"[escolha] : "\"" + esc(campo.value.trim()) + "\"";
    if (certo) {
      e.pCons = 1;
      registrar("F" + (atual + 1) + ": conserto testado e aprovado.", "ok");
      P.falar("festa", e.pLinha + 1 === 2
        ? "Perfeito, 2 de 2! Você consertou como gente grande. 🎉"
        : "Consertado! Você não desistiu, e isso conta muito. 🎉");
    } else {
      e.tCons++;
      var tremer = c.opcoes ? document.querySelector('input[name="er-opcao"]:checked').closest(".er-opcao") : campo;
      tremer.classList.add("treme");
      if (c.opcoes) tremer.classList.add("errada");
      setTimeout(function () { tremer.classList.remove("treme"); }, 500);
      e.opErradas = c.opcoes ? (e.opErradas || []).concat([escolha]) : e.opErradas;
      if (e.tCons < CHANCES) {
        registrar("F" + (atual + 1) + ": " + tentativa + " não resolveu. Curto-circuito. Confere a trilha e tenta de novo.", "erro");
        P.falar("punho", "Ainda não, mas você está perto. Releia a linha inteira e lembre do combinado da Mini Loja, logo acima da loja. Você consegue!");
        salvar();
        atualizarEtapas();
        viagem(false);
        return;
      }
      e.pCons = 0;
      if (!c.opcoes) campo.value = c.resposta;
      registrar("F" + (atual + 1) + ": a segurança consertou a linha. Sem ponto nesta etapa.", "erro");
      P.falar("maos-em-coracao", "Sem problema: a segurança consertou. O mais importante é entender o porquê. Leia a explicação com carinho, ela vai te servir no trabalho.");
    }
    e.aberta = true;
    salvar();
    campo.disabled = true;
    marcarOpcoes();
    viagem(true).then(function () {
      mostrarSintoma(true);
      registrar("🔓 Fechadura " + (atual + 1) + " aberta! Pedaço do código: " + pedacoDe(FECH[atual].id), "ok");
      montarCofre();
      atualizarEtapas();
      $("er-aberta").scrollIntoView({ behavior: pausado() ? "auto" : "smooth", block: "center" });
      P.confete(contas().abertas === TOTAL);
      setTimeout(function () { P.voarPedaco(pedacoDe(FECH[atual].id)); }, pausado() ? 0 : 450);
      verificarFim();
    });
  }
  $("er-consertar").addEventListener("click", consertar);
  $("er-resposta").addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") consertar();
  });

  $("er-proxima").addEventListener("click", function () {
    if (!FECH[atual + 1]) return;
    $("er-resposta").value = "";
    $("er-resposta").disabled = false;
    abrirFechadura(atual + 1);
    $("sala").scrollIntoView({ behavior: pausado() ? "auto" : "smooth", block: "start" });
  });

  /* ---------- pontos e entrega ---------- */
  function contas() {
    var acertos = 0;
    var abertas = 0;
    for (var i = 0; i < TOTAL; i++) {
      var f = FECH[i];
      var e = f && estado.fech[f.id];
      if (!e) continue;
      acertos += (e.pLinha || 0) + (e.pCons || 0);
      if (e.aberta) abertas++;
    }
    return { acertos: acertos, total: TOTAL * 2, abertas: abertas };
  }
  function atualizarResumo() {
    var c = contas();
    $("er-resumo").innerHTML = "<p><strong>" + c.abertas + " de " + TOTAL + "</strong> fechaduras abertas · <strong>" +
      c.acertos + " de " + c.total + "</strong> pontos</p>";
    $("er-entregar").disabled = c.abertas < TOTAL || DEMO;
    if (estado.entregue) {
      $("er-comprovante").textContent = "Entregue em " + estado.entregue.quando + " · " + estado.entregue.acertos + " de " +
        estado.entregue.total + " · código de verificação " + estado.entregue.codigo + ".";
    }
  }
  function verificarFim() {
    var c = contas();
    if (c.abertas < TOTAL) return;
    registrar("🚪 As 5 fechaduras estão abertas. Código de saída: " + $("er-codigo-saida").textContent, "ok");
    P.falar("apaixonada", "Você conseguiu, " + primeiroNome() + "! A Mini Loja está segura de novo, graças a você. Foi uma alegria acompanhar a sua jornada nesta disciplina. Muito orgulho! 💛");
    if (!estado.entregue) entregar();
  }
  function entregar() {
    var aviso = $("er-comprovante");
    if (DEMO || !window.CONTA || !CONTA.daFaculdade()) {
      aviso.textContent = DEMO
        ? "Modo demonstração: nada foi enviado."
        : "A entrega só vale com o login da faculdade (@edu.df.senac.br). Clique em Entrar, no alto da página.";
      return;
    }
    var c = contas();
    aviso.textContent = "Soldando os componentes... (enviando)";
    CONTA.registrarTentativa({
      atividade: ATIVIDADE,
      titulo: "Escape room da Mini Loja",
      acertos: c.acertos,
      total: c.total,
      detalhes: { versao: 1, historia: estado.historia, codigo: $("er-codigo-saida").textContent, fechaduras: estado.fech }
    }).then(function (registro) {
      if (!registro) {
        aviso.textContent = "Não deu para enviar. Confira o login e a internet e clique em Entregar.";
        return;
      }
      estado.entregue = {
        quando: new Date(registro.feito_em).toLocaleString("pt-BR"),
        acertos: c.acertos,
        total: c.total,
        codigo: registro.codigo
      };
      salvar();
      registrar("📦 Entrega enviada à professora.", "ok");
      atualizarResumo();
    });
  }
  $("er-entregar").addEventListener("click", entregar);

  /* ---------- começar: a história e a fechadura em que o aluno parou ---------- */
  function comecar(endereco) {
    email = (endereco || "demo@edu.df.senac.br").toLowerCase();
    semente = hash(email);
    estado = lerEstado() || { historia: gerador(email + ":historia")(2) === 0 ? "invadida" : "preso", atual: 0, fech: {}, log: [] };
    var h = HISTORIAS[estado.historia];
    $("er-subtitulo").textContent = h.sub;
    $("er-historia-titulo").textContent = h.titulo;
    $("er-historia-texto").innerHTML = h.texto;
    remontarLog();
    var i = FECH[estado.atual] ? estado.atual : 0;
    abrirFechadura(i);
    if (fe(i).aberta) $("er-resposta").disabled = true;
  }

  // ensaio da professora: recomeçar do zero (só no modo demonstração)
  if (DEMO) {
    var ensaio = document.createElement("p");
    ensaio.className = "dica";
    ensaio.innerHTML = "<strong>Modo demonstração</strong> (nada é enviado). Outro aluno sorteado: troque o número em <code>?demo=2</code>. " +
      '<button type="button" class="botao contorno" id="er-recomecar">↺ Recomeçar o ensaio</button>';
    $("historia").appendChild(ensaio);
    $("er-recomecar").addEventListener("click", function () {
      try { localStorage.removeItem(chave()); } catch (e) { /* segue */ }
      location.reload();
    });
    comecar("demo" + (PARAMS.get("demo") || "") + "@edu.df.senac.br");
  } else {
    window.addEventListener("load", function () {
      if (window.CONTA) CONTA.aoMudar(function (u) { if (u) comecar(u.email); });
    });
  }
})();
