'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';

type Overview={name:string|null;services:number;portfolio:number};
export default function CreatorDashboard(){
 const [overview,setOverview]=useState<Overview|null>(null),[signedIn,setSignedIn]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0);
 const generation=useRef(0),sessionOwner=useRef<string|null|undefined>(undefined);
 useEffect(()=>{
  const token=++generation.current,db=getBrowserClient();
  setLoading(true);setError('');
  if(!db){setError('O acesso por conta não está configurado.');setLoading(false);return;}
  const {data:listener}=db.auth.onAuthStateChange((event,session)=>{
   if(event==='INITIAL_SESSION')sessionOwner.current=session?.user.id??null;
   if(event==='SIGNED_OUT'||(event==='SIGNED_IN'&&session?.user.id!==sessionOwner.current)){
    sessionOwner.current=session?.user.id??null;generation.current++;setOverview(null);setSignedIn(false);setRevision(n=>n+1);
   }
  });
  async function load(){try{
   const {data,error}=await db!.auth.getUser();if(generation.current!==token)return;
   if(error||!data.user){setSignedIn(false);setOverview(null);return;}
   const id=data.user.id;sessionOwner.current=id;setSignedIn(true);
   const [profile,services,portfolio]=await Promise.all([
    db!.from('creator_profiles').select('professional_name').eq('user_id',id).maybeSingle(),
    db!.from('creator_services').select('id',{count:'exact',head:true}).eq('user_id',id),
    db!.from('creator_portfolio_items').select('id',{count:'exact',head:true}).eq('user_id',id),
   ]);
   if(generation.current!==token)return;
   if(profile.error||services.error||portfolio.error||services.count===null||portfolio.count===null)throw Error('Overview failed');
   setOverview({name:profile.data?.professional_name??null,services:services.count,portfolio:portfolio.count});
  }catch{if(generation.current===token){setOverview(null);setError('Não foi possível carregar seu painel. Tente novamente.');}}
  finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;listener.subscription.unsubscribe();};
 },[revision]);
 return <section className="creator-dashboard"><span className="eyebrow">SEU ESPAÇO DE CRIAÇÃO</span><h1>Painel do criador</h1>
 {loading?<p role="status">Carregando seu painel…</p>:error?<><p role="alert">{error}</p><button className="dark-button" onClick={()=>setRevision(n=>n+1)}>Tentar novamente</button></>:!signedIn?<><p>Entre para acessar seu perfil profissional, serviços e portfólio.</p><Link className="dark-button" href="/conta">Entrar na minha conta</Link><Link className="text-link" href="/cadastro">Criar conta</Link></>:overview?<>
 <p>{overview.name?`Olá, ${overview.name}. Organize aqui suas ofertas e seus trabalhos.`:'Comece configurando seu perfil de creator. UGC não exige seguidores.'}</p>
 <div className="creator-dashboard-grid"><article className="service-card"><span className="eyebrow">PERFIL</span><h2>{overview.name??'Seu perfil profissional'}</h2><p>{overview.name?'Seu perfil está salvo e privado.':'Escolha suas modalidades: UGC, influencer e afiliado na mesma conta.'}</p><Link className="dark-button" href="/conta/criador">{overview.name?'Editar perfil':'Configurar perfil'}</Link></article>
 <article className="service-card"><span className="eyebrow">SERVIÇOS</span><h2>{overview.services} {overview.services===1?'serviço cadastrado':'serviços cadastrados'}</h2><p>Organize suas ofertas com preço inicial ou sob orçamento.</p><Link className="dark-button" href="/conta/criador/servicos">Gerenciar serviços</Link></article>
 <article className="service-card"><span className="eyebrow">PORTFÓLIO</span><h2>{overview.portfolio} {overview.portfolio===1?'trabalho cadastrado':'trabalhos cadastrados'}</h2><p>Reúna links dos seus vídeos, fotografias e projetos.</p><Link className="dark-button" href="/conta/criador/portfolio">Gerenciar portfólio</Link></article></div>
 <p>Seu perfil, serviços e portfólio ficam privados nesta etapa. Publicação, campanhas e contratações ainda não estão disponíveis.</p>
 </>:null}<Link className="text-link" href="/conta">Minha conta e saída</Link></section>;
}
