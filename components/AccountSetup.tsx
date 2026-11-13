'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {getBrowserClient} from '../lib/supabase-browser';
import {accountDestinations,accountLabels,accountProfileColumns,accountTypes,type AccountType} from '../lib/account-types';
import {useAccountProfile} from './useAccountProfile';
const details={shopper:'Descubra curadorias, explore produtos e guarde seus favoritos.',creator:'Organize seu perfil profissional, serviços e portfólio.',brand:'Cadastre sua organização, gerencie equipe e planeje campanhas.'};
const initial={name:'',city:'',state:'',bio:'',modalities:['ugc'],interests:[] as string[],organization:'',website:'',description:''};
export default function AccountSetup({mode='onboarding'}:{mode?:'onboarding'|'profile'}){
 const router=useRouter(),identity=useAccountProfile(),{userId,profile,hint,loading,error,reload}=identity;
 const [type,setType]=useState<AccountType>('shopper'),[form,setForm]=useState(initial),[step,setStep]=useState(0),[contextLoading,setContextLoading]=useState(false),[contextError,setContextError]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const generation=useRef(0),writing=useRef(false);
 const redirect=mode==='onboarding'&&!!profile?.onboarding_completed;
 useEffect(()=>{if(redirect&&profile)router.replace(accountDestinations[profile.account_type]);},[redirect,profile,router]);
 useEffect(()=>{
  const token=++generation.current;setForm(initial);setStep(0);setMessage('');setContextError('');setBusy(false);setType(profile?.account_type??hint);
  if(!userId||loading||error||redirect)return;
  const db=getBrowserClient();setContextLoading(true);
  async function load(){try{
   if(!db)throw Error();const [creator,organization]=await Promise.all([
    db.from('creator_profiles').select('professional_name,bio,city,state,modalities').eq('user_id',userId!).maybeSingle(),
    db.from('organizations').select('name,website,description').eq('owner_user_id',userId!).maybeSingle(),
   ]);if(generation.current!==token)return;if(creator.error||organization.error)throw Error();
   setForm({...initial,name:profile?.display_name??creator.data?.professional_name??'',city:profile?.city??creator.data?.city??'',interests:profile?.interests??[],state:creator.data?.state??'',bio:creator.data?.bio??'',modalities:creator.data?.modalities??['ugc'],organization:organization.data?.name??'',website:organization.data?.website??'',description:organization.data?.description??''});
  }catch{if(generation.current===token)setContextError('Não foi possível consultar as informações do seu cadastro. Tente novamente antes de editar.');}
  finally{if(generation.current===token)setContextLoading(false);}}
  void load();return()=>{generation.current++;};
 },[userId,profile,hint,loading,error,redirect]);
 function validate(){
  if(form.name.trim().length<2)return 'Informe seu nome com pelo menos 2 caracteres.';
  if(type==='creator'&&!form.modalities.length)return 'Escolha pelo menos uma modalidade profissional.';
  if(type==='creator'&&form.state&&!/^[A-Za-z]{2}$/.test(form.state))return 'Use a sigla de duas letras para o estado.';
  if(type==='brand'&&form.organization.trim().length<2)return 'Informe o nome da organização.';
  if(type==='brand'&&form.website){try{const url=new URL(form.website);if(url.protocol!=='https:'||url.username||url.password||/\s/.test(form.website))throw Error();}catch{return 'Informe um site HTTPS válido.';}}
  return '';
 }
 function advance(event:FormEvent<HTMLFormElement>){event.preventDefault();setMessage('');const problem=validate();if(problem){setMessage(problem);return;}setStep(2);}
 async function save(){
  if(!userId||writing.current||busy)return;const problem=validate();if(problem){setMessage(problem);setStep(1);return;}
  const token=generation.current;writing.current=true;setBusy(true);setMessage('');
  try{
   const db=getBrowserClient();if(!db)throw Error();const auth=await db.auth.getUser();if(token!==generation.current)return;if(auth.error||auth.data.user?.id!==userId)throw Error();
   const result=await db.rpc('complete_account_onboarding',{p_type:type,p_name:form.name.trim(),p_city:form.city.trim(),p_state:form.state.trim().toUpperCase(),p_interests:form.interests,p_bio:form.bio.trim(),p_modalities:form.modalities,p_organization_name:form.organization.trim(),p_website:form.website.trim(),p_organization_description:form.description.trim()});
   if(token!==generation.current)return;if(result.error||result.data?.user_id!==userId||result.data?.account_type!==type||!result.data?.onboarding_completed)throw Error();
   const confirmed=await db.from('account_profiles').select(accountProfileColumns).eq('user_id',userId).single();if(token!==generation.current)return;
   if(confirmed.error||confirmed.data?.account_type!==type||!confirmed.data?.onboarding_completed)throw Error();router.push(accountDestinations[type]);
  }catch{if(token===generation.current)setMessage('Não foi possível confirmar seu cadastro. Seus campos continuam aqui. Tente novamente.');}
  finally{writing.current=false;if(token===generation.current)setBusy(false);}
 }
 return <section className="account-setup"><span className="eyebrow">UM ESPAÇO DO SEU JEITO</span><h1>{mode==='profile'?'Meu perfil':'Boas-vindas à Diderot'}</h1><p>Você pode descobrir produtos, criar conteúdo e representar uma marca na mesma conta. Esta escolha organiza seu espaço inicial; os vínculos da equipe continuam protegidos.</p>
 {loading||redirect?<p role="status">Preparando seu espaço…</p>:error?<><p role="alert">{error}</p><button onClick={reload}>Tentar novamente</button></>:!userId?<><p>Entre ou crie uma conta para configurar seu perfil.</p><div className="campaign-actions"><Link className="dark-button" href="/cadastro">Criar minha conta</Link><Link href="/conta">Entrar na minha conta</Link><Link href="/demo">Experimentar sem cadastro</Link></div></>:contextLoading?<p role="status">Carregando suas informações…</p>:contextError?<><p role="alert">{contextError}</p><button onClick={reload}>Tentar novamente</button></>:<>
 <ol className="setup-progress" aria-label="Etapas do cadastro">{['Seu espaço','Seu perfil','Revisão'].map((label,index)=><li key={label} aria-current={step===index?'step':undefined}>{index+1}. {label}</li>)}</ol>
 {step===0?<><fieldset className="role-options"><legend>Como você quer começar?</legend>{accountTypes.map(value=><label className="role-option" key={value}><input type="radio" name="account-type" value={value} checked={type===value} onChange={()=>setType(value)}/><span><strong>{accountLabels[value]}</strong><small>{details[value]}</small></span></label>)}</fieldset><button className="dark-button" onClick={()=>{setStep(1);setMessage('');}}>Continuar</button></>:step===1?<form className="account-card setup-form" onSubmit={advance}>
 <h2>Perfil de {accountLabels[type].toLowerCase()}</h2><label>{type==='creator'?'Nome profissional':'Seu nome'}<input required minLength={2} maxLength={80} autoComplete="name" value={form.name} onChange={event=>setForm(current=>({...current,name:event.target.value}))}/></label><label>Cidade (opcional)<input maxLength={100} value={form.city} onChange={event=>setForm(current=>({...current,city:event.target.value}))}/></label>
 {type==='shopper'&&<fieldset><legend>O que você gosta de descobrir?</legend>{['Moda','Beleza','Casa'].map(interest=><label className="modality-option" key={interest}><input type="checkbox" checked={form.interests.includes(interest)} onChange={event=>setForm(current=>({...current,interests:event.target.checked?[...current.interests,interest]:current.interests.filter(item=>item!==interest)}))}/>{interest}</label>)}</fieldset>}
 {type==='creator'&&<><label>Estado (opcional)<input maxLength={2} placeholder="SP" value={form.state} onChange={event=>setForm(current=>({...current,state:event.target.value}))}/></label><label>Conte sobre seu trabalho<textarea maxLength={1000} value={form.bio} onChange={event=>setForm(current=>({...current,bio:event.target.value}))}/></label><fieldset><legend>Como você trabalha?</legend>{[['ugc','UGC — sem exigência de seguidores'],['influencer','Influencer'],['affiliate','Afiliado']].map(([value,label])=><label className="modality-option" key={value}><input type="checkbox" checked={form.modalities.includes(value)} onChange={event=>setForm(current=>({...current,modalities:event.target.checked?[...current.modalities,value]:current.modalities.filter(item=>item!==value)}))}/>{label}</label>)}</fieldset></>}
 {type==='brand'&&<><label>Nome da organização<input required minLength={2} maxLength={100} autoComplete="organization" value={form.organization} onChange={event=>setForm(current=>({...current,organization:event.target.value}))}/></label><label>Site da marca (opcional)<input type="url" placeholder="https://" maxLength={2048} value={form.website} onChange={event=>setForm(current=>({...current,website:event.target.value}))}/></label><label>Sobre a marca<textarea maxLength={2000} value={form.description} onChange={event=>setForm(current=>({...current,description:event.target.value}))}/></label><p>O cadastro cria seu espaço privado. Não representa aprovação comercial nem inicia pagamentos.</p></>}
 <div className="campaign-actions"><button className="dark-button">Revisar cadastro</button><button type="button" onClick={()=>{setStep(0);setMessage('');}}>Voltar</button></div></form>:<div className="account-card setup-form"><h2>Confira seu perfil</h2><dl><dt>Seu espaço</dt><dd>{accountLabels[type]}</dd><dt>Nome</dt><dd>{form.name}</dd>{form.city&&<><dt>Cidade</dt><dd>{form.city}</dd></>}{type==='brand'&&<><dt>Organização</dt><dd>{form.organization}</dd></>}{type==='creator'&&<><dt>Modalidades</dt><dd>{form.modalities.map(value=>value==='affiliate'?'Afiliado':value.toUpperCase()).join(', ')}</dd></>}{type==='shopper'&&<><dt>Interesses</dt><dd>{form.interests.join(', ')||'Vou explorar livremente'}</dd></>}</dl><p>Seu cadastro será salvo na sua conta. Você poderá editar essas informações depois.</p><div className="campaign-actions"><button className="dark-button" disabled={busy} onClick={()=>void save()}>{busy?'Salvando…':mode==='profile'?'Salvar perfil e continuar':'Concluir cadastro'}</button><button disabled={busy} onClick={()=>setStep(1)}>Voltar e editar</button></div></div>}
 {message&&<p role="alert">{message}</p>}
 </>}<div className="campaign-actions"><Link href="/conta">Minha conta</Link><Link href="/demo">Escolher uma conta demonstrativa</Link></div></section>;
}
