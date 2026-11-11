import {test,expect} from '@playwright/test';
test('início, perfil, coleção, produto e retorno',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('boa descoberta');
 await page.getByRole('link',{name:'Explore a loja da Clara'}).click();await expect(page).toHaveURL(/criador/);
 await expect(page.locator('.product-card')).toHaveCount(8);
 await page.locator('.collection-nav').getByRole('link',{name:'Pequenos rituais'}).click();await expect(page).toHaveURL(/colecoes\/rituais/);await expect(page.locator('.product-card')).toHaveCount(2);
 await page.getByRole('link',{name:'Ver Sérum botânico',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('Sérum botânico');
 await page.getByText('Ver disponibilidade demonstrativa ↓',{exact:true}).click();await expect(page.getByText('Não está à venda.',{exact:false})).toBeVisible();
 await page.getByRole('link',{name:'Clara Martins ↗'}).click();await expect(page).toHaveURL(/criador/);
 expect(errors).toEqual([]);
});
test('busca, categoria, ordenação, favoritos e estado vazio',async({page})=>{
 await page.goto('/criador');
 await page.getByRole('button',{name:'Beleza',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(2);
 await page.getByRole('combobox',{name:'Ordenar'}).selectOption('menor');await expect(page.locator('.product-card').first()).toContainText('Creme essencial');
 await page.getByRole('button',{name:'Salvar Creme essencial',exact:true}).click();await expect(page.getByRole('button',{name:'Remover Creme essencial'})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByText('1 favorito nesta visita')).toBeVisible();
 await page.getByRole('searchbox',{name:'Buscar na loja'}).fill('inexistente');await expect(page.locator('.product-card')).toHaveCount(0);await expect(page.getByRole('heading',{name:'Nenhuma descoberta por aqui.'})).toBeVisible();
 await page.getByRole('button',{name:'Limpar filtros'}).click();await expect(page.locator('.product-card')).toHaveCount(8);
 await page.getByRole('searchbox',{name:'Buscar na loja'}).fill('Bolsa');await expect(page.locator('.product-card')).toHaveCount(2);
});
test('rotas, links internos, imagens e largura responsiva',async({page,request},testInfo)=>{
 for(const path of ['/','/criador','/colecoes/casa','/produto/bolsa-oliva']){
  const response=await page.goto(path);expect(response?.status()).toBe(200);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await expect(page.locator('h1')).toHaveCount(1);
  await page.screenshot({path:`../../work/screenshots/${testInfo.project.name}-${path==='/'?'inicio':path.replaceAll('/','-')}.png`,fullPage:true});
  for(const href of await page.locator('a[href^="/"]').evaluateAll(els=>[...new Set(els.map(e=>e.getAttribute('href')!.split('#')[0]))])){expect((await request.get(href)).status()).toBe(200)}
 }
 expect((await request.get('/produto/nao-existe')).status()).toBe(404);
 expect((await request.get('/colecoes/nao-existe')).status()).toBe(404);
});
