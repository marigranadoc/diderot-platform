import {test,expect,type Page} from '@playwright/test';
const owner='66666666-6666-4666-8666-666666666666',recipient='77777777-7777-4777-8777-777777777777',org='cccccccc-cccc-4ccc-8ccc-cccccccccccc',invite='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const organization={id:org,owner_user_id:owner,name:'Equipe de teste',website:'',description:'',created_at:'2026-11-12T00:00:00Z'};
const invitation={id:invite,organization_id:org,organization_name:organization.name,email:'pessoa@example.invalid',status:'pending',expires_at:'2099-01-01T00:00:00Z'};
async function setup(page:Page,mode:'owner'|'recipient'){
 const id=mode==='owner'?owner:recipient;
 const user={id,aud:'authenticated',role:'authenticated',email:mode==='owner'?'responsavel@example.invalid':'pessoa@example.invalid',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
 const exp=Math.floor(Date.now()/1000)+3600,access_token=[{alg:'HS256',typ:'JWT'},{sub:id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.');
 await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),{access_token,refresh_token:'test-only',expires_at:exp,expires_in:3600,token_type:'bearer',user});
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 return user;
}
test('TEAM-01 responsável registra e cancela convite, com releitura e sem e-mail',async({page},info)=>{
 await setup(page,'owner');let invitations:typeof invitation[]=[];
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:[organization]}));
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:[{organization_id:org,role:'owner'}]}));
 await page.route('**/rest/v1/rpc/organization_team',route=>{
  const args=route.request().postDataJSON();
  if(args.p_action==='inbox')return route.fulfill({json:{invitations:[]}});
  if(args.p_action==='overview')return route.fulfill({json:{members:[{user_id:owner,email:'responsavel@example.invalid',role:'owner'}],invitations}});
  if(args.p_action==='invite'){expect(args.p_email).toBe('pessoa@example.invalid');expect(args.p_role).toBeUndefined();invitations=[invitation];return route.fulfill({json:{invitation}});}
  if(args.p_action==='cancel'){expect(args.p_invitation).toBe(invite);invitations=[{...invitation,status:'cancelled'}];return route.fulfill({json:{invitation:invitations[0]}});}
  return route.abort();
 });
 await page.goto('/painel/marca');await page.getByRole('button',{name:'Equipe e convites',exact:true}).click();
 await page.getByLabel('E-mail da pessoa convidada',{exact:true}).fill('pessoa@example.invalid');await page.getByRole('button',{name:'Registrar convite',exact:true}).click();
 await expect(page.getByText('Convite registrado no painel. Nenhum e-mail foi enviado.',{exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Equipe e convites',exact:true}).click();await expect(page.getByText('pessoa@example.invalid · Pendente',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Cancelar convite',exact:true}).click();await expect(page.getByText('pessoa@example.invalid · Cancelado',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Revogar acesso',exact:true})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`../../work/screenshots/${info.project.name}-equipe.png`,fullPage:true});
});
test('TEAM-02 destinatário aceita e passa a ler a organização sem poder editar',async({page})=>{
 await setup(page,'recipient');let accepted=false;
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:accepted?[organization]:[]}));
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:accepted?[{organization_id:org,role:'member'}]:[]}));
 await page.route('**/rest/v1/rpc/organization_team',route=>{
  const args=route.request().postDataJSON();
  if(args.p_action==='inbox')return route.fulfill({json:{invitations:accepted?[]:[invitation]}});
  expect(args.p_action).toBe('accept');expect(args.p_invitation).toBe(invite);accepted=true;return route.fulfill({json:{invitation:{...invitation,status:'accepted'}}});
 });
 await page.goto('/painel/marca');await page.getByRole('button',{name:'Equipe e convites',exact:true}).click();
 await page.getByRole('button',{name:'Aceitar convite',exact:true}).click();
 await expect(page.getByText('Convite aceito. Seu acesso de leitura foi confirmado.',{exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:organization.name,exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Editar organização',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Registrar convite',exact:true})).toHaveCount(0);
 await page.reload();await expect(page.getByRole('heading',{name:organization.name,exact:true})).toBeVisible();
});
test('TEAM-03 recusa persiste; erro ou convite expirado não concede acesso',async({page})=>{
 await setup(page,'recipient');let declined=false,fail=true;
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:[]}));
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:[]}));
 await page.route('**/rest/v1/rpc/organization_team',route=>{
  const args=route.request().postDataJSON();if(args.p_action==='inbox')return route.fulfill({json:{invitations:declined?[]:[invitation]}});
  if(fail)return route.fulfill({status:400,json:{code:'22023',message:'Invitation is no longer pending'}});
  expect(args.p_action).toBe('decline');declined=true;return route.fulfill({json:{invitation:{...invitation,status:'declined'}}});
 });
 await page.goto('/painel/marca');await page.getByRole('button',{name:'Equipe e convites',exact:true}).click();await page.getByRole('button',{name:'Aceitar convite',exact:true}).click();
 await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');
 await expect(page.locator('.brand-organization-list').getByRole('heading',{name:organization.name,exact:true})).toHaveCount(0);
 fail=false;await page.getByRole('button',{name:'Recusar convite',exact:true}).click();await expect(page.getByText('Convite recusado.',{exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Equipe e convites',exact:true}).click();await expect(page.getByText('Nenhum convite pendente.',{exact:true})).toBeVisible();
});
test('TEAM-05 saída descarta uma resposta tardia dos convites privados',async({page,context})=>{
 const user=await setup(page,'owner');let release:()=>void=()=>{},started:()=>void=()=>{};
 const gate=new Promise<void>(resolve=>{release=resolve;}),requested=new Promise<void>(resolve=>{started=resolve;});
 await context.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await context.route('**/auth/v1/logout**',route=>route.fulfill({status:204}));
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:[organization]}));
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:[{organization_id:org,role:'owner'}]}));
 await page.route('**/rest/v1/rpc/organization_team',async route=>{
  if(route.request().postDataJSON().p_action==='inbox'){started();await gate;return route.fulfill({json:{invitations:[invitation]}});}
  return route.fulfill({json:{members:[],invitations:[]}});
 });
 try{
  await page.goto('/painel/marca');await page.getByRole('button',{name:'Equipe e convites',exact:true}).click();await requested;
  const account=await context.newPage();await account.goto('/conta');await account.getByRole('button',{name:'Sair da conta',exact:true}).click();
  await expect(page.getByRole('link',{name:'Entrar na minha conta',exact:true})).toBeVisible();release();
  await expect(page.getByRole('region',{name:'Equipe e convites',exact:true})).toHaveCount(0);
  await expect(page.getByRole('article',{name:`Convite de ${organization.name}`,exact:true})).toHaveCount(0);
 }finally{release();}
});
test('TEAM-04 revogação exige confirmação e trata falha de consulta',async({page})=>{
 await setup(page,'owner');let memberPresent=true,fail=true;
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:[organization]}));
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:[{organization_id:org,role:'owner'}]}));
 await page.route('**/rest/v1/rpc/organization_team',route=>{
  const args=route.request().postDataJSON();if(fail)return route.fulfill({status:503,json:{message:'test outage'}});
  if(args.p_action==='inbox')return route.fulfill({json:{invitations:[]}});
  if(args.p_action==='overview')return route.fulfill({json:{members:[{user_id:owner,email:'responsavel@example.invalid',role:'owner'},...(memberPresent?[{user_id:recipient,email:'pessoa@example.invalid',role:'member'}]:[])],invitations:[]}});
  expect(args.p_action).toBe('remove');expect(args.p_member).toBe(recipient);memberPresent=false;return route.fulfill({json:{removed:true}});
 });
 await page.goto('/painel/marca');await page.getByRole('button',{name:'Equipe e convites',exact:true}).click();
 await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível carregar equipe');await expect(page.getByRole('button',{name:'Registrar convite',exact:true})).toHaveCount(0);
 fail=false;await page.getByRole('button',{name:'Atualizar equipe e convites',exact:true}).click();
 await page.getByRole('button',{name:'Revogar acesso',exact:true}).click();await page.getByRole('button',{name:'Manter acesso',exact:true}).click();expect(memberPresent).toBe(true);
 await page.getByRole('button',{name:'Revogar acesso',exact:true}).click();await page.getByRole('button',{name:'Confirmar revogação',exact:true}).click();
 await expect(page.getByText('Acesso do membro revogado.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Revogar acesso',exact:true})).toHaveCount(0);
});
