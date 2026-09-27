/* Decorative background behind the home-page hero: faint, subject-themed doodles (aria-hidden, drawn in a 1200 × 640 box). */
const HERO_ART = (() => {
  const tf = (x, y, rot) => (rot ? ` transform="rotate(${rot} ${x} ${y})"` : '');
  // text: t(x, y, content, size, { rot, cls, font, anchor })
  const t = (x, y, s, size, { rot = 0, cls = '', font = 'serif', anchor = 'start' } = {}) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" class="hb-t hb-${font} ${cls}"${tf(x, y, rot)}>${s}</text>`;
  const p = (d, cls = '') => `<path d="${d}" class="hb-l ${cls}"/>`;
  const c = (x, y, r, cls = '') => `<circle cx="${x}" cy="${y}" r="${r}" class="hb-l ${cls}"/>`;
  const dot = (x, y, r, cls = '') => `<circle cx="${x}" cy="${y}" r="${r}" class="hb-f ${cls}"/>`;
  const e = (x, y, rx, ry, rot, cls = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="hb-l ${cls}"${tf(x, y, rot)}/>`;
  const wave = (x0, y0, len, amp, per) => { let d = `M${x0} ${y0}`; for (let x = 0; x <= len; x += 4) d += `L${(x0 + x).toFixed(1)} ${(y0 - amp * Math.sin(2 * Math.PI * x / per)).toFixed(1)}`; return d; };
  const poly = (cx, cy, r, n, a0 = -Math.PI / 2) => 'M' + [...Array(n)].map((_, k) => { const a = a0 + 2 * Math.PI * k / n; return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`; }).join('L') + 'Z';
  const parts = [];
  // top strip
  parts.push(p('M232 12h74v78h-74z') + t(240, 30, '6', 14, { font: 'mono' }) + t(269, 68, 'C', 38, { font: 'sans', anchor: 'middle', cls: 'hbc3' }) + t(269, 84, '12.011', 11, { font: 'mono', anchor: 'middle' }));
  parts.push(t(340, 66, '2H₂ + O₂ → 2H₂O', 30, { rot: -2 }));
  parts.push(t(610, 30, 'N₂ + 3H₂ ⇌ 2NH₃', 22, { font: 'mono' }));
  // gap column
  parts.push(p(poly(612, 200, 26, 6)) + c(612, 200, 15, 'hbc2'));
  parts.push(t(628, 440, 'PV = nRT     ΔH < 0', 20, { rot: -90 }));
  parts.push(t(612, 545, 'e⁻', 44, { cls: 'hbc1', anchor: 'middle' }));
  // behind the text: faint line drawings only
  parts.push(p('M470 260L510 290L550 260') + c(510, 290, 16) + c(470, 260, 10) + c(550, 260, 10));
  parts.push(p('M470 400h36M478 400v40l-34 60q-5 10 7 10h72q12 0 7-10l-34-60v-40'));
  parts.push(c(200, 520, 14) + c(200, 520, 32) + c(200, 520, 50, 'hb-d'));
  // bottom strip
  parts.push(p(poly(170, 612, 26, 6)) + p(poly(215, 638, 26, 6)));
  parts.push(t(270, 628, 'NaCl   CO₂   CH₄   H₂SO₄', 20, { font: 'mono' }));
  parts.push(t(580, 628, 'pH 7', 28, { font: 'sans' }));
  for (let i = 0; i < 12; i++) parts.push(dot(760 + i * 26 + (i % 2) * 6, 610 + (i % 3) * 10, 4, i % 4 ? '' : 'hbc2'));
  parts.push(t(1070, 638, 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', 18, { anchor: 'end', font: 'mono' }));
  // outer edges
  parts.push(p(poly(70, 260, 40, 6)) + c(70, 260, 24, 'hbc2') + t(30, 480, 'H₂O', 24, { rot: -90, font: 'sans' }) + t(1130, 200, 'Au', 40, { font: 'sans', cls: 'hbc4' }) + p('M1100 380v100a12 12 0 0 0 24 0v-100M1094 380h36'));
  return '<svg viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + parts.join('') + '</svg>';
})();
