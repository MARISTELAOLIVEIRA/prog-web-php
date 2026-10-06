/*
  tutorial-php.js: mostra os arquivos de um projeto PHP como no VS Code (abas, números de linha e cores),
  com botão para copiar cada arquivo e a prévia do que o navegador mostra.
  versão 1 · 2026-10-06

  Uso, dentro de <div class="tutorial-projeto" data-pasta="cadastro-clientes">:
    <script type="text/plain" data-arquivo="cadastro.php" data-estado="novo">...código...</script>
    <script type="text/plain" data-previa="Primeira visita">...HTML que o PHP gerou...</script>
  data-estado: "novo", "mudou" ou "igual" (aparece como etiqueta na aba).
*/
(function () {
  "use strict";

  function escapar(texto) {
    return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // cores do tema escuro do VS Code, para PHP, HTML e CSS
  var PADRAO = new RegExp([
    "(<!--[\\s\\S]*?-->|\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)",    // 1 comentário
    "(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')",                            // 2 texto
    "(<\\?php|<\\?=|\\?>)",                                                          // 3 tags do PHP
    "(\\$[A-Za-z_]\\w*)",                                                            // 4 variável
    "(<\\/?[A-Za-z][\\w-]*|\\/?>)",                                                  // 5 tag HTML
    "\\b(function|if|else|elseif|foreach|endforeach|endif|as|return|require_once|require|try|catch|new|array|string)\\b", // 6 palavra
    "\\b([A-Za-z_]\\w*)(?=\\()",                                                     // 7 função
    "(-?\\b\\d+(?:\\.\\d+)?(?:px|%)?)"                                              // 8 número
  ].join("|"), "g");
  var CLASSES = ["com", "txt", "php", "var", "tag", "pal", "fun", "num"];

  function colorir(codigo) {
    var saida = "";
    var ultimo = 0;
    var achado;
    PADRAO.lastIndex = 0;
    while ((achado = PADRAO.exec(codigo)) !== null) {
      if (achado[0] === "") {
        PADRAO.lastIndex++;
        continue;
      }
      var grupo = 0;
      for (var i = 1; i <= 8; i++) {
        if (achado[i] !== undefined) {
          grupo = i;
          break;
        }
      }
      saida += escapar(codigo.slice(ultimo, achado.index));
      saida += '<span class="tp-' + CLASSES[grupo - 1] + '">' + escapar(achado[0]) + "</span>";
      ultimo = PADRAO.lastIndex;
    }
    return saida + escapar(codigo.slice(ultimo));
  }

  function limpar(texto) {
    return texto.replace(/^\n/, "").replace(/\s+$/, "") + "\n";
  }

  var contador = 0;

  function montar(caixa) {
    contador++;
    var id = "tp" + contador;
    var pasta = caixa.dataset.pasta || "projeto";
    var arquivos = [];
    var previas = [];
    caixa.querySelectorAll("script[type='text/plain']").forEach(function (s) {
      if (s.dataset.arquivo) {
        arquivos.push({ nome: s.dataset.arquivo, estado: s.dataset.estado || "", codigo: limpar(s.textContent) });
      } else if (s.dataset.previa) {
        previas.push({ nome: s.dataset.previa, html: s.textContent });
      }
    });

    var janela = document.createElement("div");
    janela.className = "tp-janela";
    janela.innerHTML =
      '<div class="tp-barra"><span class="semaforo" aria-hidden="true"><i></i><i></i><i></i></span><span class="tp-titulo"></span></div>' +
      '<div class="tp-abas" role="tablist" aria-label="Arquivos de ' + escapar(pasta) + '"></div>' +
      '<div class="tp-arquivos"></div>';
    var abas = janela.querySelector(".tp-abas");
    var paineis = janela.querySelector(".tp-arquivos");
    var titulo = janela.querySelector(".tp-titulo");

    arquivos.forEach(function (arq, n) {
      var aba = document.createElement("button");
      aba.type = "button";
      aba.className = "tp-aba";
      aba.id = id + "-aba-" + n;
      aba.setAttribute("role", "tab");
      aba.setAttribute("aria-controls", id + "-arq-" + n);
      aba.textContent = arq.nome;
      if (arq.estado) {
        var etq = document.createElement("span");
        etq.className = "tp-estado tp-" + arq.estado;
        etq.textContent = arq.estado;
        aba.appendChild(etq);
      }
      abas.appendChild(aba);

      var painel = document.createElement("div");
      painel.className = "tp-arquivo";
      painel.id = id + "-arq-" + n;
      painel.setAttribute("role", "tabpanel");
      painel.setAttribute("aria-labelledby", aba.id);
      var linhas = arq.codigo.replace(/\n$/, "").split("\n");
      var numeros = linhas.map(function (_, k) { return k + 1; }).join("\n");
      painel.innerHTML =
        '<div class="tp-codigo"><pre class="tp-linhas" aria-hidden="true">' + numeros + "</pre>" +
        '<pre class="tp-texto"><code>' + colorir(arq.codigo.replace(/\n$/, "")) + "</code></pre></div>" +
        '<div class="tp-acoes"><button type="button" class="tp-copiar">Copiar ' + escapar(arq.nome) + '</button><span class="tp-aviso" aria-live="polite"></span></div>';
      painel.querySelector(".tp-copiar").addEventListener("click", function () {
        var aviso = painel.querySelector(".tp-aviso");
        function ok() { aviso.textContent = "Copiado! Agora é colar no VS Code."; }
        function falhou() {
          var faixa = document.createRange();
          faixa.selectNodeContents(painel.querySelector(".tp-texto"));
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(faixa);
          aviso.textContent = "Código selecionado: aperte Ctrl + C (ou Cmd + C).";
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(arq.codigo).then(ok, falhou);
        } else {
          falhou();
        }
      });
      paineis.appendChild(painel);
      aba.addEventListener("click", function () { mostrar(n); });
    });

    abas.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var atual = Number(janela.dataset.ativo || 0);
      var proxima = (atual + (e.key === "ArrowRight" ? 1 : arquivos.length - 1)) % arquivos.length;
      mostrar(proxima);
      abas.children[proxima].focus();
    });

    function mostrar(n) {
      janela.dataset.ativo = n;
      arquivos.forEach(function (arq, k) {
        var ativa = k === n;
        abas.children[k].setAttribute("aria-selected", String(ativa));
        abas.children[k].tabIndex = ativa ? 0 : -1;
        paineis.children[k].hidden = !ativa;
      });
      titulo.textContent = arquivos[n].nome + " — " + pasta;
    }
    mostrar(0);
    caixa.appendChild(janela);

    if (previas.length) {
      var area = document.createElement("div");
      area.className = "tp-previa";
      area.innerHTML = '<p class="tp-rotulo">Veja no navegador <small>(o HTML de verdade que o PHP gerou)</small></p><div class="tp-botoes-previa"></div><iframe class="tp-tela" sandbox="allow-same-origin"></iframe>';
      var botoes = area.querySelector(".tp-botoes-previa");
      var tela = area.querySelector(".tp-tela");
      previas.forEach(function (p, k) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = p.nome;
        b.addEventListener("click", function () { mostrarPrevia(k); });
        botoes.appendChild(b);
      });
      function mostrarPrevia(k) {
        previas.forEach(function (_, j) { botoes.children[j].setAttribute("aria-pressed", String(j === k)); });
        tela.title = "Prévia: " + previas[k].nome;
        tela.srcdoc = previas[k].html;
      }
      mostrarPrevia(0);
      caixa.appendChild(area);
    }
  }

  document.querySelectorAll(".tutorial-projeto").forEach(montar);
})();
