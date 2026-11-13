'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {getBrowserClient} from '../lib/supabase-browser';
import {accountProfileColumns,isAccountType,type AccountProfile,type AccountType} from '../lib/account-types';
export function useAccountProfile(){
 const [userId,setUserId]=useState<string|null>(null),[hint,setHint]=useState<AccountType>('shopper'),[profile,setProfile]=useState<AccountProfile|null>(null);
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[version,setVersion]=useState(0);
 const generation=useRef(0),owner=useRef<string|null>(null);
 const reload=useCallback(()=>setVersion(value=>value+1),[]);
 useEffect(()=>{
  const db=getBrowserClient();if(!db)return;
  const invalidate=()=>{generation.current++;owner.current=null;setUserId(null);setProfile(null);setError('');setLoading(true);reload();};
  const {data}=db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'||event==='SIGNED_IN'&&session?.user.id!==owner.current)invalidate();});
  const key=`sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}-auth-token`;
  const storage=(event:StorageEvent)=>{if(event.key===key||event.key===null)invalidate();};
  window.addEventListener('storage',storage);return()=>{generation.current++;data.subscription.unsubscribe();window.removeEventListener('storage',storage);};
 },[reload]);
 useEffect(()=>{
  const token=++generation.current,db=getBrowserClient();setLoading(true);setError('');setProfile(null);setUserId(null);
  async function load(){try{
   if(!db)throw Error();const auth=await db.auth.getUser();if(generation.current!==token)return;
   if(auth.error){if(auth.error.name==='AuthSessionMissingError')return;throw auth.error;}if(!auth.data.user)return;
   const current=await db.auth.getSession();if(generation.current!==token)return;
   if(current.error||current.data.session?.user.id!==auth.data.user.id)return;
   owner.current=auth.data.user.id;setUserId(auth.data.user.id);setHint(isAccountType(auth.data.user.user_metadata?.account_type)?auth.data.user.user_metadata.account_type:'shopper');
   const result=await db.from('account_profiles').select(accountProfileColumns).eq('user_id',auth.data.user.id).maybeSingle();if(generation.current!==token)return;
   if(result.error||result.data&&!isAccountType(result.data.account_type))throw Error();setProfile(result.data as AccountProfile|null);
  }catch{if(generation.current===token)setError('Não foi possível carregar seu perfil. Tente novamente.');}
  finally{if(generation.current===token)setLoading(false);}}
  void load();return()=>{generation.current++;};
 },[version]);
 return {userId,hint,profile,loading,error,reload};
}
