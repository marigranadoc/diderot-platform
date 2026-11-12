import {test,expect} from '@playwright/test';
test('DASH-01 visitante encontra acesso e não recebe dados privados',async({page})=>{
 await page.goto('/painel/criador');await expect(page.getByRole('link',{name:'Entrar na minha conta'})).toBeVisible();await expect(page.getByText(/serviços cadastrados/)).toHaveCount(0);
});
test('DASH-02 contrato simulado: contagens, navegação e falha sem números inventados',async({page})=>{
 const user={id:'88888888-8888-4888-8888-888888888888',aud:'authenticated',role:'authenticated',email:'dashboard@example.invalid',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
 const exp=Math.floor(Date.now()/1000)+3600;
 const access_token=[{alg:'HS256',typ:'JWT'},{sub:user.id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.');
 await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),{access_token,refresh_token:'test-only',expires_at:exp,expires_in:3600,token_type:'bearer',user});
 let fail=false;
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/creator_profiles**',route=>route.fulfill({json:{professional_name:'Creator demonstrativo'}}));
 for(const [table,count] of [['creator_services',2],['creator_portfolio_items',3]] as const){await page.route(`**/rest/v1/${table}**`,route=>route.fulfill(fail?{status:503,body:''}:{status:200,headers:{'content-range':`0-${count-1}/${count}`,'access-control-expose-headers':'content-range'},body:''}));}
 await page.goto('/painel/criador');await expect(page.getByRole('heading',{name:'2 serviços cadastrados'})).toBeVisible();await expect(page.getByRole('heading',{name:'3 trabalhos cadastrados'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Gerenciar portfólio'})).toHaveAttribute('href','/conta/criador/portfolio');await expect(page.getByRole('link',{name:'Gerenciar serviços'})).toHaveAttribute('href','/conta/criador/servicos');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 fail=true;await page.reload();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível carregar');await expect(page.getByRole('heading',{name:'2 serviços cadastrados'})).toHaveCount(0);
 fail=false;await page.getByRole('button',{name:'Tentar novamente'}).click();await expect(page.getByRole('heading',{name:'2 serviços cadastrados'})).toBeVisible();
});
