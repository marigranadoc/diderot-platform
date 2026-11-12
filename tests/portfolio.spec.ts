import {test,expect} from '@playwright/test';
import {portfolioLink} from '../lib/portfolio';

test('PORT-01 links de mídia aceitam HTTPS sem credenciais',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,test','http://example.com/video','https://user:password@example.com/video','not a url']) expect(portfolioLink(url)).toBeNull();
 expect(portfolioLink(' https://example.com/video ')).toBe('https://example.com/video');
});

test('PORT-02 visitante precisa entrar para gerenciar portfólio',async({page})=>{
 await page.goto('/conta/criador/portfolio');
 await expect(page.getByRole('link',{name:'Entrar para gerenciar portfólio'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Salvar trabalho'})).toHaveCount(0);
});

test('PORT-03 contrato simulado: validar, criar, reler, editar, falhar e excluir',async({page})=>{
 const user={id:'66666666-6666-4666-8666-666666666666',aud:'authenticated',role:'authenticated',email:'portfolio@example.invalid',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
 const exp=Math.floor(Date.now()/1000)+3600;
 const access_token=[{alg:'HS256',typ:'JWT'},{sub:user.id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.');
 await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),{access_token,refresh_token:'test-refresh',expires_at:exp,expires_in:3600,token_type:'bearer',user});
 let rows:Record<string,any>[]=[];let fail=false;let writes=0;let hasProfile=true;
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/creator_profiles**',route=>route.fulfill({json:hasProfile?{user_id:user.id}:null}));
 await page.route('**/rest/v1/creator_portfolio_items**',route=>{
  const method=route.request().method();if(method==='GET')return route.fulfill({json:rows});
  writes++;if(fail)return route.fulfill({status:503,json:{message:'Test outage'}});
  if(method==='POST'){const body=route.request().postDataJSON();expect(body.user_id).toBe(user.id);rows=[{id:'77777777-7777-4777-8777-777777777777',...body}];return route.fulfill({json:rows[0]});}
  if(method==='PATCH'){rows=[{...rows[0],...route.request().postDataJSON()}];return route.fulfill({json:rows[0]});}
  const removed=rows[0];rows=[];return route.fulfill({json:{id:removed.id}});
 });
 await page.goto('/conta/criador/portfolio');
 await expect(page.getByText('Nenhum trabalho cadastrado.',{exact:false})).toBeVisible();
 await page.getByLabel('Título do trabalho',{exact:true}).fill('Demonstração UGC');
 await page.getByLabel('Link do trabalho',{exact:true}).fill('http://example.com/video');
 await page.getByRole('button',{name:'Salvar trabalho'}).click();
 await expect(page.getByRole('main').getByRole('alert')).toContainText('HTTPS válido');expect(writes).toBe(0);
 await page.getByLabel('Link do trabalho',{exact:true}).fill('https://example.com/video');
 await page.getByLabel('Sua participação',{exact:true}).fill('Roteiro e edição');
 await page.getByRole('button',{name:'Salvar trabalho'}).click();
 await expect(page.getByRole('main').getByRole('status')).toContainText('Trabalho salvo');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Demonstração UGC',exact:true})).toBeVisible();
 const link=page.getByRole('link',{name:'Abrir trabalho: Demonstração UGC ↗',exact:true});
 await expect(link).toHaveAttribute('href','https://example.com/video');await expect(link).toHaveAttribute('rel','noopener noreferrer');
 await page.getByRole('button',{name:'Editar Demonstração UGC',exact:true}).click();
 await page.getByRole('combobox',{name:'Tipo de trabalho',exact:true}).selectOption('case');
 await page.getByLabel('Título do trabalho',{exact:true}).fill('Case de teste');
 await page.getByRole('button',{name:'Salvar trabalho'}).click();
 await expect(page.getByRole('heading',{name:'Case de teste',exact:true})).toBeVisible();expect(rows[0].item_type).toBe('case');
 await page.getByRole('button',{name:'Editar Case de teste',exact:true}).click();
 await page.getByLabel('Título do trabalho',{exact:true}).fill('Não deve gravar');fail=true;
 await page.getByRole('button',{name:'Salvar trabalho'}).click();
 await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível');
 await page.reload();await expect(page.getByRole('heading',{name:'Case de teste',exact:true})).toBeVisible();fail=false;
 await page.getByRole('button',{name:'Excluir Case de teste',exact:true}).click();
 await page.getByRole('button',{name:'Cancelar exclusão'}).click();expect(rows).toHaveLength(1);
 await page.getByRole('button',{name:'Excluir Case de teste',exact:true}).click();
 await page.getByRole('button',{name:'Confirmar exclusão'}).click();
 await expect(page.getByRole('main').getByRole('status')).toContainText('Trabalho excluído');
 await page.reload();await expect(page.getByText('Nenhum trabalho cadastrado.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 hasProfile=false;await page.reload();await expect(page.getByText('Configure seu perfil de creator antes de adicionar trabalhos.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Salvar trabalho'})).toHaveCount(0);
});
