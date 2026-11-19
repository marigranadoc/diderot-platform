'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useAccountProfile} from './useAccountProfile';
import {SignedShopImage} from './ShopImageUpload';
import AppIcon,{type IconName} from './AppIcon';
import {getBrowserClient} from '../lib/supabase-browser';

export default function ProfileWorkspace({children}:{children:React.ReactNode}){
 const {userId,profile,hint,loading}=useAccountProfile(),pathname=usePathname();
 const [hash,setHash]=useState('');
 useEffect(()=>{const sync=()=>setHash(window.location.hash);sync();window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync);},[pathname]);
 const type=pathname.startsWith('/painel/criador')||pathname.startsWith('/conta/criador')?'creator':pathname.startsWith('/painel/marca')?'brand':pathname.startsWith('/painel/shopper')?'shopper':profile?.account_type??hint;
 const spaces=profile?.onboarding_completed?[profile.account_type]:[];const [menuOpen,setMenuOpen]=useState(false);
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

 const requested=pathname.startsWith('/painel/criador')||pathname.startsWith('/conta/criador')?'creator':pathname.startsWith('/painel/marca')?'brand':pathname.startsWith('/painel/shopper')?'shopper':null;
 if(requested&&loading)return <p role="status">Preparando seu espaço…</p>;
 if(requested&&userId&&profile?.onboarding_completed&&requested!==profile.account_type)return <section className="account-setup"><h1>Este espaço ainda não está ativo na sua conta</h1><p>Para usar outra categoria, complete a configuração no seu perfil.</p><Link className="dark-button" href="/conta/perfil">Configurar outra categoria</Link><Link href={profile.account_type==='creator'?'/painel/criador':profile.account_type==='brand'?'/painel/marca':'/painel/shopper'}>Voltar ao meu espaço</Link></section>;
 const links=type==='creator'?[
  ['Início','/painel/criador'],['Meu perfil','/conta/perfil'],['Minha loja','/painel/criador/loja'],['Produtos','/painel/criador/loja#products'],['Coleções','/painel/criador/loja#collections'],['Posts','/painel/criador/loja#posts'],['Serviços','/conta/criador/servicos'],['Portfólio','/conta/criador/portfolio'],['Perfil profissional','/conta/criador'],['Oportunidades','/explorar/campanhas'],
 ]:type==='brand'?[
  ['Início','/painel/marca'],['Meu perfil','/conta/perfil'],['Minha marca','/painel/marca'],
 ]:[['Meu perfil','/conta/perfil'],['Meus favoritos','/painel/shopper']];
 const iconFor=(label:string):IconName=>label==='Início'?'home':label.includes('loja')?'store':label==='Produtos'?'package':label==='Coleções'?'layers':label==='Oportunidades'||label==='Serviços'?'briefcase':label==='Portfólio'||label==='Posts'?'image':label.includes('marca')?'building':label.includes('favoritos')?'heart':'user';
 const mobile=type==='creator'?[['Início','/painel/criador','home'],['Minha loja','/painel/criador/loja','store'],['Criar','/painel/criador/loja#create','plus'],['Oportunidades','/explorar/campanhas','briefcase'],['Perfil','/conta/perfil','user']]:type==='brand'?[['Início','/painel/marca','home'],['Campanhas','/painel/marca#campaigns','briefcase'],['Equipe','/painel/marca#team','users'],['Perfil','/conta/perfil','building']]:[['Descobrir','/','home'],['Buscar','/criador#catalogo','search'],['Coleções','/#circulos','layers'],['Favoritos','/painel/shopper','heart'],['Conta','/conta/perfil','user']];
 return <div className={userId?'profile-workspace':'profile-workspace-guest'}>{userId&&<aside className="profile-workspace-sidebar"><div className="workspace-identity">{type!=='shopper'&&<SignedShopImage path={photo} alt={type==='brand'?'Foto da minha marca':'Minha foto de perfil'} avatar/>}<strong>{profile?.display_name||'Meu espaço'}</strong><Link href="/conta/perfil#foto">Editar perfil{type!=='shopper'?' e foto':''}</Link></div><details className="ux-space-picker"><summary><AppIcon name={type==='creator'?'store':type==='brand'?'building':'heart'}/> {profile?.account_type==='creator'?'Meu espaço de creator':profile?.account_type==='brand'?'Minha marca':'Minhas descobertas'}</summary><div>{spaces.map(space=><Link key={space} href={space==='creator'?'/painel/criador':space==='brand'?'/painel/marca':'/painel/shopper'}>{space==='creator'?'Meu espaço de creator':space==='brand'?'Minha marca':'Minhas descobertas'}</Link>)}<Link href="/conta/perfil">Configurações da conta</Link></div></details><button className="ux-mobile-menu-toggle" aria-label="Mais opções do meu espaço" type="button" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>Mais opções</button><nav data-expanded={menuOpen} aria-label="Navegação do meu espaço">{links.map(([label,href])=>{const Entry=href.includes('#')?'a':Link;return <Entry href={href} key={href} aria-current={pathname+hash===href?'page':undefined}><AppIcon name={iconFor(label)}/>{label}</Entry>;})}<Link href="/conta"><AppIcon name="settings"/>Acesso e segurança</Link></nav></aside>}<div className={userId?'profile-workspace-content':undefined}>{children}</div>{userId&&<nav className="ux-mobile-nav" aria-label="Navegação rápida">{mobile.map(([label,href,icon])=>{const Entry=href.includes('#')?'a':Link;return <Entry key={label} href={href} aria-current={pathname+hash===href||pathname===href?'page':undefined}><AppIcon name={icon as IconName}/><span>{label}</span></Entry>;})}</nav>}</div>;
}
