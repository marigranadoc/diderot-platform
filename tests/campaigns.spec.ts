import {test,expect,type Page} from '@playwright/test';
const owner='11111111-1111-4111-8111-111111111111',org='22222222-2222-4222-8222-222222222222';
const organization={id:org,owner_user_id:owner,name:'Marca campanhas',website:'',description:'',created_at:'2026-11-12T00:00:00Z'};
type Document={title:string;campaign_type:string;description:string;objective:string;category:string;starts_on:string|null;ends_on:string|null;application_deadline:string|null;slots:{modality:string;quantity:number;budget_per_creator_cents:number|null}[]};
type Row=Omit<Document,'slots'>&{id:string;organization_id:string;status:string;revision:number;campaign_draft_slots:Document['slots']};
type Request={p_id:string;p_organization:string;p_revision:number;p_request:string;p_document:Document};
async function setup(page:Page,mode:'owner'|'member'|'none'='owner'){
 const id=mode==='member'?'33333333-3333-4333-8333-333333333333':owner;
 const user={id,aud:'authenticated',role:'authenticated',email:'draft@example.invalid',app_metadata:{},user_metadata:{role:'admin'},created_at:new Date().toISOString()};
 const exp=Math.floor(Date.now()/1000)+3600,access_token=[{alg:'HS256',typ:'JWT'},{sub:id,role:'authenticated',aud:'authenticated',exp},'test-only'].map(value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value)).toString('base64url')).join('.');
 await page.addInitScript(value=>localStorage.setItem('sb-mbxpwrgfujnjonyxzvfw-auth-token',JSON.stringify(value)),{access_token,refresh_token:'test-only',expires_in:3600,expires_at:exp,token_type:'bearer',user});
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.route('**/rest/v1/organizations**',route=>route.fulfill({json:route.request().url().includes('id=eq.')?(mode==='none'?null:{id:org}):mode==='none'?[]:[organization]}));
 await page.route('**/rest/v1/organization_members**',route=>route.fulfill({json:mode==='none'?[]:[{organization_id:org,role:mode}]}));
 const state={rows:[] as Row[],requests:[] as Request[],failRead:false,failSave:false,loseResponse:false,conflict:false};
 const receipts=new Map<string,Row>();
 await page.route('**/rest/v1/campaign_drafts**',route=>{
  if(state.failRead)return route.fulfill({status:503,json:{message:'test outage'}});
  const match=new URL(route.request().url()).searchParams.get('id');
  return route.fulfill({json:match?state.rows.find(row=>row.id===match.slice(3))??null:state.rows});
 });
 await page.route('**/rest/v1/rpc/save_campaign_draft',route=>{
  const input=route.request().postDataJSON() as Request;state.requests.push(input);
  if(state.failSave)return route.fulfill({status:503,json:{message:'test outage'}});
  if(state.conflict)return route.fulfill({status:409,json:{code:'40001',message:'stale revision'}});
  let row=receipts.get(input.p_request);
  if(!row){const {slots,...fields}=input.p_document;row={...fields,id:input.p_id,organization_id:input.p_organization,status:'draft',revision:input.p_revision+1,campaign_draft_slots:slots};state.rows=[row,...state.rows.filter(item=>item.id!==row!.id)];receipts.set(input.p_request,row);}
  if(state.loseResponse){state.loseResponse=false;return route.fulfill({status:503,json:{message:'response lost after commit'}});}
  return route.fulfill({json:{id:row.id,revision:row.revision,status:'draft'}});
 });
 await page.goto('/painel/marca');await page.getByRole('button',{name:'Campanhas em rascunho',exact:true}).click();
 return state;
}
async function create(page:Page){await page.getByRole('button',{name:'Novo rascunho',exact:true}).click();await page.getByLabel('Título da campanha',{exact:true}).fill('Lançamento demonstrativo');}

test('CAMP-01 contrato: salvar híbrida, reler após reload, editar e descartar',async({page},info)=>{
 const state=await setup(page);await create(page);
 await page.getByRole('combobox',{name:'Tipo de campanha',exact:true}).selectOption('hybrid');
 await page.getByLabel('Planejar vagas UGC',{exact:true}).check();await page.getByLabel('Quantidade UGC',{exact:true}).fill('2');await page.getByLabel('Estimativa por creator UGC (R$, opcional)',{exact:true}).fill('150,50');
 await page.getByLabel('Planejar vagas Influencer',{exact:true}).check();
 await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('salvo e relido do banco');expect(state.requests[0].p_document.slots).toEqual([{modality:'ugc',quantity:2,budget_per_creator_cents:15050},{modality:'influencer',quantity:1,budget_per_creator_cents:null}]);
 expect(state.requests[0].p_document).not.toHaveProperty('status');
 await page.reload();await page.getByRole('button',{name:'Campanhas em rascunho',exact:true}).click();await page.getByRole('button',{name:'Abrir rascunho',exact:true}).click();
 await expect(page.getByLabel('Título da campanha',{exact:true})).toHaveValue('Lançamento demonstrativo');await expect(page.getByLabel('Quantidade UGC',{exact:true})).toHaveValue('2');
 await page.getByLabel('Título da campanha',{exact:true}).fill('Lançamento editado');await expect(page.getByRole('button',{name:'Atualizar organizações',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('status')).toContainText('salvo e relido');expect(state.rows[0].revision).toBe(2);
 await page.getByLabel('Título da campanha',{exact:true}).fill('Não salvar');await page.getByRole('button',{name:'Cancelar edição',exact:true}).click();await expect(page.getByText('Descartar as alterações que ainda não foram salvas?',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Descartar alterações',exact:true}).click();expect(state.rows[0].title).toBe('Lançamento editado');
 await page.getByRole('button',{name:'Abrir rascunho',exact:true}).click();await expect(page.getByLabel('Título da campanha',{exact:true})).toHaveValue('Lançamento editado');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`../../work/screenshots/${info.project.name}-campanhas.png`,fullPage:true});
});

test('CAMP-02 contrato: datas e estimativas inválidas bloqueiam gravação, UGC sem seguidores',async({page})=>{
 const state=await setup(page);await create(page);
 await page.getByLabel('Início (opcional)',{exact:true}).fill('2027-02-10');await page.getByLabel('Término (opcional)',{exact:true}).fill('2027-02-01');await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('término deve');expect(state.requests).toHaveLength(0);
 await page.getByLabel('Término (opcional)',{exact:true}).fill('2027-02-20');await page.getByLabel('Planejar vagas UGC',{exact:true}).check();await page.getByLabel('Estimativa por creator UGC (R$, opcional)',{exact:true}).fill('1,234');await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('duas casas decimais');expect(state.requests).toHaveLength(0);
 await page.getByLabel('Estimativa por creator UGC (R$, opcional)',{exact:true}).fill('');await expect(page.getByLabel(/mínimo de seguidores/i)).toHaveCount(0);await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('status')).toContainText('salvo e relido');expect(state.requests[0].p_document.slots[0].budget_per_creator_cents).toBeNull();
});

test('CAMP-03 contrato: resposta perdida preserva campos e usa a mesma tentativa sem duplicar',async({page})=>{
 const state=await setup(page);await create(page);state.loseResponse=true;await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');await expect(page.getByRole('status')).toHaveCount(0);await expect(page.getByLabel('Título da campanha',{exact:true})).toHaveValue('Lançamento demonstrativo');
 await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('status')).toContainText('salvo e relido');expect(state.requests).toHaveLength(2);expect(state.requests[0].p_request).toBe(state.requests[1].p_request);expect(state.requests[0].p_id).toBe(state.requests[1].p_id);expect(state.rows).toHaveLength(1);
});

test('CAMP-04 contrato: conflito e erro de releitura não anunciam sucesso',async({page})=>{
 const state=await setup(page);await create(page);state.conflict=true;await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('outra sessão');await expect(page.getByLabel('Título da campanha',{exact:true})).toHaveValue('Lançamento demonstrativo');
 state.conflict=false;state.failRead=true;await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível confirmar');await expect(page.getByRole('status')).toHaveCount(0);
 state.failRead=false;await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByRole('status')).toContainText('salvo e relido');expect(state.rows).toHaveLength(1);
});

test('CAMP-05 contrato: membro consulta sem editar, metadata não promove papel',async({page})=>{
 const state=await setup(page,'member');state.rows=[{id:'44444444-4444-4444-8444-444444444444',organization_id:org,title:'Rascunho privado',campaign_type:'ugc',description:'Briefing de teste',objective:'',category:'',starts_on:null,ends_on:null,application_deadline:null,status:'draft',revision:1,campaign_draft_slots:[]}];
 await page.getByRole('button',{name:'Atualizar rascunhos',exact:true}).click();await expect(page.getByRole('button',{name:'Novo rascunho',exact:true})).toHaveCount(0);await page.getByRole('button',{name:'Consultar rascunho',exact:true}).click();await expect(page.getByLabel('Título da campanha',{exact:true})).toBeDisabled();await expect(page.getByRole('button',{name:'Salvar rascunho',exact:true})).toHaveCount(0);expect(state.requests).toHaveLength(0);
});

test('CAMP-06 contrato: falha de listagem não aparece como organização sem rascunhos',async({page})=>{
 const state=await setup(page);state.failRead=true;await page.getByRole('button',{name:'Atualizar rascunhos',exact:true}).click();await expect(page.getByRole('main').getByRole('alert')).toContainText('confirmar seu acesso');await expect(page.getByText('Nenhum rascunho nesta organização.',{exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Novo rascunho',exact:true})).toBeDisabled();
 state.failRead=false;await page.getByRole('button',{name:'Atualizar rascunhos',exact:true}).click();await expect(page.getByText('Nenhum rascunho nesta organização.',{exact:true})).toBeVisible();
});

test('CAMP-07 saída em outra aba descarta resposta pendente de campanhas',async({page,context})=>{
 await setup(page);await expect(page.getByText('Nenhum rascunho nesta organização.',{exact:true})).toBeVisible();
 let release:()=>void=()=>{},started:()=>void=()=>{};
 const gate=new Promise<void>(resolve=>{release=resolve;}),requested=new Promise<void>(resolve=>{started=resolve;});
 await page.route('**/rest/v1/campaign_drafts**',async route=>{started();await gate;return route.fulfill({json:[{id:'44444444-4444-4444-8444-444444444444',organization_id:org,title:'Resposta privada atrasada',campaign_type:'ugc',description:'',objective:'',category:'',starts_on:null,ends_on:null,application_deadline:null,status:'draft',revision:1,campaign_draft_slots:[]}]});});
 try{
  await page.getByRole('button',{name:'Atualizar rascunhos',exact:true}).click();await requested;
  const other=await context.newPage();await other.goto('/conta');await other.evaluate(()=>localStorage.removeItem('sb-mbxpwrgfujnjonyxzvfw-auth-token'));
  await expect(page.getByRole('link',{name:'Entrar na minha conta',exact:true})).toBeVisible();release();
  await expect(page.getByRole('region',{name:'Campanhas em rascunho',exact:true})).toHaveCount(0);await expect(page.getByRole('heading',{name:'Resposta privada atrasada',exact:true})).toHaveCount(0);
 }finally{release();}
});

test('CAMP-08 conta sem organização recebe orientação sem liberar criação',async({page})=>{
 const state=await setup(page,'none');await expect(page.getByText('Cadastre uma organização para planejar sua primeira campanha.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Novo rascunho',exact:true})).toHaveCount(0);expect(state.requests).toHaveLength(0);
});
