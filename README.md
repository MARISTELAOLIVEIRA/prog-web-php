# 💾 Curso Básico de PHP — Conceitos Iniciais de Programação WEB

```
 ██▓███   ██░ ██  ██▓███      ▓█████ ▒██   ██▒▓█████
▓██░  ██▒▓██░ ██▒▓██░  ██▒    ▓█   ▀ ▒▒ █ █ ▒░▓█   ▀
▓██░ ██▓▒▒██▀▀██░▓██░ ██▓▒    ▒███   ░░  █   ░▒███
▒██▄█▓▒ ▒░▓█ ░██ ▒██▄█▓▒ ▒    ▒▓█  ▄  ░ █ █ ▒ ▒▓█  ▄
▒██▒ ░  ░░▓█▒░██▓▒██▒ ░  ░    ░▒████▒▒██▒ ▒██▒░▒████▒
▒▓▒░ ░  ░ ▒ ░░▒░▒▒▓▒░ ░  ░    ░░ ▒░ ░▒▒ ░ ░▓ ░░░ ▒░ ░
░▒ ░      ▒ ░▒░ ░░▒ ░          ░ ░  ░░░   ░▒ ░ ░ ░  ░
░░        ░  ░░ ░░░              ░    ░    ░     ░
          ░  ░  ░                ░         ░     ░  ░
```

> **Bem-vindo(a) ao terminal de aprendizado.** Um mini curso interativo, cyberpunk e cheio de neon para dar os primeiros passos em PHP. 🟢🟠

[![Feito com](https://img.shields.io/badge/feito%20com-HTML%2FCSS%2FJS%20puro-39ff8a?style=for-the-badge)](#)
[![Sem build](https://img.shields.io/badge/build-nenhum%20necess%C3%A1rio-ff8a1e?style=for-the-badge)](#)
[![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-39ff8a?style=for-the-badge)](#)
[![Tema](https://img.shields.io/badge/tema-dark%20%2F%20light-0d0d0d?style=for-the-badge)](#)

---

## 🖥️ O que é isso?

O **Curso Básico de PHP** é um **mini curso web interativo** com os conceitos iniciais de programação com **PHP**, criado para a disciplina **Programação WEB II** da Faculdade de Tecnologia e Inovação **Senac DF**, sob orientação da Profª Maristela.

Nada de slides parados: aqui você navega por **módulos**, lê explicações + exemplos de código, responde **perguntas interativas** com feedback na hora, encara um **quiz** ao final de cada módulo e desbloqueia o próximo nível — tudo num visual **cyberpunk** com verde neon, laranja e uma pitada de glitch. ⚡

## ✨ Funcionalidades

- 🌓 **Modo escuro (padrão) e claro**, com preferência salva
- 💾 **Progresso salvo no navegador**: lições concluídas, notas dos quizzes e XP ficam guardados neste aparelho
- 📊 **Barra de progresso global** (lições + quizzes) e XP acumulado
- 🔓 **Todos os módulos liberados**: comece por qualquer um (sem banco de dados, travar módulos não faria sentido)
- ❓ **Perguntas interativas** (múltipla escolha e "complete o código") com feedback instantâneo
- 🧠 **Quiz por módulo** com nota mínima de 60% para aprovação
- 🎨 **Realce de sintaxe PHP** feito à mão em JavaScript puro (sem libs externas)
- 🌌 Efeitos visuais: grade animada, partículas em `<canvas>`, glitch no logo e confete ao ser aprovado(a)
- ♿ Acessível: navegação por teclado, `aria-live`, `prefers-reduced-motion`, contraste em ambos os temas
- 📱 Totalmente responsivo — do celular ao desktop
- 🚫 **Zero dependências, zero build step** — é só abrir e rodar

## 🗂️ Módulos do curso

| # | Módulo | Conteúdo |
|---|--------|----------|
| 1️⃣ | **Introdução ao PHP** | Sintaxe, comentários, tipos de dados, variáveis, expressões e operadores |
| 2️⃣ | **Estruturas de Controle** | Condicionais (`if`/`switch`/`match`) e laços de repetição (`for`/`while`/`do-while`/`foreach`) |
| 3️⃣ | **Modularização: Funções** | Declaração, parâmetros, retorno, escopo e reaproveitamento de código |

## 🛠️ Stack

Só o essencial, sem frameworks:

- **HTML5** semântico
- **CSS3** (variáveis de tema, grid/flexbox, animações)
- **JavaScript** puro (ES Modules) — roteador via hash, persistência em `localStorage`, tudo client-side

```
📁 PHP-Conceitos-Iniciais/
├── index.html          → shell da aplicação (SPA)
├── css/
│   └── style.css       → visual neon do curso (o tema segue o botão da barra do topo)
└── js/
    ├── app.js          → bootstrap + orquestração
    ├── router.js       → roteador baseado em hash (#/...)
    ├── data.js         → conteúdo dos módulos/lições/quizzes
    ├── views.js        → renderização das telas
    ├── question-ui.js  → perguntas interativas (mc / fill)
    ├── highlight.js     → realce de sintaxe PHP
    ├── storage.js       → progresso do aluno (localStorage)
    ├── theme.js          → alternância claro/escuro
    ├── effects.js       → partículas, glitch, confete
    └── toast.js         → notificações rápidas
```

## 🚀 Rodando localmente

Não precisa instalar nada — é HTML/CSS/JS puro. Basta servir os arquivos estáticos:

```bash
# Python
python3 -m http.server 8765

# ou Node
npx serve .
```

Depois é só abrir `http://localhost:8765` no navegador. 🎮

## 🌐 Publicando no GitHub Pages

1. Faça push do repositório para o GitHub
2. Em **Settings → Pages**, selecione a branch principal e a pasta `/ (root)`
3. Pronto — o curso estará no ar em `https://<seu-usuario>.github.io/<repo>/`

## 🎓 Como o progresso é salvo

Não há backend: tudo roda no navegador. O progresso (lições concluídas, notas dos quizzes e XP) fica salvo em `localStorage`, só neste navegador. Por isso nenhum módulo é travado: sem banco de dados, não dá para garantir quem fez o quê.

## 📜 Créditos

Desenvolvido para a disciplina **Programação WEB II** — Faculdade de Tecnologia e Inovação **Senac DF** · Profª Maristela.

---

<p align="center"><em>&lt;?php echo "bons estudos!"; ?&gt;</em></p>
