import {test,expect,type Page} from '@playwright/test';

const user={id:'22222222-2222-4222-8222-222222222222',aud:'authenticated',role:'authenticated',email:'creator@example.invalid',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
function session(identity=user){
  const exp=Math.floor(Date.now()/1000)+3600;
  const access_token=[{alg:'HS256',typ:'JWT'},{sub:identity.id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(p=>Buffer.from(typeof p==='string'?p:JSON.stringify(p)).toString('base64url')).join('.');
  return {access_token,refresh_token:'test-only-refresh',expires_in:3600,expires_at:exp,token_type:'bearer',user:identity};
}
async function seedSession(page:Page){await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),session());}

test('ONB-01 cadastro confirma envio sem inventar sessão e valida senha',async({page})=>{
  let calls=0;
  await page.route('**/auth/v1/signup**',route=>{calls++;return route.fulfill({json:{user,session:null}});});
  await page.goto('/cadastro');
  await page.getByLabel('E-mail',{exact:true}).fill(user.email);
  await page.getByLabel('Nova senha',{exact:true}).fill('test-password-123');
  await page.getByLabel('Confirmar senha',{exact:true}).fill('test-password-456');
  await page.getByRole('button',{name:'Criar conta',exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('confirme a mesma senha');
  expect(calls).toBe(0);
  await page.getByLabel('Confirmar senha',{exact:true}).fill('test-password-123');
  await page.getByRole('button',{name:'Criar conta',exact:true}).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText('instruções de confirmação');
  expect(calls).toBe(1);
  await expect(page.getByLabel('Nova senha',{exact:true})).toHaveValue('');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('ONB-02 recuperação trata falha e resposta sem revelar existência da conta',async({page})=>{
  let fail=true;
  await page.route('**/auth/v1/recover**',route=>route.fulfill(fail?{status:429,json:{msg:'Rate limit'}}:{json:{}}));
  await page.goto('/recuperar-acesso');
  await page.getByLabel('E-mail',{exact:true}).fill(user.email);
  await page.getByRole('button',{name:'Enviar link de recuperação'}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível solicitar');
  fail=false;
  await page.getByRole('button',{name:'Enviar link de recuperação'}).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText('Se houver uma conta elegível');
});

test('ONB-03 link de recuperação permite trocar senha após sessão verificada',async({page})=>{
  let changes=0;
  await page.route('**/auth/v1/user',route=>{
    if(route.request().method()==='PUT'){expect(route.request().postDataJSON().password).toBe('new-test-password-123');changes++;}
    return route.fulfill({json:user});
  });
  const value=session();
  await page.goto('/recuperar-acesso#'+new URLSearchParams({access_token:value.access_token,refresh_token:value.refresh_token,expires_in:'3600',token_type:'bearer',type:'recovery'}));
  await expect(page.getByRole('heading',{name:'Definir nova senha'})).toBeVisible();
  await page.getByLabel('Nova senha',{exact:true}).fill('new-test-password-123');
  await page.getByLabel('Confirmar senha',{exact:true}).fill('new-test-password-123');
  await page.getByRole('button',{name:'Salvar nova senha'}).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText('Senha alterada');
  expect(changes).toBe(1);
});

test('ONB-04 link expirado não libera formulário de nova senha',async({page})=>{
  await page.goto('/recuperar-acesso#error=access_denied&error_code=otp_expired');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('expirou');
  await expect(page.getByLabel('Nova senha',{exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Enviar link de recuperação'})).toBeVisible();
});

test('ONB-05 visitante precisa entrar para configurar perfil',async({page})=>{
  await page.goto('/conta/criador');
  await expect(page.getByRole('link',{name:'Entrar na minha conta'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Salvar perfil'})).toHaveCount(0);
});

test('ONB-06 contrato simulado: UGC sem seguidores, reload, atuação híbrida e erro de gravação',async({page})=>{
  await seedSession(page);
  let profile: Record<string,unknown>|null=null;
  let fail=false;
  await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
  await page.route('**/rest/v1/creator_profiles**',route=>{
    const method=route.request().method();
    if(method==='GET')return route.fulfill({json:profile});
    if(fail)return route.fulfill({status:503,json:{message:'Test outage'}});
    const fields=route.request().postDataJSON();
    if(method==='POST')expect(fields.user_id).toBe(user.id);
    profile={...profile,...fields};
    return route.fulfill({json:{user_id:user.id}});
  });
  await page.goto('/conta/criador');
  await page.getByLabel('Nome profissional',{exact:true}).fill('Criadora de teste');
  await page.getByRole('checkbox',{name:/UGC Creator/}).check();
  await expect(page.getByRole('spinbutton')).toHaveCount(0);
  await page.getByRole('button',{name:'Salvar perfil'}).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText('Perfil salvo');
  expect(profile!.modalities).toEqual(['ugc']);
  await page.reload();
  await expect(page.getByLabel('Nome profissional',{exact:true})).toHaveValue('Criadora de teste');
  await expect(page.getByRole('checkbox',{name:/UGC Creator/})).toBeChecked();
  await page.getByRole('checkbox',{name:/Influencer/}).check();
  await page.getByRole('checkbox',{name:/Afiliado/}).check();
  await page.getByRole('button',{name:'Salvar perfil'}).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText('Perfil salvo');
  expect(profile!.modalities).toEqual(['ugc','influencer','affiliate']);
  fail=true;
  await page.getByLabel('Nome profissional',{exact:true}).fill('Não deve persistir');
  await page.getByRole('button',{name:'Salvar perfil'}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível salvar');
  await page.reload();
  await expect(page.getByLabel('Nome profissional',{exact:true})).toHaveValue('Criadora de teste');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

for(const mode of ['normal','without-broadcast','delayed-storage'] as const)test(`${mode==='normal'?'ONB-07':mode==='without-broadcast'?'ONB-08':'ONB-09'} troca de conta em outra aba (${mode}) remove o perfil anterior`,async({page,context})=>{
  if(mode==='without-broadcast')await context.addInitScript(()=>{Reflect.set(window,'BroadcastChannel',undefined);});
  await seedSession(page);
  const other={...user,id:'33333333-3333-4333-8333-333333333333',email:'outra@example.invalid'};
  let identity=user;
  await context.route('**/auth/v1/user',route=>route.fulfill({json:identity}));
  await context.route('**/auth/v1/logout**',route=>route.fulfill({status:204}));
  await context.route('**/auth/v1/token?**',route=>{identity=other;return route.fulfill({json:session(other)});});
  await context.route('**/rest/v1/creator_profiles**',route=>route.fulfill({json:{professional_name:identity.id===user.id?'Perfil original':'Outro perfil',bio:'',city:'',state:'',modalities:['ugc']}}));
  await page.goto('/conta/criador');
  await expect(page.getByLabel('Nome profissional',{exact:true})).toHaveValue('Perfil original');
  const account=await context.newPage();
  await account.goto('/conta');
  await account.getByRole('button',{name:'Sair da conta'}).click();
  await expect(page.getByLabel('Nome profissional',{exact:true})).toHaveCount(0);
  if(mode==='delayed-storage'){
    identity=other;
    // Exercise the observed ordering explicitly: the sign-in notification is
    // delivered while getUser still has no saved session to verify.
    await page.evaluate(()=>{
      Reflect.set(window,'testSignInNotificationSeen',false);
      const channel=new BroadcastChannel('sb-mbxpwrgfujnjonyxzvfw-auth-token');
      channel.onmessage=event=>{if(event.data.event==='SIGNED_IN'){channel.close();requestAnimationFrame(()=>requestAnimationFrame(()=>Reflect.set(window,'testSignInNotificationSeen',true)));}};
    });
    await account.evaluate(value=>{const channel=new BroadcastChannel('sb-mbxpwrgfujnjonyxzvfw-auth-token');channel.postMessage({event:'SIGNED_IN',session:value});channel.close();},session(other));
    await page.waitForFunction(()=>Reflect.get(window,'testSignInNotificationSeen')===true);
    await expect(page.getByLabel('Nome profissional',{exact:true})).toHaveCount(0);
    await account.evaluate(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),session(other));
  }else{
    await account.getByLabel('E-mail',{exact:true}).fill(other.email);
    await account.getByLabel('Senha',{exact:true}).fill('test-other-password');
    await account.getByRole('button',{name:'Entrar',exact:true}).click();
    await expect(account.getByRole('button',{name:'Sair da conta',exact:true})).toBeVisible();
  }
  await expect(page.getByLabel('Nome profissional',{exact:true})).toHaveValue('Outro perfil');
  await account.close();
});
