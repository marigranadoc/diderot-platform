import type {SupabaseClient} from '@supabase/supabase-js';
import {accountDestinations,isAccountType} from './account-types';

export class AccountSessionChanged extends Error{}

// A preferred role in user_metadata is not a verified saved profile.
export async function accountDestination(client:SupabaseClient,expectedUser?:string,confirmation=false){
 const identity=await client.auth.getUser();
 if(identity.error||!identity.data.user||expectedUser&&identity.data.user.id!==expectedUser)throw new AccountSessionChanged('Session changed');
 if(confirmation&&!identity.data.user.email_confirmed_at)throw new AccountSessionChanged('Email confirmation required');
 const userId=identity.data.user.id;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{
  const result=await client.from('account_profiles').select('user_id,account_type,onboarding_completed').eq('user_id',userId).abortSignal(controller.signal).maybeSingle();
  if(result.error)throw Error('Profile unavailable');
  const current=await client.auth.getSession();
  if(current.error||current.data.session?.user.id!==userId)throw new AccountSessionChanged('Session changed');
  if(!result.data)return '/onboarding';
  if(result.data.user_id!==userId||!isAccountType(result.data.account_type))throw Error('Invalid profile');
  return result.data.onboarding_completed===true?accountDestinations[result.data.account_type]:'/onboarding';
 }finally{clearTimeout(timer);}
}
