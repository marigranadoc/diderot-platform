import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
// Only the fictitious creator. Never save its shop document or publish a profile.
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const origin=process.argv.find(x=>x.startsWith('--origin='))?.slice(9)??'http://127.0.0.1:3002';
const report={origin,mode:process.argv.includes('--png-fallback')?'webp-unavailable':'native',storage:[],alerts:[],businessWrites:0};
try{
 const context=await browser.newContext(),page=await context.newPage();
 if(process.argv.includes('--png-fallback'))await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=function(cb,type,q){return original.call(this,cb,type==='image/webp'?'image/png':type,q);};});
 await context.route('**/rest/v1/**',r=>{if(!['GET','HEAD','OPTIONS'].includes(r.request().method())){report.businessWrites++;return r.abort();}return r.continue();});
 page.on('response',async response=>{const url=new URL(response.url());if(url.pathname.startsWith('/storage/v1/object/')&&response.request().method()==='POST'&&!url.pathname.includes('/sign/')){let error;try{const body=await response.json();error=body.error||body.message;}catch{}const request=response.request(),raw=request.postDataBuffer()?.toString('latin1')??'';report.storage.push({status:response.status(),error,extension:url.pathname.split('.').at(-1),mime:raw.match(/Content-Type: (image\/[a-z]+)/i)?.[1]});}});
 await page.goto(origin+'/demo');await page.getByRole('button',{name:'Entrar como creator',exact:true}).click();await expect(page).toHaveURL(/painel\/criador$/,{timeout:45000});
 await page.goto(origin+'/painel/criador/loja#products');await page.getByRole('button',{name:'Adicionar produto',exact:true}).click();await page.getByLabel('Escolher foto do produto',{exact:true}).setInputFiles('public/products/bolsa-oliva.webp');
 await expect(page.getByText('Foto enviada. Salve o formulário para guardar a alteração.',{exact:true}).or(page.getByRole('main').getByRole('alert'))).toBeVisible({timeout:30000});
 report.alerts=await page.getByRole('main').getByRole('alert').allTextContents();if(!report.alerts.length){const image=page.getByRole('img',{name:'Escolher foto do produto',exact:true});await expect(image).toBeVisible();await expect.poll(()=>image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);report.privateRead=true;}
 console.log(JSON.stringify(report));await writeFile('../../work/probe-image-upload-'+report.mode+(origin.startsWith('https:')?'-publicado':'-local')+'.json',JSON.stringify(report,null,2));
}finally{await browser.close();}
