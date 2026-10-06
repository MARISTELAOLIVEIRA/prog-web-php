// Curso Básico de PHP: monta a tela certa para cada endereço (#/...).
// Sem banco de dados, o progresso fica só neste navegador e não trava nenhum módulo.
import { initTheme } from './theme.js?v=2';
import { initParticles, initGlitch } from './effects.js?v=2';
import { onRouteChange, parseRoute } from './router.js';
import { getActiveProgress, startStudent } from './storage.js';
import { MODULES } from './data.js';
import { renderDashboard, renderModule, renderLesson, renderQuiz } from './views.js?v=2';

const view = document.getElementById('view');
const progressFill = document.getElementById('global-progress-fill');
const progressLabel = document.getElementById('global-progress-label');

// progresso anônimo, guardado no navegador (antes pedia o nome do aluno)
function progressoAtual() {
  return getActiveProgress() || startStudent('Estudante');
}

function updateGlobalProgress(progress) {
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalQuizzes = MODULES.length;
  const doneLessons = Object.keys(progress.completedLessons).length;
  const passedQuizzes = Object.values(progress.quizScores).filter(q => q.passed).length;
  const pct = Math.round(((doneLessons + passedQuizzes) / (totalLessons + totalQuizzes)) * 100);
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = `${pct}% concluído neste navegador · ${progress.xp} XP`;
}

function render() {
  const progress = progressoAtual();
  updateGlobalProgress(progress);

  const route = parseRoute();
  if (route.name === 'dashboard') {
    renderDashboard(view, progress);
  } else if (route.name === 'module') {
    renderModule(view, route.moduleId, progress);
  } else if (route.name === 'lesson') {
    renderLesson(view, route.moduleId, route.lessonId, progress, () => updateGlobalProgress(getActiveProgress()));
  } else if (route.name === 'quiz') {
    renderQuiz(view, route.moduleId, progress);
  }
  // foco no conteúdo sem rolar a página: a barra do topo continua à vista
  view.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

initTheme();
initParticles();
initGlitch();
onRouteChange(render);
