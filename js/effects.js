// Efeitos visuais cyberpunk: chuva de código estilo Matrix + glitch periódico no logo.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // véu semitransparente sobre o quadro anterior: cria o rastro esmaecido da cascata
    ctx.fillStyle = isLight ? 'rgba(238, 243, 247, 0.18)' : 'rgba(6, 8, 16, 0.16)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;
    for (let i = 0; i < columns; i++) {
      const char = CHARS[Math.random() > 0.5 ? 0 : 1];
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;

      // caractere da frente mais claro, o resto esverdeado — com um toque laranja ocasional
      const isHead = Math.random() > 0.93;
      ctx.fillStyle = isHead ? (isLight ? '#0c1a24' : '#d7ffe9') : (Math.random() > 0.9 ? '#ff8a1e' : '#39ff8a');
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
    el.classList.add('glitching');
    setTimeout(() => el.classList.remove('glitching'), 180);
  }, 3500);
}

export function burstConfetti() {
  if (reduceMotion) return;
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const colors = ['#39ff8a', '#ff8a1e', '#4fd8ff'];
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
  if (reduceMotion) { element.textContent = text; return; }
  element.textContent = '';
  let i = 0;
  const id = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(id);
  }, speed);
}
