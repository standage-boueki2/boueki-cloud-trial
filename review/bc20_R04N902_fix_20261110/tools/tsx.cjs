const ts=require(process.env.TYPESCRIPT_MODULE||'typescript');const fs=require('fs');
const [src,out,target]=process.argv.slice(2);
const r=ts.transpileModule(fs.readFileSync(src,'utf8'),{compilerOptions:{target:ts.ScriptTarget[target||'ES2020'],removeComments:true,module:ts.ModuleKind.None}});
fs.writeFileSync(out,r.outputText);
