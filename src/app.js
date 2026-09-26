/* ==========================================================================
   App: routing, lessons, worksheet generation, checking, answer key, print,
   language switching
   ========================================================================== */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LETTERS = 'ABCD';
const ICON = {
  print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
};

/* ---------------- interface text (English; other languages come from lang/<code>.js) ---------------- */
const UI_EN = {
  brandTag: 'Atoms → Molecules → Reactions',
  searchPh: 'Search ⟦0⟧ topics',
  searchLabel: 'Search topics',
  showTopics: 'Show topics',
  language: 'Language',
  mixedReview: 'Mixed review',
  reviewTitle: '⟦0⟧: Mixed Review',
  reviewBlurb: 'One worksheet drawing questions from all ⟦0⟧ ready topics of this track — good for revision before a test.',
  heroEyebrow: 'Chemistry · Topic by topic',
  heroTitle: 'From atoms to reactions, one rung at a time.',
  heroLede: '⟦0⟧ topics from junior high school to university, laid out in tracks from matter and atoms to bonding, reactions, acids, electrochemistry and organic chemistry. Each has an illustrated lesson and a practice worksheet that is generated fresh every time you open it, with worked solutions, an answer key and print-ready pages.',
  startWith: 'Start with ⟦0⟧',
  tryReview: 'Try a mixed review',
  levels: 'Tracks',
  nTopics: '⟦0⟧ of ⟦1⟧ topics ready',
  soon: 'Coming soon',
  trackSoon: 'This track is being written. Its topics are listed so you can see where they fit.',
  stage_jh: 'Junior high',
  stage_sh: 'Senior high',
  stage_uni: 'University',
  mathLadder: 'Math Ladder',
  physLadder: 'Physics Ladder',
  dirN: 'N', dirS: 'S', dirE: 'E', dirW: 'W',
  soonTopic: 'This topic is coming soon.',
  reviewLink: 'Mixed review worksheet →',
  freshQ: 'Fresh question',
  anotherQ: 'Another question',
  showAnswer: 'Show answer',
  hideAnswer: 'Hide answer',
  answerColon: 'Answer:',
  home: 'Home',
  breadcrumb: 'Breadcrumb',
  topicPos: 'Topic ⟦0⟧ of ⟦1⟧',
  lesson: 'Lesson',
  practice: 'Practice',
  topicSections: 'Topic sections',
  printLesson: 'Print lesson',
  practiseTopic: 'Practise ⟦0⟧ →',
  prev: '← Previous',
  next: 'Next →',
  otherTopics: 'Other topics',
  questions: 'Questions',
  qType: 'Question type',
  modeMixed: 'Mixed',
  modeMc: 'Multiple choice',
  modeFill: 'Fill-in',
  newSheet: 'New worksheet',
  printQ: 'Print questions',
  worksheet: 'Worksheet',
  practiceSheet: '⟦0⟧ · Practice worksheet',
  sheet: 'Sheet',
  type: 'Type',
  name: 'Name',
  klass: 'Class',
  date: 'Date',
  score: 'Score',
  fillNote: 'Fill-in answers accept whole numbers, decimals and fractions like <code>3/4</code>. You may type the unit too, as in <code>0.25 mol</code> or <code>18 g/mol</code>. Answers within about 1% are accepted unless the question asks for an exact count.',
  checkAnswers: 'Check my answers',
  clearAnswers: 'Clear answers',
  answerKey: 'Answer key',
  showKey: 'Show answer key',
  hideKey: 'Hide answer key',
  printKey: 'Print answer key',
  printBoth: 'Print questions + key',
  keyHead: 'Answer key · ⟦0⟧',
  sheetNo: 'Sheet #⟦0⟧',
  choicesFor: 'Choices for question ⟦0⟧',
  answer: 'Answer',
  typeAnswer: 'Type your answer',
  qMc: 'Multiple choice',
  qFill: 'Fill in',
  notAnswered: 'Not answered',
  correct: 'Correct',
  notQuite: 'Not quite',
  scoreLine: '⟦0⟧ / ⟦1⟧ correct',
  unanswered: '⟦0⟧ unanswered',
  source: 'Source:',
  pageOf: 'Page ⟦0⟧ of ⟦1⟧',
  printToast: 'Choose “Save as PDF” in the print dialog to export. If no dialog opens, this viewer blocks printing — open the downloaded HTML file in Chrome or Edge and print from there.',
  langFail: 'This language could not be loaded, so the page is shown in English.',
  themeDark: 'Switch to night mode',
  themeLight: 'Switch to day mode',
  ladderHead: 'Where this topic sits',
  buildsOn: 'Builds on',
  leadsTo: 'Leads to',
  ladderStart: 'A starting point: no earlier topic is needed.',
  ladderTop: 'The top of this branch of the ladder.',
};
const ui = (k, ...vals) => fillT((I18N.ui && I18N.ui[k]) || UI_EN[k] || k, vals);
const MODE_KEYS = { mixed: 'modeMixed', mc: 'modeMc', fill: 'modeFill' };
const metaOf = (kind, id, i, fallback) => { const m = I18N.meta && I18N.meta[kind] && I18N.meta[kind][id]; return (m && m[i]) || fallback; };
const lvName = lv => metaOf('levels', lv.id, 0, lv.name);
const lvShort = lv => metaOf('levels', lv.id, 1, lv.short);
const lvBand = lv => metaOf('levels', lv.id, 2, lv.band);
const lvBlurb = lv => metaOf('levels', lv.id, 3, lv.blurb);
const extTitle = (kind, id) => metaOf(kind, id, 0, EXT[kind].topics[id]);
const tTitle = t => (t.review ? ui('reviewTitle', lvShort(t.level)) : metaOf('topics', t.id, 0, t.title));
const tBlurb = t => (t.review ? ui('reviewBlurb', t.level.topics.length) : metaOf('topics', t.id, 1, t.blurb));

/* ---------------- credit / source (printed on every PDF) ---------------- */
const CREDIT = 'Chem Ladder · @rendyhn 2026';
const SITE = /^https?:$/.test(location.protocol) && !/^(localhost|127\.|\[::1\])/.test(location.hostname) && !/claude/i.test(location.hostname)
  ? (location.host + location.pathname).replace(/index\.html$/, '').replace(/\/$/, '') : '';
const SOURCE = SITE ? `${CREDIT} · ${SITE}` : CREDIT;
const sourceLine = () => `<p class="print-only print-source">${esc(ui('source'))} ${esc(SOURCE)}</p>`;
function updatePrintStyle() {   // page numbers and the source line live in the printed page margins
  let el = $('#print-page-style');
  if (!el) { el = document.createElement('style'); el.id = 'print-page-style'; document.head.appendChild(el); }
  const css = s => '"' + s.replace(/["\\]/g, '') + '"';
  const page = ((I18N.ui && I18N.ui.pageOf) || UI_EN.pageOf).split(/(⟦[01]⟧)/).filter(Boolean).map(p => (p === '⟦0⟧' ? 'counter(page)' : p === '⟦1⟧' ? 'counter(pages)' : css(p))).join(' ');
  el.textContent = `@media print { @page { @bottom-left { content: ${page}; } ${SITE ? `@bottom-right { content: ${css(SOURCE)}; }` : ''} } }`;
}

/* ---------------- registry ---------------- */
const TOPICS = new Map();
const SOON = new Map();   // planned topics: listed in the tracks and the prerequisite map, not yet written
LEVELS.forEach((lv, li) => {
  lv.index = li; lv.all = lv.topics; lv.topics = lv.all.filter(t => !t.soon);
  lv.all.forEach((t, k) => { t.level = lv; t.code = lv.mark + (k + 1); if (t.soon) SOON.set(t.id, t); });
  lv.topics.forEach((t, ti) => { t.index = ti; t.pool = t.gens.map(fn => ({ fn, topic: t.id })); TOPICS.set(t.id, t); });
  lv.review = lv.topics.length > 1 ? { id: 'review-' + lv.id, review: true, level: lv, index: lv.topics.length, pool: lv.topics.flatMap(t => t.pool) } : null;
  if (lv.review) TOPICS.set(lv.review.id, lv.review);
});
const ALL = LEVELS.flatMap(l => l.topics);
/* a link end is a topic here, a planned topic, or math:<id> / phys:<id> on the sister sites */
const linkEnd = id => { const m = /^(math|phys):(.+)$/.exec(id); return m ? (EXT[m[1]].topics[m[2]] ? { ext: m[1], extId: m[2] } : null) : TOPICS.get(id) || SOON.get(id) || null; };
LADDER.forEach(e => {
  const a = linkEnd(e.from), b = linkEnd(e.to);
  if (!a || !b || a.review || b.review || b.ext) { console.warn('ladder: unknown topic in', e.from, '->', e.to); return; }
  (b.needs || (b.needs = [])).push(e); if (!a.ext) (a.opens || (a.opens = [])).push(e);
});

/* ---------------- settings (per-viewer convenience only) ---------------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('chemladder:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('chemladder:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
};
const settings = { n: store.get('n', 10), mode: store.get('mode', 'mixed') };
if (![5, 10, 15, 20].includes(settings.n)) settings.n = 10;
if (!MODE_KEYS[settings.mode]) settings.mode = 'mixed';

/* ---------------- math typesetting (MathJax, with a plain fallback) ---------------- */
let mjState = window.__mjState || 'loading';
let mjChain = Promise.resolve();
const pending = new Set();
function texLite(t) {
  let s = t;
  const sym = { '\\times': '×', '\\div': '÷', '\\cdot': '·', '\\pm': '±', '\\mp': '∓', '\\le': '≤', '\\leq': '≤', '\\ge': '≥', '\\geq': '≥', '\\lt': '&lt;', '\\gt': '&gt;', '\\ne': '≠', '\\neq': '≠', '\\approx': '≈', '\\equiv': '≡', '\\pi': 'π', '\\theta': 'θ', '\\alpha': 'α', '\\beta': 'β', '\\lambda': 'λ', '\\mu': 'μ', '\\sigma': 'σ', '\\Sigma': 'Σ', '\\Delta': 'Δ', '\\varphi': 'φ', '\\phi': 'φ', '\\infty': '∞', '\\int': '∫', '\\iint': '∬', '\\oint': '∮', '\\sum': 'Σ', '\\to': '→', '\\rightarrow': '→', '\\Rightarrow': '⇒', '\\Leftrightarrow': '⇔', '\\leftrightarrow': '↔', '\\iff': '⇔', '\\implies': '⇒', '\\in': '∈', '\\notin': '∉', '\\cup': '∪', '\\cap': '∩', '\\subseteq': '⊆', '\\varnothing': '∅', '\\emptyset': '∅', '\\partial': '∂', '\\nabla': '∇', '\\neg': '¬', '\\wedge': '∧', '\\vee': '∨', '\\forall': '∀', '\\exists': '∃', '\\square': '□', '\\circ': '°', '\\ldots': '…', '\\cdots': '⋯', '\\quad': ' ', '\\qquad': ' ', '\\mid': '|', '\\nmid': '∤', '\\lvert': '|', '\\rvert': '|', '\\lfloor': '⌊', '\\rfloor': '⌋', '\\bmod': ' mod ', '\\pmod': ' mod ', '\\mathcal': '', '\\displaystyle': '', '\\dfrac': '\\frac', '\\left': '', '\\right': '', '\\downarrow': '↓', '\\not': '¬', '\\underbrace': '', '\\overrightarrow': '', '\\hat': '', '\\bar': '', '\\mathbf': '' };
  s = s.replace(/\\begin\{(?:p|v|b)?matrix\}([\s\S]*?)\\end\{(?:p|v|b)?matrix\}/g, (m, b) => '[' + b.split('\\\\').map(r => r.split('&').map(c => c.trim()).join(', ')).join('; ') + ']');
  s = s.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (m, b) => '{ ' + b.split('\\\\').map(r => r.replace(/&/g, ' ')).join(' ; ') + ' }');
  s = s.replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1');
  const wrap = x => (/^[\w.√π]+$/.test(x) ? x : `(${x})`);
  for (let k = 0; k < 6; k++) {
    s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => `${wrap(a)}/${wrap(b)}`);
    s = s.replace(/\\sqrt\[([^\]]*)\]\{([^{}]*)\}/g, '<sup>$1</sup>√($2)').replace(/\\sqrt\{([^{}]*)\}/g, '√($1)');
    s = s.replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, 'C($1, $2)');
  }
  s = s.replace(/\\(sin|cos|tan|sec|csc|cot|log|ln|lim|det|exp|arcsin|arctan|gcd)\b/g, '$1 ');
  s = s.replace(/\\[a-zA-Z]+|\\[,;:! %{}]/g, m => (m in sym ? sym[m] : m === '\\,' || m === '\\;' || m === '\\:' || m === '\\ ' ? ' ' : m === '\\!' ? '' : m === '\\%' ? '%' : m === '\\{' ? '{' : m === '\\}' ? '}' : m.slice(1)));
  s = s.replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>').replace(/\^(\S)/g, '<sup>$1</sup>').replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>').replace(/_(\S)/g, '<sub>$1</sub>');
  return s.replace(/\{,\}/g, ',').replace(/[{}]/g, '');
}
function fallbackStr(html) {
  return html.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (m, d, i) => `<span class="fbm${d ? ' fbm-d' : ''}">${texLite(d || i)}</span>`);
}
/* an inline formula wider than its line cannot wrap: show it on a line of its own that scrolls sideways (phones) */
function markWide(root) {
  root.querySelectorAll('mjx-container:not([display="true"])').forEach(m => {
    if (m.closest('.tbl-wrap')) return;                     // tables already scroll
    m.classList.remove('mjx-wide');
    const blk = m.parentElement && m.parentElement.closest('p, li, div, figcaption, dd, label'), box = blk && blk.getBoundingClientRect();
    if (box && box.width && m.getBoundingClientRect().width > box.width + 1) m.classList.add('mjx-wide');
  });
}
let wideTimer;
window.addEventListener('resize', () => { clearTimeout(wideTimer); wideTimer = setTimeout(() => { const el = document.getElementById('main'); if (el) markWide(el); }, 150); });
function typeset(el) {
  if (!el) return;
  if (mjState === 'ready') mjChain = mjChain.then(() => window.MathJax.typesetPromise([el])).then(() => markWide(el)).catch(err => console.warn('MathJax:', err));
  else if (mjState === 'loading') pending.add(el);
}
function setHTML(el, html) {
  if (mjState === 'ready' && window.MathJax && MathJax.typesetClear) { try { MathJax.typesetClear([el]); } catch (e) { /* ignore */ } }
  el.innerHTML = mjState === 'failed' ? fallbackStr(html) : html;
  typeset(el);
}
window.__mjReady = () => { const was = mjState; mjState = 'ready'; if (was === 'failed') route(); else { pending.forEach(el => el.isConnected && typeset(el)); } pending.clear(); };
window.__mjFailed = () => { if (mjState !== 'loading') return; mjState = 'failed'; pending.clear(); route(); };
if (mjState === 'ready') setTimeout(window.__mjReady, 0);
setTimeout(() => { if (mjState === 'loading') window.__mjFailed(); }, 15000);

/* ---------------- answer checking ---------------- */
function evalExpr(src) {
  const s = src.replace(/\s+/g, ''); let i = 0;
  const expr = () => { let v = term(); while (s[i] === '+' || s[i] === '-') { const o = s[i++], t = term(); v = o === '+' ? v + t : v - t; } return v; };
  const term = () => { let v = unary(); for (;;) { const c = s[i]; if (c === '*' || c === '/') { i++; const f = unary(); v = c === '*' ? v * f : v / f; } else if (c && /[0-9.(a-z]/.test(c)) v *= power(); else return v; } };
  const unary = () => { if (s[i] === '-') { i++; return -unary(); } if (s[i] === '+') { i++; return unary(); } return power(); };
  const power = () => { const b = atom(); if (s[i] === '^') { i++; return Math.pow(b, unary()); } return b; };
  const atom = () => {
    if (s[i] === '(') { i++; const v = expr(); if (s[i] !== ')') throw new Error('paren'); i++; return v; }
    const m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)); if (m) { i += m[0].length; return parseFloat(m[0]); }
    for (const [name, f] of [['sqrt', Math.sqrt], ['ln', Math.log], ['log', Math.log10]]) if (s.startsWith(name, i)) { i += name.length; return f(atom()); }
    if (s.startsWith('pi', i)) { i += 2; return Math.PI; }
    if (s[i] === 'e') { i++; return Math.E; }
    throw new Error('bad token');
  };
  const v = expr(); if (i !== s.length) throw new Error('trailing'); return v;
}
const decComma = () => I18N.conf.dec === ',';
function cleanInput(raw) {
  let s = String(raw).trim().replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => '^(' + [...m].map(c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c) === 0 ? '-' : '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c) - 1).join('') + ')').replace(/Ω/g, ' ohm').toLowerCase().replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/²/g, '^2').replace(/³/g, '^3').replace(/[\u00A0\u202F]/g, ' ');
  s = s.normalize('NFKC')                                            // full-width digits and signs from CJK keyboards
    .replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x660).replace(/[۰-۹]/g, d => d.charCodeAt(0) - 0x6F0)   // Arabic / Persian digits
    .replace(/٫/g, '.').replace(/٬/g, '').replace(/[  ]/g, ' ');
  if (decComma() && /^-?\d{1,3}(\.\d{3})+(,\d+)?(?!\d)/.test(s)) s = s.replace(/\.(?=\d{3}(?!\d))/g, '');   // 50.000 -> 50000 (dot as thousands separator)
  if (decComma()) s = s.replace(/(\d),(?=\d)/g, '$1.');           // 2,5 -> 2.5
  s = s.replace(/(\d) (?=\d{3}(?!\d))/g, '$1');                    // 3 500 -> 3500 (space as thousands separator)
  s = s.replace(/^[a-z](_?\d)?\s*=\s*/, '');
  s = s.replace(PHYS_UNIT, '');                                   // 12 m/s, 5 kg·m/s, 3,6 kj, 40 ohm …
  s = s.replace(/(\d(?:\.\d+)?)e([+-]?\d+)$/, '$1*10^($2)');    // 3e8, 1.6e-19
  s = s.replace(/\s*(°\s*c|°|degrees?|deg|%|‰|percent|per ?mil+e?)\s*$/, '');
  s = s.replace(/\s*(km\/h|m\/s\^?2?|cm\^?[23]?|mm\^?[23]?|km\^?2?|m\^?[23]?|kg|mg|g|ml|l|seconds?|secs?|s|minutes?|mins?|hours?|hrs?|h|units?|dollars?|days?|years?|j)\s*$/, '');
  s = s.replace(/\s*(million|juta)(\s+(years?|tahun))?\s*$/, '');          // answers asked for in millions (of years)
  s = s.replace(/\s+(?!pi\b|e\b)[^\s\d()+\-*/^.,]+(\^[23])?$/u, '');       // a trailing unit word in any language
  s = s.replace(/(\d)[^\x00-\x7F\s\d()+\-*/^.,]+(\^[23])?$/u, '$1');      // …or a non-Latin unit written without a space (3500м, 12سم)
  return s.trim();
}
const PU = '(?:[kmgµμncp]?(?:ohms?|pa|hz|cal|wh|ev|bq|mol|bar|d|u|n|j|w|v|a|c|g|m|s|l|k|t|f)|°c|°f|°|h|min|rad|rev|rpm|atm|torr|mmhg|hpa|mbar|mb|ha|ppm|people|persons?|jiwa|orang|years?|yrs?|tahun|thn|jam|hari|days?)(?:\\^?\\(?-?[123]\\)?)?';
const PHYS_UNIT = new RegExp(`(?<=[\\d)\\s])\\s*${PU}(?:\\s*[*/.]?\\s*${PU})*\\s*$`, 'u');
function parseNum(raw) {
  const s = cleanInput(raw); if (!s) return null;
  const mix = /^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s); if (mix) return (mix[1] ? -1 : 1) * (+mix[2] + mix[3] / mix[4]);
  const t = !decComma() && /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s) ? s.replace(/,/g, '') : s;
  try { const v = evalExpr(t); return Number.isFinite(v) ? v : null; } catch (e) { return null; }
}
function decs(x) { const s = (Math.round(Math.abs(x) * 1e8) / 1e8).toFixed(8).replace(/0+$/, ''); const k = s.indexOf('.'); return k < 0 ? 0 : s.length - k - 1; }
function close(x, v, tol, typed, rtol) {
  if (rtol != null && Math.abs(x - v) <= rtol * Math.abs(v) + 1e-12 * Math.min(1, Math.abs(v))) return true;
  if (rtol != null && tol == null) return Math.abs(x - v) <= 1e-9 * Math.abs(v);   // measured answers: relative tolerance only, so tiny answers are checked properly
  if (tol != null) return Math.abs(x - v) <= tol + 1e-9;
  if (Math.abs(x - v) <= Math.max(1e-6, 1e-6 * Math.abs(v))) return true;
  if (rtol != null) return false;   // measured answers: the stated tolerance only, no coarse rounding
  const m = /^-?\d*\.(\d+)$/.exec(cleanInput(typed));
  if (m && m[1].length >= 2 && decs(v) > m[1].length) return Math.abs(x - v) <= 0.5 * 10 ** -m[1].length + 1e-9;   // correctly rounded decimal
  return false;
}
function splitList(s) {
  let t = s.trim();
  if (/^[([⟨<].*[)\]⟩>]$/.test(t) && /[,;]/.test(t)) t = t.slice(1, -1);
  if (decComma()) {   // decimal-comma languages separate answers with ";" (or ", " with a space)
    let parts = t.split(/\s*;\s*/).filter(Boolean); if (parts.length > 1) return parts;
    parts = t.split(/,\s+/).filter(Boolean); if (parts.length > 1) return parts;
  }
  return t.split(/\s*(?:,|;|\band\b|\bor\b)\s*/i).filter(Boolean);
}
function checkFill(ck, input) {
  const s = String(input || '').trim(); if (!s) return null;
  const norm = x => String(x).toLowerCase().replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/^[a-z]=/, '').replace(/[.。]$/, '');
  if (ck.alt && ck.alt.some(a => norm(a) === norm(s))) return true;
  const v = ck.v; if (v === undefined) return false;
  if (Array.isArray(v)) {
    const parts = splitList(s); if (parts.length !== v.length) return false;
    const nums = parts.map(parseNum); if (nums.some(x => x === null)) return false;
    if (ck.ord) return v.every((y, k) => close(nums[k], y, ck.tol, parts[k], ck.rtol));
    const used = v.map(() => false);
    return nums.every((x, k) => { const j = v.findIndex((y, jj) => !used[jj] && close(x, y, ck.tol, parts[k], ck.rtol)); if (j < 0) return false; used[j] = true; return true; });
  }
  const x = parseNum(s); return x === null ? false : close(x, v, ck.tol, s, ck.rtol);
}

/* ---------------- worksheet generation ---------------- */
const valKey = x => (typeof x === 'number' ? 'n' + Math.round(x * 1e8) : 's' + String(x).replace(/\s+/g, ''));
const canFill = r => typeof r.a === 'number' || r.v !== undefined || (r.alt && r.alt.length > 0);
function showVal(x, u) { const body = typeof x === 'number' ? F(x) : String(x); u = un(tr(u)); return u ? body + (/^[°%]/.test(u) ? '' : ' ') + esc(u) : body; }
/* numeric distractors: plausible slips (a factor of 2, 10, …) rather than answers one digit away */
function autoWrong(a) {
  if (a === 0) return [1, 2, -1, 10];
  return shuffle([2, 0.5, 10, 0.1, 1.5, 0.75, 3, 4, 0.25].map(k => sig(a * k)).filter(x => x !== a));
}
function buildOptions(raw) {
  const a = raw.a, seen = new Set([valKey(a)]), out = [a];
  const ok = x => {
    if (x === undefined || x === null || x === '' || (typeof x === 'number' && !Number.isFinite(x))) return false;
    if (typeof a === 'number') { if (typeof x !== 'number') return false; if (a >= 0 && x < 0 && !raw.neg) return false; if (decs(x) > Math.max(2, decs(a) + 1)) return false; }
    return true;
  };
  const add = list => { for (const x of list) { if (out.length >= 4) break; if (!ok(x)) continue; const k = valKey(x); if (seen.has(k)) continue; seen.add(k); out.push(x); } };
  add(raw.w || []);
  if (typeof a === 'number') add(autoWrong(a));
  if (raw.fr) { const [n, d] = raw.fr; add(shuffle([fx(n + 1, d), fx(n - 1, d), fx(n, d + 1), fx(-n, d), fx(2 * n, d), fx(n + d, d)])); }
  if (raw.pi) { const [n, d] = raw.pi; add(shuffle([pix(2 * n, d), pix(n, 2 * d), pix(n + 1, d), pix(n + d, d)])); }
  if (typeof a === 'number') return out.sort((x, y) => x - y);
  const TT = TF(true), FF = TF(false);
  if (out.every(o => o === TT || o === FF)) return out.sort((x, y) => (x === TT ? -1 : y === TT ? 1 : 0));
  return shuffle(out);
}
function finalize(raw, type, topic) {
  const it = { q: raw.q, s: raw.s || '', type, topic, u: un(tr(raw.u || '')), h: tr(raw.h || ''), ansHTML: showVal(raw.a, raw.u) };
  if (type === 'mc') {
    const opts = buildOptions(raw);
    if (opts.length < 2) { if (!canFill(raw)) return null; it.type = 'fill'; }
    else { it.choices = opts.map(o => showVal(o, raw.u)); it.correct = opts.findIndex(o => valKey(o) === valKey(raw.a)); }
  }
  if (it.type === 'fill') it.check = { v: raw.v !== undefined ? raw.v : typeof raw.a === 'number' ? raw.a : undefined, alt: raw.alt, tol: raw.tol, rtol: raw.rtol === undefined ? 0.01 : raw.rtol, ord: raw.ord };
  return it;
}
function makeSheet(topic, n, mode, seed) {
  seedRng(seed);
  const items = [], seen = new Set(); let bag = [], tries = 0;
  while (items.length < n && tries++ < n * 40) {
    if (!bag.length) bag = shuffle(topic.pool);
    const g = bag.pop();
    let raw; try { raw = g.fn(); } catch (e) { console.error('Generator failed in', g.topic, e); continue; }
    if (!raw || !raw.q || seen.has(raw.q)) continue;
    let type;
    if (raw.only === 'mc' || !canFill(raw)) { if (mode === 'fill' && tries < n * 30) continue; type = 'mc'; }
    else type = mode === 'mc' ? 'mc' : mode === 'fill' ? 'fill' : chance(0.45) ? 'fill' : 'mc';
    const it = finalize(raw, type, g.topic); if (!it) continue;
    seen.add(raw.q); items.push(it);
  }
  return { topicId: topic.id, seed, n, mode, items, answers: {}, checked: false, keyOpen: false };
}
const newSeed = () => (Math.random() * 4294967296) >>> 0;
const sheetId = seed => seed.toString(36).toUpperCase().padStart(7, '0');
const sheets = new Map();

/* ---------------- DOM refs ---------------- */
const main = $('#main'), nav = $('#nav-levels'), search = $('#topic-search'), toastEl = $('#toast'), langSel = $('#lang-select');
let current = { view: 'home' };

/* ---------------- navigation ---------------- */
function renderNav() {
  nav.innerHTML = LEVELS.map(lv => `
    <section class="nav-level" style="--lv: var(--${lv.color})" data-level="${lv.id}">
      <h2 class="nav-level-title"><span class="rung" aria-hidden="true">${lv.mark}</span><span>${esc(lvName(lv))}<small>${esc(lvBand(lv))}</small></span></h2>
      <ol class="nav-topics">
        ${lv.all.map(t => t.soon
          ? `<li class="nav-soon" data-search="${esc([t.title, tTitle(t)].join(' ').toLowerCase())}"><span class="num">${t.code}</span><span>${esc(tTitle(t))}<small>${esc(ui('soon'))}</small></span></li>`
          : `<li data-search="${esc([t.title, t.blurb, tTitle(t), tBlurb(t)].join(' ').toLowerCase())}"><a href="#${t.id}" data-id="${t.id}"><span class="num">${t.code}</span><span>${esc(tTitle(t))}</span></a></li>`).join('')}
        ${lv.review ? `<li data-search="${esc(('mixed review ' + ui('mixedReview') + ' ' + lvShort(lv)).toLowerCase())}"><a href="#${lv.review.id}" data-id="${lv.review.id}" class="nav-review"><span class="num">★</span><span>${esc(ui('mixedReview'))}</span></a></li>` : ''}
      </ol>
    </section>`).join('');
  search.placeholder = ui('searchPh', ALL.length);
  if (search.value) search.dispatchEvent(new Event('input'));
}
function markNav(id) {
  nav.querySelectorAll('a[data-id]').forEach(a => { if (a.dataset.id === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const cur = nav.querySelector('a[aria-current]');
  if (cur && window.matchMedia('(min-width: 961px)').matches) { const r = cur.getBoundingClientRect(), p = nav.parentElement.getBoundingClientRect(); if (r.top < p.top || r.bottom > p.bottom) cur.scrollIntoView({ block: 'center' }); }
}
search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  nav.querySelectorAll('.nav-level').forEach(sec => {
    let any = false;
    sec.querySelectorAll('li').forEach(li => { const hit = !q || li.dataset.search.includes(q); li.hidden = !hit; any = any || hit; });
    sec.hidden = !any;
  });
});
/* ---------------- day / night: follows the device until the viewer picks one ---------------- */
const darkMq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : !!(darkMq && darkMq.matches); };
function updateThemeBtn() { const b = $('#theme-btn'), l = ui(isDark() ? 'themeLight' : 'themeDark'); b.setAttribute('aria-label', l); b.title = l; }
$('#theme-btn').addEventListener('click', () => {
  const t = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = t; store.set('theme', t); updateThemeBtn();
});
if (darkMq && darkMq.addEventListener) darkMq.addEventListener('change', updateThemeBtn);
const openMenu = on => { document.body.classList.toggle('nav-open', on); $('#menu-btn').setAttribute('aria-expanded', String(on)); };
$('#menu-btn').addEventListener('click', () => openMenu(!document.body.classList.contains('nav-open')));
$('#scrim').addEventListener('click', () => openMenu(false));
nav.addEventListener('click', e => { if (e.target.closest('a')) openMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') openMenu(false); });

/* ---------------- routing ---------------- */
function parseHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  const [id, tab] = h.split('.');
  if (TOPICS.has(id)) return { view: 'topic', id, tab: tab === 'practice' || TOPICS.get(id).review ? 'practice' : 'lesson' };
  return { view: 'home' };
}
function route(keepScroll = false) {
  const r = parseHash(), sameTopic = current.view === 'topic' && r.view === 'topic' && current.id === r.id;
  current = r;
  if (r.view === 'home') renderHome(); else renderTopic(TOPICS.get(r.id), r.tab);
  markNav(r.id);
  if (keepScroll === true) return;
  if (!sameTopic) window.scrollTo(0, 0);
  else { const head = $('.topic-tabs'); if (head && head.getBoundingClientRect().top < 0) head.scrollIntoView(); }
}
window.addEventListener('hashchange', () => route());

/* ---------------- home ---------------- */
function renderHome() {
  document.title = 'Chem Ladder';
  const first = LEVELS[0].topics[0];
  main.innerHTML = `
  <section class="hero">
    <div class="hero-copy">
      <div class="hero-logo" aria-hidden="true"><svg viewBox="0 0 64 64"><rect x="1" y="1" width="62" height="62" rx="14" fill="#141B2B" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2"/><defs><clipPath id="fl-x"><path d="M28 12H36V26L49 47Q51 51 46 51H18Q13 51 15 47L28 26Z"/></clipPath></defs><g clip-path="url(#fl-x)"><rect x="10" y="34" width="44" height="4.5" fill="#F58BB0"/><rect x="10" y="38.5" width="44" height="4.5" fill="#A9B2FF"/><rect x="10" y="43" width="44" height="4.5" fill="#34CDB8"/><rect x="10" y="47.5" width="44" height="5" fill="#FB8B52"/></g><circle cx="31" cy="29.5" r="1.9" fill="#FFFFFF"/><circle cx="33.4" cy="23.5" r="1.4" fill="#FFFFFF" fill-opacity="0.8"/><circle cx="30.6" cy="18.5" r="1.1" fill="#FFFFFF" fill-opacity="0.6"/><path d="M28 12H36V26L49 47Q51 51 46 51H18Q13 51 15 47L28 26Z" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/><path d="M25 12H39" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/></svg></div>
      <p class="eyebrow">${esc(ui('heroEyebrow'))}</p>
      <h1>${esc(ui('heroTitle'))}</h1>
      <p class="lede">${esc(ui('heroLede', ALL.length))}</p>
      <div class="hero-cta"><a class="btn btn-primary" href="#${first.id}">${esc(ui('startWith', tTitle(first)))}</a><a class="btn" href="#${LEVELS.filter(l => l.review).sort((x, y) => y.topics.length - x.topics.length)[0].review.id}">${esc(ui('tryReview'))}</a></div>
    </div>
    <div class="sample" id="sample" aria-live="polite"></div>
  </section>
  <section class="ladder" aria-label="${esc(ui('levels'))}">
    ${LEVELS.map(lv => `
    <article class="level" style="--lv: var(--${lv.color})">
      <header class="level-head"><span class="rung rung-lg" aria-hidden="true">${lv.mark}</span><div><h2>${esc(lvName(lv))}</h2><p class="band">${esc(lvBand(lv))} · ${esc(ui('nTopics', lv.topics.length, lv.all.length))}</p></div></header>
      <p class="level-blurb">${esc(lvBlurb(lv))}</p>
      <ol class="level-topics">${lv.all.map(t => t.soon ? `<li class="soon">${esc(tTitle(t))}</li>` : `<li><a href="#${t.id}">${esc(tTitle(t))}</a></li>`).join('')}</ol>
      ${lv.review ? `<a class="level-review" href="#${lv.review.id}">${esc(ui('reviewLink'))}</a>` : lv.topics.length ? '' : `<p class="level-soon">${esc(ui('trackSoon'))}</p>`}
    </article>`).join('')}
  </section>`;
  renderSample();
}
let sampleState = null;   // { topicId, seed } so a language switch shows the same question
function renderSample(fresh = true) {
  const box = $('#sample'); if (!box) return;
  let it, t, guard = 0;
  do {
    if (fresh || !sampleState) sampleState = { topicId: ALL[Math.floor(Math.random() * ALL.length)].id, seed: newSeed() };
    t = TOPICS.get(sampleState.topicId); seedRng(sampleState.seed);
    const g = pick(t.pool);
    try { const raw = g.fn(); it = finalize(raw, raw.only === 'mc' || !canFill(raw) || chance(0.8) ? 'mc' : 'fill', t.id); } catch (e) { it = null; }
    fresh = true;
  } while (!it && guard++ < 10);
  if (!it) return;
  setHTML(box, `
    <div class="sample-head"><span class="sample-label">${esc(ui('freshQ'))}</span><a class="sample-topic" style="--lv: var(--${t.level.color})" href="#${t.id}.practice">${esc(lvShort(t.level))} · ${esc(tTitle(t))}</a></div>
    <div class="sample-q">${it.q}</div>
    ${it.type === 'mc' ? `<ol class="sample-choices">${it.choices.map((c, j) => `<li><span class="letter" aria-hidden="true">${LETTERS[j]}</span><span>${c}</span></li>`).join('')}</ol>` : ''}
    <div class="sample-actions"><button type="button" class="btn btn-small" data-act="sample-new">${ICON.refresh}${esc(ui('anotherQ'))}</button><button type="button" class="btn btn-small btn-ghost" data-act="sample-reveal" aria-expanded="false" aria-controls="sample-ans">${esc(ui('showAnswer'))}</button></div>
    <div class="sample-ans reveal collapsed" id="sample-ans"><p class="sample-answer"><b>${esc(ui('answerColon'))}</b> ${it.type === 'mc' ? `${LETTERS[it.correct]} — ${it.choices[it.correct]}` : it.ansHTML}</p><p class="sample-sol">${it.s}</p></div>`);
}

/* ---------------- topic pages ---------------- */
function renderTopic(t, tab) {
  const lv = t.level, pos = t.review ? ui('mixedReview') : t.code + (t.stage ? ' · ' + ui('stage_' + t.stage) : '');
  document.title = `${tTitle(t)} · Chem Ladder`;
  main.innerHTML = `
  <article class="topic" style="--lv: var(--${lv.color})">
    <header class="topic-head">
      <nav class="crumbs" aria-label="${esc(ui('breadcrumb'))}"><a href="#">${esc(ui('home'))}</a><span aria-hidden="true">/</span><span>${esc(lvName(lv))}</span></nav>
      <p class="eyebrow"><span class="rung" aria-hidden="true">${lv.mark}</span>${esc(lvName(lv))} · ${esc(pos)}</p>
      <h1>${esc(tTitle(t))}</h1>
      <p class="lede">${esc(tBlurb(t))}</p>
      ${t.review ? '' : `<nav class="topic-tabs" aria-label="${esc(ui('topicSections'))}"><a href="#${t.id}"${tab === 'lesson' ? ' aria-current="page"' : ''}>${esc(ui('lesson'))}</a><a href="#${t.id}.practice"${tab === 'practice' ? ' aria-current="page"' : ''}>${esc(ui('practice'))}</a></nav>`}
    </header>
    <div id="panel"></div>
  </article>`;
  if (tab === 'practice') renderPractice(t); else renderLesson(t);
}
function renderLesson(t) {
  const i = ALL.indexOf(t), prev = ALL[i - 1], next = ALL[i + 1];
  const body = typeof t.lesson === 'function' ? t.lesson() : t.lesson;
  setHTML($('#panel'), `
    <div class="lesson-tools no-print"><button type="button" class="btn btn-small btn-ghost" data-act="print-lesson">${ICON.print}${esc(ui('printLesson'))}</button></div>
    ${ladderLinks(t)}
    <div class="prose">${body}</div>
    ${sourceLine()}
    <div class="lesson-foot no-print">
      <a class="btn btn-primary" href="#${t.id}.practice">${esc(ui('practiseTopic', tTitle(t)))}</a>
      <nav class="pager" aria-label="${esc(ui('otherTopics'))}">
        ${prev ? `<a href="#${prev.id}"><small>${esc(ui('prev'))}</small>${esc(tTitle(prev))}</a>` : '<span></span>'}
        ${next ? `<a href="#${next.id}" class="pager-next"><small>${esc(ui('next'))}</small>${esc(tTitle(next))}</a>` : '<span></span>'}
      </nav>
    </div>`);
}
/* prerequisites and next topics, each with the one-sentence reason for the link */
function ladderLinks(t) {
  const item = (o, e) => {
    const x = o.ext && EXT[o.ext];
    const head = x
      ? `<a href="${x.url}?lang=${I18N.lang}#${o.extId}" target="_blank" rel="noopener" class="rungs-math"><span class="rung" aria-hidden="true">${x.icon}</span><span>${esc(extTitle(o.ext, o.extId))}</span><small>${esc(ui(x.label))} ↗</small></a>`
      : o.soon
        ? `<span class="rungs-soon" style="--lv: var(--${o.level.color})"><span class="rung" aria-hidden="true">${o.code}</span><span>${esc(tTitle(o))}</span><small>${esc(ui('soon'))}</small></span>`
        : `<a href="#${o.id}" style="--lv: var(--${o.level.color})"><span class="rung" aria-hidden="true">${o.code}</span><span>${esc(tTitle(o))}</span></a>`;
    return `<li>${head}<p>${e.why()}</p></li>`;
  };
  const col = (key, list, pick, empty) => `<div class="rungs-col"><h2 class="kicker">${esc(ui(key))}</h2>${list && list.length
    ? `<ul>${list.map(e => item(linkEnd(pick(e)), e)).join('')}</ul>` : `<p class="rungs-empty">${esc(ui(empty))}</p>`}</div>`;
  return `<details class="rungs no-print"${store.get('ladderOpen', true) ? ' open' : ''}><summary>${ICON.chev}${esc(ui('ladderHead'))}</summary>
    <div class="rungs-cols">${col('buildsOn', t.needs, e => e.from, 'ladderStart')}${col('leadsTo', t.opens, e => e.to, 'ladderTop')}</div></details>`;
}
function getSheet(t, fresh) {
  let sh = sheets.get(t.id);
  if (!sh || fresh || sh.n !== settings.n || sh.mode !== settings.mode) { sh = makeSheet(t, settings.n, settings.mode, newSeed()); sheets.set(t.id, sh); }
  return sh;
}
function renderPractice(t, fresh = false) {
  const sh = getSheet(t, fresh), lv = t.level, id = sheetId(sh.seed);
  const qs = sh.items.map((it, i) => {
    const base = `q${sh.seed}-${i}`, ans = sh.answers[i];
    const body = it.type === 'mc'
      ? `<div class="choices" role="radiogroup" aria-label="${esc(ui('choicesFor', i + 1))}">${it.choices.map((c, j) => `<label class="choice${ans === j ? ' sel' : ''}" for="${base}-${j}"><input type="radio" id="${base}-${j}" name="${base}" value="${j}" data-i="${i}"${ans === j ? ' checked' : ''}><span class="letter" aria-hidden="true">${LETTERS[j]}</span><span class="choice-body">${c}</span></label>`).join('')}</div>`
      : `<div class="fill"><label class="fill-label" for="${base}-in">${esc(ui('answer'))}</label><input type="text" dir="ltr" id="${base}-in" data-i="${i}" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" placeholder="${esc(ui('typeAnswer'))}" value="${esc(ans || '')}">${it.u ? `<span class="fill-unit">${esc(it.u)}</span>` : ''}</div>${it.h ? `<p class="fill-hint no-print">${esc(it.h)}</p>` : ''}`;
    return `<li class="q" data-i="${i}"><div class="q-meta"><span class="q-num">${i + 1}</span><span class="q-type">${esc(ui(it.type === 'mc' ? 'qMc' : 'qFill'))}</span>${t.review ? `<span class="q-topic">${esc(tTitle(TOPICS.get(it.topic)))}</span>` : ''}</div><div class="q-text">${it.q}</div>${body}<p class="feedback" aria-live="polite"></p></li>`;
  }).join('');
  const key = sh.items.map((it, i) => `<li><div class="key-row"><span class="q-num">${i + 1}</span><div class="key-ans">${it.type === 'mc' ? `<span class="key-letter">${LETTERS[it.correct]}</span>${it.choices[it.correct]}` : it.ansHTML}</div></div>${it.s ? `<div class="key-sol">${it.s}</div>` : ''}</li>`).join('');
  setHTML($('#panel'), `
    <div class="ws-controls no-print">
      <div class="ctrl"><span class="ctrl-label" id="cnt-label">${esc(ui('questions'))}</span><div class="seg" role="group" aria-labelledby="cnt-label">${[5, 10, 15, 20].map(n => `<button type="button" class="seg-btn" data-n="${n}" aria-pressed="${settings.n === n}">${n}</button>`).join('')}</div></div>
      <div class="ctrl"><label class="ctrl-label" for="mode-select">${esc(ui('qType'))}</label><select id="mode-select">${Object.entries(MODE_KEYS).map(([k, v]) => `<option value="${k}"${settings.mode === k ? ' selected' : ''}>${esc(ui(v))}</option>`).join('')}</select></div>
      <div class="ctrl-actions"><button type="button" class="btn btn-primary" data-act="new">${ICON.refresh}${esc(ui('newSheet'))}</button><button type="button" class="btn" data-act="print-q">${ICON.print}${esc(ui('printQ'))}</button></div>
    </div>
    <section class="sheet" aria-label="${esc(ui('worksheet'))}">
      <header class="sheet-head">
        <div class="sheet-title"><p class="kicker">${esc(ui('practiceSheet', lvName(lv)))}</p><h2>${esc(tTitle(t))}</h2></div>
        <dl class="sheet-meta"><div><dt>${esc(ui('sheet'))}</dt><dd>#${id}</dd></div><div><dt>${esc(ui('questions'))}</dt><dd>${sh.items.length}</dd></div><div><dt>${esc(ui('type'))}</dt><dd>${esc(ui(MODE_KEYS[sh.mode]))}</dd></div></dl>
        <div class="print-only name-line"><span>${esc(ui('name'))} ____________________________</span><span>${esc(ui('klass'))} ________</span><span>${esc(ui('date'))} ______________</span><span>${esc(ui('score'))} ______ / ${sh.items.length}</span></div>
        ${sourceLine()}
      </header>
      <p class="sheet-note no-print">${ui('fillNote')}</p>
      <ol class="qs">${qs}</ol>
      <div class="check-bar no-print"><button type="button" class="btn btn-primary" data-act="check">${ICON.check}${esc(ui('checkAnswers'))}</button><button type="button" class="btn btn-ghost" data-act="clear">${esc(ui('clearAnswers'))}</button><p class="score" role="status"></p></div>
    </section>
    <section class="key-sec" aria-label="${esc(ui('answerKey'))}">
      <div class="key-head no-print">
        <button type="button" class="key-toggle" data-act="toggle-key" aria-expanded="${sh.keyOpen}" aria-controls="key-body">${ICON.chev}<span>${esc(ui(sh.keyOpen ? 'hideKey' : 'showKey'))}</span></button>
        <div class="key-actions"><button type="button" class="btn btn-small" data-act="print-key">${ICON.print}${esc(ui('printKey'))}</button><button type="button" class="btn btn-small" data-act="print-both">${ICON.print}${esc(ui('printBoth'))}</button></div>
      </div>
      <div class="key-body reveal${sh.keyOpen ? '' : ' collapsed'}" id="key-body">
        <header class="print-only key-print-head"><p class="kicker">${esc(ui('keyHead', lvName(lv)))}</p><h2>${esc(tTitle(t))}</h2><p>${esc(ui('sheetNo', id))}</p>${sourceLine()}</header>
        <ol class="key-list">${key}</ol>
      </div>
    </section>`);
  if (sh.checked) checkSheet(false);
}

/* ---------------- checking ---------------- */
function currentSheet() { return current.view === 'topic' ? sheets.get(current.id) : null; }
function checkSheet(announce = true) {
  const sh = currentSheet(); if (!sh) return;
  let right = 0, blank = 0;
  const fbs = [];
  sh.items.forEach((it, i) => {
    const li = main.querySelector(`.q[data-i="${i}"]`); if (!li) return;
    const fb = li.querySelector('.feedback'); li.classList.remove('is-right', 'is-wrong', 'is-blank');
    let res;
    if (it.type === 'mc') {
      const a = sh.answers[i]; res = a == null ? null : a === it.correct;
      li.querySelectorAll('.choice').forEach((c, j) => { c.classList.toggle('is-answer', j === it.correct); c.classList.toggle('is-miss', j === a && a !== it.correct); });
    } else res = checkFill(it.check, sh.answers[i]);
    const correctTxt = it.type === 'mc' ? `${LETTERS[it.correct]} — ${it.choices[it.correct]}` : it.ansHTML;
    if (res === null) { blank++; li.classList.add('is-blank'); fb.innerHTML = `<span class="fb-tag">${esc(ui('notAnswered'))}</span> ${esc(ui('answerColon'))} ${correctTxt}`; }
    else if (res) { right++; li.classList.add('is-right'); fb.innerHTML = `<span class="fb-tag">${esc(ui('correct'))}</span>`; }
    else { li.classList.add('is-wrong'); fb.innerHTML = `<span class="fb-tag">${esc(ui('notQuite'))}</span> ${esc(ui('answerColon'))} ${correctTxt}`; }
    if (mjState === 'failed') fb.innerHTML = fallbackStr(fb.innerHTML);
    fbs.push(fb);
  });
  sh.checked = true;
  const score = main.querySelector('.score');
  if (score) score.innerHTML = `<b>${esc(ui('scoreLine', right, sh.items.length))}</b>${blank ? ` · ${esc(ui('unanswered', blank))}` : ''}`;
  fbs.forEach(typeset);
  if (announce) { const first = main.querySelector('.q.is-wrong, .q.is-blank'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

/* ---------------- printing ---------------- */
function toast(msg) { toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { toastEl.hidden = true; }, 8000); }
function doPrint(kind) {
  document.body.dataset.print = kind;
  let framed = false; try { framed = window.self !== window.top; } catch (e) { framed = true; }
  if (framed) toast(ui('printToast'));
  mjChain.then(() => setTimeout(() => { try { window.print(); } catch (e) { /* blocked */ } }, 80));
}
window.addEventListener('afterprint', () => { delete document.body.dataset.print; });

/* ---------------- languages ---------------- */
const LANG_FONTS = { zh: 'Noto+Sans+SC', ja: 'Noto+Sans+JP', ko: 'Noto+Sans+KR', ar: 'Noto+Sans+Arabic', fa: 'Vazirmatn', ru: 'Noto+Sans' };
const HTML_LANG = { zh: 'zh-Hans' };
const packLoads = {};
function loadPack(code) {
  if (code === 'en' || I18N_PACKS[code]) return Promise.resolve(true);
  if (!packLoads[code]) packLoads[code] = new Promise(res => {
    const s = document.createElement('script');
    s.src = `lang/${code}.js`; s.async = true;
    s.onload = () => res(!!I18N_PACKS[code]); s.onerror = () => { delete packLoads[code]; res(false); };
    document.head.appendChild(s);
  });
  return packLoads[code];
}
function applyChrome() {
  const code = I18N.lang, root = document.documentElement;
  root.lang = HTML_LANG[code] || code; root.dir = I18N.conf.dir;
  if (LANG_FONTS[code]) {
    let l = $('#lang-font'); if (!l) { l = document.createElement('link'); l.id = 'lang-font'; l.rel = 'stylesheet'; document.head.appendChild(l); }
    const href = `https://fonts.googleapis.com/css2?family=${LANG_FONTS[code]}:wght@400;700;800&display=swap`;
    if (l.href !== href) l.href = href;
  }
  $('#menu-btn').setAttribute('aria-label', ui('showTopics'));
  $('#brand-tag').textContent = ui('brandTag');
  $('label[for="topic-search"]').textContent = ui('searchLabel');
  $('#lang-label').textContent = ui('language');
  updateThemeBtn();
  $('#lang-code').textContent = code.toUpperCase();
  langSel.value = code;
  updatePrintStyle();
}
async function changeLang(code, persist = true) {
  const ok = await loadPack(code);
  if (!ok) { toast(ui('langFail')); code = 'en'; }
  setLang(code);
  if (persist) store.set('lang', code);
  applyChrome();
  sheets.forEach((sh, id) => {   // same seed -> same numbers, now worded in the new language
    const fresh = makeSheet(TOPICS.get(id), sh.n, sh.mode, sh.seed);
    fresh.answers = sh.answers; fresh.checked = sh.checked; fresh.keyOpen = sh.keyOpen;
    sheets.set(id, fresh);
  });
  renderNav();
  if (current.view === 'home' && $('#sample')) { route(true); renderSample(false); } else route(true);
}
langSel.innerHTML = LANGS.map(([c, n]) => `<option value="${c}" lang="${HTML_LANG[c] || c}">${n}</option>`).join('');
langSel.addEventListener('change', () => changeLang(langSel.value));
function initialLang() {
  const codes = LANGS.map(l => l[0]);
  let q = null; try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { /* no query */ }
  if (q && codes.includes(q)) return q;
  const saved = store.get('lang', null); if (saved && codes.includes(saved)) return saved;
  for (const l of navigator.languages || [navigator.language || 'en']) {
    const base = String(l).toLowerCase().split('-')[0].replace(/^in$/, 'id');
    if (codes.includes(base)) return base;
  }
  return 'en';
}

/* ---------------- events ---------------- */
main.addEventListener('toggle', e => { if (e.target.classList && e.target.classList.contains('rungs')) store.set('ladderOpen', e.target.open); }, true);
main.addEventListener('click', e => {
  const btn = e.target.closest('[data-act], .seg-btn'); if (!btn) return;
  const t = current.view === 'topic' ? TOPICS.get(current.id) : null;
  if (btn.classList.contains('seg-btn')) { settings.n = +btn.dataset.n; store.set('n', settings.n); renderPractice(t, true); return; }
  switch (btn.dataset.act) {
    case 'new': renderPractice(t, true); break;
    case 'check': checkSheet(true); break;
    case 'clear': { const sh = currentSheet(); sh.answers = {}; sh.checked = false; renderPractice(t); break; }
    case 'toggle-key': {
      const sh = currentSheet(); sh.keyOpen = !sh.keyOpen;
      $('#key-body').classList.toggle('collapsed', !sh.keyOpen);
      btn.setAttribute('aria-expanded', String(sh.keyOpen));
      btn.querySelector('span').textContent = ui(sh.keyOpen ? 'hideKey' : 'showKey');
      if (sh.keyOpen) $('#key-body').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      break;
    }
    case 'print-q': doPrint('questions'); break;
    case 'print-key': doPrint('key'); break;
    case 'print-both': doPrint('both'); break;
    case 'print-lesson': doPrint('lesson'); break;
    case 'sample-new': renderSample(); break;
    case 'sample-reveal': { const open = btn.getAttribute('aria-expanded') !== 'true'; btn.setAttribute('aria-expanded', String(open)); btn.textContent = ui(open ? 'hideAnswer' : 'showAnswer'); $('#sample-ans').classList.toggle('collapsed', !open); break; }
  }
});
main.addEventListener('change', e => {
  const el = e.target, t = current.view === 'topic' ? TOPICS.get(current.id) : null;
  if (el.id === 'mode-select') { settings.mode = el.value; store.set('mode', settings.mode); renderPractice(t, true); return; }
  if (el.type === 'radio') {
    const sh = currentSheet(), i = +el.dataset.i; sh.answers[i] = +el.value;
    el.closest('.choices').querySelectorAll('.choice').forEach(c => c.classList.toggle('sel', c.contains(el)));
  }
});
main.addEventListener('input', e => { const el = e.target; if (el.matches('.fill input')) { const sh = currentSheet(); sh.answers[+el.dataset.i] = el.value; } });
main.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('.fill input')) { const all = [...main.querySelectorAll('.q input[type="text"]')], k = all.indexOf(e.target); if (all[k + 1]) all[k + 1].focus(); } });

/* ---------------- boot ---------------- */
window.__mathLadder = { finalize, checkFill, canFill, TOPICS, changeLang, UI_EN };   // hook for self-tests
const startLang = initialLang();
if (startLang === 'en') { setLang('en'); applyChrome(); renderNav(); route(); }
else changeLang(startLang, false);
})();
