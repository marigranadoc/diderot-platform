'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {getBrowserClient} from '../lib/supabase-browser';
type Invitation={id:string;organization_id:string;organization_name?:string;email:string;status:string;expires_at:string};
type Member={user_id:string;email:string;role:'owner'|'member'};
const statusNames:Record<string,string>={pending:'Pendente',accepted:'Aceito',declined:'Recusado',cancelled:'Cancelado',revoked:'Acesso revogado',expired:'Expirado'};
export default function OrganizationTeam({userId,organizationId,onMembershipChange,onActionStart}:{userId:string;organizationId:string|null;onMembershipChange:(message:string)=>void;onActionStart?:()=>void}){
 const [inbox,setInbox]=useState<Invitation[]|null>(null),[members,setMembers]=useState<Member[]>([]),[sent,setSent]=useState<Invitation[]>([]);
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0),[email,setEmail]=useState('');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[success,setSuccess]=useState(false),[removing,setRemoving]=useState<Member|null>(null);
 const generation=useRef(0),writing=useRef(false);
 useEffect(()=>{
  const token=++generation.current,db=getBrowserClient();setLoading(true);setError('');setInbox(null);setMembers([]);setSent([]);setRemoving(null);
  async function load(){try{
   if(!db)throw Error();
   const results=await Promise.all([db.rpc('organization_team',{p_action:'inbox'}),organizationId?db.rpc('organization_team',{p_action:'overview',p_organization:organizationId}):Promise.resolve(null)]);
   if(token!==generation.current)return;
   const [received,overview]=results;
   if(received.error||!Array.isArray(received.data?.invitations)||overview?.error||(overview&&(!Array.isArray(overview.data?.members)||!Array.isArray(overview.data?.invitations))))throw Error();
   setInbox(received.data.invitations);setMembers(overview?.data.members??[]);setSent(overview?.data.invitations??[]);
  }catch{if(token===generation.current)setError('Não foi possível carregar equipe e convites. Confira sua sessão e a confirmação do e-mail.');}
  finally{if(token===generation.current)setLoading(false);}}
  void load();return()=>{generation.current++;};
 },[userId,organizationId,revision]);
 async function act(action:'invite'|'accept'|'decline'|'cancel'|'remove',invitation?:Invitation,member?:Member){
  const db=getBrowserClient();if(!db||busy||writing.current||loading||error)return;
  setMessage('');setSuccess(false);onActionStart?.();
  if(action==='invite'&&(!email.trim()||email.trim().length>254)){setMessage('Informe um e-mail válido.');return;}
  const token=generation.current;writing.current=true;setBusy(true);
  try{
   const auth=await db.auth.getUser();if(token!==generation.current)return;
   if(auth.error||auth.data.user?.id!==userId)throw Error();
   const result=await db.rpc('organization_team',{p_action:action,p_organization:organizationId,p_invitation:invitation?.id??null,p_email:action==='invite'?email.trim():null,p_member:member?.user_id??null});
   if(token!==generation.current)return;
   const expected={invite:'pending',accept:'accepted',decline:'declined',cancel:'cancelled'};
   if(result.error||(action==='remove'?result.data?.removed!==true:result.data?.invitation?.status!==expected[action])||(invitation&&result.data?.invitation?.id!==invitation.id))throw Error();
   const text={invite:'Convite registrado no painel. Nenhum e-mail foi enviado.',accept:'Convite aceito. Seu acesso de leitura foi confirmado.',decline:'Convite recusado.',cancel:'Convite cancelado.',remove:'Acesso do membro revogado.'}[action];
   setEmail('');setRemoving(null);
   if(action==='accept'||action==='remove')onMembershipChange(text);
   else{setMessage(text);setSuccess(true);setRevision(n=>n+1);}
  }catch{if(token===generation.current)setMessage('Não foi possível confirmar a ação. Atualize a equipe e os convites antes de tentar novamente. O convite pode ter expirado ou seu acesso pode ter mudado.');}
  finally{writing.current=false;if(token===generation.current)setBusy(false);}
 }
 function invite(event:FormEvent<HTMLFormElement>){event.preventDefault();void act('invite');}
 return <section className="organization-team" aria-label="Equipe e convites"><div className="brand-toolbar"><h2>Equipe e convites</h2><button disabled={busy} onClick={()=>{setMessage('');setRevision(n=>n+1);}}>Atualizar equipe e convites</button></div>
 <p>Os convites aparecem aqui para a conta com o e-mail confirmado. Nenhum e-mail é enviado. O acesso concedido é somente de leitura.</p>
 {loading?<p role="status">Carregando equipe e convites…</p>:error?<p role="alert">{error}</p>:<>
 <div className="service-card"><h3>Convites recebidos</h3>{inbox?.length===0?<p>Nenhum convite pendente.</p>:inbox?.map(invitation=><article className="team-invitation" key={invitation.id} aria-label={`Convite de ${invitation.organization_name}`}><h4>{invitation.organization_name}</h4><p>Para {invitation.email} · válido até {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}</p><div className="service-actions"><button disabled={busy} onClick={()=>void act('accept',invitation)}>Aceitar convite</button><button disabled={busy} onClick={()=>void act('decline',invitation)}>Recusar convite</button></div></article>)}</div>
 {organizationId&&<><form className="account-card brand-form" onSubmit={invite}><h3>Convidar para minha organização</h3><label>E-mail da pessoa convidada<input required type="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label><p>O convite expira em 7 dias. A pessoa precisa entrar com esse e-mail confirmado e aceitar no painel.</p><button className="dark-button" disabled={busy}>Registrar convite</button></form>
 <div className="service-card"><h3>Membros da organização</h3>{members.map(member=><div className="team-member" key={member.user_id}><p>{member.email}<br/><small>{member.role==='owner'?'Responsável':'Membro · somente leitura'}</small></p>{member.role==='member'&&member.user_id!==userId&&<button disabled={busy} onClick={()=>setRemoving(member)}>Revogar acesso</button>}</div>)}</div>
 {removing&&<div className="service-card" role="group" aria-label="Confirmar revogação"><p>Revogar o acesso de {removing.email}? A pessoa deixará de consultar os dados da organização.</p><div className="service-actions"><button disabled={busy} onClick={()=>void act('remove',undefined,removing)}>Confirmar revogação</button><button disabled={busy} onClick={()=>setRemoving(null)}>Manter acesso</button></div></div>}
 <div className="service-card"><h3>Convites da organização</h3>{sent.length===0?<p>Nenhum convite registrado.</p>:sent.map(invitation=><div className="team-invitation" key={invitation.id}><p>{invitation.email} · {statusNames[invitation.status]??'Indisponível'}</p>{invitation.status==='pending'&&<button disabled={busy} onClick={()=>void act('cancel',invitation)}>Cancelar convite</button>}</div>)}</div></>}
 </>}
 {message&&<p role={success?'status':'alert'}>{message}</p>}
 </section>;
}
