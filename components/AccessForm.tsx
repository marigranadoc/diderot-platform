'use client';
import {useEffect, useId, useState, type FormEvent} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';
import {IntentCards,FlowProgress} from './ExperienceUI';
import {type AccountType} from '../lib/account-types';

export default function AccessForm({mode}: {mode: 'signup' | 'recovery'}) {
  const feedbackId=useId();
  const [stage,setStage]=useState(0);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmation,setConfirmation] = useState('');
  const [accountType,setAccountType] = useState<AccountType>('shopper');
  const [hasSession,setHasSession] = useState(false);
  const [canChangePassword,setCanChangePassword] = useState(false);
  const [busy,setBusy] = useState(false);
  const [checking,setChecking] = useState(mode === 'recovery');
  const [message,setMessage] = useState('');
  const [success,setSuccess] = useState(false);
  const [confirmationEmail,setConfirmationEmail] = useState('');
  const [resending,setResending] = useState(false);
  const [accessInstead,setAccessInstead] = useState(false);
  useEffect(() => {
    if (mode !== 'recovery') return;
    let active = true;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const failed = hash.has('error') || query.has('error');
    if (failed) {
      setMessage('Este link não é válido ou expirou. Solicite um novo link.');
      window.history.replaceState(null,'',window.location.pathname);
    }
    const client = getBrowserClient();
    if (!client) {setMessage('O acesso por conta não está configurado.');setChecking(false);return;}
    const {data} = client.auth.onAuthStateChange((event,session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' && session) {setCanChangePassword(true);setChecking(false);}
      if (event === 'SIGNED_OUT') setCanChangePassword(false);
    });
    client.auth.getUser().then(({data,error}) => {
      if (active) {setCanChangePassword(!error && !!data.user);setChecking(false);}
    }).catch(()=>{if(active){setMessage('Não foi possível verificar o link. Tente novamente.');setChecking(false);}});
    return () => {active=false;data.subscription.unsubscribe();};
  },[mode]);
  const needsPassword = mode === 'signup' || canChangePassword;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy||checking||resending)return;
    const client = getBrowserClient();
    setMessage('');setSuccess(false);
    if (!client) {setMessage('O acesso por conta não está configurado.');return;}
    if (needsPassword && (password.length < 8 || password !== confirmation)) {
      setMessage('Use pelo menos 8 caracteres e confirme a mesma senha.');return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        setConfirmationEmail('');setHasSession(false);setAccessInstead(false);
        const {data,error} = await client.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:`${window.location.origin}/auth/retorno`,data:{account_type:accountType}}});
        if (error) {if(error.code==='user_already_exists'){setAccessInstead(true);setMessage('Entre na sua conta ou recupere a senha para continuar.');return;}setMessage(error.status===429?'Aguarde um momento antes de tentar cadastrar novamente.':error.code==='weak_password'?'Escolha uma senha mais forte, com letras, números e símbolos.':'Não foi possível concluir o cadastro. Confira os dados e tente novamente.');return;}
        if(!data.user){setMessage('Não foi possível confirmar o cadastro. Tente novamente.');return;}
        if(!data.session&&Array.isArray(data.user.identities)&&data.user.identities.length===0){setAccessInstead(true);setSuccess(true);setMessage('Continue pela entrada da sua conta ou recupere a senha.');setPassword('');setConfirmation('');return;}
        setHasSession(!!data.session);setConfirmationEmail(email.trim());setMessage(data.session ? 'Conta criada. Continue para configurar seu perfil.' : 'Confirme seu e-mail para continuar. Procure a mensagem da Diderot na caixa de entrada e no spam. Depois, entre na sua conta.');
      } else if (canChangePassword) {
        const {data,error:identityError} = await client.auth.getUser();
        if (identityError || !data.user) {setCanChangePassword(false);setMessage('Sua sessão expirou. Solicite um novo link.');return;}
        const {error} = await client.auth.updateUser({password});
        if (error) {setMessage('Não foi possível alterar a senha. Tente novamente ou solicite outro link.');return;}
        setMessage('Senha alterada. Você pode voltar à sua conta.');
      } else {
        const {error} = await client.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/recuperar-acesso`});
        if (error) {setMessage('Não foi possível solicitar o link agora. Tente novamente em instantes.');return;}
        setMessage('Solicitação de recuperação recebida. Confira sua caixa de entrada e o spam para continuar.');
      }
      setSuccess(true);setPassword('');setConfirmation('');
    } catch {setMessage('Não foi possível conectar. Tente novamente.');}
    finally {setBusy(false);}
  }
  async function resend(){
    const client=getBrowserClient();if(!client||!confirmationEmail||resending)return;
    setResending(true);setMessage('');
    try{const {error}=await client.auth.resend({type:'signup',email:confirmationEmail,options:{emailRedirectTo:`${window.location.origin}/auth/retorno`}});setSuccess(!error);setMessage(error?'Não foi possível solicitar outra confirmação agora. Aguarde um momento e tente novamente.':'Solicitação de confirmação recebida. Confira sua caixa de entrada e o spam.');}
    catch{setSuccess(false);setMessage('Não foi possível conectar. Tente novamente.');}finally{setResending(false);}
  }
  return <section className="account-card"><span className="eyebrow">SUA CONTA DIDEROT</span>
    <h1>{mode==='signup'?'Criar conta':canChangePassword?'Definir nova senha':'Recuperar acesso'}</h1>
    <p>{mode==='signup'?'Comece pelas suas descobertas. Você também poderá configurar seu perfil de creator, sem exigência de seguidores.':canChangePassword?'Escolha uma senha nova para sua conta.':'Informe seu e-mail para receber um link de recuperação.'}</p>
    {mode==='signup'&&<FlowProgress labels={['Seu espaço','Sua conta']} step={stage}/>}
    {mode==='signup'&&stage===0?<><IntentCards value={accountType} onChange={setAccountType} name="signup-account-type"/><button className="dark-button" type="button" onClick={()=>setStage(1)}>Continuar com este espaço</button></>:<form onSubmit={submit} aria-describedby={message?feedbackId:undefined}>

      {!canChangePassword&&<label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>}
      {needsPassword&&<><label>Nova senha<input type="password" aria-describedby={message&&!success?feedbackId:undefined} aria-invalid={message.includes('confirme a mesma senha')||undefined} autoComplete="new-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirmar senha<input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label></>}
      <button className="dark-button" disabled={busy||checking}>{busy||checking?'Aguarde…':mode==='signup'?'Criar conta':canChangePassword?'Salvar nova senha':'Enviar link de recuperação'}</button>
    </form>}
    {mode==='signup'&&stage===1&&<button type="button" disabled={busy||resending} onClick={()=>setStage(0)}>Voltar e trocar espaço</button>}
    {message&&<p id={feedbackId} role={success?'status':'alert'}>{message}</p>}
    {mode==='signup'&&accessInstead&&<div className="campaign-actions"><Link href="/conta">Entrar na minha conta</Link><Link href="/recuperar-acesso">Recuperar minha senha</Link></div>}
    {mode==='signup'&&confirmationEmail&&<><Link className="dark-button" href={hasSession?'/onboarding':'/conta'}>{hasSession?'Continuar meu cadastro':'Entrar após confirmar meu e-mail'}</Link>{!hasSession&&<button type="button" disabled={resending||busy} onClick={()=>void resend()}>{resending?'Solicitando…':'Reenviar confirmação'}</button>}</>}
    {mode==='signup'&&<Link href="/demo">Conhecer os espaços da Diderot</Link>}
    <Link href="/conta">Voltar para minha conta</Link>
  </section>;
}
