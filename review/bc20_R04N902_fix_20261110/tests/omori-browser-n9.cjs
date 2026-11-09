// 21.85.3 candidate (R04-N9-01) — Omori-side additions on Nicolas's 9 Nov fixture (browser-fixture.cjs). Synthetic data only.
// usage: PLAYWRIGHT_MODULE=… CHROMIUM_PATH=… node omori-browser-n9.cjs <backend.js> <page.html> <version.json> <label>
const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture,signup,prepare,send,last,waitState,capture,advance,fire}=require('./browser-fixture.cjs');
const [backend,html,version,label]=process.argv.slice(2),results=[];
async function check(id,fn){let o={};try{await fn(o);results.push({id,pass:true,observed:o});}catch(e){results.push({id,pass:false,observed:o,error:e.message});}}
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});const opened=[];
async function fresh(){for(let a=0;a<3;a++){const f=await fixture(browser,backend,html,version);try{await signup(f);await f.page.waitForFunction(()=>!!SYNC.kid&&!!V62S.st);await prepare(f);await f.page.waitForFunction(()=>bmOn()&&BM.st?.configured===true);await capture(f);opened.push(f);return f;}catch(e){await f.context.close();if(a==2)throw e;}}}
async function reload(f,id){await f.page.reload({waitUntil:'domcontentloaded'});await f.page.waitForFunction(id=>typeof TENS!=='undefined'&&TENS.some(t=>t.dmThreads?.[id]?.msgs.length),id);await f.page.evaluate(id=>{const i=TENS.findIndex(t=>t.dmThreads?.[id]?.msgs.length);if(TIDX!==i||TEN!==TENS[i])switchTen(i);bmChip(dmThreads()[id].msgs.at(-1));},id);await f.page.waitForFunction(()=>!!SYNC.kid);}
const n=f=>f.requests.filter(x=>x.op==='mail_send');
try{
await check('O1 reload during first request, then the resumed check actually runs: one effect, same idem, settles sent (dst-capable) or unknown (v42)',async o=>{
 const f=await fresh(),e0=f.h.effects.gmail.length;f.controls.delayNextMailMs=4000;await send(f,'o1','O1','O1 body');await f.page.waitForFunction(()=>dmThreads()['o1']?.msgs.at(-1)?.st==='sending');await f.page.waitForTimeout(100);
 await reload(f,'o1');await f.page.waitForTimeout(4500);o.persisted=await last(f,'o1');
 for(let i=0;i<5&&await f.page.evaluate(()=>window.__reviewQ.length);i++)await fire(f);
 o.after=await last(f,'o1');o.effects=f.h.effects.gmail.length-e0;o.idems=[...new Set(n(f).map(x=>x.idem))];o.requests=n(f).length;
 assert.equal(o.effects,1);assert.equal(o.idems.length,1);assert.notEqual(o.persisted.st,'failed');
 assert.equal(o.after.st,label==='v42'?'unknown':'sent');if(label!=='v42')assert.equal(o.after.dupOk,true);
});
await check('O2 old handler cannot persist Not sent: abort during first request without reload settles via the layer (checking → sent)',async o=>{
 const f=await fresh(),e0=f.h.effects.gmail.length;f.controls.abortAfter=1;await send(f,'o2','O2','O2 body');await waitState(f,'o2',['checking']);o.mid=await last(f,'o2');
 for(let i=0;i<5&&await f.page.evaluate(()=>window.__reviewQ.length);i++)await fire(f);o.after=await last(f,'o2');o.effects=f.h.effects.gmail.length-e0;
 assert.equal(o.effects,1);assert.ok(['sent','unknown'].includes(o.after.st));if(label!=='v42')assert.equal(o.after.st,'sent');
});
await check('O3 no page errors in these fixtures',async o=>{o.errors=opened.flatMap(f=>f.errors);assert.deepEqual(o.errors,[]);});
}finally{for(const f of opened)await f.context.close().catch(()=>{});await browser.close();}
console.log(JSON.stringify({label,total:results.length,passed:results.filter(x=>x.pass).length,results},null,2));
})().catch(e=>{console.error(e);process.exitCode=2;});
