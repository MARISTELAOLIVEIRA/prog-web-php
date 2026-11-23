/* ===================================================================
   interativos-php.js: as brincadeiras das aulas de PHP · versão 5 · 2026-11-23 (a analogia virou a loja: "O vendedor confere a foto")
   - [data-molde-cliente]: "Laboratório do molde" (aula 11). Cada clique fabrica um objeto Cliente,
     com os mesmos atributos e métodos da classe do tutorial (primeiroNome e validar).
   - [data-fabrica-classes]: "Fábrica de classes" (aula 11). Sorteia a classe que a dupla vai criar.
   - [data-planilha-loja]: "Quebra-cabeça da planilha" (aula 12). Cada coluna da planilha vai para uma
     tabela (clientes, produtos ou pedidos); 10 XP por acerto e bônus de primeira.
   - [data-qual-arquivo]: "Qual arquivo faz isso?" (Mini Cadastro). Cada <li data-certo="..."> ganha um botão
     por arquivo (data-opcoes no contêiner, separados por vírgula) e responde com acerto ou curto-circuito.
   - [data-garcom-foto]: "O vendedor confere a foto" (aula 14, upload). Chegam 6 arquivos; o aluno põe na vitrine
     ou barra. Foto aceita ganha nome novo e entra na vitrine com um pulso de luz.
   Os textos entram com textContent; as animações param com o botão de pausa.
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

  // ---------- O vendedor confere a foto (upload) ----------
  // cada arquivo: como chegou, o que tem dentro de verdade, e a resposta certa (pendurar ou barrar)
  const FOTOS = [
    { nome: "sensor-dht11.jpg", tamanho: "180 KB", dentro: "uma foto JPEG de verdade", icone: "🌡️", certo: "pendurar",
      porque: "Foto de verdade, do tipo combinado e pequena. O vendedor põe na vitrine com um nome novo, inventado por ele." },
    { nome: "foto.php", tamanho: "1 KB", dentro: "código PHP", icone: "📜", certo: "barrar",
      porque: "É um programa! Na pasta uploads, o Apache executaria esse arquivo: quem mandou passa a dar ordens ao servidor." },
    { nome: "bolo.jpg", tamanho: "2 KB", dentro: "código PHP", icone: "🎭", certo: "barrar",
      porque: "O nome mente: termina em .jpg, mas dentro é código. Por isso o getimagesize olha o conteúdo, não o nome." },
    { nome: "placa-esp32.png", tamanho: "6,8 MB", dentro: "uma foto PNG de verdade", icone: "🐘", certo: "barrar",
      porque: "É foto, mas passou de 2 MB. Foto gigante enche o disco e deixa a loja lenta: o vendedor pede uma menor." },
    { nome: "led-vermelho.webp", tamanho: "90 KB", dentro: "uma foto WEBP de verdade", icone: "🔴", certo: "pendurar",
      porque: "WEBP está na lista combinada (JPG, PNG ou WEBP) e é leve. Pode pôr na vitrine." },
    { nome: "manual-arduino.pdf", tamanho: "300 KB", dentro: "um documento PDF", icone: "📄", certo: "barrar",
      porque: "Não é foto. Vitrine de produto só aceita JPG, PNG ou WEBP." }
  ];
  function nomeNovo(nome) {
    let n = "";
    for (let i = 0; i < 16; i++) n += "0123456789abcdef"[Math.floor(Math.random() * 16)];
    return n + nome.slice(nome.lastIndexOf("."));
  }
  document.querySelectorAll("[data-garcom-foto]").forEach(function (caixa) {
    const placar = caixa.querySelector(".garcom-placar");
    const lista = el("ol", "garcom-fila");
    const cardapio = el("div", "garcom-cardapio");
    cardapio.appendChild(el("p", "garcom-rotulo", "🖼️ A vitrine da Mini Loja (pasta uploads)"));
    const penduradas = el("ul", "garcom-penduradas");
    cardapio.appendChild(penduradas);
    let acertos = 0;
    let respondidas = 0;

    FOTOS.forEach(function (f) {
      const li = el("li", "garcom-arquivo");
      const cab = el("div", "garcom-cab");
      cab.append(el("span", "garcom-icone", f.icone), el("code", "", f.nome), el("span", "garcom-tam", f.tamanho));
      const dentro = el("p", "garcom-dentro", "🔍 Dentro do arquivo: " + f.dentro);
      const botoes = el("div", "garcom-botoes");
      const aviso = el("p", "garcom-aviso");
      aviso.setAttribute("aria-live", "polite");
      [["pendurar", "🖼️ Pôr na vitrine"], ["barrar", "🚫 Barrar"]].forEach(function (par) {
        const b = el("button", "garcom-botao", par[1]);
        b.type = "button";
        b.addEventListener("click", function () {
          if (li.dataset.feito) return;
          li.dataset.feito = "1";
          respondidas++;
          const acertou = par[0] === f.certo;
          if (acertou) acertos++;
          li.classList.add(acertou ? "certo" : "errado");
          b.classList.add("escolhido");
          botoes.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
          aviso.textContent = (acertou ? "Compilou de primeira! " : "Curto-circuito. ") + f.porque;
          // pendurou uma foto boa? ela entra na vitrine com o nome novo
          if (par[0] === "pendurar" && f.certo === "pendurar") {
            const item = el("li", "garcom-foto" + (pausado() ? "" : " pulso"));
            item.append(el("span", "garcom-icone", f.icone), el("code", "", nomeNovo(f.nome)));
            penduradas.appendChild(item);
          }
          // pendurou um arquivo ruim? a vitrine mostra o estrago
          if (par[0] === "pendurar" && f.certo === "barrar") {
            const item = el("li", "garcom-foto estrago");
            item.append(el("span", "garcom-icone", "💥"), el("code", "", f.nome));
            penduradas.appendChild(item);
          }
          placar.textContent = acertos + " de " + FOTOS.length;
          if (respondidas === FOTOS.length) {
            caixa.appendChild(el("p", "garcom-fim", acertos === FOTOS.length
              ? "🏅 Vendedor de confiança! Nenhum bilhete disfarçado entrou na vitrine."
              : "Confira de novo os que ficaram vermelhos: o nome pode mentir, o conteúdo não."));
          }
        });
        botoes.appendChild(b);
      });
      li.append(cab, dentro, botoes, aviso);
      lista.appendChild(li);
    });
    caixa.append(lista, cardapio);
  });
})();
