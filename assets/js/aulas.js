/*
  aulas.js: comportamento das páginas de aula e da lista de aulas.
  versão 2 · 2026-10-05

  1. Checklist da atividade (<ol class="checklist" id="...">): o que o aluno marca
     fica salvo no navegador dele, e a barra de progresso mostra quantos passos faltam.
  2. Lista de aulas (<ol class="log lista-aulas">): cada <li> tem as datas das turmas
     em data-a e data-b (formato AAAA-MM-DD). O script destaca a próxima aula e
     deixa mais apagadas as que já passaram e as futuras. Ninguém precisa atualizar à mão.
     Duas aulas com a mesma data (mesmo encontro) ficam as duas destacadas.
*/
(function () {

  // ---------- 1. checklist da atividade ----------

  function ler(chave) {
    try {
      return JSON.parse(localStorage.getItem(chave)) || [];
    } catch (erro) {
      return [];
    }
  }

  function gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
      // sem armazenamento (aba anônima, por exemplo): o checklist funciona, só não fica salvo
    }
  }

  function ligaChecklist(lista) {
    const chave = "aula:" + location.pathname + ":" + lista.id;
    const caixas = Array.from(lista.querySelectorAll('input[type="checkbox"]'));
    const progresso = document.querySelector('[data-progresso="' + lista.id + '"]');
    const marcadas = ler(chave);

    caixas.forEach(function (caixa, posicao) {
      caixa.checked = marcadas.indexOf(posicao) !== -1;
      caixa.addEventListener("change", atualiza);
    });

    function atualiza() {
      const feitas = [];
      caixas.forEach(function (caixa, posicao) {
        if (caixa.checked) {
          feitas.push(posicao);
        }
      });
      gravar(chave, feitas);

      if (progresso) {
        const total = caixas.length;
        progresso.querySelector(".contagem").textContent = feitas.length + " de " + total;
        progresso.querySelector(".barra-progresso span").style.width = (feitas.length / total * 100) + "%";
      }
    }

    atualiza();
  }

  document.querySelectorAll("ol.checklist[id]").forEach(ligaChecklist);


  // ---------- 2. lista de aulas: passada, próxima e futura ----------

  function fimDoDia(texto) {
    // "2026-10-13" vira 13/10/2026 às 23:59, no horário de quem está vendo
    const partes = texto.split("-");
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]), 23, 59, 59);
  }

  const hoje = new Date();
  let dataProxima = "";   // data da próxima aula (duas aulas no mesmo encontro ficam as duas destacadas)

  document.querySelectorAll(".lista-aulas > li[data-a]").forEach(function (aula) {
    // a aula só "passou" depois da data da última turma (B)
    const ultimaData = fimDoDia(aula.dataset.b || aula.dataset.a);

    if (ultimaData < hoje) {
      aula.classList.add("passada");
    } else if (!dataProxima || aula.dataset.a === dataProxima) {
      dataProxima = aula.dataset.a;
      aula.classList.add("andamento");
      const etiqueta = document.createElement("span");
      etiqueta.className = "etiqueta verde";
      etiqueta.textContent = "próxima aula";
      const linha = aula.querySelector(".commit-linha");
      linha.insertBefore(etiqueta, linha.querySelector(".hash"));
    } else {
      aula.classList.add("futura");
    }
  });

})();
