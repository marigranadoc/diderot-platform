'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {accountDestinations,accountLabels,accountTypes,type AccountType} from '../lib/account-types';
import {getBrowserClient} from '../lib/supabase-browser';
const features={shopper:['Perfil de Ana','Produtos e curadorias','Favoritos salvos na conta'],creator:['Perfil de Clara','Serviços e portfólio preenchidos','Campanhas fictícias para explorar'],brand:['Organização Ateliê Aurora','Equipe e convites','Três rascunhos de campanhas']};
export default function DemoAccess({enabled}:{enabled:boolean}){
 const router=useRouter(),[busy,setBusy]=useState<AccountType|null>(null),[error,setError]=useState('');
 async function enter(type:AccountType){
  if(busy)return;setBusy(type);setError('');
  try{
   const db=getBrowserClient();if(!db)throw Error();
   const response=await fetch('/api/demo/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type}),cache:'no-store'});
   const result=await response.json();if(!response.ok||!result.access_token||!result.refresh_token)throw Error();
   // Switch only this browser; other sessions of a real account stay signed in.
   const logout=await db.auth.signOut({scope:'local'});if(logout.error)throw logout.error;
   const session=await db.auth.setSession(result);if(session.error)throw session.error;
   const identity=await db.auth.getUser();if(identity.error||!identity.data.user)throw Error();
   router.push(accountDestinations[type]);
  }catch{setError('Não foi possível entrar na demonstração. Tente novamente; você também pode usar o cadastro normal.');setBusy(null);}
 }
 return <section className="demo-access"><span className="eyebrow">CONHEÇA POR DENTRO</span><h1>Experimente a Diderot.</h1><p>Escolha um tipo de conta e navegue com perfis e dados fictícios já preenchidos. Não precisa informar e-mail ou senha.</p><p className="demo-notice">As contas demonstrativas são compartilhadas entre avaliadores. Ao entrar, a conta ativa neste navegador será trocada. Use somente informações fictícias; não há pagamentos ou contratações reais.</p>
 {!enabled&&<p role="alert">As contas demonstrativas estão sendo preparadas neste ambiente. O cadastro normal está disponível abaixo.</p>}
 <div className="demo-account-grid">{accountTypes.map(type=><article className="service-card" key={type}><span className="eyebrow">CONTA DEMONSTRATIVA</span><h2>{accountLabels[type]}</h2><ul>{features[type].map(feature=><li key={feature}>{feature}</li>)}</ul><button className="dark-button" disabled={!!busy||!enabled} onClick={()=>void enter(type)}>{busy===type?'Entrando…':`Entrar como ${accountLabels[type].toLowerCase()}`}</button></article>)}</div>
 {error&&<p role="alert">{error}</p>}<div className="campaign-actions"><Link className="dark-button" href="/cadastro">Criar minha própria conta</Link><Link href="/conta">Já tenho conta</Link><Link href="/">Voltar para a home</Link></div></section>;
}
