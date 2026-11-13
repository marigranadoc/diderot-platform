'use client';
import Link from 'next/link';
import {useAccountProfile} from './useAccountProfile';
import {accountDestinations,accountLabels} from '../lib/account-types';
export default function AccountNavigation(){
 const {profile,loading,error,reload}=useAccountProfile();
 return <div className="account-navigation">{loading?<p role="status">Preparando seu espaço…</p>:error?<><p>Não conseguimos consultar seu perfil agora.</p><button onClick={reload}>Atualizar meu perfil</button></>:profile?.onboarding_completed?<><span className="eyebrow">{accountLabels[profile.account_type]}</span><h2>Olá, {profile.display_name}.</h2><Link className="dark-button" href={accountDestinations[profile.account_type]}>Ir para meu painel</Link><Link href="/conta/perfil">Meu perfil e tipo de conta</Link></>:<><p>Escolha como quer usar a Diderot e configure seu perfil.</p><Link className="dark-button" href="/onboarding">Continuar meu cadastro</Link></>}<Link href="/demo">Experimentar outro tipo de conta</Link></div>;
}
