// Efeitos visuais cyberpunk: chuva de código estilo Matrix + glitch periódico no logo.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// o botão "Pausar animações" da barra do topo coloca a classe pausado no <html>
const pausado = () => document.documentElement.classList.contains('pausado');

// as cores vêm do style.css (assim o tema claro e o escuro valem aqui também)
const corDoCss = (nome, reserva) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim() || reserva;

export function initParticles() {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  const FONT_SIZE = 16;
  const CHARS = '01';
  let w, h, columns, drops;

  function setup() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    columns = Math.ceil(w / FONT_SIZE);
    // cada coluna começa numa altura aleatória, para a chuva não "nascer" toda no topo ao mesmo tempo
    drops = Array.from({ length: columns }, () => Math.random() * -100);
  }
  window.addEventListener('resize', setup);
  setup();

  function tick() {
    if (pausado()) {
      ctx.clearRect(0, 0, w, h);
      requestAnimationFrame(tick);
      return;
    }
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // véu semitransparente sobre o quadro anterior: cria o rastro esmaecido da cascata
    ctx.fillStyle = isLight ? 'rgba(238, 243, 247, 0.18)' : 'rgba(6, 8, 16, 0.16)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;
    for (let i = 0; i < columns; i++) {
      const char = CHARS[Math.random() > 0.5 ? 0 : 1];
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;

      // caractere da frente mais claro, o resto no roxo do PHP — com um toque laranja ocasional
      const isHead = Math.random() > 0.93;
      ctx.fillStyle = isHead ? (isLight ? '#0c1a24' : '#eef0ff') : (Math.random() > 0.9 ? corDoCss('--neon-orange', '#ff8a1e') : corDoCss('--neon-green', '#a5a8ff'));
      ctx.globalAlpha = isHead ? 0.9 : (isLight ? 0.35 : 0.55);
      ctx.fillText(char, x, y);

      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();
}

export function initGlitch() {
  const el = document.querySelector('.glitch');
  if (!el || reduceMotion) return;
  setInterval(() => {
    if (pausado()) return;
    el.classList.add('glitching');
    setTimeout(() => el.classList.remove('glitching'), 180);
  }, 3500);
}

export function burstConfetti() {
  if (reduceMotion || pausado()) return;
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const colors = [corDoCss('--neon-green', '#a5a8ff'), corDoCss('--neon-orange', '#ff8a1e'), '#4fd8ff'];
  const bits = Array.from({ length: 60 }, () => ({
    x: w / 2, y: h / 3,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 1) * 8,
    r: Math.random() * 3 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 60,
  }));
  function frame() {
    let alive = false;
    for (const b of bits) {
      if (b.life <= 0) continue;
      alive = true;
      b.x += b.vx; b.y += b.vy; b.vy += 0.15; b.life--;
      ctx.globalAlpha = Math.max(b.life / 60, 0);
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.r, b.r);
    }
    ctx.globalAlpha = 1;
    if (alive) requestAnimationFrame(frame);
  }
  frame();
}

export function typewrite(element, text, speed = 18) {
  if (reduceMotion || pausado()) { element.textContent = text; return; }
  element.textContent = '';
  let i = 0;
  const id = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(id);
  }, speed);
}
