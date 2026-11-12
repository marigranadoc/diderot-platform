'use client';
import {useEffect, useState, type FormEvent} from 'react';
import Link from 'next/link';
import {getBrowserClient} from '../lib/supabase-browser';

export default function Account() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    if (hash.has('error') || query.has('error')) {
      setMessage('O link de confirmação não é válido ou expirou. Tente entrar ou recuperar seu acesso.');
      window.history.replaceState(null,'',window.location.pathname);
    }
    const client = getBrowserClient();
    if (!client) {setMessage('O acesso por conta ainda não está configurado.'); setBusy(false); return;}
    let active = true;
    client.auth.getUser().then(({data}) => {if (active) {setSignedIn(!!data.user); setBusy(false);}}).catch(() => {if (active) {setMessage('Não foi possível verificar sua sessão.'); setBusy(false);}});
    const {data} = client.auth.onAuthStateChange((_event, session) => {setSignedIn(!!session);});
    return () => {active = false; data.subscription.unsubscribe();};
  }, []);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getBrowserClient();
    if (!client) {setMessage('O acesso por conta ainda não está configurado.'); return;}
    setBusy(true); setMessage('');
    try {
      const {error} = await client.auth.signInWithPassword({email: email.trim(), password});
      if (error) setMessage('Não foi possível entrar. Confira seu e-mail e senha ou tente novamente.');
      else {setPassword(''); setSignedIn(true);}
    } catch {setMessage('Não foi possível conectar. Tente novamente.');}
    finally {setBusy(false);}
  }
  async function logout() {
    const client = getBrowserClient();
    if (!client) return;
    setBusy(true); setMessage('');
    try {
      const {error} = await client.auth.signOut();
      if (error) setMessage('Não foi possível sair. Tente novamente.');
      else setSignedIn(false);
    } catch {setMessage('Não foi possível conectar. Tente novamente.');}
    finally {setBusy(false);}
  }
  return <section className="account-card"><span className="eyebrow">SUAS DESCOBERTAS</span><h1>Minha conta</h1>
    {signedIn ? <><p>Você está conectado. Os favoritos salvos na loja ficam vinculados à sua conta.</p><Link className="dark-button" href="/criador#catalogo">Explorar e salvar produtos</Link><Link href="/conta/criador">Configurar perfil de creator</Link><p><button onClick={logout} disabled={busy}>Sair da conta</button></p></> : <>
      <p>Entre para guardar suas escolhas entre visitas.</p><form onSubmit={login}>
        <label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
        <button className="dark-button" disabled={busy}>{busy?'Aguarde…':'Entrar'}</button>
      </form><Link href="/cadastro">Criar uma conta</Link><Link href="/recuperar-acesso">Esqueci minha senha</Link>
    </>}
    {message&&<p role="alert">{message}</p>}
  </section>;
}
