/* ==========================================================================
   TRACK A — Matter & the Laboratory
   ========================================================================== */
(() => {
const stateNames = () => ({ s: T`solid`, l: T`liquid`, g: T`gas`, melt: T`melting`, freeze: T`freezing`, evap: T`evaporation`, cond: T`condensation`, sub: T`sublimation`, dep: T`deposition` });
level({
  id: 'matter', mark: 'A', name: 'Matter & the Laboratory', short: 'Matter & Lab', band: 'States · mixtures · lab skills', color: 'lv1',
  blurb: 'What everything is made of: the particle model and the states of matter, pure substances and mixtures and how to separate them, and working safely and accurately in the laboratory.',
  topics: [
{
  id: 'states', stage: 'jh', title: 'States of Matter & the Particle Model',
  blurb: 'Solids, liquids and gases explained with particles, changes of state and their names, melting and boiling points, heating curves, and physical versus chemical changes.',
  lesson: () => T`
<p>Everything around us is <b>matter</b>: anything that has mass and takes up space. All matter is made of tiny <b>particles</b> (atoms, molecules or ions) that are always moving. How close they are and how freely they move decides whether a substance is a solid, a liquid or a gas.</p>
${FigRow([['solid', T`solid`, 1], ['liquid', T`liquid`, 4], ['gas', T`gas`, 7]].map(([k, t, sd]) => [particleBox(k, { seed: sd, label: T`Particles in a ${t}` }), t]), T`The particle model: in a solid the particles vibrate in fixed places; in a liquid they touch but slide past each other; in a gas they are far apart and fly about in all directions.`)}
${Tbl([T`Property`, T`Solid`, T`Liquid`, T`Gas`], [[T`Shape`, T`fixed`, T`takes the shape of its container`, T`fills its whole container`], [T`Volume`, T`fixed`, T`fixed`, T`not fixed; easy to compress`], [T`Particles`, T`closely packed in a regular pattern`, T`close together, irregular`, T`far apart, random`], [T`Movement`, T`vibrate about fixed positions`, T`move around each other`, T`move fast in all directions`], [T`Forces between particles`, T`strong`, T`weaker`, T`very weak`]])}
<h3>Changes of state</h3>
${FigW(statesSvg({ names: stateNames(), label: T`The six changes of state between solid, liquid and gas` }), T`Heating (red arrows) gives particles more energy; cooling (blue arrows) takes energy away.`)}
<p>A pure substance melts at its <b>melting point</b> and boils at its <b>boiling point</b>. For water at normal air pressure these are $0\,^\circ\mathrm{C}$ and $100\,^\circ\mathrm{C}$. While a substance is melting or boiling, its temperature stays constant: the energy goes into separating the particles, not into making them move faster.</p>
${Fig(planeSvg({ W: 380, H: 230, x: [0, 10.4], y: [-30, 135], step: [1, 20], ticks: false, xl: T`time of heating`, yl: 'T (°C)', segs: [[0, -20, 1, 0, 'mf-c1'], [1, 0, 3, 0, 'mf-c4'], [3, 0, 5, 100, 'mf-c1'], [5, 100, 9, 100, 'mf-c4'], [9, 100, 10, 120, 'mf-c1']], texts: [[0.2, -8, T`ice`, 'start', 'mf-small'], [2, 7, T`melting`, 'middle', 'mf-small'], [4.1, 45, T`water`, 'end', 'mf-small'], [7, 106, T`boiling`, 'middle', 'mf-small'], [9.6, 124, T`steam`, 'end', 'mf-small'], [-0.15, 0, '0', 'end', 'mf-small'], [-0.15, 100, '100', 'end', 'mf-small']], label: T`Heating curve of water with flat parts at 0 and 100 degrees Celsius` }), T`Heating curve of water: the flat parts are melting ($0\,^\circ\mathrm{C}$) and boiling ($100\,^\circ\mathrm{C}$).`)}
${Key(T`<p><b>Physical change</b>: no new substance forms, and it is usually easy to reverse (melting ice, dissolving sugar, cutting paper).<br><b>Chemical change</b>: new substances form (burning, rusting, cooking an egg). Signs of a chemical change: a new colour, a gas given off, a precipitate, a change in temperature, light or a new smell.</p>`)}
${Tip(T`<p><b>Evaporation</b> happens at the surface at any temperature; <b>boiling</b> happens throughout the liquid, at the boiling point only. That is why wet clothes dry in the sun without boiling.</p>`)}`,
  gens: [
    () => {
      const [a, b, d] = pick([[T`solid`, T`liquid`, T`melting`], [T`liquid`, T`solid`, T`freezing`], [T`liquid`, T`gas`, T`evaporation`], [T`gas`, T`liquid`, T`condensation`], [T`solid`, T`gas`, T`sublimation`], [T`gas`, T`solid`, T`deposition`]]);
      return { q: T`What is the change from <b>${a}</b> directly to <b>${b}</b> called?`, a: d, w: [T`melting`, T`freezing`, T`evaporation`, T`condensation`, T`sublimation`, T`deposition`].filter(x => x !== d).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`${a} → ${b}: <b>${d}</b>.` };
    },
    () => {
      const [d, a] = pick([[T`Mothballs (naphthalene) slowly get smaller in a wardrobe`, T`sublimation`], [T`Dew forms on grass on a cool morning`, T`condensation`], [T`Candle wax runs down the side of a burning candle`, T`melting`], [T`Water in an ice-cube tray turns to ice in the freezer`, T`freezing`], [T`A puddle disappears on a sunny day`, T`evaporation`], [T`Frost forms directly from water vapour on a cold window`, T`deposition`]]);
      return { q: T`Which change of state is this? <i>${d}</i>`, a, w: [T`melting`, T`freezing`, T`evaporation`, T`condensation`, T`sublimation`, T`deposition`].filter(x => x !== a).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`That is <b>${a}</b>.` };
    },
    () => {
      const [d, a] = pick([[T`Burning wood`, T`chemical`], [T`Iron rusting`, T`chemical`], [T`Frying an egg`, T`chemical`], [T`Milk turning sour`, T`chemical`], [T`Dissolving salt in water`, T`physical`], [T`Melting butter`, T`physical`], [T`Breaking a glass`, T`physical`], [T`Boiling water`, T`physical`]]);
      return { q: T`Is this a physical or a chemical change? <i>${d}</i>`, a, w: [T`physical`, T`chemical`].filter(x => x !== a), only: 'mc', s: a === T`chemical` ? T`A new substance is formed, so it is a <b>chemical</b> change.` : T`No new substance is formed, so it is a <b>physical</b> change.` };
    },
    () => {
      const mp = pick([-39, -7, 17, 44, 80, 114]), bp = mp + pick([100, 150, 200, 250, 300]), T0 = pick([mp - 20, Math.round((mp + bp) / 2), bp + 20]);
      const a = T0 < mp ? T`solid` : T0 < bp ? T`liquid` : T`gas`;
      return { q: T`A substance melts at ${Q(mp, '°C')} and boils at ${Q(bp, '°C')}. What is its state at ${Q(T0, '°C')}?`, a, w: [T`solid`, T`liquid`, T`gas`].filter(x => x !== a), only: 'mc', s: T`Below the melting point it is solid, between the melting and boiling points liquid, above the boiling point gas. At ${Q(T0, '°C')} it is <b>${a}</b>.` };
    },
    () => {
      const c = pick([-196, -78, 0, 25, 37, 100, 327]), k = c + 273;
      return chance() ? { q: T`Convert ${Q(c, '°C')} to kelvin.`, a: k, u: 'K', w: [c - 273, k + 10, c], s: T`$T(\mathrm{K}) = T(^\circ\mathrm{C}) + 273 = ${M(c)} + 273 = ${QT(k, 'K')}$.` }
        : { q: T`Convert ${Q(k, 'K')} to degrees Celsius.`, a: c, u: '°C', w: [k + 273, c + 10, k], s: T`$T(^\circ\mathrm{C}) = T(\mathrm{K}) - 273 = ${M(k)} - 273 = ${QT(c, '°C')}$.` };
    },
    () => pick([
      { q: T`Why does the temperature of ice stay at 0 °C while it melts, even though it is being heated?`, a: T`The energy is used to break the forces holding the particles in place`, w: [T`The thermometer stops working`, T`Heat cannot enter ice`, T`The particles stop moving`], only: 'mc', s: T`During a change of state the energy loosens the particles from each other instead of raising their speed (temperature).` },
      { q: T`Which state of matter can be compressed easily?`, a: T`gas`, w: [T`solid`, T`liquid`, T`none of them`], only: 'mc', s: T`Gas particles are far apart, so they can be pushed closer together.` },
      { q: T`In which state do the particles only vibrate about fixed positions?`, a: T`solid`, w: [T`liquid`, T`gas`, T`all three`], only: 'mc', s: T`Particles in a solid are held in a regular arrangement and can only vibrate.` },
      { q: T`What is the difference between evaporation and boiling?`, a: T`Evaporation happens at the surface at any temperature; boiling happens throughout the liquid at the boiling point`, w: [T`There is no difference`, T`Boiling happens only at the surface`, T`Evaporation needs a flame`], only: 'mc', s: T`Evaporation is a surface process; boiling forms bubbles of vapour throughout the liquid.` },
    ]),
  ],
},
{
  id: 'mixtures', stage: 'jh', title: 'Elements, Compounds, Mixtures & Separation',
  blurb: 'Pure substances and mixtures, elements and compounds, solutions, suspensions and colloids, and how to separate mixtures by filtration, evaporation, distillation, chromatography and more.',
  lesson: () => T`
<p>A <b>pure substance</b> has a fixed composition and fixed properties, such as a sharp melting point. It is either an <b>element</b>, made of one kind of atom, or a <b>compound</b>, two or more elements chemically joined in a fixed ratio. A <b>mixture</b> contains two or more substances that are not chemically joined, in any proportion.</p>
${FigRow([[moleculeBox([[6, MOL.O2]], { seed: 2, label: T`Molecules of an element` }), T`element`], [moleculeBox([[5, MOL.H2O]], { seed: 3, label: T`Molecules of a compound` }), T`compound`], [moleculeBox([[3, MOL.O2], [3, MOL.N2]], { seed: 4, label: T`A mixture of two elements` }), T`mixture of elements`], [moleculeBox([[3, MOL.H2O], [3, MOL.CO2]], { seed: 6, label: T`A mixture of two compounds` }), T`mixture of compounds`]], T`Each ball is an atom: oxygen red, nitrogen blue, hydrogen white, carbon dark grey. An element has one kind of atom; a compound has different atoms joined; a mixture has different particles side by side.`)}
${Tbl([T`Mixture`, T`What it looks like`, T`Examples`], [[T`Homogeneous (solution)`, T`the same throughout; particles smaller than 1 nm; clear`, T`salt water, air, vinegar, brass`], [T`Colloid`, T`looks uniform but scatters light (Tyndall effect); particles 1–1 000 nm`, T`milk, fog, mayonnaise, jelly`], [T`Heterogeneous (suspension)`, T`the parts can be seen; settles on standing`, T`muddy water, sand in water, oil and water`]])}
<h3>Separating mixtures</h3>
<p>Because the parts of a mixture keep their own properties, we can separate them by a <b>physical</b> method that uses a difference between them:</p>
${Tbl([T`Method`, T`Uses a difference in…`, T`Example`], [[T`Filtration`, T`particle size (insoluble solid from liquid)`, T`sand from water`], [T`Evaporation / crystallisation`, T`boiling point (dissolved solid from solvent)`, T`salt from sea water in salt pans`], [T`Distillation`, T`boiling point (liquid from solution, or two liquids)`, T`pure water from salt water; fractional distillation of crude oil`], [T`Chromatography`, T`how strongly each substance is attracted to the paper and the solvent`, T`dyes in ink, pigments in leaves`], [T`Decanting / separating funnel`, T`density; liquids that do not mix`, T`oil from water`], [T`Magnet`, T`magnetism`, T`iron filings from sulfur`], [T`Sublimation`, T`one part sublimes`, T`iodine or ammonium chloride from salt`]])}
${Fig(filtrationSvg({ names: { res: T`residue`, fil: T`filtrate`, paper: T`filter paper` }, label: T`Filtration apparatus: funnel with filter paper above a beaker` }), T`Filtration: the liquid (filtrate) passes through the paper; the insoluble solid (residue) stays behind.`)}
${FigW(distillationSvg({ names: { thermo: T`thermometer`, cond: T`condenser`, win: T`water in`, wout: T`water out`, dist: T`distillate`, mix: T`mixture` }, label: T`Distillation apparatus: heated flask, thermometer, water-cooled condenser and collecting beaker` }), T`Distillation: the liquid with the lower boiling point evaporates, is cooled in the condenser and collects as the distillate.`)}
<h3>Paper chromatography</h3>
${Fig(chromatogramSvg([[55, 36, 'mf-s4'], [55, 102, 'mf-s1'], [99, 102, 'mf-s1'], [143, 36, 'mf-s4'], [143, 66, 'mf-s2']], { names: { front: T`solvent front`, start: T`start line`, solvent: T`solvent` }, label: T`A paper chromatogram of an ink and two dyes` }), T`An ink (left) contains two dyes. The spot at the same height as a known dye is that dye. The distances are measured from the start line.`)}
${Key(T`<p>The <b>retention factor</b> of a spot is</p><p>$$R_f = \frac{\text{distance moved by the substance}}{\text{distance moved by the solvent}}$$</p><p>It is always between 0 and 1, and for a given paper and solvent each substance has its own $R_f$.</p>`)}
${Tip(T`<p>Draw the start line in <b>pencil</b> (ink would itself separate) and keep it <b>above</b> the solvent level, or the spots will dissolve into the solvent instead of moving up the paper.</p>`)}`,
  gens: [
    () => {
      const [d, a] = pick([[T`oxygen gas`, T`element`], [T`iron`, T`element`], [T`copper wire`, T`element`], [T`water`, T`compound`], [T`carbon dioxide`, T`compound`], [T`table salt (sodium chloride)`, T`compound`], [T`air`, T`mixture`], [T`sea water`, T`mixture`], [T`milk`, T`mixture`], [T`glucose`, T`compound`]]);
      return { q: T`Is <b>${d}</b> an element, a compound or a mixture?`, a, w: [T`element`, T`compound`, T`mixture`].filter(x => x !== a), only: 'mc', s: a === T`element` ? T`It contains only one kind of atom: an <b>element</b>.` : a === T`compound` ? T`It is made of different elements chemically joined in a fixed ratio: a <b>compound</b>.` : T`It contains several substances that are not chemically joined: a <b>mixture</b>.` };
    },
    () => {
      const [d, a] = pick([[T`sand from water`, T`filtration`], [T`salt from salt water`, T`evaporation`], [T`pure water from sea water`, T`distillation`], [T`the dyes in a black ink`, T`chromatography`], [T`iron filings from sulfur powder`, T`using a magnet`], [T`cooking oil from water`, T`separating funnel`], [T`petrol, kerosene and diesel from crude oil`, T`fractional distillation`]]);
      return { q: T`Which method is best for separating <b>${d}</b>?`, a, w: [T`filtration`, T`evaporation`, T`distillation`, T`chromatography`, T`using a magnet`, T`separating funnel`, T`fractional distillation`].filter(x => x !== a).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`<b>${a}</b>.` };
    },
    () => {
      const sol = pick([8, 9, 10, 12]), d = pick([2, 3, 4, 5, 6, 7]) * sol / 10, rf = sig(d / sol, 3);
      return { q: T`In a paper chromatogram the solvent front moved ${Q(sol, 'cm')} from the start line and a dye spot moved ${Q(d, 'cm')}. What is the $R_f$ value of the dye?`, a: rf, rtol: 0.01, w: [sig(sol / d, 3), sig(sol - d, 3), sig(d / 10, 3)], s: T`$R_f = \frac{${M(d)}}{${M(sol)}} = ${M(rf)}$.` };
    },
    () => {
      const rf = pick([0.25, 0.3, 0.4, 0.45, 0.6, 0.75]), sol = pick([8, 10, 12]), d = sig(rf * sol, 3);
      return { q: T`A substance has $R_f = ${M(rf)}$. If the solvent front moves ${Q(sol, 'cm')}, how far does the substance move?`, a: d, u: 'cm', rtol: 0.01, w: [sig(sol / rf, 3), sig(sol - d, 3), sig(rf + sol, 3)], s: T`distance $= R_f \times$ solvent distance $= ${M(rf)} \times ${M(sol)} = ${QT(d, 'cm')}$.` };
    },
    () => {
      const salt = pick([2, 3, 3.5, 4]), sea = pick([500, 1000, 2000]), m = sig(salt / 100 * sea, 3);
      return { q: T`Sea water contains about ${Q(salt, '%')} salt by mass. How much salt (in g) is left when ${Q(sea, 'g')} of sea water is evaporated to dryness?`, a: m, u: 'g', rtol: 0.01, w: [sig(sea / salt, 3), sig(salt * sea, 3), sig(sea - m, 3)], s: T`$\frac{${M(salt)}}{100} \times ${M(sea)} = ${QT(m, 'g')}$.` };
    },
    () => pick([
      { q: T`Which mixture shows the Tyndall effect (a beam of light is visible through it)?`, a: T`milk diluted with water`, w: [T`salt water`, T`sugar solution`, T`pure water`], only: 'mc', s: T`Milk is a colloid: its particles are big enough to scatter light, unlike those of a true solution.` },
      { q: T`Why is the start line of a chromatogram drawn in pencil?`, a: T`Pencil graphite does not dissolve and move with the solvent`, w: [T`Pencil is easier to erase`, T`Ink is too expensive`, T`Pencil makes the solvent move faster`], only: 'mc', s: T`Ink contains dyes that would separate and confuse the result.` },
      { q: T`What is the liquid collected at the end of the condenser in distillation called?`, a: T`the distillate`, w: [T`the residue`, T`the filtrate`, T`the solute`], only: 'mc', s: T`The vapour condenses into the <b>distillate</b>.` },
      { q: T`In filtration, what is the solid left on the filter paper called?`, a: T`the residue`, w: [T`the filtrate`, T`the distillate`, T`the solvent`], only: 'mc', s: T`The liquid that passes through is the filtrate; the solid left behind is the <b>residue</b>.` },
    ]),
  ],
},
{
  id: 'lab-skills', stage: 'jh', title: 'Laboratory Safety, Apparatus & Measurement',
  blurb: 'Common apparatus and what it is for, hazard pictograms and safe working, reading a meniscus, significant figures, accuracy and percentage error.',
  lesson: () => T`
<p>Chemistry is learned by doing experiments, and good experiments need the right apparatus, safe habits and careful measurements.</p>
${FigW(apparatusSvg([['beaker', T`beaker`], ['flask', T`conical flask`], ['cylinder', T`measuring cylinder`], ['burette', T`burette`], ['pipette', T`pipette`], ['tube', T`test tube`], ['burner', T`Bunsen burner`]], { label: T`Common laboratory apparatus: beaker, conical flask, measuring cylinder, burette, pipette, test tube and Bunsen burner` }), T`Beakers and conical flasks hold and mix liquids but measure only roughly. A measuring cylinder measures volume; a pipette delivers one exact volume; a burette delivers any volume accurately (used in titrations).`)}
<h3>Hazard symbols</h3>
${FigW(ghsSvg([['flame', T`flammable`], ['corrosive', T`corrosive`], ['toxic', T`toxic`], ['irritant', T`harmful / irritant`], ['health', T`serious health hazard`], ['environment', T`hazardous to the environment`]], { label: T`Six hazard pictograms: flammable, corrosive, toxic, harmful, health hazard and environmental hazard` }), T`Hazard pictograms of the Globally Harmonized System (GHS), used on chemical labels worldwide, including in Indonesia.`)}
${Key(T`<p><b>Safe working.</b> Wear safety goggles and a lab coat; tie back long hair. Never eat or drink in the lab. Point a test tube away from people when heating it. Always add <b>acid to water</b>, slowly, never water to acid. Use a fume cupboard for toxic gases. Report every spill and breakage, and wash off chemicals on the skin with plenty of water.</p>`)}
<h3>Reading a scale</h3>
${Fig(meniscusSvg(24.6, { label: T`Close-up of a measuring cylinder with the bottom of the meniscus at 24.6 mL` }), T`Read the bottom of the curved surface (the meniscus) with your eye level with it. Here the reading is $24.6\,\mathrm{mL}$.`)}
<p>Every measurement has an uncertainty. A reading is usually quoted to half the smallest division or to the nearest division: $24.6\,\mathrm{mL}$ on a cylinder marked every $0.2\,\mathrm{mL}$.</p>
${Tbl([T`Rule for significant figures`, T`Example`, T`s.f.`], [[T`Non-zero digits count`, '$4.73$', '3'], [T`Zeros between digits count`, '$4.07$', '3'], [T`Leading zeros do not count`, '$0.0052$', '2'], [T`Trailing zeros after a decimal point count`, '$2.50$', '3']])}
${Key(T`<p><b>Accuracy</b> is how close a result is to the true value; <b>precision</b> is how close repeated results are to each other.</p><p>$$\text{percentage error} = \frac{|\text{measured} - \text{true}|}{\text{true}} \times 100\%$$</p>`)}
${Tip(T`<p>A calculated answer should not have more significant figures than the least precise measurement used.</p>`)}`,
  gens: [
    () => {
      const [d, a] = pick([[T`delivering exactly 25.0 mL of a solution`, T`pipette`], [T`adding a solution drop by drop during a titration`, T`burette`], [T`measuring about 50 mL of water`, T`measuring cylinder`], [T`heating a small amount of solid`, T`test tube`], [T`swirling a solution during a titration without spilling it`, T`conical flask`], [T`heating a liquid with a flame`, T`Bunsen burner`]]);
      return { q: T`Which piece of apparatus is best for <b>${d}</b>?`, a, w: [T`pipette`, T`burette`, T`measuring cylinder`, T`test tube`, T`conical flask`, T`Bunsen burner`, T`beaker`].filter(x => x !== a).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`<b>${a}</b>.` };
    },
    () => {
      const [k, a] = pick([['flame', T`flammable`], ['corrosive', T`corrosive`], ['toxic', T`toxic`], ['environment', T`hazardous to the environment`], ['irritant', T`harmful / irritant`]]);
      return { q: T`What does this hazard pictogram mean?${Fig(ghsSvg([[k, '']], { label: T`A hazard pictogram` }))}`, a, w: [T`flammable`, T`corrosive`, T`toxic`, T`hazardous to the environment`, T`harmful / irritant`].filter(x => x !== a).sort(() => rng() - 0.5).slice(0, 3), only: 'mc', s: T`It means <b>${a}</b>.` };
    },
    () => {
      const v = pick([12.4, 18.6, 24.2, 31.8, 45.4, 57.0]);
      return { q: T`What is the reading on this measuring cylinder (in mL)?${Fig(meniscusSvg(v, { label: T`A measuring cylinder close-up` }))}`, a: v, u: 'mL', tol: 0.05, w: [v + 0.2, v - 0.2, v + 1], s: T`Read the bottom of the meniscus: ${Q(v, 'mL')}.` };
    },
    () => {
      const [x, n] = pick([['0.0250', 3], ['4.070', 4], ['120.0', 4], ['0.008', 1], ['3.50', 3], ['1.002', 4], ['0.30', 2], ['6.022', 4]]);
      return { q: T`How many significant figures are in $${x.replace('.', I18N.conf.dec === ',' ? '{,}' : '.')}$?`, a: n, w: [n + 1, n - 1 || n + 2, x.replace('.', '').length], s: T`Leading zeros do not count; zeros between or after the digits (after a decimal point) do. It has <b>${n}</b> significant figures.` };
    },
    () => {
      const tru = pick([100, 25.0, 50.0, 1.00]), meas = sig(tru * (1 + pick([-1, 1]) * pick([0.02, 0.03, 0.04, 0.05])), 3), e = sig(Math.abs(meas - tru) / tru * 100, 3);
      return { q: T`A student measures ${Q(meas, 'mL')} when the true volume is ${Q(tru, 'mL')}. What is the percentage error?`, a: e, u: '%', rtol: 0.02, w: [sig(Math.abs(meas - tru), 3), sig(meas / tru * 100, 3), sig(e * 10, 3)], s: T`$\frac{|${M(meas)} - ${M(tru)}|}{${M(tru)}} \times 100\% = ${M(e)}\%$.` };
    },
    () => pick([
      { q: T`How should you dilute a concentrated acid?`, a: T`Add the acid slowly to water`, w: [T`Add water quickly to the acid`, T`Pour both into the sink together`, T`Heat the acid first`], only: 'mc', s: T`Adding acid to water spreads the heat released; adding water to acid can boil and spatter it.` },
      { q: T`Where should you do an experiment that gives off a toxic gas?`, a: T`in a fume cupboard`, w: [T`next to an open window only`, T`on your desk`, T`outside the lab door`], only: 'mc', s: T`A fume cupboard draws the gas away from you.` },
      { q: T`Repeated readings are all close to each other but far from the true value. They are…`, a: T`precise but not accurate`, w: [T`accurate but not precise`, T`accurate and precise`, T`neither accurate nor precise`], only: 'mc', s: T`Close together = precise; far from the true value = not accurate.` },
    ]),
  ],
},
  ],
});
})();
