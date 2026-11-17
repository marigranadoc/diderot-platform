import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import type {ShopDocument,ShopRow} from '../lib/creator-shop';
const id='11111111-1111-4111-8111-111111111111';
async function setup(page:Page){
 const user={id,aud:'authenticated',role:'authenticated',email:'shop@example.invalid',email_confirmed_at:'2026-11-01T00:00:00Z',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
 const exp=Math.floor(Date.now()/1000)+3600;const access_token=[{alg:'HS256',typ:'JWT'},{sub:id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.');
 await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),{access_token,refresh_token:'test-only',expires_in:3600,expires_at:exp,token_type:'bearer',user});
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/favorites**',route=>route.fulfill({json:[]}));
 await page.route('**/rest/v1/account_profiles**',route=>route.fulfill({json:null}));
 await page.route('**/rest/v1/creator_profiles**',route=>route.fulfill({json:{professional_name:'Clara de teste'}}));
 const state={row:null as ShopRow|null,photos:{} as Record<string,string|null>,requests:[] as {p_id:string;p_slug:string;p_revision:number;p_request:string;p_action:string;p_document:ShopDocument}[],photoWrites:0,uploads:0,loseResponse:false,conflict:false,failRead:false};
 await page.route('**/rest/v1/profile_photos**',route=>{const kind=new URL(route.request().url()).searchParams.get('kind')?.slice(3)??'creator';return route.fulfill({json:kind in state.photos?{object_path:state.photos[kind]}:null});});
 await page.route('**/rest/v1/rpc/save_profile_photo',route=>{const input=route.request().postDataJSON();state.photoWrites++;state.photos[input.p_kind]=input.p_path;return route.fulfill({json:{kind:input.p_kind,subject_id:input.p_subject,object_path:input.p_path}});});
 const image=await readFile('public/products/bolsa-oliva.webp');
 await page.route('**/storage/v1/**',route=>{
  const url=new URL(route.request().url()),method=route.request().method();
  if(method==='GET')return route.fulfill({contentType:'image/webp',body:image});
  if(url.pathname.includes('/object/sign/'))return route.fulfill({json:{signedURL:url.pathname.replace('/storage/v1','')+'?token=test-only'}});
  state.uploads++;return route.fulfill({json:{Id:crypto.randomUUID(),Key:url.pathname.split('/object/')[1]}});
 });
 await page.route('**/rest/v1/creator_shops**',route=>route.fulfill(state.failRead?{status:503,json:{message:'test outage'}}:{json:state.row}));
 const receipts=new Map<string,ShopRow>();
 await page.route('**/rest/v1/rpc/save_creator_shop',route=>{
  const input=route.request().postDataJSON() as typeof state.requests[number];state.requests.push(input);
  if(state.conflict)return route.fulfill({status:409,json:{code:'40001',message:'stale revision'}});
  if(input.p_action==='publish'&&!input.p_document.items.some(x=>x.visible)&&!input.p_document.posts.some(x=>x.visible))return route.fulfill({status:400,json:{code:'22023',message:'Add at least one visible product or post'}});
  if(input.p_action==='publish'&&input.p_document.items.some(x=>x.visible&&!x.source_slug&&(!x.image_path||!x.url)))return route.fulfill({status:400,json:{code:'22023',message:'Visible products need an image and HTTPS destination'}});
  let row=receipts.get(input.p_request);
  if(!row){row={id:input.p_id,slug:input.p_slug,document:structuredClone(input.p_document),revision:input.p_revision+1,is_published:input.p_action==='publish'?true:input.p_action==='unpublish'?false:state.row?.is_published??false,published_document:input.p_action==='publish'?{...structuredClone(input.p_document),avatar_path:state.photos.creator??null}:state.row?.published_document??null,published_at:input.p_action==='publish'?new Date().toISOString():state.row?.published_at??null};state.row=row;receipts.set(input.p_request,row);}
  if(state.loseResponse){state.loseResponse=false;return route.fulfill({status:503,json:{message:'response lost after commit'}});}
  return route.fulfill({json:{id:row.id,revision:row.revision,is_published:row.is_published}});
 });
 await page.goto('/painel/criador/loja');await expect(page.getByLabel('Nome público da loja',{exact:true})).toHaveValue('Clara de teste');return state;
}
async function fillProfile(page:Page){await page.getByLabel('Endereço da loja',{exact:true}).fill('minha-loja-teste');await page.getByLabel('Bio pública',{exact:true}).fill('Minhas recomendações pessoais');await page.getByLabel('Link da rede 1',{exact:true}).fill('https://www.instagram.com/creator');await page.getByLabel('Link da rede 2',{exact:true}).fill('https://www.tiktok.com/@creator');await page.getByLabel('Link da rede 3',{exact:true}).fill('https://www.youtube.com/@creator');}
async function saved(page:Page){await expect(page.getByText('Alterações salvas e relidas do banco. Publique para atualizar a loja pública.',{exact:true})).toBeVisible();}

test('SHOP-01 contrato: perfil com foto, redes sociais, produto, seção e post persistem',async({page},info)=>{
 const state=await setup(page);await fillProfile(page);
 await page.getByLabel('Escolher foto de perfil',{exact:true}).setInputFiles('public/products/bolsa-oliva.webp');await expect(page.getByText('Foto salva e confirmada.',{exact:true})).toBeVisible();expect(state.photoWrites).toBe(1);
 await page.getByRole('button',{name:'Salvar perfil da loja',exact:true}).click();await saved(page);
 await page.getByRole('button',{name:'Produtos',exact:true}).click();await page.getByRole('button',{name:'Adicionar produto',exact:true}).click();
 await page.getByLabel('Nome do produto',{exact:true}).fill('Minha bolsa');await page.getByLabel('Marca ou loja',{exact:true}).fill('Minha seleção');await page.getByLabel('Preço informado (R$, opcional)',{exact:true}).fill('150,50');await page.getByLabel('Link do produto ou link de afiliado',{exact:true}).fill('https://example.invalid/bolsa');await page.getByLabel('Este é um link de afiliado informado por mim',{exact:true}).check();
 await page.getByLabel('Escolher foto do produto',{exact:true}).setInputFiles('public/products/bolsa-oliva.webp');await expect(page.getByRole('img',{name:'Escolher foto do produto',exact:true})).toBeVisible();await page.getByRole('button',{name:'Salvar produto',exact:true}).click();await saved(page);expect(state.row?.document.items[0].price_cents).toBe(15050);
 await page.getByRole('button',{name:'Posts',exact:true}).click();await page.getByRole('button',{name:'Criar post',exact:true}).click();await page.getByLabel('Título do post',{exact:true}).fill('Meu look favorito');await page.getByLabel('Legenda do post',{exact:true}).fill('Uma escolha para todos os dias.');await page.getByLabel('Escolher foto do post',{exact:true}).setInputFiles('public/products/bolsa-oliva.webp');await expect(page.getByRole('img',{name:'Escolher foto do post',exact:true})).toBeVisible();await page.getByRole('group',{name:'Produtos associados ao post',exact:true}).getByLabel('Minha bolsa',{exact:true}).check();await page.getByRole('button',{name:'Salvar post',exact:true}).click();await saved(page);
 await page.getByRole('button',{name:'Coleções e seções',exact:true}).click();await page.getByRole('button',{name:'Adicionar seção / coleção',exact:true}).click();await page.getByLabel('Nome da seção',{exact:true}).fill('Meus looks');await page.getByRole('radio',{name:/Posts verticais/}).check();await page.getByRole('group',{name:'Produtos desta seção',exact:true}).getByLabel('Minha bolsa',{exact:true}).check();await page.getByRole('group',{name:'Posts desta seção',exact:true}).getByLabel('Meu look favorito',{exact:true}).check();await page.getByRole('button',{name:'Salvar seção',exact:true}).click();await saved(page);expect(state.row?.document.collections[0]).toMatchObject({layout:'vertical_posts',item_ids:[state.row?.document.items[0].id],post_ids:[state.row?.document.posts[0].id]});
 await page.getByRole('button',{name:'Pré-visualizar loja',exact:true}).click();await expect(page.getByRole('heading',{name:'Clara de teste',exact:true})).toBeVisible();await expect(page.getByRole('img',{name:'Foto de Clara de teste',exact:true})).toBeVisible();const socials=page.getByRole('navigation',{name:'Redes sociais da creator'});await expect(socials.getByRole('link')).toHaveCount(3);await expect(socials.locator('svg')).toHaveCount(3);await expect(socials.getByRole('link').first()).toHaveAttribute('aria-label',/Instagram/);expect(await socials.getByRole('link').evaluateAll(elements=>elements.map(x=>x.textContent))).toEqual(['','','']);
 const socialBox=await socials.boundingBox(),ctaBox=await page.getByRole('link',{name:'Explore minhas escolhas ↓',exact:true}).boundingBox();expect(socialBox!.y).toBeGreaterThanOrEqual(ctaBox!.y+ctaBox!.height);await expect(socials.getByRole('link').first()).toHaveAttribute('target','_blank');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`../../work/screenshots/${info.project.name}-minha-loja-preview.png`,fullPage:true});
 await page.reload();await page.getByRole('button',{name:'Loja e perfil',exact:true}).click();await expect(page.getByLabel('Bio pública',{exact:true})).toHaveValue('Minhas recomendações pessoais');await expect(page.getByLabel('Link da rede 3',{exact:true})).toHaveValue('https://www.youtube.com/@creator');await page.getByRole('button',{name:'Produtos',exact:true}).click();await expect(page.getByRole('heading',{name:'Minha bolsa',exact:true})).toBeVisible();expect(state.uploads).toBe(3);
});

test('SHOP-02 contrato: catálogo, duplicar/ocultar/ordenar seções e publicação explícita',async({page})=>{
 const state=await setup(page);await fillProfile(page);await page.getByRole('button',{name:'Publicar loja',exact:true}).click();await page.getByRole('button',{name:'Confirmar publicação',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('pelo menos um produto');
 await page.getByRole('button',{name:'Produtos',exact:true}).click();await page.getByText('Adicionar do catálogo',{exact:true}).click();await page.getByRole('button',{name:'Adicionar Bolsa Oliva à loja',exact:true}).click();await saved(page);
 await page.getByRole('button',{name:'Coleções e seções',exact:true}).click();await page.getByRole('button',{name:'Adicionar seção / coleção',exact:true}).click();await page.getByLabel('Nome da seção',{exact:true}).fill('Favoritos');await page.getByRole('group',{name:'Produtos desta seção',exact:true}).getByLabel('Bolsa Oliva',{exact:true}).check();await page.getByRole('button',{name:'Salvar seção',exact:true}).click();await saved(page);
 await page.getByRole('button',{name:'Duplicar seção Favoritos',exact:true}).click();await saved(page);expect(state.row?.document.collections).toHaveLength(2);await page.getByRole('button',{name:'Subir seção Favoritos (cópia)',exact:true}).click();await saved(page);expect(state.row?.document.collections[0].title).toBe('Favoritos (cópia)');await page.getByRole('button',{name:'Ocultar seção Favoritos',exact:true}).click();await saved(page);expect(state.row?.document.collections[1].visible).toBe(false);
 await page.getByRole('button',{name:'Publicar loja',exact:true}).click();await page.getByRole('button',{name:'Confirmar publicação',exact:true}).click();await expect(page.getByText('Loja publicada e confirmada. Abra Ver minha loja para conferir.',{exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Ver minha loja ↗',exact:true})).toHaveAttribute('href','/loja/minha-loja-teste');
 await page.getByRole('button',{name:'Loja e perfil',exact:true}).click();await page.getByLabel('Bio pública',{exact:true}).fill('Alteração ainda privada');await page.getByRole('button',{name:'Salvar perfil da loja',exact:true}).click();await saved(page);expect(state.row?.published_document?.bio).toBe('Minhas recomendações pessoais');await page.getByRole('button',{name:'Retirar loja do ar',exact:true}).click();await page.getByRole('button',{name:'Confirmar retirada',exact:true}).click();await expect(page.getByText('Loja retirada do ar. Seu rascunho foi preservado.',{exact:true})).toBeVisible();expect(state.row?.is_published).toBe(false);await expect(page.getByRole('link',{name:'Ver minha loja ↗',exact:true})).toHaveCount(0);
});

test('SHOP-03 contrato: resposta perdida, conflito, campos preservados e URL insegura',async({page})=>{
 const state=await setup(page);await fillProfile(page);await page.getByLabel('Link da rede 1',{exact:true}).fill('javascript:alert(1)');await page.getByRole('button',{name:'Salvar perfil da loja',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('HTTPS');expect(state.requests).toHaveLength(0);await page.getByLabel('Link da rede 1',{exact:true}).fill('https://www.instagram.com/creator');
 state.loseResponse=true;await page.getByRole('button',{name:'Salvar perfil da loja',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');await expect(page.getByLabel('Bio pública',{exact:true})).toHaveValue('Minhas recomendações pessoais');await page.getByRole('button',{name:'Salvar perfil da loja',exact:true}).click();await saved(page);expect(state.requests[0].p_request).toBe(state.requests[1].p_request);expect(state.row?.revision).toBe(1);
 state.conflict=true;await page.getByLabel('Bio pública',{exact:true}).fill('Minha alteração pendente');await page.getByRole('button',{name:'Salvar perfil da loja',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('outra sessão');await expect(page.getByLabel('Bio pública',{exact:true})).toHaveValue('Minha alteração pendente');
});

test('SHOP-04 backend real: loja pública demonstrativa, redes abaixo do CTA e acesso pelo painel',async({page},info)=>{
 test.setTimeout(120000);await page.goto('/demo');await page.getByRole('button',{name:'Entrar como creator',exact:true}).click();await page.getByRole('link',{name:'Gerenciar minha loja',exact:true}).click();await expect(page.getByLabel('Nome público da loja',{exact:true})).toHaveValue('Clara Martins');
 const popupPromise=page.waitForEvent('popup');await page.getByRole('link',{name:'Ver minha loja ↗',exact:true}).click();const publicPage=await popupPromise;await expect(publicPage.getByRole('heading',{name:'Clara Martins',exact:true})).toBeVisible();await expect(publicPage.getByRole('img',{name:'Foto de perfil não adicionada',exact:true})).toBeVisible();await expect(publicPage.locator('.product-grid .product-card')).toHaveCount(2);expect(await publicPage.locator('.product-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(info.project.name==='celular'?2:4);expect(await publicPage.locator('body').innerText()).not.toMatch(/demonstrativ|demonstração|fictíci|sem foto/i);await expect(publicPage.getByRole('heading',{name:'Bolsa Oliva',exact:true})).toBeVisible();await expect(publicPage.getByRole('heading',{name:'Uma casa com intenção',exact:true})).toBeVisible();const nav=publicPage.getByRole('navigation',{name:'Redes sociais da creator'});await expect(nav.getByRole('link')).toHaveCount(3);const a=await publicPage.getByRole('link',{name:'Explore minhas escolhas ↓',exact:true}).boundingBox(),b=await nav.boundingBox();expect(b!.y).toBeGreaterThanOrEqual(a!.y+a!.height);expect(await publicPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect.poll(()=>publicPage.locator('.shop-image img').evaluateAll(images=>images.every(image=>(image as HTMLImageElement).complete&&(image as HTMLImageElement).naturalWidth>0))).toBe(true);await publicPage.screenshot({path:`../../work/screenshots/${info.project.name}-loja-publica-real.png`,fullPage:true});await publicPage.close();await page.goto('/conta');await page.getByRole('button',{name:'Sair da conta',exact:true}).click();
});

test('SHOP-05 contrato: marca envia/remove foto e membro permanece somente leitura',async({page})=>{
 const state=await setup(page);const org='22222222-2222-4222-8222-222222222222';let member=false;
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:[{id:org,owner_user_id:member?'33333333-3333-4333-8333-333333333333':id,name:'Marca com foto',website:'',description:'',created_at:'2026-11-01T00:00:00Z'}]}));await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:[{organization_id:org,role:member?'member':'owner'}]}));
 await page.goto('/painel/marca');await page.getByLabel('Escolher foto da marca',{exact:true}).setInputFiles('public/products/bolsa-oliva.webp');await expect(page.getByText('Foto salva e confirmada.',{exact:true})).toBeVisible();expect(state.photos.brand).toContain('/brand/');
 await page.getByRole('button',{name:'Remover foto',exact:true}).click();await expect(page.getByText('Foto removida do cadastro.',{exact:true})).toBeVisible();expect(state.photos.brand).toBeNull();expect(state.photoWrites).toBe(2);
 member=true;await page.reload();await expect(page.getByRole('heading',{name:'Marca com foto',exact:true})).toBeVisible();await expect(page.getByLabel('Escolher foto da marca',{exact:true})).toHaveCount(0);expect(state.photoWrites).toBe(2);
});

test('SHOP-06 saída em outra aba descarta resposta privada pendente',async({page,context})=>{
 await setup(page);let release:()=>void=()=>{},started:()=>void=()=>{};const gate=new Promise<void>(resolve=>{release=resolve;}),requested=new Promise<void>(resolve=>{started=resolve;});
 await page.route('**/rest/v1/creator_shops**',async route=>{started();await gate;return route.fulfill({json:null});});
 try{await page.getByRole('button',{name:'Recarregar loja',exact:true}).click();await requested;const other=await context.newPage();await other.goto('/conta');await other.evaluate(()=>localStorage.removeItem('sb-mbxpwrgfujnjonyxzvfw-auth-token'));await expect(page.getByRole('link',{name:'Entrar na minha conta',exact:true})).toBeVisible();release();await expect(page.getByLabel('Nome público da loja',{exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Publicar loja',exact:true})).toHaveCount(0);}finally{release();}
});


test('SHOP-07 loja pública: cards compactos, busca, ordenação e favorito de visitante persistente',async({page})=>{
 await page.goto('/loja/clara-demonstracao');
 await expect(page.locator('.product-grid .product-card')).toHaveCount(2);
 const socials=page.getByRole('navigation',{name:'Redes sociais da creator'});
 expect(await socials.getByRole('link').allTextContents()).toEqual(['','','']);
 await expect(socials.locator('svg')).toHaveCount(3);
 await page.getByRole('combobox',{name:'Ordenar',exact:true}).selectOption('menor');
 await expect(page.locator('.product-card h3').first()).toHaveText('Vaso orgânico');
 await page.getByRole('combobox',{name:'Ordenar',exact:true}).selectOption('maior');
 await expect(page.locator('.product-card h3').first()).toHaveText('Bolsa Oliva');
 await page.getByRole('searchbox',{name:'Buscar nesta loja',exact:true}).fill('vaso');
 await expect(page.locator('.product-card')).toHaveCount(1);
 await page.getByRole('searchbox',{name:'Buscar nesta loja',exact:true}).fill('');
 await page.getByRole('button',{name:'Salvar Bolsa Oliva',exact:true}).click();
 await expect(page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.reload();await expect(page.getByRole('button',{name:'Remover Bolsa Oliva',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('link',{name:'Ver Bolsa Oliva',exact:true}).click();await expect(page).toHaveURL(/produto\/bolsa-oliva$/);
 await page.getByText('Ver disponibilidade ↓',{exact:true}).click();await expect(page.getByText('O link de compra deste produto ainda não foi cadastrado.',{exact:true})).toBeVisible();
});


test('SHOP-08 perfil: upload compartilhado com loja, navegação por área e publicação da foto',async({page},info)=>{
 const state=await setup(page);
 await page.route('**/rest/v1/account_profiles**',route=>route.fulfill({json:{user_id:id,account_type:'creator',display_name:'Clara de teste',city:'',interests:[],onboarding_completed:true}}));
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:null}));
 await page.goto('/conta/perfil');
 await expect(page.getByRole('button',{name:'Salvar perfil',exact:true})).toBeVisible();
 await page.getByLabel('Escolher foto de perfil',{exact:true}).setInputFiles('public/products/bolsa-oliva.webp');
 await expect(page.getByText('Foto salva e confirmada.',{exact:true})).toBeVisible();
 await expect(page.locator('aside').getByRole('img',{name:'Minha foto de perfil',exact:true})).toBeVisible();
 await page.reload();await expect(page.getByRole('main').getByRole('img',{name:'Escolher foto de perfil',exact:true})).toBeVisible();
 const nav=page.getByRole('navigation',{name:'Navegação do meu espaço',exact:true});
 await expect(nav.getByRole('link',{name:'Meu perfil',exact:true})).toHaveAttribute('aria-current','page');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`../../work/screenshots/${info.project.name}-perfil-navegacao-foto.png`,fullPage:true});
 await nav.getByRole('link',{name:'Produtos',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Meus produtos',exact:true})).toBeVisible();
 await page.getByText('Adicionar do catálogo',{exact:true}).click();await page.getByRole('button',{name:'Adicionar Bolsa Oliva à loja',exact:true}).click();await saved(page);
 await nav.getByRole('link',{name:'Posts',exact:true}).click();await expect(page.getByRole('heading',{name:'Meus posts',exact:true})).toBeVisible();
 await nav.getByRole('link',{name:'Coleções',exact:true}).click();await expect(page.getByRole('button',{name:'Adicionar seção / coleção',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Publicar loja',exact:true}).click();await page.getByRole('button',{name:'Confirmar publicação',exact:true}).click();
 await expect(page.getByText('Loja publicada e confirmada. Abra Ver minha loja para conferir.',{exact:true})).toBeVisible();
 expect(state.row?.published_document?.avatar_path).toBe(state.photos.creator);expect(state.photoWrites).toBe(1);
});
