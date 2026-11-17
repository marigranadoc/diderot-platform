'use client';
import {displayCopy} from '../lib/presentation';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {getBrowserClient} from '../lib/supabase-browser';
import {blankGeneral,briefingForm,serializeBriefing,serializeGeneral,steps,type GeneralBriefing,type SlotBriefing} from '../lib/campaign-briefing';
import {GeneralBriefingFields,SlotBriefingFields,CampaignReview} from './CampaignBriefingFields';

type Kind='ugc'|'influencer'|'hybrid';
type Organization={id:string;name:string;owner_user_id:string;role:'owner'|'member'};
type Slot={modality:Kind;quantity:number;budget_per_creator_cents:number|null;briefing?:SlotBriefing};
type Draft={id:string;organization_id:string;title:string;campaign_type:Kind;description:string;objective:string;category:string;starts_on:string|null;ends_on:string|null;application_deadline:string|null;revision:number;status:'draft';briefing?:GeneralBriefing;campaign_draft_slots:Slot[]};
type Form={title:string;campaign_type:Kind;description:string;objective:string;category:string;starts_on:string;ends_on:string;application_deadline:string;briefing:GeneralBriefing;slots:{modality:Kind;quantity:string;budget:string;briefing:SlotBriefing}[]};
const labels:Record<Kind,string>={ugc:'UGC',influencer:'Influencer',hybrid:'Híbrida'};
const kinds:Kind[]=['ugc','influencer','hybrid'];
const columns='id,organization_id,title,campaign_type,description,objective,category,starts_on,ends_on,application_deadline,revision,status,briefing,campaign_draft_slots(modality,quantity,budget_per_creator_cents,briefing)';
const blank=():Form=>({title:'',campaign_type:'ugc',description:'',objective:'',category:'',starts_on:'',ends_on:'',application_deadline:'',briefing:blankGeneral(),slots:[]});
const toForm=(draft:Draft):Form=>({title:displayCopy(draft.title),campaign_type:draft.campaign_type,description:displayCopy(draft.description),objective:displayCopy(draft.objective),category:draft.category,briefing:{...blankGeneral(),...draft.briefing},starts_on:draft.starts_on??'',ends_on:draft.ends_on??'',application_deadline:draft.application_deadline??'',slots:draft.campaign_draft_slots.map(slot=>({modality:slot.modality,quantity:String(slot.quantity),budget:slot.budget_per_creator_cents===null?'':(slot.budget_per_creator_cents/100).toFixed(2).replace('.',','),briefing:briefingForm(slot.briefing)}))});

export default function CampaignDrafts({userId,organizations,onDirtyChange}:{userId:string;organizations:Organization[];onDirtyChange:(dirty:boolean)=>void}){
 const [organizationId,setOrganizationId]=useState(organizations[0]?.id??'');
 const [rows,setRows]=useState<Draft[]|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [refresh,setRefresh]=useState(0),[editing,setEditing]=useState<{id:string;revision:number}|null>(null),[form,setForm]=useState<Form>(blank);
 const [dirty,setDirty]=useState(false),[saving,setSaving]=useState(false),[discard,setDiscard]=useState(false);
 const [step,setStep]=useState(0);const stepHeading=useRef<HTMLHeadingElement>(null);
 const generation=useRef(0),writing=useRef(false),request=useRef<{payload:string;id:string}|null>(null);
 const org=organizations.find(item=>item.id===organizationId),canEdit=org?.owner_user_id===userId&&org.role==='owner';
 useEffect(()=>{onDirtyChange(dirty||saving);},[dirty,saving,onDirtyChange]);
 useEffect(()=>{
  const beforeUnload=(event:BeforeUnloadEvent)=>{if(dirty||writing.current)event.preventDefault();};
  window.addEventListener('beforeunload',beforeUnload);return()=>window.removeEventListener('beforeunload',beforeUnload);
 },[dirty]);
 useEffect(()=>{
  const token=++generation.current,db=getBrowserClient();setRows(null);setError('');setLoading(true);
  if(!organizationId){setLoading(false);return;}
  async function load(){try{
   if(!db)throw Error();
   const [access,result]=await Promise.all([
    db.from('organizations').select('id').eq('id',organizationId).maybeSingle(),
    db.from('campaign_drafts').select(columns).eq('organization_id',organizationId).order('updated_at',{ascending:false}),
   ]);
   if(generation.current!==token)return;
   if(access.error||!access.data||result.error||!result.data)throw Error();
   setRows(result.data as Draft[]);
  }catch{if(generation.current===token)setError('Não foi possível carregar os rascunhos ou confirmar seu acesso. Atualize as organizações para conferir seus vínculos.');}
  finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;};
 },[organizationId,refresh]);
 function change(patch:Partial<Form>){setForm(current=>({...current,...patch}));setDirty(true);setNotice('');}
 function open(draft?:Draft){setEditing({id:draft?.id??crypto.randomUUID(),revision:draft?.revision??0});setForm(draft?toForm(draft):blank());setStep(0);setDirty(false);setDiscard(false);setNotice('');setError('');request.current=null;}
 function navigate(next:number){setStep(next);requestAnimationFrame(()=>stepHeading.current?.focus());}
 function close(){setEditing(null);setDirty(false);setDiscard(false);setError('');request.current=null;}
 async function save(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(!editing||!canEdit||saving||writing.current)return;
  setError('');setNotice('');
  if(form.starts_on&&form.ends_on&&form.starts_on>form.ends_on){setError('O término deve ser igual ou posterior ao início.');return;}
  if(form.application_deadline&&form.ends_on&&form.application_deadline>form.ends_on){setError('O prazo de candidatura deve ser igual ou anterior ao término.');return;}
  const slots:Slot[]=[];
  for(const slot of form.slots){
   if(!/^\d+$/.test(slot.quantity)||Number(slot.quantity)<1||Number(slot.quantity)>1000){setError('Informe de 1 a 1.000 vagas por modalidade.');return;}
   const normalized=slot.budget.trim().replace(',','.');
   if(normalized&&(!/^\d+(\.\d{1,2})?$/.test(normalized)||Number(normalized)<=0||Number(normalized)>1000000)){setError('Informe um orçamento estimado válido, com até duas casas decimais e limite de R$ 1.000.000 por creator.');return;}
   try{slots.push({modality:slot.modality,quantity:Number(slot.quantity),budget_per_creator_cents:normalized?Math.round(Number(normalized)*100):null,briefing:serializeBriefing(slot.briefing,slot.modality)});}catch(error){setError(error instanceof Error?error.message:'Confira as condições da vaga.');return;}
  }
  let general:GeneralBriefing;try{general=serializeGeneral(form.briefing);}catch(error){setError(error instanceof Error?error.message:'Confira as referências.');return;}
  const document={...form,briefing:general,title:form.title.trim(),description:form.description.trim(),objective:form.objective.trim(),category:form.category.trim(),starts_on:form.starts_on||null,ends_on:form.ends_on||null,application_deadline:form.application_deadline||null,slots};
  if(document.title.length<2){setError('Informe um título com pelo menos 2 caracteres.');return;}
  const serialized=JSON.stringify(document);
  if(request.current?.payload!==serialized)request.current={payload:serialized,id:crypto.randomUUID()};
  const token=generation.current;writing.current=true;setSaving(true);
  try{
   const db=getBrowserClient();if(!db)throw Error();
   const auth=await db.auth.getUser();if(generation.current!==token)return;
   if(auth.error||auth.data.user?.id!==userId)throw Error();
   const result=await db.rpc('save_campaign_draft',{p_organization:organizationId,p_id:editing.id,p_revision:editing.revision,p_request:request.current!.id,p_document:document});
   if(generation.current!==token)return;
   if(result.error){if(result.error.code==='40001'){setError('Este rascunho foi alterado em outra sessão. Cancele a edição, atualize os rascunhos e abra a versão salva. Seus campos continuam aqui para consulta.');return;}if(result.error.code==='22023'){setError('O banco rejeitou algum campo do briefing. Confira as etapas; seus dados continuam no formulário.');return;}throw result.error;}
   if(result.data?.id!==editing.id||result.data?.status!=='draft'||!Number.isInteger(result.data?.revision))throw Error();
   const confirmed=await db.from('campaign_drafts').select(columns).eq('organization_id',organizationId).eq('id',editing.id).single();
   if(generation.current!==token)return;
   if(confirmed.error||!confirmed.data||confirmed.data.revision!==result.data.revision)throw Error();
   const row=confirmed.data as Draft;setRows(current=>[row,...(current??[]).filter(item=>item.id!==row.id)]);
   setEditing({id:row.id,revision:row.revision});setForm(toForm(row));setDirty(false);request.current=null;
   setNotice('Rascunho salvo e relido do banco. Continua privado, sem publicação.');
  }catch{if(generation.current===token)setError('Não foi possível confirmar o salvamento. Seus campos foram preservados. Tente salvar novamente; a mesma tentativa não duplica o rascunho.');}
  finally{writing.current=false;if(generation.current===token)setSaving(false);}
 }
 return <section className="campaign-workspace" aria-label="Campanhas em rascunho"><h2>Campanhas em rascunho</h2><p>Planeje uma campanha privada. Salvar não publica, contrata creators ou gera cobrança. Os valores são estimativas em reais.</p>
 {organizations.length===0?<p>Cadastre uma organização para planejar sua primeira campanha.</p>:<>
 <label>Organização da campanha<select value={organizationId} disabled={!!editing||saving} onChange={event=>{setOrganizationId(event.target.value);setNotice('');}}>{organizations.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
 {!canEdit&&<p>Você é membro desta organização e tem acesso somente de leitura.</p>}
 <div className="campaign-actions"><button disabled={!!editing||saving||loading} onClick={()=>{setNotice('');setRefresh(value=>value+1);}}>Atualizar rascunhos</button>{canEdit&&<button className="dark-button" disabled={!!editing||loading||!rows} onClick={()=>open()}>Novo rascunho</button>}</div>
 {loading?<p role="status">Carregando rascunhos…</p>:rows&&<div className="campaign-list">{rows.length===0?<p>Nenhum rascunho nesta organização.</p>:rows.map(row=><article className="service-card" key={row.id}><span className="eyebrow">RASCUNHO PRIVADO · {labels[row.campaign_type]} · VERSÃO {row.revision}</span><h3>{displayCopy(row.title)}</h3><p>{row.campaign_draft_slots.reduce((total,slot)=>total+slot.quantity,0)} vagas planejadas · {row.campaign_draft_slots.length} modalidades</p><button disabled={!!editing||saving} onClick={()=>open(row)}>{canEdit?'Abrir rascunho':'Consultar rascunho'}</button></article>)}</div>}
 {editing&&<form className="account-card campaign-form" onSubmit={save}><h3>{canEdit?(editing.revision?'Editar rascunho':'Novo rascunho'):'Consultar rascunho'}</h3><p>{dirty?'Alterações ainda não salvas.':'Use Salvar rascunho para confirmar alterações.'} Cancele ou feche a edição antes de abrir outro registro.</p>
 <nav aria-label="Etapas do briefing"><ol className="campaign-steps">{steps.map((label,index)=><li key={label}><button type="button" aria-label={`Etapa ${index+1}: ${label}`} aria-current={index===step?'step':undefined} disabled={saving} onClick={()=>navigate(index)}>{index+1}. {label}</button></li>)}</ol></nav>
 <h4 ref={stepHeading} tabIndex={-1}>Etapa {step+1} de 7: {steps[step]}</h4>
 {step===0&&<fieldset disabled={!canEdit||saving}><legend>Informações gerais</legend>
 <label>Título da campanha<input required minLength={2} maxLength={120} value={form.title} onChange={event=>change({title:event.target.value})}/></label>
 <label>Descrição<textarea maxLength={5000} value={form.description} onChange={event=>change({description:event.target.value})}/></label>
 <label>Objetivo<input maxLength={500} value={form.objective} onChange={event=>change({objective:event.target.value})}/></label>
 <label>Categoria<input maxLength={100} value={form.category} onChange={event=>change({category:event.target.value})}/></label>
 <div className="campaign-dates"><label>Início (opcional)<input type="date" value={form.starts_on} onChange={event=>change({starts_on:event.target.value})}/></label><label>Término (opcional)<input type="date" value={form.ends_on} onChange={event=>change({ends_on:event.target.value})}/></label><label>Prazo de candidatura (opcional)<input type="date" value={form.application_deadline} onChange={event=>change({application_deadline:event.target.value})}/></label></div>
 <GeneralBriefingFields value={form.briefing} onChange={briefing=>change({briefing})}/>
 </fieldset>}
 {step===1&&<fieldset disabled={!canEdit||saving}><legend>Vagas e estimativas</legend><label>Tipo de campanha<select value={form.campaign_type} onChange={event=>{const kind=event.target.value as Kind;change({campaign_type:kind,slots:form.slots.filter(slot=>kind==='hybrid'||slot.modality===kind)});}}>{kinds.map(kind=><option key={kind} value={kind}>{labels[kind]}</option>)}</select></label><p>Ao trocar o tipo, modalidades incompatíveis e suas condições são retiradas do formulário. Nada muda no banco até salvar.</p><p>Você pode salvar sem vagas e completar depois. Cada modalidade tem um grupo nesta etapa. UGC não exige seguidores.</p>
 {kinds.filter(kind=>form.campaign_type==='hybrid'||kind===form.campaign_type).map(kind=>{const slot=form.slots.find(item=>item.modality===kind);return <div className="campaign-slot" key={kind}><label className="campaign-check"><input type="checkbox" checked={!!slot} onChange={event=>change({slots:event.target.checked?[...form.slots,{modality:kind,quantity:'1',budget:'',briefing:briefingForm()}]:form.slots.filter(item=>item.modality!==kind)})}/>Planejar vagas {labels[kind]}</label>{slot&&<div className="campaign-dates"><label>Quantidade {labels[kind]}<input type="number" min={1} max={1000} step={1} required value={slot.quantity} onChange={event=>change({slots:form.slots.map(item=>item.modality===kind?{...item,quantity:event.target.value}:item)})}/></label><label>Estimativa por creator {labels[kind]} (R$, opcional)<input inputMode="decimal" placeholder="Ex.: 150,00" value={slot.budget} onChange={event=>change({slots:form.slots.map(item=>item.modality===kind?{...item,budget:event.target.value}:item)})}/></label></div>}</div>;})}
 </fieldset>}
 {step>=2&&step<=5&&<fieldset disabled={!canEdit||saving}><legend>{steps[step]}</legend><SlotBriefingFields step={step} slots={form.slots} onChange={slots=>change({slots})}/></fieldset>}
 {step===6&&<CampaignReview title={form.title} general={form.briefing} slots={form.slots} context={form}/>}
 <div className="campaign-actions">{step>0&&<button type="button" disabled={saving} onClick={()=>navigate(step-1)}>Etapa anterior</button>}{step<6&&<button type="button" disabled={saving} onClick={()=>navigate(step+1)}>Próxima etapa</button>}</div>
 <div className="campaign-actions">{canEdit&&<button className="dark-button" disabled={saving}>{saving?'Salvando…':'Salvar rascunho'}</button>}<button type="button" disabled={saving} onClick={()=>dirty?setDiscard(true):close()}>{canEdit?'Cancelar edição':'Fechar consulta'}</button></div>
 {discard&&<div role="alert"><p>Descartar as alterações que ainda não foram salvas?</p><button type="button" onClick={close}>Descartar alterações</button><button type="button" onClick={()=>setDiscard(false)}>Continuar editando</button></div>}
 </form>}
 </>}{error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}</section>;
}
