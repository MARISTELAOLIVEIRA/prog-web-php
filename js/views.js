import { MODULES, getModule, getLesson, allLessonIds } from './data.js';
import { markLessonComplete, saveQuizScore, isModuleComplete } from './storage.js';
import { highlightPhp } from './highlight.js';
import { renderQuestion } from './question-ui.js';
import { goTo } from './router.js';
import { showToast } from './toast.js';
import { burstConfetti, typewrite } from './effects.js';

function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.className) node.className = opts.className;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts.text !== undefined) node.textContent = opts.text;
  return node;
}

function renderBlock(block) {
  if (block.type === 'text') return el('div', { className: 'lesson-block', html: block.html });
  if (block.type === 'code') {
    const pre = el('pre', { className: 'code-block' });
    const code = document.createElement('code');
    code.innerHTML = highlightPhp(block.code);
    pre.appendChild(code);
    return pre;
  }
  if (block.type === 'question') return renderQuestion(block.q);
  return document.createTextNode('');
}

function breadcrumb(...parts) {
  const nav = el('p', { className: 'breadcrumb' });
  parts.forEach((p, i) => {
    if (i > 0) nav.appendChild(document.createTextNode(' » '));
    if (p.href) {
      const a = el('a', { text: p.label });
      a.href = p.href;
      nav.appendChild(a);
    } else {
      nav.appendChild(document.createTextNode(p.label));
    }
  });
  return nav;
}

export function renderWelcome(container, { onSubmit }) {
  container.innerHTML = '';
  const wrap = el('section', { className: 'welcome' });
  wrap.innerHTML = `
    <h2>Bem-vindo(a) ao PHP.exe</h2>
    <p>Um mini curso interativo com os conceitos iniciais de programação WEB com PHP — sintaxe, variáveis, estruturas de controle e funções.</p>
  `;
  const form = el('form');
  form.innerHTML = `
    <div class="field">
      <label for="student-name">Digite seu nome completo</label>
      <input id="student-name" name="student-name" type="text" autocomplete="name" required minlength="3" placeholder="Ex: Maria da Silva" />
      <span class="error" id="name-error"></span>
    </div>
  `;
  const submitBtn = el('button', { className: 'btn', text: 'Iniciar jornada ▹' });
  submitBtn.type = 'submit';
  form.appendChild(submitBtn);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('#student-name');
    const errorEl = form.querySelector('#name-error');
    const value = input.value.trim();
    if (value.split(/\s+/).filter(Boolean).length < 2) {
      errorEl.textContent = 'Informe seu nome completo (nome e sobrenome).';
      input.focus();
      return;
    }
    errorEl.textContent = '';
    onSubmit(value);
  });

  wrap.appendChild(form);
  container.appendChild(wrap);
}

export function renderDashboard(container, progress) {
  container.innerHTML = '';
  const head = el('div', { className: 'dashboard-head' });
  head.innerHTML = `<h2>Painel de Módulos</h2><p>Continue de onde parou, ${progress.fullName.split(' ')[0]}.</p>`;
  container.appendChild(head);

  const grid = el('div', { className: 'module-grid' });
  MODULES.forEach((mod, idx) => {
    const lessonIds = allLessonIds(mod);
    const completedCount = lessonIds.filter(id => progress.completedLessons[id]).length;
    const quiz = progress.quizScores[mod.id];
    const complete = isModuleComplete(progress, mod.id, lessonIds);
    const prevMod = MODULES[idx - 1];
    const locked = prevMod ? !isModuleComplete(progress, prevMod.id, allLessonIds(prevMod)) : false;

    const card = el('article', { className: 'module-card' + (locked ? ' locked' : '') });
    card.innerHTML = `
      <span class="module-icon" aria-hidden="true">${mod.icon}</span>
      <h3>${mod.title}</h3>
      <p>${mod.description}</p>
      <span class="card-progress">${completedCount}/${lessonIds.length} lições ${quiz ? `· quiz ${quiz.score}/${quiz.total}` : ''} ${complete ? '· ✔ concluído' : ''}</span>
      ${locked ? '<span class="lock-note">🔒 Conclua o módulo anterior para desbloquear</span>' : ''}
    `;
    if (!locked) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const activate = () => goTo(`/module/${mod.id}`);
      card.addEventListener('click', activate);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    } else {
      card.addEventListener('click', () => showToast('🔒 Conclua o módulo anterior primeiro.'));
    }
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

export function renderModule(container, moduleId, progress) {
  const mod = getModule(moduleId);
  container.innerHTML = '';
  if (!mod) { goTo('/'); return; }

  container.appendChild(breadcrumb({ label: 'Painel', href: '#/' }, { label: mod.title }));
  container.appendChild(el('h2', { className: 'lesson-title', text: mod.title }));
  container.appendChild(el('p', { text: mod.description }));

  const list = el('div', { className: 'module-grid' });
  mod.lessons.forEach((lesson, i) => {
    const done = !!progress.completedLessons[lesson.id];
    const card = el('article', { className: 'module-card' });
    card.innerHTML = `<span class="module-icon" aria-hidden="true">${done ? '✔' : `0${i + 1}`}</span><h3>${lesson.title}</h3><p>${done ? 'Concluída' : 'Pendente'}</p>`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    const activate = () => goTo(`/module/${mod.id}/lesson/${lesson.id}`);
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    list.appendChild(card);
  });
  container.appendChild(list);

  const allDone = mod.lessons.every(l => progress.completedLessons[l.id]);
  const quiz = progress.quizScores[mod.id];
  const row = el('div', { className: 'btn-row' });
  const quizBtn = el('button', { className: 'btn secondary', text: quiz ? `Refazer quiz (última nota: ${quiz.score}/${quiz.total})` : 'Fazer quiz do módulo ▹' });
  quizBtn.disabled = !allDone;
  quizBtn.addEventListener('click', () => goTo(`/module/${mod.id}/quiz`));
  row.appendChild(quizBtn);
  if (!allDone) row.appendChild(el('span', { className: 'lock-note', text: 'Conclua todas as lições para liberar o quiz.' }));
  container.appendChild(row);
}

export function renderLesson(container, moduleId, lessonId, progress, onComplete) {
  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  container.innerHTML = '';
  if (!mod || !lesson) { goTo('/'); return; }

  container.appendChild(breadcrumb({ label: 'Painel', href: '#/' }, { label: mod.title, href: `#/module/${mod.id}` }, { label: lesson.title }));
  const title = el('h2', { className: 'lesson-title' });
  container.appendChild(title);
  typewrite(title, lesson.title);

  lesson.blocks.forEach(block => container.appendChild(renderBlock(block)));

  const idx = mod.lessons.findIndex(l => l.id === lessonId);
  const next = mod.lessons[idx + 1];
  const row = el('div', { className: 'btn-row' });

  const completeBtn = el('button', { className: 'btn', text: progress.completedLessons[lessonId] ? '✔ Lição concluída' : 'Marcar como concluída' });
  completeBtn.addEventListener('click', () => {
    markLessonComplete(progress, lessonId);
    completeBtn.textContent = '✔ Lição concluída';
    showToast('Progresso salvo! +10 XP');
    onComplete?.();
    if (next) goTo(`/module/${mod.id}/lesson/${next.id}`);
    else goTo(`/module/${mod.id}`);
  });
  row.appendChild(completeBtn);

  const backBtn = el('button', { className: 'btn secondary', text: '‹ Voltar ao módulo' });
  backBtn.addEventListener('click', () => goTo(`/module/${mod.id}`));
  row.appendChild(backBtn);

  container.appendChild(row);
}

export function renderQuiz(container, moduleId, progress) {
  const mod = getModule(moduleId);
  container.innerHTML = '';
  if (!mod) { goTo('/'); return; }

  container.appendChild(breadcrumb({ label: 'Painel', href: '#/' }, { label: mod.title, href: `#/module/${mod.id}` }, { label: 'Quiz' }));
  container.appendChild(el('h2', { className: 'lesson-title', text: `Quiz — ${mod.title}` }));
  container.appendChild(el('p', { className: 'quiz-progress', text: `${mod.quiz.length} perguntas · precisa de 60% para ser aprovado(a)` }));

  const results = new Array(mod.quiz.length).fill(undefined);
  const finishBtn = el('button', { className: 'btn', text: 'Finalizar quiz' });
  finishBtn.disabled = true;

  mod.quiz.forEach((q, i) => {
    const box = renderQuestion(q, {
      onAnswered: isCorrect => {
        results[i] = isCorrect;
        finishBtn.disabled = results.some(r => r === undefined);
      },
    });
    container.appendChild(box);
  });

  const row = el('div', { className: 'btn-row' });
  row.appendChild(finishBtn);
  container.appendChild(row);

  finishBtn.addEventListener('click', () => {
    const score = results.filter(Boolean).length;
    const total = mod.quiz.length;
    saveQuizScore(progress, mod.id, score, total);
    const passed = score / total >= 0.6;
    container.innerHTML = '';
    const result = el('section', { className: 'quiz-result' });
    result.innerHTML = `
      <p>${passed ? '🎉 Aprovado(a)!' : 'Quase lá — tente novamente.'}</p>
      <p class="score">${score}/${total}</p>
    `;
    container.appendChild(result);
    const backRow = el('div', { className: 'btn-row' });
    const backBtn = el('button', { className: 'btn', text: '‹ Voltar ao módulo' });
    backBtn.addEventListener('click', () => goTo(`/module/${mod.id}`));
    backRow.appendChild(backBtn);
    if (!passed) {
      const retryBtn = el('button', { className: 'btn secondary', text: 'Tentar novamente' });
      retryBtn.addEventListener('click', () => renderQuiz(container, moduleId, progress));
      backRow.appendChild(retryBtn);
    }
    container.appendChild(backRow);
    if (passed) burstConfetti();
    showToast(passed ? 'Módulo concluído! 🎉' : 'Continue estudando e tente de novo.');
  });
}
