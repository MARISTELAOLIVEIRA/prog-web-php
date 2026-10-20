/* ===================================================================
   interativos-php.js: as brincadeiras das aulas de PHP · versão 1 · 2026-10-20
   - [data-molde-cliente]: "Laboratório do molde" (aula 11). Cada clique fabrica um objeto Cliente,
     com os mesmos atributos e métodos da classe do tutorial (primeiroNome e validar).
   - [data-fabrica-classes]: "Fábrica de classes" (aula 11). Sorteia a classe que a dupla vai criar.
   Os textos entram com textContent; a animação do sorteio para com o botão de pausa.
   =================================================================== */
(function () {
  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  function pausado() {
    return document.documentElement.classList.contains("pausado");
  }

  // ---------- Laboratório do molde ----------
  // as mesmas regras do método validar() da classe Cliente
  function validar(nome, email) {
    const erros = [];
    if (nome.trim().length < 3) erros.push("O nome precisa de pelo menos 3 letras.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) erros.push("Digite um e-mail válido.");
    return erros;
  }

  function primeiroNome(nome) {
    return nome.trim().split(/\s+/)[0] || "";
  }

  document.querySelectorAll("[data-molde-cliente]").forEach(function (caixa) {
    const nome = caixa.querySelector('input[name="nome"]');
    const email = caixa.querySelector('input[name="email"]');
    const pecas = caixa.querySelector(".molde-pecas");
    let contador = 0;

    caixa.querySelector("button").addEventListener("click", function () {
      contador++;
      const n = nome.value;
      const e = email.value;
      const erros = validar(n, e);
      const peca = el("div", "peca");
      peca.appendChild(el("code", "peca-new", "$cliente" + contador + " = new Cliente('" + n + "', '" + e + "');"));
      const lista = el("dl");
      [["->nome", n], ["->email", e], ["->primeiroNome()", primeiroNome(n)]].forEach(function (par) {
        lista.appendChild(el("dt", "", par[0]));
        lista.appendChild(el("dd", "", par[1] || "(vazio)"));
      });
      lista.appendChild(el("dt", "", "->validar()"));
      const resultado = el("dd", erros.length ? "peca-erro" : "peca-ok",
        erros.length ? erros.join(" ") : "[ ] lista vazia: tudo certo!");
      lista.appendChild(resultado);
      peca.appendChild(lista);
      pecas.prepend(peca);
      // ficam as 4 peças mais novas
      while (pecas.children.length > 4) pecas.lastElementChild.remove();
    });
  });

  // ---------- Fábrica de classes ----------
  const CLASSES = [
    { nome: "Produto", atributos: "nome, preço e estoque", metodos: ["precoFormatado(): \"R$ 49,90\"", "temEstoque(): true ou false"] },
    { nome: "Pedido", atributos: "cliente, endereço e valor", metodos: ["freteGratis(): true acima de R$ 150", "resumo(): \"Pedido de Ana: R$ 180,00\""] },
    { nome: "Fornecedor", atributos: "nome, CNPJ e telefone", metodos: ["cnpjFormatado(): \"12.345.678/0001-90\"", "contato(): nome e telefone juntos"] }
  ];

  document.querySelectorAll("[data-fabrica-classes]").forEach(function (caixa) {
    const botao = caixa.querySelector("button");
    const saida = caixa.querySelector(".fabrica-resultado");
    let ultima = -1;

    function mostrar(i) {
      const c = CLASSES[i];
      saida.textContent = "";
      saida.appendChild(el("h3", "", "class " + c.nome));
      saida.appendChild(el("p", "", "Atributos: " + c.atributos + "."));
      const ul = el("ul");
      c.metodos.forEach(function (m) { ul.appendChild(el("li", "", m)); });
      saida.appendChild(el("p", "", "Dois métodos para começar (ou inventem os seus):"));
      saida.appendChild(ul);
      saida.appendChild(el("p", "fabrica-dica", "Criem " + c.nome + ".php, testem num teste-" + c.nome.toLowerCase() + ".php e troquem com outra dupla."));
    }

    botao.addEventListener("click", function () {
      let i;
      do { i = Math.floor(Math.random() * CLASSES.length); } while (i === ultima && CLASSES.length > 1);
      ultima = i;
      if (pausado()) { mostrar(i); return; }
      // roleta curta antes de parar na classe sorteada
      botao.disabled = true;
      let giros = 0;
      const roleta = setInterval(function () {
        saida.textContent = "";
        saida.appendChild(el("h3", "fabrica-girando", "class " + CLASSES[giros % CLASSES.length].nome + " ..."));
        giros++;
        if (giros > 8) {
          clearInterval(roleta);
          mostrar(i);
          botao.disabled = false;
        }
      }, 90);
    });
  });
})();
