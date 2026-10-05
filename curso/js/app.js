import { initTheme } from './theme.js';
import { initParticles, initGlitch } from './effects.js';
import { onRouteChange, parseRoute, goTo } from './router.js';
import { getActiveProgress, startStudent, clearActiveStudent } from './storage.js';
import { MODULES } from './data.js';
import { renderWelcome, renderDashboard, renderModule, renderLesson, renderQuiz } from './views.js';
import { showToast } from './toast.js';

const view = document.getElementById('view');
const studentBadge = document.getElementById('student-badge');
const studentNameDisplay = document.getElementById('student-name-display');
const progressNav = document.getElementById('progress-nav');
const progressFill = document.getElementById('global-progress-fill');
const progressLabel = document.getElementById('global-progress-label');
const switchBtn = document.getElementById('btn-switch-student');
const homeBtn = document.getElementById('btn-home');

function updateGlobalProgress(progress) {
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalQuizzes = MODULES.length;
  const doneLessons = Object.keys(progress.completedLessons).length;
  const passedQuizzes = Object.values(progress.quizScores).filter(q => q.passed).length;
  const pct = Math.round(((doneLessons + passedQuizzes) / (totalLessons + totalQuizzes)) * 100);
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = `${pct}% concluído · ${progress.xp} XP`;
}

function updateHeader(progress) {
  if (progress) {
    studentBadge.hidden = false;
    studentNameDisplay.textContent = progress.fullName;
    progressNav.hidden = false;
    updateGlobalProgress(progress);
  } else {
    studentBadge.hidden = true;
    progressNav.hidden = true;
  }
}

function render() {
  const progress = getActiveProgress();
  updateHeader(progress);

  if (!progress) {
    renderWelcome(view, {
      onSubmit(fullName) {
        const p = startStudent(fullName);
        updateHeader(p);
        showToast(`Bem-vindo(a), ${fullName.split(' ')[0]}!`);
        goTo('/');
        render();
      },
    });
    view.focus();
    return;
  }

  const route = parseRoute();
  if (route.name === 'dashboard') {
    renderDashboard(view, progress);
  } else if (route.name === 'module') {
    renderModule(view, route.moduleId, progress);
  } else if (route.name === 'lesson') {
    renderLesson(view, route.moduleId, route.lessonId, progress, () => updateHeader(getActiveProgress()));
  } else if (route.name === 'quiz') {
    renderQuiz(view, route.moduleId, progress);
  }
  view.focus();
}

switchBtn?.addEventListener('click', () => {
  clearActiveStudent();
  goTo('/');
  render();
});

homeBtn?.addEventListener('click', () => {
  goTo('/');
  render();
});

initTheme();
initParticles();
initGlitch();
onRouteChange(render);
