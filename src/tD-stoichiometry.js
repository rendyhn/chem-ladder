/* ==========================================================================
   TRACK D — Equations & the Mole
   ========================================================================== */
(() => {
// [reactants, products] as [formula, coefficient]
const EQS = [
  [[['H2', 2], ['O2', 1]], [['H2O', 2]]], [[['N2', 1], ['H2', 3]], [['NH3', 2]]], [[['CH4', 1], ['O2', 2]], [['CO2', 1], ['H2O', 2]]],
  [[['C3H8', 1], ['O2', 5]], [['CO2', 3], ['H2O', 4]]], [[['Fe', 4], ['O2', 3]], [['Fe2O3', 2]]], [[['Al', 4], ['O2', 3]], [['Al2O3', 2]]],
  [[['Mg', 1], ['HCl', 2]], [['MgCl2', 1], ['H2', 1]]], [[['Na', 2], ['H2O', 2]], [['NaOH', 2], ['H2', 1]]], [[['KClO3', 2]], [['KCl', 2], ['O2', 3]]],
  [[['C2H6', 2], ['O2', 7]], [['CO2', 4], ['H2O', 6]]], [[['Fe2O3', 1], ['CO', 3]], [['Fe', 2], ['CO2', 3]]], [[['Al', 2], ['HCl', 6]], [['AlCl3', 2], ['H2', 3]]],
  [[['CaCO3', 1], ['HCl', 2]], [['CaCl2', 1], ['H2O', 1], ['CO2', 1]]], [[['C2H5OH', 1], ['O2', 3]], [['CO2', 2], ['H2O', 3]]], [[['P4', 1], ['O2', 5]], [['P4O10', 1]]],
];
const side = sd => sd.map(([f, c]) => (c > 1 ? c : '') + f).join(' + ');
const eqT = (e, co) => { let k = 0; const c = co || [...e[0], ...e[1]].map(x => x[1]); const s = sd => sd.map(([f]) => { const n = c[k++]; return (n > 1 ? n : '') + f; }).join(' + '); return `\\ce{${s(e[0])} -> ${s(e[1])}}`; };
const balanced = (e, c) => { const cnt = (sd, off) => sd.reduce((acc, [f], i) => { Object.entries(parseFormula(f)).forEach(([el, n]) => { acc[el] = (acc[el] || 0) + n * c[off + i]; }); return acc; }, {}); const L = cnt(e[0], 0), R = cnt(e[1], e[0].length); return Object.keys({ ...L, ...R }).every(el => L[el] === R[el]); };
const coefs = e => [...e[0], ...e[1]].map(x => x[1]);
const mm = f => sig(molarMass(f), 4);
const COMPOUNDS = ['H2O', 'CO2', 'NaCl', 'CaCO3', 'NaOH', 'H2SO4', 'NH3', 'CH4', 'C6H12O6', 'MgO', 'HCl', 'KNO3', 'C2H5OH', 'CuSO4', 'O2', 'N2', 'Fe2O3', 'Na2CO3'];
const NA = 6.02e23;
level({
  id: 'stoichiometry', mark: 'D', name: 'Equations & the Mole', short: 'Mole', band: 'Equations · moles · reacting masses · formulas', color: 'lv4',
  blurb: 'Counting atoms: writing and balancing chemical equations, the mole and molar mass, reacting quantities, limiting reagents, percentage yield, and working out empirical and molecular formulas.',
  topics: [
{
  id: 'chemical-equations', stage: 'jh', title: 'Chemical Equations & Types of Reaction',
  blurb: 'Word and symbol equations, conservation of mass, balancing equations, state symbols, and the main types of reaction: combination, decomposition, displacement, combustion and precipitation.',
  lesson: () => T`
<p>In a chemical reaction atoms are <b>rearranged</b>: bonds break and new bonds form, but no atom is created or destroyed. That is the <b>law of conservation of mass</b> (Lavoisier, 1789): the total mass of the products equals the total mass of the reactants.</p>
${Fig(reactionBoxesSvg([[4, MOL.H2], [2, MOL.O2]], [[4, MOL.H2O]], { names: [T`before: 4 H₂ + 2 O₂`, T`after: 4 H₂O`], label: T`Particle diagram: four hydrogen molecules and two oxygen molecules become four water molecules` }), T`Four $\ce{H2}$ and two $\ce{O2}$ molecules become four $\ce{H2O}$ molecules: 8 H atoms and 4 O atoms on each side. In the smallest whole numbers: $\ce{2H2 + O2 -> 2H2O}$.`)}
${Key(T`<p><b>Balancing an equation:</b> write the correct formulas first and never change them. Then put <b>coefficients</b> (big numbers in front) so every element has the same number of atoms on both sides. Tip: balance elements that appear in only one substance on each side first, and leave $\ce{H2}$, $\ce{O2}$ or a single element to the end.</p>`)}
${Ex(T`<p>Balance $\ce{CH4 + O2 -> CO2 + H2O}$.</p><p>C: 1 = 1 ✓. H: 4 on the left, so $\ce{2H2O}$. O: now $2 + 2 = 4$ on the right, so $\ce{2O2}$: $$\ce{CH4 + 2O2 -> CO2 + 2H2O}$$</p>`)}
${Tbl([T`Element`, T`Left`, T`Right`], [['C', '1', '1'], ['H', '4', '2 × 2 = 4'], ['O', '2 × 2 = 4', '2 + 2 = 4']])}
<p><b>State symbols</b> show the physical state: (s) solid, (l) liquid, (g) gas, (aq) dissolved in water: $\ce{Zn(s) + 2HCl(aq) -> ZnCl2(aq) + H2(g)}$.</p>
<h3>Types of reaction</h3>
${Tbl([T`Type`, T`Pattern`, T`Example`], [[T`combination (synthesis)`, '$\\ce{A + B -> AB}$', '$\\ce{2Mg + O2 -> 2MgO}$'], [T`decomposition`, '$\\ce{AB -> A + B}$', '$\\ce{CaCO3 -> CaO + CO2}$'], [T`single displacement`, '$\\ce{A + BC -> AC + B}$', '$\\ce{Zn + CuSO4 -> ZnSO4 + Cu}$'], [T`double displacement (precipitation)`, '$\\ce{AB + CD -> AD + CB}$', '$\\ce{AgNO3 + NaCl -> AgCl v + NaNO3}$'], [T`combustion`, T`fuel + $\\ce{O2}$ → $\\ce{CO2}$ + $\\ce{H2O}$`, '$\\ce{C3H8 + 5O2 -> 3CO2 + 4H2O}$'], [T`neutralisation`, T`acid + base → salt + water`, '$\\ce{HCl + NaOH -> NaCl + H2O}$']])}
${Tip(T`<p>Signs that a reaction has happened: a colour change, a gas (bubbles), a precipitate (a solid appearing in a solution), or a temperature change.</p>`)}`,
  gens: [
    () => {
      const e = pick(EQS), c = coefs(e), wrong = [];
      for (let t = 0; t < 60 && wrong.length < 3; t++) { const w = [...c], i = randInt(0, w.length - 1); w[i] = Math.max(1, w[i] + pick([-1, 1, 2])); if (!balanced(e, w) && !wrong.some(x => x.join() === w.join())) wrong.push(w); }
      return { q: T`Which equation is correctly balanced?`, a: `$${eqT(e)}$`, w: wrong.map(w => `$${eqT(e, w)}$`), only: 'mc', s: T`Count every element on both sides: $${eqT(e)}$.` };
    },
    () => {
      const e = pick(EQS), all = [...e[0], ...e[1]], i = randInt(0, all.length - 1), [f, n] = all[i];
      const blank = all.map(([g, k], j) => (j === i ? '?\\,' : k > 1 ? k : '') + g), nl = e[0].length;
      return { q: T`Balance the equation: $\ce{${blank.slice(0, nl).join(' + ')} -> ${blank.slice(nl).join(' + ')}}$. What is the coefficient of $\ce{${f}}$?`, a: n, w: [n + 1, n === 1 ? 3 : n - 1, n * 2], s: T`$${eqT(e)}$.` };
    },
    () => {
      const [a, ma, b, mb] = pick([['Mg', 2.4, 'O2', 1.6], ['C', 1.2, 'O2', 3.2], ['H2', 0.4, 'O2', 3.2], ['Fe', 5.6, 'S', 3.2], ['Ca', 4, 'O2', 1.6]]), tot = sig(ma + mb, 3);
      return { q: T`${M(ma)} g of $\ce{${a}}$ reacts completely with ${M(mb)} g of $\ce{${b}}$. What mass of product forms (in g)?`, a: tot, u: 'g', rtol: 0.001, w: [sig(Math.abs(ma - mb), 3), sig(ma * mb, 3), sig(tot / 2, 3)], s: T`Mass is conserved: $${M(ma)} + ${M(mb)} = ${M(tot)}$ g.` };
    },
    () => {
      const [e, t] = pick([['\\ce{2Mg + O2 -> 2MgO}', 0], ['\\ce{N2 + 3H2 -> 2NH3}', 0], ['\\ce{CaCO3 -> CaO + CO2}', 1], ['\\ce{2H2O2 -> 2H2O + O2}', 1], ['\\ce{Zn + CuSO4 -> ZnSO4 + Cu}', 2], ['\\ce{Fe + 2HCl -> FeCl2 + H2}', 2], ['\\ce{AgNO3 + NaCl -> AgCl + NaNO3}', 3], ['\\ce{BaCl2 + Na2SO4 -> BaSO4 + 2NaCl}', 3], ['\\ce{CH4 + 2O2 -> CO2 + 2H2O}', 4], ['\\ce{C2H5OH + 3O2 -> 2CO2 + 3H2O}', 4]]), N = [T`combination`, T`decomposition`, T`single displacement`, T`double displacement`, T`combustion`];
      return { q: T`What type of reaction is $${e}$?`, a: N[t], w: N.filter((_, i) => i !== t).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`<b>${N[t]}</b>.` };
    },
    () => {
      const e = pick(EQS), el = pick(Object.keys(parseFormula(e[0].map(x => x[0]).join('')))), n = e[0].reduce((a, [f, c]) => a + c * (parseFormula(f)[el] || 0), 0);
      return { q: T`How many ${el} atoms are on each side of $${eqT(e)}$?`, a: n, w: [n + 1, n * 2, Math.max(1, n - 1) === n ? n + 2 : Math.max(1, n - 1)], s: T`Multiply the coefficient by the subscript for each substance containing ${el}: <b>${n}</b>.` };
    },
  ],
},
{
  id: 'mole-concept', stage: 'sh', title: 'The Mole & Molar Mass',
  blurb: 'Relative formula mass, the mole and the Avogadro constant, molar mass, and converting between mass, amount, number of particles, gas volume and concentration.',
  lesson: () => T`
<p>Atoms are far too small to count one by one, so chemists count them in huge packets called <b>moles</b>. One mole contains exactly $N_A = 6.022\,140\,76 \times 10^{23}$ particles: the <b>Avogadro constant</b> (defined exactly since 2019). A dozen eggs is 12 eggs; a mole of atoms is $6.02 \times 10^{23}$ atoms.</p>
${Key(T`<p>The <b>relative formula mass</b> $M_r$ is the sum of the relative atomic masses in the formula: $M_r(\ce{H2O}) = 2 \times 1 + 16 = 18$. The <b>molar mass</b> $M$ is the mass of one mole, numerically equal to $M_r$ in g/mol: $M(\ce{H2O}) = 18$ g/mol.</p><p>$$n = \frac{m}{M} \qquad N = n \times N_A$$</p>`)}
${Fig(barChartSvg([{ label: T`carbon`, value: 12 }, { label: T`water`, value: 18 }, { label: T`salt (NaCl)`, value: 58.5 }, { label: T`glucose`, value: 180 }, { label: T`sucrose`, value: 342 }].map((x, i) => ({ ...x, cls: 'g-s' + (i + 1) })), { W: 440, H: 250, yMax: 360, yStep: 60, yl: T`mass of 1 mol (g)`, label: T`Mass of one mole: carbon 12 g, water 18 g, sodium chloride 58.5 g, glucose 180 g, sucrose 342 g` }), T`One mole always has the same number of particles, but its mass depends on the substance: 12 g of carbon and 342 g of table sugar each contain $6.02 \times 10^{23}$ particles.`)}
${Fig(moleMapSvg({ names: [T`amount`, T`mass`, T`particles`, T`gas volume`, T`solution`], label: T`The mole map: amount in moles in the centre, linked to mass by the molar mass, to particles by the Avogadro constant, to gas volume by the molar volume and to solutions by the volume` }), T`The mole map: every calculation goes through moles. $M$ = molar mass, $N_A$ = Avogadro constant, $V_m$ = molar volume of a gas (22.4 L/mol at STP, 0 °C and 1 atm; 24.0 L/mol at 25 °C), $V$ = volume of solution in L.`)}
${Ex(T`<p>How many molecules are in 9.0 g of water?</p><p>$n = \frac{9.0}{18} = 0.50$ mol, $N = 0.50 \times 6.02 \times 10^{23} = 3.01 \times 10^{23}$ molecules.</p>`)}
${Ex(T`<p>What volume does 0.25 mol of $\ce{CO2}$ occupy at STP?</p><p>$V = n \times V_m = 0.25 \times 22.4 = 5.6$ L.</p>`)}
${Tip(T`<p>Always check which particles you are counting: 1 mol of $\ce{H2O}$ contains 1 mol of molecules but 3 mol of atoms (2 mol H + 1 mol O).</p>`)}`,
  gens: [
    () => { const f = pick(COMPOUNDS), m = mm(f); return { q: T`Calculate the relative formula mass $M_r$ of $\ce{${f}}$. (Use H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35.5, K = 39, Ca = 40, Fe = 56, Cu = 63.5)`, a: m, rtol: 0.002, w: [sig(m + 16, 4), sig(m - 1, 4), sig(m * 2, 4)], s: T`$M_r = ${mrWork(f)} = ${M(m)}$.` }; },
    () => { const f = pick(COMPOUNDS), M0 = mm(f), n = pick([0.1, 0.2, 0.25, 0.5, 1.5, 2, 3]), m = sig(n * M0, 3); return chance() ? { q: T`What is the mass of ${M(n)} mol of $\ce{${f}}$ (in g)? ($M = ${M(M0)}$ g/mol)`, a: m, u: 'g', rtol: 0.01, w: [sig(M0 / n, 3), sig(n / M0, 3), M0], s: T`$m = n \times M = ${M(n)} \times ${M(M0)} = ${M(m)}$ g.` } : { q: T`How many moles are in ${M(m)} g of $\ce{${f}}$? ($M = ${M(M0)}$ g/mol)`, a: n, u: 'mol', rtol: 0.01, w: [sig(m * M0, 3), sig(M0 / m, 3), sig(n * 2, 3)], s: T`$n = \frac{m}{M} = \frac{${M(m)}}{${M(M0)}} = ${M(n)}$ mol.` }; },
    () => { const n = pick([0.1, 0.25, 0.5, 2, 3, 0.02]), N = sig(n * NA, 3); return { q: T`How many particles are in ${M(n)} mol? ($N_A = 6.02 \times 10^{23}$)`, a: `$${sciT(N)}$`, w: [`$${sciT(sig(NA / n, 3))}$`, `$${sciT(sig(N * 10, 3))}$`, `$${sciT(sig(N / 10, 3))}$`], only: 'mc', s: T`$N = n \times N_A = ${M(n)} \times 6.02 \times 10^{23} = ${sciT(N)}$.` }; },
    () => { const f = pick(['O2', 'N2', 'CO2', 'H2', 'CH4', 'NH3']), n = pick([0.1, 0.25, 0.5, 2, 1.5]), V = sig(n * 22.4, 3); return chance() ? { q: T`What volume does ${M(n)} mol of $\ce{${f}}$ occupy at STP (in L)? ($V_m = 22.4$ L/mol)`, a: V, u: 'L', rtol: 0.01, w: [sig(22.4 / n, 3), sig(n * 24, 3), sig(V * 2, 3)], s: T`$V = n \times V_m = ${M(n)} \times 22.4 = ${M(V)}$ L.` } : { q: T`How many moles of $\ce{${f}}$ occupy ${M(V)} L at STP? ($V_m = 22.4$ L/mol)`, a: n, u: 'mol', rtol: 0.01, w: [sig(V * 22.4, 3), sig(22.4 / V, 3), sig(n * 2, 3)], s: T`$n = \frac{V}{V_m} = \frac{${M(V)}}{22.4} = ${M(n)}$ mol.` }; },
    () => { const f = pick(['H2O', 'CO2', 'NH3', 'CH4', 'C6H12O6', 'H2SO4']), p = parseFormula(f), at = Object.values(p).reduce((a, b) => a + b, 0), n = pick([1, 2, 0.5, 3]); return { q: T`How many moles of atoms are in ${M(n)} mol of $\ce{${f}}$?`, a: sig(n * at, 3), u: 'mol', w: [n, sig(n * at + 1, 3), at], s: T`Each $\ce{${f}}$ has ${at} atoms: $${M(n)} \times ${at} = ${M(sig(n * at, 3))}$ mol.` }; },
    () => { const f = pick(['H2O', 'CO2', 'NaCl', 'CH4', 'NH3', 'O2']), M0 = mm(f), m = pick([4.5, 9, 18, 36, 1.8, 3.6, 11, 22, 8]), N = sig(m / M0 * NA, 3); return { q: T`How many molecules (formula units) are in ${M(m)} g of $\ce{${f}}$? ($M = ${M(M0)}$ g/mol, $N_A = 6.02 \times 10^{23}$)`, a: `$${sciT(N)}$`, w: [`$${sciT(sig(m * M0 * NA, 3))}$`, `$${sciT(sig(N * 10, 3))}$`, `$${sciT(sig(m * NA, 3))}$`], only: 'mc', s: T`$n = \frac{${M(m)}}{${M(M0)}} = ${M(sig(m / M0, 3))}$ mol; $N = n \times N_A = ${sciT(N)}$.` }; },
  ],
},
{
  id: 'reacting-quantities', stage: 'sh', title: 'Reacting Masses, Limiting Reagent & Yield',
  blurb: 'Using mole ratios from balanced equations to find masses and volumes, the limiting and excess reagent, theoretical, actual and percentage yield, and atom economy.',
  lesson: () => T`
<p>A balanced equation gives the <b>mole ratio</b> of the substances. $\ce{2H2 + O2 -> 2H2O}$ means 2 mol of hydrogen react with 1 mol of oxygen to give 2 mol of water, whatever the amounts.</p>
${Key(T`<p><b>Three steps</b> for any reacting-quantities problem: (1) convert what you know into moles, (2) use the mole ratio from the equation, (3) convert the moles of the unknown into what you are asked for (mass, volume, particles).</p>`)}
${Fig(flowSvg([T`mass of A (g)`, T`÷ M(A) → moles of A`, T`× mole ratio B : A → moles of B`, T`× M(B) → mass of B (g)`], { W: 380, label: T`Steps: mass of A, divide by its molar mass, multiply by the mole ratio, multiply by the molar mass of B` }), T`From the mass of one substance to the mass of another.`)}
${Ex(T`<p>What mass of calcium oxide forms when 50 g of calcium carbonate is heated? $\ce{CaCO3 -> CaO + CO2}$</p><p>$n(\ce{CaCO3}) = \frac{50}{100} = 0.50$ mol; ratio 1 : 1, so $n(\ce{CaO}) = 0.50$ mol; $m = 0.50 \times 56 = 28$ g.</p>`)}
<h3>Limiting reagent</h3>
<p>Reactants are often not mixed in exactly the right ratio. The reactant that runs out first is the <b>limiting reagent</b>: it decides how much product forms. The other one is <b>in excess</b> and some is left over.</p>
${Fig(reactionBoxesSvg([[5, MOL.H2], [2, MOL.O2]], [[4, MOL.H2O], [1, MOL.H2]], { names: [T`before: 5 H₂ + 2 O₂`, T`after: 4 H₂O + 1 H₂ left`], seeds: [3, 11], label: T`Five hydrogen and two oxygen molecules give four water molecules with one hydrogen molecule left over` }), T`2 $\ce{O2}$ can only react with 4 $\ce{H2}$: oxygen is the limiting reagent and one $\ce{H2}$ is left over.`)}
${Key(T`<p>To find the limiting reagent, divide the moles of each reactant by its coefficient: the smallest result is limiting. <b>Percentage yield</b> compares what you actually obtained with the theoretical maximum: $$\text{percentage yield} = \frac{\text{actual yield}}{\text{theoretical yield}} \times 100\%$$ <b>Atom economy</b> measures how much of the reactants ends up in the useful product: $$\text{atom economy} = \frac{M_r \text{ of desired product}}{\text{sum of } M_r \text{ of all products}} \times 100\%$$</p>`)}
${Tip(T`<p>Yields are below 100% because reactions may be reversible, some product is lost while separating and purifying it, and side reactions make other products. A high atom economy means less waste: a key idea of green chemistry.</p>`)}`,
  gens: [
    () => {
      const [e, a, b, ra, rb] = pick([['\\ce{CaCO3 -> CaO + CO2}', 'CaCO3', 'CaO', 1, 1], ['\\ce{2Mg + O2 -> 2MgO}', 'Mg', 'MgO', 2, 2], ['\\ce{2H2 + O2 -> 2H2O}', 'H2', 'H2O', 2, 2], ['\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}', 'Fe2O3', 'Fe', 1, 2], ['\\ce{N2 + 3H2 -> 2NH3}', 'H2', 'NH3', 3, 2], ['\\ce{CH4 + 2O2 -> CO2 + 2H2O}', 'CH4', 'H2O', 1, 2], ['\\ce{2Al + 3Cl2 -> 2AlCl3}', 'Al', 'AlCl3', 2, 2], ['\\ce{Zn + 2HCl -> ZnCl2 + H2}', 'Zn', 'ZnCl2', 1, 1]]);
      const Ma = mm(a), Mb = mm(b), na = pick([0.1, 0.2, 0.5, 1, 2, 0.25]), ma = sig(na * Ma, 3), nb = na * rb / ra, mb = sig(nb * Mb, 3);
      return { q: T`$${e}$. What mass of $\ce{${b}}$ forms from ${M(ma)} g of $\ce{${a}}$? ($M$: ${a} ${M(Ma)}, ${b} ${M(Mb)} g/mol)`, a: mb, u: 'g', rtol: 0.01, w: [sig(na * Mb, 3), sig(ma * Mb / Ma * ra / rb, 3), ma], s: T`$n(\ce{${a}}) = \frac{${M(ma)}}{${M(Ma)}} = ${M(sig(na, 3))}$ mol; ratio ${ra} : ${rb}, so $n(\ce{${b}}) = ${M(sig(nb, 3))}$ mol; $m = ${M(sig(nb, 3))} \times ${M(Mb)} = ${M(mb)}$ g.` };
    },
    () => {
      const [e, A, B, ca, cb] = pick([['\\ce{2H2 + O2 -> 2H2O}', 'H2', 'O2', 2, 1], ['\\ce{N2 + 3H2 -> 2NH3}', 'N2', 'H2', 1, 3], ['\\ce{2Mg + O2 -> 2MgO}', 'Mg', 'O2', 2, 1], ['\\ce{Zn + 2HCl -> ZnCl2 + H2}', 'Zn', 'HCl', 1, 2], ['\\ce{2Al + 3Cl2 -> 2AlCl3}', 'Al', 'Cl2', 2, 3]]);
      const na = pick([1, 2, 3, 4, 5, 6]), nb = pick([1, 2, 3, 4, 5, 6]), lim = na / ca < nb / cb ? A : na / ca > nb / cb ? B : null;
      if (!lim) return { q: T`$${e}$. ${na} mol of $\ce{${A}}$ is mixed with ${nb + 1} mol of $\ce{${B}}$. Which is the limiting reagent?`, a: na / ca < (nb + 1) / cb ? `$\\ce{${A}}$` : `$\\ce{${B}}$`, w: [na / ca < (nb + 1) / cb ? `$\\ce{${B}}$` : `$\\ce{${A}}$`, T`neither`], only: 'mc', s: T`Divide by the coefficients: ${A} $${na}/${ca} = ${M(sig(na / ca, 3))}$, ${B} $${nb + 1}/${cb} = ${M(sig((nb + 1) / cb, 3))}$. The smaller one is limiting.` };
      return { q: T`$${e}$. ${na} mol of $\ce{${A}}$ is mixed with ${nb} mol of $\ce{${B}}$. Which is the limiting reagent?`, a: `$\\ce{${lim}}$`, w: [`$\\ce{${lim === A ? B : A}}$`, T`neither`], only: 'mc', s: T`Divide by the coefficients: ${A} $${na}/${ca} = ${M(sig(na / ca, 3))}$, ${B} $${nb}/${cb} = ${M(sig(nb / cb, 3))}$. The smaller one, $\ce{${lim}}$, is limiting.` };
    },
    () => { const th = pick([20, 25, 40, 50, 12.5, 80]), p = pick([60, 72, 75, 80, 85, 90, 64]), act = sig(th * p / 100, 3); return { q: T`The theoretical yield of a reaction is ${M(th)} g, but only ${M(act)} g of product is obtained. What is the percentage yield?`, a: p, u: '%', rtol: 0.01, w: [sig(100 - p, 3), sig(th / act * 100, 3), sig(act, 3)], s: T`$\frac{${M(act)}}{${M(th)}} \times 100\% = ${M(p)}\%$.` }; },
    () => { const [e, want, all, name] = pick([['\\ce{CaCO3 -> CaO + CO2}', 'CaO', ['CaO', 'CO2'], T`calcium oxide`], ['\\ce{C6H12O6 -> 2C2H5OH + 2CO2}', 'C2H5OH', ['C2H5OH', 'C2H5OH', 'CO2', 'CO2'], T`ethanol`], ['\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}', 'Fe', ['Fe', 'Fe', 'CO2', 'CO2', 'CO2'], T`iron`], ['\\ce{N2 + 3H2 -> 2NH3}', 'NH3', ['NH3', 'NH3'], T`ammonia`]]); const top = all.filter(x => x === want).reduce((a, f) => a + mm(f), 0), tot = all.reduce((a, f) => a + mm(f), 0), ae = sig(top / tot * 100, 3); return { q: T`$${e}$. What is the atom economy for making ${name}? (Use H = 1, C = 12, N = 14, O = 16, Ca = 40, Fe = 56)`, a: ae, u: '%', rtol: 0.01, w: [100 === ae ? 50 : 100, sig(100 - ae, 3), sig(mm(want) / tot * 100, 3)].filter(x => x !== ae), s: T`$\frac{${M(sig(top, 4))}}{${M(sig(tot, 4))}} \times 100\% = ${M(ae)}\%$.` }; },
    () => { const n = pick([0.1, 0.2, 0.5, 1]), V = sig(n * 22.4, 3); const [e, a, g, ra, rg] = pick([['\\ce{Zn + 2HCl -> ZnCl2 + H2}', 'Zn', 'H2', 1, 1], ['\\ce{CaCO3 -> CaO + CO2}', 'CaCO3', 'CO2', 1, 1], ['\\ce{2KClO3 -> 2KCl + 3O2}', 'KClO3', 'O2', 2, 3], ['\\ce{2Na + 2H2O -> 2NaOH + H2}', 'Na', 'H2', 2, 1]]); const Ma = mm(a), m = sig(n * Ma, 3), vg = sig(n * rg / ra * 22.4, 3); return { q: T`$${e}$. What volume of $\ce{${g}}$ (in L at STP) forms from ${M(m)} g of $\ce{${a}}$? ($M = ${M(Ma)}$ g/mol, $V_m = 22.4$ L/mol)`, a: vg, u: 'L', rtol: 0.01, w: [sig(n * 22.4 * ra / rg, 3) === vg ? sig(vg * 2, 3) : sig(n * 22.4 * ra / rg, 3), sig(m * 22.4, 3), sig(vg / 2, 3)], s: T`$n(\ce{${a}}) = ${M(n)}$ mol; ratio ${ra} : ${rg} gives $${M(sig(n * rg / ra, 3))}$ mol of gas; $V = ${M(sig(n * rg / ra, 3))} \times 22.4 = ${M(vg)}$ L.` }; },
  ],
},
{
  id: 'empirical-formula', stage: 'sh', title: 'Percentage Composition & Empirical Formulas',
  blurb: 'Percentage by mass of an element in a compound, finding the empirical formula from masses or percentages, the molecular formula from the molar mass, and water of crystallisation.',
  lesson: () => T`
<p>The <b>percentage by mass</b> of an element in a compound is $$\%\,\text{element} = \frac{\text{number of atoms} \times A_r}{M_r} \times 100\%$$</p>
${Fig(donutSvg([{ label: T`carbon`, value: 40.0, show: '40.0%' }, { label: T`hydrogen`, value: 6.7, show: '6.7%' }, { label: T`oxygen`, value: 53.3, show: '53.3%' }], { center: 'C₆H₁₂O₆', label: T`Percentage composition by mass of glucose: carbon 40.0 percent, hydrogen 6.7 percent, oxygen 53.3 percent` }), T`Glucose $\ce{C6H12O6}$ ($M_r = 180$): carbon $\frac{72}{180} = 40.0\%$, hydrogen $\frac{12}{180} = 6.7\%$, oxygen $\frac{96}{180} = 53.3\%$.`)}
${Key(T`<p>The <b>empirical formula</b> is the simplest whole-number ratio of atoms; the <b>molecular formula</b> is the actual number of atoms in a molecule. Glucose: molecular $\ce{C6H12O6}$, empirical $\ce{CH2O}$. The molecular formula is a whole-number multiple of the empirical one: $$n = \frac{M_r(\text{molecular})}{M_r(\text{empirical})}$$</p>`)}
${Ex(T`<p>A compound contains 85.7% carbon and 14.3% hydrogen, and $M_r = 56$. Find its formulas.</p>`)}
${Tbl([T`Step`, 'C', 'H'], [[T`mass in 100 g`, '85.7 g', '14.3 g'], [T`÷ $A_r$ → moles`, '$\\frac{85.7}{12} = 7.14$', '$\\frac{14.3}{1} = 14.3$'], [T`÷ smallest → ratio`, '1', '2.00'], [T`empirical formula`, '$\\ce{CH2}$', ''], [T`$n = \\frac{56}{14} = 4$`, T`molecular formula $\\ce{C4H8}$`, '']])}
${Tip(T`<p>If a ratio ends in about .5, .33 or .25, multiply all of them by 2, 3 or 4 to reach whole numbers: 1 : 1.5 becomes 2 : 3. Hydrated salts are handled the same way: find the mole ratio of anhydrous salt to water, e.g. $\ce{CuSO4.5H2O}$.</p>`)}`,
  gens: [
    () => { const f = pick(['H2O', 'CO2', 'NH3', 'CH4', 'MgO', 'CaCO3', 'NaCl', 'Fe2O3', 'H2SO4', 'C2H5OH', 'NaOH']), p = parseFormula(f), el = pick(Object.keys(p)), pc = sig(p[el] * ARS[el] / molarMass(f) * 100, 3); return { q: T`What is the percentage by mass of ${el} in $\ce{${f}}$? (Use H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35.5, Ca = 40, Fe = 56)`, a: pc, u: '%', rtol: 0.01, w: [sig(ARS[el] / molarMass(f) * 100, 3) === pc ? sig(100 - pc, 3) : sig(ARS[el] / molarMass(f) * 100, 3), sig(p[el] / Object.values(p).reduce((a, b) => a + b, 0) * 100, 3), sig(100 - pc, 3)].filter((x, i, arr) => x !== pc && arr.indexOf(x) === i), s: T`$\frac{${p[el] > 1 ? p[el] + ' \\times ' : ''}${M(ARS[el])}}{${M(mm(f))}} \times 100\% = ${M(pc)}\%$.` }; },
    () => { const [emp, pcs] = pick([['CH2', [['C', 85.7], ['H', 14.3]]], ['CH4', [['C', 75], ['H', 25]]], ['NO2', [['N', 30.4], ['O', 69.6]]], ['Fe2O3', [['Fe', 70], ['O', 30]]], ['CH2O', [['C', 40], ['H', 6.7], ['O', 53.3]]], ['Na2SO4', [['Na', 32.4], ['S', 22.5], ['O', 45.1]]], ['C2H6O', [['C', 52.2], ['H', 13], ['O', 34.8]]], ['P2O5', [['P', 43.7], ['O', 56.3]]], ['MgO', [['Mg', 60], ['O', 40]]]]);
      const others = ['CH3', 'CH', 'NO', 'N2O', 'FeO', 'Fe3O4', 'C2H4O', 'NaSO4', 'CHO', 'PO2', 'Mg2O', 'C2H2', 'CO', 'CH2O2'].filter(x => x !== emp).sort(() => rng() - 0.5).slice(0, 3);
      return { q: T`A compound contains ${pcs.map(([e, v]) => `${M(v)}% ${e}`).join(', ')} by mass. What is its empirical formula?`, a: `$\\ce{${emp}}$`, w: others.map(x => `$\\ce{${x}}$`), only: 'mc', s: T`Moles in 100 g: ${pcs.map(([e, v]) => `${e} $\\frac{${M(v)}}{${M(ARS[e])}} = ${M(sig(v / ARS[e], 3))}$`).join(', ')}. Divide by the smallest (and scale to whole numbers): $\ce{${emp}}$.` }; },
    () => { const [emp, mol] = pick([['CH2O', 'C6H12O6'], ['CH2', 'C4H8'], ['CH', 'C6H6'], ['NO2', 'N2O4'], ['CH2', 'C3H6'], ['C2H5', 'C4H10'], ['HO', 'H2O2'], ['P2O5', 'P4O10'], ['CH3', 'C2H6']]), me = mm(emp), mr = mm(mol), n = Math.round(mr / me); return { q: T`A compound has empirical formula $\ce{${emp}}$ and $M_r = ${M(mr)}$. What is its molecular formula? (H = 1, C = 12, N = 14, O = 16, P = 31)`, a: `$\\ce{${mol}}$`, w: [`$\\ce{${emp}}$`, ...[n + 1, n > 2 ? n - 1 : n + 2].map(k => `$\\ce{${emp.replace(/([A-Z][a-z]?)(\d*)/g, (_, e, c) => e + (c ? +c * k : k))}}$`)], only: 'mc', s: T`$M_r(\ce{${emp}}) = ${M(me)}$; $n = \frac{${M(mr)}}{${M(me)}} = ${n}$, so $\ce{${mol}}$.` }; },
    () => { const [salt, x, ms] = pick([['CuSO4', 5, 159.5], ['MgSO4', 7, 120], ['Na2CO3', 10, 106], ['CaCl2', 2, 111], ['BaCl2', 2, 208]]), n = pick([0.02, 0.05, 0.1]), mA = sig(n * ms, 3), mW = sig(n * x * 18, 3); return { q: T`Heating ${M(sig(mA + mW, 3))} g of hydrated $\ce{${salt}.$x$H2O}$ leaves ${M(mA)} g of anhydrous $\ce{${salt}}$ ($M = ${M(ms)}$ g/mol). Find $x$. ($M(\ce{H2O}) = 18$ g/mol)`, a: x, w: [x + 1, x - 1, x * 2], s: T`Water lost $= ${M(mW)}$ g $= ${M(sig(mW / 18, 3))}$ mol; salt $= \frac{${M(mA)}}{${M(ms)}} = ${M(n)}$ mol; $x = \frac{${M(sig(mW / 18, 3))}}{${M(n)}} = ${x}$.` }; },
  ],
},
  ],
});
})();
