/* ==========================================================================
   Interactive figures: sliders that redraw a figure while you move them.
   A lesson places ${Ix('name', caption)}; app.js calls mountIx() after the
   lesson renders. Each IX entry has ctrls (id, label(), min, max, step,
   value, fmt) and draw(vals) returning { svg, read } (plain text, no TeX,
   so redrawing never waits for MathJax).
   ========================================================================== */
const IX = {};
const Ix = (name, cap) => `<figure class="fig ix" data-ix="${name}"><div class="ix-out"></div><div class="ix-ctrls no-print"></div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
const ixF = (x, d = 1) => F(+(+x).toFixed(d));   // a rounded plain-text number
function mountIx(root) {
  root.querySelectorAll('.ix[data-ix]').forEach(fig => {
    const def = IX[fig.dataset.ix]; if (!def || fig.dataset.mounted) return;
    fig.dataset.mounted = '1';
    const out = fig.querySelector('.ix-out'), box = fig.querySelector('.ix-ctrls'), vals = {};
    const show = c => (c.fmt ? c.fmt(vals[c.id]) : ixF(vals[c.id], 2));
    box.innerHTML = def.ctrls.map(c => { vals[c.id] = c.value; return `<label class="ix-ctrl"><span class="ix-lab">${c.label()}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}" data-k="${c.id}"><output>${show(c)}</output></label>`; }).join('');
    const draw = () => { const r = def.draw(vals); out.innerHTML = r.svg + (r.read ? `<p class="ix-read">${r.read}</p>` : ''); };
    box.addEventListener('input', e => { const k = e.target.dataset.k; if (!k) return; vals[k] = +e.target.value; e.target.nextElementSibling.textContent = show(def.ctrls.find(c => c.id === k)); draw(); });
    draw();
  });
}

/* ---------- titration of 25 mL acid with 0.1 M NaOH ---------- */
IX.titration = {
  ctrls: [
    { id: 'pKa', label: () => T`acid strength pKa (0 = strong acid)`, min: 0, max: 10, step: 0.5, value: 4.5 },
    { id: 'ca', label: () => T`acid concentration (M)`, min: 0.02, max: 0.2, step: 0.02, value: 0.1, fmt: v => ixF(v, 2) },
  ],
  draw({ pKa, ca }) {
    const Ka = pKa === 0 ? null : 10 ** -pKa, cb = 0.1, Va = 25, Veq = ca * Va / cb;
    const pH = v => { const Vt = Va + v, A = ca * Va / Vt, Na = cb * v / Vt; return Ka ? phMix(A, Ka, Na, 0) : phMix(0, 1, Na, A); };
    const marks = [[Veq, pH(Veq), T`equivalence pH ${ixF(pH(Veq))}`, 'start']];
    if (Ka) marks.push([Veq / 2, pH(Veq / 2), T`half-way pH ${ixF(pH(Veq / 2))}`, 'start']);
    return {
      svg: planeSvg({ W: 460, H: 300, x: [0, 50], y: [0, 14], step: [5, 1], tickX: 10, tickY: 2, xl: T`V NaOH (mL)`, yl: 'pH', fns: [{ f: x => pH(x), cls: 'mf-c1', from: 0, to: 50, n: 300 }], segs: [[Veq, 0, Veq, 14, 'mf-thin', true]], pts: marks.map(m => [...m, false, 7, 14]), label: T`Titration curve for the chosen acid, calculated` }),
      read: T`Start pH ${ixF(pH(0))} · equivalence at ${ixF(Veq)} mL, pH ${ixF(pH(Veq))}${Ka ? T` · at half-equivalence pH = pKa = ${ixF(pKa)}` : ''}. ${pH(Veq) > 7.5 ? T`Weak acid: the equivalence point is above 7, so use phenolphthalein.` : T`Strong acid: the equivalence point is at 7.`}`,
    };
  },
};

/* ---------- Maxwell–Boltzmann distribution of molecular energies ---------- */
IX.maxwell = {
  ctrls: [
    { id: 'T', label: () => T`temperature (K)`, min: 200, max: 1000, step: 10, value: 300 },
    { id: 'Ea', label: () => T`activation energy Ea (kJ/mol)`, min: 5, max: 40, step: 1, value: 15 },
  ],
  draw({ T: Tk, Ea }) {
    const R = 0.008314, RT = R * Tk, f = E => 2 / Math.sqrt(Math.PI) * Math.sqrt(E) / RT ** 1.5 * Math.exp(-E / RT) * 100;
    const x = Ea / RT, erfc = z => { const t = 1 / (1 + 0.5 * z), y = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return y; };
    const frac = erfc(Math.sqrt(x)) + 2 * Math.sqrt(x / Math.PI) * Math.exp(-x), ref = E => 2 / Math.sqrt(Math.PI) * Math.sqrt(E) / (R * 300) ** 1.5 * Math.exp(-E / (R * 300)) * 100;
    return {
      svg: planeSvg({ W: 460, H: 300, x: [0, 45], y: [0, 40], step: [5, 10], tickX: 10, tickY: 10, xl: T`E (kJ/mol)`, yl: T`fraction`, fmtY: () => '', shade: [{ f, from: Ea, to: 45, cls: 'mf-f2' }], fns: [{ f: ref, cls: 'mf-c3', dash: true, n: 200 }, { f, cls: 'mf-c1', n: 200 }], segs: [[Ea, 0, Ea, 40, 'mf-c2']], texts: [[Ea + 0.6, 37, 'Eₐ', 'start', 'mf-lab']], label: T`Distribution of molecular energies at the chosen temperature, with the fraction above the activation energy shaded` }),
      read: T`Fraction of molecules with E ≥ Ea: ${frac < 0.001 ? '< 0.1' : ixF(frac * 100, frac < 0.1 ? 2 : 1)}%. Dashed: 300 K. Higher temperature flattens the curve and moves it right, so more molecules can react.`,
    };
  },
};
