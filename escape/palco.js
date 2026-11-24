/*
  palco.js: o que dá vida ao escape room da Mini Loja (avaliação final de Web II).
  versão 1 · 2026-11-24

  - A Stela (memoji) guia o aluno do começo ao fim, com carinho: comemora acerto e acolhe erro.
  - O formulário de teste parece um site de verdade (campos por tipo, digitação, barra de carregamento).
  - A vitrine mostra uma SURPRESA diferente para cada defeito (montada.cena) e para o conserto (montada.cenaOk).
  - Confete quando uma fechadura abre.
  Tudo para com o botão "Pausar animações" (e com o "reduzir movimento" do sistema, que já começa pausado).
*/
window.PALCO = (function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var raiz = document.documentElement;
  var MEMOJI = "memoji/";
  function pausado() { return raiz.classList.contains("pausado"); }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function reais(v) { return "R$ " + Number(v).toFixed(2).replace(".", ","); }

  /* =====================================================================
     A STELA: o memoji que guia o aluno
     ===================================================================== */
  var guia = null;
  var digitando = null;

  function montarGuia() {
    guia = document.createElement("aside");
    guia.className = "er-guia";
    guia.id = "er-guia";
    guia.setAttribute("aria-label", "A professora Stela guiando você");
    guia.innerHTML =
      '<button type="button" class="er-guia-foto" id="er-guia-abrir" aria-label="Mostrar a fala da Stela" aria-expanded="true">' +
      '<img id="er-guia-img" src="' + MEMOJI + 'acenando.webp" alt="" width="80" height="80"></button>' +
      '<div class="er-guia-balao" id="er-guia-balao">' +
      '<span class="er-guia-nome">Profa. Stela</span>' +
      '<p id="er-guia-texto" role="status" aria-live="polite"></p>' +
      '<button type="button" class="er-guia-fechar" id="er-guia-fechar" aria-label="Esconder a fala da Stela">✕</button>' +
      "</div>";
    document.body.appendChild(guia);
    $("er-guia-fechar").addEventListener("click", function () { minimizar(true); });
    $("er-guia-abrir").addEventListener("click", function () { minimizar(!guia.classList.contains("mini")); });

    // a Stela só aparece enquanto o aluno está na sala das fechaduras
    var sala = $("sala");
    if (sala && "IntersectionObserver" in window) {
      new IntersectionObserver(function (itens) {
        guia.classList.toggle("fora", !itens[0].isIntersecting);
      }, { rootMargin: "0px 0px -30% 0px" }).observe(sala);
    }
  }

  function minimizar(sim) {
    guia.classList.toggle("mini", sim);
    $("er-guia-abrir").setAttribute("aria-expanded", String(!sim));
    $("er-guia-abrir").setAttribute("aria-label", sim ? "Mostrar a fala da Stela" : "Esconder a fala da Stela");
  }

  // a Stela fala: troca o memoji, dá um pulinho e escreve a mensagem
  var recolher = null;
  function falar(memoji, html) {
    if (!guia) montarGuia();
    minimizar(false);
    // depois de dar tempo de ler, o balão se recolhe na foto (💬); um clique na foto mostra de novo
    clearTimeout(recolher);
    var tempo = Math.max(9000, html.replace(/<[^>]+>/g, "").length * 70);
    recolher = setTimeout(function tenta() {
      if (guia.matches(":hover") || guia.contains(document.activeElement)) { recolher = setTimeout(tenta, 3000); return; }
      minimizar(true);
    }, tempo);
    var img = $("er-guia-img");
    img.src = MEMOJI + memoji + ".webp";
    guia.classList.remove("pulo");
    void guia.offsetWidth;
    guia.classList.add("pulo");
    var p = $("er-guia-texto");
    clearInterval(digitando);
    if (pausado()) {
      p.innerHTML = html;
      return;
    }
    // efeito de digitação, sem quebrar as tags (<code>, <strong>)
    var partes = html.split(/(<[^>]+>)/);
    var i = 0;
    var c = 0;
    var feito = "";
    p.innerHTML = "";
    digitando = setInterval(function () {
      if (i >= partes.length) { clearInterval(digitando); return; }
      var parte = partes[i];
      if (parte.charAt(0) === "<") { feito += parte; i++; return; }
      c += 2;
      p.innerHTML = feito + parte.slice(0, c);
      if (c >= parte.length) { feito += parte; i++; c = 0; }
    }, 18);
  }

  /* =====================================================================
     O FORMULÁRIO DE TESTE: campos de verdade, conforme o tipo
     ===================================================================== */
  var ehAtaque = /UNION|OR 1=1|' --|--$/i;

  function campos(caixa, lista) {
    caixa.innerHTML = "";
    lista.forEach(function (c, n) {
      var rotulo = c[0];
      var valor = String(c[1]);
      var id = "er-campo-" + n;
      var grupo = document.createElement("div");
      grupo.className = "er-campo";
      var html = '<label for="' + id + '">' + esc(rotulo) + "</label>";
      if (/^Foto/.test(rotulo)) {
        // o campo de arquivo: um chip com o ícone pelo tipo do arquivo
        var nome = valor.replace(/^📎\s*/, "");
        var php = /\.php$/i.test(nome);
        html += '<div class="er-arquivo-campo' + (php ? " suspeito" : "") + '" id="' + id + '" tabindex="0" role="textbox" aria-readonly="true" aria-label="' + esc(rotulo + ": " + nome) + '">' +
          '<span class="er-arquivo-ico" aria-hidden="true">' + (php ? "📄" : "🖼️") + "</span>" +
          '<span class="er-arquivo-nome" data-digita="' + esc(nome) + '"></span>' +
          '<span class="er-arquivo-tam">' + (php ? "61 bytes" : "178 KB") + "</span></div>";
      } else if (/^Senha/.test(rotulo)) {
        html += '<div class="er-senha"><input id="' + id + '" type="password" readonly data-digita="' + esc(valor) + '">' +
          '<button type="button" class="er-olho" aria-label="Mostrar a senha" aria-pressed="false">👁</button></div>';
      } else if (/^Preço/.test(rotulo)) {
        html += '<div class="er-preco"><span aria-hidden="true">R$</span><input id="' + id + '" readonly inputmode="decimal" data-digita="' + esc(valor) + '"></div>';
      } else {
        var ataque = ehAtaque.test(valor);
        html += '<input id="' + id + '" readonly class="' + (ataque ? "ataque" : "") + '" data-digita="' + esc(valor) + '">';
        if (ataque) html += '<span class="er-campo-aviso">🦹 texto digitado pelo invasor</span>';
      }
      grupo.innerHTML = html;
      caixa.appendChild(grupo);
    });
    // o olhinho da senha
    caixa.querySelectorAll(".er-olho").forEach(function (b) {
      b.addEventListener("click", function () {
        var campo = b.previousElementSibling;
        var ver = campo.type === "password";
        campo.type = ver ? "text" : "password";
        b.setAttribute("aria-pressed", String(ver));
        b.setAttribute("aria-label", ver ? "Esconder a senha" : "Mostrar a senha");
      });
    });
    digitarCampos(caixa);
  }

  // os campos se preenchem sozinhos, como se alguém estivesse digitando
  var timerCampos = null;
  function digitarCampos(caixa) {
    clearTimeout(timerCampos);
    var alvos = Array.prototype.slice.call(caixa.querySelectorAll("[data-digita]"));
    function poe(el, texto) {
      if (el.tagName === "INPUT") el.value = texto;
      else el.textContent = texto;
    }
    if (pausado()) {
      alvos.forEach(function (el) { poe(el, el.dataset.digita); });
      return;
    }
    var a = 0;
    var c = 0;
    (function passo() {
      if (a >= alvos.length) return;
      var el = alvos[a];
      var texto = el.dataset.digita;
      c += texto.length > 40 ? 3 : 1;
      poe(el, texto.slice(0, c));
      if (c >= texto.length) { a++; c = 0; timerCampos = setTimeout(passo, 160); return; }
      timerCampos = setTimeout(passo, 28);
    })();
  }

  // o botão de enviar: rodinha e a barra azul de carregamento no alto do navegador
  function carregando(sim) {
    var barra = $("er-carregando");
    var botao = $("er-pedir");
    botao.classList.toggle("enviando", sim);
    if (!barra) return;
    barra.classList.remove("indo", "fim");
    void barra.offsetWidth;
    barra.classList.add(sim ? "indo" : "fim");
  }

  /* =====================================================================
     A VITRINE: as peças à venda e a surpresa de cada defeito
     ===================================================================== */
  // desenhos simples das peças (SVG), pela palavra no nome
  function desenho(nome) {
    var n = (nome || "").toLowerCase();
    var corpo;
    if (/memória|ram/.test(n)) {
      corpo = '<rect x="6" y="20" width="52" height="20" rx="2" fill="#1f7a4d"/><g fill="#0b1f15"><rect x="10" y="24" width="7" height="10"/><rect x="20" y="24" width="7" height="10"/><rect x="30" y="24" width="7" height="10"/><rect x="40" y="24" width="7" height="10"/></g><g fill="#d6b25e"><rect x="9" y="40" width="3" height="4"/><rect x="15" y="40" width="3" height="4"/><rect x="21" y="40" width="3" height="4"/><rect x="27" y="40" width="3" height="4"/><rect x="35" y="40" width="3" height="4"/><rect x="41" y="40" width="3" height="4"/><rect x="47" y="40" width="3" height="4"/><rect x="53" y="40" width="3" height="4"/></g>';
    } else if (/ssd/.test(n)) {
      corpo = '<rect x="10" y="14" width="44" height="34" rx="4" fill="#2b2f3a"/><rect x="16" y="20" width="32" height="14" rx="2" fill="#a5a8ff"/><text x="32" y="30.5" font-size="8" text-anchor="middle" fill="#121428" font-family="sans-serif" font-weight="700">SSD</text><circle cx="48" cy="42" r="2" fill="#5fd3a5"/>';
    } else if (/hd/.test(n)) {
      corpo = '<rect x="10" y="12" width="44" height="40" rx="4" fill="#8d96a0"/><circle cx="32" cy="30" r="13" fill="#c9d1d8"/><circle cx="32" cy="30" r="3" fill="#5b636b"/><path d="M32 30 L46 42" stroke="#2b2f3a" stroke-width="3" stroke-linecap="round"/>';
    } else if (/placa/.test(n)) {
      corpo = '<rect x="8" y="10" width="48" height="44" rx="3" fill="#14532d"/><rect x="24" y="22" width="16" height="16" fill="#0a0f0d" stroke="#d6b25e"/><path d="M12 16h10M12 48h14M42 16h10v10M40 48h12" stroke="#d6b25e" stroke-width="2" fill="none"/><rect x="12" y="26" width="6" height="18" fill="#39ff9e" opacity=".7"/>';
    } else if (/fonte/.test(n)) {
      corpo = '<rect x="8" y="14" width="48" height="36" rx="3" fill="#2b2f3a"/><circle cx="26" cy="32" r="12" fill="#121418" stroke="#75837b" stroke-width="2"/><path d="M26 22v20M16 32h20M19 25l14 14M33 25L19 39" stroke="#4a5650" stroke-width="2"/><rect x="42" y="22" width="9" height="6" fill="#f0a35e"/>';
    } else {
      corpo = '<rect x="16" y="16" width="32" height="32" rx="3" fill="#c9d1d8"/><rect x="22" y="22" width="20" height="20" rx="2" fill="#f0a35e"/><text x="32" y="35" font-size="7" text-anchor="middle" fill="#2b1500" font-family="sans-serif" font-weight="700">CPU</text><g stroke="#d6b25e" stroke-width="2"><path d="M20 12v4M26 12v4M32 12v4M38 12v4M44 12v4M20 48v4M26 48v4M32 48v4M38 48v4M44 48v4"/></g>';
    }
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' + corpo + "</svg>";
  }

  // as peças que já estão na vitrine (sempre as mesmas duas, diferentes da peça do teste)
  var ESTOQUE = [["Processador Ryzen 5", "899.00"], ["Fonte 500 W", "279.90"], ["SSD 480 GB", "229.90"]];
  function vizinhos(nome) {
    return ESTOQUE.filter(function (p) { return p[0] !== nome; }).slice(0, 2);
  }
  function cartao(nome, preco, extra, classe, foto) {
    return '<article class="er-card ' + (classe || "") + '">' +
      '<div class="er-card-foto">' + (foto || desenho(nome)) + "</div>" +
      '<h5 class="er-card-nome">' + (nome || "") + "</h5>" +
      '<p class="er-card-preco">' + preco + "</p>" + (extra || "") + "</article>";
  }
  function prateleira(itens, classe) {
    return '<div class="er-prateleira ' + (classe || "") + '">' + itens.join("") + "</div>";
  }

  function produtoDe(m) {
    var nome = m.nomeCena !== undefined ? m.nomeCena : (m.produto ? m.produto[0] : "");
    var preco = m.precoCena !== undefined ? m.precoCena : (m.produto ? m.produto[1] : "0");
    return { nome: nome, preco: preco };
  }

  // monta a cena da vitrine: cena = montada.cena (defeito) ou montada.cenaOk (consertado)
  function cena(m, c, consertado) {
    var palco = $("er-palco");
    if (!palco) return;
    var p = produtoDe(m);
    var base = vizinhos(p.nome).map(function (v) { return cartao(esc(v[0]), reais(v[1])); });
    var html = "";
    var nome = esc(p.nome);
    var preco = reais(p.preco || 0);
    var navegador = $("er-navegador");
    navegador.classList.remove("alarme", "megafone", "invadido");

    switch (c.estado || c.tipo) {
      case "ok":
        html = prateleira(base.concat(cartao(nome, preco, '<span class="er-selo novo">NOVO</span>', "chega brilha")));
        break;
      case "semNome":
        html = prateleira(base.concat(cartao('<span class="er-fantasma">sem nome?</span>', preco, '<span class="er-selo erro">???</span>', "chega torto")));
        break;
      case "gratis":
        html = prateleira(base.concat(cartao(nome, "R$ 0,00", '<span class="er-carimbo">GRÁTIS!</span><span class="er-moedas" aria-hidden="true">💸💸💸</span>', "chega")));
        break;
      case "negativo":
        html = prateleira(base.concat(cartao(nome, '<span class="er-negativo">R$ -5,00</span>', '<span class="er-carimbo">A LOJA PAGA VOCÊ?!</span>', "chega")));
        break;
      case "gigante":
        html = prateleira(base.concat(cartao('<span class="er-letreiro"><span>' + esc(p.nome) + "</span></span>", preco, '<span class="er-selo erro">' + p.nome.length + " letras</span>", "chega esticado")));
        break;
      case "virus":
        navegador.classList.add("alarme");
        html = prateleira(base.concat(cartao(nome, preco, '<span class="er-selo erro">⚠ arquivo suspeito</span>', "chega virus",
          '<div class="er-glitch" aria-hidden="true"><span>&lt;?php</span><span>system($_GET[\'cmd\']);</span><span>💀</span></div>')));
        break;
      case "recusada":
        html = prateleira(base.concat(cartao(nome, preco, '<span class="er-carimbo verde-nao">RECUSADA</span>', "chega")));
        break;
      case "semFoto":
        html = prateleira(base.concat(cartao(nome, preco, '<span class="er-selo">sem foto</span>', "chega",
          '<div class="er-sem-foto" aria-hidden="true">📷<small>foto padrão</small></div>')));
        break;
      case "barrado":
        html = prateleira(base) + '<div class="er-barreira" aria-hidden="true"><span class="er-escudo">🛡️</span>' +
          '<span class="er-card-voltando">' + (m.arquivoFoto ? "📄 " + esc(m.arquivoFoto) : "📝 ficha") + " ↩</span></div>";
        break;
      case "blindada":
        html = prateleira(base.concat(cartao(nome, preco, '<span class="er-selo novo">🛡️ 9f3a1c...jpg</span>', "chega brilha")));
        break;
      case "url":
        navegador.classList.add("megafone");
        html = prateleira(base) + '<div class="er-megafone" aria-hidden="true"><span class="er-mega-ico">📢</span><span class="onda"></span><span class="onda"></span><span class="onda"></span>' +
          "<b>A loja inteira ouviu os dados!</b></div>";
        break;
      case "vazou":
        navegador.classList.add("invadido");
        html = '<div class="er-vazou"><span class="er-fita">VAZOU · VAZOU · VAZOU · VAZOU · VAZOU</span>' +
          ["ana", "bruno", "carla"].map(function (f, i) {
            return '<code style="--i:' + i + '">' + f + "@minilojas.com · $2y$12$" + "Kq0vT7nW3eLr8pYc".slice(i, i + 9) + "...</code>";
          }).join("") + "</div>";
        break;
      case "apagou":
        navegador.classList.add("invadido");
        html = prateleira(base.concat(cartao(nome, preco)), "caindo") + '<p class="er-vazio">🫥 vitrine vazia</p>';
        break;
      case "invasor":
        navegador.classList.add("invadido");
        $("er-site-user").textContent = "Invasor 🦹";
        html = '<div class="er-boas-vindas mal"><span>🦹</span><b>Olá, Invasor!</b><small>área do funcionário</small></div>';
        break;
      case "protegido":
        html = prateleira(base.concat(cartao(nome, preco)), "blindada") + '<p class="er-protegido">🛡️ consulta preparada: o texto do invasor virou só texto</p>';
        break;
      case "varal":
        html = '<div class="er-varal" aria-hidden="true"><span class="er-corda"></span>' +
          '<span class="er-bilhete" style="--i:0">📎 ' + esc(m.funcionario || "") + "</span>" +
          '<span class="er-bilhete grande" style="--i:1">senha: ' + esc(m.senhaCena || "") + "</span>" +
          '<span class="er-bilhete" style="--i:2">👀 qualquer um lê</span></div>';
        break;
      case "hash":
        html = '<div class="er-varal limpo" aria-hidden="true"><span class="er-corda"></span>' +
          '<span class="er-bilhete" style="--i:0">📎 ' + esc(m.funcionario || "") + "</span>" +
          '<span class="er-bilhete grande embaralha" style="--i:1" data-hash="$2y$12$Kq0vT7nW3eLr8pYc1sQ9uO">$2y$12$Kq0vT7nW3eLr...</span>' +
          '<span class="er-bilhete" style="--i:2">🔐 ninguém lê</span></div>';
        break;
      case "negado":
        html = '<div class="er-boas-vindas negado"><span>🔒</span><b>E-mail ou senha errados.</b><small>' + esc(m.funcionario || "") + " digitou a senha certa...</small></div>";
        break;
      case "fraca":
        navegador.classList.add("invadido");
        html = '<div class="er-boas-vindas mal"><span class="er-cadeado-quebra">🔓</span><b>Senha 123? Adivinhei de primeira!</b><small>🦹 o invasor</small></div>';
        break;
      case "curta":
        html = '<div class="er-boas-vindas negado-ok"><span>🛡️</span><b>A senha precisa de 8 caracteres ou mais.</b><small>a senha 123 voltou para o balcão</small></div>';
        break;
      case "entrou":
        $("er-site-user").textContent = m.funcionario || "funcionário";
        html = '<div class="er-boas-vindas bem"><span>👋</span><b>Olá, ' + esc(m.funcionario || "") + "!</b><small>área do funcionário liberada</small></div>";
        break;
      default:
        html = prateleira(base);
    }
    palco.innerHTML = html;
    palco.classList.toggle("erro", !consertado);
    palco.classList.toggle("ok", !!consertado);
    embaralhar(palco);
  }

  // a vitrine antes do teste: só as peças que já estão à venda
  function vitrineInicial(m) {
    var palco = $("er-palco");
    if (!palco) return;
    palco.classList.remove("erro", "ok");
    $("er-navegador").classList.remove("alarme", "megafone", "invadido");
    $("er-site-user").textContent = "funcionário";
    var p = produtoDe(m);
    palco.innerHTML = prateleira(vizinhos(p.nome).map(function (v) { return cartao(esc(v[0]), reais(v[1])); }));
  }

  // o hash "se embaralhando" no bilhete
  function embaralhar(palco) {
    var el = palco.querySelector(".embaralha");
    if (!el || pausado()) return;
    var alvo = el.dataset.hash;
    var letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./$";
    var n = 0;
    var t = setInterval(function () {
      n++;
      el.textContent = alvo.split("").map(function (ch, i) {
        return i < n ? ch : letras[Math.floor(Math.random() * letras.length)];
      }).join("").slice(0, 22) + "...";
      if (n > alvo.length) clearInterval(t);
    }, 45);
  }

  // GET: os dados "aparecem digitados" na barra de endereço
  function digitarEndereco(texto) {
    var el = $("er-endereco");
    var q = texto.indexOf("?");
    if (q < 0 || pausado()) { el.textContent = texto; return; }
    var base = texto.slice(0, q);
    var resto = texto.slice(q);
    var c = 0;
    var t = setInterval(function () {
      c += 2;
      el.innerHTML = esc(base) + '<mark class="er-url-vaza">' + esc(resto.slice(0, c)) + "</mark>";
      if (c >= resto.length) clearInterval(t);
    }, 35);
  }

  /* =====================================================================
     CONFETE: a festa quando a fechadura abre
     ===================================================================== */
  function confete(muito) {
    if (pausado()) return;
    var caixa = document.createElement("div");
    caixa.className = "er-confete";
    caixa.setAttribute("aria-hidden", "true");
    var cores = ["#d6b25e", "#9fd0b7", "#a5a8ff", "#f0a35e", "#5fd3a5", "#ff8fb1", "#7fd4ff"];
    var total = muito ? 140 : 70;
    for (var i = 0; i < total; i++) {
      var s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.background = cores[i % cores.length];
      s.style.setProperty("--x", (Math.random() * 240 - 120) + "px");
      s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      s.style.animationDelay = Math.random() * .6 + "s";
      s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      if (i % 3 === 0) s.className = "fita";
      caixa.appendChild(s);
    }
    document.body.appendChild(caixa);
    setTimeout(function () { caixa.remove(); }, 4200);
  }

  // o pedaço do código de saída "voa" até o painel das fechaduras
  function voarPedaco(texto) {
    var alvo = $("er-codigo-saida");
    var de = $("er-aberta");
    if (!alvo || !de || pausado()) return;
    var a = de.getBoundingClientRect();
    var b = alvo.getBoundingClientRect();
    var voa = document.createElement("span");
    voa.className = "er-pedaco-voa";
    voa.textContent = texto;
    voa.setAttribute("aria-hidden", "true");
    voa.style.left = a.left + a.width / 2 + "px";
    voa.style.top = a.top + 30 + "px";
    voa.style.setProperty("--dx", (b.left + b.width / 2) - (a.left + a.width / 2) + "px");
    voa.style.setProperty("--dy", b.top - (a.top + 30) + "px");
    document.body.appendChild(voa);
    setTimeout(function () { voa.remove(); }, 1300);
  }

  return {
    falar: falar,
    campos: campos,
    carregando: carregando,
    cena: cena,
    vitrineInicial: vitrineInicial,
    digitarEndereco: digitarEndereco,
    confete: confete,
    voarPedaco: voarPedaco
  };
})();
