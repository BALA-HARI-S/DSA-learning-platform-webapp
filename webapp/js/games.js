/* ===== AlgoArcade: interactive games / visualizers (one per topic) ===== */
var Games = {};

/* ---------- shared building blocks ---------- */
function playArea(host) {
  const controls = el('div', { class: 'controls' });
  const stage = el('div', { class: 'stage' });
  const readout = el('div', { class: 'readout' });
  host.appendChild(el('div', { class: 'playwrap' }, controls, stage, readout));
  return { controls, stage, readout };
}
function makeCanvas(host, w, h) {
  const c = el('canvas', { width: w, height: h });
  host.appendChild(c);
  return { c, x: c.getContext('2d'), w, h };
}
// returns a function giving ms-per-step from a 1..100 slider (fast at 100)
function speedControl(controls, val) {
  const r = el('input', { type: 'range', min: 1, max: 100, value: val == null ? 55 : val });
  controls.appendChild(el('label', {}, 'Speed', r));
  return () => 280 - r.value * 2.55;
}
function btn(label, cls, fn) { return el('button', { class: 'btn ' + (cls || 'ghost') + ' small', text: label, onclick: fn }); }

/* ============================================================
   1. COMPLEXITY — interactive growth chart
   ============================================================ */
Games.complexity = function (host) {
  const { controls, stage, readout } = playArea(host);
  const nRange = el('input', { type: 'range', min: 1, max: 64, value: 16 });
  controls.appendChild(el('label', {}, 'Input size  n', nRange));
  controls.appendChild(el('span', { class: 'tag-pill', html: 'drag n — watch the slow ones explode' }));
  const { c, x, w, h } = makeCanvas(stage, 720, 320);
  const fns = [
    { name: 'O(1)', col: '#8a8fb8', f: () => 1 },
    { name: 'O(log n)', col: '#2ce6e6', f: (n) => Math.log2(n) },
    { name: 'O(n)', col: '#7cff5b', f: (n) => n },
    { name: 'O(n log n)', col: '#ffc34d', f: (n) => n * Math.log2(n) },
    { name: 'O(n²)', col: '#ff4fd8', f: (n) => n * n },
    { name: 'O(2ⁿ)', col: '#ff5d6c', f: (n) => Math.pow(2, n) },
  ];
  function fmt(v) {
    if (v < 1000) return Math.round(v).toString();
    if (v < 1e6) return Math.round(v).toLocaleString();
    return v.toExponential(1);
  }
  function draw() {
    const n = +nRange.value;
    const pad = 36, gw = w - pad * 2, gh = h - pad * 2;
    const yMax = n * n; // scale to O(n²); 2^n will clip (that's the point)
    x.clearRect(0, 0, w, h);
    x.strokeStyle = '#2a2d52'; x.lineWidth = 1;
    x.strokeRect(pad, pad, gw, gh);
    x.fillStyle = '#8a8fb8'; x.font = '12px monospace';
    x.fillText('operations', pad, pad - 12);
    x.fillText('n = ' + n, w - pad - 50, h - pad + 22);
    for (const fn of fns) {
      x.beginPath(); x.strokeStyle = fn.col; x.lineWidth = 2.2;
      for (let i = 1; i <= n; i++) {
        const px = pad + (i / n) * gw;
        const py = pad + gh - clamp(fn.f(i) / yMax, 0, 1.02) * gh;
        if (i === 1) x.moveTo(px, py); else x.lineTo(px, py);
      }
      x.stroke();
    }
    // readout table
    clear(readout);
    const tbl = el('table', { class: 'cx-table' });
    tbl.appendChild(el('tr', {}, el('th', { text: 'Class' }), el('th', { text: `ops at n=${n}` })));
    for (const fn of fns) {
      tbl.appendChild(el('tr', {},
        el('td', { html: `<span style="color:${fn.col}">●</span> <code>${fn.name}</code>` }),
        el('td', { text: fmt(fn.f(n)) })));
    }
    readout.appendChild(tbl);
  }
  nRange.addEventListener('input', draw);
  draw();
};

/* ============================================================
   2. ARRAYS — two pointers & sliding window over bars
   ============================================================ */
Games.array = function (host) {
  const { controls, stage, readout } = playArea(host);
  let arr = Array.from({ length: 12 }, () => randInt(6, 40));
  const runner = makeRunner();
  const box = el('div', { class: 'bars' }); stage.appendChild(box);
  let bars = [];
  const speed = speedControl(controls, 50);
  const H = 220;
  function render() {
    clear(box);
    bars = arr.map((v) => { const b = el('div', { class: 'bar', style: { height: (v / 40 * H) + 'px' } }, el('span', { style: { position: 'absolute', bottom: '-18px', left: 0, right: 0, textAlign: 'center', fontSize: '10px', color: '#8a8fb8' }, text: v })); box.appendChild(b); return b; });
  }
  const setH = (i) => { bars[i].style.height = (arr[i] / 40 * H) + 'px'; };
  const marks = () => bars.forEach((b) => (b.className = 'bar'));
  const say = (h) => (readout.innerHTML = h);

  async function reverse() {
    const t = runner.start(); marks(); let l = 0, r = arr.length - 1;
    while (l < r) {
      if (!runner.alive(t)) return;
      bars[l].classList.add('ptr'); bars[r].classList.add('ptr');
      say(`Two pointers: swap index <b>${l}</b> ↔ <b>${r}</b>`);
      await sleep(speed());
      [arr[l], arr[r]] = [arr[r], arr[l]]; setH(l); setH(r);
      await sleep(speed());
      bars[l].classList.remove('ptr'); bars[r].classList.remove('ptr');
      bars[l].classList.add('done'); bars[r].classList.add('done');
      l++; r--;
    }
    if (l === r) bars[l].classList.add('done');
    say('Reversed in place — <b>O(n)</b> time, <b>O(1)</b> space.');
  }
  async function window3() {
    const t = runner.start(); marks(); const k = 3;
    let sum = 0; for (let i = 0; i < k; i++) sum += arr[i];
    let best = sum, bestAt = 0;
    for (let i = 0; i < k; i++) bars[i].classList.add('cmp');
    say(`Window [0..${k - 1}] sum = <b>${sum}</b>`); await sleep(speed() * 2);
    for (let r = k; r < arr.length; r++) {
      if (!runner.alive(t)) return;
      bars[r - k].classList.remove('cmp');
      sum += arr[r] - arr[r - k]; bars[r].classList.add('cmp');
      if (sum > best) { best = sum; bestAt = r - k + 1; }
      say(`slide → window [${r - k + 1}..${r}] sum = <b>${sum}</b> · best so far <b>${best}</b>`);
      await sleep(speed() * 1.5);
    }
    marks();
    for (let i = bestAt; i < bestAt + k; i++) bars[i].classList.add('done');
    say(`Max window sum = <b>${best}</b> — sliding window is <b>O(n)</b>, not O(n·k).`);
  }
  async function twoSum() {
    const t = runner.start(); arr.sort((a, b) => a - b); render(); marks();
    const target = arr[2] + arr[arr.length - 3];
    let l = 0, r = arr.length - 1;
    while (l < r) {
      if (!runner.alive(t)) return;
      bars[l].classList.add('ptr'); bars[r].classList.add('ptr');
      const s = arr[l] + arr[r];
      say(`sorted · target <b>${target}</b> · arr[${l}]+arr[${r}] = ${arr[l]}+${arr[r]} = <b>${s}</b>`);
      await sleep(speed() * 1.6);
      if (s === target) { bars[l].classList.add('done'); bars[r].classList.add('done'); say(`Found pair summing to <b>${target}</b> → indices ${l}, ${r}. <b>O(n)</b>.`); return; }
      bars[l].classList.remove('ptr'); bars[r].classList.remove('ptr');
      if (s < target) l++; else r--;
    }
  }
  controls.appendChild(btn('↔ Reverse', 'primary', reverse));
  controls.appendChild(btn('▭ Max window (k=3)', 'primary', window3));
  controls.appendChild(btn('🎯 Two-sum (sorted)', 'primary', twoSum));
  controls.appendChild(btn('🔀 Shuffle', 'ghost', () => { runner.stop(); arr = Array.from({ length: 12 }, () => randInt(6, 40)); render(); say(''); }));
  render();
  say('Pick a technique to watch the pointers move.');
};

/* ============================================================
   3. STRINGS — palindrome (two pointers) + anagram check
   ============================================================ */
Games.strings = function (host) {
  const { controls, stage, readout } = playArea(host);
  const input = el('input', { type: 'text', value: 'racecar', size: 16, maxlength: 18 });
  const input2 = el('input', { type: 'text', value: 'silent', size: 12, maxlength: 18 });
  const runner = makeRunner();
  const cellsBox = el('div', { class: 'cells', style: { marginBottom: '14px' } });
  const anaBox = el('div');
  stage.appendChild(cellsBox); stage.appendChild(anaBox);
  const say = (h) => (readout.innerHTML = h);

  async function palindrome() {
    const t = runner.start(); const s = input.value; clear(cellsBox); clear(anaBox);
    const cells = s.split('').map((ch) => { const e = el('div', { class: 'cell', text: ch }); cellsBox.appendChild(e); return e; });
    let l = 0, r = s.length - 1, ok = true;
    while (l < r) {
      if (!runner.alive(t)) return;
      cells[l].classList.add('hot'); cells[r].classList.add('hot');
      say(`compare '${s[l]}' vs '${s[r]}'`); await sleep(240);
      if (s[l] !== s[r]) { ok = false; cells[l].style.background = 'var(--red)'; cells[r].style.background = 'var(--red)'; break; }
      await sleep(160); cells[l].classList.remove('hot'); cells[r].classList.remove('hot'); l++; r--;
    }
    say(ok ? `✔ "<b>${s}</b>" is a palindrome — two pointers, <b>O(n)</b>.` : `✗ "<b>${s}</b>" is NOT a palindrome.`);
  }
  function anagram() {
    runner.stop(); clear(cellsBox); clear(anaBox);
    const a = input.value.replace(/\s/g, ''), b = input2.value.replace(/\s/g, '');
    const count = {}; for (const ch of a) count[ch] = (count[ch] || 0) + 1; for (const ch of b) count[ch] = (count[ch] || 0) - 1;
    const keys = Object.keys(count).sort();
    const tbl = el('table', { class: 'cx-table' });
    tbl.appendChild(el('tr', {}, el('th', { text: 'char' }), ...keys.map((k) => el('th', { text: k }))));
    tbl.appendChild(el('tr', {}, el('td', { text: 'balance' }), ...keys.map((k) => el('td', { html: count[k] === 0 ? '<span style="color:var(--lime)">0</span>' : `<span style="color:var(--red)">${count[k]}</span>` }))));
    anaBox.appendChild(tbl);
    const ok = a.length === b.length && keys.every((k) => count[k] === 0);
    say(ok ? `✔ "<b>${a}</b>" and "<b>${b}</b>" are anagrams (all balances 0).` : `✗ Not anagrams — some character counts differ.`);
  }
  controls.appendChild(el('label', {}, 'Word', input));
  controls.appendChild(btn('Check palindrome', 'primary', palindrome));
  controls.appendChild(el('label', {}, 'vs', input2));
  controls.appendChild(btn('Check anagram', 'magenta', anagram));
  palindrome();
};

/* ============================================================
   4. LINKED LISTS — build, reverse, slow/fast middle
   ============================================================ */
Games.linkedlist = function (host) {
  const { controls, stage, readout } = playArea(host);
  let list = [3, 7, 1, 9, 4];
  const runner = makeRunner();
  const box = el('div', { class: 'll' }); stage.appendChild(box);
  let nodes = [];
  const say = (h) => (readout.innerHTML = h);
  function render() {
    clear(box); nodes = [];
    list.forEach((v, i) => {
      const n = el('div', { class: 'node', text: v }); nodes.push(n); box.appendChild(n);
      box.appendChild(el('span', { class: 'arrow', text: i < list.length - 1 ? '→' : '→ null' }));
    });
  }
  async function reverse() {
    const t = runner.start();
    for (let i = 0; i < list.length; i++) { if (!runner.alive(t)) return; nodes[i].classList.add('hot'); say('flipping pointers: prev ← cur'); await sleep(260); }
    list.reverse(); render(); say('Reversed by flipping each <b>next</b> pointer — <b>O(n)</b>, O(1) space.');
  }
  async function middle() {
    const t = runner.start(); render(); let slow = 0, fast = 0;
    while (fast < list.length && fast + 1 < list.length) {
      if (!runner.alive(t)) return;
      nodes.forEach((n) => (n.className = 'node'));
      nodes[slow].classList.add('hot'); nodes[slow].style.outline = '2px solid var(--cyan)';
      nodes[fast].style.outline = '2px dashed var(--amber)';
      say(`slow at ${slow}, fast at ${fast} (fast moves 2×)`); await sleep(420);
      nodes[fast].style.outline = ''; slow++; fast += 2;
    }
    nodes.forEach((n) => (n.className = 'node'));
    nodes[slow] && nodes[slow].classList.add('hot');
    say(`Middle is node index <b>${slow}</b> (value ${list[slow]}). Found with slow/fast in one pass.`);
  }
  controls.appendChild(btn('+ append', 'ghost', () => { runner.stop(); list.push(randInt(1, 9)); render(); }));
  controls.appendChild(btn('+ prepend', 'ghost', () => { runner.stop(); list.unshift(randInt(1, 9)); render(); }));
  controls.appendChild(btn('↩ Reverse', 'primary', reverse));
  controls.appendChild(btn('⚑ Find middle (slow/fast)', 'primary', middle));
  controls.appendChild(btn('⟲ Reset', 'ghost', () => { runner.stop(); list = [3, 7, 1, 9, 4]; render(); say(''); }));
  render();
  say('A chain of nodes. Try reversing or finding the middle.');
};

/* ============================================================
   5. STACKS — playground + balanced-brackets game
   ============================================================ */
Games.stack = function (host) {
  const { controls, stage, readout } = playArea(host);
  let stack = [];
  const runner = makeRunner();
  const col = el('div', { class: 'stack-col' });
  const base = el('div', { class: 'muted', style: { marginTop: '6px' }, text: '▔▔▔ bottom ▔▔▔' });
  stage.appendChild(col); stage.appendChild(base);
  const say = (h) => (readout.innerHTML = h);
  function render() { clear(col); stack.forEach((v, i) => col.appendChild(el('div', { class: 'cell' + (i === stack.length - 1 ? ' hot' : ''), text: v }))); }
  function push(v) { runner.stop(); stack.push(v); render(); say(`push(${v}) — top is now ${v}. O(1).`); }
  function pop() { runner.stop(); if (!stack.length) return say('Stack is empty!'); const v = stack.pop(); render(); say(`pop() → ${v}. LIFO: last in, first out.`); }

  const bracketIn = el('input', { type: 'text', value: '{[()]}', size: 14, maxlength: 20 });
  async function checkBrackets() {
    const t = runner.start(); stack = []; render();
    const s = bracketIn.value; const open = { '(': ')', '[': ']', '{': '}' }; const close = { ')': '(', ']': '[', '}': '{' };
    for (const ch of s) {
      if (!runner.alive(t)) return;
      if (open[ch]) { stack.push(ch); render(); say(`'${ch}' is an opener → push`); }
      else if (close[ch]) {
        if (!stack.length || stack[stack.length - 1] !== close[ch]) { render(); say(`✗ '${ch}' has no matching opener → <b style="color:var(--red)">NOT balanced</b>`); return; }
        stack.pop(); render(); say(`'${ch}' matches the top → pop`);
      }
      await sleep(420);
    }
    say(stack.length === 0 ? `✔ "<b>${s}</b>" is <b style="color:var(--lime)">balanced</b>!` : `✗ leftover openers → <b style="color:var(--red)">NOT balanced</b>`);
  }
  controls.appendChild(btn('push random', 'primary', () => push(randInt(1, 99))));
  controls.appendChild(btn('pop', 'magenta', pop));
  controls.appendChild(el('span', { class: 'tag-pill', text: 'or play the bracket game ▶' }));
  controls.appendChild(el('label', {}, 'brackets', bracketIn));
  controls.appendChild(btn('Run match', 'primary', checkBrackets));
  render();
  say('Push/pop to feel LIFO, or run the balanced-brackets matcher.');
};

/* ============================================================
   6. QUEUES — circular buffer enqueue/dequeue
   ============================================================ */
Games.queue = function (host) {
  const { controls, stage, readout } = playArea(host);
  const CAP = 8;
  let buf = new Array(CAP).fill(null), head = 0, tail = 0, size = 0, counter = 1;
  const box = el('div', { class: 'cells', style: { justifyContent: 'center' } });
  stage.appendChild(box);
  const say = (h) => (readout.innerHTML = h);
  function render() {
    clear(box);
    for (let i = 0; i < CAP; i++) {
      const isHead = size > 0 && i === head, isTail = size > 0 && i === tail % CAP && size < CAP;
      const cell = el('div', { class: 'cell' + (buf[i] != null ? ' hot' : ' ghost'), text: buf[i] != null ? buf[i] : '·' });
      const tags = el('div', { style: { textAlign: 'center', fontSize: '10px', color: 'var(--muted)', minHeight: '14px' }, text: (isHead ? 'head' : '') + (isHead && isTail ? '/' : '') + (isTail ? 'tail' : '') });
      box.appendChild(el('div', {}, cell, tags));
    }
  }
  function enqueue() {
    if (size === CAP) return say('Queue is full (fixed circular buffer).');
    const v = counter++; buf[tail % CAP] = v; tail = (tail + 1) % CAP; size++; render();
    say(`enqueue(${v}) at the back. tail wraps with modulo → O(1).`);
  }
  function dequeue() {
    if (size === 0) return say('Queue is empty.');
    const v = buf[head]; buf[head] = null; head = (head + 1) % CAP; size--; render();
    say(`dequeue() → ${v} from the front. FIFO. head advanced (and wraps).`);
  }
  controls.appendChild(btn('enqueue', 'primary', enqueue));
  controls.appendChild(btn('dequeue', 'magenta', dequeue));
  controls.appendChild(btn('⟲ reset', 'ghost', () => { buf = new Array(CAP).fill(null); head = tail = size = 0; counter = 1; render(); say(''); }));
  controls.appendChild(el('span', { class: 'tag-pill', text: 'watch head/tail wrap around the buffer' }));
  render();
  say('First in, first out. Add a few, remove some, and watch the indices wrap.');
};

/* ============================================================
   7. HASHING — buckets, collisions, load factor, resize
   ============================================================ */
Games.hashing = function (host) {
  const { controls, stage, readout } = playArea(host);
  let nb = 8; let entries = 0; let buckets = Array.from({ length: nb }, () => []);
  const grid = el('div', { class: 'buckets' }); stage.appendChild(grid);
  const say = (h) => (readout.innerHTML = h);
  function hash(key) { let h = 0; for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h) % nb; }
  function render(hot) {
    clear(grid);
    buckets.forEach((b, i) => {
      const cell = el('div', { class: 'bucket' + (i === hot ? '' : '') }, el('div', { class: 'bidx', text: '#' + i }));
      if (i === hot) cell.style.borderColor = 'var(--cyan)';
      b.forEach((k) => cell.appendChild(el('span', { class: 'chip', text: k })));
      grid.appendChild(cell);
    });
    const lf = (entries / nb).toFixed(2);
    say(`buckets=${nb} · entries=${entries} · load factor=<b>${lf}</b> ${lf > 0.75 ? '→ resize triggered' : ''}`);
  }
  function put(key) {
    const i = hash(key);
    const exists = buckets[i].includes(key);
    if (!exists) { buckets[i].push(key); entries++; }
    render(i);
    if (buckets[i].length > 1 && !exists) say(`'${key}' hashed to #${i} — <b>collision!</b> chained in the bucket.`);
    else if (!exists) say(`put('${key}') → hash → bucket #${i}. Average O(1).`);
    else say(`'${key}' already present in bucket #${i}.`);
    if (entries / nb > 0.75) resize();
  }
  function resize() {
    const old = buckets; nb *= 2; buckets = Array.from({ length: nb }, () => []);
    for (const b of old) for (const k of b) buckets[hash(k)].push(k);
    render(); say(`Load factor exceeded 0.75 → doubled to ${nb} buckets and rehashed. Keeps ops ~O(1).`);
  }
  const keyIn = el('input', { type: 'text', value: '', size: 8, placeholder: 'key' });
  controls.appendChild(el('label', {}, 'key', keyIn));
  controls.appendChild(btn('put', 'primary', () => { const k = keyIn.value.trim() || 'k' + randInt(1, 99); put(k); keyIn.value = ''; keyIn.focus(); }));
  controls.appendChild(btn('put random', 'ghost', () => put('k' + randInt(1, 99))));
  controls.appendChild(btn('⟲ reset', 'ghost', () => { nb = 8; entries = 0; buckets = Array.from({ length: nb }, () => []); render(); }));
  render();
  say('Add keys: each hashes to a bucket. Collisions chain; a high load factor triggers a resize.');
};

/* ============================================================
   8. RECURSION — Fibonacci call tree (exponential blowup)
   ============================================================ */
Games.recursion = function (host) {
  const { controls, stage, readout } = playArea(host);
  const nRange = el('input', { type: 'range', min: 1, max: 8, value: 6 });
  controls.appendChild(el('label', {}, 'fib(n), n =', nRange));
  controls.appendChild(el('span', { class: 'tag-pill', text: 'each node is a call — drag n to see the explosion' }));
  const { c, x, w, h } = makeCanvas(stage, 720, 320);
  const say = (h2) => (readout.innerHTML = h2);
  let MAXD = 1;
  function build(n, depth, x0, x1, calls) {
    calls.count++;
    const cx = (x0 + x1) / 2, cy = 22 + (depth / MAXD) * (h - 44);
    const node = { n, cx, cy, kids: [] };
    if (n > 1) {
      node.kids.push(build(n - 1, depth + 1, x0, cx, calls));
      node.kids.push(build(n - 2, depth + 1, cx, x1, calls));
    }
    return node;
  }
  function drawNode(node) {
    for (const k of node.kids) { x.strokeStyle = '#2a2d52'; x.beginPath(); x.moveTo(node.cx, node.cy); x.lineTo(k.cx, k.cy); x.stroke(); }
    for (const k of node.kids) drawNode(k);
    x.fillStyle = node.n <= 1 ? '#7cff5b' : '#9d7bff';
    x.beginPath(); x.arc(node.cx, node.cy, 11, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#0a0a14'; x.font = 'bold 10px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(node.n, node.cx, node.cy);
  }
  function draw() {
    const n = +nRange.value; x.clearRect(0, 0, w, h);
    MAXD = Math.max(1, n); // leftmost chain is n deep
    const calls = { count: 0 };
    const tree = build(n, 0, 8, w - 8, calls);
    drawNode(tree);
    const memo = n + 1; // memoized solves each subproblem once
    say(`Naive fib(${n}) makes <b style="color:var(--red)">${calls.count}</b> calls (O(2ⁿ)). ` +
      `Memoized would need only <b style="color:var(--lime)">${memo}</b> (O(n)). Green = base case.`);
  }
  nRange.addEventListener('input', draw);
  draw();
};

/* ============================================================
   9. SORTING — the race (bubble/selection/insertion/merge/quick)
   ============================================================ */
Games.sorting = function (host) {
  const { controls, stage, readout } = playArea(host);
  const algoSel = el('select', {},
    ...['bubble', 'selection', 'insertion', 'merge', 'quick'].map((a) => el('option', { value: a, text: a[0].toUpperCase() + a.slice(1) + ' sort' })));
  const sizeSel = el('select', {}, ...[16, 28, 44].map((n) => el('option', { value: n, text: n + ' bars' })));
  const runner = makeRunner();
  const box = el('div', { class: 'bars' }); stage.appendChild(box);
  const speed = speedControl(controls, 70);
  let arr = [], bars = [], cmp = 0, swp = 0, busy = false, token = 0;
  const H = 230;
  const say = () => (readout.innerHTML = `algorithm: <b>${algoSel.value}</b> · comparisons: <b>${cmp}</b> · swaps/writes: <b>${swp}</b>`);
  function gen() { const n = +sizeSel.value; arr = Array.from({ length: n }, () => randInt(5, 100)); render(); cmp = swp = 0; say(); }
  function render() { clear(box); bars = arr.map((v) => { const b = el('div', { class: 'bar', style: { height: (v / 100 * H) + 'px' } }); box.appendChild(b); return b; }); }
  const setH = (i) => { bars[i].style.height = (arr[i] / 100 * H) + 'px'; };
  const STOP = {};
  async function tick() { say(); await sleep(speed()); if (!runner.alive(token)) throw STOP; }
  async function compare(i, j) { cmp++; bars[i].classList.add('cmp'); bars[j].classList.add('cmp'); await tick(); bars[i].classList.remove('cmp'); bars[j].classList.remove('cmp'); return arr[i] - arr[j]; }
  async function swap(i, j) { swp++; bars[i].classList.add('swap'); bars[j].classList.add('swap'); [arr[i], arr[j]] = [arr[j], arr[i]]; setH(i); setH(j); await tick(); bars[i].classList.remove('swap'); bars[j].classList.remove('swap'); }
  async function setVal(i, v) { swp++; arr[i] = v; setH(i); bars[i].classList.add('swap'); await tick(); bars[i].classList.remove('swap'); }

  async function bubble() { for (let end = arr.length - 1; end > 0; end--) { let did = false; for (let i = 0; i < end; i++) { if ((await compare(i, i + 1)) > 0) { await swap(i, i + 1); did = true; } } bars[end].classList.add('done'); if (!did) break; } }
  async function selection() { for (let i = 0; i < arr.length - 1; i++) { let m = i; for (let j = i + 1; j < arr.length; j++) if ((await compare(j, m)) < 0) m = j; if (m !== i) await swap(i, m); bars[i].classList.add('done'); } }
  async function insertion() { for (let i = 1; i < arr.length; i++) { let j = i; while (j > 0 && (await compare(j - 1, j)) > 0) { await swap(j - 1, j); j--; } } }
  async function merge(lo, hi) { if (hi - lo < 1) return; const mid = (lo + hi) >> 1; await merge(lo, mid); await merge(mid + 1, hi); const tmp = []; let i = lo, j = mid + 1; while (i <= mid && j <= hi) { tmp.push((await compare(i, j)) <= 0 ? arr[i++] : arr[j++]); } while (i <= mid) tmp.push(arr[i++]); while (j <= hi) tmp.push(arr[j++]); for (let k = 0; k < tmp.length; k++) await setVal(lo + k, tmp[k]); }
  async function quick(lo, hi) { if (lo >= hi) { if (lo === hi) bars[lo].classList.add('done'); return; } const pivot = arr[hi]; let i = lo; for (let j = lo; j < hi; j++) { if ((await compare(j, hi)) < 0) { if (i !== j) await swap(i, j); i++; } } await swap(i, hi); bars[i].classList.add('done'); await quick(lo, i - 1); await quick(i + 1, hi); }

  async function run() {
    if (busy) return; busy = true; token = runner.start();
    controls.querySelectorAll('button,select').forEach((e) => (e.disabled = true));
    runBtn.disabled = true; bars.forEach((b) => b.classList.remove('done'));
    try {
      const a = algoSel.value;
      if (a === 'bubble') await bubble(); else if (a === 'selection') await selection();
      else if (a === 'insertion') await insertion(); else if (a === 'merge') await merge(0, arr.length - 1);
      else await quick(0, arr.length - 1);
      bars.forEach((b) => b.classList.add('done')); say();
    } catch (e) { if (e !== STOP) throw e; }
    busy = false; controls.querySelectorAll('button,select').forEach((e) => (e.disabled = false));
  }
  const runBtn = btn('▶ Sort', 'primary', run);
  controls.appendChild(el('label', {}, 'algorithm', algoSel));
  controls.appendChild(el('label', {}, 'size', sizeSel));
  controls.appendChild(runBtn);
  controls.appendChild(btn('🔀 Shuffle', 'ghost', () => { runner.stop(); busy = false; gen(); }));
  sizeSel.addEventListener('change', () => { runner.stop(); busy = false; gen(); });
  gen();
};

/* ============================================================
   10. SEARCHING — animated binary search vs linear
   ============================================================ */
Games.searching = function (host) {
  const { controls, stage, readout } = playArea(host);
  const N = 24;
  let arr = []; let target = 0;
  const runner = makeRunner();
  const box = el('div', { class: 'cells', style: { justifyContent: 'center', flexWrap: 'wrap' } });
  stage.appendChild(box);
  let cells = [];
  const say = (h) => (readout.innerHTML = h);
  function gen() { let v = randInt(1, 6); arr = []; for (let i = 0; i < N; i++) { arr.push(v); v += randInt(1, 6); } target = arr[randInt(0, N - 1)]; render(); say(`Sorted array ready. Target = <b>${target}</b>. Pick a search.`); }
  function render() { clear(box); cells = arr.map((v) => { const e = el('div', { class: 'cell', text: v }); box.appendChild(e); return e; }); }
  const clearMarks = () => cells.forEach((c) => { c.className = 'cell'; c.style.outline = ''; });
  async function binary() {
    const t = runner.start(); clearMarks(); let lo = 0, hi = N - 1, steps = 0;
    while (lo <= hi) {
      if (!runner.alive(t)) return; steps++;
      const mid = (lo + hi) >> 1;
      cells.forEach((c, i) => { c.className = 'cell' + (i >= lo && i <= hi ? '' : ' ghost'); });
      cells[mid].classList.add('hot');
      say(`step ${steps}: lo=${lo}, hi=${hi}, mid=${mid} → arr[mid]=${arr[mid]} vs ${target}`);
      await sleep(560);
      if (arr[mid] === target) { cells[mid].style.background = 'var(--lime)'; say(`Found ${target} at index ${mid} in <b>${steps}</b> steps — O(log n).`); return; }
      if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    say(`${target} not found (${steps} steps).`);
  }
  async function linear() {
    const t = runner.start(); clearMarks();
    for (let i = 0; i < N; i++) { if (!runner.alive(t)) return; cells[i].classList.add('cmp'); say(`linear scan: checking index ${i} (${arr[i]})`); await sleep(140); if (arr[i] === target) { cells[i].className = 'cell'; cells[i].style.background = 'var(--lime)'; say(`Found ${target} at index ${i} after <b>${i + 1}</b> checks — O(n).`); return; } cells[i].classList.remove('cmp'); }
  }
  controls.appendChild(btn('🔪 Binary search', 'primary', binary));
  controls.appendChild(btn('🐌 Linear scan', 'ghost', linear));
  controls.appendChild(btn('🔀 New array', 'ghost', () => { runner.stop(); gen(); }));
  controls.appendChild(el('span', { class: 'tag-pill', text: 'binary halves the range each step' }));
  gen();
};

/* ============================================================
   11. TREES — traversal animations on a sample tree
   ============================================================ */
Games.trees = function (host) {
  const { controls, stage, readout } = playArea(host);
  const vals = [4, 2, 6, 1, 3, 5, 7];
  const runner = makeRunner();
  const { c, x, w, h } = makeCanvas(stage, 720, 280);
  const say = (htm) => (readout.innerHTML = htm);
  const levels = 3;
  function pos(i) { const d = Math.floor(Math.log2(i + 1)); const p = i - (Math.pow(2, d) - 1); const cnt = Math.pow(2, d); return { x: (p + 0.5) / cnt * w, y: (d + 0.7) / levels * h - 10 }; }
  function draw(hot) {
    x.clearRect(0, 0, w, h);
    for (let i = 0; i < vals.length; i++) { const p = pos(i); for (const ci of [2 * i + 1, 2 * i + 2]) if (ci < vals.length) { const cp = pos(ci); x.strokeStyle = '#2a2d52'; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(cp.x, cp.y); x.stroke(); } }
    for (let i = 0; i < vals.length; i++) { const p = pos(i); x.fillStyle = i === hot ? '#ffc34d' : '#7cff5b'; x.beginPath(); x.arc(p.x, p.y, 17, 0, Math.PI * 2); x.fill(); x.fillStyle = '#0a0a14'; x.font = 'bold 14px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(vals[i], p.x, p.y); }
  }
  function order(type) {
    const out = [];
    (function rec(i) { if (i >= vals.length) return; if (type === 'pre') out.push(i); rec(2 * i + 1); if (type === 'in') out.push(i); rec(2 * i + 2); if (type === 'post') out.push(i); })(0);
    return out;
  }
  function levelOrder() { return vals.map((_, i) => i); }
  async function animate(seq, label) {
    const t = runner.start(); const visited = [];
    for (const i of seq) { if (!runner.alive(t)) return; draw(i); visited.push(vals[i]); say(`${label}: [ <b>${visited.join(', ')}</b> ]`); await sleep(620); }
    draw(-1);
  }
  controls.appendChild(btn('Pre-order', 'primary', () => animate(order('pre'), 'Pre-order (N,L,R)')));
  controls.appendChild(btn('In-order', 'primary', () => animate(order('in'), 'In-order (L,N,R) = sorted!')));
  controls.appendChild(btn('Post-order', 'primary', () => animate(order('post'), 'Post-order (L,R,N)')));
  controls.appendChild(btn('Level-order (BFS)', 'magenta', () => animate(levelOrder(), 'Level-order (BFS, uses a queue)')));
  draw(-1);
  say('Pick a traversal — watch the visiting order light up. In-order of a BST is sorted.');
};

/* ============================================================
   12. BST — insert, watch it grow, search a path
   ============================================================ */
Games.bst = function (host) {
  const { controls, stage, readout } = playArea(host);
  const runner = makeRunner();
  const { c, x, w, h } = makeCanvas(stage, 720, 300);
  const say = (htm) => (readout.innerHTML = htm);
  let root = null;
  function insert(node, v, depth) { if (!node) return { v, l: null, r: null, depth }; if (v < node.v) node.l = insert(node.l, v, depth + 1); else if (v > node.v) node.r = insert(node.r, v, depth + 1); return node; }
  function layout() { let i = 0; let maxD = 0; (function rec(n, d) { if (!n) return; rec(n.l, d + 1); n._x = i++; n._d = d; maxD = Math.max(maxD, d); rec(n.r, d + 1); })(root, 0); return { count: i, maxD }; }
  function draw(path) {
    x.clearRect(0, 0, w, h); if (!root) { x.fillStyle = '#8a8fb8'; x.font = '13px monospace'; x.fillText('empty — insert a number', 20, 30); return; }
    const { count, maxD } = layout();
    const px = (n) => 30 + (n._x + 0.5) / count * (w - 60);
    const py = (n) => 34 + n._d / (maxD + 1) * (h - 60);
    (function edges(n) { if (!n) return; for (const k of [n.l, n.r]) if (k) { x.strokeStyle = '#2a2d52'; x.beginPath(); x.moveTo(px(n), py(n)); x.lineTo(px(k), py(k)); x.stroke(); } edges(n.l); edges(n.r); })(root);
    (function nodes(n) { if (!n) return; nodes(n.l); const on = path && path.includes(n.v); x.fillStyle = on ? '#ffc34d' : '#ff4fd8'; x.beginPath(); x.arc(px(n), py(n), 15, 0, Math.PI * 2); x.fill(); x.fillStyle = '#0a0a14'; x.font = 'bold 12px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n.v, px(n), py(n)); nodes(n.r); })(root);
  }
  function add(v) { runner.stop(); root = insert(root, v, 0); draw(); say(`insert(${v}). Smaller goes left, larger goes right. Try the in-order dump!`); }
  function inorder() { const out = []; (function rec(n) { if (!n) return; rec(n.l); out.push(n.v); rec(n.r); })(root); say(`In-order traversal = <b>${out.join(', ')}</b> — always sorted!`); }
  async function search(v) {
    const t = runner.start(); let n = root; const path = []; let steps = 0;
    while (n) { if (!runner.alive(t)) return; steps++; path.push(n.v); draw(path); say(`searching ${v}: at ${n.v} → go ${v < n.v ? 'left' : v > n.v ? 'right' : 'FOUND'}`); await sleep(560); if (v === n.v) { say(`Found ${v} in <b>${steps}</b> steps — O(h).`); return; } n = v < n.v ? n.l : n.r; }
    say(`${v} not in tree (${steps} steps).`);
  }
  const numIn = el('input', { type: 'number', value: '', size: 4, placeholder: 'num' });
  controls.appendChild(el('label', {}, 'value', numIn));
  controls.appendChild(btn('insert', 'primary', () => { const v = parseInt(numIn.value, 10); if (!isNaN(v)) add(v); numIn.value = ''; numIn.focus(); }));
  controls.appendChild(btn('insert random', 'ghost', () => add(randInt(1, 99))));
  controls.appendChild(btn('🔍 search random', 'magenta', () => { const v = randInt(1, 99); search(v); }));
  controls.appendChild(btn('In-order (sorted)', 'ghost', inorder));
  controls.appendChild(btn('⟲ clear', 'ghost', () => { runner.stop(); root = null; draw(); say(''); }));
  [50, 30, 70, 20, 40, 60, 80].forEach((v) => (root = insert(root, v, 0)));
  draw();
  say('A starter tree is loaded. Insert values or search to see the O(log n) path.');
};

/* ============================================================
   13. GRAPHS — BFS/DFS pathfinding on a maze grid
   ============================================================ */
Games.graphs = function (host) {
  const { controls, stage, readout } = playArea(host);
  const R = 11, C = 21;
  const runner = makeRunner();
  let walls = new Set();
  const start = [Math.floor(R / 2), 1], end = [Math.floor(R / 2), C - 2];
  const grid = el('div', { class: 'maze', style: { gridTemplateColumns: `repeat(${C}, 1fr)`, maxWidth: '640px', margin: '0 auto' } });
  stage.appendChild(grid);
  let cells = [];
  const say = (h) => (readout.innerHTML = h);
  const key = (r, c) => r + ',' + c;
  function render() {
    clear(grid); cells = [];
    for (let r = 0; r < R; r++) { const row = []; for (let c = 0; c < C; c++) { const cl = (r === start[0] && c === start[1]) ? 'start' : (r === end[0] && c === end[1]) ? 'end' : walls.has(key(r, c)) ? 'wall' : ''; const cell = el('div', { class: 'mcell ' + cl }); cell.addEventListener('click', () => { if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return; if (walls.has(key(r, c))) walls.delete(key(r, c)); else walls.add(key(r, c)); render(); }); grid.appendChild(cell); row.push(cell); } cells.push(row); }
  }
  function mark(r, c, cls) { const cell = cells[r][c]; if (cell.classList.contains('start') || cell.classList.contains('end')) return; cell.classList.add(cls); }
  function neighbors(r, c) { return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && a < R && b >= 0 && b < C && !walls.has(key(a, b))); }
  function clearSearch() { for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) cells[r][c].classList.remove('frontier', 'visited', 'path'); }
  async function bfs() {
    const t = runner.start(); clearSearch(); const q = [start]; const seen = new Set([key(...start)]); const prev = {};
    while (q.length) {
      if (!runner.alive(t)) return; const [r, c] = q.shift(); mark(r, c, 'visited');
      if (r === end[0] && c === end[1]) return drawPath(prev, t);
      for (const [a, b] of neighbors(r, c)) if (!seen.has(key(a, b))) { seen.add(key(a, b)); prev[key(a, b)] = key(r, c); mark(a, b, 'frontier'); }
      say(`BFS exploring by distance · visited ${seen.size} cells`); await sleep(28);
    }
    say('No path — BFS gives the SHORTEST path when one exists.');
  }
  async function dfs() {
    const t = runner.start(); clearSearch(); const stack = [start]; const seen = new Set(); const prev = {};
    while (stack.length) {
      if (!runner.alive(t)) return; const [r, c] = stack.pop(); if (seen.has(key(r, c))) continue; seen.add(key(r, c)); mark(r, c, 'visited');
      if (r === end[0] && c === end[1]) return drawPath(prev, t);
      for (const [a, b] of neighbors(r, c)) if (!seen.has(key(a, b))) { if (prev[key(a, b)] == null) prev[key(a, b)] = key(r, c); stack.push([a, b]); }
      say(`DFS diving deep · visited ${seen.size} cells (path not necessarily shortest)`); await sleep(28);
    }
    say('No path found.');
  }
  async function drawPath(prev, t) {
    let cur = key(...end); const path = [];
    while (cur && cur !== key(...start)) { path.push(cur); cur = prev[cur]; }
    path.reverse();
    for (const k of path) { if (!runner.alive(t)) return; const [r, c] = k.split(',').map(Number); mark(r, c, 'path'); await sleep(40); }
    say(`Reached the goal! path length = <b>${path.length}</b> steps. BFS = O(V+E).`);
  }
  function randomWalls() { runner.stop(); walls = new Set(); for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (Math.random() < 0.25 && !(r === start[0] && c === start[1]) && !(r === end[0] && c === end[1])) walls.add(key(r, c)); render(); }
  controls.appendChild(btn('🌊 BFS (shortest)', 'primary', bfs));
  controls.appendChild(btn('🧭 DFS', 'magenta', dfs));
  controls.appendChild(btn('🧱 Random walls', 'ghost', randomWalls));
  controls.appendChild(btn('⟲ Clear', 'ghost', () => { runner.stop(); walls = new Set(); render(); say(''); }));
  controls.appendChild(el('span', { class: 'tag-pill', text: 'click cells to add/remove walls' }));
  randomWalls();
  say('Green = start, pink = goal. Click to draw walls, then run BFS or DFS.');
};

/* ============================================================
   14. DYNAMIC PROGRAMMING — coin change table fills up
   ============================================================ */
Games.dp = function (host) {
  const { controls, stage, readout } = playArea(host);
  const runner = makeRunner();
  const amountIn = el('input', { type: 'number', value: '11', size: 4 });
  const coinsIn = el('input', { type: 'text', value: '1,3,4', size: 10 });
  const tableBox = el('div', { class: 'cells', style: { flexWrap: 'wrap', alignItems: 'flex-start' } });
  stage.appendChild(tableBox);
  const say = (h) => (readout.innerHTML = h);
  let cells = [];
  function render(dp, amount, hot, used) {
    clear(tableBox); cells = [];
    for (let a = 0; a <= amount; a++) {
      const v = dp[a]; const top = el('div', { style: { fontSize: '10px', color: 'var(--muted)', textAlign: 'center' }, text: a });
      const cell = el('div', { class: 'cell' + (a === hot ? ' hot' : '') + (used && used.has(a) ? '' : ''), text: v >= 1e9 ? '∞' : v });
      if (used && used.has(a)) cell.style.background = 'var(--lime)', cell.style.color = '#06121a';
      cells.push(cell); tableBox.appendChild(el('div', {}, top, cell));
    }
  }
  async function solve() {
    const t = runner.start();
    const amount = clamp(parseInt(amountIn.value, 10) || 0, 0, 30);
    const coins = coinsIn.value.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => n > 0);
    const dp = new Array(amount + 1).fill(1e9); dp[0] = 0; render(dp, amount, 0);
    say('dp[a] = fewest coins to make amount a. dp[0]=0. Filling bottom-up…'); await sleep(500);
    for (let a = 1; a <= amount; a++) {
      if (!runner.alive(t)) return;
      for (const coin of coins) if (coin <= a && dp[a - coin] + 1 < dp[a]) dp[a] = dp[a - coin] + 1;
      render(dp, amount, a); say(`dp[${a}] = ${dp[a] >= 1e9 ? '∞ (can\'t make it)' : dp[a]} · trying coins {${coins.join(',')}}`);
      await sleep(360);
    }
    // reconstruct which amounts the optimal path passes through
    const used = new Set(); let a = amount;
    if (dp[amount] < 1e9) { while (a > 0) { used.add(a); let best = a; for (const coin of coins) if (coin <= a && dp[a - coin] === dp[a] - 1) { best = a - coin; break; } a = best; } used.add(0); }
    render(dp, amount, -1, used);
    say(dp[amount] >= 1e9 ? `Amount ${amount} is impossible with {${coins.join(',')}}.` : `Min coins for ${amount} = <b>${dp[amount]}</b>. Green cells = the optimal path. Greedy can miss this!`);
  }
  controls.appendChild(el('label', {}, 'amount', amountIn));
  controls.appendChild(el('label', {}, 'coins', coinsIn));
  controls.appendChild(btn('▶ Fill DP table', 'primary', solve));
  controls.appendChild(el('span', { class: 'tag-pill', text: 'try coins 1,3,4 & amount 6 — greedy fails' }));
  solve();
};
