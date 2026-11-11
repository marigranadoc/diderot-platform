import {test,expect} from '@playwright/test';
import {products,collections} from '../lib/catalog';

test('AUD-01 todas as rotas, âncoras, SVGs e recuperação de erro',async({page})=>{
 const paths=['/','/criador',...collections.map(c=>`/colecoes/${c.slug}`),...products.map(p=>`/produto/${p.slug}`)];
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of paths){
  expect((await page.goto(path))?.status(),path).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);
  for(const href of await page.locator('a[href*="#"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')!).filter(h=>h.startsWith('#')||h.split('#')[0]===location.pathname))){
   await expect(page.locator(`[id="${href.split('#')[1]}"]`),`${path}: ${href}`).toHaveCount(1);
  }
  for(const art of await page.getByRole('img').all()){await expect(art).toHaveAttribute('aria-label',/\S+/)}
  expect(await page.locator('svg').evaluateAll(els=>els.every(e=>e.querySelectorAll('path,rect,ellipse').length>0))).toBe(true);
 }
 for(const path of ['/produto/inexistente','/colecoes/inexistente','/rota-inexistente']){
  expect((await page.goto(path))?.status()).toBe(404);
  await page.getByRole('link',{name:'Voltar para a loja'}).click();await expect(page).toHaveURL(/\/criador$/);
 }
 expect(errors).toEqual([]);
});

test('AUD-02 disponibilidade deve revelar informação, não apenas mudar o hash',async({page})=>{
 for(const product of products){
  await page.goto(`/produto/${product.slug}`);
  await page.getByText('Ver disponibilidade demonstrativa ↓',{exact:true}).click();
  await expect(page.locator('#disponibilidade')).toHaveAttribute('open','');
  await expect(page.getByText('Não está à venda.',{exact:false})).toBeVisible();
 }
});

test('AUD-03 filtros, preços completos, remoção de favorito e isolamento da coleção',async({page})=>{
 await page.goto('/criador');
 for(const category of ['Moda','Beleza','Casa']){
  await page.getByRole('button',{name:category,exact:true}).click();
  await expect(page.locator('.product-card')).toHaveCount(products.filter(p=>p.category===category).length);
 }
 await page.getByRole('button',{name:'Todos',exact:true}).click();
 for(const [option,direction] of [['menor',1],['maior',-1]] as const){
  await page.getByRole('combobox',{name:'Ordenar'}).selectOption(option);
  const names=await page.locator('.product-card h3').allTextContents();
  const expected=[...products].sort((a,b)=>(a.price-b.price)*direction).map(p=>p.name);
  expect(names).toEqual(expected);
 }
 await page.getByRole('button',{name:'Salvar Bolsa Oliva',exact:true}).click();
 await expect(page.getByText('1 favorito nesta visita')).toBeVisible();
 await page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true}).click();
 await expect(page.getByText('0 favoritos nesta visita')).toBeVisible();
 for(const c of collections){await page.goto(`/colecoes/${c.slug}`);await expect(page.locator('.product-card')).toHaveCount(products.filter(p=>p.collection===c.slug).length)}
});

test('AUD-04 busca tolera espaços, maiúsculas e acentos',async({page})=>{
 await page.goto('/criador');
 for(const query of ['serum','  SÉRUM  ','ESTUDIO UM']){
  await page.getByRole('searchbox',{name:'Buscar na loja'}).fill(query);
  await expect(page.locator('.product-card')).toHaveCount(query==='ESTUDIO UM'?2:1);
 }
});

test('AUD-05 celular estreito, tablet e teclado nos controles principais',async({page},testInfo)=>{
 for(const width of [320,768]){
  await page.setViewportSize({width,height:900});
  for(const path of ['/','/criador','/colecoes/rituais','/produto/bolsa-oliva']){
   await page.goto(path);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} em ${width}px`).toBe(true);
   await page.screenshot({path:`../../work/auditoria/${testInfo.project.name}-${width}-${path.replaceAll('/','_')||'inicio'}.png`,fullPage:true});
  }
 }
 await page.goto('/produto/bolsa-oliva');
 const summary=page.locator('#disponibilidade summary');await summary.focus();await page.keyboard.press('Enter');
 await expect(page.getByText('Não está à venda.',{exact:false})).toBeVisible();
 await page.goto('/criador');const favorite=page.getByRole('button',{name:'Salvar Bolsa Oliva',exact:true});
 await favorite.focus();await page.keyboard.press('Space');await expect(page.getByText('1 favorito nesta visita')).toBeVisible();
});

test('GAP-01 @pendente shopper mantém favorito depois de recarregar',async({page})=>{
 await page.goto('/criador');await page.getByRole('button',{name:'Salvar Bolsa Oliva',exact:true}).click();
 await expect(page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true}),'Favoritos não persistem; o catálogo tem banco, mas ainda não há conta nem gravação de favoritos.').toBeVisible({timeout:1500});
});

for(const role of [
 {id:'GAP-02',name:'creator',entry:/painel do criador|área do criador|gerenciar loja|adicionar produto|novo produto/i,path:'/criador'},
 {id:'GAP-03',name:'brand',entry:/área da marca|painel da marca|sou uma marca|criar campanha|cadastrar marca/i,path:'/'},
 {id:'GAP-04',name:'administrador',entry:/administração|painel administrativo|entrar como administrador/i,path:'/'},
])test(`${role.id} @pendente jornada ${role.name} tem entrada de gestão`,async({page})=>{
 await page.goto(role.path);
 const entry=page.getByRole('link',{name:role.entry}).or(page.getByRole('button',{name:role.entry}));
 await expect(entry.first(),`Jornada ${role.name} bloqueada na entrada: nenhuma tela de gestão existe no código.`).toBeVisible({timeout:1500});
 // Sem entrada não é possível avançar, autenticar, gravar, reler e verificar permissões.
});
