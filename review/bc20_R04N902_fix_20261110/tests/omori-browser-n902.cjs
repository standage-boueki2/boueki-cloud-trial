// R04-N9-02 (H07) — Omori-side reproduction on Nicolas's browser fixture (browser-fixture.cjs, 8 Nov package). Synthetic data only.
// usage: PLAYWRIGHT_MODULE=… node omori-browser-n902.cjs <backend.js> <page.html> <version.json> <label>
// H07  QuotaExceededError on every browser save that contains the send identity (idem); earlier smaller saves stay durable.
//      Pass = no false "Not sent": either 0 requests/0 effects and Not sent (before and after reload),
//             or >=1 effect and the restored message is not "failed".
// H08  quota hits only after handoff (every save once the request has left): restored message keeps its idem,
//      becomes checking and settles sent (already sent) on dst-capable backends / unknown on v42; 1 effect, 1 idem.
// H09  positive control: ordinary send, no injection: sent, 1 effect, same after reload.
// H10  after an H07 refusal, the user sends the same text again with storage available: 1 effect, sent.
// H11  no page errors in these fixtures.
const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture,signup,prepare,send,last,waitState,capture,fire}=require('./browser-fixture.cjs');
const [backend,html,version,label]=process.argv.slice(2),results=[];
async function check(id,fn){let o={};try{await fn(o);results.push({id,pass:true,observed:o});}catch(e){results.push({id,pass:false,observed:o,error:e.message});}}
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});const opened=[];
async function fresh(){for(let a=0;a<3;a++){const f=await fixture(browser,backend,html,version);try{await signup(f);await f.page.waitForFunction(()=>!!SYNC.kid&&!!V62S.st);await prepare(f);await f.page.waitForFunction(()=>bmOn()&&BM.st?.configured===true);await capture(f);opened.push(f);return f;}catch(e){await f.context.close();if(a==2)throw e;}}}
async function reload(f,id){await f.page.reload({waitUntil:'domcontentloaded'});await f.page.waitForFunction(id=>typeof TENS!=='undefined'&&TENS.some(t=>t.dmThreads?.[id]?.msgs.length),id);await f.page.evaluate(id=>{const i=TENS.findIndex(t=>t.dmThreads?.[id]?.msgs.length);if(TIDX!==i||TEN!==TENS[i])switchTen(i);bmChip(dmThreads()[id].msgs.at(-1));},id);await f.page.waitForFunction(()=>!!SYNC.kid);}
// stored copy of the last message of thread id (what a reload will restore)
async function stored(f,id){return f.page.evaluate(id=>{const raw=localStorage.getItem('bc20_ten_'+SES.code);if(!raw)return null;const j=JSON.parse(raw);for(const t of j.list||[]){const th=t&&t.dmThreads&&t.dmThreads[id];if(th&&th.msgs&&th.msgs.length){const m=th.msgs.at(-1);return {st:m.st,idem:m.idem||'',v2185id:m.v2185id||''};}}return null;},id);}
// quota injection in this document only (gone after reload)
async function arm(f,mode){await f.page.evaluate(mode=>{const P=Storage.prototype;if(!window.__q0)window.__q0=P.setItem;window.__qHits=0;window.__qMode=mode;P.setItem=function(k,v){if(window.__qMode&&String(k).startsWith('bc20_ten_')&&(window.__qMode==='all'||String(v).includes('"idem":"bc-'))){window.__qHits++;throw new DOMException('synthetic quota','QuotaExceededError');}return window.__q0.call(this,k,v);};},mode);}
async function disarm(f){await f.page.evaluate(()=>{window.__qMode='';});}
const n=f=>f.requests.filter(x=>x.op==='mail_send');
try{
await check('H07 idem save fails (QuotaExceededError): no handoff, or no false Not sent after reload',async o=>{
 const f=await fresh(),e0=f.h.effects.gmail.length;await arm(f,'idem');await send(f,'h7','H07','H07 body');
 await f.page.waitForFunction(()=>{const m=dmThreads()['h7']?.msgs.at(-1);return m&&m.st!=='sending';},null,{timeout:15000}).catch(()=>{});await f.page.waitForTimeout(1500);
 o.before=await last(f,'h7');o.quotaHits=await f.page.evaluate(()=>window.__qHits);o.stored=await stored(f,'h7');o.requests=n(f).length;o.effects=f.h.effects.gmail.length-e0;
 await reload(f,'h7');await f.page.waitForTimeout(1500);o.afterReload=await last(f,'h7');
 for(let i=0;i<5&&await f.page.evaluate(()=>window.__reviewQ.length);i++)await fire(f);
 o.final=await last(f,'h7');o.requestsFinal=n(f).length;o.effectsFinal=f.h.effects.gmail.length-e0;
 assert.ok(o.quotaHits>=1,'injection did not trigger');
 if(o.effectsFinal===0){assert.equal(o.requestsFinal,0);assert.equal(o.before.st,'failed');assert.equal(o.afterReload.st,'failed');assert.equal(o.final.st,'failed');}
 else{assert.equal(o.effectsFinal,1);assert.notEqual(o.afterReload.st,'failed');assert.notEqual(o.final.st,'failed');}
});
await check('H08 saves fail only after handoff: restored message keeps idem, resumes, 1 effect, never Not sent',async o=>{
 const f=await fresh(),e0=f.h.effects.gmail.length;f.controls.delayNextMailMs=3000;await send(f,'h8','H08','H08 body');
 await f.page.waitForFunction(()=>dmThreads()['h8']?.msgs.at(-1)?.idem);const deadline=Date.now()+8000;while(!n(f).length&&Date.now()<deadline)await f.page.waitForTimeout(50);
 await arm(f,'all');await f.page.waitForTimeout(4500);o.before=await last(f,'h8');o.stored=await stored(f,'h8');o.quotaHits=await f.page.evaluate(()=>window.__qHits);
 await reload(f,'h8');await f.page.waitForTimeout(1500);o.afterReload=await last(f,'h8');
 for(let i=0;i<5&&await f.page.evaluate(()=>window.__reviewQ.length);i++)await fire(f);
 o.final=await last(f,'h8');o.effects=f.h.effects.gmail.length-e0;o.idems=[...new Set(n(f).map(x=>x.idem))];
 assert.equal(o.before.st,'sent');assert.equal(o.stored.st,'sending');assert.ok(o.stored.idem);assert.equal(o.effects,1);assert.equal(o.idems.length,1);
 assert.notEqual(o.afterReload.st,'failed');assert.equal(o.final.st,label==='v42'?'unknown':'sent');if(label!=='v42')assert.equal(o.final.dupOk,true);
});
await check('H09 positive control: ordinary send, sent, 1 effect, same after reload',async o=>{
 const f=await fresh(),e0=f.h.effects.gmail.length;await send(f,'h9','H09','H09 body');await waitState(f,'h9',['sent','failed','unknown']);
 o.before=await last(f,'h9');o.stored=await stored(f,'h9');await reload(f,'h9');await f.page.waitForTimeout(800);o.afterReload=await last(f,'h9');o.effects=f.h.effects.gmail.length-e0;o.requests=n(f).length;
 assert.equal(o.before.st,'sent');assert.equal(o.stored.st,'sent');assert.equal(o.afterReload.st,'sent');assert.equal(o.effects,1);assert.equal(o.requests,1);
});
await check('H10 after a refusal the same text can be sent again once storage works: 1 effect, sent',async o=>{
 const f=await fresh(),e0=f.h.effects.gmail.length;await arm(f,'idem');await send(f,'h10','H10','H10 body');
 await f.page.waitForFunction(()=>{const m=dmThreads()['h10']?.msgs.at(-1);return m&&m.st!=='sending';},null,{timeout:15000}).catch(()=>{});await f.page.waitForTimeout(800);
 o.first=await last(f,'h10');o.requestsAfterFirst=n(f).length;await disarm(f);await send(f,'h10','H10','H10 body');await waitState(f,'h10',['sent','failed','unknown']);
 o.second=await last(f,'h10');o.effects=f.h.effects.gmail.length-e0;o.requests=n(f).length;
 assert.equal(o.second.st,'sent');assert.equal(o.effects,1);
});
await check('H11 no page errors in these fixtures',async o=>{o.errors=opened.flatMap(f=>f.errors);assert.deepEqual(o.errors,[]);});
}finally{for(const f of opened)await f.context.close().catch(()=>{});await browser.close();}
console.log(JSON.stringify({label,total:results.length,passed:results.filter(x=>x.pass).length,results},null,2));
})().catch(e=>{console.error(e);process.exitCode=2;});
