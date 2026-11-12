'use client';
import {useEffect, useRef, useState, type FormEvent} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';

const choices = [{value:'ugc',label:'UGC Creator',detail:'Produzo conteúdo para marcas. Não exige seguidores.'},{value:'influencer',label:'Influencer',detail:'Divulgo conteúdo para a minha audiência.'},{value:'affiliate',label:'Afiliado',detail:'Recomendo produtos e participo de programas de afiliação.'}];
const blank = {professional_name:'',bio:'',city:'',state:'',modalities:[] as string[]};
export default function CreatorOnboarding() {
  const [profile,setProfile] = useState(blank);
  const [userId,setUserId] = useState<string|null>(null);
  const [exists,setExists] = useState(false);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [failed,setFailed] = useState(false);
  const [message,setMessage] = useState('');
  const [success,setSuccess] = useState(false);
  const [retry,setRetry] = useState(0);
  const generation = useRef(0);
  const sessionOwner = useRef<string|null|undefined>(undefined);
  const verifiedOwner = useRef<string|null>(null);
  useEffect(()=>{
    const client=getBrowserClient();
    if(!client)return;
    // Keep this subscription for the component's lifetime. Recreating it while
    // reloading after logout can miss a quick sign-in from another tab.
    const {data:subscription}=client.auth.onAuthStateChange((event,session)=>{
      if(event==='INITIAL_SESSION') sessionOwner.current=session?.user.id??null;
      if(event==='SIGNED_OUT') {sessionOwner.current=null;verifiedOwner.current=null;generation.current++;setUserId(null);setProfile(blank);setExists(false);setSaving(false);setLoading(false);setMessage('');setRetry(n=>n+1);}
      if(event==='SIGNED_IN' && (session?.user.id!==sessionOwner.current||session?.user.id!==verifiedOwner.current)) {
        sessionOwner.current=session?.user.id??null;verifiedOwner.current=null;generation.current++;
        setUserId(null);setProfile(blank);setExists(false);setSaving(false);setLoading(true);setMessage('');
        setRetry(n=>n+1);
      }
    });
    const authStorageKey=`sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}-auth-token`;
    const onStorage=(event:StorageEvent)=>{
      if(event.key!==authStorageKey&&event.key!==null)return;
      let hintedOwner:unknown=null;
      try {hintedOwner=event.newValue?JSON.parse(event.newValue)?.user?.id??null:null;} catch {hintedOwner=undefined;}
      // Storage is only a change signal, never an authenticated identity.
      // A token refresh for the same person must not discard unsaved edits.
      // A broadcast can arrive before this tab can read the saved session.
      // Skip only when getUser has actually confirmed this identity.
      if(hintedOwner===verifiedOwner.current)return;
      verifiedOwner.current=null;generation.current++;setUserId(null);setProfile(blank);setExists(false);
      setSaving(false);setLoading(true);setMessage('');setRetry(n=>n+1);
    };
    window.addEventListener('storage',onStorage);
    return ()=>{generation.current++;subscription.subscription.unsubscribe();window.removeEventListener('storage',onStorage);};
  },[]);
  useEffect(()=>{
    const token=++generation.current;
    const client=getBrowserClient();
    setLoading(true);setFailed(false);setMessage('');setSuccess(false);
    if(!client){setFailed(true);setLoading(false);setMessage('O acesso por conta não está configurado.');return;}
    async function load(){
      try {
        const {data,error}=await client!.auth.getUser();
        if(generation.current!==token)return;
        if(error||!data.user){verifiedOwner.current=null;setUserId(null);return;}
        verifiedOwner.current=data.user.id;
        sessionOwner.current=data.user.id;
        setUserId(data.user.id);
        const result=await client!.from('creator_profiles').select('professional_name,bio,city,state,modalities').eq('user_id',data.user.id).maybeSingle();
        if(generation.current!==token)return;
        if(result.error)throw result.error;
        setExists(!!result.data);setProfile(result.data??blank);
      } catch {if(generation.current===token){setFailed(true);setMessage('Não foi possível carregar seu perfil. Tente novamente.');}}
      finally {if(generation.current===token)setLoading(false);}
    }
    void load();
    return ()=>{generation.current++;};
  },[retry]);
  async function save(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const client=getBrowserClient();
    if(!client||!userId||saving||loading||failed)return;
    setSuccess(false);setMessage('');
    if(profile.professional_name.trim().length<2||!profile.modalities.length){setMessage('Informe seu nome profissional e escolha pelo menos uma modalidade.');return;}
    const token=generation.current;
    setSaving(true);
    try {
      const {data,error}=await client.auth.getUser();
      if(error||data.user?.id!==userId)throw new Error('Session changed');
      const fields={...profile,professional_name:profile.professional_name.trim(),city:profile.city.trim(),state:profile.state.toUpperCase().trim()};
      const result=exists
        ? await client.from('creator_profiles').update(fields).eq('user_id',userId).select('user_id').single()
        : await client.from('creator_profiles').insert({user_id:userId,...fields}).select('user_id').single();
      if(generation.current!==token)return;
      if(result.error||result.data?.user_id!==userId)throw new Error('Save not confirmed');
      setProfile(fields);setExists(true);setSuccess(true);setMessage('Perfil salvo. Suas modalidades ficam vinculadas à mesma conta.');
    } catch {if(generation.current===token)setMessage('Não foi possível salvar. Confira sua sessão e tente novamente.');}
    finally {if(generation.current===token)setSaving(false);}
  }
  return <section className="account-card creator-onboarding"><span className="eyebrow">SEU TRABALHO, SEU JEITO</span><h1>Perfil de creator</h1>
    <p>Escolha uma ou mais formas de trabalhar. Você pode alterá-las depois, sem criar outra conta.</p>
    {loading?<p role="status">Carregando seu perfil…</p>:failed?<button className="dark-button" onClick={()=>setRetry(n=>n+1)}>Tentar novamente</button>:!userId?<><p>Entre na sua conta para configurar seu perfil profissional.</p><Link className="dark-button" href="/conta">Entrar na minha conta</Link><Link href="/cadastro">Criar conta</Link></>:<form onSubmit={save}>
      <label>Nome profissional<input required minLength={2} maxLength={80} autoComplete="nickname" value={profile.professional_name} onChange={e=>setProfile(p=>({...p,professional_name:e.target.value}))}/></label>
      <label>Bio<textarea maxLength={1000} value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))}/></label>
      <div className="form-row"><label>Cidade<input maxLength={100} autoComplete="address-level2" value={profile.city} onChange={e=>setProfile(p=>({...p,city:e.target.value}))}/></label><label>Estado (UF)<input maxLength={2} pattern="[A-Za-z]{2}" autoComplete="address-level1" value={profile.state} onChange={e=>setProfile(p=>({...p,state:e.target.value.toUpperCase()}))}/></label></div>
      <fieldset><legend>Modalidades de atuação</legend>{choices.map(choice=><label className="modality-option" key={choice.value}><input type="checkbox" checked={profile.modalities.includes(choice.value)} onChange={e=>setProfile(p=>({...p,modalities:e.target.checked?[...p.modalities,choice.value]:p.modalities.filter(x=>x!==choice.value)}))}/><span><strong>{choice.label}</strong><small>{choice.detail}</small></span></label>)}</fieldset>
      <p>Seu perfil está privado nesta etapa. Você já pode organizar serviços e trabalhos. Publicação do perfil e campanhas estarão disponíveis nas próximas etapas.</p>
      <button className="dark-button" disabled={saving}>{saving?'Salvando…':'Salvar perfil'}</button>
    </form>}
    {message&&<p role={success?'status':'alert'}>{message}</p>}
    {userId&&exists&&<Link className="dark-button" href="/conta/criador/servicos">Gerenciar meus serviços</Link>}{userId&&exists&&<Link className="dark-button" href="/conta/criador/portfolio">Gerenciar meu portfólio</Link>}<Link href="/conta">Voltar para minha conta</Link>
  </section>;
}
