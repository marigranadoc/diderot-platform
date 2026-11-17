import {createClient} from '@supabase/supabase-js';
import type {PublicShopDocument} from './creator-shop';

export async function getPublicCreatorShop(slug:string){
 if(!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug))return null;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw Error('A consulta de lojas não está configurada.');
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.timeout(15000)})}});
 const result=await db.rpc('get_public_creator_shop',{p_slug:slug});
 if(result.error)throw Error('Não foi possível carregar esta loja.');
 if(!result.data)return null;
 const document=result.data.document as PublicShopDocument;
 const paths=[...new Set([document.avatar_path,...document.items.map(x=>x.image_path),...document.posts.map(x=>x.image_path)].filter((x):x is string=>!!x))];
 const media:Record<string,string>={};
 if(paths.length){const signed=await db.storage.from('diderot-media').createSignedUrls(paths,900);if(signed.error)throw Error('Não foi possível carregar as fotos desta loja.');for(const entry of signed.data??[])if(entry.path&&entry.signedUrl)media[entry.path]=entry.signedUrl;}
 return {document,media};
}
