'use client';
import {useEffect,useRef,useState} from 'react';
import {getBrowserClient} from '../lib/supabase-browser';
import ShopImageUpload from './ShopImageUpload';

export default function ProfilePhoto({userId,kind,subjectId,readOnly=false,onChanged,onBusyChange}:{userId:string;kind:'creator'|'brand';subjectId:string;readOnly?:boolean;onChanged?:(path:string|null)=>void;onBusyChange?:(busy:boolean)=>void}){
 const [path,setPath]=useState<string|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[reload,setReload]=useState(0);
 const generation=useRef(0);
 useEffect(()=>{const token=++generation.current;setLoading(true);setError('');setNotice('');setPath(null);const db=getBrowserClient();
  async function load(){try{if(!db)throw Error();const result=await db.from('profile_photos').select('object_path').eq('kind',kind).eq('subject_id',subjectId).maybeSingle();if(generation.current!==token)return;if(result.error)throw Error();setPath(result.data?.object_path??null);}catch{if(generation.current===token)setError('Não foi possível carregar a foto.');}finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;};
 },[kind,subjectId,reload]);
 async function save(value:string|null){
  const db=getBrowserClient(),token=generation.current;if(!db||readOnly)throw Error('Edição indisponível.');setNotice('');setError('');
  const auth=await db.auth.getUser();if(auth.error||auth.data.user?.id!==userId||generation.current!==token)throw Error('Confira sua sessão.');
  const saved=await db.rpc('save_profile_photo',{p_kind:kind,p_subject:subjectId,p_path:value});if(generation.current!==token)return;if(saved.error)throw Error('Não foi possível vincular a foto. Tente novamente.');
  const confirmed=await db.from('profile_photos').select('object_path').eq('kind',kind).eq('subject_id',subjectId).single();if(generation.current!==token)return;
  if(confirmed.error||confirmed.data?.object_path!==value)throw Error('Não foi possível confirmar a foto. Tente novamente.');
  setPath(value);setNotice(value?'Foto salva e confirmada.':'Foto removida do cadastro.');onChanged?.(value);window.dispatchEvent(new Event('diderot:profile-photo-changed'));
 }
 return <section className="profile-photo-editor" aria-label={kind==='brand'?'Foto da marca':'Foto de creator e afiliada'}><h2>{kind==='brand'?'Foto da marca':'Foto de perfil'}</h2>{loading?<p aria-live="polite">Carregando foto…</p>:error?<><p role="alert">{error}</p><button type="button" onClick={()=>setReload(x=>x+1)}>Tentar carregar foto</button></>:<ShopImageUpload userId={userId} kind={kind} value={path} onChange={save} label={kind==='brand'?'Escolher foto da marca':'Escolher foto de perfil'} disabled={readOnly} onBusyChange={onBusyChange}/>}{notice&&<p role="status">{notice}</p>}{kind==='creator'&&!readOnly&&<small>Na loja pública, a foto aparece no topo após publicar ou atualizar a publicação da loja.</small>}</section>;
}
