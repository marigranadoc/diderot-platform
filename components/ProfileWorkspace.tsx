'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useAccountProfile} from './useAccountProfile';
import {SignedShopImage} from './ShopImageUpload';
import {getBrowserClient} from '../lib/supabase-browser';

export default function ProfileWorkspace({children}:{children:React.ReactNode}){
 const {userId,profile,hint}=useAccountProfile(),pathname=usePathname();
 const [hash,setHash]=useState('');
 useEffect(()=>{const sync=()=>setHash(window.location.hash);sync();window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync);},[pathname]);
 const type=profile?.account_type??hint;
 const [photo,setPhoto]=useState<string|null>(null);
 useEffect(()=>{
  let active=true;setPhoto(null);const db=getBrowserClient();
  async function load(){
   if(!db||!userId||type==='shopper')return;
   let subject=userId;
   if(type==='brand'){const organization=await db.from('organizations').select('id').eq('owner_user_id',userId).maybeSingle();if(!active||organization.error||!organization.data?.id)return;subject=organization.data.id;}
   const result=await db.from('profile_photos').select('object_path').eq('kind',type).eq('subject_id',subject).maybeSingle();
   if(active)setPhoto(result.error?null:result.data?.object_path??null);
  }
  void load();window.addEventListener('diderot:profile-photo-changed',load);
  return()=>{active=false;window.removeEventListener('diderot:profile-photo-changed',load);};
 },[userId,type]);

 const links=type==='creator'?[
  ['Meu perfil','/conta/perfil'],['Minha loja','/painel/criador/loja#profile'],['Produtos','/painel/criador/loja#products'],['Coleções','/painel/criador/loja#collections'],['Posts','/painel/criador/loja#posts'],['Serviços','/conta/criador/servicos'],['Portfólio','/conta/criador/portfolio'],['Perfil profissional','/conta/criador'],
 ]:type==='brand'?[
  ['Meu perfil','/conta/perfil'],['Minha marca','/painel/marca'],
 ]:[['Meu perfil','/conta/perfil'],['Meus favoritos','/painel/shopper']];
 return <div className={userId?'profile-workspace':'profile-workspace-guest'}>{userId&&<aside className="profile-workspace-sidebar"><div className="workspace-identity">{type!=='shopper'&&<SignedShopImage path={photo} alt={type==='brand'?'Foto da minha marca':'Minha foto de perfil'} avatar/>}<strong>{profile?.display_name||'Meu espaço'}</strong><Link href="/conta/perfil#foto">Editar perfil{type!=='shopper'?' e foto':''}</Link></div><nav aria-label="Navegação do meu espaço">{links.map(([label,href])=>{const Entry=href.includes('#')?'a':Link;return <Entry href={href} key={href} aria-current={pathname+hash===href?'page':undefined}>{label}</Entry>;})}<Link href="/conta">Acesso e segurança</Link></nav></aside>}<div className={userId?'profile-workspace-content':undefined}>{children}</div></div>;
}
