export const shopColumns='id,slug,document,published_document,is_published,revision,published_at';
export const layouts=[{value:'shelves',name:'Prateleiras',description:'Produtos organizados em uma grade.'},{value:'editorial',name:'Editorial',description:'Imagem e recomendações com mais contexto.'},{value:'square_posts',name:'Posts quadrados',description:'Fotos em proporção quadrada.'},{value:'vertical_posts',name:'Posts verticais',description:'Conteúdo em formato retrato.'},{value:'horizontal_posts',name:'Posts horizontais',description:'Imagens em formato paisagem.'}] as const;
export type ShopLayout=typeof layouts[number]['value'];
export type ShopItem={id:string;source_slug:string|null;name:string;brand:string;description:string;category:string;price_cents:number|null;url:string;image_path:string|null;visible:boolean;is_affiliate:boolean};
export type ShopPost={id:string;title:string;caption:string;image_path:string|null;visible:boolean;item_ids:string[]};
export type ShopCollection={id:string;title:string;description:string;layout:ShopLayout;visible:boolean;item_ids:string[];post_ids:string[]};
export type ShopDocument={name:string;bio:string;social_links:{label:string;url:string}[];items:ShopItem[];collections:ShopCollection[];posts:ShopPost[]};
export type PublicShopDocument=ShopDocument&{avatar_path?:string|null};
export type ShopRow={id:string;slug:string;document:ShopDocument;published_document:PublicShopDocument|null;is_published:boolean;revision:number;published_at:string|null};
export const blankShop=(name=''):ShopDocument=>({name,bio:'',social_links:[{label:'Instagram',url:''},{label:'TikTok',url:''},{label:'YouTube',url:''}],items:[],collections:[],posts:[]});
export const blankShopItem=():ShopItem=>({id:crypto.randomUUID(),source_slug:null,name:'',brand:'',description:'',category:'',price_cents:null,url:'',image_path:null,visible:true,is_affiliate:false});
export const blankShopPost=():ShopPost=>({id:crypto.randomUUID(),title:'',caption:'',image_path:null,visible:true,item_ids:[]});
export const blankShopCollection=():ShopCollection=>({id:crypto.randomUUID(),title:'',description:'',layout:'shelves',visible:true,item_ids:[],post_ids:[]});
export function reorder<T>(list:T[],index:number,direction:-1|1):T[]{const next=index+direction;if(next<0||next>=list.length)return list;const copy=[...list];[copy[index],copy[next]]=[copy[next],copy[index]];return copy;}
export function shopMoney(cents:number|null){return cents===null?'Preço não informado':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);}
export function priceCents(value:string){const text=value.trim().replace(',','.');if(!text)return null;if(!/^\d+(\.\d{1,2})?$/.test(text)||Number(text)>1000000)throw Error('Informe um preço válido, com até duas casas decimais.');return Math.round(Number(text)*100);}
export function httpsUrl(value:string){try{const url=new URL(value);return value.length<=2000&&url.protocol==='https:'&&!url.username&&!url.password&&!/\s/.test(value);}catch{return false;}}
export function validateShop(doc:ShopDocument,slug:string){
 if(!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug))throw Error('Escolha um endereço de 3 a 50 caracteres, com letras minúsculas, números e hífens, começando e terminando com letra ou número.');
 if(doc.name.trim().length<2||doc.name.trim().length>80)throw Error('Informe um nome público de 2 a 80 caracteres.');
 if(doc.bio.length>2000||doc.social_links.length>10||doc.items.length>200||doc.collections.length>50||doc.posts.length>100)throw Error('Confira os limites dos campos da loja.');
 for(const social of doc.social_links)if(social.label.trim().length<2||social.label.length>40||(social.url&&!httpsUrl(social.url)))throw Error('Informe o nome da rede social e um link HTTPS válido, sem usuário ou senha no endereço.');
 for(const item of doc.items)if(item.name.trim().length<2||(!item.source_slug&&item.url&&!httpsUrl(item.url)))throw Error('Confira o nome e o link HTTPS dos produtos.');
 for(const item of [...doc.collections,...doc.posts])if(item.title.trim().length<2)throw Error('Informe um título com pelo menos 2 caracteres para cada coleção e post.');
}
export function withoutItem(doc:ShopDocument,id:string):ShopDocument{return {...doc,items:doc.items.filter(x=>x.id!==id),collections:doc.collections.map(x=>({...x,item_ids:x.item_ids.filter(value=>value!==id)})),posts:doc.posts.map(x=>({...x,item_ids:x.item_ids.filter(value=>value!==id)}))};}
export function withoutPost(doc:ShopDocument,id:string):ShopDocument{return {...doc,posts:doc.posts.filter(x=>x.id!==id),collections:doc.collections.map(x=>({...x,post_ids:x.post_ids.filter(value=>value!==id)}))};}
