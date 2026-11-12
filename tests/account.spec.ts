import {test, expect} from '@playwright/test';

test('AUTH-01 acesso rejeitado apresenta erro sem simular login', async ({page}) => {
  await page.route('**/auth/v1/token?**', route=>route.fulfill({status:400,json:{error_code:'invalid_credentials',msg:'Invalid login credentials'}}));
  await page.goto('/conta');
  await page.getByLabel('E-mail',{exact:true}).fill('teste@example.invalid');
  await page.getByLabel('Senha',{exact:true}).fill('senha-invalida');
  await page.getByRole('button',{name:'Entrar',exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível entrar');
  await expect(page.getByRole('button',{name:'Sair da conta'})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('AUTH-02 contrato simulado: login, favorito, reload, remoção e logout', async ({page}) => {
  // Browser contract only. The real database test is prepared in supabase/tests/favorites.sql and remains pending execution.
  const id='11111111-1111-4111-8111-111111111111';
  const user={id,aud:'authenticated',role:'authenticated',email:'teste@example.invalid',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
  const exp=Math.floor(Date.now()/1000)+3600;
  const token=[{alg:'HS256',typ:'JWT'},{sub:id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(part=>Buffer.from(typeof part==='string'?part:JSON.stringify(part)).toString('base64url')).join('.');
  let favorites: {product_slug:string}[]=[];
  let failWrite=false;
  await page.route('https://*.supabase.co/**',async route=>{
    const url=route.request().url();
    if(url.includes('/auth/v1/token')) return route.fulfill({json:{access_token:token,refresh_token:'test-refresh',expires_in:3600,expires_at:exp,token_type:'bearer',user}});
    if(url.includes('/auth/v1/user')) return route.fulfill({json:user});
    if(url.includes('/auth/v1/logout')) return route.fulfill({status:204});
    if(url.includes('/rest/v1/favorites')) {
      const method=route.request().method();
      if(method==='GET') return route.fulfill({json:favorites});
      if(failWrite) return route.fulfill({status:503,json:{message:'Temporary test outage'}});
      if(method==='POST') {favorites=[{product_slug:route.request().postDataJSON().product_slug}];return route.fulfill({status:201,json:favorites});}
      if(method==='DELETE') {const removed=favorites;favorites=[];return route.fulfill({json:removed});}
    }
    return route.abort();
  });
  await page.goto('/conta');
  await page.getByLabel('E-mail',{exact:true}).fill('teste@example.invalid');
  await page.getByLabel('Senha',{exact:true}).fill('test-only-password');
  await page.getByRole('button',{name:'Entrar',exact:true}).click();
  await expect(page.getByRole('button',{name:'Sair da conta'})).toBeVisible();
  await page.getByRole('link',{name:'Explorar e salvar produtos'}).click();
  await page.getByRole('button',{name:'Salvar Bolsa Oliva',exact:true}).click();
  await expect(page.getByText('1 favorito na sua conta',{exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true})).toBeVisible();
  failWrite=true;
  await page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível atualizar');
  await expect(page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true})).toBeVisible();
  failWrite=false;
  await page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true}).click();
  await expect(page.getByText('0 favoritos na sua conta',{exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:'Salvar Bolsa Oliva',exact:true})).toBeVisible();
  await page.goto('/conta');
  await page.getByRole('button',{name:'Sair da conta'}).click();
  await expect(page.getByRole('button',{name:'Entrar',exact:true})).toBeVisible();
  await page.goto('/criador');
  await expect(page.getByText('0 favoritos nesta visita',{exact:true})).toBeVisible();
});
