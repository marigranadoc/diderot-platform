'use client';
import {useEffect, useState, type FormEvent} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';

export default function AccessForm({mode}: {mode: 'signup' | 'recovery'}) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmation,setConfirmation] = useState('');
  const [canChangePassword,setCanChangePassword] = useState(false);
  const [busy,setBusy] = useState(false);
  const [checking,setChecking] = useState(mode === 'recovery');
  const [message,setMessage] = useState('');
  const [success,setSuccess] = useState(false);
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
    const client = getBrowserClient();
    setMessage('');setSuccess(false);
    if (!client) {setMessage('O acesso por conta não está configurado.');return;}
    if (needsPassword && (password.length < 8 || password !== confirmation)) {
      setMessage('Use pelo menos 8 caracteres e confirme a mesma senha.');return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const {data,error} = await client.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:`${window.location.origin}/conta`}});
        if (error) {setMessage('Não foi possível concluir o cadastro. Confira os dados e tente novamente.');return;}
        setMessage(data.session ? 'Conta criada. Você já pode acessar sua conta.' : 'Se o cadastro puder ser concluído com este e-mail, você receberá as instruções de confirmação. Confira sua caixa de entrada.');
      } else if (canChangePassword) {
        const {data,error:identityError} = await client.auth.getUser();
        if (identityError || !data.user) {setCanChangePassword(false);setMessage('Sua sessão expirou. Solicite um novo link.');return;}
        const {error} = await client.auth.updateUser({password});
        if (error) {setMessage('Não foi possível alterar a senha. Tente novamente ou solicite outro link.');return;}
        setMessage('Senha alterada. Você pode voltar à sua conta.');
      } else {
        const {error} = await client.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/recuperar-acesso`});
        if (error) {setMessage('Não foi possível solicitar o link agora. Tente novamente em instantes.');return;}
        setMessage('Se houver uma conta elegível para este e-mail, você receberá um link para alterar a senha.');
      }
      setSuccess(true);setPassword('');setConfirmation('');
    } catch {setMessage('Não foi possível conectar. Tente novamente.');}
    finally {setBusy(false);}
  }
  return <section className="account-card"><span className="eyebrow">SUA CONTA DIDEROT</span>
    <h1>{mode==='signup'?'Criar conta':canChangePassword?'Definir nova senha':'Recuperar acesso'}</h1>
    <p>{mode==='signup'?'Comece pelas suas descobertas. Você também poderá configurar seu perfil de creator, sem exigência de seguidores.':canChangePassword?'Escolha uma senha nova para sua conta.':'Informe seu e-mail para receber um link de recuperação.'}</p>
    <form onSubmit={submit}>
      {!canChangePassword&&<label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>}
      {needsPassword&&<><label>Nova senha<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirmar senha<input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label></>}
      <button className="dark-button" disabled={busy||checking}>{busy||checking?'Aguarde…':mode==='signup'?'Criar conta':canChangePassword?'Salvar nova senha':'Enviar link de recuperação'}</button>
    </form>
    {message&&<p role={success?'status':'alert'}>{message}</p>}
    <Link href="/conta">Voltar para minha conta</Link>
  </section>;
}
