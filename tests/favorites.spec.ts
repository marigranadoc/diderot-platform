import {test, expect} from '@playwright/test';
const key = 'diderot:guest-favorites:v1';

test('FAV-01 visitante mantém escolhas em reload, coleções e nova aba', async ({page, context}) => {
  await page.goto('/criador');
  await page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true}).click();
  await page.reload();
  await expect(page.getByRole('button', {name:'Remover Bolsa Oliva', exact:true})).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.collection-nav').getByRole('link', {name:'Essenciais'}).click();
  await expect(page.getByRole('button', {name:'Remover Bolsa Oliva', exact:true})).toBeVisible();
  const origin = new URL(page.url()).origin;
  await page.close();
  const next = await context.newPage();
  await next.goto(`${origin}/criador`);
  await expect(next.getByRole('button', {name:'Remover Bolsa Oliva', exact:true})).toBeVisible();
  await next.getByRole('button', {name:'Remover Bolsa Oliva', exact:true}).click();
  await next.reload();
  await expect(next.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true})).toBeVisible();
});

test('FAV-02 abas acompanham inclusão, remoção e limpeza do armazenamento', async ({page, context}) => {
  await page.goto('/criador');
  const second = await context.newPage();await second.goto(page.url());
  await page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true}).click();
  await expect(second.getByRole('button', {name:'Remover Bolsa Oliva', exact:true})).toBeVisible();
  await second.getByRole('button', {name:'Salvar Creme essencial', exact:true}).click();
  await expect(page.getByText('2 favoritos neste navegador', {exact:true})).toBeVisible();
  await page.getByRole('button', {name:'Remover Bolsa Oliva', exact:true}).click();
  await expect(second.getByText('1 favorito neste navegador', {exact:true})).toBeVisible();
  await expect(second.getByRole('button', {name:'Remover Creme essencial', exact:true})).toBeVisible();
  await second.evaluate(() => localStorage.clear());
  await expect(page.getByText('0 favoritos neste navegador', {exact:true})).toBeVisible();
  await expect(page.getByRole('button', {name:'Salvar Creme essencial', exact:true})).toBeVisible();
});

test('FAV-03 falha de escrita não confirma inclusão nem remoção', async ({page}) => {
  await page.addInitScript(storageKey => {
    const original = Storage.prototype.setItem;
    Object.defineProperty(Storage.prototype, 'setItem', {value:function(k:string,v:string) {
      if (k === storageKey && sessionStorage.getItem('test:fail-guest-write') === 'yes') throw new DOMException('Test quota', 'QuotaExceededError');
      return original.call(this,k,v);
    }});
  }, key);
  await page.goto('/criador');
  await page.evaluate(()=>sessionStorage.setItem('test:fail-guest-write','yes'));
  await page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível salvar a alteração');
  await expect(page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true})).toHaveAttribute('aria-pressed','false');
  await expect(page.getByText('0 favoritos neste navegador', {exact:true})).toBeVisible();
  // Seed a confirmed selection, then make only its removal fail.
  await page.evaluate(storageKey => {
    sessionStorage.removeItem('test:fail-guest-write');
    localStorage.setItem(storageKey, JSON.stringify({version:1,slugs:['bolsa-oliva']}));
    sessionStorage.setItem('test:fail-guest-write','yes');
  }, key);
  await page.reload();
  await page.getByRole('button', {name:'Remover Bolsa Oliva', exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível salvar a alteração');
  await expect(page.getByRole('button', {name:'Remover Bolsa Oliva', exact:true})).toHaveAttribute('aria-pressed','true');
});

test('FAV-04 armazenamento ilegível apresenta erro sem quebrar catálogo', async ({page}) => {
  await page.addInitScript(storageKey => {
    const original = Storage.prototype.getItem;
    Object.defineProperty(Storage.prototype, 'getItem', {value:function(k:string) {
      if (k === storageKey) throw new DOMException('Test denied', 'SecurityError');
      return original.call(this,k);
    }});
  }, key);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/criador');await expect(page.locator('.product-card')).toHaveCount(8);
  await expect(page.getByRole('main').getByRole('alert')).toContainText('não permite acessar');
  await page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível salvar');
  await expect(page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true})).toHaveAttribute('aria-pressed','false');
  expect(errors).toEqual([]);
});

test('FAV-05 dados inválidos são identificados e recuperados por ação explícita', async ({page}) => {
  await page.goto('/criador');
  for (const raw of ['{broken', JSON.stringify({version:2,slugs:['bolsa-oliva']}), JSON.stringify({version:1,slugs:[null,'<script>']})]) {
    await page.evaluate(({key,raw})=>localStorage.setItem(key,raw), {key,raw});await page.reload();
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível recuperar');
    await expect(page.getByText('0 favoritos neste navegador', {exact:true})).toBeVisible();
    await page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true}).click();
    await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
    await page.reload();await expect(page.getByRole('button', {name:'Remover Bolsa Oliva', exact:true})).toBeVisible();
  }
  await page.evaluate(storageKey=>localStorage.setItem(storageKey,JSON.stringify({version:1,slugs:['bolsa-oliva','bolsa-oliva']})),key);
  await page.reload();await expect(page.getByText('1 favorito neste navegador',{exact:true})).toBeVisible();
});

test('FAV-06 outro navegador não recebe a seleção local', async ({page, browser}) => {
  await page.goto('/criador');await page.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true}).click();
  const separate = await browser.newContext();
  try {
    const other = await separate.newPage();await other.goto(page.url());
    await expect(other.getByRole('button', {name:'Salvar Bolsa Oliva', exact:true})).toHaveAttribute('aria-pressed','false');
    await expect(other.getByText('0 favoritos neste navegador',{exact:true})).toBeVisible();
  } finally {await separate.close();}
});
