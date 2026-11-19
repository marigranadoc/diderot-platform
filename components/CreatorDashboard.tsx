'use client';
import {displayCopy} from '../lib/presentation';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ActionCard,EmptyState,Skeleton} from './ExperienceUI';
import AppIcon from './AppIcon';
import {getBrowserClient} from '../lib/supabase-browser';

type Overview={name:string|null;services:number;portfolio:number;photo:boolean;shop:{slug:string;is_published:boolean;document:{items:unknown[];collections:unknown[]}}|null};
export default function CreatorDashboard(){
 const [overview,setOverview]=useState<Overview|null>(null),[signedIn,setSignedIn]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0);
 const [hideChecklist,setHideChecklist]=useState(false);
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
   const [profile,services,portfolio,shop,photo]=await Promise.all([
    db!.from('creator_profiles').select('professional_name').eq('user_id',id).maybeSingle(),
    db!.from('creator_services').select('id',{count:'exact',head:true}).eq('user_id',id),
    db!.from('creator_portfolio_items').select('id',{count:'exact',head:true}).eq('user_id',id),
    db!.from('creator_shops').select('slug,is_published,document').eq('owner_user_id',id).maybeSingle(),
    db!.from('profile_photos').select('object_path').eq('kind','creator').eq('subject_id',id).maybeSingle(),
   ]);
   if(generation.current!==token)return;
   if(profile.error||services.error||portfolio.error||shop.error||photo.error||services.count===null||portfolio.count===null)throw Error('Overview failed');
   setOverview({name:profile.data?.professional_name?displayCopy(profile.data.professional_name):null,services:services.count,portfolio:portfolio.count,shop:shop.data,photo:!!photo.data?.object_path});
  }catch{if(generation.current===token){setOverview(null);setError('Não foi possível carregar seu painel. Tente novamente.');}}
  finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;listener.subscription.unsubscribe();};
 },[revision]);
 const checklist=overview?[{title:'Completar perfil',done:!!overview.name,href:'/conta/criador'},{title:'Adicionar foto',done:overview.photo,href:'/conta/perfil#foto'},{title:'Configurar loja',done:!!overview.shop,href:'/painel/criador/loja'},{title:'Criar primeira coleção',done:!!overview.shop?.document.collections.length,href:'/painel/criador/loja#collections'},{title:'Adicionar primeiro produto',done:!!overview.shop?.document.items.length,href:'/painel/criador/loja#add-product'}]:[];
 const done=checklist.filter(x=>x.done).length;
 return <section className="creator-dashboard"><span className="eyebrow">SEU ESPAÇO DE CRIAÇÃO</span><h1>{overview?.name?'Olá, '+overview.name+'.':'Seu espaço de criação'}</h1>
 {loading?<Skeleton label="Carregando seu painel…"/>:error?<><p role="alert">{error}</p><button className="dark-button" onClick={()=>setRevision(n=>n+1)}>Tentar novamente</button></>:!signedIn?<EmptyState title="Seu próximo capítulo começa aqui" description="Entre para organizar sua loja, seus serviços e seu portfólio." icon="store"><Link className="dark-button" href="/conta">Entrar na minha conta</Link><Link className="text-link" href="/cadastro">Criar conta</Link></EmptyState>:overview?<>
 <header className="ux-dashboard-hero">{!overview.name&&<h2>Vamos criar seu espaço?</h2>}<p>Suas escolhas, seu trabalho e suas próximas oportunidades, em um só lugar.</p><div className="campaign-actions"><Link className="dark-button" href={overview.name?'/painel/criador/loja#add-product':'/conta/criador'}>{overview.name?'Adicionar produto':'Configurar meu perfil'}</Link>{overview.shop?.is_published?<Link className="text-link" href={'/loja/'+overview.shop.slug}>Visualizar minha loja</Link>:<Link className="text-link" href="/painel/criador/loja">Gerenciar minha loja</Link>}</div></header>
 {!hideChecklist&&<section className="ux-checklist" aria-label="Prepare seu espaço"><h2>Prepare seu espaço</h2><p>{done} de {checklist.length} passos concluídos</p><progress aria-label="Configuração do espaço" max={checklist.length} value={done}/><ul>{checklist.map(x=><li key={x.title}><Link href={x.href}><AppIcon name={x.done?'check':'arrow'}/><span>{x.title}</span><small>{x.done?'Concluído':'Começar'}</small></Link></li>)}</ul>{done===checklist.length&&<button type="button" onClick={()=>setHideChecklist(true)}>Ocultar checklist concluído</button>}</section>}
 <div className="ux-actions-grid"><ActionCard href="/painel/criador/loja" title="Minha loja" description="Personalize sua vitrine e organize suas escolhas." detail={overview.shop?.is_published?'Publicada':overview.shop?'Rascunho salvo':'Comece com sua primeira escolha'} icon="store"/><ActionCard href="/painel/criador/loja#products" title="Meus produtos" description="Adicione, edite e reutilize suas recomendações." icon="package" detail={overview.shop?overview.shop.document.items.length+' produtos':'Sua curadoria começa aqui'}/><ActionCard href="/painel/criador/loja#collections" title="Coleções" description="Reúna produtos em seleções com a sua assinatura." icon="layers"/><ActionCard href="/explorar/campanhas" title="Explorar oportunidades" description="Conheça briefings e condições. Inscrições ainda indisponíveis." icon="briefcase"/><ActionCard href="/conta/criador/portfolio" title={overview.portfolio+' '+(overview.portfolio===1?'trabalho cadastrado':'trabalhos cadastrados')} description="Reúna os links dos seus trabalhos no portfólio." icon="image"/><ActionCard href="/conta/criador/servicos" title={overview.services+' '+(overview.services===1?'serviço cadastrado':'serviços cadastrados')} description="Apresente suas ofertas, com preço inicial ou sob orçamento." icon="briefcase"/></div>
 <div className="campaign-actions"><Link href="/painel/criador/loja">Gerenciar minha loja</Link><Link href="/conta/criador/portfolio">Gerenciar portfólio</Link><Link href="/conta/criador/servicos">Gerenciar serviços</Link><Link href="/conta/perfil">Editar meu perfil</Link></div>
 </>:null}<Link className="text-link" href="/conta">Minha conta e saída</Link></section>;
}
