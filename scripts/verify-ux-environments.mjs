import {readFile,writeFile} from 'node:fs/promises';
const preview=process.argv[2];if(!preview||new URL(preview).hostname!=='diderot-platform-git-feat-ux-overhaul-2026-11-18-mari-granado.vercel.app')throw Error('Unexpected review deployment');
const baseline=JSON.parse(await readFile('../../work/ux-domain.json','utf8'));
const production=await fetch('https://www.shopdiderot.com/',{signal:AbortSignal.timeout(15000)});const html=await production.text();const assets=[...html.matchAll(/src="([^"]*\/_next\/static[^"]*)"/g)].map(x=>x[1]).sort();
const response=await fetch(preview+'/cadastro',{signal:AbortSignal.timeout(15000)});const page=await response.text();
const result={production:{url:production.url,status:production.status,assetsUnchanged:JSON.stringify(assets)===JSON.stringify(baseline.responses[0].assets)},preview:{url:preview,status:response.status,finalUrl:new URL(response.url).origin+new URL(response.url).pathname,protected:new URL(response.url).hostname==='vercel.com',signupFlowPresent:page.includes('Continuar com este espaço')},limits:'Public GET only. No signup, authentication or business writes.'};
await writeFile('../../work/ux-deployment-review.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
