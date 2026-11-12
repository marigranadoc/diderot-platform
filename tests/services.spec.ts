import {test,expect} from '@playwright/test';

test('SRV-01 visitante não recebe formulário de gestão',async({page})=>{
 await page.goto('/conta/criador/servicos');
 await expect(page.getByRole('link',{name:'Entrar para gerenciar serviços'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Salvar serviço'})).toHaveCount(0);
});

test('SRV-02 contrato simulado: criar, reler, editar, falhar e excluir com confirmação',async({page})=>{
 const user={id:'44444444-4444-4444-8444-444444444444',aud:'authenticated',role:'authenticated',email:'services@example.invalid',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
 const exp=Math.floor(Date.now()/1000)+3600;
 const access_token=[{alg:'HS256',typ:'JWT'},{sub:user.id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.');
 await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),{access_token,refresh_token:'test-refresh',expires_at:exp,expires_in:3600,token_type:'bearer',user});
 let rows:Record<string,any>[]=[];let fail=false;let hasProfile=true;
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/creator_profiles**',route=>route.fulfill({json:hasProfile?{user_id:user.id}:null}));
 await page.route('**/rest/v1/creator_services**',route=>{
  const method=route.request().method();
  if(method==='GET')return route.fulfill({json:rows});
  if(fail)return route.fulfill({status:503,json:{message:'Test outage'}});
  if(method==='POST'){const body=route.request().postDataJSON();expect(body.user_id).toBe(user.id);rows=[{id:'55555555-5555-4555-8555-555555555555',...body}];return route.fulfill({json:rows[0]});}
  if(method==='PATCH'){rows=[{...rows[0],...route.request().postDataJSON()}];return route.fulfill({json:rows[0]});}
  const removed=rows[0];rows=[];return route.fulfill({json:{id:removed.id}});
 });
 await page.goto('/conta/criador/servicos');
 await expect(page.getByText('Nenhum serviço cadastrado.',{exact:false})).toBeVisible();
 await page.getByLabel('Título do serviço',{exact:true}).fill('Vídeo de demonstração');
 await page.getByRole('button',{name:'Salvar serviço'}).click();
 await expect(page.getByRole('main').getByRole('status')).toContainText('Serviço salvo');
 expect(rows[0].starting_price_cents).toBeNull();
 await page.reload();
 await expect(page.getByRole('heading',{name:'Vídeo de demonstração'})).toBeVisible();
 await page.getByRole('button',{name:'Editar Vídeo de demonstração',exact:true}).click();
 await page.getByRole('combobox',{name:'Forma de preço',exact:true}).selectOption('starting');
 await page.getByLabel('Preço inicial (R$)',{exact:true}).fill('450.50');
 await page.getByRole('button',{name:'Salvar serviço'}).click();
 await expect(page.getByText('A partir de R$ 450,50',{exact:true})).toBeVisible();
 expect(rows[0].starting_price_cents).toBe(45050);
 await page.getByRole('button',{name:'Editar Vídeo de demonstração',exact:true}).click();
 await page.getByLabel('Título do serviço',{exact:true}).fill('Não deve gravar');fail=true;
 await page.getByRole('button',{name:'Salvar serviço'}).click();
 await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Vídeo de demonstração'})).toBeVisible();
 fail=false;
 await page.getByRole('button',{name:'Excluir Vídeo de demonstração',exact:true}).click();
 await page.getByRole('button',{name:'Cancelar exclusão'}).click();
 expect(rows).toHaveLength(1);
 await page.getByRole('button',{name:'Excluir Vídeo de demonstração',exact:true}).click();
 await page.getByRole('button',{name:'Confirmar exclusão'}).click();
 await expect(page.getByRole('main').getByRole('status')).toContainText('Serviço excluído');
 await page.reload();
 await expect(page.getByText('Nenhum serviço cadastrado.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 hasProfile=false;await page.reload();
 await expect(page.getByText('Configure seu perfil de creator antes de adicionar serviços.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Salvar serviço'})).toHaveCount(0);
});
