'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {accountDestinations,accountLabels,accountTypes,type AccountType} from '../lib/account-types';
import {getBrowserClient} from '../lib/supabase-browser';
const features={shopper:['Perfil de Ana','Produtos e curadorias','Favoritos salvos na conta'],creator:['Perfil de Clara','Serviços e portfólio','Loja, produtos e coleções'],brand:['Organização Ateliê Aurora','Equipe e convites','Planejamento de campanhas']};
export default function DemoAccess({enabled}:{enabled:boolean}){
 const router=useRouter(),[busy,setBusy]=useState<AccountType|null>(null),[error,setError]=useState('');
 const writing=useRef(false),generation=useRef(0),pending=useRef<AbortController|null>(null);
 useEffect(()=>()=>{generation.current++;pending.current?.abort();},[]);
 async function enter(type:AccountType){
  if(writing.current)return;writing.current=true;const token=++generation.current;setBusy(type);setError('');
  const controller=new AbortController();pending.current=controller;let expired=false;const timer=setTimeout(()=>{expired=true;controller.abort();},20000);
  try{
   const db=getBrowserClient();if(!db)throw Error();
   const response=await fetch('/api/demo/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type}),cache:'no-store',signal:controller.signal});
   const result=await response.json();clearTimeout(timer);if(generation.current!==token)return;if(expired)throw Error();if(!response.ok||typeof result.access_token!=='string'||typeof result.refresh_token!=='string'||!result.access_token||!result.refresh_token)throw Error();
   // Switch only this browser; other sessions of a real account stay signed in.
   const logout=await db.auth.signOut({scope:'local'});if(generation.current!==token)return;if(logout.error)throw logout.error;
   const session=await db.auth.setSession(result);if(generation.current!==token)return;if(session.error)throw session.error;
   const identity=await db.auth.getUser();if(generation.current!==token)return;if(identity.error||!identity.data.user)throw Error();
   router.push(accountDestinations[type]);
  }catch{if(generation.current===token){setError(expired?'A entrada demorou mais que o esperado. Tente novamente.':'Não foi possível entrar nesta conta. Tente novamente ou use seu próprio cadastro.');setBusy(null);}}
  finally{clearTimeout(timer);pending.current=null;writing.current=false;}
 }
 return <section className="demo-access"><span className="eyebrow">SEU ESPAÇO NA DIDEROT</span><h1>Escolha seu espaço.</h1><p>Explore a Diderot como shopper, creator ou marca.</p><p className="demo-notice">Estas contas são compartilhadas. Ao entrar, a conta ativa neste navegador será trocada. Use sua própria conta para informações pessoais.</p>
 {!enabled&&<p role="alert">Estes acessos estão indisponíveis no momento. Você pode criar sua própria conta abaixo.</p>}
 <div className="demo-account-grid">{accountTypes.map(type=><article className="service-card" key={type}><span className="eyebrow">DIDEROT</span><h2>{accountLabels[type]}</h2><ul>{features[type].map(feature=><li key={feature}>{feature}</li>)}</ul><button className="dark-button" disabled={!!busy||!enabled} onClick={()=>void enter(type)}>{busy===type?'Entrando…':`Entrar como ${accountLabels[type].toLowerCase()}`}</button></article>)}</div>
 {error&&<p role="alert">{error}</p>}<div className="campaign-actions"><Link className="dark-button" href="/cadastro">Criar minha própria conta</Link><Link href="/conta">Já tenho conta</Link><Link href="/">Voltar para a home</Link></div></section>;
}
