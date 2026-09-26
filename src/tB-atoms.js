/* ==========================================================================
   TRACK B — Atoms & the Periodic Table
   ========================================================================== */
(() => {
const NUCLIDES = [['H', 1], ['He', 4], ['Li', 7], ['Be', 9], ['B', 11], ['C', 12], ['N', 14], ['O', 16], ['F', 19], ['Ne', 20], ['Na', 23], ['Mg', 24], ['Al', 27], ['Si', 28], ['P', 31], ['S', 32], ['Cl', 35], ['Ar', 40], ['K', 39], ['Ca', 40], ['Fe', 56], ['Cu', 63], ['Zn', 64], ['Br', 79], ['Ag', 107], ['I', 127], ['Ba', 138]];
const nucT = (sym, A, Z = ZOF[sym]) => `{}^{${A}}_{${Z}}\\mathrm{${sym}}`;
const IONS = [['Na', 1], ['K', 1], ['Li', 1], ['Mg', 2], ['Ca', 2], ['Al', 3], ['O', -2], ['S', -2], ['F', -1], ['Cl', -1], ['N', -3], ['Br', -1]];
const chg = q => (q > 0 ? (q === 1 ? '+' : q + '+') : (q === -1 ? '-' : -q + '-'));
const unpaired = Z => configOf(Z).reduce((a, [sh, n]) => { const k = CAP[sh[1]] / 2; return a + (n <= k ? n : 2 * k - n); }, 0);
const lastQN = Z => { const [sh, n] = configOf(Z).slice(-1)[0], nn = +sh[0], l = 'spdf'.indexOf(sh[1]), k = 2 * l + 1; const up = n <= k, m = -l + (up ? n - 1 : n - k - 1); return [nn, l, m, up ? '+\\tfrac12' : '-\\tfrac12']; };
const qnT = ([n, l, m, s]) => `n = ${n},\\ l = ${l},\\ m = ${m < 0 ? '-' + -m : m},\\ s = ${s}`;
const GROUP_NAMES = () => ({ 1: T`alkali metals`, 2: T`alkaline earth metals`, 17: T`halogens`, 18: T`noble gases` });
level({
  id: 'atoms', mark: 'B', name: 'Atoms & the Periodic Table', short: 'Atoms', band: 'Atomic structure · electrons · periodicity', color: 'lv2',
  blurb: 'Inside the atom: protons, neutrons and electrons, isotopes and relative atomic mass, how models of the atom developed, where electrons are, and how the periodic table organises the elements.',
  topics: [
{
  id: 'atomic-structure', stage: 'jh', title: 'Atomic Structure & Isotopes',
  blurb: 'Protons, neutrons and electrons, atomic number and mass number, nuclide notation, ions, isotopes, and calculating relative atomic mass from isotope abundances.',
  lesson: () => T`
<p>An <b>atom</b> is the smallest particle of an element. It has a tiny, dense <b>nucleus</b> of protons and neutrons, surrounded by electrons. The atom is mostly empty space: if the nucleus were a marble in the middle of a football stadium, the electrons would be moving around the outer stands.</p>
${Tbl([T`Particle`, T`Where`, T`Relative mass`, T`Relative charge`], [[T`proton`, T`nucleus`, '1', '+1'], [T`neutron`, T`nucleus`, '1', '0'], [T`electron`, T`shells around the nucleus`, T`$\tfrac{1}{1836}$ (almost 0)`, '−1']])}
${Fig(bohrSvg(6, { A: 12, W: 250, label: T`A carbon-12 atom: 6 protons and 6 neutrons in the nucleus, 6 electrons in two shells (2, 4)` }), T`A carbon-12 atom: 6 protons, 6 neutrons and 6 electrons (2 in the first shell, 4 in the second).`)}
${Key(T`<p><b>Atomic number</b> $Z$ = number of protons (it defines the element). <b>Mass number</b> $A$ = protons + neutrons. So</p><p>$$\text{neutrons} = A - Z.$$</p><p>A neutral atom has as many electrons as protons. The nuclide notation writes both numbers: $$ {}^{A}_{Z}\mathrm{X} \qquad \text{e.g. } {}^{23}_{11}\mathrm{Na}: 11 \text{ protons},\ 12 \text{ neutrons},\ 11 \text{ electrons}.$$</p>`)}
<h3>Ions</h3>
<p>An <b>ion</b> is an atom that has lost or gained electrons; the nucleus does not change. Losing electrons gives a <b>positive</b> ion (cation), gaining them a <b>negative</b> ion (anion): $\ce{Na+}$ has 10 electrons, $\ce{Cl-}$ has 18.</p>
<h3>Isotopes</h3>
<p><b>Isotopes</b> are atoms of the same element with different numbers of neutrons: same $Z$, different $A$. They have the same chemistry but different masses.</p>
${FigRow([[1, T`hydrogen-1 (protium)`], [2, T`hydrogen-2 (deuterium)`], [3, T`hydrogen-3 (tritium)`]].map(([A, t]) => [bohrSvg(1, { A, W: 150, label: t }), t]), T`The three isotopes of hydrogen: each has 1 proton and 1 electron, but 0, 1 or 2 neutrons.`)}
${Fig(barsSvg([['35', 75.8, 'mf-s1'], ['37', 24.2, 'mf-s2']], { W: 320, H: 210, yMax: 100, step: 20, yl: T`abundance (%)`, label: T`Mass spectrum of chlorine: mass 35 at 75.8 percent and mass 37 at 24.2 percent` }), T`A mass spectrometer measures the isotopes of chlorine: ${NUM(75.8)}% chlorine-35 and ${NUM(24.2)}% chlorine-37 (IUPAC abundances).`)}
${Key(T`<p>The <b>relative atomic mass</b> $A_r$ is the weighted mean mass of the isotopes, compared with $\frac{1}{12}$ of a carbon-12 atom:</p><p>$$A_r = \frac{\sum (\text{mass} \times \text{abundance})}{100} \qquad A_r(\mathrm{Cl}) = \frac{35 \times 75.8 + 37 \times 24.2}{100} = ${M(35.48)}$$</p>`)}
${Tip(T`<p>The mass number is always a whole number (it counts particles); the relative atomic mass usually is not, because it is an average over the isotopes.</p>`)}`,
  gens: [
    () => {
      const [sym, A] = pick(NUCLIDES), Z = ZOF[sym], what = pick(['p', 'n', 'e']), a = what === 'n' ? A - Z : Z;
      return { q: T`How many ${what === 'p' ? T`protons` : what === 'n' ? T`neutrons` : T`electrons`} are there in a neutral atom of $${nucT(sym, A)}$?`, a, w: [A, A - Z === a ? Z : A - Z, A + Z], s: T`$Z = ${Z}$ protons, $A - Z = ${A} - ${Z} = ${A - Z}$ neutrons, and ${Z} electrons in a neutral atom.` };
    },
    () => {
      const [sym, q] = pick(IONS), Z = ZOF[sym], e = Z - q;
      return { q: T`How many electrons does the ion $\ce{${sym}^{${chg(q)}}}$ have? (atomic number of ${elName(sym)}: ${Z})`, a: e, w: [Z, Z + q, e + (q > 0 ? 2 : -2)].filter((x, i, arr) => x !== e && arr.indexOf(x) === i), s: q > 0 ? T`It has lost ${q} electron${q > 1 ? 's' : ''}: $${Z} - ${q} = ${e}$.` : T`It has gained ${-q} electron${q < -1 ? 's' : ''}: $${Z} + ${-q} = ${e}$.` };
    },
    () => {
      const [sym, a1, p1, a2] = pick([['Cl', 35, 75.8, 37], ['B', 10, 19.9, 11], ['Cu', 63, 69.2, 65], ['Li', 6, 7.6, 7], ['Br', 79, 50.7, 81], ['Ga', 69, 60.1, 71], ['X', 24, pick([60, 70, 80]), 26]]), p2 = sig(100 - p1, 3), ar = sig((a1 * p1 + a2 * p2) / 100, 4);
      const nm = sym === 'X' ? T`element X` : elName(sym);
      return { q: T`Naturally occurring ${nm} is ${NUM(p1)}% mass ${a1} and ${NUM(p2)}% mass ${a2}. Calculate its relative atomic mass.`, a: ar, rtol: 0.001, w: [sig((a1 + a2) / 2, 4), sig((a1 * p2 + a2 * p1) / 100, 4), sig(a1 * p1 / 100, 4)], s: T`$A_r = \frac{${a1} \times ${M(p1)} + ${a2} \times ${M(p2)}}{100} = ${M(ar)}$.` };
    },
    () => {
      const [sym, A1] = pick(NUCLIDES.filter(([s]) => ZOF[s] > 2)), Z = ZOF[sym], A2 = A1 + pick([1, 2]);
      const pairs = [[`${nucT(sym, A1)},\\ ${nucT(sym, A2)}`, true], [`${nucT(sym, A1)},\\ {}^{${A1}}_{${Z + 1}}\\mathrm{${SYMBOLS[Z]}}`, false], [`${nucT(sym, A1)},\\ {}^{${A1 + 1}}_{${Z + 1}}\\mathrm{${SYMBOLS[Z]}}`, false], [`{}^{${A1}}_{${Z - 1}}\\mathrm{${SYMBOLS[Z - 2]}},\\ ${nucT(sym, A1)}`, false]];
      return { q: T`Which pair are isotopes of each other?`, a: `$${pairs[0][0]}$`, w: pairs.slice(1).map(p => `$${p[0]}$`), only: 'mc', s: T`Isotopes have the same atomic number (same element) but different mass numbers: $${pairs[0][0]}$.` };
    },
    () => {
      const [sym, A] = pick(NUCLIDES.slice(2, 20)), Z = ZOF[sym], n = A - Z;
      return { q: T`An atom of ${elName(sym)} has ${Z} protons and ${n} neutrons. What is its mass number?`, a: A, w: [Z, n, A + 1], s: T`$A = ${Z} + ${n} = ${A}$.` };
    },
    () => pick([
      { q: T`Which particle has almost no mass compared with the others?`, a: T`the electron`, w: [T`the proton`, T`the neutron`, T`the nucleus`], only: 'mc', s: T`An electron is about 1/1836 of the mass of a proton.` },
      { q: T`What do isotopes of an element have in common?`, a: T`the same number of protons`, w: [T`the same number of neutrons`, T`the same mass number`, T`the same mass`], only: 'mc', s: T`Same $Z$ (protons), different numbers of neutrons.` },
      { q: T`What decides which element an atom belongs to?`, a: T`its number of protons`, w: [T`its number of neutrons`, T`its number of electrons`, T`its mass number`], only: 'mc', s: T`The atomic number (number of protons) defines the element.` },
    ]),
  ],
},
{
  id: 'atomic-models', stage: 'sh', title: 'Models of the Atom & Atomic Spectra',
  blurb: 'From Dalton to Thomson, Rutherford, Bohr and the quantum-mechanical model; energy levels, line spectra and flame tests.',
  lesson: () => T`
<p>Nobody can see inside an atom, so chemists build <b>models</b> that explain experiments, and improve them when a new experiment does not fit.</p>
${FigW(atomModelsSvg([T`Dalton (1803)`, T`Thomson (1897)`, T`Rutherford (1911)`, T`Bohr (1913)`, T`quantum model (1926)`], { label: T`Five models of the atom: a solid sphere, a plum pudding, a nucleus with orbiting electrons, fixed circular shells, and an electron cloud` }), T`How the model of the atom changed.`)}
${Tbl([T`Model`, T`Idea`, T`Evidence or weakness`], [[T`Dalton`, T`atoms are tiny indivisible spheres; each element has its own atoms`, T`explains fixed mass ratios in compounds; cannot explain electricity or ions`], [T`Thomson`, T`a positive sphere with electrons stuck in it ("plum pudding")`, T`discovered the electron (cathode rays)`], [T`Rutherford`, T`a tiny, dense, positive nucleus with electrons around it`, T`gold foil: most alpha particles passed straight through, a few bounced back; could not explain why electrons do not spiral into the nucleus`], [T`Bohr`, T`electrons move only in fixed energy levels (shells)`, T`explains the line spectrum of hydrogen; fails for atoms with more electrons`], [T`Quantum mechanical (Schrödinger)`, T`electrons are found in orbitals: regions where they are likely to be`, T`the model used today`]])}
<h3>Energy levels and line spectra</h3>
<p>In Bohr's model the energy of an electron in hydrogen can only take the values $E_n = -\frac{13.6\ \mathrm{eV}}{n^2}$. When an electron drops from a higher level to a lower one, the atom emits a photon with exactly the energy difference:</p>
${Fm(T`\Delta E = E_{\text{high}} - E_{\text{low}} = h f = \frac{hc}{\lambda} \qquad \lambda\ (\mathrm{nm}) \approx \frac{1240}{\Delta E\ (\mathrm{eV})}`)}
${Fig(levelsSvg([[3, 2, 'mf-c4'], [4, 2, 'mf-c2'], [5, 2, 'mf-c3'], [2, 1, 'mf-c1']], { label: T`Hydrogen energy levels with electrons falling from levels 3, 4 and 5 to level 2 and from 2 to 1` }), T`Falls to $n = 2$ give visible light (red 656 nm, blue-green 486 nm, violet 434 nm); falls to $n = 1$ give ultraviolet.`)}
${Key(T`<p>Each element has its own set of energy levels, so its <b>line spectrum</b> is like a fingerprint. Heating a compound in a flame shows the colour of its metal ion: sodium yellow, potassium lilac, lithium red, calcium orange-red, strontium crimson, barium green, copper blue-green. Fireworks use these colours.</p>`)}
${Tip(T`<p>Electrons in the Bohr model are not little planets: in the modern model we only know where an electron is <i>likely</i> to be, which is why we speak of orbitals instead of orbits.</p>`)}`,
  gens: [
    () => {
      const [d, a] = pick([[T`discovered the electron and proposed the "plum pudding" model`, T`Thomson`], [T`fired alpha particles at gold foil and proposed a small, dense nucleus`, T`Rutherford`], [T`proposed that electrons move only in fixed energy levels`, T`Bohr`], [T`described atoms as tiny indivisible spheres`, T`Dalton`], [T`described electrons with wave equations and orbitals`, T`Schrödinger`]]);
      return { q: T`Which scientist ${d}?`, a, w: [T`Thomson`, T`Rutherford`, T`Bohr`, T`Dalton`, T`Schrödinger`].filter(x => x !== a).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`<b>${a}</b>.` };
    },
    () => {
      const [hi, lo] = pick([[3, 2], [4, 2], [5, 2], [2, 1], [3, 1], [4, 3]]), dE = sig(13.6 * (1 / (lo * lo) - 1 / (hi * hi)), 3);
      return { q: T`Using $E_n = -\frac{13.6}{n^2}$ eV, find the energy (in eV) of the photon emitted when a hydrogen electron falls from $n = ${hi}$ to $n = ${lo}$.`, a: dE, u: 'eV', rtol: 0.01, w: [sig(13.6 / (hi * hi), 3), sig(13.6 / (lo * lo), 3), sig(13.6 * (1 / lo - 1 / hi), 3)], s: T`$\Delta E = 13.6\left(\frac{1}{${lo}^2} - \frac{1}{${hi}^2}\right) = ${M(dE)}$ eV.` };
    },
    () => {
      const dE = pick([1.89, 2.55, 2.86, 3.02, 10.2, 1.51]), l = sig(1240 / dE, 3);
      return { q: T`A photon has an energy of ${Q(dE, 'eV')}. Using $\lambda \approx \frac{1240}{\Delta E}$ nm, what is its wavelength (in nm)?`, a: l, u: 'nm', rtol: 0.01, w: [sig(1240 * dE, 3), sig(dE / 1240 * 1e6, 3), sig(l / 2, 3)], s: T`$\lambda = \frac{1240}{${M(dE)}} = ${QT(l, 'nm')}$.` };
    },
    () => {
      const [ion, col] = pick([[T`sodium`, T`yellow`], [T`potassium`, T`lilac`], [T`lithium`, T`red`], [T`copper`, T`blue-green`], [T`barium`, T`green`], [T`calcium`, T`orange-red`]]);
      return { q: T`What flame colour do ${ion} compounds give?`, a: col, w: [T`yellow`, T`lilac`, T`red`, T`blue-green`, T`green`, T`orange-red`].filter(x => x !== col).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`${ion}: <b>${col}</b>.` };
    },
    () => pick([
      { q: T`In the gold-foil experiment most alpha particles went straight through the foil. What does this show?`, a: T`An atom is mostly empty space`, w: [T`Atoms are solid spheres`, T`Electrons are heavy`, T`The nucleus is negative`], only: 'mc', s: T`Only a few particles came close to the tiny nucleus.` },
      { q: T`Why does each element have its own line spectrum?`, a: T`Each element has its own set of electron energy levels`, w: [T`Each element has its own number of neutrons`, T`All atoms give the same colours`, T`The flame changes the element`], only: 'mc', s: T`Photons are emitted only with the energy gaps between that element's levels.` },
      { q: T`What is an orbital?`, a: T`A region around the nucleus where an electron is likely to be found`, w: [T`A fixed circular path of an electron`, T`A part of the nucleus`, T`A type of ion`], only: 'mc', s: T`The quantum model gives probabilities, not exact paths.` },
    ]),
  ],
},
{
  id: 'electron-config', stage: 'sh', title: 'Electron Configuration & Quantum Numbers',
  blurb: 'Shells, subshells and orbitals, the aufbau principle, Pauli exclusion and Hund’s rule, writing configurations, valence electrons, and the four quantum numbers.',
  lesson: () => T`
<p>Electrons fill <b>shells</b> ($n = 1, 2, 3, \ldots$), each made of <b>subshells</b> $s$, $p$, $d$, $f$. A subshell is made of <b>orbitals</b>, and each orbital holds at most two electrons of opposite spin.</p>
${Tbl([T`Subshell`, T`Orbitals`, T`Maximum electrons`], [['s', '1', '2'], ['p', '3', '6'], ['d', '5', '10'], ['f', '7', '14']])}
${FigW(orbitalShapesSvg(['s', 'p_x', 'p_z', 'p_y'], { label: T`Shapes of an s orbital (a sphere) and the three p orbitals (dumbbells along x, z and y)` }), T`An $s$ orbital is a sphere; the three $p$ orbitals are dumbbells along the $x$, $y$ and $z$ axes.`)}
${Key(T`<p><b>Aufbau principle:</b> electrons fill the lowest energy subshell first: $1s\ 2s\ 2p\ 3s\ 3p\ 4s\ 3d\ 4p\ 5s \ldots$ <b>Pauli exclusion principle:</b> an orbital holds at most two electrons, with opposite spins. <b>Hund's rule:</b> in a subshell, electrons occupy empty orbitals singly (same spin) before they pair up.</p>`)}
${Fig(aufbauSvg({ label: T`The diagonal rule for the filling order of subshells` }), T`Follow the arrows for the filling order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, …`)}
${Ex(T`<p>Iron, $Z = 26$: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$, or in short $[\mathrm{Ar}]\,4s^2\,3d^6$.</p>`)}
${Fig(orbitalSvg(26, { from: 5, label: T`Orbital diagram of the 4s and 3d subshells of iron` }), T`The $4s$ and $3d$ electrons of iron: by Hund's rule the six $3d$ electrons give four unpaired electrons.`)}
${Key(T`<p>Two common exceptions: chromium $[\mathrm{Ar}]\,4s^1\,3d^5$ and copper $[\mathrm{Ar}]\,4s^1\,3d^{10}$, because half-full and full $d$ subshells are extra stable.</p><p>The <b>valence electrons</b> are those in the outermost shell (for main-group elements). They decide the chemistry: the group number of an $s$- or $p$-block element follows from them, and the period number is the highest shell $n$.</p>`)}
<h3>The four quantum numbers</h3>
${Tbl([T`Quantum number`, T`Symbol`, T`Values`, T`Describes`], [[T`principal`, '$n$', '$1, 2, 3, \\ldots$', T`the shell (size and energy)`], [T`azimuthal`, '$l$', T`$0$ to $n - 1$ ($s = 0$, $p = 1$, $d = 2$, $f = 3$)`, T`the subshell (shape)`], [T`magnetic`, '$m$', T`$-l$ to $+l$`, T`the orbital (orientation)`], [T`spin`, '$s$', '$+\\tfrac12$ or $-\\tfrac12$', T`the spin of the electron`]])}
${Tip(T`<p>When an atom forms a positive ion, the $4s$ electrons are lost before the $3d$ electrons: $\mathrm{Fe}^{2+}$ is $[\mathrm{Ar}]\,3d^6$, not $[\mathrm{Ar}]\,4s^2\,3d^4$.</p>`)}`,
  gens: [
    () => {
      const Z = pick([7, 8, 11, 13, 15, 16, 17, 19, 20, 24, 25, 26, 29, 30, 35]), short = Z > 18, a = `$${configT(Z, short)}$`;
      const wrongs = [configT(Z + 1, short), configT(Z - 1, short)];
      if (Z === 24 || Z === 29) wrongs.push(Z === 24 ? '[\\mathrm{Ar}]\\,4s^{2}\\,3d^{4}' : '[\\mathrm{Ar}]\\,4s^{2}\\,3d^{9}'); else wrongs.push(configT(Z + 2, short));
      return { q: T`What is the electron configuration of ${elName(SYMBOLS[Z - 1])} ($Z = ${Z}$)?`, a, w: wrongs.map(x => `$${x}$`), only: 'mc', s: T`Fill in the order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p: ${a}.` };
    },
    () => {
      const Z = pick([5, 6, 7, 8, 9, 14, 15, 16, 21, 23, 24, 25, 26, 27, 28]), u = unpaired(Z);
      return { q: T`How many unpaired electrons does an atom of ${elName(SYMBOLS[Z - 1])} ($Z = ${Z}$) have?`, a: u, w: [u + 1, Math.max(0, u - 1) === u ? u + 2 : Math.max(0, u - 1), valenceOf(Z) || 2].filter((x, i, arr) => x !== u && arr.indexOf(x) === i), s: T`Configuration $${configT(Z, Z > 18)}$. Fill the last subshell by Hund's rule: <b>${u}</b> unpaired.` };
    },
    () => {
      const Z = pick([3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 31, 33, 35]), v = valenceOf(Z);
      return { q: T`How many valence electrons does ${elName(SYMBOLS[Z - 1])} ($Z = ${Z}$) have?`, a: v, w: [v + 1, v === 1 ? 3 : v - 1, 8 - v || 2].filter((x, i, arr) => x !== v && arr.indexOf(x) === i), s: T`$${configT(Z, Z > 18)}$: the outer shell holds <b>${v}</b> electrons.` };
    },
    () => {
      const Z = pick([11, 12, 13, 15, 16, 17, 19, 20, 26, 29, 33, 35]), [g, p] = tablePos(Z), ask = chance();
      return ask ? { q: T`An element has the configuration $${configT(Z, true)}$. In which period is it?`, a: p, w: [p - 1, p + 1, g > 10 ? g - 10 : g], s: T`The highest shell is $n = ${p}$: period <b>${p}</b>.` }
        : { q: T`An element has the configuration $${configT(Z, true)}$. In which group is it?`, a: g, w: [g <= 2 ? g + 1 : g - 10, p, g + 1], s: g <= 2 ? T`It ends in $s^{${g}}$: group <b>${g}</b>.` : g >= 13 ? T`It ends in $s^2p^{${g - 12}}$: $2 + ${g - 12} = ${g - 10}$ valence electrons, group <b>${g}</b>.` : T`For a $d$-block element add the $s$ and $d$ electrons: group <b>${g}</b>.` };
    },
    () => {
      const Z = pick([5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 20]), qn = lastQN(Z), a = `$${qnT(qn)}$`;
      const [n, l, m, sp] = qn, alt = [[n, l, -m || 1, sp], [n, l, m, sp.startsWith('+') ? '-\\tfrac12' : '+\\tfrac12'], [n + 1, l, m, sp], [n, l === 0 ? 1 : 0, 0, sp]].map(qnT).filter(x => x !== qnT(qn));
      return { q: T`What are the quantum numbers of the last electron of ${elName(SYMBOLS[Z - 1])} ($Z = ${Z}$)?`, a, w: [...new Set(alt)].slice(0, 3).map(x => `$${x}$`), only: 'mc', s: T`$${configT(Z)}$. The last electron is in ${configOf(Z).slice(-1)[0][0]}; filling the orbitals from $m = -l$ upwards with spin up first gives ${a}.` };
    },
    () => pick([
      { q: T`What is the maximum number of electrons in a d subshell?`, a: 10, w: [2, 6, 14], s: T`5 orbitals × 2 electrons = 10.` },
      { q: T`What is the maximum number of electrons in the shell n = 3?`, a: 18, w: [8, 9, 32], s: T`$2n^2 = 2 \times 3^2 = 18$ (3s, 3p and 3d).` },
      { q: T`Which subshell fills just before 3d?`, a: '4s', w: ['3p', '4p', '3s'], only: 'mc', s: T`The order is … 3p, 4s, 3d, 4p …` },
      { q: T`What does Hund's rule say?`, a: T`Electrons fill empty orbitals of a subshell singly before pairing`, w: [T`An orbital holds at most two electrons`, T`Electrons fill the lowest energy first`, T`Electrons never pair`], only: 'mc', s: T`That is Hund's rule; the others are Pauli's principle and the aufbau principle.` },
    ]),
  ],
},
{
  id: 'periodic-table', stage: 'sh', title: 'The Periodic Table & Periodic Trends',
  blurb: 'Groups, periods and blocks, metals and non-metals, and the trends in atomic radius, ionisation energy, electronegativity and metallic character.',
  lesson: () => T`
<p>The <b>periodic table</b> lists the elements in order of atomic number. Elements in the same vertical <b>group</b> have the same number of valence electrons and similar chemistry; the horizontal <b>periods</b> correspond to the shells being filled. The table was first organised by Dmitri Mendeleev in 1869, who even left gaps for elements not yet discovered.</p>
${FigW(periodicSvg({ label: T`The periodic table coloured by block: s block red, p block green, d block blue, f block yellow` }), T`The blocks show which subshell is being filled: $s$ (groups 1–2), $p$ (13–18), $d$ (3–12, transition metals) and $f$ (lanthanides and actinides).`)}
${Tbl([T`Group`, T`Name`, T`Valence electrons`, T`Typical behaviour`], [['1', T`alkali metals`, '1', T`soft, very reactive metals; form $\ce{M+}$ ions`], ['2', T`alkaline earth metals`, '2', T`reactive metals; form $\ce{M^2+}$ ions`], ['17', T`halogens`, '7', T`reactive non-metals; form $\ce{X-}$ ions`], ['18', T`noble gases`, T`8 (He: 2)`, T`very unreactive gases`]])}
<h3>Trends</h3>
${FigW(periodicSvg({ f: false, maxZ: 86, trend: (L, T0, c) => sArrow(L + 2 * c, T0 + 7.35 * c, L + 16 * c, T0 + 7.35 * c, 'mf-c4', 10) + sT(L + 9 * c, T0 + 7.35 * c + 16, T`ionisation energy and electronegativity increase →`, 'mf-lab-b') + sArrow(L - 14, T0 + 0.3 * c, L - 14, T0 + 6.8 * c, 'mf-c1', 9), label: T`Periodic trends: ionisation energy and electronegativity increase across a period, atomic radius increases down a group` }).replace('</svg>', '').replace(/viewBox="0 0 (\d+) (\d+)"/, (m, w, h) => `viewBox="0 0 ${w} ${+h + 30}"`) + '</svg>', T`Across a period (left to right) the nuclear charge rises while the shell stays the same, so atoms get <b>smaller</b> and hold their electrons more tightly. Down a group a new shell is added each time, so atoms get <b>larger</b> (blue arrow).`)}
${Tbl([T`Property`, T`Across a period →`, T`Down a group ↓`], [[T`atomic radius`, T`decreases`, T`increases`], [T`first ionisation energy`, T`increases (generally)`, T`decreases`], [T`electronegativity`, T`increases`, T`decreases`], [T`metallic character`, T`decreases`, T`increases`]])}
${Fig(planeSvg({ W: 400, H: 240, x: [0, 21], y: [0, 2.6], step: [2, 0.5], tickX: 2, xl: 'Z', yl: T`MJ/mol`, extra: (X, Y) => sPline(IE1.slice(0, 20).map((v, i) => [X(i + 1), Y(v / 1000)]), 'mf-c1', ' fill="none" stroke-width="2"') + IE1.slice(0, 20).map((v, i) => sC(X(i + 1), Y(v / 1000), 3, 'mf-dot') + ([9, 17].includes(i) ? sT(X(i + 1), Y(v / 1000) - 8, SYMBOLS[i], 'mf-small') : [1].includes(i) ? sT(X(i + 1) + 14, Y(v / 1000) + 4, SYMBOLS[i], 'mf-small') : [2, 10, 18].includes(i) ? sT(X(i + 1), Y(v / 1000) + 16, SYMBOLS[i], 'mf-small') : '')).join(''), label: T`First ionisation energies of elements 1 to 20: peaks at the noble gases helium, neon and argon, and minima at the alkali metals` }), T`First ionisation energy of elements 1–20 in MJ/mol, i.e. thousands of kJ/mol (NIST data): peaks at the noble gases, dips at the alkali metals, and a small dip at boron and oxygen.`)}
${Key(T`<p>The <b>first ionisation energy</b> is the energy needed to remove one electron from each atom in a mole of gaseous atoms: $\ce{X(g) -> X+(g) + e-}$. <b>Electronegativity</b> is how strongly an atom attracts the shared electrons in a bond; fluorine is the most electronegative element (3.98 on the Pauling scale).</p>`)}
${Tip(T`<p>Noble gases are left out when comparing electronegativity: they rarely form bonds, so most tables give them no value.</p>`)}`,
  gens: [
    () => {
      const Z = pick([3, 7, 9, 11, 12, 14, 16, 17, 18, 19, 20, 26, 29, 30, 35, 53, 56]), [g, p] = tablePos(Z), ask = chance();
      return ask ? { q: T`In which group is ${elName(SYMBOLS[Z - 1])} ($Z = ${Z}$)?`, a: g, w: [p, g <= 2 ? g + 1 : g - 1, g >= 13 ? g - 10 : g + 10].filter((x, i, arr) => x !== g && arr.indexOf(x) === i), s: T`$${configT(Z, Z > 18)}$: group <b>${g}</b>.` }
        : { q: T`In which period is ${elName(SYMBOLS[Z - 1])} ($Z = ${Z}$)?`, a: p, w: [p + 1, p - 1, g].filter((x, i, arr) => x !== p && arr.indexOf(x) === i && x > 0), s: T`Its outer electrons are in shell $n = ${p}$: period <b>${p}</b>.` };
    },
    () => {
      const Z = pick([3, 6, 11, 17, 20, 24, 26, 29, 33, 35, 58, 92]), b = blockOf(Z);
      return { q: T`In which block of the periodic table is ${elName(SYMBOLS[Z - 1]) === SYMBOLS[Z - 1] ? SYMBOLS[Z - 1] : elName(SYMBOLS[Z - 1])} ($Z = ${Z}$)?`, a: T`${b} block`, w: ['s', 'p', 'd', 'f'].filter(x => x !== b).map(x => T`${x} block`), only: 'mc', s: T`Its last electron goes into a ${b} subshell: <b>${b} block</b>.` };
    },
    () => {
      const kind = pick(['ie', 'en']), pairs = kind === 'ie' ? [[3, 11], [11, 17], [12, 13], [7, 8], [19, 20], [9, 17], [6, 14]] : [[9, 17], [8, 16], [11, 17], [6, 7], [14, 15], [3, 11], [17, 35]];
      const [a, b] = pick(pairs), arr = kind === 'ie' ? IE1 : EN, hi = arr[a - 1] > arr[b - 1] ? a : b, lo = hi === a ? b : a;
      return { q: kind === 'ie' ? T`Which has the higher first ionisation energy: ${elName(SYMBOLS[a - 1])} or ${elName(SYMBOLS[b - 1])}?` : T`Which is more electronegative: ${elName(SYMBOLS[a - 1])} or ${elName(SYMBOLS[b - 1])}?`, a: elName(SYMBOLS[hi - 1]), w: [elName(SYMBOLS[lo - 1]), T`they are equal`], only: 'mc', s: kind === 'ie' ? T`${elName(SYMBOLS[hi - 1])}: ${NUM(arr[hi - 1])} kJ/mol against ${NUM(arr[lo - 1])} kJ/mol.` : T`${elName(SYMBOLS[hi - 1])}: ${NUM(arr[hi - 1])} against ${NUM(arr[lo - 1])} on the Pauling scale.` };
    },
    () => {
      const [a, b] = pick([[3, 11], [11, 19], [9, 17], [11, 17], [12, 16], [6, 8], [19, 35], [13, 15]]), big = tablePos(a)[0] === tablePos(b)[0] ? Math.max(a, b) : Math.min(a, b), small = big === a ? b : a;
      return { q: T`Which atom is larger: ${elName(SYMBOLS[a - 1])} or ${elName(SYMBOLS[b - 1])}?`, a: elName(SYMBOLS[big - 1]), w: [elName(SYMBOLS[small - 1]), T`they are the same size`], only: 'mc', s: tablePos(a)[0] === tablePos(b)[0] ? T`Same group: the one lower down has more shells, so ${elName(SYMBOLS[big - 1])} is larger.` : T`Same period: the one further left has a smaller nuclear charge pulling the same shell, so ${elName(SYMBOLS[big - 1])} is larger.` };
    },
    () => {
      const g = pick([1, 2, 17, 18]), a = GROUP_NAMES()[g];
      return { q: T`What is the name of group ${g}?`, a, w: Object.values(GROUP_NAMES()).filter(x => x !== a), only: 'mc', s: T`Group ${g}: <b>${a}</b>.` };
    },
    () => pick([
      { q: T`Why do elements in the same group have similar chemical properties?`, a: T`They have the same number of valence electrons`, w: [T`They have the same number of shells`, T`They have the same mass`, T`They have the same number of neutrons`], only: 'mc', s: T`Chemistry depends mainly on the valence electrons.` },
      { q: T`Why does atomic radius decrease across a period?`, a: T`The nuclear charge increases while electrons are added to the same shell`, w: [T`Electrons are removed across a period`, T`New shells are added`, T`Neutrons repel the electrons`], only: 'mc', s: T`A larger positive charge pulls the same shell closer.` },
      { q: T`Which element is the most electronegative?`, a: T`fluorine`, w: [T`oxygen`, T`chlorine`, T`caesium`], only: 'mc', s: T`Fluorine: 3.98 on the Pauling scale.` },
    ]),
  ],
},
  ],
});
})();
