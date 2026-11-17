'use client';
import {fields,steps,type CampaignKind,type GeneralBriefing,type Section,type SlotBriefing} from '../lib/campaign-briefing';

type Slot={modality:CampaignKind;quantity:string;budget:string;briefing:SlotBriefing};
const labels={ugc:'UGC',influencer:'Influencer',hybrid:'Híbrida'};
const sections:Record<number,Section>={2:'requirements',3:'deliverables',4:'rights',5:'compensation'};

export function GeneralBriefingFields({value,onChange}:{value:GeneralBriefing;onChange:(value:GeneralBriefing)=>void}){
 return <>
  {([['tone','Tom de voz'],['messages','Mensagens principais'],['restrictions','Restrições e cuidados']] as const).map(([key,label])=><label key={key}>{label}<textarea aria-label={label} maxLength={2000} value={value[key]} onChange={event=>onChange({...value,[key]:event.target.value})}/></label>)}
  <label>Referências visuais (um link HTTPS por linha)<textarea aria-label="Referências visuais (um link HTTPS por linha)" value={value.references.join('\n')} onChange={event=>onChange({...value,references:event.target.value.split('\n')})}/></label>
  <p>Links de referência não são importados nem acessados automaticamente. Imagens e arquivos não são enviados nesta etapa.</p>
  <div className="campaign-products"><h5>Produtos de referência</h5><p>Registre nome e link HTTPS. Isso não cadastra produto no catálogo da marca, confirma estoque ou gera envio.</p>
   {value.products.map((item,index)=><div key={index} className="campaign-slot"><label>Nome do produto {index+1}<input maxLength={200} value={item.name} onChange={event=>onChange({...value,products:value.products.map((product,i)=>i===index?{...product,name:event.target.value}:product)})}/></label><label>Link do produto {index+1}<input type="url" value={item.url} onChange={event=>onChange({...value,products:value.products.map((product,i)=>i===index?{...product,url:event.target.value}:product)})}/></label><button type="button" onClick={()=>onChange({...value,products:value.products.filter((_,i)=>i!==index)})}>Remover produto {index+1}</button></div>)}
   <button type="button" disabled={value.products.length>=20} onClick={()=>onChange({...value,products:[...value.products,{name:'',url:''}]})}>Adicionar produto de referência</button>
  </div>
 </>;
}

export function SlotBriefingFields({step,slots,onChange}:{step:number;slots:Slot[];onChange:(slots:Slot[])=>void}){
 const section=sections[step];
 if(!section)return null;
 return <>
  {slots.length===0&&<p>Nenhuma vaga planejada. Adicione uma modalidade na etapa 2 para definir suas condições.</p>}
  {step===4&&<p>São condições planejadas de uso, sem licença concedida. O contrato e o aceite dos participantes ainda não estão disponíveis.</p>}
  {step===5&&<p>Valores em reais, separados da estimativa da etapa 2. Vazio significa não informado; zero é explicitamente sem remuneração nessa categoria. Não há cobrança, saldo ou pagamento.</p>}
  {slots.map((slot,index)=><section key={slot.modality} className="campaign-slot" aria-label={`${steps[step]} ${labels[slot.modality]}`}><h5>{labels[slot.modality]} · {slot.quantity} vagas planejadas</h5>
   {step===2&&slot.modality==='ugc'&&<p>UGC não exige audiência mínima. Publicação nas redes só será exigida se marcada explicitamente nos entregáveis.</p>}
   {fields[section].filter(field=>!(slot.modality==='ugc'&&['min_followers','demographics','metrics'].includes(field.key))).map(field=>{
    const current=slot.briefing[section][field.key];
    const change=(value:string|boolean)=>onChange(slots.map((item,i)=>i===index?{...item,briefing:{...item.briefing,[section]:{...item.briefing[section],[field.key]:value}}}:item));
    const label=`${field.label} — ${labels[slot.modality]}`;
    return <label key={field.key} className={field.type==='checkbox'?'campaign-check':undefined}>{field.type==='checkbox'?<><input type="checkbox" checked={current===true} onChange={event=>change(event.target.checked)}/>{label}</>:<>{label}{field.type==='textarea'?<textarea aria-label={label} maxLength={2000} value={String(current??'')} onChange={event=>change(event.target.value)}/>:<input type={field.type==='number'?'number':field.type==='date'?'date':'text'} min={field.min} max={field.max} step={field.type==='number'?1:undefined} inputMode={field.type==='money'||field.type==='percent'?'decimal':undefined} maxLength={field.type==='text'?2000:undefined} value={String(current??'')} onChange={event=>change(event.target.value)}/>}</>}</label>;
   })}
  </section>)}
 </>;
}

export function CampaignReview({title,general,slots,context}:{title:string;general:GeneralBriefing;slots:Slot[];context:{description:string;objective:string;category:string;starts_on:string;ends_on:string;application_deadline:string;campaign_type:CampaignKind}}){
 return <div className="campaign-review">
  <h5>{title||'Campanha sem título'}</h5><p>Revise os dados em cada etapa antes de salvar. Salvar confirma somente um rascunho privado.</p>
  <dl>{([['Modalidade',labels[context.campaign_type]],['Descrição',context.description],['Objetivo',context.objective],['Categoria',context.category],['Início',context.starts_on],['Término',context.ends_on],['Prazo de candidatura',context.application_deadline]]).map(([label,value])=><div className="campaign-review-row" key={label}><dt>{label}</dt><dd>{value||'Não informado'}</dd></div>)}</dl>
  <dl><dt>Tom de voz</dt><dd>{general.tone||'Não informado'}</dd><dt>Mensagens</dt><dd>{general.messages||'Não informado'}</dd><dt>Restrições</dt><dd>{general.restrictions||'Não informado'}</dd></dl>
  <h5>Produtos e referências</h5>{general.products.length?<ul>{general.products.map((item,index)=><li key={index}>{item.name||'Sem nome'} · {item.url||'Sem link'}</li>)}</ul>:<p>Nenhum produto de referência.</p>}
  {general.references.filter(Boolean).length?<ul>{general.references.filter(Boolean).map((url,index)=><li key={index}>{url}</li>)}</ul>:<p>Nenhuma referência visual.</p>}
  {slots.length===0&&<p>Nenhuma vaga planejada.</p>}
  {slots.map(slot=><section className="campaign-slot" key={slot.modality}><h5>{labels[slot.modality]} · {slot.quantity} vagas</h5><p>Estimativa por creator: {slot.budget?`R$ ${slot.budget}`:'Não informada'}.</p>
   {(Object.keys(fields) as Section[]).map(section=><div key={section}><h6>{steps[Object.keys(sections).map(Number).find(key=>sections[key]===section)!]}</h6><dl>{fields[section].filter(field=>!(slot.modality==='ugc'&&['min_followers','demographics','metrics'].includes(field.key))).map(field=>{const value=slot.briefing[section][field.key];return <div className="campaign-review-row" key={field.key}><dt>{field.label}</dt><dd>{field.type==='checkbox'?(value===true?'Previsto':'Não previsto'):value===null||value===''||value===undefined?'Não informado':String(value)}</dd></div>;})}</dl></div>)}
  </section>)}
  <p className="demo-notice">Publicação ainda não disponível. Catálogo vinculado, revisão de elegibilidade, validação completa para publicação e transições serão concluídos em etapas próprias. Nenhum creator pode se candidatar a este rascunho.</p>
 </div>;
}
