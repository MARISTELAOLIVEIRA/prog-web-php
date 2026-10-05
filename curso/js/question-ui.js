// Renderização e verificação de perguntas interativas (múltipla escolha / preencher lacuna).

function normalize(str) {
  return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function renderQuestion(question, { onAnswered } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'question-box';

  const prompt = document.createElement('p');
  prompt.className = 'q-prompt';
  prompt.textContent = question.prompt;
  wrap.appendChild(prompt);

  const feedback = document.createElement('p');
  feedback.className = 'q-feedback';
  feedback.setAttribute('role', 'status');

  let answered = false;

  function finish(isCorrect) {
    if (answered) return;
    answered = true;
    feedback.textContent = (isCorrect ? '✔ Correto! ' : '✘ Quase — ') + question.explain;
    feedback.classList.add(isCorrect ? 'ok' : 'no');
    onAnswered?.(isCorrect);
  }

  if (question.kind === 'mc') {
    const list = document.createElement('ul');
    list.className = 'q-options';
    question.options.forEach((opt, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (answered) return;
        const isCorrect = idx === question.answer;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) {
          const correctBtn = list.querySelectorAll('button')[question.answer];
          correctBtn.classList.add('correct');
        }
        [...list.querySelectorAll('button')].forEach(b => b.disabled = true);
        finish(isCorrect);
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
    wrap.appendChild(list);
  } else if (question.kind === 'fill') {
    const form = document.createElement('form');
    form.className = 'fill-form';
    form.setAttribute('novalidate', '');
    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('aria-label', 'Sua resposta');
    input.placeholder = 'Digite sua resposta...';
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'btn';
    submit.textContent = 'Verificar';
    form.append(input, submit);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (answered) return;
      const val = normalize(input.value);
      const isCorrect = question.answers.some(a => normalize(a) === val);
      input.disabled = true;
      submit.disabled = true;
      finish(isCorrect);
    });
    wrap.appendChild(form);
  }

  wrap.appendChild(feedback);
  return wrap;
}
