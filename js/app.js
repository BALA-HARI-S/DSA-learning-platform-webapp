/* ===== AlgoArcade: shell, routing, map / course / level / reader views ===== */

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
function setNav(which) {
  const a = $('#nav-arcade'), c = $('#nav-course');
  if (a) a.classList.toggle('active', which === 'arcade');
  if (c) c.classList.toggle('active', which === 'course');
}
function router() {
  const h = location.hash || '#/';
  let m;
  if (h === '#/course') return renderCourse();
  if ((m = h.match(/^#\/read\/(.+)$/))) { const i = topicIndex(m[1]); if (i >= 0) return renderReaderView(i); }
  if ((m = h.match(/^#\/t\/(.+)$/))) { const i = topicIndex(m[1]); if (i >= 0) return renderLevel(i); }
  renderMap();
}
window.addEventListener('hashchange', router);

/* ---------- helpers ---------- */
function starHtml(id) {
  const s = starsFor(State.scores[id] || 0);
  return '★★★'.slice(0, s).split('').map(() => '★').join('') + '<span class="off">' + '★★★'.slice(s) + '</span>';
}
function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }

// Notes + references + videos block, reused by the Learn tab.
function resourceSections(t) {
  const wrap = el('div');
  if (t.notes && t.notes.length) {
    const p = el('div', { class: 'panel' });
    p.appendChild(el('h3', { class: 'sec-h', text: '📝 Notes & gotchas' }));
    t.notes.forEach((n) => p.appendChild(el('p', { class: 'note', html: inlineCode(n) })));
    wrap.appendChild(p);
  }
  if (t.references && t.references.length) {
    const p = el('div', { class: 'panel' });
    p.appendChild(el('h3', { class: 'sec-h', text: '🔗 References' }));
    const g = el('div', { class: 'res-grid' });
    t.references.forEach((r) => g.appendChild(el('a', { class: 'res-card', href: r.url, target: '_blank', rel: 'noopener' },
      el('span', { class: 'res-kind', text: r.kind || 'link' }),
      el('span', { class: 'res-title', text: r.title }),
      el('span', { class: 'res-host', text: hostOf(r.url) + ' ↗' }))));
    p.appendChild(g); wrap.appendChild(p);
  }
  if (t.videos && t.videos.length) {
    const p = el('div', { class: 'panel' });
    p.appendChild(el('h3', { class: 'sec-h', text: '🎥 Watch' }));
    const g = el('div', { class: 'res-grid' });
    t.videos.forEach((v) => g.appendChild(el('a', { class: 'vid-card', href: v.url, target: '_blank', rel: 'noopener' },
      el('span', { class: 'vid-play', text: '▶' }),
      el('span', { class: 'vid-meta' }, el('span', { class: 'res-title', text: v.title }), el('span', { class: 'res-host', text: v.channel + ' ↗' })))));
    p.appendChild(g); wrap.appendChild(p);
  }
  return wrap;
}

// Compact quick-reference strip shown above the Play area.
function quickRefBar(t, select) {
  const bar = el('div', { class: 'quickref' });
  bar.appendChild(el('span', { class: 'qr-label', text: 'Quick ref:' }));
  bar.appendChild(el('button', { class: 'chip-btn', text: '📖 Learn', onclick: () => select('learn') }));
  bar.appendChild(el('button', { class: 'chip-btn', text: '📚 Full lesson', onclick: () => select('read') }));
  const r = t.references && t.references[0];
  if (r) bar.appendChild(el('a', { class: 'chip-btn', href: r.url, target: '_blank', rel: 'noopener', text: '🔗 ' + r.title }));
  const v = t.videos && t.videos[0];
  if (v) bar.appendChild(el('a', { class: 'chip-btn', href: v.url, target: '_blank', rel: 'noopener', text: '🎥 ' + v.channel }));
  return bar;
}

// Shared markdown reader (used by the Read tab and the #/read route).
function renderReader(host, t) {
  host.appendChild(el('div', { class: 'panel', id: '_md-loading', html: '<span class="muted">Loading lesson…</span>' }));
  loadLesson(t.lesson).then((md) => {
    clear(host);
    host.appendChild(el('div', { class: 'row', style: { marginBottom: '10px' } },
      el('span', { class: 'tag-pill', text: '📖 full course lesson · ' + t.lesson.split('/').pop() }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn primary small', text: '🎮 Play this level →', onclick: () => go('#/t/' + t.id) })));
    renderMarkdown(host, md);
  }).catch(() => {
    clear(host);
    host.appendChild(el('div', { class: 'panel' },
      el('h3', { text: '📄 Open the reader over HTTP' }),
      el('p', { class: 'muted', html: 'The in-app reader fetches the lesson file, which browsers block on <code>file://</code>. View this app on GitHub Pages, or run a local server and reload:' }),
      el('pre', { class: 'codebox', text: 'python3 -m http.server 8000\n# then open http://localhost:8000' }),
      el('p', { html: 'Or read the source directly:' }),
      el('a', { class: 'btn ghost small', href: t.lesson, target: '_blank', rel: 'noopener', text: 'Open ' + t.lesson + ' ↗' })));
  });
}

/* ---------- MAP (arcade skill tree) ---------- */
function renderMap() {
  setNav('arcade'); clear(view);
  const done = completedCount(State);
  view.appendChild(el('div', { class: 'hero' },
    el('h1', { html: 'Play your way through <span class="grad">Data Structures &amp; Algorithms</span>' }),
    el('p', { text: 'Every level pairs a hands-on visualizer with a quiz boss — and a built-in reader for the full lesson. Play in any order; clear quizzes to earn XP, stars, and badges. Progress saves in your browser.' }),
    el('div', { class: 'stats' },
      el('div', { class: 'stat' }, el('b', { text: done + '/' + TOPICS.length }), el('span', { text: 'levels cleared' })),
      el('div', { class: 'stat' }, el('b', { text: State.xp }), el('span', { text: 'total XP' })),
      el('div', { class: 'stat' }, el('b', { text: 'LV ' + levelFromXp(State.xp) }), el('span', { text: 'arcade level' })),
      el('div', { class: 'stat' }, el('b', { text: State.badges.length + '/' + BADGES.length }), el('span', { text: 'badges' }))
    )
  ));
  view.appendChild(el('div', { class: 'section-title' },
    el('h2', { text: '🗺  Skill Tree' }),
    el('span', { class: 'hint', text: 'all levels open · clear them for stars & XP' })));

  const map = el('div', { class: 'map' });
  TOPICS.forEach((t) => {
    const done = isCompleted(t.id);
    const card = el('div', { class: 'node-card' + (done ? ' done' : '') });
    card.appendChild(el('div', { class: 'glow', style: { background: t.color } }));
    card.appendChild(el('div', { class: 'nc-num', text: 'LEVEL ' + String(t.n).padStart(2, '0') }));
    card.appendChild(el('div', { class: 'nc-icon', text: t.icon }));
    card.appendChild(el('div', { class: 'nc-name', text: t.name }));
    card.appendChild(el('div', { class: 'nc-tag', text: t.tag }));
    card.appendChild(el('div', { class: 'nc-foot' },
      el('div', { class: 'stars', html: done ? starHtml(t.id) : '<span class="off">★★★</span>' }),
      el('span', { class: 'tag-pill', text: done ? 'replay' : 'play' })
    ));
    card.addEventListener('click', () => go('#/t/' + t.id));
    map.appendChild(card);
  });
  view.appendChild(map);
  window.scrollTo(0, 0);
}

/* ---------- COURSE library ---------- */
function renderCourse() {
  setNav('course'); clear(view);
  view.appendChild(el('div', { class: 'hero' },
    el('h1', { html: '📚 The <span class="grad">DSA Course</span>, in one place' }),
    el('p', { text: 'Read all 14 lessons right here — the same notes that ship with the repo, rendered inline — then jump into the arcade to practice.' })));
  view.appendChild(el('div', { class: 'section-title' },
    el('h2', { text: 'Lessons' }), el('span', { class: 'hint', text: 'click a card to read' })));
  const grid = el('div', { class: 'map' });
  TOPICS.forEach((t) => {
    const card = el('div', { class: 'node-card' + (isCompleted(t.id) ? ' done' : '') });
    card.appendChild(el('div', { class: 'glow', style: { background: t.color } }));
    card.appendChild(el('div', { class: 'nc-num', text: 'LESSON ' + String(t.n).padStart(2, '0') }));
    card.appendChild(el('div', { class: 'nc-icon', text: t.icon }));
    card.appendChild(el('div', { class: 'nc-name', text: t.name }));
    card.appendChild(el('div', { class: 'nc-tag', text: t.tag }));
    card.appendChild(el('div', { class: 'nc-foot' },
      el('button', { class: 'btn primary tiny', text: '📚 Read', onclick: (e) => { e.stopPropagation(); go('#/read/' + t.id); } }),
      el('button', { class: 'btn ghost tiny', text: '🎮 Play', onclick: (e) => { e.stopPropagation(); go('#/t/' + t.id); } })
    ));
    card.addEventListener('click', () => go('#/read/' + t.id));
    grid.appendChild(card);
  });
  view.appendChild(grid);
  window.scrollTo(0, 0);
}

/* ---------- READER (full-page, #/read/:id) ---------- */
function renderReaderView(idx) {
  const t = TOPICS[idx];
  setNav('course'); clear(view);
  view.appendChild(el('div', { class: 'back', onclick: () => go('#/course'), html: '← Course library' }));
  view.appendChild(el('div', { class: 'level-head' },
    el('div', { class: 'lv-icon', text: t.icon }),
    el('div', {}, el('h1', { text: 'Lesson ' + t.n + ' · ' + t.name }), el('div', { class: 'lv-tag', text: t.tag })),
    el('div', { class: 'spacer' }),
    el('button', { class: 'btn primary', text: '🎮 Play this level', onclick: () => go('#/t/' + t.id) })
  ));
  const body = el('div', { class: 'reader' });
  view.appendChild(body);
  renderReader(body, t);
  window.scrollTo(0, 0);
}

/* ---------- LEVEL view (arcade) ---------- */
function renderLevel(idx) {
  const t = TOPICS[idx];
  setNav('arcade'); clear(view);
  view.appendChild(el('div', { class: 'back', onclick: () => go('#/'), html: '← Back to map' }));
  view.appendChild(el('div', { class: 'level-head' },
    el('div', { class: 'lv-icon', text: t.icon }),
    el('div', {}, el('h1', { text: 'Level ' + t.n + ' · ' + t.name }), el('div', { class: 'lv-tag', text: t.tag })),
    el('div', { class: 'spacer' }),
    el('div', { class: 'stars', html: isCompleted(t.id) ? starHtml(t.id) : '<span class="off">★★★</span>' })
  ));

  const tabsBar = el('div', { class: 'tabs' });
  const body = el('div');
  const tabs = [
    { id: 'learn', label: '📖 Learn' },
    { id: 'read', label: '📚 Read' },
    { id: 'play', label: '🎮 Play' },
    { id: 'quiz', label: '⚔ Challenge' },
  ];
  function select(id) {
    Array.from(tabsBar.children).forEach((c) => c.classList.toggle('active', c.dataset.id === id));
    clear(body);
    if (id === 'learn') renderLearn(body, t, select);
    else if (id === 'read') renderReader(body, t);
    else if (id === 'play') {
      body.appendChild(quickRefBar(t, select));
      const gh = el('div');
      body.appendChild(gh);
      Games[t.play] ? Games[t.play](gh) : gh.appendChild(el('div', { class: 'panel', text: 'Coming soon.' }));
    } else renderChallenge(body, t, idx);
  }
  tabs.forEach((tab) => tabsBar.appendChild(el('div', { class: 'tab', dataset: { id: tab.id }, text: tab.label, onclick: () => select(tab.id) })));
  view.appendChild(tabsBar);
  view.appendChild(body);
  select('learn');
  window.scrollTo(0, 0);
}

function renderLearn(host, t, select) {
  const p = el('div', { class: 'panel' });
  p.appendChild(el('p', { style: { fontSize: '1.02rem', marginTop: 0 }, text: t.learn.summary }));
  const ul = el('ul', { class: 'learn-bullets' });
  t.learn.bullets.forEach((b) => ul.appendChild(el('li', { html: inlineCode(b) })));
  p.appendChild(ul);
  if (t.learn.code) p.appendChild(el('div', { class: 'codebox', html: highlightJava(t.learn.code) }));
  if (t.learn.complexity) {
    const tbl = el('table', { class: 'cx-table' });
    tbl.appendChild(el('tr', {}, el('th', { text: 'Operation' }), el('th', { text: 'Complexity' })));
    t.learn.complexity.forEach(([op, cx]) => tbl.appendChild(el('tr', {}, el('td', { text: op }), el('td', { html: '<code>' + cx + '</code>' }))));
    p.appendChild(tbl);
  }
  p.appendChild(el('div', { class: 'row', style: { marginTop: '14px' } },
    el('button', { class: 'btn primary small', text: '📚 Read the full lesson →', onclick: () => select('read') }),
    el('button', { class: 'btn ghost small', text: '🎮 Play', onclick: () => select('play') }),
    el('button', { class: 'btn magenta small', text: '⚔ Challenge', onclick: () => select('quiz') })
  ));
  host.appendChild(p);
  host.appendChild(resourceSections(t));
}

function renderChallenge(host, t, idx) {
  host.appendChild(el('div', { class: 'panel', style: { marginBottom: '14px' } },
    el('div', { class: 'row' },
      el('div', {}, el('h2', { style: { margin: '0 0 4px' }, text: '⚔ Boss Challenge' }),
        el('div', { class: 'muted', text: `${t.quiz.length} questions · score ${PASS_THRESHOLD}%+ to clear this level` })),
      el('div', { class: 'spacer' }),
      el('div', { class: 'tag-pill', text: isCompleted(t.id) ? 'best: ' + (State.scores[t.id]) + '%' : 'not cleared yet' })
    )));
  const quizHost = el('div');
  host.appendChild(quizHost);
  mountQuiz(quizHost, t, (percent) => {
    const res = recordResult(t.id, percent);
    updateHud();
    if (res.passed) celebrate(res, idx);
    else toast('Need ' + PASS_THRESHOLD + '% to clear — give it another go!');
    go('#/');
  });
}

/* ---------- celebration ---------- */
function celebrate(res, idx) {
  const t = TOPICS[idx];
  const lines = [];
  if (res.firstClear) lines.push('Level cleared for the first time!');
  lines.push('+' + res.gained + ' XP');
  if (res.leveledUp) lines.push('⬆ Arcade level up — now LV ' + levelFromXp(State.xp) + '!');
  const next = TOPICS[idx + 1];
  if (next) lines.push('Up next: ' + next.name);

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
    next ? el('button', { class: 'btn primary', text: 'Next: ' + next.name + ' →', onclick: () => { hideOverlay(); go('#/t/' + next.id); } }) : el('button', { class: 'btn primary', text: 'Back to map', onclick: () => { hideOverlay(); go('#/'); } }),
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
$('#nav-arcade').addEventListener('click', () => go('#/'));
$('#nav-course').addEventListener('click', () => go('#/course'));
$('#btn-badges').addEventListener('click', showBadges);
$('#btn-reset').addEventListener('click', () => {
  if (confirm('Reset ALL progress (XP, stars, badges)? This cannot be undone.')) {
    resetState(); updateHud(); toast('Progress reset.'); go('#/'); router();
  }
});
updateHud();
router();
