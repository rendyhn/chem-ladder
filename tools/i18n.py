"""Translation tooling for Chem Ladder (same system as Math Ladder).

  python tools/i18n.py catalog        extract every T`...` template -> i18n/catalog.json + i18n/catalog/*.txt
  python tools/i18n.py audit          list string literals in the level files that look like untranslated English
  python tools/i18n.py check [lang]   validate language packs in src/lang/<lang>/ against the catalogue
  python tools/i18n.py status         coverage table for all languages
  python tools/i18n.py missing <lang> [file]   list keys still untranslated (optionally only one level file)

Keys: the static text of a template, with ⟦0⟧, ⟦1⟧… for the ${} slots, hashed with cyrb53
(identical to hashKey() in src/core.js).
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
OUT = ROOT / 'i18n'
CONTENT_FILES = [f for f in ['core.js', 'chem.js', 'fig.js', 'cfig.js', 'tA-matter.js', 'tB-atoms.js', 'tC-bonding.js', 'tD-stoichiometry.js', 'tE-solutions.js', 'tF-energetics.js', 'tG-acids.js', 'tH-redox.js', 'tI-organic.js', 'tJ-elements.js', 'tK-university.js', 'ladder.js'] if (SRC / f).exists()]
LANGS = ['id']
M32 = 0xFFFFFFFF


def hash_key(s):
    h1, h2 = 0xDEADBEEF, 0x41C6CE57
    b = s.encode('utf-16-le')
    for k in range(0, len(b), 2):
        ch = b[k] | (b[k + 1] << 8)
        h1 = ((h1 ^ ch) * 2654435761) & M32
        h2 = ((h2 ^ ch) * 1597334677) & M32
    h1 = (((h1 ^ (h1 >> 16)) * 2246822507) & M32) ^ (((h2 ^ (h2 >> 13)) * 3266489909) & M32)
    h2 = (((h2 ^ (h2 >> 16)) * 2246822507) & M32) ^ (((h1 ^ (h1 >> 13)) * 3266489909) & M32)
    v = 4294967296 * (2097151 & h2) + h1
    digits = '0123456789abcdefghijklmnopqrstuvwxyz'
    out = ''
    while True:
        v, r = divmod(v, 36)
        out = digits[r] + out
        if v == 0:
            return out


# ---------------------------------------------------------------- JS scanning
def skip_string(src, i):
    q = src[i]
    i += 1
    while src[i] != q:
        i += 2 if src[i] == '\\' else 1
    return i + 1


def parse_template(src, i):
    """src[i] is a backtick. Returns (index after closing backtick, raw chunks, expr ranges)."""
    i += 1
    start, chunks, exprs = i, [], []
    while True:
        c = src[i]
        if c == '\\':
            i += 2
            continue
        if c == '`':
            chunks.append(src[start:i])
            return i + 1, chunks, exprs
        if c == '$' and src[i + 1] == '{':
            chunks.append(src[start:i])
            j = skip_expr(src, i + 2)
            exprs.append((i + 2, j))
            i = j + 1
            start = i
            continue
        i += 1


def skip_expr(src, i):
    depth = 0
    while True:
        c = src[i]
        if c in '\'"':
            i = skip_string(src, i)
            continue
        if c == '`':
            i, _, _ = parse_template(src, i)
            continue
        if c == '/' and src[i + 1] == '/':
            i = src.index('\n', i)
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            if depth == 0:
                return i
            depth -= 1
        i += 1


def scan(src, start, end, found, literals, tag='T'):
    """Walk src[start:end]; collect tagged templates (tag`...`) and, optionally, other literals."""
    i = start
    while i < end:
        c = src[i]
        if c in '\'"':
            j = skip_string(src, i)
            if literals is not None:
                literals.append((i, src[i + 1:j - 1]))
            i = j
        elif c == '/' and src[i + 1] == '/':
            i = src.index('\n', i)
        elif c == '/' and src[i + 1] == '*':
            i = src.index('*/', i) + 2
        elif c == '`':
            tagged = src[i - 1] == tag and not (src[i - 2].isalnum() or src[i - 2] in '_$')
            j, chunks, exprs = parse_template(src, i)
            if tagged:
                found.append((i, chunks, [src[a:b] for a, b in exprs]))
            elif literals is not None:
                literals.append((i, '${…}'.join(chunks)))
            for a, b in exprs:
                scan(src, a, b, found, literals, tag)
            i = j
        else:
            i += 1


def template_key(chunks):
    return ''.join((f'⟦{k - 1}⟧' if k else '') + s for k, s in enumerate(chunks))


def read_src(name):
    return (SRC / name).read_text(encoding='utf-8').replace('\r\n', '\n')


def topic_at(src, pos, marks):
    t = 'core'
    for p, name in marks:
        if p > pos:
            break
        t = name
    return t


def is_prose(en):
    return bool(re.search(r'[A-Za-z]{2,}', re.sub(r'\\[A-Za-z]+|<[^>]+>|\$[^$]*\$|&\w+;', ' ', en))) or '\\text{' in en


def needed(en, lang):
    """Pure-maths entries only need a translation in decimal-comma languages (their numbers change)."""
    return lang in COMMA_LANGS or is_prose(en)


def build_catalog():
    entries, seen = [], {}
    for fname in CONTENT_FILES:
        src = read_src(fname)
        found = []
        scan(src, 0, len(src), found, None)
        marks = [(m.start(), m.group(1)) for m in re.finditer(r"\bid: '([a-z0-9-]+)'", src)]
        for pos, chunks, exprs in sorted(found, key=lambda f: f[0]):
            en = template_key(chunks)
            if not is_prose(en) and not EN_NUM.search(en):
                continue  # pure maths / markup, nothing to translate (maths with 4{,}307 or 0.5 is kept for comma languages)
            key = hash_key(en)
            if key in seen:
                if seen[key]['en'] != en:
                    raise SystemExit(f'hash collision: {key}')
                continue
            e = {'key': key, 'file': fname, 'topic': topic_at(src, pos, marks), 'en': en, 'slots': exprs}
            seen[key] = e
            entries.append(e)
    return entries


def cmd_catalog():
    entries = build_catalog()
    OUT.mkdir(exist_ok=True)
    (OUT / 'catalog').mkdir(exist_ok=True)
    (OUT / 'catalog.json').write_text(json.dumps({e['key']: e['en'] for e in entries}, ensure_ascii=False, indent=0), encoding='utf-8')
    by_file = {}
    for e in entries:
        by_file.setdefault(e['file'], []).append(e)
    for fname, items in by_file.items():
        lines, topic = [], None
        for e in items:
            if e['topic'] != topic:
                topic = e['topic']
                lines.append(f'\n##### {topic}')
            hint = '  ; ' + ' | '.join(f'{k}={s.strip()[:40]}' for k, s in enumerate(e['slots'])) if e['slots'] else ''
            lines.append(f"@{e['key']}{hint}\n{e['en']}")
        (OUT / 'catalog' / (fname.replace('.js', '') + '.txt')).write_text('\n'.join(lines).strip() + '\n', encoding='utf-8')
    chars = sum(len(e['en']) for e in entries)
    print(f'{len(entries)} strings, {chars / 1000:.0f}k characters')
    for fname, items in by_file.items():
        print(f'  {fname:22} {len(items):5} strings  {sum(len(e["en"]) for e in items) / 1000:6.1f}k chars')


def cmd_audit():
    for fname in CONTENT_FILES[1:]:
        src = read_src(fname)
        lits, found = [], []
        scan(src, 0, len(src), found, lits)
        for pos, text in lits:
            plain = re.sub(r'\$\{…\}|\\[A-Za-z]+|<[^>]+>', ' ', text)
            if re.search(r'[A-Za-z]{3,}', plain) or re.search(r'\\text\{[^}]*[A-Za-z]{2,}', text):
                line = src.count('\n', 0, pos) + 1
                print(f'{fname}:{line}: {text[:110]!r}')


# ---------------------------------------------------------------- packs
def load_pack(lang):
    """Returns {kind: {key: text}} parsed from src/lang/<lang>/*.js (addT/addUI/addMeta calls with R`...` values)."""
    pack = {'t': {}, 'ui': {}}
    d = SRC / 'lang' / lang
    if not d.exists():
        return pack
    for f in sorted(d.glob('*.js')):
        src = f.read_text(encoding='utf-8').replace('\r\n', '\n')
        for m in re.finditer(r'\badd(T|UI)\(\s*\'' + lang + r'\'\s*,\s*\{', src):
            kind = m.group(1).lower()
            end = skip_expr(src, m.end())
            body = src[m.end():end]
            found = []
            scan(body, 0, len(body), found, None, tag='R')
            for pos, chunks, exprs in found:
                km = re.search(r'''['"]?([\w$]+)['"]?\s*:\s*R$''', body[:pos])
                if not km:
                    raise SystemExit(f'{f.name}: cannot find key before offset {pos}')
                if exprs:
                    raise SystemExit(f'{f.name}: key {km.group(1)} contains ${{}} — write slots as ⟦n⟧')
                pack[kind][km.group(1)] = chunks[0]
    return pack


TAGS = re.compile(r'</?(b|i|p|ol|ul|li|h3|br|div|table|tr|td|th|code|sup|sub)\b')


COMMA_LANGS = {'es', 'fr', 'de', 'pt', 'ru', 'id'}
# English-style numbers: TeX thousands 10{,}000, text thousands 3,462, decimals 0.5
EN_NUM = re.compile(r'(?<![\d.])(?:\d+(?:\{,\}\d{3})+(?!\d)|\d{1,3}(?:,\d{3})+(?![\d,])|\d+\.\d+(?![\d.]))')


def problems(en, tx, lang=None):
    out = []
    if lang in COMMA_LANGS:
        stale = sorted({n for n in EN_NUM.findall(en) if re.search(r'(?<![\d.])' + re.escape(n) + r'(?![\d])', tx)})
        if stale:
            out.append('English number format: ' + ' '.join(stale[:6]))
    s_en, s_tx = sorted(set(re.findall(r'⟦\d+⟧', en))), sorted(set(re.findall(r'⟦\d+⟧', tx)))
    if s_en != s_tx:
        out.append(f'slots {s_en} vs {s_tx}')
    if en.count('$') % 2 == 0 and tx.count('$') % 2 == 1:
        out.append('odd number of $')
    if en.count('$$') != tx.count('$$'):
        out.append('display-math count differs')
    t_en, t_tx = sorted(TAGS.findall(en)), sorted(TAGS.findall(tx))
    if t_en != t_tx:
        out.append('HTML tags differ')
    if tx.count('{') != tx.count('}'):
        out.append('unbalanced { }')
    return out


def cmd_check(langs):
    cat = json.loads((OUT / 'catalog.json').read_text(encoding='utf-8'))
    ui_en = load_ui_en()
    bad = 0
    for lang in langs:
        pack = load_pack(lang)
        req = [k for k in cat if needed(cat[k], lang)]
        missing = [k for k in req if k not in pack['t']]
        extra = [k for k in pack['t'] if k not in cat]
        errs = [(k, p) for k in cat if k in pack['t'] for p in problems(cat[k], pack['t'][k], lang)]
        ui_missing = [k for k in ui_en if k not in pack['ui']]
        ui_errs = [(k, p) for k in ui_en if k in pack['ui'] for p in problems(ui_en[k], pack['ui'][k])]
        print(f'{lang}: {len(req) - len(missing)}/{len(req)} content, {len(ui_en) - len(ui_missing)}/{len(ui_en)} ui, '
              f'{len(missing)} missing, {len(extra)} stale, {len(errs) + len(ui_errs)} problems')
        for k, p in (errs + ui_errs)[:40]:
            print(f'   {k}: {p}')
        bad += len(errs) + len(ui_errs)
    return bad


def cmd_missing(lang, fil=None):
    pack = load_pack(lang)['t']
    for e in build_catalog():
        if (not fil or fil in e['file']) and needed(e['en'], lang) and e['key'] not in pack:
            print(f"{e['file']:20} {e['topic']:24} {e['key']:14} {e['en'][:70]!r}")


def load_ui_en():
    src = read_src('app.js')
    m = re.search(r'const UI_EN = \{', src)
    body = src[m.end():skip_expr(src, m.end())]
    return {k: v for k, v in re.findall(r"(\w+): '((?:[^'\\]|\\.)*)'", body)}


def cmd_status():
    cat = json.loads((OUT / 'catalog.json').read_text(encoding='utf-8'))
    files = {}
    for e in build_catalog():
        files.setdefault(e['file'], {})[e['key']] = e['en']
    ui_en = load_ui_en()
    print('lang  ui      ' + '  '.join(f'{f[:10]:>10}' for f in files))
    for lang in LANGS:
        p = load_pack(lang)
        cells = []
        for ents in files.values():
            keys = {k for k, en in ents.items() if needed(en, lang)}
            cells.append(f'{len(keys & p["t"].keys()):>4}/{len(keys):<5}')
        print(f'{lang:5} {len(set(ui_en) & p["ui"].keys()):>3}/{len(ui_en):<3} ' + '  '.join(cells))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'catalog'
    if cmd == 'catalog':
        cmd_catalog()
    elif cmd == 'audit':
        cmd_audit()
    elif cmd == 'check':
        sys.exit(1 if cmd_check(sys.argv[2:] or LANGS) else 0)
    elif cmd == 'status':
        cmd_status()
    elif cmd == 'missing':
        cmd_missing(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
    elif cmd == 'hash':
        print(hash_key(sys.argv[2]))
