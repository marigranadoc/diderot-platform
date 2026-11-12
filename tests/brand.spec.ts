import {test,expect,type Page} from '@playwright/test';
const id='44444444-4444-4444-8444-444444444444';
const user={id,aud:'authenticated',role:'authenticated',email:'marca@example.invalid',app_metadata:{},user_metadata:{role:'admin'},created_at:new Date().toISOString()};
const orgId='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
function session(){const exp=Math.floor(Date.now()/1000)+3600;return {access_token:[{alg:'HS256',typ:'JWT'},{sub:id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.'),refresh_token:'test-only',expires_in:3600,expires_at:exp,token_type:'bearer',user};}
async function seed(page:Page){await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),session());}
const record={id:orgId,owner_user_id:id,name:'Organização de teste',website:'https://example.com',description:'Descrição de teste',created_at:'2026-11-12T00:00:00Z'};

test('BR-01 visitante encontra a área da marca sem acessar dados privados',async({page})=>{
 await page.goto('/');await page.locator('footer').getByRole('link',{name:'Painel da marca',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Painel da marca',exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Entrar na minha conta',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Salvar organização',exact:true})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('BR-02 contrato: criar, reler, editar e cancelar sem simular aprovação',async({page},info)=>{
 await seed(page);let org:typeof record|null=null;let posts=0;
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/organizations**',route=>{
  const method=route.request().method();if(method==='GET')return route.fulfill({json:org?[org]:[]});
  const fields=route.request().postDataJSON();expect(fields.owner_user_id).toBeUndefined();expect(fields.role).toBeUndefined();
  if(method==='POST'){posts++;org={...record,...fields};}else if(method==='PATCH')org={...org!,...fields};
  return route.fulfill({status:method==='POST'?201:200,json:org});
 });
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:route.request().url().includes('organization_id=')?{role:'owner'}:org?[{organization_id:orgId,role:'owner'}]:[]}));
 await page.goto('/painel/marca');await page.getByLabel('Nome da organização',{exact:true}).fill('Marca de teste');
 await page.getByLabel('Site (opcional)',{exact:true}).fill('http://example.com');await page.getByRole('button',{name:'Salvar organização',exact:true}).click();
 await expect(page.getByRole('main').getByRole('alert')).toContainText('HTTPS válido');expect(posts).toBe(0);
 await page.getByLabel('Site (opcional)',{exact:true}).fill('https://example.com');await page.getByLabel('Sobre a organização',{exact:true}).fill('Conteúdo demonstrativo');
 await page.getByRole('button',{name:'Salvar organização',exact:true}).click();
 await expect(page.getByRole('main').getByRole('status')).toContainText('vínculo de responsável foi confirmado');expect(posts).toBe(1);
 await page.reload();await expect(page.getByRole('heading',{name:'Marca de teste',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Editar organização',exact:true}).click();await page.getByLabel('Nome da organização',{exact:true}).fill('Não deve ser salvo');
 await page.getByRole('button',{name:'Cancelar edição',exact:true}).click();expect(org!.name).toBe('Marca de teste');
 await page.getByRole('button',{name:'Editar organização',exact:true}).click();await page.getByLabel('Nome da organização',{exact:true}).fill('Marca editada');
 await page.getByRole('button',{name:'Salvar organização',exact:true}).click();await page.reload();
 await expect(page.getByRole('heading',{name:'Marca editada',exact:true})).toBeVisible();
 await expect(page.getByText('Aprovação comercial, publicação de campanhas e contratação ainda não estão disponíveis.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`../../work/screenshots/${info.project.name}-marca.png`,fullPage:true});
});

test('BR-03 falha de consulta ou gravação não confirma cadastro ou edição',async({page})=>{
 await seed(page);let failRead=true,failWrite=true,org:typeof record|null=null;
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/organizations**',route=>{
  const method=route.request().method();if(method==='GET')return route.fulfill(failRead?{status:503,json:{message:'test outage'}}:{json:org?[org]:[]});
  if(failWrite)return route.fulfill({status:503,json:{message:'test outage'}});
  org={...record,...route.request().postDataJSON()};return route.fulfill({json:org});
 });
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:route.request().url().includes('organization_id=')?{role:'owner'}:org?[{organization_id:orgId,role:'owner'}]:[]}));
 await page.goto('/painel/marca');await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível carregar');
 await expect(page.getByRole('button',{name:'Salvar organização',exact:true})).toHaveCount(0);
 failRead=false;await page.getByRole('button',{name:'Tentar novamente',exact:true}).click();
 await page.getByLabel('Nome da organização',{exact:true}).fill('Nome de teste');await page.getByRole('button',{name:'Salvar organização',exact:true}).click();
 await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');expect(org).toBeNull();
 failWrite=false;await page.getByRole('button',{name:'Salvar organização',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Nome de teste',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Editar organização',exact:true}).click();await page.getByLabel('Nome da organização',{exact:true}).fill('Alteração rejeitada');failWrite=true;
 await page.getByRole('button',{name:'Salvar organização',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');
 await page.getByRole('button',{name:'Atualizar organizações',exact:true}).click();await expect(page.getByRole('heading',{name:'Nome de teste',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Alteração rejeitada',exact:true})).toHaveCount(0);
});

test('BR-04 membro não edita organização alheia nem ganha acesso por metadata',async({page})=>{
 await seed(page);
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:[{...record,owner_user_id:'55555555-5555-4555-8555-555555555555'}]}));
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:[{organization_id:orgId,role:'member'}]}));
 await page.goto('/painel/marca');await expect(page.getByRole('article',{name:record.name,exact:true})).toContainText('MEMBRO · SOMENTE LEITURA');
 await expect(page.getByRole('button',{name:'Editar organização',exact:true})).toHaveCount(0);
 await expect(page.getByLabel('Nome da organização',{exact:true})).toHaveValue('');
 await expect(page.getByRole('button',{name:/aprovar|promover|convidar/i})).toHaveCount(0);
});

test('BR-05 saída em outra aba impede retorno tardio de dados privados',async({page,context})=>{
 await seed(page);let delayed=false,release:()=>void=()=>{},started:()=>void=()=>{};
 const pending=new Promise<void>(resolve=>{release=resolve;}),requested=new Promise<void>(resolve=>{started=resolve;});
 await context.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await context.route('**/auth/v1/logout**',route=>route.fulfill({status:204}));
 await context.route('**/rest/v1/organizations**',async route=>{if(delayed){started();await pending;}await route.fulfill({json:[record]});});
 await context.route('**/rest/v1/organization_members**',route=>route.fulfill({json:[{organization_id:orgId,role:'owner'}]}));
 try{
  await page.goto('/painel/marca');await expect(page.getByRole('heading',{name:record.name,exact:true})).toBeVisible();
  delayed=true;await page.getByRole('button',{name:'Atualizar organizações',exact:true}).click();await requested;
  const account=await context.newPage();await account.goto('/conta');await account.getByRole('button',{name:'Sair da conta',exact:true}).click();
  await expect(page.getByRole('link',{name:'Entrar na minha conta',exact:true})).toBeVisible();release();
  await expect(page.getByRole('heading',{name:record.name,exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Salvar organização',exact:true})).toHaveCount(0);
 }finally{release();}
});
