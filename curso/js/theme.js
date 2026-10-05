// Alternância de tema claro/escuro (padrão: escuro), persistida em localStorage.
const KEY_THEME = 'phpexe:theme';

export function getStoredTheme() {
  return localStorage.getItem(KEY_THEME) || 'dark';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(KEY_THEME, theme);
  const icon = document.getElementById('theme-icon');
  const toggle = document.getElementById('theme-toggle');
  if (icon) icon.textContent = theme === 'dark' ? '☾' : '☀';
  if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'light'));
}

export function initTheme() {
  applyTheme(getStoredTheme());
  const toggle = document.getElementById('theme-toggle');
  toggle?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}
