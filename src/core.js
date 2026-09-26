/* ==========================================================================
   Core helpers: translation, seeded randomness, number formatting,
   TeX builders, lesson building blocks. Every level file uses these.
   ========================================================================== */

/* ---------- i18n ----------
   Every piece of English prose is written as T`...` (a raw template, like String.raw).
   Its static text, with ⟦0⟧, ⟦1⟧… standing for the ${} slots, is hashed to a key.
   A language pack maps key -> translated template; the slots are filled back in.
   tools/i18n.py extracts the same keys from the source to build the catalogue. */
const LANGS = [['en', 'English'], ['id', 'Bahasa Indonesia']];   // LANG_CONF below already covers the Math Ladder languages for later
const LANG_CONF = {
  en: { dir: 'ltr', dec: '.', grp: ',' }, es: { dir: 'ltr', dec: ',', grp: ' ' }, zh: { dir: 'ltr', dec: '.', grp: ',' },
  fr: { dir: 'ltr', dec: ',', grp: ' ' }, de: { dir: 'ltr', dec: ',', grp: ' ' }, pt: { dir: 'ltr', dec: ',', grp: ' ' },
  ru: { dir: 'ltr', dec: ',', grp: ' ' }, ar: { dir: 'rtl', dec: '.', grp: ',' }, fa: { dir: 'rtl', dec: '.', grp: ',' },
  ja: { dir: 'ltr', dec: '.', grp: ',' }, ko: { dir: 'ltr', dec: '.', grp: ',' }, id: { dir: 'ltr', dec: ',', grp: ' ' },
};
const I18N = { lang: 'en', conf: LANG_CONF.en, t: null, ui: null, meta: null };
const I18N_PACKS = {};
const langPack = code => I18N_PACKS[code] || (I18N_PACKS[code] = { t: {}, ui: {}, meta: {} });
function addT(code, o) { Object.assign(langPack(code).t, o); }
function addUI(code, o) { Object.assign(langPack(code).ui, o); }
function addMeta(code, o) { const m = langPack(code).meta; for (const k in o) m[k] = Object.assign(m[k] || {}, o[k]); }
function setLang(code) {
  const p = code === 'en' ? null : I18N_PACKS[code];
  I18N.lang = p || code === 'en' ? code : 'en';
  I18N.conf = LANG_CONF[I18N.lang];
  I18N.t = p ? p.t : null; I18N.ui = p ? p.ui : null; I18N.meta = p ? p.meta : null;
}
/* cyrb53 — a small 53-bit string hash (mirrored exactly in tools/i18n.py) */
function hashKey(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
const TKEYS = new WeakMap(), SKEYS = new Map();
const fillT = (tpl, vals) => tpl.replace(/⟦(\d+)⟧/g, (m, i) => String(vals[+i]));
function T(strings, ...vals) {
  let k = TKEYS.get(strings);
  if (k === undefined) { k = hashKey(strings.raw.map((s, i) => (i ? `⟦${i - 1}⟧` : '') + s).join('')); TKEYS.set(strings, k); }
  const tr = I18N.t ? I18N.t[k] : undefined;
  return tr !== undefined ? fillT(tr, vals) : String.raw(strings, ...vals);
}
/* translate a string that was produced by a placeholder-free T`...` (e.g. a constant evaluated at load time) */
function tr(s) {
  if (!I18N.t || typeof s !== 'string') return s;
  let k = SKEYS.get(s); if (k === undefined) { k = hashKey(s); SKEYS.set(s, k); }
  const v = I18N.t[k]; return v === undefined ? s : v;
}
/* SI unit symbols in the local script where schools use one (ru, ar); other languages keep km, cm, kg … */
const UNIT_SYMS = {
  ru: { km: 'км', m: 'м', cm: 'см', mm: 'мм', kg: 'кг', g: 'г', mg: 'мг', t: 'т', L: 'л', mL: 'мл', h: 'ч', min: 'мин', s: 'с', J: 'Дж' },
  ar: { km: 'كم', m: 'م', cm: 'سم', mm: 'مم', kg: 'كغ', g: 'غ', mg: 'مغ', t: 'طن', L: 'ل', mL: 'مل', h: 'س', min: 'د', s: 'ث', J: 'جول' },
  id: { h: 'jam', people: 'jiwa', persons: 'jiwa', years: 'tahun', year: 'tahun', days: 'hari' },   // km/jam, jiwa/km²
};
function un(s) {
  const map = UNIT_SYMS[I18N.lang];
  return map && typeof s === 'string' ? s.replace(/[A-Za-z]+/g, w => map[w] || w) : s;
}
const R = String.raw;   // language packs write their strings as R`...` so TeX backslashes need no escaping
const LEVELS = [];
function level(def) { LEVELS.push(def); }

/* ---------- seeded random numbers (mulberry32) ---------- */
let rng = Math.random;
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seedRng(seed) { rng = mulberry32(seed >>> 0); }
const ri = (a, b) => a + Math.floor(rng() * (b - a + 1));
const rnz = (a, b) => { let x; do { x = ri(a, b); } while (x === 0); return x; };
const pick = arr => arr[Math.floor(rng() * arr.length)];
const chance = (p = 0.5) => rng() < p;
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const sample = (arr, k) => shuffle(arr).slice(0, k);

/* ---------- arithmetic ---------- */
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sum = arr => arr.reduce((s, x) => s + x, 0);
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const rnd = (x, d = 2) => { const p = 10 ** d; return Math.round((x + Math.sign(x) * 1e-9) * p) / p; };
const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
function nCr(n, r) { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); }
const nPr = (n, r) => { let v = 1; for (let i = 0; i < r; i++) v *= n - i; return v; };
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const PRIMES = range(2, 200).filter(isPrime);
const divisors = n => range(1, n).filter(d => n % d === 0);
function primeFactors(n) { const f = {}; let d = 2; while (n > 1) { while (n % d === 0) { f[d] = (f[d] || 0) + 1; n /= d; } d++; } return f; }
function median(arr) { const s = arr.slice().sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function properFrac(dmin, dmax) { let n, d; do { d = ri(dmin, dmax); n = ri(1, d - 1); } while (gcd(n, d) !== 1); return [n, d]; }
function simplifySurd(n) { let k = 1, m = n; for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return [k, m]; }

/* ---------- number formatting (follows the language: 12,345.6 / 12 345,6) ---------- */
function numParts(n, fixed) {
  let x = Math.round(n * 1e8) / 1e8; if (Object.is(x, -0)) x = 0;
  const neg = x < 0; let s = fixed != null ? Math.abs(x).toFixed(fixed) : Math.abs(x).toString();
  if (s.includes('e')) s = Math.abs(x).toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
  let [i, d] = s.split('.');
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '|');
  return { neg, i, d };
}
/* plain text number with a true minus sign; fixed = number of decimals to show */
function F(n, fixed) {
  if (typeof n !== 'number') return String(n);
  if (!isFinite(n)) return n > 0 ? '∞' : '−∞';
  const { neg, i, d } = numParts(n, fixed), c = I18N.conf;
  return (neg ? '−' : '') + i.replace(/\|/g, c.grp === ',' ? ',' : ' ') + (d ? c.dec + d : '');
}
/* number for use inside $...$ */
function M(n, fixed) {
  if (typeof n !== 'number') return String(n);
  const { neg, i, d } = numParts(n, fixed), c = I18N.conf;
  return (neg ? '-' : '') + i.replace(/\|/g, c.grp === ',' ? '{,}' : '\\,') + (d ? (c.dec === ',' ? '{,}' : '.') + d : '');
}

/* ---------- TeX builders ---------- */
const pn = n => (n < 0 ? `(${M(n)})` : M(n));              // (−3)
const sg = n => (n < 0 ? `- ${M(-n)}` : `+ ${M(n)}`);        // "+ 3" / "- 3"
function frac(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; }
function frT(n, d = 1) { [n, d] = frac(n, d); if (d === 1) return M(n); return (n < 0 ? '-' : '') + `\\frac{${M(Math.abs(n))}}{${M(d)}}`; }
const fx = (n, d = 1) => `$${frT(n, d)}$`;
const FR = (n, d = 1) => ({ a: fx(n, d), v: n / d, fr: frac(n, d) });
const rawF = (n, d) => `$\\frac{${n}}{${d}}$`;
function piT(n, d = 1) {
  [n, d] = frac(n, d); if (n === 0) return '0';
  const s = n < 0 ? '-' : ''; n = Math.abs(n);
  if (d === 1) return s + (n === 1 ? '' : M(n)) + '\\pi';
  return s + `\\frac{${n === 1 ? '' : M(n)}\\pi}{${d}}`;
}
const pix = (n, d = 1) => `$${piT(n, d)}$`;
const PI = (n, d = 1) => ({ a: pix(n, d), v: (n / d) * Math.PI, pi: frac(n, d) });
function surdT(k, m) {
  if (k === 0) return '0'; if (m === 1) return M(k);
  const s = k < 0 ? '-' : ''; k = Math.abs(k);
  return s + (k === 1 ? '' : M(k)) + `\\sqrt{${m}}`;
}
/* one term of a polynomial; c may be a number or a [num, den] fraction */
function term(c, v, first) {
  const val = Array.isArray(c) ? c[0] / c[1] : c;
  if (val === 0) return '';
  const neg = val < 0;
  let mag;
  if (Array.isArray(c)) {
    const [n, d] = frac(Math.abs(c[0]), Math.abs(c[1]));
    mag = d === 1 ? (n === 1 && v ? '' : M(n)) : `\\frac{${n}}{${d}}`;
  } else { const a = Math.abs(c); mag = a === 1 && v ? '' : M(a); }
  const body = mag + v;
  return first ? (neg ? '-' : '') + body : (neg ? ' - ' : ' + ') + body;
}
function terms(list) { let s = ''; for (const [c, v] of list) s += term(c, v, s === ''); return s || '0'; }
function poly(coefs, x = 'x') {
  const deg = coefs.length - 1;
  return terms(coefs.map((c, i) => [c, deg - i === 0 ? '' : deg - i === 1 ? x : `${x}^{${deg - i}}`]));
}
const lin = (a, b, x = 'x') => poly([a, b], x);
function cxT(re, im) {
  if (im === 0) return M(re);
  const imPart = (Math.abs(im) === 1 ? '' : M(Math.abs(im))) + 'i';
  if (re === 0) return (im < 0 ? '-' : '') + imPart;
  return `${M(re)} ${im < 0 ? '-' : '+'} ${imPart}`;
}
const cxPlain = (re, im) => cxT(re, im).replace(/\s+/g, '').replace(/\{,\}/g, '');
const mat = rows => `\\begin{pmatrix} ${rows.map(r => r.map(x => M(x)).join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;
const colv = arr => mat(arr.map(x => [x]));
/* list separator: languages with a decimal comma separate listed numbers with ";" */
const LS = () => (I18N.conf.dec === ',' ? '; ' : ', ');
const listF = arr => arr.map(x => (typeof x === 'number' ? F(x) : x)).join(LS());
const pt = (...xs) => `(${xs.map(x => M(x)).join(LS())})`;
const setT = arr => (arr.length ? `\\{${arr.map(x => M(x)).join(LS())}\\}` : '\\varnothing');
const TF = b => (b ? T`True` : T`False`);
const xt = (c, v = 'x') => terms([[c, v]]);                    // 3x, -x, x
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
const SYM = { lt: '\\lt', gt: '\\gt', le: '\\le', ge: '\\ge' };
const FLIP = { lt: 'gt', gt: 'lt', le: 'ge', ge: 'le' };
const moveTxt = (b, everyPart = false) => (everyPart
  ? (b > 0 ? T`Subtract ${M(b)} from every part` : T`Add ${M(-b)} to every part`)
  : (b > 0 ? T`Subtract ${M(b)} from both sides` : T`Add ${M(-b)} to both sides`));

/* ---------- HTML building blocks ---------- */
const Key = (h, label = T`Key idea`) => `<div class="box box-key"><p class="box-label">${label}</p>${h}</div>`;
const Ex = (h, label = T`Worked example`) => `<div class="box box-ex"><p class="box-label">${label}</p>${h}</div>`;
const Tip = (h, label = T`Watch out`) => `<div class="box box-tip"><p class="box-label">${label}</p>${h}</div>`;
const Fm = tex => `<div class="formula">$$${tex}$$</div>`;
const Fig = (svg, cap) => `<figure class="fig">${svg}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
function Tbl(head, rows) {
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
/* a table used inside a question; first row is the header, rowHead makes the first column a header too */
function qTable(rows, rowHead = false) {
  return `<div class="tbl-wrap"><table class="tbl tbl-q">${rows.map((r, i) => `<tr>${r.map((c, j) => (i === 0 || (rowHead && j === 0)) ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}
