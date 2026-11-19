'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {getBrowserClient} from '../lib/supabase-browser';
import ProfileAvatarPlaceholder from './ProfileAvatarPlaceholder';

import {photoExtension,preparePhoto,validatePhoto} from '../lib/photo-processing';
import PhotoCropDialog from './PhotoCropDialog';
export function SignedShopImage({path,alt,avatar=false}:{path:string|null;alt:string;avatar?:boolean}){
 const [url,setUrl]=useState<string|null>(null),[failed,setFailed]=useState(false);
 useEffect(()=>{let active=true;setUrl(null);setFailed(false);if(path){const db=getBrowserClient();if(db)void db.storage.from('diderot-media').createSignedUrl(path,900).then(result=>{if(active){setUrl(result.data?.signedUrl??null);setFailed(!!result.error);}},()=>{if(active)setFailed(true);});}return()=>{active=false;};},[path]);
 return <div className={avatar?'shop-avatar':'shop-image'} role={avatar&&(!url||failed)?'img':undefined} aria-label={avatar&&(!url||failed)?'Foto de perfil não adicionada':undefined}>{url&&!failed?<img src={url} alt={alt} onError={()=>setFailed(true)}/>:avatar?<ProfileAvatarPlaceholder/>:<span>{failed?'Foto indisponível':path?'Carregando foto…':'Imagem indisponível'}</span>}</div>;
}

export default function ShopImageUpload({userId,kind,value,onChange,label,disabled=false,onBusyChange}:{userId:string;kind:'creator'|'brand'|'shop';value:string|null;onChange:(path:string|null)=>Promise<void>|void;label:string;disabled?:boolean;onBusyChange?:(busy:boolean)=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [cropFile,setCropFile]=useState<File|null>(null);const prepared=useRef<Blob|null>(null);
 const inputId=useId(),input=useRef<HTMLInputElement>(null);
 const lifetime=useRef(0),writing=useRef(false);
 useEffect(()=>{onBusyChange?.(busy||!!cropFile);},[busy,cropFile,onBusyChange]);
 useEffect(()=>()=>{lifetime.current++;},[]);
 async function select(file?:File){if(!file||busy||writing.current||disabled)return;setError('');setNotice('');prepared.current=null;try{validatePhoto(file);if(kind!=='shop'){setCropFile(file);return;}await upload(file);}catch(error){setError(error instanceof Error?error.message:'Não foi possível abrir esta foto.');}}
 async function upload(source:File|Blob):Promise<boolean>{
  if(busy||writing.current||disabled)return false;
  const token=lifetime.current;writing.current=true;setBusy(true);setError('');setNotice('');
  try{
   const db=getBrowserClient();if(!db)throw Error('Acesso indisponível.');
   const auth=await db.auth.getUser();if(auth.error||auth.data.user?.id!==userId)throw Error('Confira sua sessão antes de enviar a foto.');
   const blob=source instanceof File?await preparePhoto(source):source;if(lifetime.current!==token)return false;prepared.current=blob;
   const extension=photoExtension(blob),filename=crypto.randomUUID()+'.'+extension,path=userId+'/'+kind+'/'+filename;
   const saved=await db.storage.from('diderot-media').upload(path,new File([blob],filename,{type:blob.type}),{contentType:blob.type,upsert:false,cacheControl:'60'});
   if(saved.error){const status=Number('statusCode' in saved.error?saved.error.statusCode:0);throw Error(status===413?'Esta imagem excede o limite de envio. Escolha uma foto menor.':/row-level security|unauthorized|jwt|token/i.test(saved.error.message)?'Não foi possível enviar a foto com a sessão atual. Entre novamente; os campos do formulário serão preservados.':/bucket.*not found/i.test(saved.error.message)?'O armazenamento de fotos está indisponível. Tente novamente em instantes.':'Não foi possível enviar a foto. Confira sua conexão e tente novamente.');}
   const current=await db.auth.getUser();if(lifetime.current!==token)return false;
   if(current.error||current.data.user?.id!==userId)throw Error('A sessão mudou; a foto não foi vinculada ao perfil.');
   await onChange(path);if(lifetime.current!==token)return false;prepared.current=null;setNotice(kind==='shop'?'Foto enviada. Salve o formulário para guardar a alteração.':'Foto enviada.');return true;
  }catch(error){if(lifetime.current===token)setError(error instanceof Error?error.message:'Não foi possível salvar a foto.');return false;}
  finally{writing.current=false;if(lifetime.current===token)setBusy(false);}
 }
 async function remove(){if(writing.current||disabled)return;const token=lifetime.current;writing.current=true;setBusy(true);setError('');setNotice('');try{await onChange(null);}catch{if(lifetime.current===token)setError('Não foi possível remover a foto do cadastro.');}finally{writing.current=false;if(lifetime.current===token)setBusy(false);}}
 return <div className="shop-upload">{disabled?<SignedShopImage path={value} alt={label} avatar={kind!=='shop'}/>:<label htmlFor={inputId} className="ux-photo-target"><SignedShopImage path={value} alt={label} avatar={kind!=='shop'}/></label>}{!disabled&&<><label className="shop-file-label">{busy?'Enviando foto…':label}<input ref={input} id={inputId} aria-label={label} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" disabled={busy||disabled||!!cropFile} onChange={event=>{void select(event.target.files?.[0]);event.target.value='';}}/></label><small>JPEG, PNG ou WebP, até 20 MB. HEIC pode exigir conversão no seu navegador. {kind==='shop'?'A imagem só aparece publicamente após publicar a loja.':'Você pode ajustar o enquadramento antes de salvar.'}</small>{value&&<button type="button" disabled={busy} onClick={()=>void remove()}>Remover {kind==='shop'?'imagem':'foto'}</button>}</>}{busy&&<p role="status">Preparando e salvando foto…</p>}{error&&!cropFile&&<><p role="alert">{error}</p>{prepared.current&&<button type="button" disabled={busy||disabled} onClick={()=>{if(prepared.current)void upload(prepared.current);}}>Tentar enviar foto novamente</button>}</>}{notice&&<p role="status">{notice}</p>}{cropFile&&<PhotoCropDialog key={inputId} file={cropFile} busy={busy} error={error} onCancel={()=>{if(!busy){setCropFile(null);prepared.current=null;setError('');requestAnimationFrame(()=>input.current?.focus());}}} onConfirm={async blob=>{const success=await upload(blob);if(success){setCropFile(null);requestAnimationFrame(()=>input.current?.focus());}return success;}}/>}</div>;
}
