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
    topics: {},
  },
  phys: {
    url: 'https://rendyhn.github.io/physics-ladder/', icon: 'Φ', label: 'physLadder',
    topics: {},
  },
};
