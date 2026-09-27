"""Inline src/ into a single page plus one file per language.

   python build.py              -> index.html + lang/<code>.js (open index.html directly, or host on GitHub Pages)
   python build.py --artifact   -> also dist/ (body-only page + lang files for a claude.ai Artifact)
"""
import pathlib
import shutil
import sys

root = pathlib.Path(__file__).parent
src = root / 'src'
read = lambda name: (src / name).read_text(encoding='utf-8')

js_files = [f for f in ['core.js', 'chem.js', 'fig.js', 'cfig.js', 'tA-matter.js', 'tB-atoms.js', 'tC-bonding.js', 'tD-stoichiometry.js', 'tE-solutions.js', 'tF-energetics.js', 'tG-acids.js', 'tH-redox.js', 'tI-organic.js', 'tJ-elements.js', 'tK-university.js', 'ladder.js', 'facts.js', 'subjects.js', 'app.js'] if (src / f).exists()]
js = '\n'.join(read(f) for f in js_files)
assert '</script' not in js.lower(), 'script body must not contain a closing script tag'

head = read('head.html').replace('/*CSS*/', read('style.css'))
body = read('body.html')
script = '<script>\n' + js + '\n</script>\n'

page = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head + '</head>\n<body>\n' + body + script + '</body>\n</html>\n')
(root / 'index.html').write_text(page, encoding='utf-8')
print(f'index.html  {len(page.encode()) / 1024:.0f} KB')

# language packs: src/lang/<code>/*.js -> lang/<code>.js
out_lang = root / 'lang'
out_lang.mkdir(exist_ok=True)
packs = {}
for d in sorted((src / 'lang').glob('*')) if (src / 'lang').exists() else []:
    if d.is_dir():
        text = '\n'.join(f.read_text(encoding='utf-8') for f in sorted(d.glob('*.js')))
        packs[d.name] = text
        (out_lang / f'{d.name}.js').write_text(text, encoding='utf-8')
if packs:
    print('lang/       ' + ', '.join(f'{c} {len(t.encode()) / 1024:.0f} KB' for c, t in packs.items()))

# offline support: the service worker is generated so that its cache name changes with every build
import hashlib, json, re
sw_files = ['index.html', 'manifest.webmanifest'] + [f'icons/{p.name}' for p in sorted((root / 'icons').glob('*.png'))]   # language packs are cached when first used
version = hashlib.sha256(b''.join((root / f).read_bytes() for f in sw_files + [f'lang/{c}.js' for c in packs])).hexdigest()[:10]
head_html = read('head.html')
warm = re.findall(r'https://(?:cdn\.jsdelivr\.net|fonts\.googleapis\.com/css2)[^"\']*', head_html)
if '[tex]/mhchem' in head_html: warm.append('https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/input/tex/extensions/mhchem.js')
(root / 'sw.js').write_text(read('sw.js').replace('__VERSION__', version).replace('__FILES__', json.dumps(['./'] + sw_files)).replace('__WARM__', json.dumps(warm)), encoding='utf-8')
print(f'sw.js       cache {version}')

if '--artifact' in sys.argv:
    fragment = head + body + script
    dist = root / 'dist'
    dist.mkdir(exist_ok=True)
    (dist / 'chem-ladder.html').write_text(fragment, encoding='utf-8')
    if (dist / 'lang').exists():
        shutil.rmtree(dist / 'lang')
    shutil.copytree(out_lang, dist / 'lang')
    print(f'dist/chem-ladder.html  {len(fragment.encode()) / 1024:.0f} KB (+ lang/)')
