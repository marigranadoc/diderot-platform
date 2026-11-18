'use client';
import {useEffect,useRef,useState} from 'react';
import {getBrowserClient} from '../lib/supabase-browser';
import ProfileAvatarPlaceholder from './ProfileAvatarPlaceholder';

async function decodePhoto(file:File){
 if(typeof createImageBitmap==='function'){try{const bitmap=await createImageBitmap(file);return {source:bitmap as CanvasImageSource,width:bitmap.width,height:bitmap.height,close:()=>bitmap.close()};}catch{}}
 const url=URL.createObjectURL(file),photo=new Image();
 try{photo.src=url;await photo.decode();return {source:photo as CanvasImageSource,width:photo.naturalWidth,height:photo.naturalHeight,close:()=>URL.revokeObjectURL(url)};}catch{URL.revokeObjectURL(url);throw Error('Não foi possível abrir esta foto. Exporte como JPEG, PNG ou WebP e tente novamente.');}
}
async function prepareImage(file:File,avatar:boolean){
 const supported=['image/jpeg','image/png','image/webp','image/heic','image/heif'];
 if(!(supported.includes(file.type)||!file.type&&/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)))throw Error('Escolha uma foto JPEG, PNG ou WebP. Fotos HEIC dependem do suporte do navegador.');
 if(file.size>20*1024*1024)throw Error('Escolha uma foto de até 20 MB.');
 const photo=await decodePhoto(file);
 try{
  if(!photo.width||!photo.height||photo.width*photo.height>60000000)throw Error('A foto excede o limite de 60 megapixels.');
  const canvas=document.createElement('canvas'),scale=Math.min(1,1600/Math.max(photo.width,photo.height));
  canvas.width=avatar?512:Math.max(1,Math.round(photo.width*scale));canvas.height=avatar?512:Math.max(1,Math.round(photo.height*scale));
  const context=canvas.getContext('2d');if(!context)throw Error('Não foi possível preparar a foto.');
  if(avatar){const size=Math.min(photo.width,photo.height);context.drawImage(photo.source,(photo.width-size)/2,(photo.height-size)/2,size,size,0,0,512,512);}else context.drawImage(photo.source,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/webp',0.86));
  if(!blob||blob.type!=='image/webp'||blob.size>4*1024*1024)throw Error('Não foi possível preparar esta foto. Escolha uma imagem menor ou use outro navegador.');
  return blob;
 }finally{photo.close();}
}

export function SignedShopImage({path,alt,avatar=false}:{path:string|null;alt:string;avatar?:boolean}){
 const [url,setUrl]=useState<string|null>(null),[failed,setFailed]=useState(false);
 useEffect(()=>{let active=true;setUrl(null);setFailed(false);if(path){const db=getBrowserClient();if(db)void db.storage.from('diderot-media').createSignedUrl(path,900).then(result=>{if(active){setUrl(result.data?.signedUrl??null);setFailed(!!result.error);}},()=>{if(active)setFailed(true);});}return()=>{active=false;};},[path]);
 return <div className={avatar?'shop-avatar':'shop-image'} role={avatar&&(!url||failed)?'img':undefined} aria-label={avatar&&(!url||failed)?'Foto de perfil não adicionada':undefined}>{url&&!failed?<img src={url} alt={alt} onError={()=>setFailed(true)}/>:avatar?<ProfileAvatarPlaceholder/>:<span>{failed?'Foto indisponível':path?'Carregando foto…':'Imagem indisponível'}</span>}</div>;
}

export default function ShopImageUpload({userId,kind,value,onChange,label,disabled=false,onBusyChange}:{userId:string;kind:'creator'|'brand'|'shop';value:string|null;onChange:(path:string|null)=>Promise<void>|void;label:string;disabled?:boolean;onBusyChange?:(busy:boolean)=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const lifetime=useRef(0),writing=useRef(false);
 useEffect(()=>{onBusyChange?.(busy);},[busy,onBusyChange]);
 useEffect(()=>()=>{lifetime.current++;},[]);
 async function upload(file?:File){
  if(!file||busy||writing.current||disabled)return;
  const token=lifetime.current;writing.current=true;setBusy(true);setError('');setNotice('');
  try{
   const db=getBrowserClient();if(!db)throw Error('Acesso indisponível.');
   const auth=await db.auth.getUser();if(auth.error||auth.data.user?.id!==userId)throw Error('Confira sua sessão antes de enviar a foto.');
   const blob=await prepareImage(file,kind!=='shop');if(lifetime.current!==token)return;
   const path=`${userId}/${kind}/${crypto.randomUUID()}.webp`;
   const saved=await db.storage.from('diderot-media').upload(path,blob,{contentType:'image/webp',upsert:false,cacheControl:'60'});
   if(saved.error)throw Error(/row-level security|unauthorized|jwt|token/i.test(saved.error.message)?'Não foi possível enviar a foto com a sessão atual. Entre novamente; os campos do formulário serão preservados.':'Não foi possível enviar a foto. Confira sua conexão e tente novamente.');
   const current=await db.auth.getUser();if(lifetime.current!==token)return;
   if(current.error||current.data.user?.id!==userId)throw Error('A sessão mudou; a foto não foi vinculada ao perfil.');
   await onChange(path);if(lifetime.current===token)setNotice(kind==='shop'?'Foto enviada. Salve o formulário para guardar a alteração.':'Foto enviada.');
  }catch(error){if(lifetime.current===token)setError(error instanceof Error?error.message:'Não foi possível salvar a foto.');}
  finally{writing.current=false;if(lifetime.current===token)setBusy(false);}
 }
 async function remove(){if(writing.current||disabled)return;const token=lifetime.current;writing.current=true;setBusy(true);setError('');setNotice('');try{await onChange(null);}catch{if(lifetime.current===token)setError('Não foi possível remover a foto do cadastro.');}finally{writing.current=false;if(lifetime.current===token)setBusy(false);}}
 return <div className="shop-upload"><SignedShopImage path={value} alt={label} avatar={kind!=='shop'}/>{!disabled&&<><label className="shop-file-label">{busy?'Enviando foto…':label}<input aria-label={label} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" disabled={busy} onChange={event=>{void upload(event.target.files?.[0]);event.target.value='';}}/></label><small>JPEG, PNG ou WebP, até 20 MB. HEIC pode exigir conversão no seu navegador. {kind==='shop'?'A imagem só aparece publicamente após publicar a loja.':'A foto é ajustada para o formato de perfil.'}</small>{value&&<button type="button" disabled={busy} onClick={()=>void remove()}>Remover {kind==='shop'?'imagem':'foto'}</button>}</>}{busy&&<p role="status">Preparando e salvando foto…</p>}{error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}</div>;
}
