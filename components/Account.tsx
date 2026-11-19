'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {getBrowserClient} from '../lib/supabase-browser';
import {accountDestination,AccountSessionChanged} from '../lib/account-access';
import {useAccountProfile} from './useAccountProfile';
import AccountNavigation from './AccountNavigation';

export default function Account({confirmation=false}:{confirmation?:boolean}){
 const router=useRouter(),identity=useAccountProfile();
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[working,setWorking]=useState(false),[opening,setOpening]=useState(false),[message,setMessage]=useState(''),[retry,setRetry]=useState(false);
 const generation=useRef(0),writing=useRef(false);
 const [confirmationEmail,setConfirmationEmail]=useState(''),[confirmationNotice,setConfirmationNotice]=useState('');
 const signedIn=!!identity.userId,busy=working||identity.loading;
 useEffect(()=>{
  let active=true;const token=++generation.current;
  const hash=new URLSearchParams(window.location.hash.slice(1)),query=new URLSearchParams(window.location.search);
  const failed=hash.has('error')||query.has('error');
  if(failed){setMessage('O link de confirmação não é válido ou expirou. Entre na sua conta ou solicite outra confirmação pelo cadastro.');window.history.replaceState(window.history.state,'',window.location.pathname);}
  async function finish(){
   if(!confirmation||failed)return;setWorking(true);setOpening(true);
   try{const client=getBrowserClient();if(!client)throw Error();const destination=await accountDestination(client,undefined,true);if(active&&generation.current===token){window.history.replaceState(window.history.state,'',window.location.pathname);router.replace(destination);}}
   catch{if(active&&generation.current===token){window.history.replaceState(window.history.state,'',window.location.pathname);setOpening(false);setRetry(true);setMessage('Não foi possível concluir a confirmação do acesso. Entre na sua conta para continuar.');}}
   finally{if(active&&generation.current===token){setWorking(false);}}
  }
  void finish();return()=>{active=false;generation.current++;};
 },[confirmation,router]);
 async function openAgain(){
  if(writing.current)return;const client=getBrowserClient();if(!client)return;const token=++generation.current;writing.current=true;setWorking(true);setOpening(true);setMessage('');
  try{const destination=await accountDestination(client,identity.userId??undefined,confirmation);if(generation.current===token)router.replace(destination);}
  catch{if(generation.current===token){setOpening(false);setRetry(true);setMessage('Não foi possível abrir seu espaço. Tente novamente ou entre na sua conta.');}}
  finally{writing.current=false;if(generation.current===token)setWorking(false);}
 }
 async function login(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(writing.current||busy)return;const client=getBrowserClient();if(!client){setMessage('O acesso por conta não está configurado.');return;}
  const token=++generation.current;writing.current=true;setWorking(true);setMessage('');setRetry(false);setConfirmationEmail('');setConfirmationNotice('');
  let authenticated=false;
  try{
   const result=await client.auth.signInWithPassword({email:email.trim(),password});if(generation.current!==token)return;
   if(result.error||!result.data.user||!result.data.session){if(result.error?.code==='email_not_confirmed')setConfirmationEmail(email.trim());setMessage(result.error?.code==='email_not_confirmed'?'Confirme seu e-mail antes de entrar.':'Não foi possível entrar. Confira seu e-mail e senha ou tente novamente.');return;}
   authenticated=true;setPassword('');setOpening(true);
   const destination=await accountDestination(client,result.data.user.id,confirmation);if(generation.current===token)router.replace(destination);
  }catch(error){if(generation.current===token){setOpening(false);setRetry(authenticated&&!(error instanceof AccountSessionChanged));if(error instanceof AccountSessionChanged){identity.reload();setMessage('Sua sessão mudou ou expirou. Entre novamente.');}else setMessage(authenticated?'Você entrou, mas não foi possível abrir seu espaço. Tente novamente.':'Não foi possível conectar. Tente novamente.');}}
  finally{writing.current=false;if(generation.current===token)setWorking(false);}
 }
 async function resendConfirmation(){
  if(writing.current||!confirmationEmail)return;const client=getBrowserClient();if(!client)return;const token=++generation.current;writing.current=true;setWorking(true);setMessage('');setConfirmationNotice('');
  try{const result=await client.auth.resend({type:'signup',email:confirmationEmail,options:{emailRedirectTo:`${window.location.origin}/auth/retorno`}});if(generation.current!==token)return;if(result.error)setMessage('Não foi possível solicitar outra confirmação agora. Aguarde um momento e tente novamente.');else setConfirmationNotice('Solicitação de confirmação recebida. Confira sua caixa de entrada e o spam.');}
  catch{if(generation.current===token)setMessage('Não foi possível conectar. Tente novamente.');}
  finally{writing.current=false;if(generation.current===token)setWorking(false);}
 }
 async function logout(){
  if(writing.current)return;const client=getBrowserClient();if(!client)return;const token=++generation.current;writing.current=true;setWorking(true);setMessage('');setRetry(false);setOpening(false);
  try{const {error}=await client.auth.signOut({scope:'local'});if(error&&generation.current===token)setMessage('Não foi possível sair. Tente novamente.');}
  catch{if(generation.current===token)setMessage('Não foi possível conectar. Tente novamente.');}
  finally{writing.current=false;if(generation.current===token)setWorking(false);}
 }
  return <section className="account-card"><span className="eyebrow">SUAS DESCOBERTAS</span><h1>{confirmation?'Seu acesso à Diderot':'Minha conta'}</h1>
    {opening?<p role="status">Verificando sua conta e abrindo seu espaço…</p>:signedIn ? <>{retry&&<button className="dark-button" disabled={busy} onClick={()=>void openAgain()}>Tentar abrir meu espaço</button>}<AccountNavigation/><p>Você está conectado. Os favoritos salvos na loja ficam vinculados à sua conta.</p><Link className="dark-button" href="/criador#catalogo">Explorar e salvar produtos</Link><p><button onClick={logout} disabled={busy}>Sair da conta</button></p></> : <>
      <p>Entre para guardar suas escolhas entre visitas.</p><form onSubmit={login}>
        <label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
        <button className="dark-button" disabled={busy}>{busy?'Aguarde…':'Entrar'}</button>
      </form><Link href="/cadastro">Criar uma conta</Link><Link href="/demo">Conhecer os espaços da Diderot</Link><Link href="/recuperar-acesso">Esqueci minha senha</Link>
    </>}
    {!signedIn&&confirmationEmail&&<button type="button" disabled={busy} onClick={()=>void resendConfirmation()}>Reenviar confirmação</button>}
    {confirmationNotice&&<p role="status">{confirmationNotice}</p>}
    {(message||identity.error)&&<p role="alert">{message||identity.error}</p>}
  </section>;
}
