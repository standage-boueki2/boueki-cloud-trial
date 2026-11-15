#!/usr/bin/env python3
"""21.92 の組み立て。
  本体（トライアル）：21.91 の index.html に層（logic_v2192*.js）を足し、版・build・CSP のハッシュ・version.json を更新する。
  刷新版：本体と同じ index.html に robots の meta と rd/ の層の読み込み（今までの分＋今回の分）を足す。
使い方： python3 build.py <base index.html> <刷新版の base index.html> <ver> <出力: 本体フォルダ> <出力: 刷新版フォルダ> --layer a.js [b.js …] --rd rd_x.css rd_x.js …
"""
import sys, hashlib, base64, re, json, os, shutil, argparse
ap = argparse.ArgumentParser()
ap.add_argument('base'); ap.add_argument('rdbase'); ap.add_argument('ver'); ap.add_argument('out_trial'); ap.add_argument('out_rd')
ap.add_argument('--layer', nargs='*', default=[]); ap.add_argument('--rd', nargs='*', default=[]); ap.add_argument('--old-ver', default='21.91'); ap.add_argument('--old-build', default='927be1d911d1')
a = ap.parse_args()
s = open(a.base, encoding='utf-8', newline='').read()
rd0 = open(a.rdbase, encoding='utf-8', newline='').read()
# 刷新版の土台＝本体＋ robots の meta ＋ 末尾の読み込み。まず今の刷新版が本体と同じ土台かを確かめる
META = '<meta name="robots" content="noindex,nofollow">\n'
i = rd0.index(META)
tail_at = len(s) + len(META)
assert rd0[:i] + rd0[i + len(META):tail_at] == s, '刷新版の土台が本体と一致しません'
rd_tail = rd0[tail_at:]
# 層
L = ''
for f in a.layer:
    t = open(f, encoding='utf-8', newline='').read()
    if t.startswith('"use strict";\n'):
        t = t[len('"use strict";\n'):]
    if not t.endswith('\n'):
        t += '\n'
    L += t
anchor = '\ntry {\n    if (typeof v35Restore === "function")\n        v35Restore();\n}'
assert s.count(anchor) == 1
build = hashlib.sha256((a.old_build + '\n' + L).encode('utf-8')).hexdigest()[:12]
blocks = list(re.finditer(r'<script>(.*?)</script>', s, flags=re.S))
main0 = max(blocks, key=lambda m: len(m.group(1)))
old_hash = base64.b64encode(hashlib.sha256(main0.group(1).encode('utf-8')).digest()).decode()
assert s.count("'sha256-%s'" % old_hash) == 1
s = s.replace(anchor, '\n' + L + anchor[1:], 1)
assert s.count('const BC20_VER = "%s";' % a.old_ver) == 1 and s.count('const BC20_BUILD="%s";' % a.old_build) == 1
s = s.replace('const BC20_VER = "%s";' % a.old_ver, 'const BC20_VER = "%s";' % a.ver).replace('const BC20_BUILD="%s";' % a.old_build, 'const BC20_BUILD="%s";' % build)
blocks = list(re.finditer(r'<script>(.*?)</script>', s, flags=re.S))
main = max(blocks, key=lambda m: len(m.group(1)))
h = base64.b64encode(hashlib.sha256(main.group(1).encode('utf-8')).digest()).decode()
s = s.replace("'sha256-%s'" % old_hash, "'sha256-%s'" % h)
os.makedirs(a.out_trial, exist_ok=True)
open(os.path.join(a.out_trial, 'index.html'), 'w', encoding='utf-8', newline='').write(s)
open(os.path.join(a.out_trial, 'version.json'), 'w', encoding='utf-8', newline='').write(json.dumps({"build": build, "ver": a.ver}))
# 刷新版
tags = ''
os.makedirs(os.path.join(a.out_rd, 'rd'), exist_ok=True)
for f in a.rd:
    b = open(f, 'rb').read()
    v = hashlib.sha256(b).hexdigest()[:10]
    name = os.path.basename(f)
    shutil.copyfile(f, os.path.join(a.out_rd, 'rd', name))
    tags += ('<link rel="stylesheet" href="rd/%s?v=%s">\n' if name.endswith('.css') else '<script src="rd/%s?v=%s"></script>\n') % (name, v)
j = s.index('<script>')
k = s.index('\n', s.index('http-equiv="Content-Security-Policy"')) + 1
rd = s[:k] + META + s[k:] + rd_tail + tags
open(os.path.join(a.out_rd, 'index.html'), 'w', encoding='utf-8', newline='').write(rd)
open(os.path.join(a.out_rd, 'version.json'), 'w', encoding='utf-8', newline='').write(json.dumps({"build": build, "ver": a.ver}))
print('ver', a.ver, 'build', build, 'main hash', h, 'layer bytes', len(L.encode('utf-8')), 'rd tags', len(a.rd))
print('trial sha256', hashlib.sha256(s.encode('utf-8')).hexdigest()[:16], 'rd sha256', hashlib.sha256(rd.encode('utf-8')).hexdigest()[:16])
