import {test,expect,type Page} from '@playwright/test';
const id='88888888-8888-4888-8888-888888888888';
const key='sb-mbxpwrgfujnjonyxzvfw-auth-token';
type Role='shopper'|'creator'|'brand';
async function setup(page:Page,role:Role|null='creator',seed=false,confirmed=true){
 const user={id,aud:'authenticated',role:'authenticated',email:'access@example.invalid',email_confirmed_at:confirmed?'2026-11-01T00:00:00Z':undefined,app_metadata:{},user_metadata:{account_type:'brand'},created_at:'2026-11-01T00:00:00Z'};
 const exp=Math.floor(Date.now()/1000)+3600,access_token=[{alg:'HS256',typ:'JWT'},{sub:id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.');
 const session={access_token,refresh_token:'test-only',expires_in:3600,expires_at:exp,token_type:'bearer',user};
 const state={session,active:seed,failProfile:false,profile:role?{user_id:id,account_type:role,display_name:'Minha conta',city:'',interests:[],onboarding_completed:true}:null};
 if(seed)await page.addInitScript(({key,session})=>localStorage.setItem(key,JSON.stringify(session)),{key,session});
 await page.route('**/auth/v1/user',route=>route.fulfill(state.active?{json:user}:{status:401,json:{error_code:'session_not_found',msg:'Session not found'}}));
 await page.route('**/auth/v1/token?**',route=>{state.active=true;return route.fulfill({json:session});});
 await page.route('**/auth/v1/logout**',route=>{state.active=false;return route.fulfill({status:204});});
 await page.route('**/rest/v1/**',route=>{
  const path=new URL(route.request().url()).pathname;
  if(path.endsWith('/account_profiles'))return route.fulfill(state.failProfile?{status:503,json:{message:'test outage'}}:{json:state.profile});
  if(path.endsWith('/profile_photos')||path.endsWith('/creator_profiles'))return route.fulfill({json:null});
  return route.fulfill({headers:{'content-range':'0-0/0'},json:[]});
 });
 return state;
}
async function login(page:Page){await page.goto('/conta');await page.getByLabel('E-mail',{exact:true}).fill('access@example.invalid');await page.getByLabel('Senha',{exact:true}).fill('test-only-password');await page.getByRole('button',{name:'Entrar',exact:true}).click();}

for(const role of ['shopper','creator','brand'] as const)test(`ACCESS-01 ${role}: login abre o painel do cadastro salvo`,async({page})=>{
 await setup(page,role);await login(page);await expect(page).toHaveURL(new RegExp(`/painel/${role==='creator'?'criador':role==='brand'?'marca':'shopper'}$`));
 await page.goto('/conta');await expect(page.getByRole('button',{name:'Sair da conta',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('ACCESS-02 login sem perfil abre onboarding, sem assumir o papel preferido',async({page})=>{
 await setup(page,null);await login(page);await expect(page).toHaveURL(/onboarding$/);await expect(page.getByRole('heading',{name:'Boas-vindas à Diderot',exact:true})).toBeVisible();
});

test('ACCESS-03 falha no perfil preserva sessão e permite abrir o espaço novamente',async({page})=>{
 const state=await setup(page,'creator');state.failProfile=true;await login(page);
 await expect(page.getByRole('main').getByRole('alert')).toContainText('Você entrou, mas não foi possível abrir seu espaço');await expect(page).toHaveURL(/conta$/);
 state.failProfile=false;await page.getByRole('button',{name:'Tentar abrir meu espaço',exact:true}).click();await expect(page).toHaveURL(/painel\/criador$/);
});

test('ACCESS-04 confirmação usa sessão verificada, ignora destino externo e remove parâmetros',async({page})=>{
 await setup(page,'creator',true);await page.goto('/auth/retorno?next=https://example.invalid/');await expect(page).toHaveURL(/painel\/criador$/);expect(new URL(page.url()).origin).toBe('http://127.0.0.1:3101');
});

test('ACCESS-05 confirmação sem perfil abre onboarding; link inválido não simula confirmação',async({page})=>{
 await setup(page,null,true);await page.goto('/auth/retorno');await expect(page).toHaveURL(/onboarding$/);
 await page.goto('/auth/retorno?error=access_denied&error_description=texto-nao-confiavel');await expect(page.getByRole('main').getByRole('alert')).toContainText('O link de confirmação não é válido ou expirou');expect(new URL(page.url()).search).toBe('');await expect(page.getByText('texto-nao-confiavel',{exact:false})).toHaveCount(0);
});

test('ACCESS-06 retorno não aceita e-mail sem confirmação',async({page})=>{
 await setup(page,'creator',true,false);await page.goto('/auth/retorno');await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível concluir a confirmação');await expect(page).toHaveURL(/auth\/retorno$/);
 await page.getByRole('button',{name:'Tentar abrir meu espaço',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível abrir seu espaço');await expect(page).toHaveURL(/auth\/retorno$/);
});

test('ACCESS-07 sessão encerrada durante a consulta não abre o painel anterior',async({page})=>{
 await setup(page,'creator');let release=()=>{},started=()=>{};const gate=new Promise<void>(r=>release=r),requested=new Promise<void>(r=>started=r);
 await page.route('**/rest/v1/account_profiles**',async route=>{started();await gate;return route.fulfill({json:{user_id:id,account_type:'creator',display_name:'Anterior',onboarding_completed:true}});});
 try{await login(page);await requested;await page.evaluate(key=>{localStorage.removeItem(key);window.dispatchEvent(new StorageEvent('storage',{key}));},key);release();await expect(page.getByRole('main').getByRole('alert')).toContainText('Sua sessão mudou ou expirou');await expect(page).toHaveURL(/conta$/);}finally{release();}
});

test('ACCESS-08 demora na solicitação preserva conta anterior e habilita nova tentativa',async({page})=>{
 await setup(page,'shopper',true);await page.clock.install();let release=()=>{};const gate=new Promise<void>(r=>release=r);
 await page.route('**/api/demo/session',async route=>{await gate;try{await route.fulfill({status:503,json:{error:'test outage'}});}catch{}});
 try{await page.goto('/demo');await page.getByRole('button',{name:'Entrar como creator',exact:true}).click();await page.clock.fastForward(20001);await expect(page.getByRole('main').getByRole('alert')).toContainText('A entrada demorou mais que o esperado');await expect(page.getByRole('button',{name:'Entrar como creator',exact:true})).toBeEnabled();expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).user.id,key)).toBe(id);}finally{release();}
});


test('ACCESS-09 retorno processa o fragmento de confirmação pelo SDK e remove tokens da URL',async({page})=>{
 const state=await setup(page,'creator');state.active=true;
 const hash=new URLSearchParams({access_token:state.session.access_token,refresh_token:state.session.refresh_token,expires_in:'3600',token_type:'bearer',type:'signup'});
 await page.goto('/auth/retorno#'+hash.toString());await expect(page).toHaveURL(/painel\/criador$/);
 expect(new URL(page.url()).hash).toBe('');expect(new URL(page.url()).search).toBe('');
});
