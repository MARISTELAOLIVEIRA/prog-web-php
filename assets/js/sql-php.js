/* ===================================================================
   sql-php.js: SQL de verdade dentro da página, com o SQLite do sql.js (assets/vendor/sql.js) · versão 2 · 2026-10-21
   - [data-sql-console]: console com o banco da loja (assets/sql/loja.sql). O aluno roda SELECT, UPDATE, DELETE...
     sem instalar nada; "Recomeçar o banco" volta tudo ao início. Os exemplos vêm do <select> (value = SQL).
   - [data-detetive-sql]: "Detetive SQL" (aula 13). O mesmo banco, mais a tabela entregas, com um pedido de outubro
     que não foi entregue (sorteado a cada visita). A equipe descobre qual é e quem comprou; cada consulta custa XP.
   - [data-ataque-sql]: "Ataque e defesa" (aula 14). A mesma busca por e-mail feita de dois jeitos: colando o texto
     no SQL (cai na injeção) e com consulta preparada (o texto é só texto). Cada jeito vale uma insígnia.
   Os resultados entram com textContent. O banco vive só na memória: recarregou a página, recomeçou.
   =================================================================== */
(function () {
  const caixas = document.querySelectorAll("[data-sql-console], [data-detetive-sql], [data-ataque-sql]");
  if (!caixas.length) return;

  // a pasta assets/, a partir do endereço deste arquivo (assets/js/sql-php.js)
  const BASE = new URL("../", document.currentScript.src).href;

  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  function carregarScript(src) {
    return new Promise(function (ok, falha) {
      const s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = falha;
      document.head.appendChild(s);
    });
  }

  // carrega o SQLite e o script da loja uma vez só, para todas as caixas da página
  const pronto = carregarScript(BASE + "vendor/sql.js/sql-wasm.js")
    .then(function () {
      return Promise.all([
        initSqlJs({ locateFile: function (arquivo) { return BASE + "vendor/sql.js/" + arquivo; } }),
        fetch(BASE + "sql/loja.sql").then(function (r) { return r.text(); })
      ]);
    });

  function novoBanco(SQL, script, extra) {
    const db = new SQL.Database();
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(script);
    if (extra) db.exec(extra);
    return db;
  }

  // roda o SQL e mostra o resultado na caixa de saída
  function executar(db, sql, saida) {
    saida.textContent = "";
    try {
      const resultados = db.exec(sql);
      if (!resultados.length) {
        saida.appendChild(el("p", "sql-ok", "Pronto! " + db.getRowsModified() + " linha(s) alterada(s) pelo último comando."));
        return true;
      }
      const r = resultados[resultados.length - 1];
      saida.appendChild(el("p", "sql-ok", r.values.length + " linha(s) encontrada(s)."));
      const rolagem = el("div", "sql-rolagem");
      const tabela = el("table", "sql-tabela");
      const cab = el("tr");
      r.columns.forEach(function (c) { cab.appendChild(el("th", "", c)); });
      tabela.appendChild(cab);
      r.values.forEach(function (linha) {
        const tr = el("tr");
        linha.forEach(function (v) { tr.appendChild(el("td", "", v === null ? "NULL" : String(v))); });
        tabela.appendChild(tr);
      });
      rolagem.appendChild(tabela);
      saida.appendChild(rolagem);
      return true;
    } catch (erro) {
      saida.appendChild(el("p", "sql-erro", "Erro: " + erro.message));
      return false;
    }
  }

  function montarConsole(caixa, criarBanco, aoExecutar) {
    const texto = caixa.querySelector("textarea");
    const saida = caixa.querySelector(".sql-saida");
    const exemplos = caixa.querySelector("select");
    const botaoRodar = caixa.querySelector("[data-rodar]");
    const botaoRecomecar = caixa.querySelector("[data-recomecar]");
    let db = criarBanco();

    botaoRodar.disabled = false;
    if (botaoRecomecar) botaoRecomecar.disabled = false;
    saida.textContent = "";
    saida.appendChild(el("p", "sql-ok", "Banco da loja carregado: clientes, produtos e pedidos. Pode digitar."));

    if (exemplos) {
      exemplos.addEventListener("change", function () {
        if (exemplos.value) texto.value = exemplos.value;
        texto.focus();
      });
    }
    botaoRodar.addEventListener("click", function () {
      const sql = texto.value.trim();
      if (!sql) return;
      executar(db, sql, saida);
      if (aoExecutar) aoExecutar();
    });
    // Ctrl + Enter também executa
    texto.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); botaoRodar.click(); }
    });
    if (botaoRecomecar) {
      botaoRecomecar.addEventListener("click", function () {
        db.close();
        db = criarBanco();
        saida.textContent = "";
        saida.appendChild(el("p", "sql-ok", "Banco recomeçado: tudo como no início."));
      });
    }
    return function () { return db; };
  }

  pronto.then(function (tudo) {
    const SQL = tudo[0];
    const script = tudo[1];

    document.querySelectorAll("[data-sql-console]").forEach(function (caixa) {
      montarConsole(caixa, function () { return novoBanco(SQL, script); });
    });

    document.querySelectorAll("[data-detetive-sql]").forEach(function (caixa) {
      // a tabela entregas: todo pedido foi entregue 3 dias depois, menos um de outubro (sorteado)
      const sumido = 4 + Math.floor(Math.random() * 7);   // pedidos de outubro: 4 a 10
      const extra =
        "CREATE TABLE entregas (pedido_id INTEGER NOT NULL REFERENCES pedidos (id), entregue_em TEXT NOT NULL);" +
        "INSERT INTO entregas (pedido_id, entregue_em) SELECT id, date(data, '+3 days') FROM pedidos WHERE id <> " + sumido + ";";
      const banco = montarConsole(caixa, function () { return novoBanco(SQL, script, extra); }, function () {
        consultas++;
        placar();
      });

      const nome = banco().exec("SELECT clientes.nome FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id WHERE pedidos.id = " + sumido)[0].values[0][0];
      const campoPedido = caixa.querySelector('input[name="pedido"]');
      const campoCliente = caixa.querySelector('input[name="cliente"]');
      const resposta = caixa.querySelector(".detetive-resposta");
      const contador = caixa.querySelector(".detetive-placar");
      let consultas = 0;
      let erros = 0;
      let resolvido = false;

      function xp() { return Math.max(30, 150 - consultas * 5 - erros * 25); }
      function placar() {
        if (!resolvido) contador.textContent = consultas + " consulta(s) · " + erros + " palpite(s) errado(s) · valendo " + xp() + " XP";
      }
      function simplificar(t) {
        return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
      }

      caixa.querySelector("[data-palpite]").addEventListener("click", function () {
        if (resolvido) return;
        const certoPedido = parseInt(campoPedido.value, 10) === sumido;
        const certoCliente = simplificar(campoCliente.value) === simplificar(nome);
        resposta.textContent = "";
        if (certoPedido && certoCliente) {
          resolvido = true;
          contador.textContent = "Mistério resolvido com " + consultas + " consulta(s).";
          resposta.appendChild(el("p", "planilha-xp", "🕵️ Insígnia Detetive SQL · " + xp() + " XP"));
          resposta.appendChild(el("p", "", "O pedido " + sumido + ", de " + nome + ", nunca entrou na tabela entregas. Anote o XP da equipe no placar do quadro."));
        } else {
          erros++;
          placar();
          resposta.appendChild(el("p", "sql-erro",
            certoPedido ? "O pedido está certo, mas a cliente não. Faça o JOIN com clientes." :
            "Ainda não. Compare a lista de pedidos com a lista de entregas: qual número falta?"));
        }
      });
      placar();
    });
    document.querySelectorAll("[data-ataque-sql]").forEach(function (caixa) {
      const db = novoBanco(SQL, script);
      const campo = caixa.querySelector("input");
      const saida = caixa.querySelector(".sql-saida");
      const insignias = caixa.querySelector(".ataque-insignias");
      const ganhas = {};
      caixa.querySelectorAll("button").forEach(function (b) { b.disabled = false; });
      saida.textContent = "";
      saida.appendChild(el("p", "sql-ok", "Banco da loja carregado. Digite um e-mail, ou tente o ataque."));

      function ganhar(chave, texto) {
        if (ganhas[chave]) return;
        ganhas[chave] = true;
        insignias.appendChild(el("p", "planilha-xp", texto));
        if (ganhas.ataque && ganhas.defesa) insignias.appendChild(el("p", "", "Dupla completa: 100 XP. Agora corrija o busca-insegura.php do tutorial."));
      }

      function mostrar(sqlMostrado, linhas, comAtaque, preparada) {
        saida.textContent = "";
        const p = el("p", "sql-ok", "SQL que foi para o banco: ");
        p.appendChild(el("code", "", sqlMostrado));
        saida.appendChild(p);
        if (preparada) saida.appendChild(el("p", "sql-ok", "Valor do marcador :email → " + JSON.stringify(campo.value)));
        if (!linhas.length) {
          saida.appendChild(el("p", "", "Nenhum cadastro com esse e-mail."));
        } else {
          const ul = el("ul");
          linhas.forEach(function (l) { ul.appendChild(el("li", "", l[0] + " · " + l[1])); });
          saida.appendChild(ul);
        }
        if (!preparada && linhas.length > 1) {
          saida.appendChild(el("p", "sql-erro", "Vazou! O texto digitado virou parte do comando, e o banco devolveu os telefones de todo mundo."));
          ganhar("ataque", "🏴 Insígnia Hacker do bem · 50 XP");
        }
        if (preparada && comAtaque && !linhas.length) {
          saida.appendChild(el("p", "sql-ok", "Bloqueado: com o prepare, o ataque é só um e-mail esquisito que não existe."));
          ganhar("defesa", "🛡️ Insígnia Escudo · 50 XP");
        }
      }

      caixa.querySelector("[data-colando]").addEventListener("click", function () {
        const sql = "SELECT nome, telefone FROM clientes WHERE email = '" + campo.value + "'";
        try {
          const r = db.exec(sql);
          mostrar(sql, r.length ? r[0].values : [], /'/.test(campo.value), false);
        } catch (erro) {
          saida.textContent = "";
          const p = el("p", "sql-ok", "SQL que foi para o banco: ");
          p.appendChild(el("code", "", sql));
          saida.appendChild(p);
          saida.appendChild(el("p", "sql-erro", "Erro: " + erro.message + ". O texto quebrou o comando: sinal de que dá para injetar SQL aqui."));
        }
      });
      caixa.querySelector("[data-preparada]").addEventListener("click", function () {
        const sql = "SELECT nome, telefone FROM clientes WHERE email = :email";
        const stmt = db.prepare(sql);
        stmt.bind({ ":email": campo.value });
        const linhas = [];
        while (stmt.step()) linhas.push(stmt.get());
        stmt.free();
        mostrar(sql, linhas, /'/.test(campo.value), true);
      });
    });
  }).catch(function () {
    caixas.forEach(function (caixa) {
      const saida = caixa.querySelector(".sql-saida");
      saida.textContent = "";
      saida.appendChild(el("p", "sql-erro", "Não consegui carregar o banco nesta página. Abra pelo endereço do site (https://...), e não pelo arquivo, ou use o console-sql.php do tutorial."));
    });
  });
})();
