// O tema do curso segue o botão de tema da barra do topo (placa.js grava data-tema="claro" no <html>).
export function initTheme() {
  const raiz = document.documentElement;
  function sincroniza() {
    raiz.setAttribute('data-theme', raiz.dataset.tema === 'claro' ? 'light' : 'dark');
  }
  sincroniza();
  new MutationObserver(sincroniza).observe(raiz, { attributes: true, attributeFilter: ['data-tema'] });
}
