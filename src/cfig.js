/* ==========================================================================
   Chemistry data and figures: elements, electron configurations, the
   periodic table, atoms, structural formulas, molecular shapes, particles
   and apparatus. Built on fig.js (sT, sL, sC, …) and chem.js.
   ========================================================================== */

/* ---------- elements ---------- */
const SYMBOLS = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
const ZOF = Object.fromEntries(SYMBOLS.map((s, i) => [s, i + 1]));
/* standard atomic weights (IUPAC, abridged) and the rounded values used in school problems */
const AR = { H: 1.008, He: 4.003, Li: 6.94, Be: 9.012, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.95, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Ag: 107.87, Sn: 118.71, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33, Pt: 195.08, Au: 196.97, Hg: 200.59, Pb: 207.2, U: 238.03 };
const ARS = { H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40, K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Pb: 207 };
/* Pauling electronegativity and first ionisation energy (kJ/mol) for Z = 1–36 */
const EN = [2.20, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.90, 2.19, 2.58, 3.16, null, 0.82, 1.00, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.90, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, 3.00];
const IE1 = [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 763, 760, 737, 745, 906, 579, 762, 947, 941, 1140, 1351];
/* position in the 18-column table: [group, period] (f-block: group null, row 8 or 9) */
function tablePos(Z) {
  const starts = [1, 3, 11, 19, 37, 55, 87], lens = [2, 8, 8, 18, 18, 32, 32];
  let p = 0; while (p < 6 && Z >= starts[p + 1]) p++;
  const i = Z - starts[p], L = lens[p];
  if (L === 2) return [i === 0 ? 1 : 18, p + 1];
  if (L === 8) return [i < 2 ? i + 1 : i + 11, p + 1];
  if (L === 18) return [i + 1, p + 1];
  if (i < 2) return [i + 1, p + 1];
  if (i < 17) return [null, p + 1, i - 2];   // La–Lu or Ac–Lr: f row, column 0–14
  return [i - 14, p + 1];
}
const blockOf = Z => { const [g, , f] = tablePos(Z); if (g === null) return 'f'; if (Z === 2) return 's'; return g <= 2 ? 's' : g <= 12 ? 'd' : 'p'; };
/* electron configuration in filling order, with the usual exceptions */
const SUBSHELLS = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
const CAP = { s: 2, p: 6, d: 10, f: 14 };
function configOf(Z) {
  const out = []; let left = Z;
  for (const sh of SUBSHELLS) { if (!left) break; const n = Math.min(CAP[sh[1]], left); out.push([sh, n]); left -= n; }
  const fix = { 24: ['4s', 1, '3d', 5], 29: ['4s', 1, '3d', 10], 42: ['5s', 1, '4d', 5], 47: ['5s', 1, '4d', 10], 79: ['6s', 1, '5d', 10] }[Z];
  if (fix) out.forEach(e => { if (e[0] === fix[0]) e[1] = fix[1]; if (e[0] === fix[2]) e[1] = fix[3]; });
  return out;
}
const NOBLE = [[2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr'], [54, 'Xe'], [86, 'Rn']];
function configT(Z, short = false) {   // TeX, e.g. 1s^2\,2s^2\,2p^6 or [\mathrm{Ar}]\,4s^2\,3d^6
  let cf = configOf(Z), pre = '';
  if (short) { const ng = [...NOBLE].reverse().find(([z]) => z < Z); if (ng) { let k = ng[0]; const keep = []; for (const [sh, n] of cf) { if (k > 0) k -= n; else keep.push([sh, n]); } cf = keep; pre = `[\\mathrm{${ng[1]}}]\\,`; } }
  return pre + cf.map(([sh, n]) => `${sh}^{${n}}`).join('\\,');
}
const shellsOf = Z => { const sh = []; configOf(Z).forEach(([s, n]) => { const k = +s[0] - 1; sh[k] = (sh[k] || 0) + n; }); return sh; };   // electrons per shell
const valenceOf = Z => { const g = tablePos(Z)[0]; return g <= 2 ? g : g >= 13 ? g - 10 : null; };

/* ---------- chemical formulas ---------- */
const ce = s => `$\\ce{${s}}$`;   // inline mhchem
/* parse a simple formula (no brackets inside brackets): Ca(OH)2, CuSO4.5H2O → { Ca: 1, O: 2, H: 2 } */
function parseFormula(f) {
  const tot = {}, add = (o, k) => { Object.entries(o).forEach(([e, n]) => { tot[e] = (tot[e] || 0) + n * k; }); };
  f.split(/[.·]/).forEach(part => {
    const m = /^(\d*)(.*)$/.exec(part), k = +(m[1] || 1);
    const one = s => { const o = {}; s.replace(/([A-Z][a-z]?)(\d*)/g, (x, e, n) => { o[e] = (o[e] || 0) + (+n || 1); return x; }); return o; };
    let s = m[2], o = {};
    s = s.replace(/\(([^()]*)\)(\d*)/g, (x, inner, n) => { const q = one(inner); Object.keys(q).forEach(e => { o[e] = (o[e] || 0) + q[e] * (+n || 1); }); return ''; });
    const rest = one(s); Object.keys(rest).forEach(e => { o[e] = (o[e] || 0) + rest[e]; });
    add(o, k);
  });
  return tot;
}
const molarMass = (f, table = ARS) => Object.entries(parseFormula(f)).reduce((a, [e, n]) => a + table[e] * n, 0);
const mrWork = (f, table = ARS) => Object.entries(parseFormula(f)).map(([e, n]) => (n > 1 ? `${n} \\times ${M(table[e])}` : M(table[e]))).join(' + ');

/* ---------- small drawing helpers ---------- */
/* a label on up to two lines, split at the space nearest the middle when longer than n characters */
function wrap2(x, y, t, cls, n = 16, anchor = 'middle') {
  t = String(t); if (t.length <= n || !t.includes(' ')) return sT(x, y, t, cls, anchor);
  const mid = t.length / 2; let best = -1; for (let i = 0; i < t.length; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return sT(x, y, t.slice(0, best), cls, anchor) + sT(x, y + 13, t.slice(best + 1), cls, anchor);
}
const ATOM_CLS = { O: 'ch-O', N: 'ch-N', Cl: 'ch-X', F: 'ch-X', Br: 'ch-X', I: 'ch-X', S: 'ch-S', P: 'ch-S', Na: 'ch-M', K: 'ch-M', Mg: 'ch-M', Ca: 'ch-M', Fe: 'ch-M', Cu: 'ch-M', Zn: 'ch-M', Al: 'ch-M' };
const atomCls = lab => ATOM_CLS[String(lab).replace(/[^A-Za-z].*$/, '')] || 'ch-C';
const BALL = { H: ['ch-bH', 9], C: ['ch-bC', 13], O: ['ch-bO', 13], N: ['ch-bN', 13], Cl: ['ch-bX', 14], F: ['ch-bX', 11], S: ['ch-bS', 14], P: ['ch-bS', 14], B: ['ch-bC', 12], X: ['ch-bX', 12], E: ['ch-bC', 14] };

/* displayed (structural) formula: atoms [label, x, y] in grid units, bonds [i, j, order]; lp [[atom, angle°]] draws a lone pair */
function molSvg(atoms, bonds, { label, u = 36, pad = 22, lp = [], small = false, charges = [] } = {}) {
  const xs = atoms.map(a => a[1]), ys = atoms.map(a => a[2]), x0 = Math.min(...xs), y0 = Math.min(...ys);
  const W = (Math.max(...xs) - x0) * u + 2 * pad, H = (Math.max(...ys) - y0) * u + 2 * pad, X = x => pad + (x - x0) * u, Y = y => pad + (y - y0) * u;
  let s = svgBox(W, H, label);
  const rOf = lab => (String(lab).length > 1 ? 12 : 9);
  bonds.forEach(([i, j, o = 1]) => {
    const [, xa, ya] = atoms[i], [, xb, yb] = atoms[j], ax = X(xa), ay = Y(ya), bx = X(xb), by = Y(yb), L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, ra = atoms[i][0] ? rOf(atoms[i][0]) : 0, rb = atoms[j][0] ? rOf(atoms[j][0]) : 0;
    const x1 = ax + ux * ra, y1 = ay + uy * ra, x2 = bx - ux * rb, y2 = by - uy * rb, px = -uy, py = ux;
    const offs = o === 1 ? [0] : o === 2 ? [-2.6, 2.6] : o === 1.5 ? [0, 4] : [-4, 0, 4];
    offs.forEach((d, k) => { s += sL(x1 + px * d, y1 + py * d, x2 + px * d, y2 + py * d, 'ch-bond', o === 1.5 && k === 1 ? ' stroke-dasharray="3 3"' : ''); });
  });
  atoms.forEach(([lab, x, y]) => { if (lab) s += sT(X(x), Y(y) + 5.5, lab, `ch-at ${atomCls(lab)}${small ? ' ch-sm' : ''}`); });
  lp.forEach(([i, a]) => { const [, x, y] = atoms[i], r = 15, t = a * Math.PI / 180, cx = X(x) + r * Math.cos(t), cy = Y(y) - r * Math.sin(t), px = -Math.sin(t) * 3.2, py = -Math.cos(t) * 3.2; s += sC(cx + px, cy + py, 1.9, 'ch-dot') + sC(cx - px, cy - py, 1.9, 'ch-dot'); });
  charges.forEach(([i, t, dx = 11, dy = -8]) => { const [, x, y] = atoms[i]; s += sT(X(x) + dx, Y(y) + dy, t, 'ch-charge', dx === 0 ? 'middle' : 'start'); });
  return s + '</svg>';
}
/* Lewis symbol of one atom or ion: the symbol with dots (or crosses) around it; n dots, filled N, E, S, W then paired */
function lewisAtom(x, y, sym, n, { mark = 'dot', cls = '', bracket, charge } = {}) {
  const spots = [[0, -1], [1, 0], [0, 1], [-1, 0]], order = [0, 1, 2, 3, 0, 1, 2, 3];
  let s = sT(x, y + 6, sym, `ch-at ${cls || atomCls(sym)}`), cnt = [0, 0, 0, 0];
  for (let k = 0; k < n; k++) cnt[order[k]]++;
  cnt.forEach((c, i) => { const [dx, dy] = spots[i], cx = x + dx * 17, cy = y + dy * 17; for (let j = 0; j < c; j++) { const o = c === 2 ? (j ? 3.6 : -3.6) : 0, px = cx + (dy ? o : 0), py = cy + (dx ? o : 0); s += mark === 'x' ? sT(px, py + 3.5, '×', 'ch-x') : sC(px, py, 2.1, 'ch-dot'); } });
  if (bracket) s += sT(x - 27, y + 10, '[', 'ch-br') + sT(x + 27, y + 10, ']', 'ch-br');
  if (charge) s += sT(x + (bracket ? 33 : 13), y - 12, charge, 'ch-charge', 'start');
  return s;
}

/* ---------- molecular shapes (VSEPR), drawn as ball-and-stick with wedges and dashes ---------- */
const SHAPES = {
  linear: { b: [[-62, 0], [62, 0]] },
  'trigonal planar': { b: [[0, -60], [52, 30], [-52, 30]] },
  tetrahedral: { b: [[0, -62], [-56, 22], [44, 40, 'w'], [54, 6, 'd']] },
  'trigonal pyramidal': { b: [[-56, 22], [44, 40, 'w'], [54, 6, 'd']], lp: [[0, -44]] },
  bent: { b: [[-50, 34], [50, 34]], lp: [[-26, -38], [26, -38]] },
  'trigonal bipyramidal': { b: [[0, -66], [0, 66], [-62, 8], [42, 30, 'w'], [40, -16, 'd']] },
  octahedral: { b: [[0, -66], [0, 66], [-64, 0], [64, 0], [-34, 30, 'w'], [34, -30, 'd']] },
};
function shapeSvg(kind, { label, centre = 'E', outer = 'X', W = 170, H = 170, name } = {}) {
  const cx = W / 2, cy = H / 2 - (name ? 8 : 0), sh = SHAPES[kind];
  let s = svgBox(W, H, label || kind);
  (sh.lp || []).forEach(([dx, dy]) => { const a = Math.atan2(dy, dx) * 180 / Math.PI; s += `<ellipse cx="${f1(cx + dx * 0.72)}" cy="${f1(cy + dy * 0.72)}" rx="17" ry="10" transform="rotate(${f1(a)} ${f1(cx + dx * 0.72)} ${f1(cy + dy * 0.72)})" class="ch-lobe"/>` + sC(cx + dx * 0.72 - 4 * Math.sin(a * Math.PI / 180), cy + dy * 0.72 + 4 * Math.cos(a * Math.PI / 180), 2, 'ch-dot') + sC(cx + dx * 0.72 + 4 * Math.sin(a * Math.PI / 180), cy + dy * 0.72 - 4 * Math.cos(a * Math.PI / 180), 2, 'ch-dot'); });
  const [oc, orr] = BALL[outer] || BALL.X, [cc, cr] = BALL[centre] || BALL.E;
  const ord = sh.b.map((b, i) => [b, i]).sort((p, q) => (p[0][2] === 'd' ? -1 : 0) - (q[0][2] === 'd' ? -1 : 0));
  ord.forEach(([[dx, dy, k]]) => {
    const x2 = cx + dx, y2 = cy + dy;
    if (k === 'w') { const L = Math.hypot(dx, dy), px = -dy / L * 6, py = dx / L * 6; s += sPoly([[cx, cy], [x2 + px, y2 + py], [x2 - px, y2 - py]], 'ch-wedge'); }
    else if (k === 'd') { for (let t = 0.2; t <= 1; t += 0.13) { const L = Math.hypot(dx, dy), px = -dy / L * 6 * t, py = dx / L * 6 * t, x = cx + dx * t, y = cy + dy * t; s += sL(x + px, y + py, x - px, y - py, 'ch-bond'); } }
    else s += sL(cx, cy, x2, y2, 'ch-stick');
  });
  s += sC(cx, cy, cr, cc);
  ord.forEach(([[dx, dy, k]]) => { if (k === 'd') s += sC(cx + dx, cy + dy, orr * 0.85, oc, ' opacity="0.75"'); });
  ord.forEach(([[dx, dy, k]]) => { if (k !== 'd') s += sC(cx + dx, cy + dy, orr, oc); });
  if (name) s += sT(W / 2, H - 6, name, 'mf-lab-b');
  return s + '</svg>';
}

/* ---------- atoms ---------- */
/* Bohr model: nucleus with p and n, electrons on shells */
function bohrSvg(Z, { label, A, W = 240, name } = {}) {
  const sh = shellsOf(Z), n = sh.length, cx = W / 2, R0 = 26, dr = Math.min(24, (W / 2 - 34) / Math.max(1, n)), H = 2 * (R0 + n * dr) + 20 + (name ? 20 : 0), cy = R0 + n * dr + 10;
  let s = svgBox(W, H, label || `Bohr model of ${SYMBOLS[Z - 1]}`);
  sh.forEach((e, k) => { const r = R0 + (k + 1) * dr - 4; s += sC(cx, cy, r, 'mf-ring', ' stroke="var(--ink-3)" stroke-width="1.2"'); for (let j = 0; j < e; j++) { const a = -Math.PI / 2 + 2 * Math.PI * j / e + k * 0.3; s += sC(cx + r * Math.cos(a), cy + r * Math.sin(a), 4.2, 'ch-e'); } });
  s += sC(cx, cy, R0 - 6, 'ch-nuc') + sT(cx, cy - 2, `${Z}p`, 'mf-small') + (A ? sT(cx, cy + 11, `${A - Z}n`, 'mf-small') : '');
  if (name) s += sT(cx, H - 6, name, 'mf-lab-b');
  return s + '</svg>';
}
/* orbital boxes (arrows) for the occupied subshells of Z, in filling order */
function orbitalSvg(Z, { label, from = 0 } = {}) {
  const cf = configOf(Z).slice(from), bw = 22, gap = 16;
  const W = cf.reduce((a, [sh]) => a + CAP[sh[1]] / 2 * bw + gap, 16), H = 78;
  let s = svgBox(W, H, label || 'orbital diagram'), x = 10;
  cf.forEach(([sh, n]) => {
    const k = CAP[sh[1]] / 2;
    for (let i = 0; i < k; i++) {
      const bx = x + i * bw, up = i < n ? 1 : 0, dn = n > k && i < n - k ? 1 : 0;   // Hund: one up in each box first, then pair
      s += sR(bx, 14, bw, 30, 'mf-cell', 0, ' stroke-width="1.4"');
      if (up) s += sArrow(bx + (dn ? 7 : 11), 40, bx + (dn ? 7 : 11), 18, 'mf-c1', 6);
      if (dn) s += sArrow(bx + 15, 18, bx + 15, 40, 'mf-c2', 6);
    }
    s += sT(x + k * bw / 2, 62, sh, 'mf-lab-b'); x += k * bw + gap;
  });
  return s + '</svg>';
}
/* the periodic table: cells coloured by block (or by a function Z -> class), optional highlights and labels */
function periodicSvg({ label, color = 'block', hl = [], mark = {}, maxZ = 118, cell = 30, f = true, trend } = {}) {
  const gap = 2, L = 22, T0 = 22, W = L + 18 * (cell + gap) + 6, rows = f ? 9 : 7, H = T0 + rows * (cell + gap) + (f ? 10 : 0) + 8;
  const BC = { s: 'ch-ts', p: 'ch-tp', d: 'ch-td', f: 'ch-tf' };
  let s = svgBox(W, H, label || 'periodic table');
  for (let g = 1; g <= 18; g++) s += sT(L + (g - 1) * (cell + gap) + cell / 2, 14, g, 'ch-tiny');
  for (let p = 1; p <= 7; p++) s += sT(10, T0 + (p - 1) * (cell + gap) + cell / 2 + 4, p, 'ch-tiny');
  for (let Z = 1; Z <= maxZ; Z++) {
    const [g, p, fc] = tablePos(Z);
    if (g === null && !f) continue;
    const x = g === null ? L + (fc + 2) * (cell + gap) : L + (g - 1) * (cell + gap), y = g === null ? T0 + (p + 1) * (cell + gap) + 10 : T0 + (p - 1) * (cell + gap);
    const cls = typeof color === 'function' ? color(Z) : BC[blockOf(Z)], on = !hl.length || hl.includes(Z);
    s += sR(x, y, cell, cell, cls, 3, on ? '' : ' opacity="0.28"') + sT(x + cell / 2, y + cell / 2 + 4, SYMBOLS[Z - 1], 'ch-tsym') + sT(x + 3, y + 8.5, Z, 'ch-tz', 'start');
    if (mark[Z]) s += sR(x - 1.5, y - 1.5, cell + 3, cell + 3, 'ch-tmark', 4);
  }
  if (f) s += sT(L + 2 * (cell + gap) - 4, T0 + 7 * (cell + gap) + 10 + cell / 2 + 4, '57–71', 'ch-tiny', 'end') + sT(L + 2 * (cell + gap) - 4, T0 + 8 * (cell + gap) + 10 + cell / 2 + 4, '89–103', 'ch-tiny', 'end');
  if (trend) s += trend(L, T0, cell + gap);
  return s + '</svg>';
}

/* ---------- particles and states ---------- */
function particleBox(kind, { label, W = 150, H = 130, seed = 3, cls = 'ch-p1', name } = {}) {
  let s = svgBox(W, H + (name ? 22 : 0), label || kind) + sR(6, 6, W - 12, H - 12, 'ch-box', 6), r = 9, rnd = mulberry32(seed);
  if (kind === 'solid') { for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) s += sC(30 + i * 22, 38 + j * 21, r, cls); }
  else if (kind === 'liquid') { for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) { if (rnd() < 0.18) continue; s += sC(22 + i * 21 + (j % 2) * 8 + (rnd() - 0.5) * 5, H - 26 - j * 20 + (rnd() - 0.5) * 5, r, cls); } }
  else { const pts = []; for (let i = 0; i < 7; i++) { let x, y, ok, t = 0; do { x = 22 + rnd() * (W - 44); y = 22 + rnd() * (H - 44); ok = pts.every(([a, b]) => Math.hypot(a - x, b - y) > 3.2 * r); } while (!ok && ++t < 300); pts.push([x, y]); const a = rnd() * 6.28; s += sC(x, y, r, cls) + sArrow(x + 11 * Math.cos(a), y + 11 * Math.sin(a), x + 26 * Math.cos(a), y + 26 * Math.sin(a), 'mf-c2', 5); } }
  if (name) s += sT(W / 2, H + 16, name, 'mf-lab-b');
  return s + '</svg>';
}
/* a box of molecules drawn from a recipe [[count, [[atom, dx, dy], …]], …] */
function moleculeBox(recipe, { label, W = 190, H = 160, seed = 5, name } = {}) {
  let s = svgBox(W, H + (name ? 22 : 0), label) + sR(4, 4, W - 8, H - 8, 'ch-box', 6), rnd = mulberry32(seed), placed = [];
  recipe.forEach(([count, parts]) => { for (let k = 0; k < count; k++) { let x, y, ok, t = 0; do { x = 26 + rnd() * (W - 52); y = 26 + rnd() * (H - 52); ok = placed.every(([a, b]) => Math.hypot(a - x, b - y) > 42); } while (!ok && ++t < 2000); placed.push([x, y]); const rot = rnd() * Math.PI; [...parts].sort((p, q) => (BALL[q[0]] || BALL.X)[1] - (BALL[p[0]] || BALL.X)[1]).forEach(([a, dx, dy]) => { const [c, r] = BALL[a] || BALL.X; s += sC(x + dx * Math.cos(rot) - dy * Math.sin(rot), y + dx * Math.sin(rot) + dy * Math.cos(rot), r * 0.72, c); }); } });
  if (name) s += sT(W / 2, H + 16, name, 'mf-lab-b');
  return s + '</svg>';
}
const MOL = { H2: [['H', -6, 0], ['H', 6, 0]], O2: [['O', -8, 0], ['O', 8, 0]], N2: [['N', -8, 0], ['N', 8, 0]], Cl2: [['Cl', -8, 0], ['Cl', 8, 0]], H2O: [['O', 0, 0], ['H', -9, 7], ['H', 9, 7]], CO2: [['C', 0, 0], ['O', -14, 0], ['O', 14, 0]], HCl: [['H', -8, 0], ['Cl', 5, 0]], NH3: [['N', 0, 0], ['H', -9, 7], ['H', 9, 7], ['H', 0, -10]], CH4: [['C', 0, 0], ['H', -9, -7], ['H', 9, -7], ['H', -9, 7], ['H', 9, 7]], He: [['He', 0, 0]], O: [['O', 0, 0]], C: [['C', 0, 0]] };

/* ---------- apparatus ---------- */
const APP = {
  beaker: (x, y) => sP(`M${x - 22} ${y - 44}h44v40a4 4 0 0 1-4 4h-36a4 4 0 0 1-4-4z`, 'ch-glass') + sR(x - 21, y - 22, 42, 21, 'ch-liq', 3) + [0, 1, 2].map(i => sL(x + 12, y - 36 + i * 9, x + 20, y - 36 + i * 9, 'mf-thin')).join(''),
  flask: (x, y) => sP(`M${x - 7} ${y - 52}v18l-19 28a4 4 0 0 0 3 6h46a4 4 0 0 0 3-6l-19-28v-18z`, 'ch-glass') + sP(`M${x - 18} ${y - 18}h36l8 12a4 4 0 0 1-3 6h-46a4 4 0 0 1-3-6z`, 'ch-liq'),
  cylinder: (x, y) => sR(x - 10, y - 70, 20, 66, 'ch-glass', 2) + sR(x - 9, y - 40, 18, 35, 'ch-liq') + sR(x - 18, y - 5, 36, 5, 'ch-glass', 2) + [0, 1, 2, 3, 4, 5].map(i => sL(x - 10, y - 64 + i * 10, x - 3, y - 64 + i * 10, 'mf-thin')).join(''),
  burette: (x, y) => sR(x - 5, y - 96, 10, 82, 'ch-glass', 2) + sR(x - 4, y - 70, 8, 55, 'ch-liq') + sR(x - 9, y - 16, 18, 5, 'mf-s3l', 1) + sP(`M${x - 2} ${y - 11}l0 9h4l0-9`, 'ch-glass') + [0, 1, 2, 3, 4, 5, 6].map(i => sL(x - 5, y - 90 + i * 11, x, y - 90 + i * 11, 'mf-thin')).join(''),
  pipette: (x, y) => sL(x, y - 96, x, y - 60, 'ch-glass-l') + `<ellipse cx="${x}" cy="${y - 48}" rx="7" ry="14" class="ch-glass"/>` + sL(x, y - 34, x, y - 2, 'ch-glass-l') + sL(x - 4, y - 80, x + 4, y - 80, 'mf-c4'),
  tube: (x, y) => sP(`M${x - 8} ${y - 60}v52a8 8 0 0 0 16 0v-52`, 'ch-glass') + sP(`M${x - 7} ${y - 28}v20a7 7 0 0 0 14 0v-20z`, 'ch-liq'),
  tubeL: (x, y) => sP(`M${x - 13} ${y - 94}v80a13 13 0 0 0 26 0v-80`, 'ch-glass') + sP(`M${x - 12} ${y - 50}v36a12 12 0 0 0 24 0v-36z`, 'ch-liq'),
  burner: (x, y) => sR(x - 5, y - 44, 10, 38, 'mf-s3l', 1, ' stroke="var(--ink-2)"') + sR(x - 16, y - 6, 32, 6, 'mf-s3l', 2, ' stroke="var(--ink-2)"') + sP(`M${x} ${y - 72}c-8 10-8 20 0 26c8-6 8-16 0-26z`, 'ch-flame') + sP(`M${x} ${y - 62}c-4 6-4 12 0 15c4-3 4-9 0-15z`, 'ch-flame2'),
  funnel: (x, y) => sP(`M${x - 24} ${y - 50}h48l-20 26v18h-8v-18z`, 'ch-glass'),
};
function apparatusSvg(items, { label } = {}) {   // items: [[kind, name], …] in a row
  const cw = 104, W = items.length * cw, H = 150;
  let s = svgBox(W, H, label);
  items.forEach(([k, name], i) => { s += APP[k](i * cw + cw / 2, 104) + wrap2(i * cw + cw / 2, 124, name, 'mf-small', 14); });
  return s + '</svg>';
}

/* ---------- changes of state ---------- */
function statesSvg({ label, names } = {}) {   // names: {s, l, g, melt, freeze, evap, cond, sub, dep}
  const P = { s: [80, 216], l: [380, 216], g: [230, 60] };
  let s = svgBox(460, 270, label);
  const arc = (a, b, off, t, cls) => { const [x1, y1] = P[a], [x2, y2] = P[b], mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, cx = mx + nx * off, cy = my + ny * off, sx = x1 + dx / L * 44 + nx * off * 0.35, sy = y1 + dy / L * 44 + ny * off * 0.35, ex = x2 - dx / L * 44 + nx * off * 0.35, ey = y2 - dy / L * 44 + ny * off * 0.35;
    return sP(`M${f1(sx)} ${f1(sy)} Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}`, cls, ' fill="none" stroke-width="2.2"') + sArrow(ex - dx / L * 2, ey - dy / L * 2, ex, ey, cls, 9) + (() => { const inward = Math.hypot(mx + nx * off - 230, my + ny * off - 164) < Math.hypot(mx - 230, my - 164), k = inward ? 0.42 : 1.3; return sT(mx + nx * off * k, my + ny * off * k + 4, t, inward ? 'mf-small' : 'mf-lab-b'); })(); };
  s += arc('s', 'l', 30, names.melt, 'mf-c4') + arc('l', 's', 30, names.freeze, 'mf-c1') + arc('l', 'g', 30, names.evap, 'mf-c4') + arc('g', 'l', 30, names.cond, 'mf-c1') + arc('s', 'g', -30, names.sub, 'mf-c4') + arc('g', 's', -30, names.dep, 'mf-c1');
  [['s', names.s], ['l', names.l], ['g', names.g]].forEach(([k, t]) => { const [x, y] = P[k]; s += sC(x, y, 34, 'mf-s1l', ' stroke-width="1.6"') + sT(x, y + 5, t, 'mf-lab-b'); });
  return s + '</svg>';
}
/* ---------- separation techniques ---------- */
function filtrationSvg({ label, names } = {}) {
  let s = svgBox(200, 220, label);
  s += sP('M60 40h80l-34 44v40h-12v-40z', 'ch-glass') + sP('M66 44h68l-30 38h-8z', 'mf-s4l', ' stroke="var(--ink-3)"') + sP('M72 50h56l-24 30h-8z', 'mf-s3l', ' opacity="0.7"');
  s += sP('M50 208h100v-60h-100z', 'ch-glass') + sR(51, 170, 98, 37, 'ch-liq') + [0, 1, 2].map(i => sC(100, 130 + i * 12, 2.2, 'ch-e')).join('');
  return s + sT(150, 64, names.res, 'mf-small', 'start') + sT(152, 190, names.fil, 'mf-small', 'start') + sL(74, 29, 86, 47, 'mf-line', ' stroke-width="0.8"') + sT(8, 26, names.paper, 'mf-small', 'start') + '</svg>';
}
function distillationSvg({ label, names } = {}) {
  let s = svgBox(470, 240, label);
  s += sC(80, 112, 40, 'ch-glass') + sP('M44 124a40 40 0 0 0 72 0z', 'ch-liq') + sR(72, 36, 16, 42, 'ch-glass') + APP.burner(80, 226);
  s += sL(80, 36, 80, 18, 'ch-glass-l') + sR(75, 12, 10, 9, 'mf-s4l', 2) + sT(94, 20, names.thermo, 'mf-small', 'start');
  s += sL(88, 58, 346, 150, 'ch-glass-l') + sPoly([[128, 62], [344, 139], [336, 162], [120, 85]], 'ch-glass', ' fill-opacity="0.35"') + sT(236, 96, names.cond, 'mf-small');
  s += sArrow(330, 186, 330, 162, 'mf-c1', 6) + sArrow(126, 60, 126, 40, 'mf-c1', 6) + sT(322, 194, names.win, 'mf-small', 'end') + sT(132, 40, names.wout, 'mf-small', 'start');
  s += sP('M362 150h60v58a4 4 0 0 1-4 4h-52a4 4 0 0 1-4-4z', 'ch-glass') + sR(363, 182, 58, 29, 'ch-liq', 3);
  return s + sT(392, 230, names.dist, 'mf-small') + sT(124, 138, names.mix, 'mf-small', 'start') + '</svg>';
}
function chromatogramSvg(spots, { label, front = 150, names } = {}) {   // spots: [[x, distance, cls]]
  const base = 190, W = 60 + spots.length * 44;
  let s = svgBox(W + 110, 230, label) + sR(30, 20, W - 20, 196, 'mf-cell', 2, ' stroke-width="1.4"');
  s += sL(30, base, W + 10, base, 'mf-thin', ' stroke-dasharray="4 3"') + sL(30, base - front, W + 10, base - front, 'mf-c1', ' stroke-dasharray="6 3"') + sR(30, base + 6, W - 20, 20, 'ch-liq');
  spots.forEach(([x, d, cls]) => { s += `<ellipse cx="${x}" cy="${base - d}" rx="8" ry="6" class="${cls || 'mf-s4'}"/>` + sC(x, base, 2.5, 'mf-dot'); });
  return s + sT(W + 16, base - front + 4, names.front, 'mf-small', 'start') + sT(W + 16, base + 4, names.start, 'mf-small', 'start') + sT(W + 16, base + 22, names.solvent, 'mf-small', 'start') + '</svg>';
}
/* ---------- hazard pictograms (GHS style: red diamond, black symbol) ---------- */
const GHS = {
  flame: '<path d="M0 14c-8 0-12-6-10-13 2-5 6-7 5-14 6 4 8 9 7 13 2-2 3-4 3-7 5 5 6 10 5 14-1 5-5 7-10 7z" class="ghs-k"/><path d="M-14 16h28" class="ghs-l"/>',
  corrosive: '<path d="M-12-12l6 4M0-14l4 5" class="ghs-l"/><path d="M-10-6c0 3 2 4 2 6M3-8c0 3 2 4 2 6" class="ghs-l"/><path d="M-16 4h12v4h-12zM2 4l12 0v6l-12 0z" class="ghs-k"/><path d="M-14 14h28" class="ghs-l"/>',
  toxic: '<circle cx="0" cy="-5" r="8" class="ghs-k"/><circle cx="-3" cy="-6" r="2" class="ghs-w"/><circle cx="3" cy="-6" r="2" class="ghs-w"/><path d="M-12 6l24 10M12 6l-24 10" class="ghs-l" style="stroke-width:3"/>',
  irritant: '<path d="M0-15v19" class="ghs-l" style="stroke-width:4.5"/><circle cx="0" cy="11" r="2.8" class="ghs-k"/>',
  health: '<circle cx="0" cy="-12" r="4" class="ghs-k"/><path d="M-8 16v-18h16v18z" class="ghs-k"/><path d="M0-4l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" class="ghs-w"/>',
  environment: '<path d="M-10-2l0 14M-10-2c-5-2-6-8-1-11 1-4 7-4 8 0 5 3 3 9-2 11z" class="ghs-k"/><path d="M2 8q7-6 13 0-6 6-13 0zM15 8l4-3v6z" class="ghs-k"/><path d="M-16 14h32" class="ghs-l"/>',
  oxidiser: '<circle cx="0" cy="4" r="7" class="ghs-l" style="fill:none"/><path d="M0-3c-6 0-8-5-6-9 1-3 4-4 3-8 4 3 6 6 5 9 1-1 2-3 2-5 3 3 4 6 3 9" class="ghs-k"/><path d="M-14 16h28" class="ghs-l"/>',
  gas: '<rect x="-15" y="-5" width="30" height="12" rx="6" class="ghs-k"/><path d="M15 1h3" class="ghs-l"/>',
  explosive: '<circle cx="0" cy="4" r="6" class="ghs-k"/><path d="M0-4v-10M-7-2l-6-7M7-2l6-7M-9 5h-7M9 5h7" class="ghs-l"/>',
};
function ghsSvg(items, { label } = {}) {   // items: [[kind, name]]
  const cw = 112, W = items.length * cw, H = 138;
  let s = svgBox(W, H, label);
  items.forEach(([k, t], i) => { const cx = i * cw + cw / 2, cy = 48; s += `<rect x="${cx - 30}" y="${cy - 30}" width="60" height="60" transform="rotate(45 ${cx} ${cy})" class="ghs-d"/><g transform="translate(${cx} ${cy}) scale(1.15)">${GHS[k]}</g>` + wrap2(cx, 108, t, 'mf-small', 16); });
  return s + '</svg>';
}
function meniscusSvg(val, { label, unit = 'mL' } = {}) {   // a measuring-cylinder close-up read at the bottom of the meniscus
  const top = Math.ceil(val) + 2, bot = top - 5, Y = v => 30 + (top - v) * 34;
  let s = svgBox(260, 230, label) + sR(90, 20, 80, 200, 'ch-glass');
  s += sP(`M91 ${f1(Y(val) - 6)} Q130 ${f1(Y(val) + 6)} 169 ${f1(Y(val) - 6)} V219 H91 Z`, 'ch-liq');
  for (let v = bot; v <= top; v += 0.2) { const t = Math.abs(v - Math.round(v)) < 1e-6; s += sL(90, Y(v), 90 + (t ? 22 : 11), Y(v), 'mf-line'); if (t) s += sT(84, Y(v) + 4, F(+v.toFixed(1)), 'mf-small', 'end'); }
  s += sL(60, Y(val), 200, Y(val), 'mf-c4', ' stroke-dasharray="5 4"') + sC(130, Y(val), 3, 'mf-s4');
  return s + sT(204, Y(val) + 4, unit, 'mf-small', 'start') + '</svg>';
}

/* ---------- models of the atom ---------- */
function atomModelsSvg(names, { label } = {}) {   // Dalton, Thomson, Rutherford, Bohr, quantum
  const cw = 120, W = cw * 5, cy = 66;
  let s = svgBox(W, 150, label);
  const cx = i => i * cw + cw / 2;
  s += sC(cx(0), cy, 38, 'mf-s3l', ' stroke-width="1.6"');
  s += sC(cx(1), cy, 40, 'ch-nuc') + [[-18, -14], [14, -20], [-6, 8], [20, 10], [-22, 18], [4, 26], [0, -32]].map(([dx, dy]) => sC(cx(1) + dx, cy + dy, 4.2, 'ch-e')).join('');
  s += [0, 60, 120].map(a => `<ellipse cx="${cx(2)}" cy="${cy}" rx="42" ry="14" transform="rotate(${a} ${cx(2)} ${cy})" class="mf-ring" stroke="var(--ink-3)" stroke-width="1.1"/>`).join('') + sC(cx(2), cy, 5, 'mf-s4') + sC(cx(2) + 42, cy, 4, 'ch-e') + sC(cx(2) - 21, cy - 36, 4, 'ch-e') + sC(cx(2) - 21, cy + 36, 4, 'ch-e');
  s += [18, 30, 42].map(r => sC(cx(3), cy, r, 'mf-ring', ' stroke="var(--ink-3)" stroke-width="1.1"')).join('') + sC(cx(3), cy, 7, 'ch-nuc') + sC(cx(3) + 18, cy, 4, 'ch-e') + sC(cx(3), cy - 30, 4, 'ch-e') + sC(cx(3) - 42, cy, 4, 'ch-e');
  const rnd = mulberry32(9); for (let k = 0; k < 170; k++) { const r = 42 * Math.sqrt(-Math.log(1 - rnd() * 0.97)) / 1.9, a = rnd() * 6.283; s += sC(cx(4) + r * Math.cos(a), cy + r * Math.sin(a), 1.3, 'ch-e', ' opacity="0.55"'); }
  s += sC(cx(4), cy, 4, 'mf-s4');
  names.forEach((t, i) => { s += wrap2(cx(i), 126, t, 'mf-small', 16); });
  return s + '</svg>';
}
/* hydrogen energy levels (Bohr): E_n = −13.6/n² eV, with optional transition arrows [[from, to, cls]] */
function levelsSvg(trans = [], { label, nMax = 6, names } = {}) {
  const W = 440, H = 280, E = n => -13.6 / (n * n), Y = e => 30 + (-e) / 13.6 * 220, x0 = 90, x1 = 360;
  let s = svgBox(W, H, label);
  for (let n = 1; n <= nMax; n++) s += sL(x0, Y(E(n)), x1, Y(E(n)), 'mf-line', ' stroke-width="1.6"') + (n <= 3 ? sT(x0 - 8, Y(E(n)) + 4, `n = ${n}`, 'mf-small', 'end') : '') + (n <= 3 ? sT(x1 + 4, Y(E(n)) + 4, `${F(+E(n).toFixed(2))} eV`, 'mf-small', 'start') : '');
  s += sL(x0, Y(0), x1, Y(0), 'mf-grid', ' stroke-dasharray="5 4"') + sT(x0 - 8, Y(0) - 2, 'n = ∞', 'mf-small', 'end') + sT(x1 + 4, Y(0) - 2, '0 eV', 'mf-small', 'start');
  trans.forEach(([a, b, cls], k) => { const x = x0 + 40 + k * 34; s += sArrow(x, Y(E(a)), x, Y(E(b)), cls || 'mf-c4', 8); });
  return s + '</svg>';
}
/* the aufbau (diagonal) rule */
function aufbauSvg({ label } = {}) {
  const rows = [['1s'], ['2s', '2p'], ['3s', '3p', '3d'], ['4s', '4p', '4d', '4f'], ['5s', '5p', '5d', '5f'], ['6s', '6p', '6d'], ['7s', '7p']], cw = 58, rh = 36, x0 = 44, y0 = 34;
  let s = svgBox(290, 290, label);
  const diag = [['1s'], ['2s'], ['2p', '3s'], ['3p', '4s'], ['3d', '4p', '5s'], ['4d', '5p', '6s'], ['4f', '5d', '6p', '7s'], ['5f', '6d', '7p']];
  const pos = t => { const n = +t[0], l = 'spdf'.indexOf(t[1]); return [x0 + l * cw, y0 + (n - 1) * rh]; };
  const ux = cw / Math.hypot(cw, rh), uy = rh / Math.hypot(cw, rh);   // unit vector along a diagonal (down-left)
  diag.forEach((g, k) => { const [a, b] = [pos(g[0]), pos(g[g.length - 1])]; s += sArrow(a[0] + 22 * ux, a[1] - 22 * uy - 4, b[0] - 20 * ux, b[1] + 20 * uy - 4, ['mf-c1', 'mf-c2', 'mf-c3', 'mf-c4'][k % 4], 7); });
  rows.forEach((r, i) => r.forEach((t, j) => { s += sT(x0 + j * cw, y0 + i * rh + 1, t, 'mf-lab-b', 'middle', ' paint-order="stroke" stroke="var(--paper)" stroke-width="6" stroke-linejoin="round"'); }));
  return s + '</svg>';
}
/* shapes of s and p orbitals */
function orbitalShapesSvg(names, { label } = {}) {
  const cw = 150, W = cw * 4, cy = 84, H = 180;
  let s = svgBox(W, H, label);
  // x to the right, z up, y drawn in perspective (up-right); the axis that holds the orbital is drawn darker
  const axes = (cx, on) => [['x', 62, 0], ['z', 0, -62], ['y', 42, -42]].map(([t, dx, dy]) => { const hl = on === t, cls = hl ? 'mf-axis' : 'mf-thin';
    return sL(cx - dx, cy - dy, cx, cy, cls, hl ? '' : ' stroke-dasharray="3 3"') + sArrow(cx, cy, cx + dx, cy + dy, cls, 6) + sT(cx + dx * 1.13 + (t === 'z' ? 8 : 0), cy + dy * 1.13 + (t === 'x' ? 4 : t === 'y' ? 2 : 0), t, 'mf-var', 'middle'); }).join('');
  const lobe = (cx, a, cls) => `<ellipse cx="${f1(cx + 25 * Math.cos(a))}" cy="${f1(cy - 25 * Math.sin(a))}" rx="25" ry="13" transform="rotate(${f1(-a * 180 / Math.PI)} ${f1(cx + 25 * Math.cos(a))} ${f1(cy - 25 * Math.sin(a))})" class="${cls}" stroke="var(--ink-2)" stroke-width="1.2" fill-opacity="0.85"/>`;
  s += axes(cw / 2) + sC(cw / 2, cy, 34, 'mf-s1l', ' stroke="var(--ink-2)" stroke-width="1.2" fill-opacity="0.85"');
  [[0, 'x'], [Math.PI / 4, 'y'], [Math.PI / 2, 'z']].forEach(([a, ax], i) => { const cx = cw * (i + 1) + cw / 2; s += axes(cx, ax) + lobe(cx, a, 'mf-s2l') + lobe(cx, a + Math.PI, 'mf-s4l'); });
  names.forEach((t, i) => { s += sT(i * cw + cw / 2, H - 10, t.replace(/_(\w)/, '<tspan baseline-shift="sub" font-size="75%">$1</tspan>'), 'mf-lab-b'); });
  return s + '</svg>';
}

/* ---------- element names (translated) ---------- */
function elName(sym) {
  const N = { H: T`hydrogen`, He: T`helium`, Li: T`lithium`, Be: T`beryllium`, B: T`boron`, C: T`carbon`, N: T`nitrogen`, O: T`oxygen`, F: T`fluorine`, Ne: T`neon`, Na: T`sodium`, Mg: T`magnesium`, Al: T`aluminium`, Si: T`silicon`, P: T`phosphorus`, S: T`sulfur`, Cl: T`chlorine`, Ar: T`argon`, K: T`potassium`, Ca: T`calcium`, Sc: T`scandium`, Ti: T`titanium`, V: T`vanadium`, Cr: T`chromium`, Mn: T`manganese`, Fe: T`iron`, Co: T`cobalt`, Ni: T`nickel`, Cu: T`copper`, Zn: T`zinc`, Ga: T`gallium`, Ge: T`germanium`, As: T`arsenic`, Se: T`selenium`, Br: T`bromine`, Kr: T`krypton`, Rb: T`rubidium`, Sr: T`strontium`, Ag: T`silver`, Sn: T`tin`, I: T`iodine`, Xe: T`xenon`, Cs: T`caesium`, Ba: T`barium`, Pt: T`platinum`, Au: T`gold`, Hg: T`mercury`, Pb: T`lead`, U: T`uranium` };
  return N[sym] || sym;
}

/* ---------- bonding ---------- */
/* ionic bonding by electron transfer: the metal (crosses) gives its outer electrons to the non-metal atoms (dots) */
function octetMarks(x, y, marks) {   // marks: up to 8 of 'dot' | 'x', placed N, E, S, W, then paired
  const spots = [[0, -1], [1, 0], [0, 1], [-1, 0]], cnt = [[], [], [], []];
  marks.forEach((m, k) => cnt[k % 4].push(m));
  let s = '';
  cnt.forEach((c, i) => { const [dx, dy] = spots[i], cx = x + dx * 17, cy = y + dy * 17; c.forEach((m, j) => { const o = c.length === 2 ? (j ? 3.8 : -3.8) : 0, px = cx + (dy ? o : 0), py = cy + (dx ? o : 0); s += m === 'x' ? sT(px, py + 3.5, '×', 'ch-x') : sC(px, py, 2.1, 'ch-dot'); }); });
  return s;
}
function ionicTransferSvg(metal, nm, { label, nmCount = 1 } = {}) {
  const mv = valenceOf(ZOF[metal]), nv = valenceOf(ZOF[nm]), give = mv / nmCount, two = nmCount > 1;
  const W = 420, H = two ? 190 : 110, cy = H / 2, nys = two ? [cy - 45, cy + 45] : [cy], mx = 40, nx0 = 132, ex = 262, nx = 350;
  let s = svgBox(W, H, label);
  s += sC(mx, cy, 28, 'ch-ring') + sT(mx, cy + 6, metal, `ch-at ${atomCls(metal)}`) + octetMarks(mx, cy, Array(mv).fill('x'));
  nys.forEach(y => { s += sC(nx0, y, 28, 'ch-ring') + sT(nx0, y + 6, nm, `ch-at ${atomCls(nm)}`) + octetMarks(nx0, y, Array(nv).fill('dot')); s += sArrow(mx + 24, cy + (y - cy) * 0.15 - 6, nx0 - 30, y - 12, 'mf-c4', 6); });
  s += sT(200, cy + 8, '→', 'mf-lab-b', 'middle', ' style="font-size:22px"');
  s += sT(ex, cy + 6, metal, `ch-at ${atomCls(metal)}`) + sT(ex - 22, cy + 10, '[', 'ch-br') + sT(ex + 22, cy + 10, ']', 'ch-br') + sT(ex + 28, cy - 12, mv > 1 ? mv + '+' : '+', 'ch-charge', 'start');
  nys.forEach(y => { s += sT(nx, y + 6, nm, `ch-at ${atomCls(nm)}`) + octetMarks(nx, y, [...Array(nv).fill('dot'), ...Array(give).fill('x')]) + sT(nx - 29, y + 10, '[', 'ch-br') + sT(nx + 29, y + 10, ']', 'ch-br') + sT(nx + 35, y - 12, give > 1 ? give + '−' : '−', 'ch-charge', 'start'); });
  return s + '</svg>';
}
/* NaCl-type lattice in oblique projection: n × n × n ions, alternating */
function latticeSvg({ label, n = 3, a = 66, names = ['Na⁺', 'Cl⁻'] } = {}) {
  const dx = 0.35, dy = 0.25, W = 60 + (n - 1) * a * (1 + dx) + 40, H = 40 + (n - 1) * a * (1 + dy) + 60;
  const P = (i, j, k) => [36 + i * a + k * a * dx, H - 58 - j * a - k * a * dy];
  let s = svgBox(W, H, label);
  const items = [];   // painter's order: back (large k) first; edges just behind the ions of their plane
  const edge = (p, q, d) => items.push([d + 0.1, sL(...p, ...q, '', ` style="stroke:var(--ink-${d < 0.6 ? 2 : 3});stroke-width:${d < 0.6 ? 1.8 : 1.4};stroke-opacity:${d < 0.6 ? 1 : 0.9}"`)]);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    const p = P(i, j, k);
    if (i < n - 1) edge(p, P(i + 1, j, k), k);
    if (j < n - 1) edge(p, P(i, j + 1, k), k);
    if (k < n - 1) edge(p, P(i, j, k + 1), k + 0.95);
    items.push([k - j * 0.01, (i + j + k) % 2 ? sC(...p, 11, 'ch-bX') : sC(...p, 7.5, 'ch-bN')]);
  }
  items.sort((u, v) => v[0] - u[0]).forEach(([, t]) => { s += t; });
  s += sC(W / 2 - 70, H - 16, 7.5, 'ch-bN') + sT(W / 2 - 56, H - 12, names[0], 'mf-small', 'start') + sC(W / 2 + 20, H - 16, 11, 'ch-bX') + sT(W / 2 + 38, H - 12, names[1], 'mf-small', 'start');
  return s + '</svg>';
}
/* metallic bonding: a lattice of positive ions in a sea of delocalised electrons */
function metallicSvg({ label, name } = {}) {
  const W = 300, H = 190, rnd = mulberry32(7);
  let s = svgBox(W, H + (name ? 20 : 0), label) + sR(4, 4, W - 8, H - 8, 'ch-box', 8);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) { const x = 34 + i * 46 + (j % 2) * 10, y = 32 + j * 42; s += sC(x, y, 15, 'ch-bM') + sT(x, y + 5, '+', 'mf-lab-b'); }
  for (let k = 0; k < 26; k++) { let x, y, t = 0; do { x = 14 + rnd() * (W - 28); y = 12 + rnd() * (H - 24); t++; } while (t < 200 && [...Array(24)].some((_, m) => { const i = m % 6, j = (m / 6) | 0; return Math.hypot(x - (34 + i * 46 + (j % 2) * 10), y - (32 + j * 42)) < 20; })); s += sC(x, y, 3.2, 'ch-e') + sT(x + 6, y - 3, '−', 'ch-tiny', 'start'); }
  if (name) s += sT(W / 2, H + 14, name, 'mf-lab-b');
  return s + '</svg>';
}
/* dot-and-cross diagram of a covalent molecule.
   atoms: [[sym, x, y, mark ('dot'|'x'), own valence electrons]]; bonds: [[i, j, pairs]] (x, y in units of 1 bond length) */
function dotCrossSvg(atoms, bonds, { label, u = 50, name } = {}) {
  const r = 30, xs = atoms.map(a => a[1]), ys = atoms.map(a => a[2]), x0 = Math.min(...xs), y0 = Math.min(...ys);
  const W = (Math.max(...xs) - x0) * u + 2 * r + 24, H0 = (Math.max(...ys) - y0) * u + 2 * r + 24, H = H0 + (name ? 20 : 0);
  const X = x => r + 12 + (x - x0) * u, Y = y => r + 12 + (y - y0) * u;
  let s = svgBox(W, H, label);
  atoms.forEach(([, x, y]) => { s += sC(X(x), Y(y), r, 'ch-ring'); });
  const mk = (x, y, m) => (m === 'x' ? sT(x, y + 3.5, '×', 'ch-x') : sC(x, y, 2.3, 'ch-dot'));
  const used = atoms.map(() => 0), dirs = atoms.map(() => []);
  bonds.forEach(([i, j, p]) => {
    const [, xa, ya, ma] = atoms[i], [, xb, yb, mb] = atoms[j], ax = X(xa), ay = Y(ya), bx = X(xb), by = Y(yb), L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, mx = (ax + bx) / 2, my = (ay + by) / 2;
    for (let k = 0; k < p; k++) { const o = (k - (p - 1) / 2) * 9; s += mk(mx - uy * o - ux * 3.6, my + ux * o - uy * 3.6, ma) + mk(mx - uy * o + ux * 3.6, my + ux * o + uy * 3.6, mb); }
    used[i] += p; used[j] += p; dirs[i].push(Math.atan2(uy, ux)); dirs[j].push(Math.atan2(-uy, -ux));
  });
  atoms.forEach(([sym, x, y, m, v], i) => {
    const cx = X(x), cy = Y(y), lone = v - used[i];
    s += sT(cx, cy + 6, sym, `ch-at ${atomCls(sym)}`);
    if (lone <= 0) return;
    const nPairs = Math.ceil(lone / 2), chosen = [], taken = [...dirs[i]];
    const gap = (t, u) => Math.abs(Math.atan2(Math.sin(t - u), Math.cos(t - u)));
    for (let k = 0; k < nPairs; k++) { let best = null, bd = -1; for (let d = 0; d < 360; d += 45) { const t = (d - 90) * Math.PI / 180, m = taken.length ? Math.min(...taken.map(u => gap(t, u))) : 9; if (m > bd + 1e-6) { bd = m; best = t; } } chosen.push(best); taken.push(best); }
    let left = lone;
    chosen.forEach(t => { const px = cx + 20 * Math.cos(t), py = cy + 20 * Math.sin(t), n2 = Math.min(2, left); left -= n2; for (let k = 0; k < n2; k++) { const o = n2 === 2 ? (k ? 3.8 : -3.8) : 0; s += mk(px - Math.sin(t) * o, py + Math.cos(t) * o, m); } });
  });
  if (name) s += sT(W / 2, H - 6, name, 'mf-lab-b');
  return s + '</svg>';
}
/* electronegativity difference and bond type */
function bondSpectrumSvg({ label, names, mark = [] } = {}) {
  const W = 460, H = 132, L = 30, R = 20, X = d => L + d / 3.3 * (W - L - R), o = 12;
  let s = svgBox(W, H, label) + '<defs><linearGradient id="bsg" x1="0" x2="1"><stop offset="0" stop-color="var(--lv5)" stop-opacity="0.25"/><stop offset="0.5" stop-color="var(--lv8)" stop-opacity="0.45"/><stop offset="1" stop-color="var(--lv4)" stop-opacity="0.6"/></linearGradient></defs>';
  s += `<rect x="${L}" y="${30 + o}" width="${W - L - R}" height="28" rx="5" fill="url(#bsg)" stroke="var(--ink-3)"/>`;
  [0.4, 1.8].forEach(d => { s += sL(X(d), 26 + o, X(d), 62 + o, 'mf-line', ' stroke-dasharray="3 3"'); });
  [[0.2, names[0]], [1.1, names[1]], [2.55, names[2]]].forEach(([d, t]) => { s += sT(X(d), 49 + o, t, 'mf-lab-b'); });
  for (let d = 0; d <= 3.2; d += 0.4) s += sL(X(d), 58 + o, X(d), 64 + o, 'mf-line') + sT(X(d), 78 + o, F(+d.toFixed(1)), 'mf-small');
  s += sT(W / 2, 100 + o, names[3], 'mf-small');
  mark.forEach(([d, t], k) => { s += sArrow(X(d), 16 + (k % 2) * 12, X(d), 28 + o, 'mf-c4', 6) + sT(X(d) + (k % 2 ? 4 : 0), 12 + (k % 2) * 12, t, 'mf-small', k % 2 ? 'start' : 'middle'); });
  return s + '</svg>';
}
/* water molecules joined by hydrogen bonds */
function hbondSvg({ label } = {}) {
  const W = 380, H = 220;
  const mols = [[70, 70, 30], [190, 60, -40], [300, 90, 200], [110, 170, 160], [240, 170, 80]];   // x, y, angle of the H–O–H bisector (deg)
  let s = svgBox(W, H, label), hs = [], os = [];
  mols.forEach(([x, y, a]) => { const t = a * Math.PI / 180, h1 = [x + 26 * Math.cos(t - 0.91), y + 26 * Math.sin(t - 0.91)], h2 = [x + 26 * Math.cos(t + 0.91), y + 26 * Math.sin(t + 0.91)]; hs.push(h1, h2); os.push([x, y]); });
  // H-bonds: each H to the nearest O of another molecule if close enough
  hs.forEach(([hx, hy], k) => { const own = (k / 2) | 0; let best = null; os.forEach(([ox, oy], m) => { if (m === own) return; const d = Math.hypot(ox - hx, oy - hy); if (d < 105 && (!best || d < best[0])) best = [d, ox, oy]; }); if (best) { const [d, ox, oy] = best, ux = (ox - hx) / d, uy = (oy - hy) / d; s += sL(hx + ux * 10, hy + uy * 10, ox - ux * 16, oy - uy * 16, 'ch-hb'); } });
  mols.forEach(([x, y], m) => { const h1 = hs[2 * m], h2 = hs[2 * m + 1]; s += sL(x, y, h1[0], h1[1], 'ch-stick') + sL(x, y, h2[0], h2[1], 'ch-stick') + sC(x, y, 14, 'ch-bO') + sC(h1[0], h1[1], 9, 'ch-bH') + sC(h2[0], h2[1], 9, 'ch-bH') });
  return s + '</svg>';
}
/* giant covalent structures: diamond (projected) and graphite layers */
function diamondSvg({ label, name } = {}) {
  const W = 250, H = 210 + (name ? 20 : 0), a = 34, pts = [];
  let s = svgBox(W, H, label);
  // chair-like projection of the diamond lattice: zigzag rows joined vertically
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) pts.push([24 + c * a, 40 + r * 44 + ((c + r) % 2 ? 14 : 0), r, c]);
  const at = (r, c) => pts.find(p => p[2] === r && p[3] === c);
  pts.forEach(([x, y, r, c]) => { if (c < 6) { const q = at(r, c + 1); s += sL(x, y, q[0], q[1], 'ch-stick'); } if (r < 3 && (c + r) % 2) { const q = at(r + 1, c); s += sL(x, y, q[0], q[1], 'ch-stick'); } });
  pts.forEach(([x, y]) => { s += sC(x, y, 8, 'ch-bC'); });
  if (name) s += sT(W / 2, H - 6, name, 'mf-lab-b');
  return s + '</svg>';
}
function graphiteSvg({ label, name } = {}) {
  const W = 290, H = 210 + (name ? 20 : 0);
  let s = svgBox(W, H, label);
  const layer = (y0, sh) => { let t = '', pts = []; const hx = 26, hy = 9; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const x = 20 + c * hx + sh + r * 13, y = y0 + r * hy * 2 + (c % 2 ? hy * 0.7 : 0); pts.push([x, y, r, c]); } pts.forEach(([x, y, r, c]) => { const n = pts.find(p => p[2] === r && p[3] === c + 1); if (n) t += sL(x, y, n[0], n[1], 'ch-stick'); if (c % 2 === 0) { const m = pts.find(p => p[2] === r + 1 && p[3] === c); if (m) t += sL(x, y, m[0], m[1], 'ch-stick'); } }); pts.forEach(([x, y]) => { t += sC(x, y, 5.5, 'ch-bC'); }); return t; };
  s += layer(22, 0) + layer(92, 12) + layer(162, 0);
  [[60, 72, 104], [200, 72, 104], [130, 142, 174]].forEach(([x, y1, y2]) => { s += sL(x, y1 - 12, x, y2 - 10, 'ch-hb'); });
  if (name) s += sT(W / 2, H - 6, name, 'mf-lab-b');
  return s + '</svg>';
}

/* ---------- stoichiometry ---------- */
/* two boxes of molecules (before → after) side by side */
function reactionBoxesSvg(before, after, { label, names = [], W1 = 190, H1 = 160, seeds = [5, 8] } = {}) {
  const gap = 60, W = 2 * W1 + gap, H = H1 + 26;
  const put = (svg, x) => svg.replace(/^<svg /, `<svg x="${x}" y="0" width="${W1}" height="${H1}" `);
  let s = svgBox(W, H, label) + put(moleculeBox(before, { W: W1, H: H1, seed: seeds[0], label: names[0] || '' }), 0) + put(moleculeBox(after, { W: W1, H: H1, seed: seeds[1], label: names[1] || '' }), W1 + gap);
  s += sArrow(W1 + 10, H1 / 2, W1 + gap - 10, H1 / 2, 'mf-line', 9);
  if (names[0]) s += sT(W1 / 2, H - 6, names[0], 'mf-lab-b') + sT(W1 + gap + W1 / 2, H - 6, names[1], 'mf-lab-b');
  return s + '</svg>';
}
/* the mole map: amount in the middle, linked to mass, particles, gas volume and solution */
function moleMapSvg({ label, names } = {}) {
  const W = 480, H = 300, cx = W / 2, cy = H / 2;
  const box = (x, y, w, t1, t2, cls) => sR(x - w / 2, y - 24, w, 48, cls, 10, ' stroke-width="1.6"') + sT(x, y - 3, t1, 'mf-lab-b') + sT(x, y + 15, t2, 'mf-small');
  let s = svgBox(W, H, label);
  const lr = (x1, x2, y, top, bot) => sArrow(x1, y - 7, x2, y - 7, 'mf-c1', 7) + sArrow(x2, y + 7, x1, y + 7, 'mf-c4', 7) + sT((x1 + x2) / 2, y - 14, top, 'mf-small') + sT((x1 + x2) / 2, y + 24, bot, 'mf-small');
  const ud = (x, y1, y2, left, right) => sArrow(x - 7, y1, x - 7, y2, 'mf-c1', 7) + sArrow(x + 7, y2, x + 7, y1, 'mf-c4', 7) + sT(x - 14, (y1 + y2) / 2 + 4, left, 'mf-small', 'end') + sT(x + 14, (y1 + y2) / 2 + 4, right, 'mf-small', 'start');
  s += lr(95, cx - 62, cy, '÷ M', '× M') + lr(cx + 62, W - 95, cy, '× Nₐ', '÷ Nₐ');
  s += ud(cx, 58, cy - 26, '÷ Vₘ', '× Vₘ') + ud(cx, cy + 26, H - 58, '÷ V', '× V');
  s += box(cx, cy, 120, names[0], 'n (mol)', 'mf-s1l') + box(52, cy, 96, names[1], 'm (g)', 'mf-s2l') + box(W - 52, cy, 96, names[2], 'N', 'mf-s3l') + box(cx, 30, 170, names[3], 'V (L)', 'mf-s4l') + box(cx, H - 30, 170, names[4], 'c (mol/L)', 'mf-s2l');
  return s + '</svg>';
}

/* ---------- gases & solutions ---------- */
/* a gas in a cylinder with a piston; h = fraction of the height the gas fills */
function pistonSvg({ n = 10, h = 1, label, name, seed = 4, hot = false, W = 150, H = 190 } = {}) {
  const x0 = 25, w = W - 50, top = 20, bot = H - (name ? 50 : 30), gy = bot - (bot - top - 20) * h, rnd = mulberry32(seed);
  let s = svgBox(W, H, label) + sP(`M${x0} ${top}V${bot}H${x0 + w}V${top}`, 'ch-glass', ' fill="none"');
  s += sR(x0 + 2, gy - 14, w - 4, 12, 'mf-s3l', 2, ' stroke="var(--ink-2)"') + sR(x0 + w / 2 - 4, top - 8, 8, gy - 14 - top + 8, 'mf-s3l', 1, ' stroke="var(--ink-2)"');
  const pts = [];
  for (let i = 0; i < n; i++) { let x, y, t = 0; do { x = x0 + 12 + rnd() * (w - 24); y = gy + 8 + rnd() * (bot - gy - 16); t++; } while (t < 300 && pts.some(([a, b]) => Math.hypot(a - x, b - y) < 17)); pts.push([x, y]); const a = rnd() * 6.28, L = hot ? 18 : 11; s += sC(x, y, 5.5, 'ch-p1') + sArrow(x + 7 * Math.cos(a), y + 7 * Math.sin(a), x + L * Math.cos(a), y + L * Math.sin(a), 'mf-c2', 4.5); }
  if (hot) s += sP(`M${W / 2 - 10} ${bot + 24}c-6-8 0-12 4-18c2 6 8 6 6 12c6-4 4-10 4-10c8 8 4 16-2 18z`, 'ch-flame');
  if (name) s += sT(W / 2, H - 6, name, 'mf-lab-b');
  return s + '</svg>';
}
/* a beaker of solution with n solute particles; level = fraction full */
function beakerSvg({ n = 8, level = 0.6, label, name, seed = 2, W = 130, H = 150, cls = 'ch-p2' } = {}) {
  const x0 = 20, w = W - 40, top = 16, bot = H - (name ? 30 : 10), ly = bot - (bot - top - 6) * level, rnd = mulberry32(seed);
  let s = svgBox(W, H, label) + sR(x0 + 1, ly, w - 2, bot - ly - 1, 'ch-liq', 3) + sP(`M${x0 - 4} ${top}h4V${bot - 4}a4 4 0 0 0 4 4H${x0 + w - 4}a4 4 0 0 0 4-4V${top}h4`, 'ch-glass', ' fill="none"');
  const pts = [];
  for (let i = 0; i < n; i++) { let x, y, t = 0; do { x = x0 + 10 + rnd() * (w - 20); y = ly + 8 + rnd() * (bot - ly - 16); t++; } while (t < 300 && pts.some(([a, b]) => Math.hypot(a - x, b - y) < 13)); pts.push([x, y]); s += sC(x, y, 4.5, cls); }
  if (name) s += sT(W / 2, H - 8, name, 'mf-lab-b');
  return s + '</svg>';
}
/* phase diagram (schematic, water-like); with solution = true the dashed curves of a solution */
function phaseDiagramSvg({ label, names, solution = false } = {}) {
  const W = 440, H = 290, L = 50, B = 40, X = t => L + t * (W - L - 20), Y = p => H - B - p * (H - B - 20);
  let s = svgBox(W, H, label);
  s += sArrow(L, H - B, W - 10, H - B, 'mf-axis', 7) + sArrow(L, H - B, L, 10, 'mf-axis', 7) + sT(W - 12, H - B + 18, names.T, 'mf-small', 'end') + sT(L + 8, 16, names.P, 'mf-small', 'start');
  const tp = [0.3, 0.22], cp = [0.86, 0.86];
  const fus = [[0.3, 0.22], [0.27, 0.98]], sub = `M${X(0.02)} ${Y(0.02)} Q${X(0.2)} ${Y(0.05)} ${X(tp[0])} ${Y(tp[1])}`, vap = `M${X(tp[0])} ${Y(tp[1])} Q${X(0.62)} ${Y(0.35)} ${X(cp[0])} ${Y(cp[1])}`;
  s += sP(sub, 'mf-c1', ' fill="none" stroke-width="2.4"') + sP(vap, 'mf-c1', ' fill="none" stroke-width="2.4"') + sL(X(fus[0][0]), Y(fus[0][1]), X(fus[1][0]), Y(fus[1][1]), 'mf-c1', ' stroke-width="2.4"');
  if (solution) { const d = 0.06; s += sP(`M${X(0.02)} ${Y(0.015)} Q${X(0.19)} ${Y(0.04)} ${X(tp[0] - 0.03)} ${Y(tp[1] - 0.05)}`, 'mf-c4', ' fill="none" stroke-width="2" stroke-dasharray="6 4"') + sP(`M${X(tp[0] - 0.03)} ${Y(tp[1] - 0.05)} Q${X(0.62 + d)} ${Y(0.3)} ${X(cp[0] + 0.02)} ${Y(cp[1] - 0.06)}`, 'mf-c4', ' fill="none" stroke-width="2" stroke-dasharray="6 4"') + sL(X(tp[0] - 0.03), Y(tp[1] - 0.05), X(fus[1][0] - 0.03), Y(fus[1][1]), 'mf-c4', ' stroke-width="2" stroke-dasharray="6 4"'); }
  s += sC(X(tp[0]), Y(tp[1]), 4, 'mf-dot') + sC(X(cp[0]), Y(cp[1]), 4, 'mf-dot') + sT(X(tp[0]) + 8, Y(tp[1]) + 16, names.tp, 'mf-small', 'start') + sT(X(cp[0]), Y(cp[1]) - 10, names.cp, 'mf-small', 'middle');
  s += sT(X(0.12), Y(0.6), names.s, 'mf-lab-b') + sT(X(0.55), Y(0.7), names.l, 'mf-lab-b') + sT(X(0.7), Y(0.18), names.g, 'mf-lab-b');
  // 1 atm line with normal melting and boiling points
  const p1 = 0.5, tm = 0.3 - (p1 - 0.22) / (0.98 - 0.22) * 0.03, tb = 0.645;
  s += sL(L, Y(p1), W - 20, Y(p1), 'mf-grid', ' stroke-dasharray="4 4"') + sT(L - 6, Y(p1) + 4, '1 atm', 'mf-small', 'end') + sL(X(tm), Y(p1), X(tm), H - B, 'mf-grid', ' stroke-dasharray="3 3"') + sL(X(tb), Y(p1), X(tb), H - B, 'mf-grid', ' stroke-dasharray="3 3"') + sT(X(tm), H - B + 15, names.mp, 'mf-small') + sT(X(tb), H - B + 15, names.bp, 'mf-small') + sC(X(tm), Y(p1), 3, 'mf-dot') + sC(X(tb), Y(p1), 3, 'mf-dot');
  if (solution) { s += sArrow(X(tb) + 2, H - B - 14, X(tb) + 30, H - B - 14, 'mf-c4', 6) + sArrow(X(tm) - 2, H - B - 14, X(tm) - 26, H - B - 14, 'mf-c4', 6); }
  return s + '</svg>';
}
/* osmosis: U-tube with a semipermeable membrane; the solution side rises */
function osmosisSvg({ label, names } = {}) {
  const W = 300, H = 250, l = 60, r = 190, w = 50, bot = 190, m = (l + r + w) / 2, R = 20;
  let s = svgBox(W, H, label);
  const sol = ' style="fill:color-mix(in srgb, var(--lv6) 30%, var(--paper))"';
  s += sP(`M${l + 1} 110V${bot - R}a${R - 1} ${R - 1} 0 0 0 ${R - 1} ${R - 1}H${m}V${bot - 30}H${l + w - 1}V110z`, 'ch-liq');
  s += sP(`M${r + w - 1} 70V${bot - R}a${R - 1} ${R - 1} 0 0 1 ${-(R - 1)} ${R - 1}H${m}V${bot - 30}H${r + 1}V70z`, 'ch-liq', sol);
  s += sP(`M${l} 30V${bot - R}a${R} ${R} 0 0 0 ${R} ${R}H${r + w - R}a${R} ${R} 0 0 0 ${R} ${-R}V30M${l + w} 30V${bot - 30}H${r}V30`, 'ch-glass', ' fill="none"');
  s += sL(m, bot - 30, m, bot, 'mf-c4', ' stroke-width="3" stroke-dasharray="3 2"');
  const rnd = mulberry32(3); for (let i = 0; i < 7; i++) s += sC(r + 12 + rnd() * 26, 82 + rnd() * 80, 5, 'ch-p2');
  s += sArrow(m - 22, bot - 15, m + 22, bot - 15, 'mf-c1', 7) + sL(r + w + 6, 70, r + w + 6, 110, 'mf-line') + sL(r + w + 2, 70, r + w + 10, 70, 'mf-line') + sL(r + w + 2, 110, r + w + 10, 110, 'mf-line') + sT(r + w + 14, 94, 'h', 'mf-var', 'start') + sL(r - 6, 110, r + w + 10, 110, 'mf-grid', ' stroke-dasharray="3 3"');
  s += sT(l + w / 2, 22, names[0], 'mf-small') + sT(r + w / 2, 22, names[1], 'mf-small') + sT(m, bot + 18, names[2], 'mf-small') + sT(m, bot + 36, names[3], 'mf-small');
  return s + '</svg>';
}
/* Tyndall effect: a light beam through a true solution and a colloid */
function tyndallSvg({ label, names } = {}) {
  const W = 440, H = 170;
  let s = svgBox(W, H, label);
  s += sR(10, 62, 34, 26, 'mf-s3l', 4, ' stroke="var(--ink-2)"') + sP('M44 66l12-6v30l-12-6z', 'mf-s3l', ' stroke="var(--ink-2)"');
  s += sP('M56 70L430 66V84L56 80z', 'mf-f1', ' style="fill:color-mix(in srgb, var(--lv6) 18%, transparent)"');
  [[150, false], [320, true]].forEach(([x, col], k) => {
    s += sR(x - 50, 30, 100, 100, 'ch-liq', 6, col ? ' style="fill:color-mix(in srgb, var(--ink-3) 18%, var(--paper))"' : '') + sR(x - 50, 30, 100, 100, 'ch-glass', 6, ' fill="none"');
    if (col) { s += sP(`M${x - 50} 70L${x + 50} 69V81L${x - 50} 80z`, '', ' style="fill:color-mix(in srgb, var(--lv6) 75%, transparent)"'); const rnd = mulberry32(5); for (let i = 0; i < 26; i++) s += sC(x - 46 + rnd() * 92, 36 + rnd() * 88, 2, 'ch-dot', ' opacity="0.45"'); }
    s += sT(x, 150, names[k], 'mf-lab-b');
  });
  return s + '</svg>';
}
/* particle-size scale (log): solution, colloid, suspension */
function sizeScaleSvg({ label, names } = {}) {
  const W = 460, H = 110, L = 20, R = 20, X = e => L + (e + 1) / 5 * (W - L - R);   // e = log10(size / nm), -1 … 4
  let s = svgBox(W, H, label);
  [[-1, 0, 'mf-s1l', names[0]], [0, 3, 'mf-s2l', names[1]], [3, 4, 'mf-s3l', names[2]]].forEach(([a, b, c, t]) => { s += sR(X(a), 24, X(b) - X(a), 30, c, 0, ' stroke="var(--ink-3)"') + sT((X(a) + X(b)) / 2, 44, t, 'mf-lab-b'); });
  [[-1, '0.1 nm'], [0, '1 nm'], [1, '10 nm'], [2, '100 nm'], [3, '1 µm'], [4, '10 µm']].forEach(([e, t]) => { s += sL(X(e), 54, X(e), 60, 'mf-line') + sT(X(e), 74, t, 'mf-small'); });
  s += sT(W / 2, 98, names[3], 'mf-small');
  return s + '</svg>';
}

/* ---------- energetics, rates, equilibrium ---------- */
/* reaction energy profile: exo (dH < 0) or endo; optional catalysed path */
function energyProfileSvg({ label, exo = true, cat = false, names, W = 400, H = 260 } = {}) {
  const L = 50, B = 30, x0 = L + 20, x1 = W - 30, yR = exo ? 120 : 190, yP = exo ? 200 : 110, yT = 45, yC = 95;
  let s = svgBox(W, H, label) + sArrow(L, H - B, L, 12, 'mf-axis', 7) + sArrow(L, H - B, W - 10, H - B, 'mf-axis', 7) + sT(L + 8, 16, names.E, 'mf-small', 'start') + sT(W - 12, H - B + 18, names.x, 'mf-small', 'end');
  const xm = (x0 + x1) / 2, xa = x0 + 45, xb = x1 - 70, ca = (xm - xa) / 2, cb = (xb - xm) / 2;
  const curve = top => `M${x0} ${yR}H${xa}C${xa + ca} ${yR} ${xm - ca} ${top} ${xm} ${top}C${xm + cb} ${top} ${xb - cb} ${yP} ${xb} ${yP}H${x1}`;
  s += sL(x0, yR, x1, yR, 'mf-grid', ' stroke-dasharray="3 3"') + sP(curve(yT), 'mf-c1', ' fill="none" stroke-width="2.5"');
  if (cat) s += sP(curve(yC), 'mf-c3', ' fill="none" stroke-width="2.2" stroke-dasharray="6 4"') + sL(x1 - 150, 22, x1 - 124, 22, 'mf-c3', ' stroke-width="2.2" stroke-dasharray="6 4"') + sT(x1 - 118, 26, names.cat, 'mf-small', 'start');
  s += sArrow(xm, yR, xm, yT + 3, 'mf-c4', 7) + sT(xm - 6, (yR + yT) / 2 + 4, 'Eₐ', 'mf-lab-b', 'end');
  if (cat) s += sArrow(xm + 12, yR, xm + 12, yC + 3, 'mf-c3', 6) + sT(xm + 17, yR - 5, 'Eₐ′', 'mf-small', 'start');
  const xd = xb + 12; s += sArrow(xd, yR, xd, yP + (exo ? -3 : 3), 'mf-c2', 7) + sT(xd + 7, (yR + yP) / 2 + 4, 'ΔH', 'mf-lab-b', 'start');
  s += sT(x0 + 2, yR - 8, names.r, 'mf-small', 'start') + sT(x1, yP - 8, names.p, 'mf-small', 'end');
  return s + '</svg>';
}
/* Maxwell–Boltzmann distribution at two temperatures with the activation energy */
function maxwellSvg({ label, names, cat = false } = {}) {
  const f = (E, T) => Math.sqrt(E) * Math.exp(-E / T) / Math.pow(T, 1.5);
  const Ea = 5.2, EaC = 3.2;
  const shade = (T, cls) => ({ f: x => f(x, T) * 6, from: Ea, to: 9.5, cls });
  return planeSvg({ W: 420, H: 250, x: [0, 10], y: [0, 3.2], step: [1, 1], grid: false, ticks: false, xl: names.x, yl: names.y,
    shade: [shade(1.6, 'mf-f2'), shade(1, 'mf-f1')],
    fns: [{ f: x => f(x, 1) * 6, from: 0, to: 9.8, cls: 'mf-c1', label: names.T1, at: 1.1, dx: 8, dy: -10 }, { f: x => f(x, 1.6) * 6, from: 0, to: 9.8, cls: 'mf-c4', label: names.T2, at: 2.4, dx: 8, dy: -8 }],
    segs: [[Ea, 0, Ea, 2.3, 'mf-line', true]].concat(cat ? [[EaC, 0, EaC, 2.3, 'mf-c3', true]] : []),
    texts: [[Ea, 2.5, 'Eₐ', 'middle', 'mf-lab-b']].concat(cat ? [[EaC, 2.5, names.cat, 'middle', 'mf-small']] : []), label });
}
/* Hess cycle: A → B directly, and A → C → B */
function hessCycleSvg({ label, a, b, c, h1, h2, h3 } = {}) {
  const W = 420, H = 210;
  let s = svgBox(W, H, label);
  const box = (x, y, t) => sR(x - 70, y - 18, 140, 36, 'mf-s1l', 8, ' stroke-width="1.5"') + sT(x, y + 5, t, 'mf-lab-b');
  s += sArrow(120, 40, 300, 40, 'mf-c1', 8) + sT(210, 30, h1, 'mf-small') + sArrow(80, 60, 185, 160, 'mf-c4', 8) + sT(112, 122, h2, 'mf-small', 'end') + sArrow(235, 160, 340, 60, 'mf-c4', 8) + sT(310, 122, h3, 'mf-small', 'start');
  s += box(70, 40, a) + box(350, 40, b) + box(210, 175, c);
  return s + '</svg>';
}
/* coffee-cup calorimeter */
function calorimeterSvg({ label, names } = {}) {
  const W = 320, H = 230;
  let s = svgBox(W, H, label);
  s += sP('M70 70L80 200H180L190 70Z', 'mf-s3l', ' stroke="var(--ink-2)" stroke-width="1.5"') + sP('M84 76L92 192H168L176 76Z', 'ch-glass') + sR(90, 110, 80, 80, 'ch-liq') + sR(62, 58, 136, 14, 'mf-s4l', 4, ' stroke="var(--ink-2)"');
  s += sR(120, 12, 8, 150, 'ch-glass', 3) + sR(121.5, 100, 5, 60, 'mf-c4', 2, ' style="fill:var(--lv4)"') + sC(124, 162, 6, '', ' style="fill:var(--lv4)"');
  s += sL(150, 30, 150, 170, 'mf-line', ' stroke-width="2"') + sP('M138 170h24', 'mf-line', ' stroke-width="3"');
  s += sT(128, 24, names[0], 'mf-small', 'end') + sT(158, 34, names[1], 'mf-small', 'start') + sT(196, 150, names[2], 'mf-small', 'start') + sT(204, 64, names[3], 'mf-small', 'start');
  return s + '</svg>';
}

/* ---------- acids & bases ---------- */
const UI_COL = ['#d7263d', '#e8412c', '#f06a28', '#f59a23', '#f8c630', '#e8d62f', '#b9d53a', '#5fb843', '#2e9e5b', '#1f8a8a', '#2466b3', '#3346a8', '#4b3aa0', '#5f2f96', '#6a2687'];
/* the pH scale in universal-indicator colours with labelled examples: items [[pH, text], …] (alternating above and below) */
function phScaleSvg(items, { label, names = [] } = {}) {
  const W = 480, L = 20, R = 20, cw = (W - L - R) / 15, y0 = 110, H = 220, X = p => L + (p + 0.5) * cw;
  let s = svgBox(W, H, label);
  UI_COL.forEach((c, i) => { s += sR(L + i * cw, y0, cw, 26, '', 0, ` style="fill:${c}"`) + sT(L + i * cw + cw / 2, y0 + 18, String(i), 'mf-small', 'middle', ' style="fill:#fff;stroke:none;font-weight:700"'); });
  items.forEach(([p, t], k) => { const up = k % 2 === 0, x = X(p), lvl = (k >> 1) % 3, y = up ? y0 - 12 - lvl * 26 : y0 + 38 + lvl * 26; s += sL(x, up ? y0 : y0 + 26, x, up ? y + 4 : y - 12, 'mf-thin') + sC(x, up ? y0 - 2 : y0 + 28, 2.5, 'mf-dot') + sT(x, y, t, 'mf-small'); });
  if (names.length) s += sT(L, H - 4, names[0], 'mf-lab-b', 'start') + sT(W / 2, H - 4, names[1], 'mf-lab-b') + sT(W - R, H - 4, names[2], 'mf-lab-b', 'end');
  return s + '</svg>';
}
/* strong vs weak acid in water: particles drawn as labelled discs */
function dissociationSvg({ label, names } = {}) {
  const W = 440, H = 200, rnd = mulberry32(12);
  let s = svgBox(W, H, label);
  const disc = (x, y, t, cls) => sC(x, y, 14, cls, ' fill-opacity="0.55"') + sT(x, y + 4, t, 'mf-small', 'middle', ' style="font-weight:700;fill:var(--ink)"');
  [[20, 'strong'], [240, 'weak']].forEach(([x0, kind], k) => {
    s += sR(x0 + 2, 36, 176, 128, 'ch-liq', 4) + sP(`M${x0} 20V160a6 6 0 0 0 6 6H${x0 + 174}a6 6 0 0 0 6-6V20`, 'ch-glass', ' fill="none"');
    const items = kind === 'strong' ? [['H⁺', 'ch-bO'], ['A⁻', 'ch-bN']].flatMap(p => [p, p, p, p]) : [['HA', 'ch-bS'], ['HA', 'ch-bS'], ['HA', 'ch-bS'], ['HA', 'ch-bS'], ['HA', 'ch-bS'], ['HA', 'ch-bS'], ['H⁺', 'ch-bO'], ['A⁻', 'ch-bN']];
    const pts = []; items.forEach(([t, c]) => { let x, y, g = 0; do { x = x0 + 22 + rnd() * 136; y = 54 + rnd() * 94; g++; } while (g < 400 && pts.some(([a, b]) => Math.hypot(a - x, b - y) < 32)); pts.push([x, y]); s += disc(x, y, t, c); });
    s += sT(x0 + 90, H - 12 + 8, names[k], 'mf-lab-b');
  });
  return s.replace(`viewBox="0 0 ${W} ${H}"`, `viewBox="0 0 ${W} ${H + 8}"`) + '</svg>';
}
/* pH of a mixture by charge balance: weak acid HA (total ca, Ka), sodium cna, chloride ccl (all mol/L) */
function phMix(ca, Ka, cna, ccl, Kw = 1e-14) {
  let lo = -1, hi = 15;
  for (let i = 0; i < 80; i++) { const p = (lo + hi) / 2, h = 10 ** -p, f = h + cna - Kw / h - ca * Ka / (Ka + h) - ccl; if (f > 0) lo = p; else hi = p; }
  return (lo + hi) / 2;
}
/* titration curve of 25 mL acid (0.1 M) with 0.1 M NaOH; Ka = null for a strong acid */
function titrationCurve(Ka, { Va = 25, ca = 0.1, cb = 0.1 } = {}) {
  const pts = [];
  for (let v = 0; v <= 50.001; v += 0.25) { const Vt = Va + v, A = ca * Va / Vt, Na = cb * v / Vt; pts.push([v, Ka ? phMix(A, Ka, Na, 0) : phMix(0, 1, Na, A)]); }
  return pts;
}
function titrationSvg({ label, Ka = null, bands = [], names = {}, W = 420, H = 280, mark = true } = {}) {
  const pts = titrationCurve(Ka);
  return planeSvg({ W, H, x: [0, 52], y: [0, 14.5], step: [5, 1], tickX: 10, tickY: 2, xl: names.x || 'V (mL)', yl: 'pH',
    rects: bands.map(([a, b, cls]) => [0, a, 50, b - a, cls]),
    texts: bands.map(([a, b, , t]) => [49, (a + b) / 2 - 0.25, t, 'end', 'mf-small']).concat(mark ? [[24, 6, names.eq || 'equivalence', 'end', 'mf-small']] : []),
    segs: mark ? [[25, 0, 25, 14, 'mf-line', true]] : [],
    extra: (X, Y) => sPline(pts.map(([x, y]) => [X(x), Y(y)]), 'mf-c1', ' fill="none" stroke-width="2.5"'), label });
}
/* burette over a conical flask on a white tile */
function titrationSetupSvg({ label, names } = {}) {
  const W = 340, H = 290;
  let s = svgBox(W, H, label);
  s += sR(40, 270, 120, 8, 'mf-s3l', 2, ' stroke="var(--ink-2)"') + sR(52, 20, 6, 252, 'mf-s3l', 1, ' stroke="var(--ink-2)"') + sR(58, 60, 50, 6, 'mf-s3l', 1, ' stroke="var(--ink-2)"');
  s += sR(104, 14, 14, 180, 'ch-glass', 3) + sR(106, 40, 10, 152, 'ch-liq') + [...Array(9)].map((_, i) => sL(104, 30 + i * 18, 111, 30 + i * 18, 'mf-thin')).join('') + sR(100, 194, 22, 8, 'mf-s4l', 2, ' stroke="var(--ink-2)"') + sP('M108 202v14h6v-14', 'ch-glass');
  s += sR(70, 260, 90, 8, '', 1, ' style="fill:var(--paper);stroke:var(--ink-3)"') + sP('M101 208v16l-26 34a4 4 0 0 0 3 4h68a4 4 0 0 0 3-4l-26-34v-16z', 'ch-glass') + sP('M84 244h54l12 16a3 3 0 0 1-2 4h-74a3 3 0 0 1-2-4z', '', ' style="fill:#f4a6c9;opacity:.85"');
  s += sL(122, 60, 170, 60, 'mf-thin') + sT(176, 64, names[0], 'mf-small', 'start') + sL(124, 198, 170, 198, 'mf-thin') + sT(176, 202, names[1], 'mf-small', 'start') + sL(150, 250, 170, 240, 'mf-thin') + sT(176, 242, names[2], 'mf-small', 'start') + sL(160, 264, 170, 270, 'mf-thin') + sT(176, 276, names[3], 'mf-small', 'start');
  return s + '</svg>';
}
/* a saturated solution: undissolved solid at the bottom, ions in solution */
function saturatedSvg({ label, ions = ['Ag⁺', 'Cl⁻'] } = {}) {
  const W = 220, H = 190, rnd = mulberry32(21);
  let s = svgBox(W, H, label) + sR(22, 40, 176, 128, 'ch-liq', 4);
  for (let i = 0; i < 26; i++) s += sR(30 + (i % 13) * 12.5, 150 - Math.floor(i / 13) * 10 - (i % 3) * 2, 11, 9, 'mf-s3l', 1, ' stroke="var(--ink-2)"');
  const pts = []; for (let k = 0; k < 8; k++) { let x, y, g = 0; do { x = 38 + rnd() * 144; y = 58 + rnd() * 66; g++; } while (g < 300 && pts.some(([a, b]) => Math.hypot(a - x, b - y) < 30)); pts.push([x, y]); s += sC(x, y, 13, k % 2 ? 'ch-bN' : 'ch-bO', ' fill-opacity="0.55"') + sT(x, y + 4, ions[k % 2], 'mf-small', 'middle', ' style="font-weight:700;fill:var(--ink)"'); }
  s += sP('M20 24V164a6 6 0 0 0 6 6H194a6 6 0 0 0 6-6V24', 'ch-glass', ' fill="none"') + sArrow(150, 146, 162, 126, 'mf-c4', 6) + sArrow(172, 126, 178, 144, 'mf-c1', 6);
  return s + '</svg>';
}

/* ---------- redox & electrochemistry ---------- */
const E0 = [['Li^+', 'Li', -3.04, 1], ['K^+', 'K', -2.93, 1], ['Ca^2+', 'Ca', -2.87, 2], ['Na^+', 'Na', -2.71, 1], ['Mg^2+', 'Mg', -2.37, 2], ['Al^3+', 'Al', -1.66, 3], ['Zn^2+', 'Zn', -0.76, 2], ['Fe^2+', 'Fe', -0.44, 2], ['Ni^2+', 'Ni', -0.25, 2], ['Pb^2+', 'Pb', -0.13, 2], ['2H^+', 'H2', 0, 2], ['Cu^2+', 'Cu', 0.34, 2], ['I2', '2I^-', 0.54, 2], ['Fe^3+', 'Fe^2+', 0.77, 1], ['Ag^+', 'Ag', 0.80, 1], ['Br2', '2Br^-', 1.07, 2], ['Cl2', '2Cl^-', 1.36, 2], ['F2', '2F^-', 2.87, 2]];
const uniS = t => t.replace(/\^(\d?)([+-])/g, (m, d, s) => (d ? '⁰¹²³⁴⁵⁶⁷⁸⁹'[d] : '') + (s === '+' ? '⁺' : '⁻')).replace(/(\D)(\d)/g, (m, a, d) => a + '₀₁₂₃₄₅₆₇₈₉'[d]).replace(/^(\d)/, '$1');
/* a vertical ladder of standard reduction potentials */
function eLadderSvg({ label, items = E0, names } = {}) {
  const n = items.length, W = 440, H = 60 + n * 22, X = 250, Y = k => 36 + (n - 1 - k) * 22;
  let s = svgBox(W, H, label) + sL(X, 24, X, H - 18, 'mf-axis') + sT(X, 16, 'E° (V)', 'mf-small');
  items.forEach(([ox, red, e, z], k) => { const y = Y(k); s += sL(X - 5, y, X + 5, y, 'mf-line') + sT(X - 12, y + 4, `${uniS(ox)} + ${z > 1 ? z : ''}e⁻ → ${uniS(red)}`, 'mf-small', 'end') + sT(X + 12, y + 4, (e > 0 ? '+' : e < 0 ? '−' : '') + Math.abs(e).toFixed(2), 'mf-small', 'start'); });
  s += sArrow(W - 40, H - 30, W - 40, 40, 'mf-c4', 8) + sT(W - 28, H / 2, names[0], 'mf-small', 'middle', ` transform="rotate(90 ${W - 28} ${H / 2})"`) + sArrow(40, 40, 40, H - 30, 'mf-c1', 8) + sT(28, H / 2, names[1], 'mf-small', 'middle', ` transform="rotate(-90 28 ${H / 2})"`);
  return s + '</svg>';
}
/* Daniell-type galvanic cell */
function galvanicCellSvg({ label, a = 'Zn', b = 'Cu', ia = 'Zn²⁺', ib = 'Cu²⁺', names, E = '1.10 V' } = {}) {
  const W = 460, H = 270;
  let s = svgBox(W, H, label);
  const beaker = x => sR(x + 2, 130, 136, 108, 'ch-liq', 4) + sP(`M${x} 110V236a6 6 0 0 0 6 6H${x + 134}a6 6 0 0 0 6-6V110`, 'ch-glass', ' fill="none"');
  s += beaker(30) + beaker(290);
  s += sP('M130 170V70H330V170', '', ' fill="none" stroke="var(--ink-3)" stroke-width="18" stroke-linejoin="round" opacity="0.35"') + sP('M130 170V70H330V170', '', ' fill="none" stroke="var(--ink-3)" stroke-width="1.2" stroke-dasharray="4 3"');
  s += sR(60, 90, 16, 130, 'mf-s3l', 2, ' stroke="var(--ink-2)"') + sR(384, 90, 16, 130, '', 2, ' style="fill:#c8743a;stroke:var(--ink-2)"');
  s += sP('M68 90V30H392V90', '', ' fill="none" stroke="var(--ink-2)" stroke-width="2"') + sC(230, 30, 20, '', ' style="fill:var(--paper);stroke:var(--ink-2);stroke-width:2"') + sT(230, 35, 'V', 'mf-lab-b');
  s += sArrow(110, 22, 160, 22, 'mf-c4', 7) + sT(135, 14, 'e⁻', 'mf-small') + sArrow(300, 22, 350, 22, 'mf-c4', 7) + sT(325, 14, 'e⁻', 'mf-small') + sT(230, 64, E, 'mf-small');
  s += sT(68, 258, `${names[0]} (${a}, −)`, 'mf-small') + sT(392, 258, `${names[1]} (${b}, +)`, 'mf-small') + sT(100, 200, ia, 'mf-lab-b') + sT(350, 200, ib, 'mf-lab-b') + sT(230, 104, names[2], 'mf-small');
  s += sT(100, 150, names[3], 'mf-small') + sT(360, 150, names[4], 'mf-small');
  return s + '</svg>';
}
/* electrolysis cell with two inert electrodes */
function electrolysisSvg({ label, names, left = 'Cu', right = 'Cl₂', ions = ['Cu²⁺', 'Cl⁻'], gasLeft = false, gasRight = true } = {}) {
  const W = 380, H = 260;
  let s = svgBox(W, H, label) + sR(72, 110, 236, 126, 'ch-liq', 4) + sP('M70 90V234a6 6 0 0 0 6 6H304a6 6 0 0 0 6-6V90', 'ch-glass', ' fill="none"');
  s += sR(120, 70, 14, 140, 'mf-s3l', 2, ' stroke="var(--ink-2)"') + sR(246, 70, 14, 140, 'mf-s3l', 2, ' stroke="var(--ink-2)"');
  s += sP('M127 70V30H253V70', '', ' fill="none" stroke="var(--ink-2)" stroke-width="2"') + sR(172, 18, 36, 24, '', 3, ' style="fill:var(--paper);stroke:var(--ink-2);stroke-width:2"') + sL(182, 24, 182, 36, 'mf-line', ' stroke-width="3"') + sL(194, 20, 194, 40, 'mf-line', ' stroke-width="1.5"') + sT(166, 30, '−', 'mf-lab-b', 'end') + sT(214, 30, '+', 'mf-lab-b', 'start');
  // note: the left electrode is joined to the − terminal (cathode), the right to + (anode)
  s += sT(127, 64, names[0], 'mf-small') + sT(253, 64, names[1], 'mf-small');
  const bub = (x, n) => [...Array(n)].map((_, i) => sC(x + (i % 2 ? 11 : -11), 190 - i * 14, 3, '', ' style="fill:var(--paper);stroke:var(--ink-3)"')).join('');
  if (gasLeft) s += bub(127, 5); if (gasRight) s += bub(253, 5);
  s += sArrow(215, 170, 150, 170, 'mf-c1', 7) + sT(182, 162, ions[0], 'mf-small') + sArrow(165, 196, 230, 196, 'mf-c4', 7) + sT(197, 214, ions[1], 'mf-small');
  s += sT(127, 256, left, 'mf-lab-b') + sT(253, 256, right, 'mf-lab-b');
  return s + '</svg>';
}
/* three test tubes for the rusting experiment */
function rustTubesSvg({ label, names } = {}) {
  const W = 460, H = 250;
  let s = svgBox(W, H, label);
  [[80, 'air+water'], [230, 'boiled'], [380, 'dry']].forEach(([x, k], i) => {
    s += sP(`M${x - 22} 40V180a22 22 0 0 0 44 0V40`, 'ch-glass') + sR(x - 25, 32, 50, 10, 'mf-s4l', 3, ' stroke="var(--ink-2)"');
    if (k !== 'dry') s += sP(`M${x - 21} ${k === 'boiled' ? 110 : 130}V180a21 21 0 0 0 42 0V${k === 'boiled' ? 110 : 130}z`, 'ch-liq');
    if (k === 'boiled') s += sR(x - 21, 100, 42, 10, '', 0, ' style="fill:#e8c35a;opacity:.85"');
    if (k === 'dry') s += [...Array(10)].map((_, j) => sC(x - 14 + (j % 4) * 9, 188 - Math.floor(j / 4) * 8, 4, '', ' style="fill:#f2f2f2;stroke:var(--ink-3)"')).join('') + sR(x - 21, 170, 42, 3, 'mf-grid');
    s += sL(x, 44, x, 164, '', ' style="stroke:var(--ink-2);stroke-width:3"') + (k === 'air+water' ? [...Array(6)].map((_, j) => sC(x + (j % 2 ? 3 : -3), 120 + j * 8, 2.5, '', ' style="fill:#b5541e"')).join('') : '');
    s += wrap2(x, 218, names[i], 'mf-small', 18);
  });
  return s + '</svg>';
}

/* ---------- organic ---------- */
/* displayed formula of a straight chain. backbone: ['C','C','O','C',…]; o.bonds: {i: order of bond i–(i+1)};
   o.subs: [[i, 'up'|'down'|'left'|'right', label, order]]; hydrogens fill the remaining valences */
const VAL = { C: 4, N: 3, O: 2, S: 2 };
function dispMol(backbone, { bonds = {}, subs = [], label, u = 38, lp = false, name } = {}) {
  const atoms = [], bl = [], n = backbone.length, dx = 1.15;
  backbone.forEach((a, i) => atoms.push([a, i * dx, 0]));
  for (let i = 0; i < n - 1; i++) bl.push([i, i + 1, bonds[i] || 1]);
  const used = backbone.map((_, i) => (i > 0 ? bonds[i - 1] || 1 : 0) + (i < n - 1 ? bonds[i] || 1 : 0));
  const taken = backbone.map(() => new Set());
  const P = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  subs.forEach(([i, pos, lab, o = 1]) => { const [px, py] = P[pos], k = atoms.length; atoms.push([lab, i * dx + px * (lab.length > 2 ? 1.25 : 1), py]); bl.push([i, k, o]); used[i] += o; taken[i].add(pos); });
  backbone.forEach((a, i) => {
    let free = (VAL[a] || 4) - used[i];
    const end = i === 0 ? 'left' : i === n - 1 ? 'right' : null, multi = (i > 0 && (bonds[i - 1] || 1) === 2) || (i < n - 1 && (bonds[i] || 1) === 2);
    const order = end ? (multi ? ['up', 'down', end] : [end, 'up', 'down']) : ['up', 'down'];
    if (n === 1) order.splice(0, order.length, 'up', 'down', 'left', 'right');
    order.filter(p => !taken[i].has(p)).forEach(p => { if (free <= 0) return; const [px, py] = P[p], k = atoms.length; atoms.push(['H', i * dx + px, py]); bl.push([i, k, 1]); free--; });
  });
  let s = molSvg(atoms, bl, { u, label, pad: 18 });
  if (name) { const m = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/), W = +m[1], H = +m[2]; s = s.replace(m[0], `viewBox="0 0 ${W} ${H + 20}"`).replace('</svg>', sT(W / 2, H + 12, name, 'mf-lab-b') + '</svg>'); }
  return s;
}
/* benzene: Kekulé structures and the delocalised ring */
function benzeneSvg({ label, names } = {}) {
  const W = 460, H = 170, r = 44, hex = (cx, cy) => [...Array(6)].map((_, k) => [cx + r * Math.cos(Math.PI / 6 + k * Math.PI / 3), cy + r * Math.sin(Math.PI / 6 + k * Math.PI / 3)]);
  let s = svgBox(W, H, label);
  const ring = (cx, cy, dbl) => { const p = hex(cx, cy); let t = sPoly(p, '', ' style="fill:none;stroke:var(--ink);stroke-width:2"'); if (dbl === 'circle') t += sC(cx, cy, r * 0.58, '', ' style="fill:none;stroke:var(--ink);stroke-width:2"'); else dbl.forEach(k => { const a = p[k], b = p[(k + 1) % 6], ix = cx + (a[0] - cx) * 0.8, iy = cy + (a[1] - cy) * 0.8, jx = cx + (b[0] - cx) * 0.8, jy = cy + (b[1] - cy) * 0.8; t += sL(ix, iy, jx, jy, 'ch-bond'); }); return t; };
  s += ring(70, 72, [0, 2, 4]) + sT(145, 78, '⟷', 'mf-lab-b') + ring(220, 72, [1, 3, 5]) + ring(380, 72, 'circle');
  s += sT(145, 150, names[0], 'mf-small') + sT(380, 150, names[1], 'mf-small');
  return s + '</svg>';
}
/* addition polymerisation: n monomers → repeat unit in brackets. sub: the group on the second carbon (H, Cl, CH₃, C₆H₅) */
function polymerSvg({ label, sub = 'H', names } = {}) {
  const W = 470, H = 150, u = 36;
  let s = svgBox(W, H, label);
  const C = (x, y) => sT(x, y + 5, 'C', 'ch-at ch-C'), Hh = (x, y, t = 'H') => sT(x, y + 5, t, `ch-at ${atomCls(t)}`);
  // monomer
  const mx = 60, my = 75; s += sT(mx - 42, my + 6, 'n', 'mf-var') + C(mx, my) + C(mx + u * 1.2, my) + sL(mx + 10, my - 3, mx + u * 1.2 - 10, my - 3, 'ch-bond') + sL(mx + 10, my + 3, mx + u * 1.2 - 10, my + 3, 'ch-bond');
  [[mx, -1, 'H'], [mx, 1, 'H'], [mx + u * 1.2, -1, 'H'], [mx + u * 1.2, 1, sub]].forEach(([x, d, t]) => { s += sL(x, my + d * 10, x, my + d * (u - 12), 'ch-bond') + Hh(x, my + d * u, t); });
  s += sArrow(150, my, 215, my, 'mf-line', 8) + sT(182, my - 10, names[0], 'mf-small');
  // repeat unit
  const px = 290; s += C(px, my) + C(px + u * 1.2, my) + sL(px + 10, my, px + u * 1.2 - 10, my, 'ch-bond') + sL(px - 46, my, px - 10, my, 'ch-bond') + sL(px + u * 1.2 + 10, my, px + u * 1.2 + 46, my, 'ch-bond');
  [[px, -1, 'H'], [px, 1, 'H'], [px + u * 1.2, -1, 'H'], [px + u * 1.2, 1, sub]].forEach(([x, d, t]) => { s += sL(x, my + d * 10, x, my + d * (u - 12), 'ch-bond') + Hh(x, my + d * u, t); });
  s += sP(`M${px - 26} ${my - 44}h-8v88h8`, '', ' style="fill:none;stroke:var(--ink);stroke-width:1.8"') + sP(`M${px + u * 1.2 + 26} ${my - 44}h8v88h-8`, '', ' style="fill:none;stroke:var(--ink);stroke-width:1.8"') + sT(px + u * 1.2 + 42, my + 50, 'n', 'mf-var');
  s += sT(80, 140, names[1], 'mf-small') + sT(px + u * 0.6, 140, names[2], 'mf-small');
  return s + '</svg>';
}
/* α-glucose (Haworth projection) */
function glucoseSvg({ label } = {}) {
  const W = 300, H = 210;
  let s = svgBox(W, H, label);
  const C5 = [95, 72], O = [165, 72], C1 = [215, 108], C2 = [180, 146], C3 = [110, 146], C4 = [70, 108];
  s += sPoly([C5, O, C1, C2, C3, C4], '', ' style="fill:color-mix(in srgb, var(--lv6) 10%, transparent);stroke:var(--ink);stroke-width:1.8"') + sL(...C2, ...C3, '', ' style="stroke:var(--ink);stroke-width:5"') + sL(...C1, ...C2, '', ' style="stroke:var(--ink);stroke-width:3.5"') + sL(...C3, ...C4, '', ' style="stroke:var(--ink);stroke-width:3.5"');
  s += sT(O[0], O[1] + 4, 'O', 'ch-at ch-O');
  const grp = ([x, y], dy, t) => sL(x, y, x, y + dy, 'ch-bond') + sT(x, y + dy + (dy > 0 ? 13 : -4), t, `ch-at ${atomCls(t)}`, 'middle', ' style="font-size:12px"');
  s += grp(C5, -30, 'CH₂OH') + grp(C5, 16, 'H') + grp(C1, -24, 'H') + grp(C1, 26, 'OH') + grp(C2, -22, 'H') + grp(C2, 26, 'OH') + grp(C3, -22, 'OH') + grp(C3, 26, 'H') + grp(C4, -24, 'H') + grp(C4, 26, 'OH');
  return s + '</svg>';
}

/* ---------- elements, nuclear, environment ---------- */
/* colour swatches of solutions: items [[css colour, label, sub]] */
function swatchSvg(items, { label, perRow = 5 } = {}) {
  const cw = 84, rh = 150, rows = Math.ceil(items.length / perRow), W = Math.min(items.length, perRow) * cw + 10, H = rows * rh;
  let s = svgBox(W, H, label);
  items.forEach(([c, t, sub], i) => { const r = Math.floor(i / perRow), x = 10 + (i % perRow) * cw + cw / 2 - 5, y0 = r * rh; s += sP(`M${x - 22} ${y0 + 20}V${y0 + 92}a8 8 0 0 0 8 8H${x + 14}a8 8 0 0 0 8-8V${y0 + 20}`, 'ch-glass', ' fill="none"') + sR(x - 21, y0 + 44, 42, 55, '', 6, ` style="fill:${c};opacity:${c === 'none' ? 0 : 0.85}"`) + sT(x, y0 + 120, t, 'mf-small', 'middle', ' style="font-weight:700"') + (sub ? sT(x, y0 + 136, sub, 'mf-small') : ''); });
  return s + '</svg>';
}
/* penetration of alpha, beta and gamma radiation */
function penetrationSvg({ label, names } = {}) {
  const W = 460, H = 200, ys = [55, 100, 145];
  let s = svgBox(W, H, label) + sR(20, 30, 40, 140, 'mf-s3l', 6, ' stroke="var(--ink-2)"') + sT(40, 104, '☢', 'mf-lab-b', 'middle', ' style="font-size:22px"');
  const walls = [[140, 6, '#f2e8d0', names[3]], [250, 14, '#c0c8d4', names[4]], [370, 34, '#8a93a0', names[5]]];
  walls.forEach(([x, w, c, t]) => { s += sR(x, 24, w, 152, '', 2, ` style="fill:${c};stroke:var(--ink-3)"`) + sT(x + w / 2, 192, t, 'mf-small'); });
  const ends = [140, 250, 370];
  [['α', 'mf-c4'], ['β', 'mf-c1'], ['γ', 'mf-c3']].forEach(([g, c], i) => { const y = ys[i], x2 = ends[i] - 2; s += (i === 2 ? sP(`M60 ${y}` + [...Array(28)].map((_, k) => `Q${64 + k * 11 + 3} ${y + (k % 2 ? 6 : -6)} ${64 + k * 11 + 5.5} ${y}`).join(''), c, ' fill="none" stroke-width="2"') : sArrow(60, y, x2, y, c, 8)) + sT(78, y - 8, `${g} ${names[i]}`, 'mf-small', 'start'); });
  s += sArrow(368, ys[2], 404, ys[2], 'mf-c3', 7) + sT(410, ys[2] + 4, '…', 'mf-small', 'start');
  return s + '</svg>';
}
/* the band of stability: N against Z */
function stabilitySvg({ label, names } = {}) {
  const Nst = z => z + 0.0058 * z * z;
  return planeSvg({ W: 400, H: 340, x: [0, 90], y: [0, 135], step: [10, 10], tickX: 20, tickY: 20, xl: 'Z', yl: 'N',
    polys: [{ pts: [...Array(19)].map((_, k) => [k * 4.6, Nst(k * 4.6) + 3 + k * 0.35]).concat([...Array(19)].map((_, k) => [(18 - k) * 4.6, Math.max(0, Nst((18 - k) * 4.6) - 3 - (18 - k) * 0.35)])), cls: 'mf-f2' }],
    fns: [{ f: z => z, from: 0, to: 88, cls: 'mf-c3', dash: true, label: 'N = Z', at: 70, dx: 6, dy: 14 }],
    texts: [[30, 90, names[0], 'middle', 'mf-small'], [62, 40, names[1], 'middle', 'mf-small'], [72, 118, names[2], 'middle', 'mf-small']], label });
}
/* greenhouse effect */
function greenhouseSvg({ label, names } = {}) {
  const W = 460, H = 250;
  let s = svgBox(W, H, label) + sR(0, 200, W, 50, '', 0, ' style="fill:color-mix(in srgb, var(--lv8) 30%, var(--paper))"') + sP('M0 90Q230 50 460 90', '', ' style="fill:none;stroke:var(--lv9);stroke-width:14;opacity:.25"') + sT(W - 10, 58, names[0], 'mf-small', 'end');
  s += sC(40, 30, 18, '', ' style="fill:#f5b82e"') + sArrow(60, 42, 150, 196, 'mf-c2', 8) + wrap2(70, 16, names[1], 'mf-small', 18, 'start');
  s += sArrow(200, 198, 240, 26, 'mf-c4', 8) + sT(248, 32, names[2], 'mf-small', 'start');
  s += sArrow(290, 198, 318, 84, 'mf-c4', 8) + sArrow(320, 84, 350, 196, 'mf-c4', 8) + wrap2(398, 140, names[3], 'mf-small', 14);
  s += sT(W / 2, 232, names[4], 'mf-lab-b');
  return s + '</svg>';
}
/* blast furnace (schematic) */
function blastFurnaceSvg({ label, names } = {}) {
  const W = 420, H = 300;
  let s = svgBox(W, H, label).replace(`viewBox="0 0 ${W} ${H}"`, `viewBox="-50 0 ${W + 50} ${H}"`) + sP('M150 30H230L270 170L250 260H130L110 170Z', '', ' style="fill:color-mix(in srgb, var(--lv1) 14%, var(--paper));stroke:var(--ink-2);stroke-width:2"') + sR(132, 238, 116, 22, '', 0, ' style="fill:#e0632e;opacity:.8"') + sR(126, 222, 128, 16, '', 0, ' style="fill:#b89a6a;opacity:.8"');
  s += sArrow(190, 6, 190, 40, 'mf-line', 8) + sT(200, 16, names[0], 'mf-small', 'start');
  s += sArrow(60, 200, 116, 200, 'mf-c4', 8) + sArrow(360, 200, 264, 200, 'mf-c4', 8) + sT(56, 196, names[1], 'mf-small', 'end');
  s += sArrow(236, 44, 300, 44, 'mf-c3', 8) + sT(306, 48, names[2], 'mf-small', 'start');
  s += sArrow(250, 230, 320, 240, 'mf-line', 7) + sT(326, 244, names[3], 'mf-small', 'start') + sArrow(132, 250, 60, 266, 'mf-line', 7) + sT(56, 270, names[4], 'mf-small', 'end');
  s += sT(190, 100, 'C + O₂ → CO₂', 'mf-small') + sT(190, 130, 'CO₂ + C → 2CO', 'mf-small') + sT(190, 160, 'Fe₂O₃ + 3CO →', 'mf-small') + sT(190, 174, '2Fe + 3CO₂', 'mf-small');
  return s + '</svg>';
}

/* ---------- university ---------- */
/* MO diagram for a second-period homonuclear diatomic (valence electrons n, O2-type ordering if oxy) */
function moDiagramSvg(n, { label, sym = 'O', names } = {}) {
  const W = 400, H = 330, lx = 60, rx = 340, cx = 200, oxy = n >= 12;
  let s = svgBox(W, H, label);
  const lvl = (x, y, w = 36) => sL(x - w / 2, y, x + w / 2, y, 'mf-line', ' stroke-width="2"');
  const el = (x, y, k) => (k >= 1 ? sArrow(x - 5, y + 8, x - 5, y - 10, 'mf-c1', 5) : '') + (k >= 2 ? sArrow(x + 5, y - 8, x + 5, y + 10, 'mf-c4', 5) : '');
  // atomic levels: 2s at y 250, 2p at y 150 (three boxes)
  const atomE = n / 2; // valence electrons per atom
  [lx, rx].forEach(x => { s += lvl(x, 260) + el(x, 260, 2); const p = atomE - 2; [-40, 0, 40].forEach((d, k) => { const cnt = p > 3 ? (k < p - 3 ? 2 : 1) : (k < p ? 1 : 0); s += lvl(x + d, 150, 30) + el(x + d, 150, cnt); }); });
  // MO levels
  const L = oxy ? [['σ2s', 290, 1], ['σ*2s', 230, 1], ['σ2p', 200, 1], ['π2p', 168, 2], ['π*2p', 120, 2], ['σ*2p', 80, 1]] : [['σ2s', 290, 1], ['σ*2s', 230, 1], ['π2p', 200, 2], ['σ2p', 168, 1], ['π*2p', 120, 2], ['σ*2p', 80, 1]];
  let left = n;
  L.forEach(([t, y, deg]) => { const cap = 2 * deg, k = Math.min(cap, left); left -= k; if (deg === 1) s += lvl(cx, y) + el(cx, y, k); else { const a = k >= deg ? (k - deg >= 1 ? 2 : 1) : k, b = k >= deg ? (k - deg >= 2 ? 2 : 1) : 0; s += lvl(cx - 22, y) + lvl(cx + 22, y) + el(cx - 22, y, a) + el(cx + 22, y, b); } s += sT(cx + (deg === 2 ? 50 : 28), y + 4, t, 'mf-small', 'start'); });
  [[lx, 260, 290], [lx, 260, 230], [rx, 260, 290], [rx, 260, 230], [lx, 150, 200], [lx, 150, 120], [rx, 150, 200], [rx, 150, 120], [lx, 150, 80], [rx, 150, 80]].forEach(([x, y1, y2]) => { s += sL(x + (x < cx ? 20 : -20) * (y1 === 150 ? 3 : 1), y1, cx + (x < cx ? -24 : 24) * (y2 === 168 || y2 === 200 || y2 === 120 ? 1.8 : 1), y2, 'mf-grid', ' stroke-dasharray="3 3"'); });
  s += sT(lx, 290, '2s', 'mf-small') + sT(rx, 290, '2s', 'mf-small') + sT(lx, 185, '2p', 'mf-small') + sT(rx, 185, '2p', 'mf-small') + sT(lx, 318, `${names[0]} ${sym}`, 'mf-lab-b') + sT(rx, 318, `${names[0]} ${sym}`, 'mf-lab-b') + sT(cx, 318, `${sym}₂`, 'mf-lab-b') + sArrow(18, 300, 18, 40, 'mf-axis', 7) + sT(26, 40, 'E', 'mf-var', 'start');
  return s + '</svg>';
}
/* crystal-field splitting of d orbitals in an octahedral field, filled with d electrons (high or low spin) */
function crystalFieldSvg(d, { label, low = false, names } = {}) {
  const W = 290, H = 240;
  let s = svgBox(W, H, label);
  const lvl = (x, y, w = 28) => sL(x - w / 2, y, x + w / 2, y, 'mf-line', ' stroke-width="2"');
  const el = (x, y, k) => (k >= 1 ? sArrow(x - 5, y + 8, x - 5, y - 10, 'mf-c1', 5) : '') + (k >= 2 ? sArrow(x + 5, y - 8, x + 5, y + 10, 'mf-c4', 5) : '');
  [16, 34, 52, 70, 88].forEach(x => { s += lvl(x, 130, 14); });
  const t = [150, 186, 222], e = [168, 204];
  const t2 = [0, 0, 0], eg = [0, 0];
  for (let k = 0; k < d; k++) { if (low) { if (k < 6) t2[k % 3]++; else eg[(k - 6) % 2]++; } else { const o = [['t', 0], ['t', 1], ['t', 2], ['e', 0], ['e', 1], ['t', 0], ['t', 1], ['t', 2], ['e', 0], ['e', 1]][k]; if (o[0] === 't') t2[o[1]]++; else eg[o[1]]++; } }
  t.forEach((x, k) => { s += lvl(x, 180) + el(x, 180, t2[k]); }); e.forEach((x, k) => { s += lvl(x, 80) + el(x, 80, eg[k]); });
  s += sL(100, 130, 132, 84, 'mf-grid', ' stroke-dasharray="3 3"') + sL(100, 130, 132, 176, 'mf-grid', ' stroke-dasharray="3 3"') + sT(224, 84, sub('e', 'g'), 'mf-small', 'start') + sT(240, 184, sub('t', '2g'), 'mf-small', 'start') + sArrow(272, 176, 272, 88, 'mf-c2', 6) + sT(262, 134, 'Δₒ', 'mf-lab-b', 'end');
  s += sT(52, 154, names[0], 'mf-small') + sT(186, 222, names[1], 'mf-small');
  return s + '</svg>';
}
/* a schematic spectrum: peaks [[x, height, label]] on axis x0..x1 (reversed for IR / NMR) */
function spectrumSvg(peaks, { label, x0, x1, xl, reverse = false, dips = false, W = 460, H = 220, ticks = [], lines = false } = {}) {
  const L = 30, R = 20, T0 = 20, B = 40, X = x => L + (reverse ? (x1 - x) : (x - x0)) / (x1 - x0) * (W - L - R), base = dips ? T0 + 10 : H - B;
  let s = svgBox(W, H, label) + sL(L, H - B, W - R, H - B, 'mf-axis') + ticks.map(t => sL(X(t), H - B, X(t), H - B + 4, 'mf-axis') + sT(X(t), H - B + 16, String(t), 'mf-small')).join('') + sT((L + W - R) / 2, H - 6, xl, 'mf-small');
  if (lines) { peaks.forEach(([x, h, t]) => { s += sL(X(x), H - B, X(x), H - B - h, 'mf-c1', ' stroke-width="2.4"') + (t ? sT(X(x), H - B - h - 6, t, 'mf-small') : ''); }); return s + '</svg>'; }
  let d = ''; const N = 400;
  for (let i = 0; i <= N; i++) { const x = x0 + (x1 - x0) * i / N; let y = 0; peaks.forEach(([px, h, , w = (x1 - x0) / 80]) => { y += h * Math.exp(-((x - px) ** 2) / (2 * w * w)); }); d += `${i ? 'L' : 'M'}${f1(X(x))} ${f1(dips ? base + y : base - y)}`; }
  s += sP(d, 'mf-c1', ' fill="none" stroke-width="1.8"');
  peaks.forEach(([px, h, t]) => { if (t) s += sT(X(px), dips ? base + h + 14 : base - h - 6, t, 'mf-small'); });
  return s + '</svg>';
}
