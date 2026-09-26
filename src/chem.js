/* ==========================================================================
   Chemistry helpers: numbers, units, scientific notation, charts, and the
   SVG diagrams the topics draw (see also fig.js and cfig.js).
   ========================================================================== */

/* ---------- numbers ---------- */
const NUM = x => F(x);   // plain-text number, usable where a generator has its own variable called F
const sig = (x, n = 3) => (x === 0 ? 0 : +(+x).toPrecision(n));            // round to n significant figures
const deg = r => (r * 180) / Math.PI, rad = d => (d * Math.PI) / 180;
const sinD = d => Math.sin(rad(d)), cosD = d => Math.cos(rad(d)), tanD = d => Math.tan(rad(d));
/* a unit written for TeX: m/s^2 -> \mathrm{m/s^2}; Ω and °C are handled */
function uT(u) {
  if (!u) return '';
  if (u === '°C') return '^\\circ\\mathrm{C}';
  if (u === '°') return '^\\circ';
  if (u === '%') return '\\%';
  return '\\mathrm{' + un(u).replace(/Ω/g, '\\Omega').replace(/·/g, '\\cdot ').replace(/ /g, '\\,') + '}';   // un(): local unit words, e.g. km/jam
}
const QT = (x, u, fixed) => `${M(x, fixed)}${u === '°' || u === '°C' || u === '%' ? '' : '\\,'}${uT(u)}`;   // quantity inside $…$
const Q = (x, u, fixed) => `$${QT(x, u, fixed)}$`;                                           // quantity as inline maths
/* scientific notation inside $…$: 3{,}0 \times 10^{8} */
function sciT(x, n = 3) {
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x))), m = +(x / 10 ** e).toPrecision(n);
  if (Math.abs(m) >= 10) { m /= 10; e += 1; }
  return e === 0 ? M(m) : `${M(m)} \\times 10^{${e}}`;
}

/* ---------- SVG building blocks ---------- */
const sub = (a, b) => `${a}<tspan class="fig-sub" dy="4">${b}</tspan>`;   // subscript inside an SVG label
const svgOpen = (w, h, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${String(label).replace(/\x22/g, '&quot;')}">`;
const txt = (x, y, s, cls = 'fig-text', anchor = 'middle') => `<text class="${cls}" x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" text-anchor="${anchor}">${s}</text>`;
/* an arrow from (x1,y1) to (x2,y2); kind picks the colour (a = accent, b = second colour, c = muted) */
function arrow(x1, y1, x2, y2, kind = 'a', width = 2.4) {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 11, W = 5.5;
  const bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
  const p1 = [bx + W * Math.sin(a), by - W * Math.cos(a)], p2 = [bx - W * Math.sin(a), by + W * Math.cos(a)];
  const f = n => +n.toFixed(1);
  return `<line class="fig-vec fig-vec-${kind}" style="stroke-width:${width}" x1="${f(x1)}" y1="${f(y1)}" x2="${f(bx)}" y2="${f(by)}"/><polygon class="fig-head fig-head-${kind}" points="${f(x2)},${f(y2)} ${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])}"/>`;
}
/* label placed just beyond the tip of an arrow */
function tipLabel(x1, y1, x2, y2, s, gap = 16) {
  const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a);
  const anchor = c > 0.5 ? 'start' : c < -0.5 ? 'end' : 'middle', g = anchor === 'middle' ? gap : 7;   // text starts (or ends) just past a sideways tip
  return txt(x2 + g * c, y2 + gap * Math.sin(a) + 5, s, 'fig-text', anchor);
}

/* ---------- a line graph with labelled axes (for motion graphs) ---------- */
/* pts: [[x, y], …] in data units; xs, ys: axis maxima; xl, yl: axis labels */
function graphSvg(pts, { xMax, yMax, yMin = 0, xl = 't (s)', yl = 'v (m/s)', xStep, yStep, label, dots = true }) {
  const W = 420, H = 250, L = 52, R = 18, Tp = 16, B = 40;
  const X = x => L + (x / xMax) * (W - L - R), Y = y => Tp + ((yMax - y) / (yMax - yMin)) * (H - Tp - B);
  let s = svgOpen(W, H, label || yl + ' – ' + xl);
  for (let x = xStep; x <= xMax + 1e-9; x += xStep) s += `<line class="fig-grid" x1="${X(x)}" y1="${Y(yMin)}" x2="${X(x)}" y2="${Y(yMax)}"/>` + txt(X(x), Y(yMin) + 18, F(x), 'fig-small');
  for (let y = Math.ceil(yMin / yStep - 1e-9) * yStep; y <= yMax + 1e-9; y += yStep) { if (Math.abs(y - yMin) > 1e-9) s += `<line class="fig-grid" x1="${X(0)}" y1="${Y(y)}" x2="${X(xMax)}" y2="${Y(y)}"/>`; s += txt(X(0) - 8, Y(y) + 4, F(y), 'fig-small', 'end'); }
  if (yMin < 0) s += `<line class="fig-line" x1="${X(0)}" y1="${Y(0)}" x2="${X(xMax)}" y2="${Y(0)}"/>`;
  s += arrow(X(0), Y(yMin), X(xMax) + 12, Y(yMin), 'c', 1.5) + arrow(X(0), Y(yMin), X(0), Y(yMax) - 10, 'c', 1.5);
  s += txt(X(xMax), Y(yMin) + 34, xl, 'fig-small', 'end') + txt(X(0) + 6, Tp + 2, yl, 'fig-small', 'start');
  s += `<polyline class="fig-plot" points="${pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')}"/>`;
  if (dots) pts.forEach(([x, y]) => { s += `<circle class="fig-dot" cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3"/>`; });
  return s + '</svg>';
}


/* ==========================================================================
   Drawing primitives. Colours come from CSS classes (g-*, fig-*) so every
   figure follows the light and dark themes.
   ========================================================================== */
const f1 = n => +(+n).toFixed(1);
/* compass letters for coordinates (N, S, E, W), from the interface text so each language has its own */
const dir = k => (I18N.ui && I18N.ui['dir' + k]) || k;
const FigW = (svg, cap) => Fig(svg, cap).replace('class="fig"', 'class="fig fig-wide"');   // a wider figure (maps, charts)
const P = pts => pts.map(p => `${f1(p[0])},${f1(p[1])}`).join(' ');
const polyg = (pts, cls, extra = '') => `<polygon class="${cls}" points="${P(pts)}"${extra}/>`;
const pline = (pts, cls, extra = '') => `<polyline class="${cls}" fill="none" points="${P(pts)}"${extra}/>`;
const path = (d, cls, extra = '') => `<path class="${cls}" d="${d}"${extra}/>`;
const ln = (x1, y1, x2, y2, cls = 'fig-line', extra = '') => `<line class="${cls}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"${extra}/>`;
const circ = (cx, cy, r, cls, extra = '') => `<circle class="${cls}" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}"${extra}/>`;
const rect = (x, y, w, h, cls, rx = 0, extra = '') => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"${rx ? ` rx="${rx}"` : ''}${extra}/>`;
const lbl = (x, y, s, anchor = 'middle', cls = 'g-label') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${s}</text>`;
const note = (x, y, s, anchor = 'middle') => lbl(x, y, s, anchor, 'g-note');
/* a smooth path through points (Catmull–Rom converted to cubic Béziers) */
function smooth(pts, closed = false) {
  if (pts.length < 3) return 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L');
  const n = pts.length, g = i => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
/* a curved arrow along an arc (for cycles and circulation cells) */
function arcArrow(cx, cy, r, a1, a2, kind = 'a', width = 2.2) {
  const pt = a => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
  const [x1, y1] = pt(a1), [x2, y2] = pt(a2), large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 < a1 ? 1 : 0;
  const t = rad(a2) + (a2 < a1 ? -Math.PI / 2 : Math.PI / 2), hx = x2 + 0.01 * Math.cos(t), hy = y2 - 0.01 * Math.sin(t);
  const back = [x2 - 11 * Math.cos(t), y2 + 11 * Math.sin(t)];
  return `<path class="fig-vec fig-vec-${kind}" style="stroke-width:${width}" d="M${f1(x1)} ${f1(y1)} A${f1(r)} ${f1(r)} 0 ${large} ${sweep} ${f1(x2)} ${f1(y2)}"/>` + arrow(back[0], back[1], hx, hy, kind, 0.1);
}
/* axes box shared by the charts: returns scale functions and the axis markup */
function axes({ W, H, L = 52, R = 20, Tp = 22, B = 42, xMin = 0, xMax, yMin = 0, yMax, xStep, yStep, xl = '', yl = '', xFmt, yFmt = F, xTicks, grid = true, yRight }) {
  if (!xFmt) xFmt = xMin >= 1000 && xMax <= 2200 ? String : F;   // years without a thousands separator
  const X = x => L + ((x - xMin) / (xMax - xMin)) * (W - L - R), Y = y => Tp + ((yMax - y) / (yMax - yMin)) * (H - Tp - B);
  let s = '';
  if (grid && yStep) for (let y = Math.ceil(yMin / yStep - 1e-9) * yStep; y <= yMax + 1e-9; y += yStep) s += ln(L, Y(y), W - R, Y(y), 'fig-grid') + txt(L - 7, Y(y) + 4, yFmt(sig(y, 6)), 'fig-small', 'end');
  const xs = xTicks || (xStep ? (() => { const a = []; for (let x = Math.ceil(xMin / xStep - 1e-9) * xStep; x <= xMax + 1e-9; x += xStep) a.push(x); return a; })() : []);
  xs.forEach(x => { s += ln(X(x), H - B, X(x), H - B + 4, 'fig-line') + txt(X(x), H - B + 17, xFmt(sig(x, 6)), 'fig-small'); });
  s += ln(L, H - B, W - R, H - B, 'fig-line') + ln(L, Tp - 4, L, H - B, 'fig-line');
  if (xl) s += txt((L + W - R) / 2, H - 6, xl, 'fig-small');
  if (yl) s += txt(L - 4, Tp - 9, yl, 'fig-small', 'start');
  if (yRight) s += ln(W - R, Tp - 4, W - R, H - B, 'fig-line');
  return { X, Y, s };
}
/* line chart. series: [{ pts: [[x, y], …], cls: 'g-l1', label, dots }] */
function lineChartSvg(series, o) {
  const W = o.W || 460, H = o.H || 260, a = axes({ W, H, ...o });
  let s = svgOpen(W, H, o.label) + a.s;
  series.forEach((sr, i) => {
    s += pline(sr.pts.map(([x, y]) => [a.X(x), a.Y(y)]), `g-line ${sr.cls || 'g-l' + (i + 1)}`, sr.dash ? ' stroke-dasharray="6 5"' : '');
    if (sr.dots) sr.pts.forEach(([x, y]) => { s += circ(a.X(x), a.Y(y), 3.2, (sr.cls || 'g-l' + (i + 1)).replace('g-l', 'g-s')); });
    if (sr.label) { const [x, y] = sr.pts[sr.at != null ? sr.at : sr.pts.length - 1]; s += lbl(a.X(x) + (sr.dx || -4), a.Y(y) + (sr.dy || -8), sr.label, sr.anchor || 'end'); }
  });
  return s + (o.extra ? o.extra(a) : '') + '</svg>';
}
/* vertical bar chart. items: [{ label, value, cls }] */
function barChartSvg(items, o) {
  const W = o.W || 460, H = o.H || 250, n = items.length, a = axes({ W, H, xMin: 0, xMax: n, ...o, xStep: 0 });
  const bw = (a.X(1) - a.X(0)) * 0.62;
  let s = svgOpen(W, H, o.label) + a.s;
  items.forEach((it, i) => {
    const x = a.X(i + 0.5), y = a.Y(Math.max(it.value, o.yMin || 0));
    s += rect(x - bw / 2, y, bw, a.Y(o.yMin || 0) - y, it.cls || 'g-s1', 2) + txt(x, H - (o.B || 42) + 16, it.label, 'fig-small');
    if (o.values !== false) s += note(x, y - 5, it.show != null ? it.show : F(it.value));
  });
  return s + (o.extra ? o.extra(a) : '') + '</svg>';
}
/* climograph: monthly rainfall bars (mm, left axis) and temperature line (°C, right axis) */
/* horizontal bars, e.g. a share of a whole. items: [{ label, value, cls }] */
function hbarSvg(items, { label, max, unit = '', W = 460 } = {}) {
  const rowH = 30, H = items.length * rowH + 16, L = 150, Rr = 96, m = max || Math.max(...items.map(i => i.value));
  let s = svgOpen(W, H, label);
  items.forEach((it, i) => {
    const y = 8 + i * rowH, w = (W - L - Rr) * it.value / m;
    s += txt(L - 8, y + 19, it.label, 'fig-small', 'end') + rect(L, y + 5, Math.max(w, 1), rowH - 10, it.cls || 'g-s1', 3) + note(L + w + 6, y + 19, (it.show != null ? it.show : F(it.value)) + unit, 'start');
  });
  return s + '</svg>';
}
/* donut chart. items: [{ label, value, cls }] */
function donutSvg(items, { label, center = '', W = 440 } = {}) {
  const H = 230, cx = 115, cy = 115, r = 88, r0 = 52, tot = items.reduce((a, b) => a + b.value, 0);
  let s = svgOpen(W, H, label), a0 = -90;
  items.forEach((it, i) => {
    const a1 = a0 + 360 * it.value / tot, big = a1 - a0 > 180 ? 1 : 0, p = (a, rr) => [cx + rr * cosD(a), cy + rr * sinD(a)];
    const [x1, y1] = p(a0, r), [x2, y2] = p(a1, r), [x3, y3] = p(a1, r0), [x4, y4] = p(a0, r0);
    s += path(`M${f1(x1)} ${f1(y1)} A${r} ${r} 0 ${big} 1 ${f1(x2)} ${f1(y2)} L${f1(x3)} ${f1(y3)} A${r0} ${r0} 0 ${big} 0 ${f1(x4)} ${f1(y4)}Z`, it.cls || 'g-s' + (i + 1), ' stroke="var(--paper)" stroke-width="2"');
    s += rect(236, 30 + i * 30, 14, 14, it.cls || 'g-s' + (i + 1), 3) + txt(258, 42 + i * 30, `${it.label}: ${it.show != null ? it.show : F(it.value)}`, 'fig-small', 'start');
    a0 = a1;
  });
  return s + (center ? lbl(cx, cy + 5, center) : '') + '</svg>';
}
/* population pyramid. groups: age labels from youngest; male/female: % of the total population */
/* a cycle of labelled stages on an ellipse, joined by curved arrows (rock cycle, disaster management, …) */
function cycleSvg(labels, { label, W = 470, H = 300, rx = 160, ry = 100, center = '' } = {}) {
  const n = labels.length, cx = W / 2, cy = H / 2 + 2, at = a => [cx + rx * cosD(a), cy - ry * sinD(a)];
  const ang = i => 90 - (360 * i) / n;
  let s = svgOpen(W, H, label);
  labels.forEach((_, i) => {   // arrow along the ellipse from stage i to stage i+1, leaving room for the boxes
    const a1 = ang(i) - 360 / n * 0.28, a2 = ang(i) - 360 / n * 0.72, pts = [...Array(13)].map((_, k) => at(a1 + (a2 - a1) * k / 12));
    s += path(smooth(pts), 'fig-vec fig-vec-a', ' style="stroke-width:2.2"') + arrow(pts[10][0], pts[10][1], pts[12][0], pts[12][1], 'a', 0.1);
  });
  labels.forEach((t, i) => {
    const [x, y] = at(ang(i)), w = Math.max(70, String(t).replace(/<[^>]+>/g, '').length * 7.4 + 20);
    s += rect(x - w / 2, y - 15, w, 30, 'fig-block', 8) + lbl(x, y + 4.5, t);
  });
  return s + (center ? lbl(cx, cy + 5, center, 'middle', 'g-title') : '') + '</svg>';
}

/* ---------- a hub: one idea in the middle, related ideas around it ---------- */
function hubSvg(center, items, { label, W = 480, H = 330, rx = 170, ry = 118 } = {}) {
  const cx = W / 2, cy = H / 2, n = items.length;
  let s = svgOpen(W, H, label);
  items.forEach((t, i) => { const a = 90 - 360 * i / n; s += ln(cx, cy, cx + rx * cosD(a), cy - ry * sinD(a), 'g-thin'); });
  s += circ(cx, cy, 44, 'g-s1', ' fill-opacity="0.16" stroke="var(--lv5)" stroke-width="2"') + lbl(cx, cy + 5, center, 'middle', 'g-title');
  items.forEach((t, i) => {
    const a = 90 - 360 * i / n, x = cx + rx * cosD(a), y = cy - ry * sinD(a), w = Math.max(64, String(t).length * 7 + 18);
    s += rect(x - w / 2, y - 13, w, 26, 'fig-block', 13) + lbl(x, y + 4.5, t);
  });
  return s + '</svg>';
}
