import {test,expect,type Page} from '@playwright/test';
const id='99999999-9999-4999-8999-999999999999';
type Role='shopper'|'creator'|'brand';
async function setup(page:Page,role:Role){
 const user={id,aud:'authenticated',role:'authenticated',email:'onboarding@example.invalid',app_metadata:{},user_metadata:{account_type:role},created_at:new Date().toISOString()};
 const exp=Math.floor(Date.now()/1000)+3600,access_token=[{alg:'HS256',typ:'JWT'},{sub:id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value)).toString('base64url')).join('.');
 await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),{access_token,refresh_token:'test-only',expires_in:3600,expires_at:exp,token_type:'bearer',user});
 const state={profile:null as Record<string,unknown>|null,failSave:false,failRead:false,requests:[] as Record<string,unknown>[]};
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/account_profiles**',route=>route.fulfill(state.failRead?{status:503,json:{message:'test outage'}}:{json:state.profile}));
 await page.route('**/rest/v1/creator_profiles**',route=>route.fulfill({json:null}));
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:null}));
 await page.route('**/rest/v1/rpc/complete_account_onboarding',route=>{
  const input=route.request().postDataJSON();state.requests.push(input);if(state.failSave)return route.fulfill({status:503,json:{message:'test outage'}});
  state.profile={user_id:id,account_type:input.p_type,display_name:input.p_name,city:input.p_city,interests:input.p_interests,onboarding_completed:true};
  return route.fulfill({json:{user_id:id,account_type:input.p_type,onboarding_completed:true}});
 });
 return state;
}

for(const role of ['shopper','creator','brand'] as const)test(`EXP-01 ${role}: escolha, perfil, revisão e destino corretos`,async({page})=>{
 const state=await setup(page,role);await page.goto('/onboarding');
 const label=role==='brand'?'Marca':role==='creator'?'Creator':'Shopper';await expect(page.getByRole('radio',{name:new RegExp('^'+label)})).toBeChecked();
 await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByLabel(role==='creator'?'Nome profissional':'Seu nome',{exact:true}).fill('Pessoa de teste');
 if(role==='brand')await page.getByLabel('Nome da organização',{exact:true}).fill('Organização de teste');
 if(role==='shopper')await page.getByRole('checkbox',{name:'Moda',exact:true}).check();
 if(role==='creator'){await expect(page.getByRole('checkbox',{name:'UGC — sem exigência de seguidores',exact:true})).toBeChecked();await expect(page.getByLabel(/mínimo de seguidores/i)).toHaveCount(0);}
 await page.getByRole('button',{name:'Revisar cadastro',exact:true}).click();expect(state.requests).toHaveLength(0);await expect(page.getByText('Pessoa de teste',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Voltar e editar',exact:true}).click();await expect(page.getByLabel(role==='creator'?'Nome profissional':'Seu nome',{exact:true})).toHaveValue('Pessoa de teste');await page.getByRole('button',{name:'Revisar cadastro',exact:true}).click();
 await page.getByRole('button',{name:'Concluir cadastro',exact:true}).click();await expect(page).toHaveURL(new RegExp('/painel/'+(role==='creator'?'criador':role==='brand'?'marca':'shopper')+'$'));expect(state.requests[0].p_type).toBe(role);expect(state.profile?.onboarding_completed).toBe(true);
});

test('EXP-02 erro ao salvar ou reler preserva a revisão sem falso sucesso',async({page})=>{
 const state=await setup(page,'shopper');await page.goto('/onboarding');await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByLabel('Seu nome',{exact:true}).fill('Perfil preservado');await page.getByRole('button',{name:'Revisar cadastro',exact:true}).click();state.failSave=true;
 await page.getByRole('button',{name:'Concluir cadastro',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');await expect(page).toHaveURL(/\/onboarding$/);await expect(page.getByText('Perfil preservado',{exact:true})).toBeVisible();
 state.failSave=false;state.failRead=true;await page.getByRole('button',{name:'Concluir cadastro',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');await expect(page).toHaveURL(/\/onboarding$/);
 state.failRead=false;await page.getByRole('button',{name:'Concluir cadastro',exact:true}).click();await expect(page).toHaveURL(/\/painel\/shopper$/);
});

test('EXP-03 cadastro envia o tipo escolhido e explica a confirmação de e-mail',async({page})=>{
 let sent:Record<string,unknown>|null=null;await page.route('**/auth/v1/signup**',route=>{sent=route.request().postDataJSON();return route.fulfill({json:{user:{id,email:'novo@example.invalid'},session:null}});});
 await page.goto('/cadastro');await page.getByRole('radio',{name:'Marca',exact:true}).check();await page.getByLabel('E-mail',{exact:true}).fill('novo@example.invalid');await page.getByLabel('Nova senha',{exact:true}).fill('test-only-2026');await page.getByLabel('Confirmar senha',{exact:true}).fill('test-only-2026');await page.getByRole('button',{name:'Criar conta',exact:true}).click();
 await expect(page.getByRole('main').getByRole('status')).toContainText('instruções de confirmação');expect((sent as Record<string,unknown>|null)?.data).toEqual({account_type:'brand'});await expect(page.getByRole('link',{name:'Entrar após confirmar meu e-mail',exact:true})).toHaveAttribute('href','/conta');
});

test('EXP-04 visitantes encontram os três caminhos e os briefings fictícios',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:/DEMONSTRAÇÃO · Experimentar como shopper/}).click();await expect(page).toHaveURL(/\/demo$/);
 for(const role of ['shopper','creator','marca'])await expect(page.getByRole('button',{name:`Entrar como ${role}`,exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Criar minha própria conta',exact:true}).click();await expect(page.getByRole('heading',{name:'Criar conta',exact:true})).toBeVisible();
 await page.goto('/explorar/campanhas');await expect(page.getByRole('heading',{name:'Explore campanhas',exact:true})).toBeVisible();await page.getByRole('link').filter({hasText:'Rituais de cuidado'}).click();await expect(page.getByRole('heading',{name:'Rituais de cuidado',exact:true})).toBeVisible();await expect(page.getByText('Não exige seguidores nem postagem no perfil pessoal.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:/candidatar|contratar|pagar/i})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('EXP-05 API demonstrativa rejeita origem externa e tipo inexistente',async({request})=>{
 const denied=await request.post('/api/demo/session',{headers:{Origin:'https://example.invalid'},data:{type:'brand'}});expect(denied.status()).toBe(403);
 const invalid=await request.post('/api/demo/session',{headers:{Origin:'http://127.0.0.1:3101'},data:{type:'admin'}});expect(invalid.status()).toBe(400);
});

test('EXP-06 backend real: alternar shopper, creator e marca com os dados fictícios',async({page},info)=>{
 test.setTimeout(120000);
 await page.goto('/demo');await page.getByRole('button',{name:'Entrar como shopper',exact:true}).click();await expect(page).toHaveURL(/\/painel\/shopper$/);await expect(page.getByRole('heading',{name:'Olá, Ana · demonstração.',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Bolsa Oliva',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Editar meu perfil',exact:true}).click();await page.getByRole('button',{name:'Continuar',exact:true}).click();await expect(page.getByLabel('Seu nome',{exact:true})).toHaveValue('Ana · demonstração');
 await page.goto('/demo');await page.getByRole('button',{name:'Entrar como creator',exact:true}).click();await expect(page).toHaveURL(/\/painel\/criador$/);await expect(page.getByRole('heading',{name:'2 serviços cadastrados',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'1 trabalho cadastrado',exact:true})).toBeVisible();await page.getByRole('link',{name:'Gerenciar portfólio',exact:true}).click();await expect(page.getByText('Estudo de conteúdo de beleza · demonstração',{exact:true})).toBeVisible();
 await page.goto('/demo');await page.getByRole('button',{name:'Entrar como marca',exact:true}).click();await expect(page).toHaveURL(/\/painel\/marca$/);await expect(page.getByRole('heading',{name:'Ateliê Aurora · demonstração',exact:true})).toBeVisible();await page.getByRole('button',{name:'Campanhas em rascunho',exact:true}).click();await expect(page.getByRole('button',{name:'Abrir rascunho',exact:true})).toHaveCount(3);
 await page.getByRole('article').filter({has:page.getByRole('heading',{name:'Rituais de cuidado · demonstração',exact:true})}).getByRole('button',{name:'Abrir rascunho',exact:true}).click();await expect(page.getByLabel('Título da campanha',{exact:true})).toHaveValue('Rituais de cuidado · demonstração');await expect(page.getByLabel('Quantidade UGC',{exact:true})).toHaveValue('3');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`../../work/screenshots/${info.project.name}-demo-marca.png`,fullPage:true});await page.getByRole('button',{name:'Cancelar edição',exact:true}).click();await page.getByRole('link',{name:'Minha conta e saída',exact:true}).click();await page.getByRole('button',{name:'Sair da conta',exact:true}).click();await expect(page.getByRole('button',{name:'Entrar',exact:true})).toBeVisible();
});
