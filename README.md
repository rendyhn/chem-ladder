# Chem Ladder

<img src="logo.svg" width="96" alt="">

Chemistry lessons and practice worksheets, topic by topic, from junior high school to the first years of university: from states of matter and atoms to bonding, the mole, energy, acids and bases, electrochemistry and organic chemistry. Every lesson is illustrated with diagrams, models and graphs drawn from real data (particle models, Bohr and orbital diagrams, a coloured periodic table, dot-and-cross and Lewis structures, 3-D molecular shapes, energy profiles, calculated titration curves, cells, spectra and more), and every worksheet is generated fresh when it opens, with worked solutions, an answer key and print-ready pages. English and Bahasa Indonesia.

A companion to [Math Ladder](https://github.com/rendyhn/math-ladder), [Physics Ladder](https://github.com/rendyhn/physics-ladder) and [Geography Ladder](https://github.com/rendyhn/geography-ladder): each topic lists what it builds on, including topics on Math Ladder and Physics Ladder, and links straight to them.

## Contents

The 52 topics are laid out in eleven tracks: 47 for junior and senior high school (A–J) and 5 for the first years of university (K).

| Track | Topics |
|---|---|
| A. Matter & the Laboratory | states of matter & the particle model; elements, compounds, mixtures & separation; lab safety, apparatus & measurement |
| B. Atoms & the Periodic Table | atomic structure & isotopes; models of the atom & spectra; electron configuration & quantum numbers; the periodic table & trends |
| C. Chemical Bonding & Structure | ionic bonding; covalent bonding & Lewis structures; shapes of molecules (VSEPR) & polarity; intermolecular forces & types of structure |
| D. Equations & the Mole | chemical equations & types of reaction; the mole & molar mass; reacting masses, limiting reagent & yield; percentage composition & empirical formulas |
| E. Gases, Solutions & Colloids | gas laws; concentration & solubility; colligative properties; colloids |
| F. Energy, Rates & Equilibrium | enthalpy & calorimetry; Hess's law & bond enthalpies; rates & collision theory; rate laws; chemical equilibrium |
| G. Acids, Bases & Salts | acids, bases & pH; acid–base theories; calculating pH; titration; buffers & salt hydrolysis; solubility product |
| H. Redox & Electrochemistry | oxidation numbers; balancing redox; galvanic cells; electrolysis & Faraday's laws; corrosion |
| I. Organic Chemistry | hydrocarbons; functional groups; isomerism; organic reactions; benzene; polymers; molecules of life |
| J. Elements, Nuclear & Environment | groups 1, 2, 17 & 18; transition metals & complexes; reactivity series & extraction; nuclear chemistry; environmental chemistry |
| K. University Chemistry | hybridisation & molecular orbitals; entropy & Gibbs energy; Arrhenius & mechanisms; spectroscopy; crystal-field theory |

## Answers

- Fill-in answers within about 1% are accepted, unless the question asks for an exact count.
- Units may be typed after the number (`25 mL`, `0.1 mol/L`, `-57 kJ/mol`).
- In Bahasa Indonesia, both `2,5` (decimal comma) and `50.000` (thousands point) are understood.

## Data

Physical data (relative atomic masses, electronegativities, ionisation energies, boiling and melting points, solubilities, standard enthalpies, electrode potentials) follow IUPAC, NIST and the CRC Handbook of Chemistry and Physics. The pH scale follows the US EPA and USGS, carbon dioxide at Mauna Loa the NOAA Global Monitoring Laboratory, and plastic use UNEP (2018). Titration and buffer curves are calculated from the charge balance, not sketched.

## Languages

English and Bahasa Indonesia. Pick one from the menu at the top, or open the page with `?lang=en` or `?lang=id`. Translations were produced with AI assistance and have not yet been reviewed. Corrections are welcome.

## Running it

Open `index.html` in any modern browser, from disk or from a static host, with the `lang/` folder next to it. Formulas and chemical equations are rendered by MathJax (with the mhchem extension) from a CDN, so an internet connection is needed. The page follows the device's light or dark setting, and the sun/moon button switches between them. To save a lesson or worksheet as PDF, use its Print button and choose **Save as PDF**.

## Publishing on GitHub Pages

Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`. The site needs only `index.html`, `.nojekyll` and `lang/`.

## Development

The page is built from `src/`:

```
python build.py
```

This writes `index.html` and `lang/<code>.js`. Edit the files in `src/`, not the built output.

English text in `src/*.js` is written as ``T`...` ``, and each language pack in `src/lang/<code>/` maps a key to its translation. `tools/i18n.py` keeps them in step:

```
python tools/i18n.py catalog     # extract every English string to i18n/
python tools/i18n.py check id    # coverage, placeholders, TeX and HTML checks
python tools/i18n.py missing id  # strings still untranslated
```

## Files

| Path | Purpose |
|---|---|
| `index.html` | The app, built from `src/`. English is built in; other languages load from `lang/`. |
| `lang/<code>.js` | Built language packs. |
| `src/tA-matter.js` … `src/tK-university.js` | Lessons and question generators for each track. |
| `src/cfig.js` | Chemical data (atomic masses, electronegativities, ionisation energies, electrode potentials) and the chemistry figures: atoms, orbitals, periodic table, molecules and shapes, apparatus, energy profiles, titration curves, cells, spectra and more. |
| `src/fig.js`, `src/chem.js` | General figure builders (graphs, charts, flows) and number and unit helpers. |
| `src/ladder.js` | Prerequisite links between topics and to Math Ladder and Physics Ladder, each with its reason. |
| `src/core.js` | Random numbers, number formatting, formula builders, the translation system. |
| `src/app.js` | Navigation, worksheets, answer checking, answer key, printing, language menu, day/night mode. |
| `src/style.css`, `src/head.html`, `src/body.html` | Styles (light/dark, print, chemistry colours) and page skeleton. |
| `src/lang/<code>/` | Translation sources. |
| `tools/i18n.py` | Translation catalogue and checks. |
| `build.py` | Build script. |

## License

- **Code** (the app, question generators, build script and tools): [MIT](LICENSE).
- **Educational content** (lessons, questions, worked solutions, figures, topic links and all translations): [CC BY-NC 4.0](LICENSE-CONTENT). You may share and adapt it with credit to *Chem Ladder by rendyhn*, but not for commercial use. Free use in classrooms, tutoring and self-study is welcome. Ask for permission for commercial use.

The content was prepared with AI assistance and has not yet been fully reviewed by teachers. Please check it before relying on it, and report errors on the issue tracker.

---

© 2026 @rendyhn
