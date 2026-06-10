/* ===== AlgoArcade: small DOM + animation helpers (classic script, global scope) ===== */

// Create an element: el('div', {class:'x', onclick:fn}, child, 'text', ...)
function el(tag, props, ...children) {
  const node = document.createElement(tag);
  if (props) {
    for (const k in props) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'dataset') Object.assign(node.dataset, v);
      else node.setAttribute(k, v);
    }
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return node;
}

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const shuffled = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// A cancellable async "runner" so visualizations can be stopped/restarted cleanly.
function makeRunner() {
  let token = 0;
  return {
    start() { return ++token; },
    alive(t) { return t === token; },
    stop() { token++; },
  };
}

// Simple syntax highlighter for the small Java snippets we show.
function highlightJava(code) {
  const esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>')
    .replace(/\b(int|long|void|return|for|while|if|else|new|boolean|char|String|public|static|class|null|true|false)\b/g,
      '<span class="kw">$1</span>');
}

// Confetti burst on a canvas-free, lightweight DOM basis (used on big wins).
function confetti() {
  const colors = ['#2ce6e6', '#ff4fd8', '#7cff5b', '#ffc34d', '#9d7bff'];
  for (let i = 0; i < 70; i++) {
    const p = el('div');
    Object.assign(p.style, {
      position: 'fixed', zIndex: 200, left: '50%', top: '40%',
      width: '8px', height: '12px', background: colors[i % colors.length],
      borderRadius: '2px', pointerEvents: 'none',
    });
    document.body.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const vel = 200 + Math.random() * 300;
    const dx = Math.cos(ang) * vel, dy = Math.sin(ang) * vel - 250;
    const rot = (Math.random() * 720 - 360) + 'deg';
    p.animate(
      [{ transform: 'translate(0,0) rotate(0)', opacity: 1 },
       { transform: `translate(${dx}px, ${dy + 400}px) rotate(${rot})`, opacity: 0 }],
      { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.3,1)' }
    ).onfinish = () => p.remove();
  }
}
