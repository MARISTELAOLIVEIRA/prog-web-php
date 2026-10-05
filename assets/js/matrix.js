/*
  matrix.js: chuva de 0 e 1 em verde neon atrás da abertura (o mesmo efeito do PyQuiz).
  versão 1 · 2026-10-05

  Uso: <canvas class="chuva-matrix" aria-hidden="true"></canvas> dentro da seção da abertura.
  Para quando a pessoa aperta "Pausar animações" (ou pede menos movimento no sistema).
*/
(function () {

  const tela = document.querySelector(".chuva-matrix");
  if (!tela) return;

  const contexto = tela.getContext("2d");
  const raiz = document.documentElement;
  const TAMANHO = 16;          // tamanho de cada 0 ou 1, em pixels
  const QUADROS_POR_SEGUNDO = 20;

  let gotas = [];
  let cor = "#39ff14";
  let rodando = false;
  let ultimo = 0;

  function pausado() {
    return raiz.classList.contains("pausado");
  }

  function atualizaCor() {
    // verde neon no escuro; verde mais fechado no claro, para não ofuscar
    cor = raiz.dataset.tema === "claro" ? "#0a8f4d" : "#39ff14";
  }

  function ajustaTamanho() {
    const caixa = tela.parentElement.getBoundingClientRect();
    tela.width = Math.round(caixa.width);
    tela.height = Math.round(caixa.height);
    const colunas = Math.floor(tela.width / TAMANHO);
    // cada coluna começa numa altura diferente, para a chuva não cair "em fila"
    gotas = Array.from({ length: colunas }, function () {
      return Math.floor(Math.random() * tela.height / TAMANHO);
    });
  }

  function desenha(agora) {
    if (!rodando) return;
    requestAnimationFrame(desenha);
    if (agora - ultimo < 1000 / QUADROS_POR_SEGUNDO) return;
    ultimo = agora;

    // apaga um pouco do quadro anterior, deixando o rastro (e o fundo transparente)
    contexto.globalCompositeOperation = "destination-out";
    contexto.fillStyle = "rgba(0, 0, 0, 0.09)";
    contexto.fillRect(0, 0, tela.width, tela.height);
    contexto.globalCompositeOperation = "source-over";

    contexto.fillStyle = cor;
    contexto.font = TAMANHO + "px 'Atkinson Hyperlegible Mono', monospace";

    gotas.forEach(function (linha, coluna) {
      const digito = Math.random() > 0.5 ? "1" : "0";
      contexto.fillText(digito, coluna * TAMANHO, linha * TAMANHO);
      // quando a gota passa do fim, às vezes volta para o topo
      if (linha * TAMANHO > tela.height && Math.random() > 0.975) {
        gotas[coluna] = 0;
      } else {
        gotas[coluna] = linha + 1;
      }
    });
  }

  function liga() {
    if (rodando || pausado()) return;
    rodando = true;
    requestAnimationFrame(desenha);
  }

  function desliga() {
    rodando = false;
    contexto.clearRect(0, 0, tela.width, tela.height);
  }

  atualizaCor();
  ajustaTamanho();
  liga();

  document.addEventListener("placa:movimento", function (evento) {
    if (evento.detail.pausado) {
      desliga();
    } else {
      liga();
    }
  });

  document.addEventListener("placa:tema", atualizaCor);

  let espera;
  window.addEventListener("resize", function () {
    clearTimeout(espera);
    espera = setTimeout(ajustaTamanho, 200);
  });

})();
