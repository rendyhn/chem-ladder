/* ==========================================================================
   Figures: small SVG builders for the lessons and questions.
   Colours come from CSS classes (.mf-*) so every figure follows light/dark mode.
   ========================================================================== */
const svgBox = (w, h, label) => `<svg viewBox="0 0 ${w} ${h}" style="max-width:${Math.round(w * 1.3)}px" role="img" aria-label="${String(label || '').split('"').join('&quot;')}">`;   // small figures do not blow up to full width
const niceStep = (top, n = 4) => { const raw = top / n, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };
const sT = (x, y, t, cls = 'mf-lab', anchor = 'middle', extra = '') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}"${extra}>${t}</text>`;
const sL = (x1, y1, x2, y2, cls = 'mf-line', extra = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}"${extra}/>`;
const sC = (cx, cy, r, cls = 'mf-shape', extra = '') => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" class="${cls}"${extra}/>`;
const sR = (x, y, w, h, cls = 'mf-shape', rx = 0, extra = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" class="${cls}"${extra}/>`;
const sP = (d, cls = 'mf-line', extra = '') => `<path d="${d}" class="${cls}"${extra}/>`;
const sPoly = (pts, cls = 'mf-shape', extra = '') => `<polygon points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" class="${cls}"${extra}/>`;
const sPline = (pts, cls = 'mf-line', extra = '') => `<polyline points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" class="${cls}"${extra}/>`;
function sArrow(x1, y1, x2, y2, cls = 'mf-line', head = 8) {   // line with a filled head; cls may be a curve class (mf-c1 …)
  const a = Math.atan2(y2 - y1, x2 - x1), bx = x2 - head * Math.cos(a), by = y2 - head * Math.sin(a), w = head * 0.45;
  const hc = cls.replace(/mf-c(\d)/, 'mf-s$1').replace('mf-line', 'mf-ink').replace('mf-axis', 'mf-ink3');
  return sL(x1, y1, bx, by, cls) + sPoly([[x2, y2], [bx + w * Math.sin(a), by - w * Math.cos(a)], [bx - w * Math.sin(a), by + w * Math.cos(a)]], hc);
}
const sAngle = (cx, cy, r, a1, a2, cls = 'mf-line') => {   // arc between two directions (degrees, maths convention, y up)
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)], [x1, y1] = p(a1), [x2, y2] = p(a2);
  return sP(`M${f1(x1)} ${f1(y1)} A${r} ${r} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} 0 ${f1(x2)} ${f1(y2)}`, cls, ' fill="none"');
};
const sRight = (x, y, ux, uy, vx, vy, s = 11) => sPline([[x + ux * s, y + uy * s], [x + ux * s + vx * s, y + uy * s + vy * s], [x + vx * s, y + vy * s]], 'mf-line');   // right-angle mark

/* ---------- coordinate plane with curves, points, segments and shading ---------- */
function planeSvg(o) {
  const W = o.W || 420, [a, b] = o.x, [c, d] = o.y, L = 34, R = 16, Tp = 14, B = 26;
  const H = o.H || (o.equal ? Math.round((W - L - R) * (d - c) / (b - a) + Tp + B) : 300);
  const X = x => L + (x - a) / (b - a) * (W - L - R), Y = y => Tp + (d - y) / (d - c) * (H - Tp - B);
  const [sx, sy] = o.step || [1, 1];
  let s = svgBox(W, H, o.label);
  if (o.grid !== false) {
    for (let x = Math.ceil(a / sx) * sx; x <= b + 1e-9; x += sx) s += sL(X(x), Y(d), X(x), Y(c), 'mf-grid');
    for (let y = Math.ceil(c / sy) * sy; y <= d + 1e-9; y += sy) s += sL(X(a), Y(y), X(b), Y(y), 'mf-grid');
  }
  (o.shade || []).forEach(({ f, g = () => 0, from, to, cls = 'mf-f1' }) => {
    const n = 80, top = [], bot = [];
    for (let i = 0; i <= n; i++) { const x = from + (to - from) * i / n; top.push([X(x), Y(Math.max(c, Math.min(d, f(x))))]); bot.push([X(x), Y(Math.max(c, Math.min(d, g(x))))]); }
    s += sPoly(top.concat(bot.reverse()), cls);
  });
  (o.polys || []).forEach(({ pts, cls = 'mf-f1' }) => { s += sPoly(pts.map(([x, y]) => [X(x), Y(y)]), cls); });
  (o.rects || []).forEach(([x, y, w, h, cls = 'mf-f2']) => { s += sR(X(x), Y(y + h), X(x + w) - X(x), Y(y) - Y(y + h), cls); });
  const y0 = Math.max(c, Math.min(d, 0)), x0 = Math.max(a, Math.min(b, 0));
  s += sArrow(X(a), Y(y0), X(b) + 8, Y(y0), 'mf-axis', 7) + sArrow(X(x0), Y(c), X(x0), Y(d) - 8, 'mf-axis', 7);
  if (o.ticks !== false) {
    const lx = o.tickX || sx, ly = o.tickY || sy, fx0 = o.fmtX || F, fy0 = o.fmtY || F;
    for (let x = Math.ceil(a / lx) * lx; x <= b + 1e-9; x += lx) if (Math.abs(x) > 1e-9) s += sL(X(x), Y(y0) - 3, X(x), Y(y0) + 3, 'mf-axis') + sT(X(x), Y(y0) + 15, fx0(+x.toFixed(6)), 'mf-small');
    for (let y = Math.ceil(c / ly) * ly; y <= d + 1e-9; y += ly) if (Math.abs(y) > 1e-9) s += sL(X(x0) - 3, Y(y), X(x0) + 3, Y(y), 'mf-axis') + sT(X(x0) - 6, Y(y) + 4, fy0(+y.toFixed(6)), 'mf-small', 'end');
    if (a <= 0 && b >= 0 && c <= 0 && d >= 0) s += sT(X(0) - 6, Y(0) + 14, '0', 'mf-small', 'end');
  }
  s += sT(X(b) + 4, Y(y0) - 8, o.xl || 'x', 'mf-var', 'end') + sT(X(x0) + 8, Y(d) + 4, o.yl || 'y', 'mf-var', 'start');
  (o.segs || []).forEach(([x1, y1, x2, y2, cls = 'mf-line', dash]) => { s += sL(X(x1), Y(y1), X(x2), Y(y2), cls, dash ? ' stroke-dasharray="5 4"' : ''); });
  (o.vecs || []).forEach(([x1, y1, x2, y2, cls = 'mf-c1']) => { s += sArrow(X(x1), Y(y1), X(x2), Y(y2), cls, 9); });
  (o.circles || []).forEach(([cx, cy, r, cls = 'mf-c1']) => { s += `<ellipse cx="${f1(X(cx))}" cy="${f1(Y(cy))}" rx="${f1(X(cx + r) - X(cx))}" ry="${f1(Y(cy) - Y(cy + r))}" class="${cls}" fill="none"/>`; });
  (o.fns || []).forEach(({ f, cls = 'mf-c1', from = a, to = b, n = 240, label, at, dx = 6, dy = -6, anchor = 'start', dash }) => {
    let dstr = '', pen = false;
    for (let i = 0; i <= n; i++) {
      const x = from + (to - from) * i / n, y = f(x);
      if (!isFinite(y) || y > d + (d - c) * 0.6 || y < c - (d - c) * 0.6) { pen = false; continue; }
      dstr += `${pen ? 'L' : 'M'}${f1(X(x))} ${f1(Y(Math.max(c - (d - c) * 0.05, Math.min(d + (d - c) * 0.05, y))))}`; pen = true;
    }
    s += `<clipPath id="cp${++planeSvg.n}"><rect x="${L}" y="${Tp}" width="${W - L - R}" height="${H - Tp - B}"/></clipPath>` + sP(dstr, cls, ` fill="none" clip-path="url(#cp${planeSvg.n})"${dash ? ' stroke-dasharray="6 5"' : ''}`);
    if (label) { const xa = at != null ? at : to; s += sT(X(xa) + dx, Y(f(xa)) + dy, label, 'mf-lab', anchor); }
  });
  (o.pts || []).forEach(([x, y, label, anchor = 'start', open, dx = 7, dy = -7]) => { s += sC(X(x), Y(y), 4, open ? 'mf-open' : 'mf-dot') + (label ? sT(X(x) + (anchor === 'end' ? -dx : anchor === 'middle' ? 0 : dx), Y(y) + dy, label, 'mf-lab', anchor) : ''); });
  (o.texts || []).forEach(([x, y, t, anchor = 'middle', cls = 'mf-lab']) => { s += sT(X(x), Y(y), t, cls, anchor); });
  return s + (o.extra ? o.extra(X, Y) : '') + '</svg>';
}
planeSvg.n = 0;

/* ---------- number line ---------- */
function numberLineSvg(o) {
  const W = o.W || 460, H = o.H || 90, L = 24, R = 24, y = o.y || 52, { min, max } = o, step = o.step || 1, X = v => L + (v - min) / (max - min) * (W - L - R);
  let s = svgBox(W, H, o.label) + sArrow(L - 10, y, W - 6, y, 'mf-axis', 7) + sArrow(L + 2, y, L - 12, y, 'mf-axis', 7);
  const every = o.labelEvery || step, fmt = o.fmt || F;
  for (let v = min, i = 0; v <= max + 1e-9; v = +(min + step * ++i).toFixed(9)) {
    const major = Math.abs(v / every - Math.round(v / every)) < 1e-6;
    s += sL(X(v), y - (major ? 6 : 3.5), X(v), y + (major ? 6 : 3.5), 'mf-axis') + (major && o.ticks !== false ? sT(X(v), y + 22, fmt(v), 'mf-small') : '');
  }
  if (o.ray) { const { from, dir, open } = o.ray, end = dir > 0 ? W - 10 : L - 10; s += sL(X(from), y, end, y, 'mf-c1', ' stroke-width="5" stroke-opacity="0.75"') + sC(X(from), y, 6, open ? 'mf-open-c' : 'mf-s1'); }
  if (o.seg) { const [p, q, oa, ob] = o.seg; s += sL(X(p), y, X(q), y, 'mf-c1', ' stroke-width="5" stroke-opacity="0.75"') + sC(X(p), y, 6, oa ? 'mf-open-c' : 'mf-s1') + sC(X(q), y, 6, ob ? 'mf-open-c' : 'mf-s1'); }
  (o.jumps || []).forEach(({ from, to, label, cls = 'mf-c2' }, i) => {
    const x1 = X(from), x2 = X(to), h = Math.min(34, Math.abs(x2 - x1) * 0.5 + 10), mx = (x1 + x2) / 2;
    s += sP(`M${f1(x1)} ${y - 6} Q${f1(mx)} ${f1(y - 6 - 2 * h)} ${f1(x2)} ${y - 6}`, cls, ' fill="none"') + sArrow(x2 - (x2 > x1 ? 7 : -7), y - 13, x2, y - 6, cls, 7);
    if (label) s += sT(mx, y - 10 - h, label, 'mf-lab');
  });
  (o.marks || []).forEach(({ v, label, cls = 'mf-s1', below, open }) => { s += sC(X(v), y, 5.5, open ? 'mf-open-c' : cls) + (label ? sT(X(v), below ? y + 38 : y - 14, label, 'mf-lab') : ''); });
  return s + '</svg>';
}

/* ---------- fraction bars, pies and grids ---------- */
function fracBarsSvg(rows, { label, W = 440, total = 1, names } = {}) {   // rows: [n, d, text]
  const rowH = 34, H = rows.length * (rowH + 10) + 6, L = names === false ? 8 : 64, bw = W - L - 10;
  let s = svgBox(W, H, label);
  rows.forEach(([n, d, t, cls = 'mf-s1'], r) => {
    const y = 4 + r * (rowH + 10), cw = bw * total / d;
    for (let i = 0; i < d; i++) s += sR(L + i * cw, y, cw, rowH, i < n ? cls : 'mf-cell', 0, ' stroke-width="1.5"');
    s += sR(L, y, cw * d, rowH, 'mf-frame', 3);
    if (t != null) s += sT(L - 10, y + rowH / 2 + 5, t, 'mf-lab-b', 'end');
  });
  return s + '</svg>';
}
function piesSvg(items, { label, r = 44 } = {}) {   // items: [n, d, text]
  const W = items.length * (2 * r + 30) + 10, H = 2 * r + 40;
  let s = svgBox(W, H, label);
  items.forEach(([n, d, t, cls = 'mf-s1'], k) => {
    const cx = 20 + r + k * (2 * r + 30), cy = r + 8;
    for (let i = 0; i < d; i++) {
      const a0 = -90 + 360 * i / d, a1 = -90 + 360 * (i + 1) / d, p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)], [x0, y0] = p(a0), [x1, y1] = p(a1);
      s += d === 1 ? sC(cx, cy, r, i < n ? cls : 'mf-cell') : sP(`M${cx} ${cy} L${f1(x0)} ${f1(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f1(x1)} ${f1(y1)}Z`, i < n ? cls : 'mf-cell', ' stroke-width="1.5"');
    }
    s += sC(cx, cy, r, 'mf-frame') + (t != null ? sT(cx, cy + r + 24, t, 'mf-lab-b') : '');
  });
  return s + '</svg>';
}
function gridSvg(rows, cols, shaded, { label, cell = 22, dots = false, cls = 'mf-s1', caption } = {}) {   // shaded: count (row by row) or function (r, c) => class | false
  const W = Math.max(cols * cell + 8, caption ? String(caption).length * 7.6 : 0), H = rows * cell + 8 + (caption ? 22 : 0), x0 = (W - cols * cell) / 2;
  let s = svgBox(W, H, label);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const on = typeof shaded === 'function' ? shaded(r, c) : r * cols + c < shaded, x = x0 + c * cell, y = 4 + r * cell;
    if (on === null) continue;   // null leaves the cell out entirely
    s += dots ? sC(x + cell / 2, y + cell / 2, cell * 0.32, on ? (typeof on === 'string' ? on : cls) : 'mf-cell') : sR(x, y, cell, cell, on ? (typeof on === 'string' ? on : cls) : 'mf-cell', 0, ' stroke-width="1.2"');
  }
  if (!dots) s += sR(x0, 4, cols * cell, rows * cell, 'mf-frame', 2);
  return s + (caption ? sT(W / 2, H - 4, caption, 'mf-lab') : '') + '</svg>';
}

/* ---------- area model for multiplication or expanding brackets ---------- */
function areaModelSvg(top, side, { label, cells, total } = {}) {   // top/side: [value or text, …] with sizes
  const W = 440, L = 60, Tp = 34, sizes = v => v.map(p => p[1]);
  const tw = sizes(top).reduce((x, y) => x + y, 0), sh = sizes(side).reduce((x, y) => x + y, 0), k = Math.min((W - L - 16) / tw, 190 / sh), H = Tp + sh * k + 12 + (total ? 24 : 0);
  let s = svgBox(W, H, label), x = L;
  top.forEach(([t, w]) => { s += sT(x + w * k / 2, Tp - 10, t, 'mf-lab-b'); x += w * k; });
  let y = Tp;
  side.forEach(([t, h], i) => {
    s += sT(L - 10, y + h * k / 2 + 5, t, 'mf-lab-b', 'end'); let xx = L;
    top.forEach(([, w], j) => { s += sR(xx, y, w * k, h * k, ['mf-s1l', 'mf-s2l', 'mf-s3l', 'mf-s4l'][(i + j) % 4], 0, ' stroke-width="1.5"') + sT(xx + w * k / 2, y + h * k / 2 + 5, cells ? cells[i][j] : '', 'mf-lab'); xx += w * k; });
    y += h * k;
  });
  return s + (total ? sT(L, H - 6, total, 'mf-lab', 'start') : '') + '</svg>';
}

/* ---------- factor tree ---------- */
function factorTreeSvg(n, { label } = {}) {
  const chain = []; let m = n;
  while (true) { let p = 2; while (m % p) p++; if (p === m) break; chain.push(p); m /= p; }
  const depth = chain.length, W = 70 + 40 * depth + 90, H = 50 * depth + 58;
  let s = svgBox(W, H, label), x = 50, y = 24, v = n;
  s += sT(x, y + 5, F(v), 'mf-node');
  chain.forEach(p => {
    const q = v / p;
    s += sL(x - 5, y + 10, x - 24, y + 36) + sL(x + 5, y + 10, x + 24, y + 36) + sC(x - 30, y + 48, 14, 'mf-prime') + sT(x - 30, y + 53, F(p), 'mf-lab-b');
    x += 30; y += 50; v = q;
    s += q === m && chain[chain.length - 1] === p ? sC(x, y - 2, 14, 'mf-prime') + sT(x, y + 3, F(q), 'mf-lab-b') : sT(x, y + 3, F(q), 'mf-node');
  });
  return s + '</svg>';
}
/* ---------- simple charts ---------- */
function barsSvg(items, { label, yMax, step, W = 440, H = 240, hist = false, yl = '', values = true, cls = 'mf-s1' } = {}) {
  const L = 40, R = 10, Tp = 18, B = 34, n = items.length, st = step || niceStep((yMax || Math.max(...items.map(i => i[1]))) * 1.1), top = yMax || Math.ceil(Math.max(...items.map(i => i[1])) * 1.1 / st) * st;
  const X = i => L + i * (W - L - R) / n, Y = v => Tp + (1 - v / top) * (H - Tp - B), bw = (W - L - R) / n * (hist ? 1 : 0.62);
  let s = svgBox(W, H, label);
  for (let v = 0; v <= top + 1e-9; v += st) s += sL(L, Y(v), W - R, Y(v), 'mf-grid') + sT(L - 6, Y(v) + 4, F(+v.toFixed(6)), 'mf-small', 'end');
  items.forEach(([t, v, c], i) => { const x = X(i) + ((W - L - R) / n - bw) / 2; s += sR(x, Y(v), bw, Y(0) - Y(v), c || cls, hist ? 0 : 2, hist ? ' stroke-width="1.5"' : '') + (hist ? '' : sT(x + bw / 2, H - B + 16, t, 'mf-small')) + (values ? sT(x + bw / 2, Y(v) - 5, F(v), 'mf-small') : ''); });
  if (hist) items.forEach(([t], i) => { s += sT(X(i), H - B + 16, t, 'mf-small'); });
  if (hist && items.length && items[items.length - 1][3] != null) s += sT(X(n), H - B + 16, items[n - 1][3], 'mf-small');
  return s + sL(L, Y(0), W - R, Y(0), 'mf-axis') + sL(L, Tp - 4, L, Y(0), 'mf-axis') + (yl ? sT(L - 4, Tp - 6, yl, 'mf-small', 'start') : '') + '</svg>';
}
function dotPlotSvg(data, { label, min, max, marks = [] } = {}) {
  const W = 440, lo = min != null ? min : Math.min(...data), hi = max != null ? max : Math.max(...data), cnt = {};
  data.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; });
  const mh = marks.length ? (marks.length > 1 ? 38 : 22) : 0, H = 60 + 14 * Math.max(...Object.values(cnt)) + mh, L = 24, R = 24, y = H - 34 - mh, X = v => L + (v - lo) / (hi - lo || 1) * (W - L - R);
  let s = svgBox(W, H, label) + sL(L - 8, y, W - R + 8, y, 'mf-axis');
  for (let v = lo; v <= hi; v++) s += sL(X(v), y, X(v), y + 5, 'mf-axis') + sT(X(v), y + 19, F(v), 'mf-small');
  Object.entries(cnt).forEach(([v, k]) => { for (let i = 0; i < k; i++) s += sC(X(+v), y - 9 - i * 14, 5.5, 'mf-s1'); });
  marks.forEach(([v, t, cls], i) => { s += sL(X(v), 12, X(v), y, cls || 'mf-c2', ' stroke-dasharray="4 3" stroke-width="2"') + sT(X(v), H - 6 - (marks.length > 1 && i % 2 === 0 ? 16 : 0), t, 'mf-lab'); });
  return s + '</svg>';
}
function boxPlotSvg([mn, q1, md, q3, mx], { label, lo, hi, step = 1, names } = {}) {
  const W = 440, H = 118, L = 24, R = 24, y = 44, a = lo != null ? lo : mn, b = hi != null ? hi : mx, X = v => L + (v - a) / (b - a) * (W - L - R);
  let s = svgBox(W, H, label) + sL(X(mn), y, X(q1), y) + sL(X(q3), y, X(mx), y) + sL(X(mn), y - 10, X(mn), y + 10) + sL(X(mx), y - 10, X(mx), y + 10);
  s += sR(X(q1), y - 18, X(q3) - X(q1), 36, 'mf-s1l', 3, ' stroke-width="1.8"') + sL(X(md), y - 18, X(md), y + 18, 'mf-c2', ' stroke-width="3"');
  s += sL(L - 6, 88, W - R + 6, 88, 'mf-axis');
  for (let v = a; v <= b + 1e-9; v += step) s += sL(X(v), 88, X(v), 93, 'mf-axis') + sT(X(v), 108, F(+v.toFixed(6)), 'mf-small');
  const nm = names || ['min', 'Q₁', T`median`, 'Q₃', 'max'];
  [mn, q1, md, q3, mx].forEach((v, i) => { s += sT(X(v), i % 2 ? 72 : 18, nm[i], 'mf-small'); });
  return s + '</svg>';
}

/* ---------- geometry ---------- */
function triangleSvg(P, { label, sides = [], verts = [], angles = [], right, fill = 'mf-shape', H = 220, W = 360 } = {}) {   // P: three points in px
  let s = svgBox(W, H, label) + sPoly(P, fill);
  const cen = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
  sides.forEach((t, i) => { if (!t) return; const A = P[i], Bp = P[(i + 1) % 3], mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2, dx = mx - cen[0], dy = my - cen[1], k = 16 / Math.hypot(dx, dy); s += sT(mx + dx * k, my + dy * k + 5, t, 'mf-var'); });
  verts.forEach((t, i) => { if (!t) return; const dx = P[i][0] - cen[0], dy = P[i][1] - cen[1], k = 16 / Math.hypot(dx, dy); s += sT(P[i][0] + dx * k, P[i][1] + dy * k + 5, t, 'mf-lab-b'); });
  angles.forEach((t, i) => {
    if (!t) return; const A = P[i], u = P[(i + 1) % 3], v = P[(i + 2) % 3], a1 = Math.atan2(A[1] - u[1], u[0] - A[0]) * 180 / Math.PI, a2 = Math.atan2(A[1] - v[1], v[0] - A[0]) * 180 / Math.PI;
    let lo = Math.min(a1, a2), hi = Math.max(a1, a2); if (hi - lo > 180) [lo, hi] = [hi, lo + 360];
    const mid = (lo + hi) / 2 * Math.PI / 180; s += sAngle(A[0], A[1], 22, lo, hi, 'mf-c2') + sT(A[0] + 36 * Math.cos(mid), A[1] - 36 * Math.sin(mid) + 5, t, 'mf-var');
  });
  if (right != null) { const A = P[right], u = P[(right + 1) % 3], v = P[(right + 2) % 3], nu = Math.hypot(u[0] - A[0], u[1] - A[1]), nv = Math.hypot(v[0] - A[0], v[1] - A[1]); s += sRight(A[0], A[1], (u[0] - A[0]) / nu, (u[1] - A[1]) / nu, (v[0] - A[0]) / nv, (v[1] - A[1]) / nv); }
  return s + '</svg>';
}
function anglesRowSvg(items, { label } = {}) {   // items: [degrees, name]
  const cw = 130, W = items.length * cw, H = 128;
  let s = svgBox(W, H, label);
  items.forEach(([deg, name], i) => {
    const r = 70, a = deg * Math.PI / 180, e = Math.max(0, -0.8 * r * Math.cos(a)), cx = i * cw + 10 + e, cy = 82, rr = Math.min(r, cw - 20 - e);
    s += sL(cx, cy, cx + rr, cy, 'mf-line', ' stroke-width="2"') + sL(cx, cy, cx + r * Math.cos(a) * (deg > 90 ? 0.8 : 1), cy - r * Math.sin(a) * (deg > 90 ? 0.8 : 1), 'mf-line', ' stroke-width="2"');
    s += deg === 90 ? sRight(cx, cy, 1, 0, 0, -1, 14) : sAngle(cx, cy, 20, 0, deg, 'mf-c2');
    s += sT(cx + (deg > 120 ? 20 : 34), cy - 22 - (deg > 150 ? 6 : 0), `${deg}°`, 'mf-small', 'start') + sT(i * cw + cw / 2, H - 8, name, 'mf-lab-b');
  });
  return s + '</svg>';
}
function polygonsSvg(items, { label } = {}) {   // items: [sides, name]
  const cw = 104, W = items.length * cw, H = 124;
  let s = svgBox(W, H, label);
  items.forEach(([n, name], i) => {
    const cx = i * cw + cw / 2, cy = 50, r = 38, pts = [...Array(n)].map((_, k) => [cx + r * Math.cos(-Math.PI / 2 + 2 * Math.PI * k / n + (n % 2 ? 0 : Math.PI / n)), cy + r * Math.sin(-Math.PI / 2 + 2 * Math.PI * k / n + (n % 2 ? 0 : Math.PI / n))]);
    s += sPoly(pts, ['mf-s1l', 'mf-s2l', 'mf-s3l', 'mf-s4l'][i % 4], ' stroke-width="1.8"') + sT(cx, 110, name, 'mf-lab-b');
  });
  return s + '</svg>';
}
/* a cuboid in oblique projection; optional unit cubes and labels */
function cuboidSvg(l, w, h, { label, unit = 26, cubes = false, labels } = {}) {
  const dx = unit * 0.5, dy = unit * 0.35, W = l * unit + w * dx + 90, H = h * unit + w * dy + 50, x0 = 44, y0 = H - 30;
  const P = (x, y, z) => [x0 + x * unit + y * dx, y0 - z * unit - y * dy];
  let s = svgBox(W, H, label);
  const face = (pts, cls) => sPoly(pts.map(p => P(...p)), cls, ' stroke-width="1.6"');
  s += face([[0, 0, 0], [l, 0, 0], [l, 0, h], [0, 0, h]], 'mf-s1l') + face([[0, 0, h], [l, 0, h], [l, w, h], [0, w, h]], 'mf-s2l') + face([[l, 0, 0], [l, w, 0], [l, w, h], [l, 0, h]], 'mf-s3l');
  if (cubes) {
    for (let i = 1; i < l; i++) s += sL(...P(i, 0, 0), ...P(i, 0, h), 'mf-thin') + sL(...P(i, 0, h), ...P(i, w, h), 'mf-thin');
    for (let k = 1; k < h; k++) s += sL(...P(0, 0, k), ...P(l, 0, k), 'mf-thin') + sL(...P(l, 0, k), ...P(l, w, k), 'mf-thin');
    for (let j = 1; j < w; j++) s += sL(...P(0, j, h), ...P(l, j, h), 'mf-thin') + sL(...P(l, j, 0), ...P(l, j, h), 'mf-thin');
  }
  const [lt, wt, ht] = labels || [`${l}`, `${w}`, `${h}`];
  s += sT((P(0, 0, 0)[0] + P(l, 0, 0)[0]) / 2, y0 + 20, lt, 'mf-var') + sT(P(l, w / 2, 0)[0] + 16, P(l, w / 2, 0)[1] + 4, wt, 'mf-var', 'start') + sT(x0 - 10, (P(0, 0, 0)[1] + P(0, 0, h)[1]) / 2 + 5, ht, 'mf-var', 'end');
  return s + '</svg>';
}
/* common solids side by side: 'cube' | 'cylinder' | 'cone' | 'sphere' | 'pyramid' | 'prism' */
function solidsSvg(items, { label } = {}) {   // items: [kind, name]
  const cw = 112, W = items.length * cw, H = 150;
  let s = svgBox(W, H, label);
  items.forEach(([k, name], i) => {
    const cx = i * cw + cw / 2, by = 110;
    if (k === 'cube' || k === 'prism') {
      const a = 50, d = 20, x = cx - 34, y = by - a;
      if (k === 'cube') s += sR(x, y, a, a, 'mf-s1l', 0, ' stroke-width="1.6"') + sPoly([[x, y], [x + d, y - d], [x + a + d, y - d], [x + a, y]], 'mf-s2l', ' stroke-width="1.6"') + sPoly([[x + a, y], [x + a + d, y - d], [x + a + d, by - d], [x + a, by]], 'mf-s3l', ' stroke-width="1.6"');
      else s += sPoly([[x, by], [x + 36, by], [x + 18, by - 44]], 'mf-s1l', ' stroke-width="1.6"') + sPoly([[x + 36, by], [x + 68, by - 18], [x + 50, by - 62], [x + 18, by - 44]], 'mf-s3l', ' stroke-width="1.6"');
    } else if (k === 'cylinder') s += sP(`M${cx - 30} ${by - 70} L${cx - 30} ${by} A30 9 0 0 0 ${cx + 30} ${by} L${cx + 30} ${by - 70}`, 'mf-s1l', ' stroke-width="1.6"') + `<ellipse cx="${cx}" cy="${by - 70}" rx="30" ry="9" class="mf-s2l" stroke-width="1.6"/>`;
    else if (k === 'cone') s += sP(`M${cx - 32} ${by} L${cx} ${by - 78} L${cx + 32} ${by} A32 9 0 0 1 ${cx - 32} ${by}Z`, 'mf-s1l', ' stroke-width="1.6"') + sP(`M${cx - 32} ${by} A32 9 0 0 1 ${cx + 32} ${by}`, 'mf-line', ' fill="none" stroke-dasharray="4 3"');
    else if (k === 'sphere') s += sC(cx, by - 38, 38, 'mf-s1l', ' stroke-width="1.6"') + `<ellipse cx="${cx}" cy="${by - 38}" rx="38" ry="11" fill="none" class="mf-line" stroke-dasharray="4 3"/>`;
    else if (k === 'pyramid') s += sPoly([[cx - 36, by], [cx + 22, by], [cx, by - 76]], 'mf-s1l', ' stroke-width="1.6"') + sPoly([[cx + 22, by], [cx + 40, by - 16], [cx, by - 76]], 'mf-s3l', ' stroke-width="1.6"');
    s += sT(cx, H - 10, name, 'mf-lab-b');
  });
  return s + '</svg>';
}

/* ---------- diagrams ---------- */
function treeSvg(levels, { label, W = 440, leaf } = {}) {   // levels: [[labels of the first branches with probabilities], [...second level per branch]]
  const [lv1, lv2] = levels, n1 = lv1.length, n2 = lv2 ? lv2[0].length : 0, leaves = n1 * Math.max(1, n2), H = Math.max(140, leaves * 36 + 20);
  const x0 = 20, x1 = lv2 ? 180 : 260, x2 = 340, rowY = i => 18 + (i + 0.5) * (H - 30) / leaves;
  let s = svgBox(W, H, label) + sC(x0, H / 2, 4, 'mf-dot');
  lv1.forEach(([t, p], i) => {
    const y1 = lv2 ? (rowY(i * n2) + rowY(i * n2 + n2 - 1)) / 2 : rowY(i);
    s += sL(x0, H / 2, x1 - 20, y1, 'mf-c1') + sT((x0 + x1) / 2 - 8, (H / 2 + y1) / 2 - 6, p, 'mf-small') + sT(x1 - 12, y1 + 5, t, 'mf-lab-b', 'start');
    if (lv2) lv2[i].forEach(([t2, p2], j) => {
      const y2 = rowY(i * n2 + j);
      s += sL(x1 + 20, y1, x2 - 20, y2, 'mf-c2') + sT((x1 + x2) / 2 + 6, (y1 + y2) / 2 - 6, p2, 'mf-small') + sT(x2 - 12, y2 + 5, t2, 'mf-lab-b', 'start') + (leaf ? sT(x2 + 26, y2 + 5, leaf[i][j], 'mf-small', 'start') : '');
    });
  });
  return s + '</svg>';
}
function venn2Svg({ label, a = 'A', b = 'B', shade = [], texts = {} } = {}) {   // shade: any of 'a' (A only), 'ab', 'b', 'out'
  const W = 320, H = 190, id = 'vn' + (++venn2Svg.n);
  let s = svgBox(W, H, label) + `<defs><clipPath id="${id}a"><circle cx="125" cy="98" r="64"/></clipPath><clipPath id="${id}b"><circle cx="195" cy="98" r="64"/></clipPath></defs>`;
  if (shade.includes('out')) s += sR(6, 6, 308, 178, 'mf-s1l', 4);
  if (shade.includes('a') || shade.includes('out')) s += sC(125, 98, 64, shade.includes('a') ? 'mf-s1l' : 'mf-paper');
  if (shade.includes('b') || shade.includes('out')) s += sC(195, 98, 64, shade.includes('b') ? 'mf-s1l' : 'mf-paper');
  if (shade.includes('ab')) s += `<circle cx="195" cy="98" r="64" class="mf-s2" clip-path="url(#${id}a)" fill-opacity="0.55"/>`;
  else if (shade.includes('a') || shade.includes('b') || shade.includes('out')) s += `<circle cx="195" cy="98" r="64" class="mf-paper" clip-path="url(#${id}a)"/>`;
  s += sR(6, 6, 308, 178, 'mf-frame', 4) + sC(125, 98, 64, 'mf-ring') + sC(195, 98, 64, 'mf-ring') + sT(18, 26, 'U', 'mf-var', 'start') + sT(72, 36, a, 'mf-var') + sT(248, 36, b, 'mf-var');
  Object.entries(texts).forEach(([k, t]) => { const p = { a: [98, 103], ab: [160, 103], b: [222, 103], out: [160, 178] }[k]; s += sT(p[0], p[1], t, 'mf-lab'); });
  return s + '</svg>';
}
venn2Svg.n = 0;
function balanceSvg(left, right, { label, tilt = 0 } = {}) {   // left/right: text on each pan
  const W = 420, H = 200, cx = 210, t = tilt * 8;
  let s = svgBox(W, H, label) + sPoly([[cx - 26, 186], [cx + 26, 186], [cx, 70]], 'mf-s3l', ' stroke-width="1.6"') + sL(cx - 150, 70 + t, cx + 150, 70 - t, 'mf-line', ' stroke-width="4"') + sC(cx, 70, 6, 'mf-dot');
  [[cx - 150, 70 + t, left], [cx + 150, 70 - t, right]].forEach(([x, y, txt]) => { s += sL(x, y, x - 50, y + 50) + sL(x, y, x + 50, y + 50) + sP(`M${x - 64} ${y + 50} L${x + 64} ${y + 50} Q${x} ${y + 84} ${x - 64} ${y + 50}Z`, 'mf-s1l', ' stroke-width="1.6"') + sT(x, y + 40, txt, 'mf-lab-b'); });
  return s + '</svg>';
}
function stepsSvg(items, { label, W = 460, down = true, arrowText } = {}) {   // a staircase of boxes, e.g. metric units
  const n = items.length, bw = (W - 20) / n, H = 40 + n * 16 + 40;
  let s = svgBox(W, H, label);
  items.forEach((t, i) => { const x = 10 + i * bw, y = 20 + (down ? i : n - 1 - i) * 16; s += sR(x + 3, y, bw - 6, 34, ['mf-s1l', 'mf-s2l', 'mf-s3l', 'mf-s4l'][i % 4], 6, ' stroke-width="1.5"') + sT(x + bw / 2, y + 22, t, 'mf-lab-b'); if (i < n - 1 && arrowText) s += sT(x + bw, y + 58, arrowText, 'mf-small'); });
  return s + '</svg>';
}
function flowSvg(items, { label, W = 460 } = {}) {   // vertical flow of boxes joined by arrows
  const bh = 38, gap = 22, H = items.length * (bh + gap) - gap + 8;
  let s = svgBox(W, H, label);
  items.forEach((t, i) => { const y = 4 + i * (bh + gap); s += sR(30, y, W - 60, bh, ['mf-s1l', 'mf-s2l', 'mf-s3l', 'mf-s4l'][i % 4], 8, ' stroke-width="1.5"') + sT(W / 2, y + bh / 2 + 5, t, 'mf-lab-b'); if (i < items.length - 1) s += sArrow(W / 2, y + bh + 2, W / 2, y + bh + gap - 2, 'mf-line', 8); });
  return s + '</svg>';
}
function networkSvg(nodes, edges, { label, W = 360, H = 220, degrees = false, highlight = [] } = {}) {   // nodes: [[x, y, name]] in px
  let s = svgBox(W, H, label);
  edges.forEach(([i, j, t]) => { const [x1, y1] = nodes[i], [x2, y2] = nodes[j], hl = highlight.some(([a, b]) => (a === i && b === j) || (a === j && b === i)); s += sL(x1, y1, x2, y2, hl ? 'mf-c2' : 'mf-line', hl ? ' stroke-width="4"' : ' stroke-width="2"') + (t != null ? sT((x1 + x2) / 2, (y1 + y2) / 2 - 5, t, 'mf-small') : ''); });
  nodes.forEach(([x, y, t], i) => { const d = edges.filter(e => e[0] === i || e[1] === i).length; s += sC(x, y, 15, 'mf-node-c') + sT(x, y + 5, t, 'mf-lab-b') + (degrees ? sT(x + 20, y - 14, `d=${d}`, 'mf-small', 'start') : ''); });
  return s + '</svg>';
}
function pascalSvg(rows, { label, hl = [] } = {}) {
  const W = 40 * rows + 40, H = 30 * rows + 16;
  let s = svgBox(W, H, label);
  for (let n = 0; n < rows; n++) for (let k = 0; k <= n; k++) { const x = W / 2 + (k - n / 2) * 40, y = 22 + n * 30, on = hl.some(([a, b]) => a === n && b === k); s += sC(x, y - 5, 14, on ? 'mf-s2l' : 'mf-cellc') + sT(x, y, F(nCr(n, k)), 'mf-lab'); }
  return s + '</svg>';
}

/* ---------- more builders for the elementary topics ---------- */
const FigRow = (items, cap) => `<figure class="fig"><div class="fig-row">${items.map(([svg, c]) => `<div>${svg}${c ? `<div class="cap">${c}</div>` : ''}</div>`).join('')}</div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
function placeChartSvg(heads, digits, { label, values, hl = -1 } = {}) {   // a row of place-value columns: header, digit, value
  const n = heads.length, cw = 78, W = n * cw + 8, H = values ? 124 : 96;
  let s = svgBox(W, H, label);
  heads.forEach((h, i) => {
    const x = 4 + i * cw, on = i === hl;
    s += sR(x, 4, cw, 34, ['mf-s1l', 'mf-s2l', 'mf-s3l', 'mf-s4l'][Math.floor((n - 1 - i) / 3) % 4], 0, ' stroke-width="1.4"') + sT(x + cw / 2, 25, h, 'mf-small');
    s += sR(x, 38, cw, 46, on ? 'mf-s2l' : 'mf-cell', 0, ' stroke-width="1.4"') + sT(x + cw / 2, 70, digits[i], 'mf-node');
    if (values) s += sT(x + cw / 2, 108, values[i], 'mf-small');
  });
  return s + '</svg>';
}
function columnSvg(a, b, op = '+', { label } = {}) {   // column addition or subtraction with carries / borrows shown above
  const r = op === '+' ? a + b : a - b, len = Math.max(String(a).length, String(b).length, String(r).length), cw = 34, W = (len + 2) * cw, H = 170, x0 = W - cw;
  const dig = (n, i) => { const s = String(n); return i < s.length ? s[s.length - 1 - i] : ''; };
  let s = svgBox(W, H, label), carry = 0;
  for (let i = 0; i < len; i++) {
    const x = x0 - i * cw - cw / 2, da = +(dig(a, i) || 0), db = +(dig(b, i) || 0);
    if (op === '+') { if (carry) s += sT(x, 28, '1', 'mf-carry'); carry = da + db + carry >= 10 ? 1 : 0; }
    s += sT(x, 62, dig(a, i), 'mf-node') + sT(x, 96, dig(b, i), 'mf-node') + sT(x, 150, dig(r, i), 'mf-node-a');
  }
  if (op === '-') {   // mark the columns that had to borrow
    let bor = 0;
    for (let i = 0; i < len; i++) { const da = +(dig(a, i) || 0) - bor, db = +(dig(b, i) || 0); bor = da < db ? 1 : 0; if (bor) s += sT(x0 - i * cw - cw / 2, 28, '+10', 'mf-carry'); }
  }
  return s + sT(x0 - len * cw - 4, 96, op === '+' ? '+' : '−', 'mf-node') + sL(x0 - len * cw - 14, 112, x0 + 4, 112, 'mf-line', ' stroke-width="2"') + '</svg>';
}
function barModelSvg(parts, { label, W = 440, top, bottom } = {}) {   // parts: [text, weight, cls]
  const tot = parts.reduce((x, p) => x + p[1], 0), bw = W - 20, H = 64 + (top ? 28 : 0) + (bottom ? 26 : 0), y = top ? 32 : 8;
  let s = svgBox(W, H, label), x = 10;
  if (top) s += sP(`M10 ${y - 6} q0 -10 10 -10 H${W - 20} q10 0 10 10`, 'mf-line', ' fill="none"') + sT(W / 2, y - 20, top, 'mf-lab-b');
  parts.forEach(([t, w, cls = 'mf-s1l']) => { const pw = bw * w / tot; s += sR(x, y, pw, 44, cls, 0, ' stroke-width="1.6"') + sT(x + pw / 2, y + 27, t, 'mf-lab-b'); x += pw; });
  if (bottom) s += sT(W / 2, y + 66, bottom, 'mf-lab');
  return s + '</svg>';
}
function netSvg(l, w, h, { label, unit = 22 } = {}) {   // net of a cuboid (cross shape)
  const u = unit, W = (2 * l + 2 * w) * u + 20, H = (2 * w + h) * u + 20, x0 = 10 + w * u, y0 = 10;
  const R = (x, y, ww, hh, cls, t) => sR(x, y, ww * u, hh * u, cls, 0, ' stroke-width="1.6"') + sT(x + ww * u / 2, y + hh * u / 2 + 5, t, 'mf-small');
  let s = svgBox(W, H, label);
  s += R(x0, y0, l, w, 'mf-s2l', T`top`) + R(x0, y0 + w * u, l, h, 'mf-s1l', T`front`) + R(x0, y0 + (w + h) * u, l, w, 'mf-s2l', T`bottom`);
  s += R(x0 - w * u, y0 + w * u, w, h, 'mf-s3l', T`side`) + R(x0 + l * u, y0 + w * u, w, h, 'mf-s3l', T`side`) + R(x0 + (l + w) * u, y0 + w * u, l, h, 'mf-s1l', T`back`);
  return s + '</svg>';
}
const cP = (...v) => `(${v.map(x => F(x)).join(LS())})`;   // a coordinate label that follows the language's decimal comma, e.g. (1; 2,5)
