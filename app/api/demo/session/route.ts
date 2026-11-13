import {createClient} from '@supabase/supabase-js';
import {isAccountType} from '../../../../lib/account-types';
export async function POST(request:Request){
 const headers={'Cache-Control':'no-store'};
 if(process.env.DIDEROT_DEMO_ENABLED!=='true')return Response.json({error:'O acesso demonstrativo não está habilitado neste ambiente.'},{status:503,headers});
 // Next may use its internal hostname in request.url. Compare the browser
 // origin with the actual request Host, preserving the request protocol.
 const destination=new URL(request.url);destination.host=request.headers.get('host')??destination.host;
 if(request.headers.get('origin')!==destination.origin)return Response.json({error:'Origem não permitida.'},{status:403,headers});
 try{
  if(Number(request.headers.get('content-length')??0)>1024)return Response.json({error:'Solicitação inválida.'},{status:400,headers});
  const {type}=await request.json();if(!isAccountType(type))return Response.json({error:'Escolha shopper, creator ou marca.'},{status:400,headers});
  const configured=JSON.parse(process.env.DIDEROT_DEMO_ACCOUNTS??'{}')[type];
  if(!configured?.id||configured.email!==`demo.${type}.diderot@example.invalid`||!configured.password)throw Error();
  const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
  const result=await db.auth.signInWithPassword({email:configured.email,password:configured.password});
  if(result.error||!result.data.session||result.data.user.id!==configured.id){if(result.data.session)await db.auth.signOut({scope:'local'});throw Error();}
  return Response.json({access_token:result.data.session.access_token,refresh_token:result.data.session.refresh_token},{headers});
 }catch{return Response.json({error:'Não foi possível abrir a conta demonstrativa agora. Tente novamente.'},{status:503,headers});}
}
