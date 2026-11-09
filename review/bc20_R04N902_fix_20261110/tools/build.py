import sys,hashlib,base64,re
base,layer,out,ver,build=sys.argv[1:6]
s=open(base,encoding='utf-8').read()
L=open(layer,encoding='utf-8').read()
if L.startswith('"use strict";\n'): L=L[len('"use strict";\n'):]
anchor='catch (e) { }\ntry {\n    if (typeof v35Restore === "function")\n        v35Restore();\n}'
assert s.count(anchor)==1
s=s.replace(anchor,'catch (e) { }\n'+L+anchor[len('catch (e) { }\n'):],1)
assert s.count('const BC20_VER = "21.85.1";')==1 and s.count('const BC20_BUILD="4065fdd482da";')==1
s=s.replace('const BC20_VER = "21.85.1";','const BC20_VER = "%s";'%ver).replace('const BC20_BUILD="4065fdd482da";','const BC20_BUILD="%s";'%build)
# recompute main block hash
blocks=list(re.finditer(r'<script>(.*?)</script>',s,flags=re.S))
main=max(blocks,key=lambda m:len(m.group(1)))
h=base64.b64encode(hashlib.sha256(main.group(1).encode('utf-8')).digest()).decode()
old='oGlZZ1JJnmTGmzDfo/6YupG18d5/9+Z/z4qMEbH9Z70='
n=s.count("'sha256-%s'"%old); assert n>=1, n
s=s.replace("'sha256-%s'"%old,"'sha256-%s'"%h)
open(out,'w',encoding='utf-8',newline='').write(s)
print('csp repl',n,'main hash',h,'sha256',hashlib.sha256(s.encode('utf-8')).hexdigest())
