import {test,expect} from '@playwright/test';

test('HOME-01 estrutura editorial, fotografias e fonte Reckless',async({page},info)=>{
 await page.goto('/');
 await expect(page.locator('.home-nav')).toHaveCSS('position','fixed');
 expect(await page.locator('[data-home-section]').evaluateAll(els=>els.map(e=>e.getAttribute('data-home-section')))).toEqual(['hero','mobile','curadoria','circulos','cta','categorias','marcas']);
 await expect(page.locator('.curator-mosaic>a')).toHaveCount(9);
 for(const grid of ['.circle-grid','.category-grid','.brand-grid'])await expect(page.locator(`${grid}>a`)).toHaveCount(8);
 await expect(page.locator('.footer-columns>section')).toHaveCount(5);
 await page.evaluate(()=>document.fonts.load('400 34px Reckless'));
 expect(await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Reckless');
 expect(await page.evaluate(()=>document.fonts.check('400 34px Reckless'))).toBe(true);
 for(const image of await page.locator('.home-page img').all()){
  await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 }
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`../../work/design-system/${info.project.name}-home-final.png`,fullPage:true});
});

test('HOME-02 categorias, marcas e busca abrem resultados reais',async({page})=>{
 await page.goto('/');await page.locator('.category-grid>a').filter({has:page.getByRole('heading',{name:'Camisas',exact:true})}).click();
 await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('.product-card h3')).toHaveText('Camisa de linho');
 await page.goto('/');await page.locator('.brand-grid').getByRole('link',{name:'Estúdio Um',exact:true}).first().click();
 await expect(page.locator('.product-card')).toHaveCount(2);
 await page.goto('/');await page.getByRole('button',{name:'Abrir busca',exact:true}).click();
 await page.getByRole('searchbox',{name:'Buscar produtos ou marcas'}).fill('serum');
 await page.getByRole('button',{name:'Buscar',exact:true}).click();
 await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('.product-card h3')).toHaveText('Sérum botânico');
});

test('HOME-03 menu funciona com teclado e mantém foco no celular',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Menu de navegação'});await expect(dialog).toBeVisible();
 await expect(page.getByRole('button',{name:'Fechar menu',exact:true})).toBeFocused();
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Abrir menu',exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
 await dialog.getByRole('link',{name:'Categorias',exact:true}).click();
 await expect(dialog).toHaveCount(0);await expect(page).toHaveURL(/#categorias$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
