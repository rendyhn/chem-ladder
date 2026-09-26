/* ==========================================================================
   TRACK C — Chemical Bonding & Structure
   ========================================================================== */
(() => {
const CATIONS = [['Na', 1], ['K', 1], ['Li', 1], ['Ag', 1], ['Mg', 2], ['Ca', 2], ['Ba', 2], ['Zn', 2], ['Cu', 2], ['Fe', 3], ['Al', 3]];
const ANIONS = [['Cl', 1, 'chloride'], ['Br', 1, 'bromide'], ['I', 1, 'iodide'], ['F', 1, 'fluoride'], ['O', 2, 'oxide'], ['S', 2, 'sulfide'], ['N', 3, 'nitride'], ['OH', 1, 'hydroxide'], ['NO3', 1, 'nitrate'], ['SO4', 2, 'sulfate'], ['CO3', 2, 'carbonate'], ['PO4', 3, 'phosphate']];
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const ionicFormula = (c, qc, an, qa) => { const g = gcd(qc, qa), nc = qa / g, na = qc / g, poly = an.length > 2 || /\d/.test(an) || an === 'OH'; return c + (nc > 1 ? nc : '') + (na > 1 ? (poly ? `(${an})${na}` : an + na) : an); };
const anName = n => ({ chloride: T`chloride`, bromide: T`bromide`, iodide: T`iodide`, fluoride: T`fluoride`, oxide: T`oxide`, sulfide: T`sulfide`, nitride: T`nitride`, hydroxide: T`hydroxide`, nitrate: T`nitrate`, sulfate: T`sulfate`, carbonate: T`carbonate`, phosphate: T`phosphate` })[n];
// VSEPR: formula, bonding pairs, lone pairs on the centre, shape, angle, polar?
const VSEPR = [['CO2', 2, 0, 'linear', '180°', false], ['BeCl2', 2, 0, 'linear', '180°', false], ['BF3', 3, 0, 'trigonal planar', '120°', false], ['CH4', 4, 0, 'tetrahedral', '109.5°', false], ['CCl4', 4, 0, 'tetrahedral', '109.5°', false], ['NH3', 3, 1, 'trigonal pyramidal', '107°', true], ['H2O', 2, 2, 'bent', '104.5°', true], ['H2S', 2, 2, 'bent', '92°', true], ['PCl5', 5, 0, 'trigonal bipyramidal', '90° and 120°', false], ['SF6', 6, 0, 'octahedral', '90°', false], ['CHCl3', 4, 0, 'tetrahedral', '109.5°', true]];
const shapeName = k => ({ linear: T`linear`, 'trigonal planar': T`trigonal planar`, tetrahedral: T`tetrahedral`, 'trigonal pyramidal': T`trigonal pyramidal`, bent: T`bent`, 'trigonal bipyramidal': T`trigonal bipyramidal`, octahedral: T`octahedral` })[k];
level({
  id: 'bonding', mark: 'C', name: 'Chemical Bonding & Structure', short: 'Bonding', band: 'Ionic · covalent · metallic · shapes · forces', color: 'lv3',
  blurb: 'Why atoms join: ionic, covalent and metallic bonds, Lewis structures, the shapes of molecules and their polarity, and the forces between molecules that decide melting and boiling points.',
  topics: [
{
  id: 'ionic-bonding', stage: 'jh', title: 'Ionic Bonding & Ionic Compounds',
  blurb: 'Stable electron arrangements, electron transfer from metals to non-metals, dot-and-cross diagrams, ionic lattices, writing formulas and naming ionic compounds, and their properties.',
  lesson: () => T`
<p>The noble gases hardly react because their outer shell is full (8 electrons, or 2 for helium). Other atoms can reach a full outer shell, the <b>octet</b>, by losing, gaining or sharing electrons: this is what makes atoms bond.</p>
<p>A metal atom with 1–3 outer electrons loses them easily; a non-metal atom with 5–7 outer electrons gains electrons easily. When they meet, electrons are <b>transferred</b> from the metal to the non-metal, and the oppositely charged ions attract each other. This electrostatic attraction is the <b>ionic bond</b>.</p>
${Fig(ionicTransferSvg('Na', 'Cl', { label: T`Dot-and-cross diagram: sodium gives its one outer electron to chlorine, forming Na plus and Cl minus ions` }), T`Sodium (crosses) gives its single outer electron to chlorine (dots): $\ce{Na+}$ and $\ce{Cl-}$ both end up with a full outer shell. (Only the outer shells are drawn.)`)}
${Fig(ionicTransferSvg('Mg', 'Cl', { nmCount: 2, label: T`Magnesium gives one electron to each of two chlorine atoms, forming Mg two plus and two Cl minus ions` }), T`Magnesium has two outer electrons, so it needs two chlorine atoms: $\ce{MgCl2}$.`)}
<h3>Ionic lattices</h3>
<p>Ionic compounds do not form separate molecules. Each ion is surrounded by ions of opposite charge, repeated in all directions to make a <b>giant ionic lattice</b>. The formula only gives the <i>ratio</i> of ions.</p>
${Fig(latticeSvg({ label: T`Part of the sodium chloride lattice: small sodium ions and large chloride ions alternate in a cube` }), T`Part of the sodium chloride lattice: every $\ce{Na+}$ is surrounded by 6 $\ce{Cl-}$ and every $\ce{Cl-}$ by 6 $\ce{Na+}$.`)}
${Key(T`<p><b>Writing formulas:</b> the total positive charge must equal the total negative charge. Swap the charge numbers (the "criss-cross" rule) and simplify: $\ce{Al^3+}$ and $\ce{O^2-}$ give $\ce{Al2O3}$; $\ce{Ca^2+}$ and $\ce{NO3-}$ give $\ce{Ca(NO3)2}$ (brackets around a polyatomic ion taken more than once).</p><p><b>Naming:</b> metal first, then the non-metal ending in <i>-ide</i>: sodium chloride, magnesium oxide. Ions with oxygen keep their own names: sulfate $\ce{SO4^2-}$, nitrate $\ce{NO3-}$, carbonate $\ce{CO3^2-}$, hydroxide $\ce{OH-}$, phosphate $\ce{PO4^3-}$, ammonium $\ce{NH4+}$.</p>`)}
${Tbl([T`Property of ionic compounds`, T`Reason`], [[T`high melting and boiling points`, T`many strong attractions between ions must be overcome`], [T`conduct electricity when molten or dissolved, not when solid`, T`the ions must be free to move`], [T`often soluble in water`, T`water molecules attract and surround the ions`], [T`hard but brittle`, T`a shift in the lattice brings like charges together, which repel`]])}
${Tip(T`<p>Transition metals can form more than one ion; the charge is written in Roman numerals: iron(II) chloride $\ce{FeCl2}$, iron(III) chloride $\ce{FeCl3}$.</p>`)}`,
  gens: [
    () => {
      const [c, qc] = pick(CATIONS), [an, qa, nm] = pick(ANIONS), f = ionicFormula(c, qc, an, qa);
      const wr = [ionicFormula(c, qa, an, qc), c + an, ionicFormula(c, qc === 1 ? 2 : 1, an, qa)].filter(x => x !== f);
      return { q: T`What is the formula of the compound of $\ce{${c}${qc > 1 ? '^' + qc + '+' : '+'}}$ and $\ce{${an}${qa > 1 ? '^' + qa + '-' : '-'}}$?`, a: `$\\ce{${f}}$`, w: [...new Set(wr)].map(x => `$\\ce{${x}}$`), only: 'mc', s: T`Balance the charges: $${qa / gcd(qc, qa)} \times (+${qc}) = ${qc / gcd(qc, qa)} \times (−${qa})$, so $\ce{${f}}$.` };
    },
    () => {
      const [c, qc] = pick(CATIONS.filter(x => ['Na', 'K', 'Mg', 'Ca', 'Al', 'Li', 'Ba', 'Zn'].includes(x[0]))), [an, qa, nm] = pick(ANIONS), f = ionicFormula(c, qc, an, qa);
      const nmT = `${elName(c)} ${anName(nm)}`;
      return { q: T`What is the name of $\ce{${f}}$?`, a: nmT, w: [`${elName(c)} ${anName(pick(ANIONS.filter(x => x[2] !== nm))[2])}`, `${elName(pick(CATIONS.filter(x => x[0] !== c && elName(x[0]) !== x[0]))[0])} ${anName(nm)}`, `${anName(nm)} ${elName(c)}`], only: 'mc', s: T`Metal first, then the negative ion: <b>${nmT}</b>.` };
    },
    () => {
      const Z = pick([3, 11, 12, 13, 19, 20, 7, 8, 9, 16, 17, 35]), v = valenceOf(Z), q = v <= 3 ? v : v - 8;
      return { q: T`What is the charge on the ion formed by ${elName(SYMBOLS[Z - 1])}?`, a: q > 0 ? `+${q}` : `−${-q}`, w: [q > 0 ? `−${8 - q}` : `+${8 + q}`, q > 0 ? `+${q + 1}` : `−${-q + 1}`, q > 0 ? (q === 1 ? '+2' : '+1') : (q === -1 ? '−2' : '−1')], only: 'mc', s: v <= 3 ? T`It has ${v} outer electron${v > 1 ? 's' : ''} and loses ${v > 1 ? 'them' : 'it'}: charge <b>+${v}</b>.` : T`It has ${v} outer electrons and gains ${8 - v}: charge <b>−${8 - v}</b>.` };
    },
    () => {
      const [c, qc] = pick(CATIONS.slice(0, 9)), [an, qa] = pick(ANIONS.slice(0, 6)), f = ionicFormula(c, qc, an, qa), p = parseFormula(f), n = Object.values(p).reduce((a, b) => a + b, 0);
      return { q: T`How many ions are there in one formula unit of $\ce{${f}}$?`, a: n, w: [n + 1, Math.max(1, n - 1) === n ? n + 2 : Math.max(1, n - 1), qc + qa].filter((x, i, arr) => x !== n && arr.indexOf(x) === i), s: T`$\ce{${f}}$: ${p[c]} ${elName(c)} ion${p[c] > 1 ? 's' : ''} and ${p[an]} ${an} ion${p[an] > 1 ? 's' : ''}, ${n} in total.` };
    },
    () => pick([
      { q: T`Why does solid sodium chloride not conduct electricity, while molten sodium chloride does?`, a: T`In the solid the ions cannot move; when molten they can`, w: [T`The solid has no ions`, T`Molten NaCl contains free electrons`, T`The solid is a covalent molecule`], only: 'mc', s: T`Current is carried by moving charged particles: here, ions.` },
      { q: T`What holds the ions together in an ionic lattice?`, a: T`Electrostatic attraction between oppositely charged ions`, w: [T`Shared pairs of electrons`, T`A sea of delocalised electrons`, T`Weak forces between molecules`], only: 'mc', s: T`That is the ionic bond.` },
      { q: T`Why do ionic compounds have high melting points?`, a: T`Many strong attractions between ions must be broken`, w: [T`Their molecules are very heavy`, T`They contain metals`, T`Their electrons are delocalised`], only: 'mc', s: T`The giant lattice holds strong ionic bonds in every direction.` },
    ]),
  ],
},
{
  id: 'covalent-bonding', stage: 'sh', title: 'Covalent Bonding & Lewis Structures',
  blurb: 'Shared electron pairs, dot-and-cross diagrams, single, double and triple bonds, Lewis structures and lone pairs, coordinate bonds, electronegativity and bond polarity.',
  lesson: () => T`
<p>Two non-metal atoms both want to gain electrons, so neither gives electrons away. Instead they <b>share</b> a pair of electrons, one from each atom. A shared pair is a <b>covalent bond</b>; it holds the two nuclei together because both attract the shared electrons.</p>
${FigRow([[dotCrossSvg([['Cl', 0, 0, 'dot', 7], ['Cl', 1, 0, 'x', 7]], [[0, 1, 1]], { label: T`Dot-and-cross diagram of chlorine` }), T`$\ce{Cl2}$: one shared pair`], [dotCrossSvg([['O', 0.7, 0, 'dot', 6], ['H', 0, 0.75, 'x', 1], ['H', 1.4, 0.75, 'x', 1]], [[0, 1, 1], [0, 2, 1]], { label: T`Dot-and-cross diagram of water` }), T`$\ce{H2O}$: two bonds, two lone pairs`], [dotCrossSvg([['O', 0, 0, 'dot', 6], ['C', 1, 0, 'x', 4], ['O', 2, 0, 'dot', 6]], [[0, 1, 2], [1, 2, 2]], { label: T`Dot-and-cross diagram of carbon dioxide` }), T`$\ce{CO2}$: two double bonds`]], T`Dot-and-cross diagrams: the overlapping circles are outer shells, and the electrons in the overlap are shared. Count the electrons around each atom: 8 (or 2 for hydrogen).`)}
${Key(T`<p>One shared pair is a <b>single bond</b> (C–H), two pairs a <b>double bond</b> (O=C=O), three pairs a <b>triple bond</b> (N≡N). Pairs of outer electrons that are not shared are called <b>lone pairs</b>. More shared pairs make a bond shorter and stronger.</p>`)}
<h3>Lewis structures</h3>
<p>A <b>Lewis structure</b> draws each shared pair as a line and each lone pair as two dots. To draw one: (1) add up all the valence electrons, (2) join the atoms with single bonds (the least electronegative atom usually in the middle, hydrogen always at the edge), (3) complete the octets of the outer atoms with lone pairs, (4) put leftover electrons on the central atom, and (5) if the centre still lacks an octet, turn lone pairs into double or triple bonds.</p>
${FigRow([[molSvg([['N', 0, 0], ['N', 1.2, 0]], [[0, 1, 3]], { lp: [[0, 180], [1, 0]], label: T`Lewis structure of nitrogen, N triple bond N with a lone pair on each atom` }), T`$\ce{N2}$: 10 valence electrons`], [molSvg([['N', 0, 0], ['H', -0.9, 0.7], ['H', 0.9, 0.7], ['H', 0, 1.15]], [[0, 1], [0, 2], [0, 3]], { lp: [[0, 90]], label: T`Lewis structure of ammonia with one lone pair on nitrogen` }), T`$\ce{NH3}$: 8 valence electrons`], [molSvg([['H', 0, 0], ['C', 1, 0], ['N', 2.1, 0]], [[0, 1], [1, 2, 3]], { lp: [[2, 0]], label: T`Lewis structure of hydrogen cyanide, H–C triple bond N` }), T`$\ce{HCN}$: 10 valence electrons`]], T`Lewis structures: lines are shared pairs, dot pairs are lone pairs.`)}
${Key(T`<p>In a <b>coordinate (dative) bond</b> both shared electrons come from the same atom. Example: $\ce{NH3 + H+ -> NH4+}$: the lone pair on nitrogen bonds to $\ce{H+}$. Once formed, it is identical to the other N–H bonds.</p>`)}
<h3>Bond polarity</h3>
<p><b>Electronegativity</b> is the power of an atom to attract the shared electrons. When two different atoms share electrons, the more electronegative one pulls them closer and gets a small negative charge $\delta-$, the other $\delta+$: the bond is <b>polar</b>.</p>
${Fig(bondSpectrumSvg({ names: [T`non-polar`, T`polar covalent`, T`ionic`, T`electronegativity difference (Pauling scale)`], mark: [[0, 'H–H'], [0.96, 'H–Cl'], [1.24, 'O–H'], [2.23, 'Na–Cl']], label: T`A scale of electronegativity difference from non-polar covalent through polar covalent to ionic` }), T`The larger the electronegativity difference, the more polar the bond. Above about 1.8 the bond is mostly ionic. Values: H 2.20, Cl 3.16, O 3.44, Na 0.93.`)}
${Tip(T`<p>The boundaries are not sharp: bonding goes gradually from pure covalent to ionic. Use the difference as a guide, not a law.</p>`)}`,
  gens: [
    () => {
      const [f, v] = pick([['CH4', 8], ['NH3', 8], ['H2O', 8], ['CO2', 16], ['HCN', 10], ['N2', 10], ['CCl4', 32], ['PCl3', 26], ['O2', 12], ['C2H4', 12], ['HCl', 8], ['SO2', 18]]);
      return { q: T`How many valence electrons are there in total in $\ce{${f}}$?`, a: v, w: [v + 2, v - 2, Object.values(parseFormula(f)).reduce((a, b) => a + b, 0) * 2], s: T`Add the valence electrons of all atoms: ${Object.entries(parseFormula(f)).map(([e, n]) => `${n > 1 ? n + ' × ' : ''}${valenceOf(ZOF[e])} (${e})`).join(' + ')} = <b>${v}</b>.` };
    },
    () => {
      const [f, b, l] = pick([['CH4', 4, 0], ['NH3', 3, 1], ['H2O', 2, 2], ['HCl', 1, 3], ['CO2', 4, 4], ['N2', 3, 2], ['HCN', 4, 1], ['C2H4', 6, 0]]), askB = chance();
      return askB ? { q: T`How many shared (bonding) pairs are there in $\ce{${f}}$?`, a: b, w: [b + 1, l, b + l].filter((x, i, arr) => x !== b && arr.indexOf(x) === i), s: T`$\ce{${f}}$ has ${b} bonding pairs and ${l} lone pairs.` }
        : { q: T`How many lone pairs are there in total in $\ce{${f}}$?`, a: l, w: [l + 1, b, l + 2].filter((x, i, arr) => x !== l && arr.indexOf(x) === i), s: T`$\ce{${f}}$ has ${b} bonding pairs and ${l} lone pairs.` };
    },
    () => {
      const [f, t] = pick([['N2', 3], ['O2', 2], ['CO2', 2], ['HCN', 3], ['C2H4', 2], ['C2H2', 3], ['H2', 1], ['Cl2', 1]]), nm = ['', T`single`, T`double`, T`triple`];
      return { q: T`What is the strongest (highest order) bond in $\ce{${f}}$?`, a: nm[t], w: [1, 2, 3].filter(x => x !== t).map(x => nm[x]).concat([T`ionic`]), only: 'mc', s: T`$\ce{${f}}$ contains a <b>${nm[t]}</b> bond.` };
    },
    () => {
      const pairs = [['H', 'Cl'], ['O', 'H'], ['C', 'H'], ['N', 'H'], ['C', 'O'], ['H', 'F'], ['C', 'Cl'], ['Na', 'Cl'], ['Mg', 'O'], ['K', 'F'], ['Cl', 'Cl'], ['C', 'N']], [x, y] = pick(pairs), d = sig(Math.abs(EN[ZOF[x] - 1] - EN[ZOF[y] - 1]), 2), t = d < 0.4 ? T`non-polar covalent` : d < 1.8 ? T`polar covalent` : T`ionic`;
      return { q: T`Electronegativities: ${x} ${M(EN[ZOF[x] - 1])}, ${y} ${M(EN[ZOF[y] - 1])}. What type of bond forms between ${x} and ${y}?`, a: t, w: [T`non-polar covalent`, T`polar covalent`, T`ionic`, T`metallic`].filter(z => z !== t), only: 'mc', s: T`Difference $= ${M(d)}$: ${t} (below 0.4 non-polar, 0.4–1.8 polar, above 1.8 ionic).` };
    },
    () => {
      const [x, y] = pick([['H', 'Cl'], ['O', 'H'], ['N', 'H'], ['C', 'O'], ['H', 'F'], ['C', 'Cl'], ['S', 'O'], ['C', 'F']]), neg = EN[ZOF[x] - 1] > EN[ZOF[y] - 1] ? x : y;
      return { q: T`In the bond ${x}–${y}, which atom carries the partial negative charge $\delta-$?`, a: neg, w: [neg === x ? y : x, T`neither, the bond is non-polar`], only: 'mc', s: T`${neg} is more electronegative (${M(EN[ZOF[neg] - 1])}), so it pulls the shared pair and becomes $\delta-$.` };
    },
    () => pick([
      { q: T`In which species is there a coordinate (dative) bond?`, a: '$\\ce{NH4+}$', w: ['$\\ce{NH3}$', '$\\ce{CH4}$', '$\\ce{H2O}$'], only: 'mc', s: T`In $\ce{NH4+}$ the lone pair of nitrogen is shared with $\ce{H+}$.` },
      { q: T`What is a covalent bond?`, a: T`A shared pair of electrons between two atoms`, w: [T`The attraction between oppositely charged ions`, T`The transfer of electrons from a metal to a non-metal`, T`The attraction between molecules`], only: 'mc', s: T`Both nuclei attract the shared pair.` },
    ]),
  ],
},
{
  id: 'molecular-shapes', stage: 'sh', title: 'Shapes of Molecules (VSEPR) & Polarity',
  blurb: 'Valence shell electron pair repulsion, electron domains and lone pairs, the common molecular shapes and bond angles, and whether a molecule is polar.',
  lesson: () => T`
<p>Electron pairs around a central atom repel each other and spread out as far apart as possible. This is the <b>VSEPR</b> theory (valence shell electron pair repulsion). Count the electron domains around the central atom: every bond (single, double or triple) counts as one domain, and every lone pair counts as one.</p>
${FigRow([['linear', 'C', 'O', T`linear, 180° ($\ce{CO2}$)`], ['trigonal planar', 'B', 'F', T`trigonal planar, 120° ($\ce{BF3}$)`], ['tetrahedral', 'C', 'H', T`tetrahedral, 109.5° ($\ce{CH4}$)`], ['octahedral', 'S', 'F', T`octahedral, 90° ($\ce{SF6}$)`]].map(([k, c, o, t]) => [shapeSvg(k, { centre: c, outer: o, W: 160, H: 160, label: t }), t]), T`Shapes with no lone pairs on the central atom. A wedge points towards you, a dashed bond points away.`)}
${FigRow([['tetrahedral', 'C', 'H', T`$\ce{CH4}$: 4 bonds, 109.5°`], ['trigonal pyramidal', 'N', 'H', T`$\ce{NH3}$: 3 bonds + 1 lone pair, 107°`], ['bent', 'O', 'H', T`$\ce{H2O}$: 2 bonds + 2 lone pairs, 104.5°`]].map(([k, c, o, t]) => [shapeSvg(k, { centre: c, outer: o, W: 160, H: 160, label: t }), t]), T`Four electron domains each time, but lone pairs repel more strongly than bonding pairs, so each lone pair squeezes the bond angle by about 2.5°.`)}
${Tbl([T`Domains`, T`Bonding pairs`, T`Lone pairs`, T`Shape`, T`Angle`, T`Example`], [['2', '2', '0', T`linear`, '180°', '$\\ce{CO2}$, $\\ce{BeCl2}$'], ['3', '3', '0', T`trigonal planar`, '120°', '$\\ce{BF3}$'], ['3', '2', '1', T`bent`, '≈ 118°', '$\\ce{SO2}$'], ['4', '4', '0', T`tetrahedral`, '109.5°', '$\\ce{CH4}$'], ['4', '3', '1', T`trigonal pyramidal`, '107°', '$\\ce{NH3}$'], ['4', '2', '2', T`bent`, '104.5°', '$\\ce{H2O}$'], ['5', '5', '0', T`trigonal bipyramidal`, T`90° and 120°`, '$\\ce{PCl5}$'], ['6', '6', '0', T`octahedral`, '90°', '$\\ce{SF6}$']])}
<h3>Polar and non-polar molecules</h3>
${Key(T`<p>A molecule is <b>polar</b> if it has polar bonds <i>and</i> they do not cancel out. In $\ce{CO2}$ the two C=O dipoles point in opposite directions and cancel: $\ce{CO2}$ is non-polar. In $\ce{H2O}$ the bent shape means they add up: water is polar. Symmetrical shapes with identical outer atoms ($\ce{CH4}$, $\ce{BF3}$, $\ce{CCl4}$, $\ce{SF6}$) are non-polar.</p>`)}
${FigRow([[molSvg([['O', 0, 0], ['C', 1.3, 0], ['O', 2.6, 0]], [[0, 1, 2], [1, 2, 2]], { lp: [[0, 90], [0, 270], [2, 90], [2, 270]], charges: [[0, 'δ−', -8, -20], [1, 'δ+', 0, -14], [2, 'δ−', 8, -20]], pad: 30, label: T`Carbon dioxide: the two dipoles cancel` }), T`$\ce{CO2}$: dipoles cancel, non-polar`], [molSvg([['O', 0, 0], ['H', -0.95, 0.75], ['H', 0.95, 0.75]], [[0, 1], [0, 2]], { lp: [[0, 45], [0, 135]], charges: [[0, 'δ−', 16, 4], [1, 'δ+', -22, -6], [2, 'δ+', 10, -6]], pad: 30, label: T`Water: the two dipoles add up` }), T`$\ce{H2O}$: dipoles add, polar`]], T`Bond polarity plus shape decide whether the whole molecule is polar.`)}
${Tip(T`<p>A polar liquid is attracted to a charged rod: a thin stream of water bends towards a rubbed plastic comb, while a stream of hexane does not.</p>`)}`,
  gens: [
    () => {
      const [f, , , sh] = pick(VSEPR), a = shapeName(sh);
      return { q: T`What is the shape of a $\ce{${f}}$ molecule?`, a, w: ['linear', 'trigonal planar', 'tetrahedral', 'trigonal pyramidal', 'bent', 'octahedral'].filter(k => k !== sh).sort(() => rng() - 0.5).slice(0, 3).map(shapeName), only: 'mc', s: (() => { const v = VSEPR.find(x => x[0] === f); return T`The central atom has ${v[1]} bonding domain${v[1] > 1 ? 's' : ''} and ${v[2]} lone pair${v[2] === 1 ? '' : 's'}: <b>${a}</b>, ${v[4]}.`; })() };
    },
    () => {
      const [f, b, l, sh, ang] = pick(VSEPR.filter(v => !v[4].includes('and') && v[0] !== 'H2S'));
      return { q: T`What is the bond angle in $\ce{${f}}$?`, a: ang, w: ['180°', '120°', '109.5°', '107°', '104.5°', '90°'].filter(x => x !== ang).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`${b} bonding pairs and ${l} lone pairs: ${shapeName(sh)}, <b>${ang}</b>.` };
    },
    () => {
      const [f, , , sh, , pol] = pick(VSEPR);
      return { q: T`Is $\ce{${f}}$ a polar molecule?`, a: pol ? T`yes` : T`no`, w: [pol ? T`no` : T`yes`], only: 'mc', s: pol ? T`It is ${shapeName(sh)}: the bond dipoles do not cancel, so it is <b>polar</b>.` : T`It is ${shapeName(sh)} and symmetrical: the bond dipoles cancel, so it is <b>non-polar</b>.` };
    },
    () => {
      const [f, b, l] = pick(VSEPR), ask = chance();
      return ask ? { q: T`How many lone pairs are on the central atom of $\ce{${f}}$?`, a: l, w: [l + 1, l + 2, b].filter((x, i, arr) => x !== l && arr.indexOf(x) === i), s: T`$\ce{${f}}$: ${b} bonding domains and <b>${l}</b> lone pair${l === 1 ? '' : 's'} on the centre.` }
        : { q: T`How many electron domains surround the central atom of $\ce{${f}}$?`, a: b + l, w: [b, b + l + 1, Math.max(1, b + l - 1)].filter((x, i, arr) => x !== b + l && arr.indexOf(x) === i), s: T`${b} bonding + ${l} lone = <b>${b + l}</b> domains.` };
    },
    () => pick([
      { q: T`Why is the bond angle in water smaller than in methane?`, a: T`Lone pairs repel more strongly than bonding pairs`, w: [T`Oxygen is larger than carbon`, T`Water has double bonds`, T`Hydrogen atoms attract each other`], only: 'mc', s: T`Two lone pairs push the O–H bonds together: 104.5° instead of 109.5°.` },
      { q: T`CO₂ has polar bonds. Why is the molecule non-polar?`, a: T`It is linear, so the two dipoles cancel`, w: [T`Carbon and oxygen have the same electronegativity`, T`It has no lone pairs`, T`It is a gas`], only: 'mc', s: T`Equal dipoles in opposite directions cancel.` },
    ]),
  ],
},
{
  id: 'forces-structures', stage: 'sh', title: 'Intermolecular Forces & Types of Structure',
  blurb: 'Metallic bonding, giant covalent structures (diamond, graphite), simple molecules, London forces, dipole–dipole forces and hydrogen bonds, and how they explain melting and boiling points.',
  lesson: () => T`
<p>Bonds <i>inside</i> a substance are only part of the story. How a substance behaves depends on its <b>structure</b>: what particles it is made of and what holds them together.</p>
${Fig(metallicSvg({ label: T`Metallic bonding: positive metal ions in a sea of delocalised electrons` }), T`<b>Metallic bonding:</b> metal atoms release their outer electrons into a "sea" of delocalised electrons that holds the positive ions together. The free electrons conduct electricity and heat; the layers of ions can slide, so metals bend instead of shattering.`)}
${FigRow([[diamondSvg({ label: T`Diamond: every carbon atom bonded to four others` }), T`diamond`], [graphiteSvg({ label: T`Graphite: layers of hexagons with weak forces between the layers` }), T`graphite`]], T`<b>Giant covalent</b> structures: in diamond each carbon forms 4 strong bonds in three dimensions (very hard, no conduction). In graphite each carbon forms 3 bonds in flat layers; the spare electron is delocalised (conducts), and the layers slide over each other (soft, used in pencils).`)}
<h3>Forces between molecules</h3>
<p>Simple molecular substances ($\ce{H2O}$, $\ce{CO2}$, $\ce{I2}$) have strong covalent bonds inside each molecule but much weaker <b>intermolecular forces</b> between molecules. Melting or boiling breaks only these weak forces, so the melting and boiling points are low.</p>
${Tbl([T`Force`, T`Between`, T`Strength`, T`Example`], [[T`London (dispersion) forces`, T`all molecules: temporary dipoles from moving electrons`, T`weak; grow with the number of electrons`, T`$\\ce{I2}$, $\\ce{CH4}$, noble gases`], [T`dipole–dipole forces`, T`polar molecules with permanent dipoles`, T`moderate`, T`$\\ce{HCl}$, propanone`], [T`hydrogen bonds`, T`H on N, O or F attracted to a lone pair on N, O or F of another molecule`, T`the strongest of the three`, T`$\\ce{H2O}$, $\\ce{NH3}$, $\\ce{HF}$, alcohols`]])}
${Fig(hbondSvg({ label: T`Water molecules joined by hydrogen bonds, shown as dashed lines` }), T`Hydrogen bonds (dashed) between water molecules: each H of one molecule is attracted to a lone pair on the O of another.`)}
${Fig(lineChartSvg([{ pts: [[2, -161.5], [3, -111.9], [4, -88.5], [5, -52]], label: 'CH₄', at: 0, dx: -6, dy: 4 }, { pts: [[2, -33.3], [3, -87.7], [4, -62.5], [5, -17]], label: 'NH₃', at: 0, dx: -6, dy: 4 }, { pts: [[2, 100], [3, -60.3], [4, -41.3], [5, -2.2]], label: 'H₂O', at: 0, dx: -6, dy: 4 }, { pts: [[2, 19.5], [3, -85.1], [4, -66.8], [5, -35.4]], label: 'HF', at: 0, dx: -6, dy: 4 }].map((s, i) => ({ ...s, dots: true, cls: 'g-l' + (i + 1) })), { W: 440, H: 280, L: 80, xMin: 1.6, xMax: 5.3, xTicks: [2, 3, 4, 5], yMin: -175, yMax: 110, yStep: 50, xl: T`period`, yl: T`boiling point (°C)`, label: T`Boiling points of the hydrides of groups 14 to 17: water, hydrogen fluoride and ammonia are far higher than the trend` }), T`Boiling points of the hydrides of groups 14–17 (CRC Handbook). Down each group the boiling point rises with more electrons (stronger London forces), but $\ce{H2O}$, $\ce{HF}$ and $\ce{NH3}$ are far above the trend because of hydrogen bonding. Without it, water would boil at about −80 °C.`)}
${Tbl([T`Structure`, T`Particles`, T`Melting point`, T`Conducts?`, T`Examples`], [[T`giant ionic`, T`ions`, T`high`, T`when molten or dissolved`, '$\\ce{NaCl}$, $\\ce{MgO}$'], [T`giant covalent`, T`atoms`, T`very high`, T`no (graphite: yes)`, T`diamond, graphite, $\\ce{SiO2}$`], [T`metallic`, T`positive ions + delocalised electrons`, T`usually high`, T`yes, also when solid`, '$\\ce{Cu}$, $\\ce{Fe}$'], [T`simple molecular`, T`molecules`, T`low`, T`no`, '$\\ce{H2O}$, $\\ce{CO2}$, $\\ce{I2}$']])}
${Tip(T`<p>Ice floats because hydrogen bonds hold the water molecules in an open lattice that is less dense than liquid water; that is why lakes freeze from the top down and fish survive the winter.</p>`)}`,
  gens: [
    () => {
      const [sub, t] = pick([['$\\ce{NaCl}$', 0], ['$\\ce{MgO}$', 0], [T`diamond`, 1], ['$\\ce{SiO2}$', 1], [T`graphite`, 1], [T`copper`, 2], [T`iron`, 2], ['$\\ce{CO2}$', 3], ['$\\ce{H2O}$', 3], ['$\\ce{I2}$', 3], ['$\\ce{CH4}$', 3], ['$\\ce{KBr}$', 0]]), N = [T`giant ionic`, T`giant covalent`, T`metallic`, T`simple molecular`];
      return { q: T`What type of structure does ${sub} have?`, a: N[t], w: N.filter((_, i) => i !== t), only: 'mc', s: T`${sub}: <b>${N[t]}</b>.` };
    },
    () => {
      const [f, t] = pick([['H2O', 2], ['NH3', 2], ['HF', 2], ['CH3OH', 2], ['HCl', 1], ['CH3Cl', 1], ['H2S', 1], ['CH4', 0], ['CO2', 0], ['I2', 0], ['Ne', 0], ['CCl4', 0]]), N = [T`London forces only`, T`dipole–dipole forces (and London forces)`, T`hydrogen bonds (and London forces)`];
      return { q: T`What is the strongest type of intermolecular force between $\ce{${f}}$ molecules?`, a: N[t], w: N.filter((_, i) => i !== t).concat([T`ionic bonds`]), only: 'mc', s: t === 2 ? T`H is bonded to N, O or F: <b>hydrogen bonds</b>.` : t === 1 ? T`The molecule is polar but has no H on N, O or F: <b>dipole–dipole</b>.` : T`The molecule is non-polar: only <b>London forces</b>.` };
    },
    () => {
      const [[a, ea], [b, eb]] = pick([[['F2', -188], ['Cl2', -34]], [['Cl2', -34], ['Br2', 59]], [['Br2', 59], ['I2', 184]], [['He', -269], ['Ar', -186]], [['CH4', -161.5], ['C2H6', -89]], [['C3H8', -42], ['C4H10', -1]], [['H2S', -60.3], ['H2O', 100]], [['HCl', -85.1], ['HF', 19.5]]]), hi = ea > eb ? a : b;
      return { q: T`Which has the higher boiling point: $\ce{${a}}$ or $\ce{${b}}$?`, a: `$\\ce{${hi}}$`, w: [`$\\ce{${hi === a ? b : a}}$`, T`they are equal`], only: 'mc', s: ['H2O', 'HF'].includes(hi) ? T`$\ce{${hi}}$ forms hydrogen bonds: ${M(Math.max(ea, eb))} °C against ${M(Math.min(ea, eb))} °C.` : T`$\ce{${hi}}$ has more electrons, so stronger London forces: ${M(Math.max(ea, eb))} °C against ${M(Math.min(ea, eb))} °C.` };
    },
    () => pick([
      { q: T`Why does graphite conduct electricity while diamond does not?`, a: T`Each carbon in graphite has one delocalised electron`, w: [T`Graphite contains ions`, T`Diamond has no electrons`, T`Graphite is a metal`], only: 'mc', s: T`In graphite each carbon uses 3 electrons for bonds; the fourth is free to move along the layers.` },
      { q: T`Why can metals be bent and hammered into shape?`, a: T`Layers of ions can slide over each other while the electron sea holds them`, w: [T`Metal atoms are very small`, T`Metals have weak bonds`, T`Metals contain molecules`], only: 'mc', s: T`The delocalised electrons keep bonding the ions after the layers move.` },
      { q: T`When water boils, what is broken?`, a: T`Hydrogen bonds between the molecules`, w: [T`O–H covalent bonds`, T`Ionic bonds`, T`The oxygen atoms`], only: 'mc', s: T`Boiling separates molecules; the molecules themselves stay intact.` },
      { q: T`Why is ice less dense than liquid water?`, a: T`Hydrogen bonds hold the molecules in an open lattice`, w: [T`Ice contains air`, T`Molecules in ice are larger`, T`Ice has no hydrogen bonds`], only: 'mc', s: T`The open hexagonal lattice leaves more space between molecules.` },
    ]),
  ],
},
  ],
});
})();
