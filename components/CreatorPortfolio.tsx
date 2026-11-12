'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';
import {portfolioTypes as types,portfolioLink} from '../lib/portfolio';

type PortfolioItem={id:string;title:string;description:string;item_type:string;category:string;participation:string;media_url:string};
const empty={title:'',description:'',item_type:'ugc_video',category:'',participation:'',media_url:''};
export default function CreatorPortfolio(){
 const [items,setItems]=useState<PortfolioItem[]>([]),[form,setForm]=useState(empty),[editing,setEditing]=useState<string|null>(null),[deleting,setDeleting]=useState<string|null>(null);
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
   const [profile,services]=await Promise.all([db!.from('creator_profiles').select('user_id').eq('user_id',id).maybeSingle(),db!.from('creator_portfolio_items').select('id,title,description,item_type,category,participation,media_url').eq('user_id',id).order('created_at',{ascending:false})]);
   if(generation.current!==token)return;if(profile.error||services.error)throw Error('Load failed');setHasProfile(!!profile.data);setItems(services.data);
  }catch{if(generation.current===token){setFailed(true);setMessage('Não foi possível carregar seu portfólio. Tente novamente.');}}
  finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;listener.subscription.unsubscribe();};
 },[revision]);
 async function mutate(event?:FormEvent<HTMLFormElement>){
  event?.preventDefault();const db=getBrowserClient();if(!db||!owner||busy||failed)return;
  setMessage('');setSuccess(false);
  const mediaUrl=portfolioLink(form.media_url);
  if(!deleting&&(form.title.trim().length<2||!mediaUrl)){setMessage('Informe um título e um link HTTPS válido, sem usuário ou senha na URL.');return;}
  const token=generation.current;setBusy(true);
  try{
   const identity=await db.auth.getUser();if(identity.error||identity.data.user?.id!==owner)throw Error('Invalid session');
   if(deleting){const result=await db.from('creator_portfolio_items').delete().eq('user_id',owner).eq('id',deleting).select('id').single();if(result.error||result.data?.id!==deleting)throw Error('Delete not confirmed');if(generation.current!==token)return;setItems(list=>list.filter(s=>s.id!==deleting));if(editing===deleting){setEditing(null);setForm(empty);}setDeleting(null);setMessage('Trabalho excluído.');}
   else{
    const fields={title:form.title.trim(),description:form.description.trim(),item_type:form.item_type,category:form.category.trim(),participation:form.participation.trim(),media_url:mediaUrl!};
    const request=editing?db.from('creator_portfolio_items').update(fields).eq('user_id',owner).eq('id',editing):db.from('creator_portfolio_items').insert({user_id:owner,...fields});
    const result=await request.select('id,title,description,item_type,category,participation,media_url').single();if(result.error||!result.data)throw Error('Save not confirmed');if(generation.current!==token)return;
    setItems(list=>editing?list.map(s=>s.id===editing?result.data:s):[result.data,...list]);setForm(empty);setEditing(null);setMessage('Trabalho salvo.');
   }
   setSuccess(true);
  }catch{if(generation.current===token)setMessage('Não foi possível concluir a operação. Seus dados anteriores foram preservados. Tente novamente.');}
  finally{if(generation.current===token)setBusy(false);}
 }
 return <section className="account-card creator-onboarding"><span className="eyebrow">SUAS CRIAÇÕES</span><h1>Meu portfólio</h1><p>Organize links dos seus trabalhos. O cadastro fica privado; a visibilidade do conteúdo no site de destino depende das configurações desse serviço.</p>
 {loading?<p role="status">Carregando portfólio…</p>:failed?<button onClick={()=>setRevision(n=>n+1)}>Tentar novamente</button>:!owner?<Link className="dark-button" href="/conta">Entrar para gerenciar portfólio</Link>:!hasProfile?<><p>Configure seu perfil de creator antes de adicionar trabalhos.</p><Link href="/conta/criador">Configurar perfil de creator</Link></>:<>
 <form onSubmit={mutate}><h2>{editing?'Editar trabalho':'Novo trabalho'}</h2>
 <label>Título do trabalho<input required minLength={2} maxLength={100} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></label>
 <label>Tipo de trabalho<select value={form.item_type} onChange={e=>setForm(p=>({...p,item_type:e.target.value}))}>{types.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
 <label>Categoria<input maxLength={100} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></label>
 <label>Descrição do trabalho<textarea maxLength={2000} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></label>
 <label>Sua participação<input maxLength={200} placeholder="Ex.: roteiro, captação e edição" value={form.participation} onChange={e=>setForm(p=>({...p,participation:e.target.value}))}/></label>
 <label>Link do trabalho<input type="url" required maxLength={2048} placeholder="https://" value={form.media_url} onChange={e=>setForm(p=>({...p,media_url:e.target.value}))}/></label>
 <p>Use um link HTTPS que você tenha autorização para compartilhar. Nesta etapa os arquivos permanecem no serviço de origem.</p>
 <button className="dark-button" disabled={busy||!!deleting}>{busy?'Aguarde…':'Salvar trabalho'}</button>{editing&&<button type="button" disabled={busy} onClick={()=>{setEditing(null);setForm(empty);}}>Cancelar edição</button>}</form>
 {items.length===0?<p>Nenhum trabalho cadastrado. Adicione seu primeiro item de portfólio.</p>:<div className="service-list">{items.map(item=><article key={item.id} className="service-card"><span className="eyebrow">{types.find(([value])=>value===item.item_type)?.[1]}{item.category&&` · ${item.category}`}</span><h2>{item.title}</h2><p>{item.description}</p>{item.participation&&<p>Participação: {item.participation}</p>}{portfolioLink(item.media_url)?<a className="text-link" href={portfolioLink(item.media_url)!} target="_blank" rel="noopener noreferrer">Abrir trabalho: {item.title} ↗</a>:<p>Link indisponível. Edite este trabalho para atualizar o endereço.</p>}<div className="service-actions"><button disabled={busy||!!deleting} onClick={()=>{setEditing(item.id);setForm({title:item.title,description:item.description,item_type:item.item_type,category:item.category,participation:item.participation,media_url:item.media_url});setMessage('');}}>Editar {item.title}</button><button disabled={busy||!!deleting} onClick={()=>{setDeleting(item.id);setMessage('');}}>Excluir {item.title}</button></div>{deleting===item.id&&<div role="group" aria-label={`Confirmar exclusão de ${item.title}`}><p>Excluir este item do portfólio? O arquivo no serviço de origem será mantido.</p><button disabled={busy} onClick={()=>mutate()}>Confirmar exclusão</button><button disabled={busy} onClick={()=>setDeleting(null)}>Cancelar exclusão</button></div>}</article>)}</div>}
 </>}{message&&<p role={success?'status':'alert'}>{message}</p>}<Link href="/conta/criador">Voltar ao perfil de creator</Link></section>;
}
