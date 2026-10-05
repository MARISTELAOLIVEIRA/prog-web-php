// Roteador simples baseado em hash (#/...), compatível com GitHub Pages (sem servidor).
export function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);
  if (parts[0] === 'module' && parts[1] && parts[2] === 'lesson' && parts[3]) {
    return { name: 'lesson', moduleId: parts[1], lessonId: parts[3] };
  }
  if (parts[0] === 'module' && parts[1] && parts[2] === 'quiz') {
    return { name: 'quiz', moduleId: parts[1] };
  }
  if (parts[0] === 'module' && parts[1]) {
    return { name: 'module', moduleId: parts[1] };
  }
  return { name: 'dashboard' };
}

export function goTo(path) {
  location.hash = path;
}

export function onRouteChange(handler) {
  window.addEventListener('hashchange', handler);
  window.addEventListener('DOMContentLoaded', handler);
}
