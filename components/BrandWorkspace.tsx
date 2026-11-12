'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';

type Organization={id:string;owner_user_id:string;name:string;website:string;description:string;created_at:string;role:'owner'|'member'};
const columns='id,owner_user_id,name,website,description,created_at';
const blank={name:'',website:'',description:''};

export default function BrandWorkspace(){
 const [userId,setUserId]=useState<string|null>(null),[organizations,setOrganizations]=useState<Organization[]|null>(null);
 const [loading,setLoading]=useState(true),[loadError,setLoadError]=useState(''),[revision,setRevision]=useState(0);
 const [editing,setEditing]=useState<string|null>(null),[form,setForm]=useState(blank),[saving,setSaving]=useState(false);
 const [message,setMessage]=useState(''),[success,setSuccess]=useState(false);
 const generation=useRef(0),verifiedOwner=useRef<string|null>(null),writing=useRef(false);
 function invalidate(){
  generation.current++;verifiedOwner.current=null;setUserId(null);setOrganizations(null);
  setEditing(null);setForm(blank);setMessage('');setSaving(false);setLoading(true);setRevision(n=>n+1);
 }
 function clearSession(){
  generation.current++;verifiedOwner.current=null;setUserId(null);setOrganizations(null);
  setEditing(null);setForm(blank);setMessage('');setLoadError('');setSaving(false);setLoading(false);
 }
 useEffect(()=>{
  const db=getBrowserClient();if(!db)return;
  const {data}=db.auth.onAuthStateChange((event,session)=>{
   if(event==='SIGNED_OUT')clearSession();
   else if(event==='SIGNED_IN'&&session?.user.id!==verifiedOwner.current)invalidate();
  });
  const key=`sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}-auth-token`;
  const onStorage=(event:StorageEvent)=>{
   if(event.key!==key&&event.key!==null)return;
   let hint:unknown=null;try{hint=event.newValue?JSON.parse(event.newValue)?.user?.id??null:null;}catch{hint=undefined;}
   if(event.newValue===null)clearSession();
   else if(hint!==verifiedOwner.current)invalidate();
  };
  window.addEventListener('storage',onStorage);
  return()=>{generation.current++;data.subscription.unsubscribe();window.removeEventListener('storage',onStorage);};
 },[]);
 useEffect(()=>{
  const token=++generation.current,db=getBrowserClient();
  setLoading(true);setLoadError('');setOrganizations(null);setEditing(null);setForm(blank);setMessage('');
  if(!db){setLoadError('O acesso por conta não está configurado.');setLoading(false);return;}
  async function load(){try{
   const auth=await db!.auth.getUser();if(generation.current!==token)return;
   if(auth.error){if(auth.error.name==='AuthSessionMissingError'){verifiedOwner.current=null;setUserId(null);return;}throw auth.error;}
   if(!auth.data.user){verifiedOwner.current=null;setUserId(null);return;}
   // A response for the previous session must not reopen private data after
   // local logout. Identity is verified by getUser; getSession checks that the
   // same identity is still selected in this browser before querying its data.
   const current=await db!.auth.getSession();if(generation.current!==token)return;
   if(current.error||current.data.session?.user.id!==auth.data.user.id){verifiedOwner.current=null;setUserId(null);return;}
   const id=auth.data.user.id;verifiedOwner.current=id;setUserId(id);
   const [orgs,members]=await Promise.all([
    db!.from('organizations').select(columns).order('created_at',{ascending:false}),
    db!.from('organization_members').select('organization_id,role').eq('user_id',id),
   ]);
   if(generation.current!==token)return;
   if(orgs.error||members.error||!orgs.data||!members.data)throw Error('Organization read failed');
   const rows:Organization[]=orgs.data.map(row=>{
    const role=members.data.find(member=>member.organization_id===row.id)?.role;
    if(role!=='owner'&&role!=='member')throw Error('Membership not confirmed');
    return {...row,role} as Organization;
   });
   setOrganizations(rows);
  }catch{if(generation.current===token)setLoadError('Não foi possível carregar suas organizações. Tente novamente.');}
  finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;};
 },[revision]);
 const owned=organizations?.find(org=>org.owner_user_id===userId);
 async function save(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const db=getBrowserClient();
  if(!db||!userId||loading||loadError||saving||writing.current||!organizations)return;
  setSuccess(false);setMessage('');
  const fields={name:form.name.trim(),website:form.website.trim(),description:form.description.trim()};
  if(fields.name.length<2||fields.name.length>100){setMessage('Informe um nome entre 2 e 100 caracteres.');return;}
  if(fields.website){try{const url=new URL(fields.website);if(url.protocol!=='https:'||!url.hostname||url.username||url.password||/\s/.test(fields.website)||fields.website.length>2048)throw Error();}catch{setMessage('Informe um site HTTPS válido, sem usuário ou senha no endereço.');return;}}
  if(fields.description.length>2000){setMessage('A descrição deve ter até 2.000 caracteres.');return;}
  const target=editing?organizations.find(org=>org.id===editing):null;
  if((editing&&(!target||target.owner_user_id!==userId||target.role!=='owner'))||(!editing&&owned)){setMessage('Você não pode realizar essa alteração. Atualize a lista.');return;}
  const token=generation.current;writing.current=true;setSaving(true);
  try{
   const auth=await db.auth.getUser();if(generation.current!==token)return;
   if(auth.error||auth.data.user?.id!==userId)throw Error('Session changed');
   const result=editing
    ? await db.from('organizations').update(fields).eq('id',editing).eq('owner_user_id',userId).select(columns).single()
    : await db.from('organizations').insert(fields).select(columns).single();
   if(generation.current!==token)return;
   if(result.error||!result.data||result.data.owner_user_id!==userId){
    if(result.error?.code==='23505'){setMessage('Esta conta já possui uma organização. Atualize a lista para conferir o cadastro.');return;}
    throw Error('Write not confirmed');
   }
   const member=await db.from('organization_members').select('role').eq('organization_id',result.data.id).eq('user_id',userId).single();
   if(generation.current!==token)return;
   if(member.error||member.data?.role!=='owner')throw Error('Membership not confirmed');
   const confirmed={...result.data,role:'owner'} as Organization;
   setOrganizations(previous=>[confirmed,...(previous??[]).filter(org=>org.id!==confirmed.id)]);
   setEditing(null);setForm(blank);setSuccess(true);setMessage('Organização salva. Seu vínculo de responsável foi confirmado.');
  }catch{if(generation.current===token)setMessage('Não foi possível confirmar a alteração. Atualize a lista para conferir seus dados antes de tentar novamente.');}
  finally{writing.current=false;if(generation.current===token)setSaving(false);}
 }
 function edit(org:Organization){setEditing(org.id);setForm({name:org.name,website:org.website,description:org.description});setMessage('');setSuccess(false);}
 return <section className="creator-dashboard brand-workspace"><span className="eyebrow">SEU ESPAÇO DE MARCA</span><h1>Painel da marca</h1>
 <p>Cadastre sua organização e mantenha suas informações em um espaço privado.</p>
 {loading?<p role="status">Carregando suas organizações…</p>:loadError?<><p role="alert">{loadError}</p><button className="dark-button" onClick={()=>setRevision(n=>n+1)}>Tentar novamente</button></>:!userId?<><p>Entre para acessar ou cadastrar sua organização.</p><Link className="dark-button" href="/conta">Entrar na minha conta</Link><Link href="/cadastro">Criar conta</Link></>:organizations&&<>
 <div className="brand-toolbar"><p>{organizations.length===0?'Você ainda não possui uma organização vinculada.':`${organizations.length} ${organizations.length===1?'organização vinculada':'organizações vinculadas'}`}</p><button disabled={saving} onClick={()=>setRevision(n=>n+1)}>Atualizar organizações</button></div>
 <div className="brand-organization-list">{organizations.map(org=><article className="service-card" key={org.id} aria-label={org.name}><span className="eyebrow">{org.owner_user_id===userId&&org.role==='owner'?'RESPONSÁVEL':'MEMBRO · SOMENTE LEITURA'}</span><h2>{org.name}</h2>{org.description&&<p>{org.description}</p>}{org.website&&<a href={org.website} target="_blank" rel="noopener noreferrer">Visitar site da organização ↗</a>}{org.owner_user_id===userId&&org.role==='owner'&&<button disabled={saving} onClick={()=>edit(org)}>Editar organização</button>}</article>)}</div>
 {(!owned||editing)&&<div className="account-card brand-form"><h2>{editing?'Editar organização':'Cadastrar organização'}</h2><p>Cada conta pode criar uma organização nesta etapa. Criar o cadastro não representa aprovação comercial da marca.</p><form onSubmit={save}><label>Nome da organização<input required minLength={2} maxLength={100} autoComplete="organization" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></label><label>Site (opcional)<input type="url" placeholder="https://" maxLength={2048} value={form.website} onChange={e=>setForm(p=>({...p,website:e.target.value}))}/></label><label>Sobre a organização<textarea maxLength={2000} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></label><button className="dark-button" disabled={saving}>{saving?'Salvando…':'Salvar organização'}</button>{editing&&<button type="button" disabled={saving} onClick={()=>{setEditing(null);setForm(blank);setMessage('');}}>Cancelar edição</button>}</form></div>}
 {message&&<p role={success?'status':'alert'}>{message}</p>}
 <p className="brand-limits">Organizações e vínculos ficam privados. Convites de equipe, aprovação comercial, campanhas e contratação ainda não estão disponíveis.</p>
 </>}
 <Link className="text-link" href="/conta">Minha conta e saída</Link></section>;
}
