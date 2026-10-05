// Notificações rápidas (toast) no canto da tela.
export function showToast(message) {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  region.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
