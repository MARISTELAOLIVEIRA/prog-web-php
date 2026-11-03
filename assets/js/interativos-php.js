/* ===================================================================
   interativos-php.js: as brincadeiras das aulas de PHP · versão 3 · 2026-11-03 ("Qual arquivo faz isso?")
   - [data-molde-cliente]: "Laboratório do molde" (aula 11). Cada clique fabrica um objeto Cliente,
     com os mesmos atributos e métodos da classe do tutorial (primeiroNome e validar).
   - [data-fabrica-classes]: "Fábrica de classes" (aula 11). Sorteia a classe que a dupla vai criar.
   - [data-planilha-loja]: "Quebra-cabeça da planilha" (aula 12). Cada coluna da planilha vai para uma
     tabela (clientes, produtos ou pedidos); 10 XP por acerto e bônus de primeira.
   - [data-qual-arquivo]: "Qual arquivo faz isso?" (Mini Cadastro). Cada <li data-certo="..."> ganha um botão
     por arquivo (data-opcoes no contêiner, separados por vírgula) e responde com acerto ou curto-circuito.
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

  // ---------- Qual arquivo faz isso? ----------
  document.querySelectorAll("[data-qual-arquivo]").forEach(function (caixa) {
    const opcoes = caixa.dataset.opcoes.split(",");
    const placar = caixa.querySelector(".qual-placar");
    const itens = caixa.querySelectorAll("li[data-certo]");
    let acertos = 0;

    itens.forEach(function (item) {
      const botoes = el("span", "qual-botoes");
      const aviso = el("span", "qual-aviso");
      aviso.setAttribute("role", "status");
      opcoes.forEach(function (opcao) {
        const nome = opcao.trim();
        const b = el("button", "qual-opcao", nome);
        b.type = "button";
        b.addEventListener("click", function () {
          if (item.classList.contains("certo")) return;
          if (nome === item.dataset.certo) {
            item.classList.add("certo");
            b.classList.add("acertou");
            aviso.textContent = "Compilou de primeira!";
            acertos++;
            if (placar) placar.textContent = acertos + " de " + itens.length;
          } else {
            b.classList.add("errou");
            aviso.textContent = "Curto-circuito. Confere a trilha e tenta de novo.";
          }
        });
        botoes.appendChild(b);
      });
      item.appendChild(botoes);
      item.appendChild(aviso);
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
  // ---------- Quebra-cabeça da planilha ----------
  document.querySelectorAll("[data-planilha-loja]").forEach(function (caixa) {
    const colunas = Array.from(caixa.querySelectorAll("label[data-resposta]"));
    const saida = caixa.querySelector(".planilha-resultado");
    let tentativas = 0;

    caixa.querySelector("button").addEventListener("click", function () {
      tentativas++;
      let acertos = 0;
      colunas.forEach(function (rotulo) {
        const escolha = rotulo.querySelector("select").value;
        const certo = escolha === rotulo.dataset.resposta;
        if (certo) acertos++;
        rotulo.classList.toggle("certo", certo);
        rotulo.classList.toggle("errado", !certo && escolha !== "");
      });
      const total = colunas.length;
      let xp = acertos * 10;
      saida.textContent = "";
      if (acertos === total) {
        if (tentativas === 1) xp += 30;
        saida.appendChild(el("p", "planilha-xp", "🏅 Insígnia Normalizador(a) · " + xp + " XP" + (tentativas === 1 ? " (com 30 de bônus de primeira!)" : "")));
        saida.appendChild(el("p", "", "A Ana agora fica escrita uma vez só, em clientes. E a pergunta final: que coluna nova o pedido precisa para saber de quem é? (Resposta: cliente_id, a chave estrangeira. E produto_id, para o produto.)"));
      } else {
        saida.appendChild(el("p", "planilha-xp", acertos + " de " + total + " · " + xp + " XP"));
        saida.appendChild(el("p", "", "Pergunte de cada coluna: esse dado é da pessoa, da coisa vendida ou da compra? Ajuste as vermelhas e confira de novo."));
      }
    });
  });
})();
