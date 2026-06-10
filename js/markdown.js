/* ===== AlgoArcade: tiny dependency-free Markdown renderer + lesson loader ===== */
/* Covers exactly what the DSA lessons use: ATX headings, fenced code, GFM pipe
   tables, blockquotes, ordered/unordered lists, ---, inline code/bold/italic/links.
   Reuses highlightJava() from util.js for ```java blocks. */

function mdEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Inline formatting. Code spans are pulled out first (to @@C{n}@@ sentinels) so
// **/*/links never touch their contents, then restored at the end.
function mdInline(text) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (m, code) => {
    codes.push('<code>' + mdEscape(code) + '</code>');
    return '@@C' + (codes.length - 1) + '@@';
  });
  s = mdEscape(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
    (m, t, url) => `<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/@@C(\d+)@@/g, (m, idx) => codes[+idx]);
  return s;
}

function mdIsTableDelim(line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}
function mdSplitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  function alignOf(d) { const l = d.startsWith(':'), r = d.endsWith(':'); return l && r ? 'center' : r ? 'right' : l ? 'left' : ''; }

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) { i++; continue; }

    const fence = line.match(/^```\s*([\w-]*)\s*$/);
    if (fence) {
      const lang = fence[1]; const buf = []; i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      const code = buf.join('\n');
      const inner = lang === 'java' ? highlightJava(code) : mdEscape(code);
      out.push('<pre class="codebox"><code>' + inner + '</code></pre>');
      continue;
    }

    const hd = line.match(/^(#{1,6})\s+(.*)$/);
    if (hd) { const n = hd[1].length; out.push(`<h${n}>${mdInline(hd[2].trim())}</h${n}>`); i++; continue; }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    if (line.indexOf('|') !== -1 && i + 1 < lines.length && mdIsTableDelim(lines[i + 1])) {
      const header = mdSplitRow(line);
      const aligns = mdSplitRow(lines[i + 1]).map(alignOf);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].indexOf('|') !== -1 && !/^\s*$/.test(lines[i])) { rows.push(mdSplitRow(lines[i])); i++; }
      let html = '<table class="md-table"><thead><tr>';
      header.forEach((h, c) => { const a = aligns[c] ? ` style="text-align:${aligns[c]}"` : ''; html += `<th${a}>${mdInline(h)}</th>`; });
      html += '</tr></thead><tbody>';
      rows.forEach((r) => { html += '<tr>'; r.forEach((cell, c) => { const a = aligns[c] ? ` style="text-align:${aligns[c]}"` : ''; html += `<td${a}>${mdInline(cell)}</td>`; }); html += '</tr>'; });
      html += '</tbody></table>';
      out.push(html);
      continue;
    }

    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push('<blockquote>' + mdInline(buf.join(' ')) + '</blockquote>');
      continue;
    }

    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const r = mdList(lines, i, 0); out.push(r[0]); i = r[1]; continue;
    }

    const buf = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6})\s/.test(lines[i]) && !/^```/.test(lines[i]) &&
      !/^\s*([-*+]|\d+\.)\s+/.test(lines[i]) && !/^\s*>/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i]) &&
      !(lines[i].indexOf('|') !== -1 && i + 1 < lines.length && mdIsTableDelim(lines[i + 1]))) {
      buf.push(lines[i]); i++;
    }
    out.push('<p>' + mdInline(buf.join(' ')) + '</p>');
  }
  return out.join('\n');
}

// Builds a list at index `start`; returns [html, nextIndex]. Supports nesting by indent.
function mdList(lines, start, baseIndent) {
  const first = lines[start].match(/^(\s*)([-*+]|\d+\.)\s+/);
  const ordered = /\d+\./.test(first[2]);
  const tag = ordered ? 'ol' : 'ul';
  let html = '<' + tag + '>';
  let i = start;
  while (i < lines.length) {
    const m = lines[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    if (!m) break;
    const indent = m[1].length;
    if (indent < baseIndent) break;
    if (indent > baseIndent) { const r = mdList(lines, i, indent); html = html.replace(/<\/li>$/, r[0] + '</li>'); i = r[1]; continue; }
    html += '<li>' + mdInline(m[3]) + '</li>';
    i++;
  }
  return [html + '</' + tag + '>', i];
}

function renderMarkdown(host, md) {
  const box = el('div', { class: 'prose', html: mdToHtml(md) });
  host.appendChild(box);
  return box;
}

// Fetch a lesson .md (cached). Rejects on failure (file:// CORS, 404, …).
var _lessonCache = {};
function loadLesson(path) {
  if (_lessonCache[path]) return Promise.resolve(_lessonCache[path]);
  return fetch(path).then((res) => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.text();
  }).then((text) => { _lessonCache[path] = text; return text; });
}
