'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';
import {money} from '../lib/catalog';

const types=[['ugc_video','Vídeo UGC'],['video_package','Pacote de vídeos'],['product_photo','Fotografia de produto'],['unboxing','Unboxing'],['demo','Demonstração'],['testimonial','Depoimento'],['scripted_video','Vídeo com roteiro'],['ad_content','Conteúdo para anúncios'],['editing','Edição de vídeo'],['bilingual','Produção bilíngue']];
type Service={id:string;title:string;description:string;service_type:string;pricing_mode:string;starting_price_cents:number|null};
const empty={title:'',description:'',service_type:'ugc_video',pricing_mode:'quote',price:''};
export default function CreatorServices(){
 const [items,setItems]=useState<Service[]>([]),[form,setForm]=useState(empty),[editing,setEditing]=useState<string|null>(null),[deleting,setDeleting]=useState<string|null>(null);
 const [owner,setOwner]=useState<string|null>(null),[hasProfile,setHasProfile]=useState(false),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false),[message,setMessage]=useState(''),[success,setSuccess]=useState(false),[revision,setRevision]=useState(0);
 const generation=useRef(0),sessionOwner=useRef<string|null|undefined>(undefined);
 useEffect(()=>{
  const token=++generation.current,db=getBrowserClient();
  setLoading(true);setFailed(false);setMessage('');setSuccess(false);
  if(!db){setFailed(true);setMessage('O acesso por conta não está configurado.');setLoading(false);return;}
  const {data:listener}=db.auth.onAuthStateChange((event,session)=>{
   if(event==='INITIAL_SESSION')sessionOwner.current=session?.user.id??null;
   if(event==='SIGNED_OUT'||(event==='SIGNED_IN'&&session?.user.id!==sessionOwner.current)){
    sessionOwner.current=session?.user.id??null;generation.current++;setOwner(null);setItems([]);setForm(empty);setEditing(null);setDeleting(null);setBusy(false);setRevision(n=>n+1);
   }
  });
  async function load(){try{
   const {data,error}=await db!.auth.getUser();if(generation.current!==token)return;
   if(error||!data.user){setOwner(null);return;}
   const id=data.user.id;sessionOwner.current=id;setOwner(id);
   const [profile,services]=await Promise.all([db!.from('creator_profiles').select('user_id').eq('user_id',id).maybeSingle(),db!.from('creator_services').select('id,title,description,service_type,pricing_mode,starting_price_cents').eq('user_id',id).order('created_at',{ascending:false})]);
   if(generation.current!==token)return;if(profile.error||services.error)throw Error('Load failed');setHasProfile(!!profile.data);setItems(services.data);
  }catch{if(generation.current===token){setFailed(true);setMessage('Não foi possível carregar seus serviços. Tente novamente.');}}
  finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;listener.subscription.unsubscribe();};
 },[revision]);
 async function mutate(event?:FormEvent<HTMLFormElement>){
  event?.preventDefault();const db=getBrowserClient();if(!db||!owner||busy||failed)return;
  setMessage('');setSuccess(false);
  const cents=form.pricing_mode==='quote'?null:Math.round(Number(form.price)*100);
  if(!deleting&&(form.title.trim().length<2||(cents!==null&&(!Number.isSafeInteger(cents)||cents<1||cents>100000000)))){setMessage('Informe um título e um preço inicial válido.');return;}
  const token=generation.current;setBusy(true);
  try{
   const identity=await db.auth.getUser();if(identity.error||identity.data.user?.id!==owner)throw Error('Invalid session');
   if(deleting){const result=await db.from('creator_services').delete().eq('user_id',owner).eq('id',deleting).select('id').single();if(result.error||result.data?.id!==deleting)throw Error('Delete not confirmed');if(generation.current!==token)return;setItems(list=>list.filter(s=>s.id!==deleting));if(editing===deleting){setEditing(null);setForm(empty);}setDeleting(null);setMessage('Serviço excluído.');}
   else{
    const fields={title:form.title.trim(),description:form.description.trim(),service_type:form.service_type,pricing_mode:form.pricing_mode,starting_price_cents:cents};
    const request=editing?db.from('creator_services').update(fields).eq('user_id',owner).eq('id',editing):db.from('creator_services').insert({user_id:owner,...fields});
    const result=await request.select('id,title,description,service_type,pricing_mode,starting_price_cents').single();if(result.error||!result.data)throw Error('Save not confirmed');if(generation.current!==token)return;
    setItems(list=>editing?list.map(s=>s.id===editing?result.data:s):[result.data,...list]);setForm(empty);setEditing(null);setMessage('Serviço salvo.');
   }
   setSuccess(true);
  }catch{if(generation.current===token)setMessage('Não foi possível concluir a operação. Seus dados anteriores foram preservados. Tente novamente.');}
  finally{if(generation.current===token)setBusy(false);}
 }
 return <section className="account-card creator-onboarding"><span className="eyebrow">O QUE VOCÊ CRIA</span><h1>Meus serviços</h1><p>Defina suas ofertas e seus preços iniciais. Serviços ficam privados nesta etapa; o cadastro não cria contrato nem pagamento.</p>
 {loading?<p role="status">Carregando serviços…</p>:failed?<button onClick={()=>setRevision(n=>n+1)}>Tentar novamente</button>:!owner?<Link className="dark-button" href="/conta">Entrar para gerenciar serviços</Link>:!hasProfile?<><p>Configure seu perfil de creator antes de adicionar serviços.</p><Link href="/conta/criador">Configurar perfil de creator</Link></>:<>
 <form onSubmit={mutate}><h2>{editing?'Editar serviço':'Novo serviço'}</h2><label>Título do serviço<input required minLength={2} maxLength={100} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></label><label>Tipo de serviço<select value={form.service_type} onChange={e=>setForm(p=>({...p,service_type:e.target.value}))}>{types.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Descrição do serviço<textarea maxLength={2000} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></label><label>Forma de preço<select value={form.pricing_mode} onChange={e=>setForm(p=>({...p,pricing_mode:e.target.value,price:''}))}><option value="quote">Sob orçamento</option><option value="starting">Preço inicial</option></select></label>{form.pricing_mode==='starting'&&<label>Preço inicial (R$)<input type="number" min="0.01" max="1000000" step="0.01" required value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/></label>}<button className="dark-button" disabled={busy||!!deleting}>{busy?'Aguarde…':'Salvar serviço'}</button>{editing&&<button type="button" disabled={busy} onClick={()=>{setEditing(null);setForm(empty);}}>Cancelar edição</button>}</form>
 {items.length===0?<p>Nenhum serviço cadastrado. Adicione sua primeira oferta.</p>:<div className="service-list">{items.map(item=><article key={item.id} className="service-card"><h2>{item.title}</h2><p>{item.description}</p><p>{item.pricing_mode==='quote'?'Sob orçamento':`A partir de ${money(item.starting_price_cents!/100)}`}</p><div className="service-actions"><button disabled={busy||!!deleting} onClick={()=>{setEditing(item.id);setForm({title:item.title,description:item.description,service_type:item.service_type,pricing_mode:item.pricing_mode,price:item.starting_price_cents===null?'':String(item.starting_price_cents/100)});setMessage('');}}>Editar {item.title}</button><button disabled={busy||!!deleting} onClick={()=>{setDeleting(item.id);setMessage('');}}>Excluir {item.title}</button></div>{deleting===item.id&&<div role="group" aria-label={`Confirmar exclusão de ${item.title}`}><p>Excluir este serviço? Esta ação não pode ser desfeita.</p><button disabled={busy} onClick={()=>mutate()}>Confirmar exclusão</button><button disabled={busy} onClick={()=>setDeleting(null)}>Cancelar exclusão</button></div>}</article>)}</div>}
 </>}{message&&<p role={success?'status':'alert'}>{message}</p>}<Link href="/conta/criador">Voltar ao perfil de creator</Link></section>;
}
