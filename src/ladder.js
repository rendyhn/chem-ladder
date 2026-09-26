/* ==========================================================================
   The ladder: which topics each topic builds on, and why.
   link(from, to, why): "to" builds on "from". An end may be a topic that is
   still planned (shown greyed out), math:<id> (a topic on Math Ladder) or
   phys:<id> (a topic on Physics Ladder); those open in a new tab.
   The reason is shown on both pages, so it has to read well from either side.
   ========================================================================== */
const LADDER = [];
const link = (from, to, why) => LADDER.push({ from, to, why });
/* topics on the sister sites used as prerequisites (English titles; packs translate them under meta.math / meta.phys) */
const EXT = {
  math: {
    url: 'https://rendyhn.github.io/math-ladder/', icon: '∑', label: 'mathLadder',
    topics: {
      'ratio': 'Ratio, Rates & Proportion', 'percent': 'Percentages', 'measurement': 'Measurement & Units', 'sci-notation': 'Scientific Notation',
      'exponents': 'Exponents & Roots', 'linear-eq': 'Linear Equations', 'linear-functions': 'Linear Functions & Graphs', 'systems': 'Systems of Linear Equations',
      'exp-log': 'Exponents & Logarithms', 'quadratics': 'Quadratic Equations', 'angles-shapes': 'Angles & Shapes', 'derivatives': 'Derivatives',
      'integrals': 'Integrals', 'ode': 'Differential Equations', 'statistics-jh': 'Statistics: Centre & Spread', 'combinatorics': 'Counting, Permutations & Combinations',
    },
  },
  phys: {
    url: 'https://rendyhn.github.io/physics-ladder/', icon: 'Φ', label: 'physLadder',
    topics: {
      'units': 'Quantities, Units & Conversions', 'measurement': 'Measurement & Significant Figures', 'heat': 'Temperature, Heat & Expansion',
      'gases': 'Kinetic Theory & Ideal Gases', 'thermo-laws': 'Laws of Thermodynamics & Heat Engines', 'electrostatics': 'Electrostatics: Charge, Force & Field',
      'current-ohm': 'Current, Voltage & Ohm’s Law', 'em-waves': 'Electromagnetic Waves', 'photons': 'Photons & the Photoelectric Effect',
      'atoms': 'Atomic Models & Spectra', 'radioactivity': 'Nuclei & Radioactivity', 'nuclear-energy': 'Nuclear Energy: Fission & Fusion',
      'climate': 'Global Warming & the Greenhouse Effect', 'fluid-statics': 'Fluids at Rest',
    },
  },
};

/* ---------- A. Matter ---------- */
link('phys:heat', 'states', () => T`Heating and cooling change the energy of the particles, which is what drives a change of state.`);
link('states', 'mixtures', () => T`Separating mixtures uses differences in melting and boiling points.`);
link('math:ratio', 'mixtures', () => T`The Rf value is a ratio of two distances.`);
link('phys:measurement', 'lab-skills', () => T`Reading scales, uncertainty and significant figures come from careful measurement.`);
link('math:percent', 'lab-skills', () => T`Percentage error compares a result with the true value.`);
/* ---------- B. Atoms ---------- */
link('mixtures', 'atomic-structure', () => T`Elements and compounds are built from atoms.`);
link('atomic-structure', 'atomic-models', () => T`The models describe where the protons, neutrons and electrons are.`);
link('phys:atoms', 'atomic-models', () => T`Bohr's energy levels and line spectra are the physics behind the atomic models.`);
link('phys:photons', 'atomic-models', () => T`Each spectral line is a photon of energy E = hf.`);
link('atomic-models', 'electron-config', () => T`Shells and orbitals come from the Bohr and quantum models.`);
link('electron-config', 'periodic-table', () => T`The position in the table follows from the electron configuration.`);
/* ---------- C. Bonding ---------- */
link('periodic-table', 'ionic-bonding', () => T`Metals on the left lose electrons and non-metals on the right gain them.`);
link('phys:electrostatics', 'ionic-bonding', () => T`The ionic bond is the electrostatic attraction between opposite charges.`);
link('electron-config', 'covalent-bonding', () => T`Covalent bonds share the valence electrons to complete an octet.`);
link('periodic-table', 'covalent-bonding', () => T`Electronegativity, a periodic trend, decides how polar a bond is.`);
link('covalent-bonding', 'molecular-shapes', () => T`VSEPR counts the bonding and lone pairs of the Lewis structure.`);
link('math:angles-shapes', 'molecular-shapes', () => T`Molecular shapes are described by their bond angles.`);
link('molecular-shapes', 'forces-structures', () => T`Whether a molecule is polar decides which intermolecular forces act.`);
link('ionic-bonding', 'forces-structures', () => T`Giant ionic lattices are one of the four types of structure.`);
link('states', 'forces-structures', () => T`Melting and boiling points measure the forces between particles.`);
/* ---------- D. Equations & the mole ---------- */
link('ionic-bonding', 'chemical-equations', () => T`Correct formulas are needed before an equation can be balanced.`);
link('math:linear-eq', 'chemical-equations', () => T`Balancing an equation means making the atom counts on both sides equal.`);
link('chemical-equations', 'mole-concept', () => T`The mole counts the particles that equations are about.`);
link('atomic-structure', 'mole-concept', () => T`Molar masses come from relative atomic masses.`);
link('math:sci-notation', 'mole-concept', () => T`The Avogadro constant is 6.02 × 10²³, written in scientific notation.`);
link('mole-concept', 'reacting-quantities', () => T`Every reacting-mass calculation goes through moles.`);
link('math:ratio', 'reacting-quantities', () => T`Mole ratios from the equation are proportions.`);
link('mole-concept', 'empirical-formula', () => T`Dividing masses by molar masses gives the mole ratio of the elements.`);
link('math:percent', 'empirical-formula', () => T`Composition is given as a percentage by mass.`);
/* ---------- E. Gases & solutions ---------- */
link('phys:gases', 'gas-laws', () => T`The gas laws follow from the kinetic theory of gases.`);
link('mole-concept', 'gas-laws', () => T`PV = nRT uses the amount of gas in moles.`);
link('mole-concept', 'concentration', () => T`Concentration is moles of solute per litre.`);
link('forces-structures', 'concentration', () => T`"Like dissolves like" depends on the forces between particles.`);
link('concentration', 'colligative', () => T`Colligative effects depend on the concentration of dissolved particles.`);
link('states', 'colligative', () => T`Freezing and boiling points are changes of state.`);
link('mixtures', 'colloids', () => T`Colloids sit between true solutions and suspensions.`);
link('concentration', 'colloids', () => T`Colloids are compared with true solutions.`);
/* ---------- F. Energy, rates & equilibrium ---------- */
link('phys:heat', 'thermochemistry', () => T`Calorimetry uses q = mcΔT from heat and temperature.`);
link('chemical-equations', 'thermochemistry', () => T`ΔH belongs to the amounts in a balanced equation.`);
link('thermochemistry', 'hess-law', () => T`Hess's law adds enthalpy changes.`);
link('covalent-bonding', 'hess-law', () => T`Bond enthalpies measure the strength of covalent bonds.`);
link('thermochemistry', 'reaction-rates', () => T`Activation energy appears on the energy profile.`);
link('concentration', 'reaction-rates', () => T`Rate is a change of concentration per unit time.`);
link('reaction-rates', 'rate-laws', () => T`Rate equations make the effect of concentration quantitative.`);
link('math:exp-log', 'rate-laws', () => T`First-order decay is exponential and its half-life uses ln 2.`);
link('reaction-rates', 'equilibrium', () => T`At equilibrium the forward and backward rates are equal.`);
link('concentration', 'equilibrium', () => T`Kc is written with equilibrium concentrations.`);
/* ---------- G. Acids & bases ---------- */
link('ionic-bonding', 'acids-bases-intro', () => T`Acids and alkalis are defined by the ions H⁺ and OH⁻.`);
link('chemical-equations', 'acids-bases-intro', () => T`Neutralisation and the reactions of acids are written as equations.`);
link('acids-bases-intro', 'acid-base-theories', () => T`The theories explain what makes a substance acidic or basic.`);
link('equilibrium', 'acid-base-theories', () => T`Weak acids set up an equilibrium described by Ka.`);
link('acid-base-theories', 'ph-calculations', () => T`Strong and weak acids need different pH calculations.`);
link('math:exp-log', 'ph-calculations', () => T`pH is a negative base-10 logarithm.`);
link('ph-calculations', 'titration', () => T`A titration curve plots pH against volume.`);
link('reacting-quantities', 'titration', () => T`Titration calculations use n = cV and the mole ratio.`);
link('ph-calculations', 'buffers-salts', () => T`Buffer and salt pH come from Ka and Kb.`);
link('titration', 'buffers-salts', () => T`The flat part of a weak-acid titration curve is a buffer region.`);
link('equilibrium', 'solubility-product', () => T`Ksp is the equilibrium constant of a solubility equilibrium.`);
link('concentration', 'solubility-product', () => T`Solubility is expressed as a molar concentration.`);
/* ---------- H. Redox ---------- */
link('ionic-bonding', 'redox-basics', () => T`Ions form by losing or gaining electrons, which is oxidation and reduction.`);
link('redox-basics', 'balancing-redox', () => T`Half-equations use oxidation numbers and electrons.`);
link('chemical-equations', 'balancing-redox', () => T`Redox equations must balance atoms and charge.`);
link('redox-basics', 'galvanic-cells', () => T`A galvanic cell separates oxidation from reduction.`);
link('phys:current-ohm', 'galvanic-cells', () => T`Cells drive a current through a circuit.`);
link('galvanic-cells', 'electrolysis', () => T`Electrolysis runs a redox reaction backwards with a power supply.`);
link('mole-concept', 'electrolysis', () => T`Faraday's laws turn charge into moles of electrons.`);
link('galvanic-cells', 'corrosion', () => T`Rusting is a small electrochemical cell on the iron surface.`);
/* ---------- I. Organic ---------- */
link('covalent-bonding', 'hydrocarbons', () => T`Carbon forms four covalent bonds.`);
link('forces-structures', 'hydrocarbons', () => T`Boiling points of alkanes follow the London forces.`);
link('hydrocarbons', 'functional-groups', () => T`Functional groups are attached to a hydrocarbon skeleton.`);
link('hydrocarbons', 'isomerism', () => T`Chain isomers differ in how the carbon skeleton branches.`);
link('molecular-shapes', 'isomerism', () => T`Stereoisomers differ in the 3-D arrangement around atoms.`);
link('functional-groups', 'organic-reactions', () => T`Each functional group has its own reactions.`);
link('redox-basics', 'organic-reactions', () => T`Alcohols are oxidised to aldehydes, ketones and acids.`);
link('organic-reactions', 'benzene', () => T`Benzene is compared with the addition reactions of alkenes.`);
link('organic-reactions', 'polymers', () => T`Addition and condensation reactions make polymers.`);
link('functional-groups', 'biomolecules', () => T`Sugars, proteins and fats are built from organic functional groups.`);
link('polymers', 'biomolecules', () => T`Starch, proteins and DNA are natural condensation polymers.`);
/* ---------- J. Elements, nuclear & environment ---------- */
link('periodic-table', 'group-chemistry', () => T`Group properties follow the periodic trends.`);
link('redox-basics', 'group-chemistry', () => T`Halogen displacement is a redox reaction.`);
link('electron-config', 'transition-metals', () => T`Transition metals fill a d subshell.`);
link('covalent-bonding', 'transition-metals', () => T`Ligands bond to the metal by coordinate bonds.`);
link('group-chemistry', 'metals-extraction', () => T`The reactivity of a metal decides how it is extracted.`);
link('electrolysis', 'metals-extraction', () => T`Reactive metals are extracted by electrolysis.`);
link('atomic-structure', 'nuclear-chemistry', () => T`Nuclear reactions change the numbers of protons and neutrons.`);
link('phys:radioactivity', 'nuclear-chemistry', () => T`Alpha, beta and gamma radiation and half-life come from nuclear physics.`);
link('math:exp-log', 'nuclear-chemistry', () => T`Radioactive decay is exponential.`);
link('acids-bases-intro', 'environmental-chemistry', () => T`Acid rain is explained by acid–base chemistry.`);
link('phys:climate', 'environmental-chemistry', () => T`The greenhouse effect is the physics behind climate change.`);
link('colloids', 'environmental-chemistry', () => T`Water treatment uses coagulation of colloids.`);
/* ---------- K. University ---------- */
link('molecular-shapes', 'molecular-orbitals', () => T`Hybridisation explains the VSEPR shapes.`);
link('electron-config', 'molecular-orbitals', () => T`Molecular orbitals are filled like atomic orbitals.`);
link('hess-law', 'chemical-thermodynamics', () => T`ΔG combines the enthalpy change with entropy.`);
link('equilibrium', 'chemical-thermodynamics', () => T`ΔG° = −RT ln K links energy and equilibrium.`);
link('phys:thermo-laws', 'chemical-thermodynamics', () => T`Entropy and the second law come from thermodynamics.`);
link('rate-laws', 'advanced-kinetics', () => T`Integrated rate laws extend the rate equation.`);
link('math:exp-log', 'advanced-kinetics', () => T`The Arrhenius equation is linearised with logarithms.`);
link('math:ode', 'advanced-kinetics', () => T`Integrated rate laws are solutions of differential equations.`);
link('functional-groups', 'spectroscopy', () => T`IR spectra identify functional groups.`);
link('phys:em-waves', 'spectroscopy', () => T`Each technique uses a different part of the electromagnetic spectrum.`);
link('transition-metals', 'crystal-field', () => T`Crystal-field theory explains the colours of complexes.`);
link('molecular-orbitals', 'crystal-field', () => T`d-orbital splitting builds on orbital theory.`);
