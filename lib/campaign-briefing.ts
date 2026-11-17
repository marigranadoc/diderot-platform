export type CampaignKind = 'ugc' | 'influencer' | 'hybrid';
export type Section = 'requirements' | 'deliverables' | 'rights' | 'compensation';
export type Field = {key:string;label:string;type:'text'|'textarea'|'number'|'money'|'percent'|'date'|'checkbox';min?:number;max?:number};
export type Values = Record<string,string|number|boolean|null>;
export type SlotBriefing = Record<Section,Values>;
export type GeneralBriefing = {tone:string;messages:string;restrictions:string;references:string[];products:{name:string;url:string}[]};
export const steps=['Informações gerais','Modalidades/vagas','Requisitos','Entregáveis','Direitos de uso','Remuneração','Revisão/publicação'];
export const fields:Record<Section,Field[]>={
 requirements:[
  {key:'niches',label:'Nichos',type:'text'}, {key:'languages',label:'Idiomas',type:'text'},
  {key:'location',label:'Localização',type:'text'}, {key:'experience',label:'Experiência desejável',type:'textarea'},
  {key:'portfolio',label:'Portfólio esperado',type:'textarea'}, {key:'style',label:'Estilo de conteúdo',type:'text'},
  {key:'skills',label:'Habilidades',type:'text'}, {key:'channels',label:'Redes e canais de referência',type:'text'},
  {key:'min_followers',label:'Mínimo de seguidores (opcional)',type:'number',min:0,max:2000000000},
  {key:'demographics',label:'Demografia da audiência',type:'textarea'}, {key:'metrics',label:'Métricas de audiência esperadas',type:'textarea'},
 ],
 deliverables:[
  {key:'videos',label:'Quantidade de vídeos',type:'number',min:0,max:100},
  {key:'photos',label:'Quantidade de fotos',type:'number',min:0,max:100},
  {key:'format',label:'Formato dos arquivos',type:'text'}, {key:'resolution',label:'Resolução',type:'text'},
  {key:'duration_seconds',label:'Duração por vídeo (segundos)',type:'number',min:1,max:86400},
  {key:'capture',label:'Orientações de captação',type:'textarea'}, {key:'script',label:'Roteiro e mensagens',type:'textarea'},
  {key:'deadline',label:'Prazo de entrega (opcional)',type:'date'},
  {key:'revision_rounds',label:'Rodadas de revisão',type:'number',min:0,max:20},
  {key:'raw_files',label:'Solicitar arquivos brutos',type:'checkbox'},
  {key:'posting_required',label:'Exigir publicação nas redes do creator',type:'checkbox'},
  {key:'posting_proof',label:'Comprovação de postagem, quando aplicável',type:'text'},
 ],
 rights:[
  {key:'organic',label:'Planejar uso orgânico',type:'checkbox'}, {key:'paid',label:'Planejar uso em mídia paga',type:'checkbox'},
  {key:'channels',label:'Canais de uso',type:'text'}, {key:'duration_months',label:'Prazo de uso (meses)',type:'number',min:1,max:120},
  {key:'territory',label:'Território de uso',type:'text'}, {key:'image_voice',label:'Planejar uso de imagem e voz',type:'checkbox'},
  {key:'exclusivity',label:'Condições de exclusividade',type:'textarea'}, {key:'renewal',label:'Condições de renovação',type:'textarea'},
 ],
 compensation:[
  {key:'production_fee_cents',label:'Remuneração por produção (R$)',type:'money',min:0,max:1000000},
  {key:'publication_fee_cents',label:'Remuneração por publicação (R$)',type:'money',min:0,max:1000000},
  {key:'commission_basis_points',label:'Comissão por venda (%)',type:'percent',min:0,max:100},
  {key:'commission_terms',label:'Regras e vigência da comissão',type:'textarea'},
  {key:'bonus_terms',label:'Condições de bônus',type:'textarea'}, {key:'product_benefit',label:'Produto ou gifting previsto',type:'textarea'},
  {key:'payment_terms',label:'Condições e prazo de pagamento',type:'textarea'},
 ],
};
export const blankGeneral=():GeneralBriefing=>({tone:'',messages:'',restrictions:'',references:[],products:[]});
export function briefingForm(value?:Partial<SlotBriefing>):SlotBriefing {
 return Object.fromEntries(Object.entries(fields).map(([section,list])=>[section,Object.fromEntries(list.map(field=>{
  const current=value?.[section as Section]?.[field.key];
  return [field.key,field.type==='checkbox'?current===true:current===null||current===undefined?'':field.type==='money'||field.type==='percent'?(Number(current)/100).toFixed(2).replace('.',','):String(current)];
 }))])) as SlotBriefing;
}
function validDate(value:string){return /^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
export function validReferenceUrl(value:string) {
 try {const url=new URL(value);return value.length<=2000&&url.protocol==='https:'&&!url.username&&!url.password&&!/\s/.test(value);}catch{return false;}
}
export function serializeBriefing(value:SlotBriefing,kind:CampaignKind):SlotBriefing {
 const result={} as SlotBriefing;
 for(const section of Object.keys(fields) as Section[]){
  result[section]={};
  for(const field of fields[section]){
   const raw=value[section][field.key];
   if(field.type==='checkbox'){result[section][field.key]=raw===true;continue;}
   const text=String(raw??'').trim();
   if(field.type==='number'||field.type==='money'||field.type==='percent'){
    const normalized=text.replace(',','.');
    if(text&&(!(field.type==='number'?/^\d+$/:/^\d+(\.\d{1,2})?$/).test(normalized)||Number(normalized)<field.min!||Number(normalized)>field.max!))throw Error(`Confira o campo “${field.label}” (${kind}).`);
    result[section][field.key]=text?(field.type==='number'?Number(text):Math.round(Number(normalized)*100)):null;
   }else{
    if(text.length>2000)throw Error(`O campo “${field.label}” aceita até 2.000 caracteres.`);
    if(field.type==='date'&&text&&!validDate(text))throw Error('Informe um prazo de entrega válido.');
    result[section][field.key]=field.type==='date'?(text||null):text;
   }
  }
 }
 if(kind==='ugc'&&result.requirements.min_followers!==null)throw Error('Vagas UGC não podem exigir mínimo de seguidores.');
 return result;
}
export function serializeGeneral(value:GeneralBriefing):GeneralBriefing {
 const result={...value,tone:value.tone.trim(),messages:value.messages.trim(),restrictions:value.restrictions.trim(),references:value.references.map(item=>item.trim()).filter(Boolean),products:value.products.map(item=>({name:item.name.trim(),url:item.url.trim()}))};
 if([result.tone,result.messages,result.restrictions].some(text=>text.length>2000))throw Error('As orientações aceitam até 2.000 caracteres por campo.');
 if(result.references.length>20||result.products.length>20)throw Error('Use até 20 referências e 20 produtos.');
 if(result.references.some(url=>!validReferenceUrl(url))||result.products.some(item=>!item.name||item.name.length>200||!validReferenceUrl(item.url)))throw Error('Informe nome e link HTTPS válido para cada produto; referências também devem usar HTTPS, sem usuário ou senha no link.');
 return result;
}
