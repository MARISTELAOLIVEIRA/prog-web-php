// Camada de persistência local (sem backend — GitHub Pages é estático).
const KEY_CURRENT = 'phpexe:currentStudent';
const KEY_PREFIX = 'phpexe:student:';

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function emptyProgress(fullName) {
  return {
    fullName,
    createdAt: new Date().toISOString(),
    completedLessons: {},   // { 'm1-l1': true, ... }
    quizScores: {},         // { 'm1': { score: 4, total: 5, passed: true } }
    xp: 0,
  };
}

export function getCurrentStudentSlug() {
  return localStorage.getItem(KEY_CURRENT);
}

export function loadProgress(slug) {
  const raw = localStorage.getItem(KEY_PREFIX + slug);
  return raw ? JSON.parse(raw) : null;
}

export function saveProgress(progress) {
  const slug = slugify(progress.fullName);
  localStorage.setItem(KEY_PREFIX + slug, JSON.stringify(progress));
  localStorage.setItem(KEY_CURRENT, slug);
}

export function startStudent(fullName) {
  const slug = slugify(fullName);
  let progress = loadProgress(slug);
  if (!progress) progress = emptyProgress(fullName.trim());
  saveProgress(progress);
  return progress;
}

export function getActiveProgress() {
  const slug = getCurrentStudentSlug();
  if (!slug) return null;
  return loadProgress(slug);
}

export function clearActiveStudent() {
  localStorage.removeItem(KEY_CURRENT);
}

export function markLessonComplete(progress, lessonId) {
  if (!progress.completedLessons[lessonId]) {
    progress.completedLessons[lessonId] = true;
    progress.xp += 10;
    saveProgress(progress);
  }
}

export function saveQuizScore(progress, moduleId, score, total) {
  progress.quizScores[moduleId] = { score, total, passed: score / total >= 0.6 };
  progress.xp += score * 5;
  saveProgress(progress);
}

export function isModuleComplete(progress, moduleId, lessonIds) {
  const allLessonsDone = lessonIds.every(id => progress.completedLessons[id]);
  const quiz = progress.quizScores[moduleId];
  return allLessonsDone && !!quiz && quiz.passed;
}
