import {test,expect} from '@playwright/test';

test('DS-01 tokens e componentes globais seguem a referência fornecida',async({page})=>{
 await page.goto('/cadastro');
 const styles=await page.evaluate(()=>{
  const root=getComputedStyle(document.documentElement),body=getComputedStyle(document.body);
  const button=getComputedStyle(document.querySelector('main button')!),field=getComputedStyle(document.querySelector('main input')!),heading=getComputedStyle(document.querySelector('h1')!);
  return {foreground:root.getPropertyValue('--foreground-primary').trim(),background:body.backgroundColor,font:body.fontFamily,fontLoaded:document.fonts.check('400 14px "DM Sans"'),titleWeight:heading.fontWeight,titleSize:heading.fontSize,buttonHeight:button.minHeight,buttonRadius:button.borderRadius,buttonCase:button.textTransform,fieldRadius:field.borderRadius};
 });
 expect(styles.foreground).toBe('#000');expect(styles.background).toBe('rgb(255, 255, 255)');expect(styles.font).toContain('DM Sans');
 await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.fonts.check('400 14px "DM Sans"'))).toBe(true);
 expect(styles.titleWeight).toBe('200');expect(styles.titleSize).toBe(page.viewportSize()!.width<=768?'30px':'52px');expect(styles.buttonHeight).toBe('48px');expect(styles.buttonRadius).toBe('4px');expect(styles.buttonCase).toBe('uppercase');expect(styles.fieldRadius).toBe('8px');
});

test('DS-02 catálogo e detalhe usam fotografias locais carregadas',async({page,request},info)=>{
 await page.goto('/criador');await expect(page.locator('.product-card')).toHaveCount(8);
 await expect(page.locator('.product-card .product-photo img')).toHaveCount(8);
 await expect.poll(()=>page.locator('.product-card img').evaluateAll(els=>els.every(e=>(e as HTMLImageElement).complete&&(e as HTMLImageElement).naturalWidth>0))).toBe(true);
 await expect(page.locator('.product-card svg')).toHaveCount(0);
 await page.getByRole('link',{name:'Ver Camisa de linho',exact:true}).click();
 await expect(page.locator('.detail-grid .product-photo img')).toHaveAttribute('alt','Fotografia ilustrativa de Camisa de linho');
 await expect(page.getByText('A fotografia é ilustrativa; produto, marca e preço são demonstrativos.',{exact:false})).toBeVisible();
 const image=await request.get('/products/camisa-linho.webp');expect(image.status()).toBe(200);expect(image.headers()['content-type']).toContain('image/webp');
 await page.screenshot({path:`../../work/design-system/${info.project.name}-produto.png`,fullPage:true});
});

test('DS-03 composição responsiva mantém cabeçalho, hero e formulários acessíveis',async({page},info)=>{
 for(const path of ['/','/criador','/cadastro','/painel/criador']){
  await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.screenshot({path:`../../work/design-system/${info.project.name}-${path.replaceAll('/','_')||'inicio'}.png`,fullPage:true});
 }
});
