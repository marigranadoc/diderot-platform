import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const origin='https://diderot-platform-mari-granado.vercel.app';
const browser=await chromium.launch({executablePath:process.env.DIDEROT_CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];
await mkdir('../../work/screenshots',{recursive:true});
try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  const name=viewport.width===390?'celular':'computador',context=await browser.newContext({viewport}),page=await context.newPage(),checks=[];let attemptedWrites=0;
  await context.route('**/rest/v1/**',route=>{if(!['GET','HEAD','OPTIONS'].includes(route.request().method())){attemptedWrites++;return route.abort('blockedbyclient');}return route.continue();});
  try{
   for(const path of ['/','/cadastro','/conta','/auth/retorno','/onboarding','/loja/clara-demonstracao']){const response=await page.goto(origin+path);assert.equal(response.status(),200,path);assert.equal(new URL(page.url()).origin,origin);await expect(page.locator('main')).toBeVisible();}
   await expect(page.locator('.own-shop-profile h1')).toBeVisible();assert.doesNotMatch(await page.locator('body').innerText(),/demonstrativ|fictíci|sem foto/i);checks.push('public_routes_and_store_without_vercel_login');
   await expect.poll(()=>page.locator('.product-card img').evaluateAll(images=>images.length>0&&images.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
   await page.screenshot({path:'../../work/screenshots/vercel-release-'+name+'-loja.png',fullPage:true});
   await page.goto(origin+'/cadastro');await expect(page.getByRole('radio')).toHaveCount(3);checks.push('signup_choices_without_sending_email');
   await page.goto(origin+'/demo');const denied=await page.request.post(origin+'/api/demo/session',{headers:{Origin:'https://example.invalid'},data:{type:'brand'}});assert.equal(denied.status(),403);checks.push('external_origin_rejected');
   for(const role of ['shopper','creator','marca']){
    await page.goto(origin+'/demo');await page.getByRole('button',{name:'Entrar como '+role,exact:true}).click();await expect(page).toHaveURL(new RegExp('/painel/'+(role==='creator'?'criador':role==='marca'?'marca':'shopper')+'$'),{timeout:45000});
    await expect(page.getByRole('heading',{level:1})).toBeVisible();checks.push(role+'_real_auth_and_private_dashboard');
    if(role==='creator'){
     await page.getByRole('link',{name:'Gerenciar minha loja',exact:true}).click();await expect(page.getByLabel('Nome público da loja',{exact:true})).not.toHaveValue('');
     const popupPromise=page.waitForEvent('popup');await page.getByRole('link',{name:'Ver minha loja ↗',exact:true}).click();const shop=await popupPromise;await expect(shop.locator('.own-shop-profile h1')).toBeVisible();await shop.close();checks.push('creator_private_editor_and_public_store');
     await page.getByRole('button',{name:'Adicionar à minha loja',exact:true}).click();const sheet=page.getByRole('dialog',{name:'Criar na minha loja',exact:true});await expect(sheet).toBeVisible();await sheet.getByRole('button',{name:/Novo produto/}).click();await expect(sheet.getByRole('button',{name:/Adicionar por URL/})).toBeVisible();await expect(sheet.getByRole('button',{name:/Catálogo/})).toBeVisible();await page.keyboard.press('Escape');checks.push('shop_creation_menu_read_only');
     const nav=page.getByRole('navigation',{name:'Navegação do meu espaço',exact:true});
     await nav.getByRole('link',{name:'Produtos',exact:true}).click();await expect(page.getByRole('button',{name:'Adicionar produto',exact:true})).toBeEnabled();
     await nav.getByRole('link',{name:'Posts',exact:true}).click();await expect(page.getByRole('button',{name:'Criar post',exact:true})).toBeEnabled();
     await nav.getByRole('link',{name:'Coleções',exact:true}).click();await expect(page.getByRole('button',{name:'Adicionar coleção',exact:true})).toBeEnabled();
     await nav.getByRole('link',{name:'Meu perfil',exact:true}).click();await expect(page.getByLabel('Nome profissional',{exact:true})).not.toHaveValue('');await expect(page.getByLabel('Escolher foto de perfil',{exact:true})).toBeEnabled();
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'../../work/screenshots/vercel-release-'+name+'-perfil.png',fullPage:true});checks.push('creator_photo_and_profile_navigation_read_only');
    }
    if(role==='marca'){await page.getByRole('button',{name:'Campanhas em rascunho',exact:true}).click();await expect(page.getByRole('button',{name:'Abrir rascunho',exact:true})).toHaveCount(3);checks.push('brand_reads_three_campaign_drafts');}
    await page.goto(origin+'/conta');await page.getByRole('button',{name:'Sair da conta',exact:true}).click();await expect(page.getByRole('button',{name:'Entrar',exact:true})).toBeEnabled();
   }
   assert.equal(attemptedWrites,0);results.push({viewport:name,status:'passed',checks,businessWrites:attemptedWrites});
  }finally{await context.close();}
 }
 console.log(JSON.stringify({status:'passed',origin,results,limits:'Real published Chrome and existing fictional Auth accounts; GET-only REST business data. No signup email, photo upload, publication change or financial operation.'},null,2));
 await writeFile('../../work/publicacao-vercel-criacao-jornadas.json',JSON.stringify({status:'passed',origin,results,limits:'Auth real e leitura; sem escrita de negócio ou e-mail real.'},null,2));
}finally{await browser.close();}
