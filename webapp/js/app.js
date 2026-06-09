/* ===== AlgoArcade: shell, routing, map & level views, bootstrap ===== */

const view = $('#view');

/* ---------- HUD ---------- */
function updateHud() {
  $('#hud-level').textContent = 'LV ' + levelFromXp(State.xp);
  $('#xp-fill').style.width = xpIntoLevel(State.xp) + '%';
  $('#xp-text').textContent = xpIntoLevel(State.xp) + ' / 100 XP';
  $('#badge-count').textContent = State.badges.length;
}

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast'); t.innerHTML = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- overlay ---------- */
function showOverlay(node) {
  const card = $('#overlay-card'); clear(card); card.appendChild(node);
  $('#overlay').classList.remove('hidden');
}
function hideOverlay() { $('#overlay').classList.add('hidden'); }
$('#overlay').addEventListener('click', (e) => { if (e.target.id === 'overlay') hideOverlay(); });

/* ---------- routing ---------- */
function go(hash) { location.hash = hash; }
function router() {
  const h = location.hash || '#/';
  const m = h.match(/^#\/t\/(.+)$/);
  if (m) {
    const idx = topicIndex(m[1]);
    if (idx >= 0 && isUnlocked(idx)) return renderLevel(idx);
  }
  renderMap();
}
window.addEventListener('hashchange', router);

/* ---------- star helper ---------- */
function starHtml(id) {
  const s = starsFor(State.scores[id] || 0);
  return '★★★'.slice(0, s).split('').map(() => '★').join('') +
    '<span class="off">' + '★★★'.slice(s) + '</span>';
}

/* ---------- MAP (skill tree) ---------- */
function renderMap() {
  clear(view);
  const done = completedCount(State);
  const hero = el('div', { class: 'hero' },
    el('h1', { html: 'Play your way through <span class="grad">Data Structures &amp; Algorithms</span>' }),
    el('p', { text: 'Each level pairs a hands-on visualizer with a quiz boss. Clear it to earn XP, stars, and badges — then the next level unlocks. Progress saves in your browser.' }),
    el('div', { class: 'stats' },
      el('div', { class: 'stat' }, el('b', { text: done + '/' + TOPICS.length }), el('span', { text: 'levels cleared' })),
      el('div', { class: 'stat' }, el('b', { text: State.xp }), el('span', { text: 'total XP' })),
      el('div', { class: 'stat' }, el('b', { text: 'LV ' + levelFromXp(State.xp) }), el('span', { text: 'arcade level' })),
      el('div', { class: 'stat' }, el('b', { text: State.badges.length + '/' + BADGES.length }), el('span', { text: 'badges' }))
    )
  );
  view.appendChild(hero);
  view.appendChild(el('div', { class: 'section-title' },
    el('h2', { text: '🗺  Skill Tree' }),
    el('span', { class: 'hint', text: 'clear a level to unlock the next' })));

  const map = el('div', { class: 'map' });
  TOPICS.forEach((t, i) => {
    const unlocked = isUnlocked(i), done = isCompleted(t.id);
    const card = el('div', { class: 'node-card' + (unlocked ? '' : ' locked') + (done ? ' done' : '') });
    card.appendChild(el('div', { class: 'glow', style: { background: t.color } }));
    card.appendChild(el('div', { class: 'nc-num', text: 'LEVEL ' + String(t.n).padStart(2, '0') }));
    card.appendChild(el('div', { class: 'nc-icon', text: t.icon }));
    card.appendChild(el('div', { class: 'nc-name', text: t.name }));
    card.appendChild(el('div', { class: 'nc-tag', text: t.tag }));
    card.appendChild(el('div', { class: 'nc-foot' },
      el('div', { class: 'stars', html: done ? starHtml(t.id) : '<span class="off">★★★</span>' }),
      el('span', { class: 'tag-pill', text: unlocked ? (done ? 'replay' : 'play') : 'locked' })
    ));
    card.addEventListener('click', () => {
      if (!unlocked) return toast('🔒 Clear level ' + (i) + ' first to unlock this.');
      go('#/t/' + t.id);
    });
    map.appendChild(card);
  });
  view.appendChild(map);
  window.scrollTo(0, 0);
}

/* ---------- LEVEL view ---------- */
function renderLevel(idx) {
  const t = TOPICS[idx];
  clear(view);
  view.appendChild(el('div', { class: 'back', onclick: () => go('#/'), html: '← Back to map' }));
  view.appendChild(el('div', { class: 'level-head' },
    el('div', { class: 'lv-icon', text: t.icon }),
    el('div', {},
      el('h1', { text: 'Level ' + t.n + ' · ' + t.name }),
      el('div', { class: 'lv-tag', text: t.tag })),
    el('div', { class: 'spacer' }),
    el('div', { class: 'stars', html: isCompleted(t.id) ? starHtml(t.id) : '<span class="off">★★★</span>' })
  ));

  const tabsBar = el('div', { class: 'tabs' });
  const body = el('div');
  const tabs = [
    { id: 'learn', label: '📖 Learn' },
    { id: 'play', label: '🎮 Play' },
    { id: 'quiz', label: '⚔ Challenge' },
  ];
  let active = 'learn';
  function select(id) {
    active = id;
    Array.from(tabsBar.children).forEach((c) => c.classList.toggle('active', c.dataset.id === id));
    clear(body);
    if (id === 'learn') renderLearn(body, t);
    else if (id === 'play') Games[t.play] ? Games[t.play](body) : body.appendChild(el('div', { class: 'panel', text: 'Coming soon.' }));
    else renderChallenge(body, t, idx);
  }
  tabs.forEach((tab) => {
    const el2 = el('div', { class: 'tab', dataset: { id: tab.id }, text: tab.label, onclick: () => select(tab.id) });
    tabsBar.appendChild(el2);
  });
  view.appendChild(tabsBar);
  view.appendChild(body);
  select('learn');
  window.scrollTo(0, 0);
}

function renderLearn(host, t) {
  const p = el('div', { class: 'panel' });
  p.appendChild(el('p', { style: { fontSize: '1.02rem', marginTop: 0 }, text: t.learn.summary }));
  const ul = el('ul', { class: 'learn-bullets' });
  t.learn.bullets.forEach((b) => ul.appendChild(el('li', { html: inlineCode(b) })));
  p.appendChild(ul);
  if (t.learn.code) {
    p.appendChild(el('div', { class: 'codebox', html: highlightJava(t.learn.code) }));
  }
  if (t.learn.complexity) {
    const tbl = el('table', { class: 'cx-table' });
    tbl.appendChild(el('tr', {}, el('th', { text: 'Operation' }), el('th', { text: 'Complexity' })));
    t.learn.complexity.forEach(([op, cx]) => tbl.appendChild(el('tr', {}, el('td', { text: op }), el('td', { html: '<code>' + cx + '</code>' }))));
    p.appendChild(tbl);
  }
  host.appendChild(p);
  host.appendChild(el('div', { class: 'row', style: { marginTop: '14px' } },
    el('span', { class: 'muted', text: 'Read it, then hit ' }),
    el('button', { class: 'btn primary small', text: '🎮 Play →', onclick: () => $$('.tab')[1].click() }),
    el('span', { class: 'muted', text: ' and ' }),
    el('button', { class: 'btn magenta small', text: '⚔ Challenge', onclick: () => $$('.tab')[2].click() })
  ));
}

function renderChallenge(host, t, idx) {
  const intro = el('div', { class: 'panel', style: { marginBottom: '14px' } },
    el('div', { class: 'row' },
      el('div', {}, el('h2', { style: { margin: '0 0 4px' }, text: '⚔ Boss Challenge' }),
        el('div', { class: 'muted', text: `${t.quiz.length} questions · score ${PASS_THRESHOLD}%+ to clear this level` })),
      el('div', { class: 'spacer' }),
      el('div', { class: 'tag-pill', text: isCompleted(t.id) ? 'best: ' + (State.scores[t.id]) + '%' : 'not cleared yet' })
    ));
  host.appendChild(intro);
  const quizHost = el('div');
  host.appendChild(quizHost);
  mountQuiz(quizHost, t, (percent) => {
    const res = recordResult(t.id, percent);
    updateHud();
    if (res.passed) celebrate(res, idx);
    else { toast('Need ' + PASS_THRESHOLD + '% to clear — give it another go!'); }
    go('#/');
  });
}

/* ---------- celebration after clearing ---------- */
function celebrate(res, idx) {
  const t = TOPICS[idx];
  const lines = [];
  if (res.firstClear) lines.push('Level cleared for the first time!');
  lines.push('+' + res.gained + ' XP');
  if (res.leveledUp) lines.push('⬆ Arcade level up — now LV ' + levelFromXp(State.xp) + '!');
  const next = TOPICS[idx + 1];
  if (res.firstClear && next) lines.push('🔓 Unlocked: ' + next.name);

  const card = el('div', {},
    el('div', { style: { fontSize: '3rem' }, text: '🏆' }),
    el('h2', { text: t.name + ' cleared!' }),
    el('div', { class: 'grad-stars', style: { fontSize: '2rem', margin: '6px 0' }, html: starHtml(t.id) }),
    ...lines.map((l) => el('p', { style: { margin: '4px 0' }, html: l })),
  );
  if (res.newBadges.length) {
    card.appendChild(el('div', { class: 'section-title', style: { justifyContent: 'center' } }, el('h2', { text: '🏅 New badge' + (res.newBadges.length > 1 ? 's' : '') + '!' })));
    const bg = el('div', { class: 'badge-grid' });
    res.newBadges.forEach((b) => bg.appendChild(el('div', { class: 'badge' }, el('div', { class: 'b-ico', text: b.ico }), el('div', { class: 'b-name', text: b.name }), el('div', { class: 'b-desc', text: b.desc }))));
    card.appendChild(bg);
  }
  card.appendChild(el('div', { class: 'row', style: { justifyContent: 'center', marginTop: '16px' } },
    next ? el('button', { class: 'btn primary', text: 'Next level: ' + next.name + ' →', onclick: () => { hideOverlay(); go('#/t/' + next.id); } }) : el('button', { class: 'btn primary', text: 'Back to map', onclick: () => { hideOverlay(); go('#/'); } }),
    el('button', { class: 'btn ghost', text: 'Map', onclick: () => { hideOverlay(); go('#/'); } })
  ));
  showOverlay(card);
  confetti();
}

/* ---------- badges overlay ---------- */
function showBadges() {
  const card = el('div', {}, el('h2', { text: '🏅 Badges' }), el('p', { class: 'muted', text: State.badges.length + ' of ' + BADGES.length + ' earned' }));
  const grid = el('div', { class: 'badge-grid' });
  BADGES.forEach((b) => {
    const earned = State.badges.includes(b.id);
    grid.appendChild(el('div', { class: 'badge' + (earned ? '' : ' locked') },
      el('div', { class: 'b-ico', text: earned ? b.ico : '🔒' }),
      el('div', { class: 'b-name', text: b.name }),
      el('div', { class: 'b-desc', text: b.desc })));
  });
  card.appendChild(grid);
  card.appendChild(el('div', { style: { marginTop: '16px' } }, el('button', { class: 'btn primary', text: 'Close', onclick: hideOverlay })));
  showOverlay(card);
}

/* ---------- bootstrap ---------- */
$('#brand').addEventListener('click', () => go('#/'));
$('#btn-badges').addEventListener('click', showBadges);
$('#btn-reset').addEventListener('click', () => {
  if (confirm('Reset ALL progress (XP, stars, badges)? This cannot be undone.')) {
    resetState(); updateHud(); toast('Progress reset.'); go('#/'); router();
  }
});
updateHud();
router();
