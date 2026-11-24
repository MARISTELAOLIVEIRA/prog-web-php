/*
  fechaduras.js: as 5 fechaduras do escape room da Mini Loja (avaliação final de Web II, 24/11/2026).
  versão 4 · 2026-11-24 · + cena (a surpresa da vitrine) e as falas da Stela (guia); "pedido" virou ficha e teste

  Cada fechadura tem a história (nas duas versões), a analogia (3 estações) e um montar(sorteio), que
  devolve os arquivos com UM defeito, sorteado pelo e-mail do aluno (4 defeitos possíveis por fechadura).
  O código é o mesmo da Mini Loja das aulas 12 a 16 (tela.php = visão, cadastro.php e funcionario.php =
  controle, banco.php = modelo). O conserto é escrito (conserto.resposta) ou escolhido (conserto.opcoes).

  O que o montar devolve: arquivos, defeito {arquivo, linha}, conserto, pedido {campos, botao} (o formulário de teste),
  cena e cenaOk (a surpresa da vitrine, no palco.js), guia {comeco, pista} (as falas da Stela),
  falas {erro, ok} (os balões das 3 estações), sintoma e consertado {endereco, vitrine, comanda}, porque.
*/
window.FECHADURAS = (function () {
  "use strict";

  // peças de computador da Mini Loja: o produto que o aluno cadastra no teste
  var PRODUTOS = [
    ["Memória RAM 8 GB DDR4", "189.90"],
    ["SSD 480 GB", "229.90"],
    ["HD 1 TB", "299.90"],
    ["Placa-mãe B450", "549.90"],
    ["Fonte 500 W", "279.90"],
    ["Processador Ryzen 5", "899.00"]
  ];
  var FUNCIONARIOS = ["ana", "bruno", "carla", "davi", "elis", "fabio"];

  function reais(v) { return "R$ " + String(v).replace(".", ","); }
  function escolher(sorteio, lista) { return lista[sorteio(lista.length)]; }
  function printR(pares) {
    if (!pares.length) return "Array\n(\n)";
    return "Array\n(\n" + pares.map(function (p) { return "    [" + p[0] + "] => " + p[1]; }).join("\n") + "\n)";
  }
  // embaralha as opções do conserto e guarda onde ficou a certa (a primeira da lista é sempre a certa)
  function opcoes(sorteio, lista) {
    var ordem = lista.map(function (t, i) { return i; });
    for (var i = ordem.length - 1; i > 0; i--) {
      var j = sorteio(i + 1);
      var t = ordem[i];
      ordem[i] = ordem[j];
      ordem[j] = t;
    }
    return { opcoes: ordem.map(function (i) { return lista[i]; }), certa: ordem.indexOf(0) };
  }

  /* =====================================================================
     FECHADURA 1 · a ficha em branco (name e $_POST)
     ===================================================================== */
  var f1 = {
    id: "f1",
    guia: { comeco: "Fechadura 1! Aqui o assunto é a ficha que vai do balcão para o vendedor. Cadastre a peça e observe a vitrine com calma.", pista: "Dica de quem já caiu nessa: o rótulo da ficha (<code>name</code>), a chave do <code>$_POST</code> e o <code>method</code> do formulário precisam combinar. Compare com carinho." },
    titulo: "A ficha em branco",
    tema: "name e $_POST",
    historia: {
      invadida: "O invasor trocou <strong>uma única coisa</strong> no cadastro de produtos. Desde então, os produtos novos entram na vitrine estragados. O gerente da loja está desesperado.",
      preso: "O painel da porta mostra: <strong>CADASTRO DE PRODUTOS COM DEFEITO</strong>. A primeira fechadura só destrava quando um produto novo entrar inteiro na vitrine."
    },
    analogia: [
      { icone: "🖥️", lugar: "Balcão", arquivo: "tela.php", texto: "O funcionário preenche a ficha do produto no balcão. Cada linha da ficha tem um rótulo: o <code>name</code>." },
      { icone: "🧑‍💼", lugar: "Vendedor", arquivo: "cadastro.php", texto: "Ele lê a ficha pelo rótulo: <code>$_POST['nome']</code> procura a linha \"nome\"." },
      { icone: "📦", lugar: "Estoque", arquivo: "banco.php", texto: "Recebe o que o vendedor entregou e guarda na tabela <code>produtos</code>." }
    ],
    combinado: "O combinado da Mini Loja: o <code>name</code> do campo, a chave do <code>$_POST</code> e a coluna do banco têm <strong>o mesmo nome</strong>. E o formulário vai pelo correio fechado: <code>method=\"post\"</code>.",

    montar: function (sorteio) {
      var ERRADOS = { nome: ["nome_produto", "produto", "nmoe", "Nome"], preco: ["preço", "valor", "prec", "Preco"] };
      var tipo = sorteio(4);
      var campo = sorteio(2) === 0 ? "nome" : "preco";
      var errado = escolher(sorteio, ERRADOS[campo]);
      var produto = escolher(sorteio, PRODUTOS);

      var tela = [
        '<form method="post" action="cadastro.php">',
        '    <label for="nome">Nome do produto</label>',
        '    <input type="text" id="nome" name="nome" required>',
        '',
        '    <label for="preco">Preço</label>',
        '    <input type="number" id="preco" name="preco" step="0.01" required>',
        '',
        '    <button type="submit">Cadastrar</button>',
        '</form>'
      ];
      var cad = [
        "<?php",
        "// cadastro.php: o CONTROLE (o vendedor)",
        "require __DIR__ . '/banco.php';",
        "",
        "// o formulário foi enviado? grava o produto",
        "if ($_SERVER['REQUEST_METHOD'] === 'POST') {",
        "    $nome = trim($_POST['nome'] ?? '');",
        "    $preco = (float) ($_POST['preco'] ?? 0);",
        "    inserirProduto($nome, $preco);",
        "",
        "    header('Location: cadastro.php');",
        "    exit;",
        "}"
      ];
      var linhaTela = campo === "nome" ? 2 : 5;
      var linhaCad = campo === "nome" ? 6 : 7;
      var inicioInput = campo === "nome" ? '    <input type="text" id="nome" ' : '    <input type="number" id="preco" ';
      var fimInput = campo === "nome" ? " required>" : ' step="0.01" required>';

      var m = { produto: produto };
      var post;
      if (tipo === 0) {
        // o invasor mexeu no rótulo da ficha (name do campo)
        tela[linhaTela] = inicioInput + 'name="' + errado + '"' + fimInput;
        m.defeito = { arquivo: 0, linha: linhaTela };
        m.conserto = { antes: inicioInput + 'name="', depois: '"' + fimInput, resposta: campo, tamanho: 12 };
        post = postCom(campo, errado, produto);
        m.porque = "A ficha chegou com a linha \"" + errado + "\", mas o vendedor procura a linha \"" + campo + "\". Não achou, então usou o valor padrão do <code>??</code>.";
      } else if (tipo === 1) {
        // o invasor mexeu no vendedor: ele procura um rótulo que não existe
        cad[linhaCad] = campo === "nome"
          ? "    $nome = trim($_POST['" + errado + "'] ?? '');"
          : "    $preco = (float) ($_POST['" + errado + "'] ?? 0);";
        m.defeito = { arquivo: 1, linha: linhaCad };
        m.conserto = campo === "nome"
          ? { antes: "    $nome = trim($_POST['", depois: "'] ?? '');", resposta: campo, tamanho: 12 }
          : { antes: "    $preco = (float) ($_POST['", depois: "'] ?? 0);", resposta: campo, tamanho: 12 };
        post = postCom(campo, campo, produto);
        m.porque = "A ficha chegou certinha, com a linha \"" + campo + "\". Mas o vendedor procurou a linha \"" + errado + "\", que não existe, e usou o valor padrão do <code>??</code>.";
      } else if (tipo === 2) {
        // o campo ficou sem name: o navegador nem manda esse dado
        tela[linhaTela] = inicioInput.replace(/ $/, "") + fimInput;
        m.defeito = { arquivo: 0, linha: linhaTela };
        m.conserto = { antes: inicioInput, depois: fimInput, resposta: 'name="' + campo + '"', tamanho: 16, aceita: new RegExp("^name\\s*=\\s*([\"'])" + campo + "\\1$") };
        post = postCom(campo, null, produto);
        m.porque = "Campo sem <code>name</code> é linha da ficha sem rótulo: o navegador nem manda esse dado. O vendedor procurou \"" + campo + "\" e não achou nada.";
      } else {
        // o formulário foi de GET: a ficha foi gritada na loja, e o vendedor só atende POST
        tela[0] = '<form method="get" action="cadastro.php">';
        m.defeito = { arquivo: 0, linha: 0 };
        m.conserto = { antes: '<form method="', depois: '" action="cadastro.php">', resposta: "post", tamanho: 6, minusculas: true };
        post = [];
        m.porque = "Com <code>method=\"get\"</code>, a ficha vai gritada no endereço (todo mundo na loja ouve) e o <code>$_POST</code> chega vazio. O vendedor só atende quando a ficha vem por <code>POST</code>, então nada foi gravado.";
      }

      m.arquivos = [
        { nome: "tela.php", papel: "🖥️ o balcão (visão)", linhas: tela },
        { nome: "cadastro.php", papel: "🧑‍💼 o vendedor (controle)", linhas: cad }
      ];
      m.pedido = { campos: [["Nome do produto", produto[0]], ["Preço", produto[1]]], botao: "Cadastrar" };
      m.falas = {
        erro: tipo === 3
          ? ["Ficha recebida... em voz alta! 📢", "Gritado na loja? Eu só atendo POST! 🙉", "Não chegou nada. 💤"]
          : ["Ficha recebida! 📝", tipo === 1 ? "Procurei a linha do " + campo + " e não achei 🤔" : "Cadê a linha \"" + campo + "\" na ficha? 🤔", campo === "nome" ? "Um produto sem nome?! 😵" : "Preço zero?! 😵"],
        ok: ["Ficha recebida! 📝", "Ficha certinha! ✅", "Guardado no estoque! 📦"]
      };
      m.comandaTitulo = "🧾 A ficha que chegou ao vendedor (<code>$_POST</code>)";
      m.sintoma = {
        endereco: tipo === 3
          ? "localhost/minha-loja/cadastro.php?nome=" + encodeURIComponent(produto[0]).replace(/%20/g, "+") + "&preco=" + produto[1]
          : "localhost/minha-loja/cadastro.php",
        vitrine: tipo === 3
          ? "😶 Nada novo na vitrine. A página só recarregou, e os dados apareceram no endereço."
          : campo === "nome"
            ? "😬 Entrou um produto <strong>sem nome</strong> na vitrine: \"\" · " + reais(produto[1])
            : "😬 Entrou o " + produto[0] + " por <strong>R$ 0,00</strong>. De graça! O gerente vai desmaiar.",
        comanda: tipo === 3 ? printR([]) + "\n// vazia! os dados foram pelo endereço, no $_GET" : printR(post)
      };
      m.consertado = {
        endereco: "localhost/minha-loja/cadastro.php",
        vitrine: "✅ " + produto[0] + " · " + reais(produto[1]) + " entrou na vitrine inteirinho.",
        comanda: printR([["nome", produto[0]], ["preco", produto[1]]])
      };
      // a surpresa na vitrine (palco.js)
      m.cena = tipo === 3 ? { tipo: "url" } : { tipo: "card", estado: campo === "nome" ? "semNome" : "gratis" };
      m.cenaOk = { tipo: "card", estado: "ok" };
      return m;
    }
  };

  // a ficha ($_POST) que chega ao vendedor: o rótulo do campo muda, ou some (null)
  function postCom(campo, rotulo, produto) {
    var post = [];
    if (campo === "nome") {
      if (rotulo) post.push([rotulo, produto[0]]);
      post.push(["preco", produto[1]]);
    } else {
      post.push(["nome", produto[0]]);
      if (rotulo) post.push([rotulo, produto[1]]);
    }
    return post;
  }

  /* =====================================================================
     FECHADURA 2 · a foto disfarçada (upload seguro)
     ===================================================================== */
  var f2 = {
    id: "f2",
    guia: { comeco: "Fechadura 2: a porta por onde o invasor entrou. Envie a foto e repare no que o vendedor faz com ela.", pista: "Pense como segurança: o nome do arquivo pode mentir. Onde o PHP deve olhar para saber se é foto de verdade? E com que nome ela é guardada?" },
    titulo: "A foto disfarçada",
    tema: "upload seguro",
    historia: {
      invadida: "Foi por aqui que o invasor entrou: pela <strong>foto do produto</strong>. Ele mexeu no vendedor que confere as fotos, e agora o depósito da loja guarda coisa que não devia.",
      preso: "A segunda fechadura tem uma câmera. Ela só destrava quando o upload de fotos da Mini Loja voltar a ser <strong>seguro</strong>: foto de verdade entra, disfarce fica do lado de fora."
    },
    analogia: [
      { icone: "🖥️", lugar: "Balcão", arquivo: "tela.php", texto: "O funcionário envia a foto da peça. Para levar arquivo, o formulário precisa do <code>enctype</code>." },
      { icone: "🧑‍💼", lugar: "Vendedor", arquivo: "cadastro.php", texto: "Confere a foto antes de pôr na vitrine: tamanho, se é foto mesmo (<code>getimagesize</code>) e dá um nome novo." },
      { icone: "🗄️", lugar: "Depósito", arquivo: "uploads/", texto: "Guarda as fotos. Um arquivo <code>.php</code> aqui dentro vira uma porta aberta para o invasor." }
    ],
    combinado: "O combinado da Mini Loja: o nome do arquivo e o <code>accept</code> podem mentir; o conteúdo, não. O vendedor olha <strong>dentro</strong> do arquivo (<code>getimagesize</code> no <code>tmp_name</code>), aceita até 2 MB e guarda com um <strong>nome sorteado</strong> pelo sistema.",

    montar: function (sorteio) {
      var tipo = sorteio(4);
      var produto = escolher(sorteio, PRODUTOS);
      var tela = [
        '<form method="post" action="cadastro.php" enctype="multipart/form-data">',
        '    <label for="nome">Nome do produto</label>',
        '    <input type="text" id="nome" name="nome" required>',
        '',
        '    <label for="imagem">Foto (JPG, PNG ou WEBP, até 2 MB)</label>',
        '    <input type="file" id="imagem" name="imagem" accept="image/*">',
        '',
        '    <button type="submit">Cadastrar</button>',
        '</form>'
      ];
      var cad = [
        "// o vendedor confere a foto antes de pôr no catálogo",
        "function conferirImagem(array $arquivo): string",
        "{",
        "    if ($arquivo['size'] > 2 * 1024 * 1024) {",
        "        return 'A foto passou de 2 MB. Diminua e tente de novo.';",
        "    }",
        "    // getimagesize olha DENTRO do arquivo; o nome pode mentir, o conteúdo não",
        "    $info = getimagesize($arquivo['tmp_name']);",
        "    if ($info === false || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP])) {",
        "        return 'Isso não é uma foto JPG, PNG ou WEBP.';",
        "    }",
        "    return '';",
        "}",
        "",
        "// guarda a foto com um nome inventado pelo sistema",
        "function guardarImagem(array $arquivo): string",
        "{",
        "    $extensoes = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];",
        "    $tipo = getimagesize($arquivo['tmp_name'])[2];",
        "    $nome = bin2hex(random_bytes(8)) . '.' . $extensoes[$tipo];",
        "    move_uploaded_file($arquivo['tmp_name'], __DIR__ . '/uploads/' . $nome);",
        "    return $nome;",
        "}"
      ];
      var m = { produto: produto };
      var arquivo;
      var sorteado = "9f3a1c07be42d6e5";
      if (tipo === 0) {
        // || virou &&: o "não é imagem" nunca dispara
        arquivo = escolher(sorteio, ["lanterna.php", "promo.php", "cupom.php"]);
        cad[8] = "    if ($info === false && !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP])) {";
        m.defeito = { arquivo: 1, linha: 8 };
        m.conserto = { antes: "    if ($info === false ", depois: " !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP])) {", resposta: "||", tamanho: 4, aceita: /^(\|\||or)$/i };
        m.files = [["name", arquivo], ["type", "application/x-php"], ["tmp_name", "/tmp/phpK7a2Qd"], ["error", "0"], ["size", "61"]];
        m.sintoma = "🧨 O vendedor aceitou <strong>" + arquivo + "</strong>, que nem foto é: é um texto com código PHP. A vitrine mostra uma imagem quebrada, e o código do invasor ficou guardado no depósito.";
        m.porque = "Com <code>&amp;&amp;</code>, o vendedor só recusava se as duas coisas fossem verdade ao mesmo tempo. Com <code>||</code>, basta uma: não é imagem <strong>ou</strong> não é JPG/PNG/WEBP, fica do lado de fora.";
        m.falaGarcom = "Não é foto... mas passou? 🤨";
        m.falaDespensa = "Guardei um arquivo esquisito 😰";
      } else if (tipo === 1) {
        // o vendedor guarda com o nome que veio do cliente: a selfie.php vira porta aberta
        arquivo = escolher(sorteio, ["selfie.php", "avatar.php", "foto-perfil.php"]);
        cad[19] = "    $nome = $arquivo['name'];";
        m.defeito = { arquivo: 1, linha: 19 };
        m.conserto = { antes: "    $nome = ", depois: " . '.' . $extensoes[$tipo];", resposta: "bin2hex(random_bytes(8))", tamanho: 24, semEspacos: true };
        m.files = [["name", arquivo], ["type", "image/jpeg"], ["tmp_name", "/tmp/phpR2m9Xc"], ["error", "0"], ["size", "48213"]];
        m.sintoma = "🧨 Era uma foto JPEG de verdade, com código PHP escondido dentro. O vendedor guardou com o nome que o invasor escolheu: <strong>uploads/" + arquivo + "</strong>. Quem abrir esse endereço roda o código dele.";
        m.porque = "O <code>getimagesize</code> até viu que era foto, mas o nome veio do computador do invasor. Com o nome sorteado (<code>bin2hex(random_bytes(8))</code>) e a extensão escolhida pelo sistema, a foto vira <code>" + sorteado + ".jpg</code> e nunca roda como PHP.";
        m.falaGarcom = "É foto, pode passar 📸";
        m.falaDespensa = "Guardei " + arquivo + " 😰";
      } else if (tipo === 2) {
        // getimagesize olhando o nome em vez do arquivo: toda foto de verdade é recusada
        arquivo = escolher(sorteio, ["memoria-ram.jpg", "ssd.png", "placa-mae.webp"]);
        cad[7] = "    $info = getimagesize($arquivo['name']);";
        m.defeito = { arquivo: 1, linha: 7 };
        m.conserto = { antes: "    $info = getimagesize($arquivo['", depois: "']);", resposta: "tmp_name", tamanho: 10 };
        m.files = [["name", arquivo], ["type", "image/jpeg"], ["tmp_name", "/tmp/phpB8w1Lp"], ["error", "0"], ["size", "182340"]];
        m.sintoma = "😤 A foto <strong>" + arquivo + "</strong> é de verdade, mas a tela respondeu: \"Isso não é uma foto JPG, PNG ou WEBP.\" Nenhuma foto entra mais na loja.";
        m.porque = "O <code>name</code> é só o nome que veio do computador do cliente; no servidor não existe arquivo com esse nome. A foto que chegou está guardada no <code>tmp_name</code>, e é lá que o <code>getimagesize</code> tem que olhar.";
        m.falaGarcom = "Procurei a foto e não achei 🤔";
        m.falaDespensa = "Nada chegou aqui 💤";
      } else {
        // o formulário sem enctype: a foto nem sai do balcão
        arquivo = escolher(sorteio, ["memoria-ram.jpg", "ssd.png", "placa-mae.webp"]);
        tela[0] = '<form method="post" action="cadastro.php">';
        m.defeito = { arquivo: 0, linha: 0 };
        m.conserto = { antes: '<form method="post" action="cadastro.php" ', depois: ">", resposta: 'enctype="multipart/form-data"', tamanho: 28, aceita: /^enctype\s*=\s*(["'])multipart\/form-data\1$/i };
        m.files = null;
        m.sintoma = "😶 O produto entrou na vitrine <strong>sem a foto</strong> (apareceu a foto padrão). A foto " + arquivo + " nem saiu do computador do cliente.";
        m.porque = "Sem <code>enctype=\"multipart/form-data\"</code>, o formulário só leva texto: o <code>$_FILES</code> chega vazio. É como mandar a foto da peça numa ficha de papel: não cabe.";
        m.falaGarcom = "Foto? Que foto? 🤷";
        m.falaDespensa = "Nada chegou aqui 💤";
      }
      m.arquivos = [
        { nome: "tela.php", papel: "🖥️ o balcão (visão)", linhas: tela },
        { nome: "cadastro.php", papel: "🧑‍💼 o vendedor (controle)", linhas: cad }
      ];
      m.pedido = { campos: [["Nome do produto", produto[0]], ["Foto", "📎 " + arquivo]], botao: "Cadastrar" };
      m.falas = {
        erro: ["Foto entregue! 📎", m.falaGarcom, m.falaDespensa],
        ok: tipo === 0 || tipo === 1
          ? ["Foto entregue! 📎", "Disfarce barrado na porta! 🛑", "Nada estranho aqui ✅"]
          : ["Foto entregue! 📎", "Foto conferida! ✅", "Guardei como " + sorteado.slice(0, 6) + "... 📸"]
      };
      m.comandaTitulo = "📎 O arquivo que chegou ao vendedor (<code>$_FILES['imagem']</code>)";
      m.sintoma = {
        endereco: "localhost/minha-loja/cadastro.php",
        vitrine: m.sintoma,
        comanda: m.files ? printR(m.files) : printR([]) + "\n// vazio! sem o enctype, a foto não vem"
      };
      m.consertado = {
        endereco: "localhost/minha-loja/cadastro.php",
        vitrine: tipo === 0 || tipo === 1
          ? "🛑 \"Isso não é uma foto JPG, PNG ou WEBP.\" (ou guardada como " + sorteado + ".jpg): o disfarce não entra mais."
          : "✅ " + produto[0] + " entrou na vitrine com a foto, guardada como <code>uploads/" + sorteado + ".jpg</code>.",
        comanda: tipo === 3 ? printR([["name", arquivo], ["type", "image/jpeg"], ["tmp_name", "/tmp/phpB8w1Lp"], ["error", "0"], ["size", "182340"]]) : printR(m.files)
      };
      if (tipo === 1) {
        m.consertado.vitrine = "🛡️ A foto entrou como <code>uploads/" + sorteado + ".jpg</code>. O código escondido virou só uma foto, que nunca roda.";
      } else if (tipo === 0) {
        m.consertado.vitrine = "🛑 \"Isso não é uma foto JPG, PNG ou WEBP.\" O " + arquivo + " ficou do lado de fora.";
      }
      m.arquivoFoto = arquivo;
      m.cena = { tipo: "card", estado: tipo <= 1 ? "virus" : tipo === 2 ? "recusada" : "semFoto" };
      m.cenaOk = { tipo: "card", estado: tipo === 0 ? "barrado" : tipo === 1 ? "blindada" : "ok" };
      return m;
    }
  };

  /* =====================================================================
     FECHADURA 3 · o vendedor distraído (validação)
     ===================================================================== */
  var f3 = {
    id: "f3",
    guia: { comeco: "Fechadura 3: o vendedor anda distraído. O invasor apagou as travas do HTML. Teste e veja o que passa.", pista: "Leia as condições do <code>if</code> devagar, uma por uma, como se você fosse o PHP. Qual delas deixa passar o que não devia?" },
    titulo: "O vendedor distraído",
    tema: "validação",
    historia: {
      invadida: "O invasor descobriu que o vendedor <strong>não confere direito</strong> o que leva para o estoque. Agora entra qualquer coisa na vitrine, e o gerente acha produtos absurdos todo dia de manhã.",
      preso: "Terceira fechadura: o teclado da porta aceita qualquer coisa que você digitar, até besteira. Ela só abre quando o vendedor da Mini Loja voltar a <strong>conferir as fichas</strong>."
    },
    analogia: [
      { icone: "🖥️", lugar: "Balcão", arquivo: "tela.php", texto: "Quem preenche pode escrever qualquer coisa na ficha. O <code>required</code> do HTML some com um clique no DevTools." },
      { icone: "🧑‍💼", lugar: "Vendedor", arquivo: "cadastro.php", texto: "Confere antes de levar: nome vazio, nome gigante e preço zero ou negativo voltam para o balcão, com um aviso." },
      { icone: "📦", lugar: "Estoque", arquivo: "banco.php", texto: "Só guarda o que o vendedor aprovou (<code>$erro === ''</code>)." }
    ],
    combinado: "O combinado da Mini Loja: quem valida de verdade é o <strong>PHP</strong>, no servidor. O HTML ajuda o cliente, mas qualquer um desliga. Nome não pode ser vazio nem passar de 60 letras; preço tem que ser <strong>maior que zero</strong>.",

    montar: function (sorteio) {
      var tipo = sorteio(4);
      var produto = escolher(sorteio, PRODUTOS);
      var cad = [
        "if ($_SERVER['REQUEST_METHOD'] === 'POST') {",
        "    $nome = trim($_POST['nome'] ?? '');",
        "    $preco = (float) ($_POST['preco'] ?? 0);",
        "    $erro = '';",
        "",
        "    // o vendedor confere a ficha antes de levar para o estoque",
        "    if ($nome === '') {",
        "        $erro = 'Escreva o nome do produto.';",
        "    } elseif (mb_strlen($nome) > 60) {",
        "        $erro = 'O nome pode ter até 60 letras.';",
        "    } elseif ($preco <= 0) {",
        "        $erro = 'O preço precisa ser maior que zero.';",
        "    }",
        "",
        "    // só vai para o estoque se o vendedor não achou problema",
        "    if ($erro === '') {",
        "        inserirProduto($nome, $preco, '');",
        "        header('Location: cadastro.php');",
        "        exit;",
        "    }",
        "}"
      ];
      var tela = [
        '<form method="post" action="cadastro.php">',
        '    <input type="text" name="nome" maxlength="60" required>',
        '    <input type="number" name="preco" min="0.01" step="0.01" required>',
        '    <button type="submit">Cadastrar</button>',
        '</form>',
        '',
        '<?php if ($erro !== \'\'): ?>',
        '    <p class="aviso"><?= htmlspecialchars($erro) ?></p>',
        '<?php endif; ?>'
      ];
      var m = { produto: produto };
      var nome = produto[0];
      var preco = produto[1];
      if (tipo === 0) {
        preco = "0";
        cad[10] = "    } elseif ($preco < 0) {";
        m.defeito = { arquivo: 1, linha: 10 };
        m.conserto = { antes: "    } elseif ($preco ", depois: " 0) {", resposta: "<=", tamanho: 4 };
        m.vitrineErro = "😬 Entrou o " + nome + " por <strong>R$ 0,00</strong>. O invasor encheu o carrinho de graça.";
        m.aviso = "O preço precisa ser maior que zero.";
        m.porque = "Com <code>&lt; 0</code>, o zero passava: zero não é menor que zero. Com <code>&lt;= 0</code>, o vendedor barra o zero e os negativos.";
        m.falaGarcom = "Zero é... um número, né? 🤷";
      } else if (tipo === 1) {
        nome = "      ";
        cad[6] = "    if ($nome === ' ') {";
        m.defeito = { arquivo: 1, linha: 6 };
        m.conserto = { antes: "    if ($nome === ", depois: ") {", resposta: "''", tamanho: 4, aceita: /^(''|"")$/ };
        m.vitrineErro = "😬 Entrou um produto <strong>sem nome</strong> na vitrine, só com o preço: " + reais(preco) + ".";
        m.aviso = "Escreva o nome do produto.";
        m.porque = "O <code>trim</code> tira os espaços, e o nome vira <code>''</code> (vazio). O vendedor comparava com <code>' '</code> (um espaço), que nunca acontece depois do <code>trim</code>.";
        m.falaGarcom = "Nome em branco? Passa! 🫠";
      } else if (tipo === 2) {
        nome = (produto[0] + " ").repeat(30).trim();
        cad[8] = "    } elseif (mb_strlen($nome) > 6000) {";
        m.defeito = { arquivo: 1, linha: 8 };
        m.conserto = { antes: "    } elseif (mb_strlen($nome) > ", depois: ") {", resposta: "60", tamanho: 6 };
        m.vitrineErro = "😵 Entrou um produto com um nome de <strong>" + nome.length + " letras</strong>. A vitrine quebrou: o nome atravessa a tela inteira.";
        m.aviso = "O nome pode ter até 60 letras.";
        m.porque = "O <code>maxlength=\"60\"</code> do HTML some com um clique no DevTools. Quem segura de verdade é o PHP, com o mesmo limite: <code>mb_strlen($nome) &gt; 60</code>.";
        m.falaGarcom = "Que nome comprido... mas cabe! 📜";
      } else {
        preco = "-5";
        cad[15] = "    if ($erro !== '') {";
        m.defeito = { arquivo: 1, linha: 15 };
        m.conserto = { antes: "    if ($erro ", depois: " '') {", resposta: "===", tamanho: 5 };
        m.vitrineErro = "🤯 O aviso apareceu (\"O preço precisa ser maior que zero.\"), mas o " + nome + " por <strong>R$ -5,00</strong> entrou na vitrine assim mesmo! E as fichas certas não entram mais.";
        m.aviso = "O preço precisa ser maior que zero.";
        m.porque = "Com <code>!==</code>, a lógica ficou de ponta-cabeça: só ia para o estoque a ficha <strong>com</strong> problema. Com <code>=== ''</code>, vai só quando o vendedor não achou erro nenhum.";
        m.falaGarcom = "Achei um problema! Leva pro estoque! 🙃";
      }
      m.arquivos = [
        { nome: "tela.php", papel: "🖥️ o balcão (visão)", linhas: tela },
        { nome: "cadastro.php", papel: "🧑‍💼 o vendedor (controle)", linhas: cad }
      ];
      var mostraNome = nome.trim() === "" ? "(só espaços)" : (nome.length > 40 ? nome.slice(0, 37) + "..." : nome);
      m.pedido = { campos: [["Nome do produto", mostraNome], ["Preço", preco]], botao: "Cadastrar", nota: "O invasor apagou o <code>required</code>, o <code>maxlength</code> e o <code>min</code> pelo DevTools antes de enviar." };
      m.falas = {
        erro: ["Ficha recebida! 📝", m.falaGarcom, "Guardei... isso?! 😵"],
        ok: ["Ficha recebida! 📝", "Essa ficha volta pro balcão! 🛑", "Ainda bem que nem chegou 😌"]
      };
      m.comandaTitulo = "🧾 A ficha que chegou ao vendedor (<code>$_POST</code>)";
      var nomeComanda = nome.trim() === "" ? "\"" + nome + "\"" : (nome.length > 40 ? nome.slice(0, 37) + "... (" + nome.length + " letras)" : nome);
      m.sintoma = { endereco: "localhost/minha-loja/cadastro.php", vitrine: m.vitrineErro, comanda: printR([["nome", nomeComanda], ["preco", preco]]) };
      m.consertado = {
        endereco: "localhost/minha-loja/cadastro.php",
        vitrine: "🛑 A tela mostrou o aviso <strong>\"" + m.aviso + "\"</strong> e nada entrou na vitrine. Vendedor atento!",
        comanda: m.sintoma.comanda
      };
      m.nomeCena = nome;
      m.precoCena = preco;
      m.cena = { tipo: "card", estado: ["gratis", "semNome", "gigante", "negativo"][tipo] };
      m.cenaOk = { tipo: "card", estado: "barrado" };
      return m;
    }
  };

  /* =====================================================================
     FECHADURA 4 · a ordem adulterada (consulta preparada)
     ===================================================================== */
  var f4 = {
    id: "f4",
    guia: { comeco: "Fechadura 4: agora é o banco de dados. Veja o que o invasor escreveu no formulário. É ataque de gente grande!", pista: "Procure a linha em que o texto do cliente é <strong>colado</strong> dentro do SQL. É ali que a ordem pode ser adulterada." },
    titulo: "A ordem adulterada",
    tema: "consulta preparada",
    historia: {
      invadida: "Agora o invasor foi direto no <strong>estoque</strong>: trocou uma consulta preparada por SQL montado com o texto do cliente. Com isso, ele fala com o banco de dados como se fosse da casa.",
      preso: "A quarta fechadura está ligada ao banco de dados da Mini Loja. Enquanto existir uma consulta que <strong>mistura o texto do cliente com o SQL</strong>, ela não abre."
    },
    analogia: [
      { icone: "🧑‍💼", lugar: "Vendedor", arquivo: "cadastro.php", texto: "Leva até o estoque o que o cliente escreveu: uma busca, um id, um e-mail." },
      { icone: "📦", lugar: "Estoquista", arquivo: "banco.php", texto: "Segue a ordem de busca (o SQL). Com <code>prepare</code>, o que o cliente escreveu é só o <strong>item procurado</strong>, nunca uma ordem nova." },
      { icone: "📒", lugar: "Caderno", arquivo: "minha-loja.db", texto: "Produtos e funcionários, com os e-mails e os hashes das senhas." }
    ],
    combinado: "O combinado da Mini Loja: dado do cliente <strong>nunca</strong> entra colado no SQL. A ordem tem um espaço em branco (<code>:busca</code>, <code>:id</code>, <code>:email</code>) e o dado vai separado, no <code>execute</code>. O <code>query()</code> só serve para SQL sem nada do cliente.",

    montar: function (sorteio) {
      var tipo = sorteio(4);
      var produto = escolher(sorteio, PRODUTOS);
      var func = escolher(sorteio, FUNCIONARIOS);
      var cab = [
        "<?php",
        "// banco.php: o MODELO (o estoque). Todo o SQL fica aqui.",
        "",
        "// lista a vitrine: sem nada do cliente, o query() serve",
        "function listarProdutos(): array",
        "{",
        "    $pdo = conectar();",
        "    $stmt = $pdo->query('SELECT * FROM produtos ORDER BY nome');",
        "    return $stmt->fetchAll(PDO::FETCH_ASSOC);",
        "}",
        "",
        "// grava um produto novo",
        "function inserirProduto(string $nome, float $preco, string $imagem): void",
        "{",
        "    $pdo = conectar();",
        "    $stmt = $pdo->prepare('INSERT INTO produtos (nome, preco, imagem) VALUES (:nome, :preco, :imagem)');",
        "    $stmt->execute([':nome' => $nome, ':preco' => $preco, ':imagem' => $imagem]);",
        "}",
        ""
      ];
      var v;
      var vaza = func + "@minilojas.com · $2y$12$Kq0vT7...";
      if (tipo === 0) {
        v = {
          comentario: "// busca na vitrine pelo pedaço do nome",
          assinatura: "function buscarProdutos(string $busca): array",
          ruim: "    $stmt = $pdo->query(\"SELECT * FROM produtos WHERE nome LIKE '%$busca%'\");",
          resto: ["    return $stmt->fetchAll(PDO::FETCH_ASSOC);"],
          certa: "$stmt = $pdo->prepare('SELECT * FROM produtos WHERE nome LIKE :busca');\n$stmt->execute([':busca' => '%' . $busca . '%']);",
          erradas: [
            "$stmt = $pdo->prepare(\"SELECT * FROM produtos WHERE nome LIKE '%$busca%'\");\n$stmt->execute();",
            "$busca = str_replace(\"'\", '', $busca);\n$stmt = $pdo->query(\"SELECT * FROM produtos WHERE nome LIKE '%$busca%'\");",
            "$stmt = $pdo->query(\"SELECT * FROM produtos WHERE nome LIKE '%\" . trim($busca) . \"%'\");"
          ],
          campos: [["Buscar na vitrine", "x' UNION SELECT id, email, senha, nome FROM funcionarios --"]],
          botao: "Buscar",
          dado: ["busca", "x' UNION SELECT id, email, senha, nome FROM funcionarios --"],
          vitrine: "😱 A busca mostrou, no lugar dos produtos: <strong>" + vaza + "</strong>. Os e-mails e os hashes das senhas dos funcionários vazaram na vitrine!",
          ok: "✅ A busca procurou um produto com o nome <code>x' UNION SELECT...</code> e não achou nada. O ataque virou só um texto esquisito.",
          porque: "O texto do cliente foi colado dentro do SQL, então o <code>' UNION SELECT</code> virou parte da ordem e o banco obedeceu. Com <code>prepare</code> e <code>:busca</code>, o texto vai separado e é só o item procurado: o banco procura um produto com esse nome estranho."
        };
      } else if (tipo === 1) {
        v = {
          comentario: "// apaga o produto pelo id",
          assinatura: "function excluirProduto($id): void",
          ruim: "    $pdo->exec('DELETE FROM produtos WHERE id = ' . $id);",
          resto: [],
          certa: "$stmt = $pdo->prepare('DELETE FROM produtos WHERE id = :id');\n$stmt->execute([':id' => $id]);",
          erradas: [
            "$stmt = $pdo->prepare('DELETE FROM produtos WHERE id = ' . $id);\n$stmt->execute();",
            "$id = str_replace(\"'\", '', $id);\n$pdo->exec('DELETE FROM produtos WHERE id = ' . $id);",
            "$pdo->exec('DELETE FROM produtos WHERE id = ' . trim($id));"
          ],
          campos: [["Botão Excluir (value mudado no DevTools)", "0 OR 1=1"]],
          botao: "Excluir",
          dado: ["excluir", "0 OR 1=1"],
          vitrine: "😱 A vitrine ficou <strong>vazia</strong>. Um clique em Excluir apagou <strong>todos</strong> os produtos da loja.",
          ok: "✅ O banco procurou o produto de id <code>0 OR 1=1</code>, não achou nenhum e não apagou nada. A vitrine continua inteira.",
          porque: "O <code>0 OR 1=1</code> foi colado no SQL e virou <code>DELETE ... WHERE id = 0 OR 1=1</code>: como <code>1=1</code> é sempre verdade, apagou tudo. Repare que não tem aspas no ataque: tirar aspas não salva. Com <code>:id</code> no <code>execute</code>, o texto é só um valor."
        };
      } else if (tipo === 2) {
        v = {
          comentario: "// busca um produto para o formulário de edição",
          assinatura: "function buscarProduto($id): ?array",
          ruim: "    $stmt = $pdo->query('SELECT * FROM produtos WHERE id = ' . $id);",
          resto: ["    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;"],
          certa: "$stmt = $pdo->prepare('SELECT * FROM produtos WHERE id = :id');\n$stmt->execute([':id' => $id]);",
          erradas: [
            "$stmt = $pdo->prepare('SELECT * FROM produtos WHERE id = ' . $id);\n$stmt->execute();",
            "$id = str_replace(\"'\", '', $id);\n$stmt = $pdo->query('SELECT * FROM produtos WHERE id = ' . $id);",
            "$stmt = $pdo->query('SELECT * FROM produtos WHERE id = ' . trim($id));"
          ],
          campos: [["Endereço (?editar=)", "0 UNION SELECT id, email, senha, nome FROM funcionarios"]],
          botao: "Abrir",
          dado: ["editar", "0 UNION SELECT id, email, senha, nome FROM funcionarios"],
          vitrine: "😱 O formulário de edição abriu preenchido com <strong>" + vaza + "</strong>: o e-mail e o hash da senha de um funcionário!",
          ok: "✅ O banco procurou o produto de id <code>0 UNION SELECT...</code>, não achou nada e o formulário abriu vazio.",
          porque: "O <code>$_GET['editar']</code> foi colado no SQL, e o <code>UNION SELECT</code> juntou a tabela de funcionários na resposta. Com <code>:id</code> separado no <code>execute</code>, o texto todo vira só um valor, e o banco não acha nenhum produto com esse id."
        };
      } else {
        v = {
          comentario: "// acha o funcionário pelo e-mail (para o login)",
          assinatura: "function buscarFuncionario(string $email): ?array",
          ruim: "    $stmt = $pdo->query(\"SELECT id, nome, email, senha FROM funcionarios WHERE email = '$email'\");",
          resto: ["    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;"],
          certa: "$stmt = $pdo->prepare('SELECT id, nome, email, senha FROM funcionarios WHERE email = :email');\n$stmt->execute([':email' => $email]);",
          erradas: [
            "$stmt = $pdo->prepare(\"SELECT id, nome, email, senha FROM funcionarios WHERE email = '$email'\");\n$stmt->execute();",
            "$email = str_replace(' ', '', $email);\n$stmt = $pdo->query(\"SELECT id, nome, email, senha FROM funcionarios WHERE email = '$email'\");",
            "$stmt = $pdo->query(\"SELECT id, nome, email, senha FROM funcionarios WHERE email = '\" . trim($email) . \"'\");"
          ],
          campos: [["E-mail", "' UNION SELECT 1, 'Invasor', 'x', '$2y$10$hash-de-123' --"], ["Senha", "123"]],
          botao: "Entrar",
          dado: ["email", "' UNION SELECT 1, 'Invasor', 'x', '$2y$10$hash-de-123' --"],
          vitrine: "😱 \"Olá, <strong>Invasor</strong>!\" Ele entrou na área do funcionário <strong>sem ter cadastro</strong>, com a senha 123 que ele mesmo inventou.",
          ok: "✅ \"E-mail ou senha errados.\" O banco procurou um funcionário com aquele e-mail esquisito e não achou ninguém.",
          porque: "O e-mail digitado foi colado no SQL, e o <code>UNION SELECT</code> fabricou um funcionário falso, com um hash que o próprio invasor gerou. Com <code>:email</code> no <code>execute</code>, o texto é só um e-mail (que não existe), e ninguém entra."
        };
      }
      // a função estragada entra no fim ou no meio do arquivo (sorteado: a linha muda de aluno para aluno)
      var funcao = [v.comentario, v.assinatura, "{", "    $pdo = conectar();", v.ruim].concat(v.resto, ["}", ""]);
      var noMeio = sorteio(2) === 0;
      var linhas = noMeio ? cab.slice(0, 11).concat(funcao, cab.slice(11)) : cab.concat(funcao);
      var linhaRuim = (noMeio ? 11 : cab.length) + 4;
      var op = opcoes(sorteio, [v.certa].concat(v.erradas));
      var m = { produto: produto };
      m.arquivos = [{ nome: "banco.php", papel: "📦 o estoque (modelo)", linhas: linhas }];
      m.defeito = { arquivo: 0, linha: linhaRuim };
      m.conserto = { opcoes: op.opcoes, certa: op.certa, recuo: "    ", pergunta: "Qual destas versões troca a linha com segurança?" };
      m.pedido = { campos: v.campos, botao: v.botao, nota: "É o invasor quem preenche este formulário. Veja o que ele escreveu." };
      m.falas = {
        erro: ["Levei a ficha do balcão 📝", "Ordem nova?! Obedeci 😨", "Abri o caderno inteiro 📖😱"],
        ok: ["Levei a ficha do balcão 📝", "Dado no lugar certo ✅", "Não achei nada com isso 🤷"]
      };
      m.comandaTitulo = "🧾 O que o cliente mandou";
      m.sintoma = { endereco: "localhost/minha-loja/" + (tipo === 3 ? "funcionario.php" : "cadastro.php"), vitrine: v.vitrine, comanda: printR([v.dado]) };
      m.consertado = { endereco: m.sintoma.endereco, vitrine: v.ok, comanda: m.sintoma.comanda };
      m.porque = v.porque;
      m.vazou = vaza;
      m.cena = { tipo: ["vazou", "apagou", "vazou", "invasor"][tipo] };
      m.cenaOk = { tipo: "protegido" };
      return m;
    }
  };

  /* =====================================================================
     FECHADURA 5 · as senhas no varal (password_hash)
     ===================================================================== */
  var f5 = {
    id: "f5",
    guia: { comeco: "Última fechadura! O login dos funcionários. Falta muito pouco, e eu estou torcendo por você.", pista: "Lembre do moedor: a senha vira hash no cadastro, e no login quem compara é o <code>password_verify</code>, na ordem certa." },
    titulo: "As senhas no varal",
    tema: "password_hash",
    historia: {
      invadida: "Último estrago: o invasor mexeu no <strong>login dos funcionários</strong>. Se ele pegar o caderno do banco, ou se o login ficar fraco, a Mini Loja fica na mão dele de novo.",
      preso: "A última fechadura pede a senha de um funcionário, e ela só confia num login <strong>bem feito</strong>: senha guardada como hash e conferida do jeito certo. Falta pouco para sair!"
    },
    analogia: [
      { icone: "🛎️", lugar: "Recepção", arquivo: "funcionario.php", texto: "Cadastra os funcionários e confere quem entra na área de trás da loja." },
      { icone: "🔐", lugar: "Moedor", arquivo: "password_hash", texto: "Mói a senha num hash: um embaralhado que não volta. Cada vez sai diferente (o sal)." },
      { icone: "📒", lugar: "Caderno", arquivo: "funcionarios", texto: "Guarda só o hash, nunca a senha. Quem roubar o caderno não lê as senhas." }
    ],
    combinado: "O combinado da Mini Loja: no cadastro, <code>password_hash($senha, PASSWORD_DEFAULT)</code>; no login, <code>password_verify($senha, $hash)</code>, nessa ordem: primeiro a senha digitada, depois o hash guardado. Senha com 8 caracteres ou mais. <code>md5</code> e <code>base64</code> não protegem.",

    montar: function (sorteio) {
      var tipo = sorteio(4);
      var func = escolher(sorteio, FUNCIONARIOS);
      var senha = escolher(sorteio, ["Sucata@2026", "Led-Azul-77", "Placa#Mae9", "Solda!Fria3"]);
      var nomeF = func.charAt(0).toUpperCase() + func.slice(1);
      var cod = [
        "if ($_SERVER['REQUEST_METHOD'] === 'POST') {",
        "    $acao = $_POST['acao'] ?? '';",
        "    $nome = trim($_POST['nome'] ?? '');",
        "    $email = strtolower(trim($_POST['email'] ?? ''));",
        "    $senha = $_POST['senha'] ?? '';",
        "",
        "    if ($acao === 'entrar') {",
        "        // confere a senha digitada com a guardada no caderno",
        "        $funcionario = buscarFuncionario($email);",
        "        if ($funcionario && password_verify($senha, $funcionario['senha'])) {",
        "            session_regenerate_id(true);",
        "            $_SESSION['funcionario'] = $funcionario['nome'];",
        "            header('Location: cadastro.php');",
        "            exit;",
        "        }",
        "        $erro = 'E-mail ou senha errados.';",
        "    }",
        "",
        "    if ($acao === 'cadastrar') {",
        "        if (strlen($senha) < 8) {",
        "            $erro = 'A senha precisa de 8 caracteres ou mais.';",
        "        } else {",
        "            inserirFuncionario($nome, $email, password_hash($senha, PASSWORD_DEFAULT));",
        "            $aviso = 'Cadastro feito, ' . $nome . '! Agora é só entrar.';",
        "        }",
        "    }",
        "}"
      ];
      var hash = "$2y$12$Kq0vT7nW3eLr8pYc1sQ9uO...";
      var m = {};
      var entrar = [["E-mail", func + "@minilojas.com"], ["Senha", senha]];
      if (tipo === 0) {
        cod[22] = "            inserirFuncionario($nome, $email, $senha);";
        m.defeito = { arquivo: 0, linha: 22 };
        var op0 = opcoes(sorteio, ["password_hash($senha, PASSWORD_DEFAULT)", "md5($senha)", "base64_encode($senha)", "strrev($senha)"]);
        m.conserto = { opcoes: op0.opcoes, certa: op0.certa, antes: "            inserirFuncionario($nome, $email, ", depois: ");", pergunta: "O que vai no lugar do $senha?" };
        m.pedido = { campos: [["Nome", nomeF], ["E-mail", func + "@minilojas.com"], ["Senha", senha]], botao: "Cadastrar funcionário" };
        m.comanda = printR([["id", "1"], ["nome", nomeF], ["email", func + "@minilojas.com"], ["senha", senha]]);
        m.comandaOk = printR([["id", "1"], ["nome", nomeF], ["email", func + "@minilojas.com"], ["senha", hash]]);
        m.comandaTitulo = "📒 O que ficou guardado no caderno (tabela <code>funcionarios</code>)";
        m.vitrine = "😱 O cadastro funcionou, mas a senha <strong>" + senha + "</strong> ficou escrita no caderno do jeito que foi digitada. Quem roubar o banco entra como " + nomeF + ".";
        m.ok = "🔐 No caderno ficou só o hash (<code>$2y$12$...</code>). Nem a professora consegue ler a senha de " + nomeF + ".";
        m.porque = "Senha guardada pura é senha no varal. O <code>md5</code> se quebra em segundos com tabelas prontas, o <code>base64</code> e o <code>strrev</code> só disfarçam (voltam fácil). O <code>password_hash</code> mói com sal e é lento de propósito.";
        m.falas = { erro: ["Senha anotada 📝", "Moedor? Pulei essa parte 🙈", "Guardei a senha do jeito que veio 😬"], ok: ["Senha anotada 📝", "Moída no hash! 🔐", "Guardei só o hash ✅"] };
      } else if (tipo === 1) {
        cod[9] = "        if ($funcionario && $senha === $funcionario['senha']) {";
        m.defeito = { arquivo: 0, linha: 9 };
        var op1 = opcoes(sorteio, ["password_verify($senha, $funcionario['senha'])", "password_hash($senha, PASSWORD_DEFAULT) === $funcionario['senha']", "md5($senha) === $funcionario['senha']", "$senha == $funcionario['senha']"]);
        m.conserto = { opcoes: op1.opcoes, certa: op1.certa, antes: "        if ($funcionario && ", depois: ") {", pergunta: "Como a recepção deve conferir a senha?" };
        m.pedido = { campos: entrar, botao: "Entrar" };
        m.comanda = printR([["senha digitada", senha], ["senha no caderno", hash]]);
        m.comandaOk = m.comanda;
        m.comandaTitulo = "🔍 O que a recepção comparou";
        m.vitrine = "😤 " + nomeF + " digitou a senha certinha e recebeu <strong>\"E-mail ou senha errados.\"</strong> Nenhum funcionário consegue entrar.";
        m.ok = "✅ \"Olá, " + nomeF + "!\" Entrou na área do funcionário.";
        m.porque = "No caderno está o hash, não a senha: comparar com <code>===</code> nunca dá certo. E gerar outro <code>password_hash</code> também não, porque o sal muda a cada vez. Quem sabe comparar é o <code>password_verify</code>.";
        m.falas = { erro: ["Pedido de login 🛎️", "Senha ≠ hash. Não entra! 🚫", "Ninguém entra hoje 😩"], ok: ["Pedido de login 🛎️", "password_verify: confere! ✅", "Pode entrar 👋"] };
      } else if (tipo === 2) {
        cod[19] = "        if (strlen($senha) < 3) {";
        m.defeito = { arquivo: 0, linha: 19 };
        m.conserto = { antes: "        if (strlen($senha) < ", depois: ") {", resposta: "8", tamanho: 4 };
        m.pedido = { campos: [["Nome", nomeF], ["E-mail", func + "@minilojas.com"], ["Senha", "123"]], botao: "Cadastrar funcionário" };
        m.comanda = printR([["nome", nomeF], ["email", func + "@minilojas.com"], ["senha", "123"]]);
        m.comandaOk = m.comanda;
        m.comandaTitulo = "🧾 O que chegou à recepção (<code>$_POST</code>)";
        m.vitrine = "😬 \"Cadastro feito, " + nomeF + "!\" com a senha <strong>123</strong>. O invasor adivinhou na primeira tentativa.";
        m.ok = "🛑 \"A senha precisa de 8 caracteres ou mais.\" A senha 123 voltou para o balcão.";
        m.porque = "O hash protege a senha guardada, mas não salva uma senha fraca: <code>123</code> é a primeira que todo invasor tenta. O combinado da Mini Loja é 8 caracteres ou mais.";
        m.falas = { erro: ["Senha anotada 📝", "Três letras? Tá ótimo! 👍", "Hash de 123... 😬"], ok: ["Senha anotada 📝", "Curta demais, volta! 🛑", "Nem chegou aqui 😌"] };
      } else {
        cod[9] = "        if ($funcionario && password_verify($funcionario['senha'], $senha)) {";
        m.defeito = { arquivo: 0, linha: 9 };
        var op3 = opcoes(sorteio, ["password_verify($senha, $funcionario['senha'])", "password_verify($senha, password_hash($senha, PASSWORD_DEFAULT))", "password_hash($senha, PASSWORD_DEFAULT) === $funcionario['senha']", "$senha === $funcionario['senha']"]);
        m.conserto = { opcoes: op3.opcoes, certa: op3.certa, antes: "        if ($funcionario && ", depois: ") {", pergunta: "Qual é a conferência certa?" };
        m.pedido = { campos: entrar, botao: "Entrar" };
        m.comanda = printR([["1º (a senha?)", hash], ["2º (o hash?)", senha]]);
        m.comandaOk = printR([["1º (a senha)", senha], ["2º (o hash)", hash]]);
        m.comandaTitulo = "🔍 O que o <code>password_verify</code> recebeu";
        m.vitrine = "😤 " + nomeF + " digitou a senha certinha e recebeu <strong>\"E-mail ou senha errados.\"</strong> Ninguém entra mais.";
        m.ok = "✅ \"Olá, " + nomeF + "!\" Entrou na área do funcionário.";
        m.porque = "A ordem importa: <code>password_verify(senha digitada, hash guardado)</code>. Invertido, ele tenta moer o hash como se fosse senha. Cuidado com a pegadinha: <code>password_verify($senha, password_hash($senha, ...))</code> dá <strong>sempre</strong> verdadeiro, e qualquer senha entraria.";
        m.falas = { erro: ["Pedido de login 🛎️", "Moí o hash como se fosse senha 🤪", "Ninguém entra hoje 😩"], ok: ["Pedido de login 🛎️", "Ordem certa: confere! ✅", "Pode entrar 👋"] };
      }
      m.arquivos = [{ nome: "funcionario.php", papel: "🛎️ a recepção (controle)", linhas: cod }];
      m.sintoma = { endereco: "localhost/minha-loja/funcionario.php", vitrine: m.vitrine, comanda: m.comanda };
      m.consertado = { endereco: "localhost/minha-loja/funcionario.php", vitrine: m.ok, comanda: m.comandaOk };
      m.funcionario = nomeF;
      m.senhaCena = tipo === 2 ? "123" : senha;
      m.cena = { tipo: ["varal", "negado", "fraca", "negado"][tipo] };
      m.cenaOk = { tipo: ["hash", "entrou", "curta", "entrou"][tipo] };
      return m;
    }
  };

  return [f1, f2, f3, f4, f5];
})();
