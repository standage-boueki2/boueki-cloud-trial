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
# 21.94 r9p：「読み込み中」の層（名前に boot が入る rd_v92*boot.css／.js）は特別な場所に置く
#   *boot.css → head の <style id="r9pboot">（最初の描画から効く。CSP は style-src 'unsafe-inline'）
#   *boot.js  → 刷新版の層のいちばん前（rd.js より前）の <script src>（window.RDX ができた瞬間に RDX.after を包むため）
boot_css = ''
boot_tags = ''
for f in a.rd:
    b = open(f, 'rb').read()
    v = hashlib.sha256(b).hexdigest()[:10]
    name = os.path.basename(f)
    if re.match(r'^rd_v92\w*boot\.css$', name):
        boot_css += b.decode('utf-8')
        continue
    shutil.copyfile(f, os.path.join(a.out_rd, 'rd', name))
    if re.match(r'^rd_v92\w*boot\.js$', name):
        boot_tags += '<script src="rd/%s?v=%s"></script>\n' % (name, v)
        continue
    tags += ('<link rel="stylesheet" href="rd/%s?v=%s">\n' if name.endswith('.css') else '<script src="rd/%s?v=%s"></script>\n') % (name, v)
j = s.index('<script>')
k = s.index('\n', s.index('http-equiv="Content-Security-Policy"')) + 1
head_add = META + (('<style id="r9pboot">\n%s</style>\n' % boot_css) if boot_css else '')
assert not rd_tail.startswith('<script') and rd_tail.startswith('\n')
body_tail = boot_tags + rd_tail[1:] + tags

# 21.94 r9p：刷新版の層（21.93 の約50本＋この作業の約60本＝link 52・script 58）を、CSS 1本・JS 1本にまとめる。
#   1本ずつの読み込みのたびに、取り寄せ→解析→実行→（途中の描画・タイマー）が挟まり、文書の解析が終わるまで（DOMContentLoaded）が
#   2秒あまり延びていた（8820 も同じ）。まとめても中身・順は同じ：
#   ・CSS：タグの順に連結。@import（rd2.css の Web フォント）は先頭へ（CSS の決まり。中身は @font-face だけで順は効かない）。url() は同じ rd/ の中なので変わらない。
#   ・JS：タグの順に連結。どのファイルも、いちばん外は式・if・try だけ（宣言・ファイルの頭の "use strict" なし。m/toplevel.cjs で確かめる）なので、
#     1本にしても名前はぶつからない。ファイルごとに try { } で囲み、1本の例外がほかの層を止めないようにする（前と同じ）。
#     構文の通らないファイルがあれば、まとめずに今までどおり別のタグで読む。
#   ・CSS は JS より前に1本で読むので、どの層も、全部の CSS がそろった状態で動く（読み込み中の仕上げは rd_v92r9pboot.js が止めている）。
#   読めない形のタグ・ハッシュの合わないファイルがあったら、まとめずに今までどおりのタグにする。
def bundle(tail_html):
    items = []
    for line in tail_html.strip('\n').split('\n'):
        m = re.match(r'^<link rel="stylesheet" href="rd/([^"?]+)\?v=([0-9a-f]+)">$', line)
        kind = 'css'
        if not m:
            m = re.match(r'^<script src="rd/([^"?]+)\?v=([0-9a-f]+)"></script>$', line)
            kind = 'js'
        if not m:
            print('bundle: 読めないタグ', line[:80]); return None
        p = os.path.join(a.out_rd, 'rd', m.group(1))
        if not os.path.exists(p):
            print('bundle: ファイルがない', m.group(1)); return None
        b = open(p, 'rb').read()
        if hashlib.sha256(b).hexdigest()[:10] != m.group(2):
            print('bundle: ハッシュが合わない', m.group(1)); return None
        items.append((kind, m.group(1), b.decode('utf-8')))
    import subprocess, tempfile
    js = [x for x in items if x[0] == 'js']
    # 構文の確かめ（classic script として）
    chk = "const vm=require('vm'),fs=require('fs');for(const f of process.argv.slice(1)){try{new vm.Script(fs.readFileSync(f,'utf8'),{filename:f})}catch(e){console.log(require('path').basename(f))}}"
    r = subprocess.run(['node', '-e', chk] + [os.path.join(a.out_rd, 'rd', x[1]) for x in js], capture_output=True, text=True)
    bad = set(r.stdout.split())
    if r.returncode != 0:
        print('bundle: 構文の確かめができない', r.stderr[:200]); return None
    # CSS：ファイルごとに { } がそろい、コメント・文字列が閉じていること（閉じていないと、つないだ次のファイルを飲み込む）
    def css_ok(t):
        d, i, st, n = 0, 0, None, len(t)
        while i < n:
            c = t[i]
            if st == 'c':
                if c == '*' and t[i + 1:i + 2] == '/': st = None; i += 2; continue
                i += 1; continue
            if st:
                if c == '\\': i += 2; continue
                if c == st: st = None
                i += 1; continue
            if c == '/' and t[i + 1:i + 2] == '*': st = 'c'; i += 2; continue
            if c in '"\'': st = c; i += 1; continue
            if c == '{': d += 1
            elif c == '}':
                d -= 1
                if d < 0: return False
            i += 1
        return d == 0 and st is None
    for kind, name, t in items:
        if kind == 'css' and not css_ok(t):
            print('bundle: CSS の括弧・コメントが閉じていない', name); return None
    imports, css = [], []
    for kind, name, t in items:
        if kind != 'css':
            continue
        def hoist(m):
            imports.append(m.group(0).strip()); return ''
        t = re.sub(r'(?m)^\s*@charset[^;]*;\s*$', '', t)
        t = re.sub(r'(?m)^[ \t]*@import\s[^\n]*;[ \t]*$', hoist, t)  # 1行の @import（URL の中に ; があってもよい）
        css.append('/* ==== %s ==== */\n%s\n' % (name, t))
    css_txt = '/* rd_v92all.css：刷新版の層の CSS %d 本をタグの順にまとめたもの（21.94 r9p の build.py が作る。元は rd/ の同じ名前のファイル） */\n' % len(css) + ''.join(x + '\n' for x in imports) + ''.join(css)
    parts, sep = [], []
    for kind, name, t in items:
        if kind != 'js':
            continue
        if name in bad:
            sep.append(name); continue
        parts.append('/* ==== %s ==== */\ntry {\n%s\n} catch (e) { try { console.error("[rd] %s", e); } catch (x) { } }\n' % (name, t, name))
    js_txt = '/* rd_v92all.js：刷新版の層の JS %d 本をタグの順にまとめたもの（21.94 r9p の build.py が作る。元は rd/ の同じ名前のファイル。ファイルごとに try で区切る） */\n' % len(parts) + ''.join(parts)
    # まとめたものも classic script として通ること
    tf = tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8'); tf.write(js_txt); tf.close()
    r = subprocess.run(['node', '-e', chk, tf.name], capture_output=True, text=True); os.unlink(tf.name)
    if r.returncode != 0 or r.stdout.strip():
        print('bundle: まとめた JS が通らない', r.stdout[:200], r.stderr[:200]); return None
    out = ''
    for nm, txt in (('rd_v92all.css', css_txt), ('rd_v92all.js', js_txt)):
        bb = txt.encode('utf-8')
        open(os.path.join(a.out_rd, 'rd', nm), 'wb').write(bb)
        v = hashlib.sha256(bb).hexdigest()[:10]
        out += ('<link rel="stylesheet" href="rd/%s?v=%s">\n' if nm.endswith('.css') else '<script src="rd/%s?v=%s"></script>\n') % (nm, v)
    for name in sep:
        b = open(os.path.join(a.out_rd, 'rd', name), 'rb').read()
        out += '<script src="rd/%s?v=%s"></script>\n' % (name, hashlib.sha256(b).hexdigest()[:10])
    print('bundle: css %d 本 %d bytes / js %d 本 %d bytes / 別のタグ %d 本 %s' % (len(css), len(css_txt.encode('utf-8')), len(parts), len(js_txt.encode('utf-8')), len(sep), ' '.join(sep)))
    return out
if os.environ.get('RD_BUNDLE', '1') != '0':
    bt = bundle(body_tail)
    if bt is not None:
        body_tail = bt
# まとめた2本は、head で先に取り寄せを始めておく（本体の 16MB の解析の間に届く）
pre = ''
for m in re.finditer(r'<(?:link rel="stylesheet" href|script src)="(rd/rd_v92all\.(css|js)\?v=[0-9a-f]+)"', body_tail):
    pre += '<link rel="preload" href="%s" as="%s">\n' % (m.group(1), 'style' if m.group(2) == 'css' else 'script')
rd = s[:k] + head_add + pre + s[k:] + '\n' + body_tail
open(os.path.join(a.out_rd, 'index.html'), 'w', encoding='utf-8', newline='').write(rd)
open(os.path.join(a.out_rd, 'version.json'), 'w', encoding='utf-8', newline='').write(json.dumps({"build": build, "ver": a.ver}))
print('ver', a.ver, 'build', build, 'main hash', h, 'layer bytes', len(L.encode('utf-8')), 'rd tags', len(a.rd))
print('trial sha256', hashlib.sha256(s.encode('utf-8')).hexdigest()[:16], 'rd sha256', hashlib.sha256(rd.encode('utf-8')).hexdigest()[:16])
