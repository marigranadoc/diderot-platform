'use client';
import {useState} from 'react';
import {httpsUrl,shopMoney,type PublicShopDocument,type ShopItem} from '../lib/creator-shop';
import {SignedShopImage} from './ShopImageUpload';
import ProfileAvatarPlaceholder from './ProfileAvatarPlaceholder';
import SocialIcon from './SocialIcon';
import {useFavorites} from './useFavorites';
import {displayShop} from '../lib/presentation';

export default function CreatorShopView({document:source,media={},privatePreview=false}:{document:PublicShopDocument;media?:Record<string,string>;privatePreview?:boolean}){
 const doc={...displayShop(source),avatar_path:source.avatar_path};
 const [section,setSection]=useState('all'),[query,setQuery]=useState(''),[category,setCategory]=useState('Todos'),[sort,setSort]=useState('recentes');
 const favorites=useFavorites();
 const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
 const collections=doc.collections.filter(x=>x.visible),current=collections.find(x=>x.id===section);
 const orderedItems=current?current.item_ids.map(id=>doc.items.find(x=>x.id===id)).filter((x):x is ShopItem=>!!x):doc.items;
 const orderedPosts=current?current.post_ids.map(id=>doc.posts.find(x=>x.id===id)).filter((x):x is typeof doc.posts[number]=>!!x):doc.posts;
 const categories=['Todos',...new Set(orderedItems.filter(x=>x.visible!==false&&x.category).map(x=>x.category))];
 const items=orderedItems.filter(x=>x.visible!==false&&(category==='Todos'||x.category===category)&&normalize(`${x.name} ${x.brand}`).includes(normalize(query))).sort((a,b)=>sort==='recentes'?0:a.price_cents===null&&b.price_cents===null?0:a.price_cents===null?1:b.price_cents===null?-1:sort==='menor'?a.price_cents-b.price_cents:b.price_cents-a.price_cents);
 const posts=orderedPosts.filter(x=>x.visible!==false&&normalize(`${x.title} ${x.caption}`).includes(normalize(query)));
 function image(path:string|null,alt:string,avatar=false){return privatePreview?<SignedShopImage path={path} alt={alt} avatar={avatar}/>:<div className={avatar?'shop-avatar':'shop-image'} aria-label={avatar&&!path?'Foto de perfil não adicionada':undefined} role={avatar&&!path?'img':undefined}>{path&&media[path]?<img src={media[path]} alt={alt}/>:avatar?<ProfileAvatarPlaceholder/>:<span>Imagem indisponível</span>}</div>;}
 function product(item:ShopItem){const href=item.source_slug?`/produto/${item.source_slug}`:httpsUrl(item.url)?item.url:undefined;return <article className="product-card" key={item.id}><div className="product-image"><a href={href} aria-label={`Ver ${item.name}`} target={item.source_slug?undefined:'_blank'} rel="noopener noreferrer nofollow ugc">{item.source_slug?<div className="product-photo"><img src={`/products/${item.source_slug}.webp`} alt={item.name}/></div>:image(item.image_path,item.name)}</a>{item.source_slug&&<button className="favorite" aria-pressed={favorites.saved.includes(item.source_slug)} aria-label={`${favorites.saved.includes(item.source_slug)?'Remover':'Salvar'} ${item.name}`} disabled={favorites.busy} onClick={()=>void favorites.toggle(item.source_slug!)}>{favorites.saved.includes(item.source_slug)?'♥':'♡'}</button>}</div><div className="product-meta"><span>{item.brand}{item.category?` · ${item.category}`:''}</span><a href={href} target={item.source_slug?undefined:'_blank'} rel="noopener noreferrer nofollow ugc"><h3>{item.name}</h3></a><p>{shopMoney(item.price_cents)}</p>{item.is_affiliate&&<small>Link de afiliado</small>}</div></article>;}
 return <div className="own-shop">
  <header className="own-shop-profile">{image(doc.avatar_path??null,`Foto de ${doc.name}`,true)}<p className="serif">Curadoria de</p><h1>{doc.name||'Sua loja'}</h1>{doc.bio&&<p className="own-shop-bio">{doc.bio}</p>}<a className="dark-button" href="#escolhas">Explore minhas escolhas ↓</a>
   <nav className="shop-socials" aria-label="Redes sociais da creator">{doc.social_links.filter(link=>httpsUrl(link.url)).map((link,index)=><a key={index} href={link.url} target="_blank" rel="noopener noreferrer nofollow ugc" title={link.label} aria-label={`${link.label} de ${doc.name} (abre em nova aba)`}><SocialIcon label={link.label} url={link.url}/></a>)}</nav>
  </header>
  <div id="escolhas" className="own-shop-content"><nav className="shop-sections-nav" aria-label="Seções da loja"><button aria-pressed={section==='all'} onClick={()=>{setSection('all');setCategory('Todos');}}>Todas as escolhas</button><button aria-pressed={section==='posts'} onClick={()=>{setSection('posts');setCategory('Todos');}}>Posts</button>{collections.map(item=><button key={item.id} aria-pressed={section===item.id} onClick={()=>{setSection(item.id);setCategory('Todos');}}>{item.title}</button>)}</nav>
   {current?.description&&<p>{current.description}</p>}<div className="catalog-top"><h2>{section==='posts'?'Posts':`Escolhas de ${doc.name}`}</h2>{section!=='posts'&&<span>{favorites.saved.length} {favorites.saved.length===1?'favorito':'favoritos'} {favorites.signedIn?'na sua conta':'neste navegador'}</span>}</div>
   <div className="catalog-controls"><label className="search"><span aria-hidden="true">⌕</span><input aria-label="Buscar nesta loja" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Buscar na loja"/></label>{section!=='posts'&&<><div className="tabs" aria-label="Filtrar por categoria">{categories.map(value=><button key={value} aria-pressed={category===value} onClick={()=>setCategory(value)}>{value}</button>)}</div><label className="sort">Ordenar<select value={sort} onChange={event=>setSort(event.target.value)}><option value="recentes">Seleção da criadora</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option></select></label></>}</div>
   {favorites.error&&<p role="alert">{favorites.error}</p>}
   {section!=='posts'&&<><p className="result-count" aria-live="polite">{items.length} produtos</p><div className="product-grid">{items.map(product)}</div></>}
   {posts.length>0&&<section className="shop-posts-section"><h2>Posts</h2><div className={`own-shop-grid layout-${current?.layout??'shelves'}`}>{posts.map(post=><article className="own-shop-post" key={post.id}>{image(post.image_path,post.title)}<h3>{post.title}</h3><p>{post.caption}</p>{post.item_ids.length>0&&<div className="shop-post-products"><strong>Produtos deste post</strong>{doc.items.filter(item=>item.visible&&post.item_ids.includes(item.id)).map(item=><a key={item.id} href={item.source_slug?`/produto/${item.source_slug}`:httpsUrl(item.url)?item.url:undefined} target={item.source_slug?undefined:'_blank'} rel="noopener noreferrer nofollow ugc">{item.name} ↗</a>)}</div>}</article>)}</div></section>}
   {(section==='posts'?posts.length===0:items.length+posts.length===0)&&<p>Nenhuma escolha encontrada nesta seção.</p>}
  </div>
 </div>;
}
