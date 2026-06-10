/* ===== AlgoArcade: reusable quiz "boss" engine ===== */

// mountQuiz(host, topic, onFinish) renders an interactive quiz into `host`.
// onFinish(percent) is called when the player closes the result screen.
function mountQuiz(host, topic, onFinish) {
  const questions = shuffled(topic.quiz);
  let idx = 0;
  let correct = 0;

  function renderQuestion() {
    clear(host);
    const q = questions[idx];
    const wrap = el('div', { class: 'panel' });

    wrap.appendChild(el('div', { class: 'quiz-prog' },
      el('span', { text: `Question ${idx + 1} / ${questions.length}` }),
      el('span', { html: `Score: <b style="color:var(--lime)">${correct}</b>` })
    ));

    wrap.appendChild(el('div', { class: 'quiz-q', html: inlineCode(q.q) }));
    if (q.code) wrap.appendChild(el('div', { class: 'quiz-code', text: q.code }));

    const opts = el('div', { class: 'opts' });
    const order = shuffled(q.opts.map((text, i) => ({ text, i })));
    let answered = false;

    order.forEach(({ text, i }) => {
      const btn = el('button', { class: 'opt', html: inlineCode(text) });
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const isRight = i === q.a;
        if (isRight) { correct++; btn.classList.add('correct'); beep(true); }
        else {
          btn.classList.add('wrong'); beep(false);
          // reveal the correct one
          Array.from(opts.children).forEach((c, ci) => {
            if (order[ci].i === q.a) c.classList.add('correct');
          });
        }
        Array.from(opts.children).forEach((c) => (c.disabled = true));
        wrap.appendChild(el('div', { class: 'explain', html: (isRight ? '✔ ' : '✗ ') + inlineCode(q.explain) }));
        wrap.appendChild(el('div', { class: 'row', style: { marginTop: '14px' } },
          el('div', { class: 'spacer' }),
          el('button', { class: 'btn primary', text: idx + 1 < questions.length ? 'Next →' : 'See results', onclick: next })
        ));
      });
      opts.appendChild(btn);
    });

    wrap.appendChild(opts);
    host.appendChild(wrap);
  }

  function next() {
    idx++;
    if (idx < questions.length) renderQuestion();
    else renderResult();
  }

  function renderResult() {
    clear(host);
    const percent = Math.round((correct / questions.length) * 100);
    const stars = starsFor(percent);
    const passed = percent >= PASS_THRESHOLD;
    const starStr = '★★★'.slice(0, stars) + '<span style="color:#3a3d63">' + '★★★'.slice(stars) + '</span>';

    const card = el('div', { class: 'panel result-big' },
      el('div', { html: passed ? '🎉' : '💪', style: { fontSize: '2.6rem' } }),
      el('h2', { text: passed ? 'Level cleared!' : 'So close — try again!' }),
      el('div', { class: 'score', style: { color: passed ? 'var(--lime)' : 'var(--amber)' }, text: percent + '%' }),
      el('div', { class: 'grad-stars', html: starStr }),
      el('p', { class: 'muted', text: `${correct} of ${questions.length} correct · need ${PASS_THRESHOLD}% to clear` }),
      el('div', { class: 'row', style: { justifyContent: 'center', marginTop: '12px' } },
        el('button', { class: 'btn ghost', text: '↻ Retry', onclick: () => { idx = 0; correct = 0; renderQuestion(); } }),
        el('button', { class: 'btn primary', text: passed ? 'Claim rewards →' : 'Back to map', onclick: () => onFinish(percent) })
      )
    );
    host.appendChild(card);
    if (passed) confetti();
  }

  renderQuestion();
}

// wrap `like this` segments in <code>
function inlineCode(text) {
  const esc = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/`([^`]+)`/g, '<code>$1</code>');
}

function beep(good) {
  if (!State.sound) return;
  try {
    const ctx = beep._ctx || (beep._ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = good ? 880 : 200;
    o.type = good ? 'triangle' : 'sawtooth';
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    o.start(); o.stop(ctx.currentTime + 0.18);
  } catch (e) {}
}
