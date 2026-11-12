'use client';
import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent} from 'react';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
const groups=[
 {label:'Para shoppers',items:[['Curadoria','As escolhas da Clara','/#curadoria'],['Círculos','Seleções por tema','/#circulos'],['Categorias','Encontre seu próximo favorito','/#categorias'],['Marcas','Marcas demonstrativas','/#marcas']]},
 {label:'Para creators',items:[['Seu espaço','Perfil, serviços e portfólio','/painel/criador'],['Criar uma conta','Sem exigência de seguidores','/cadastro'],['Minha vitrine','Explore a loja demonstrativa','/criador']]},
 {label:'Para marcas',items:[['Marcas do catálogo','Explore produtos por marca','/#marcas'],['Conheça a curadoria','Moda, beleza e casa','/#curadoria'],['Como funciona','O que está disponível hoje','/#como-funciona']]},
];
export default function SiteHeader(){
 const home=usePathname()==='/',router=useRouter();
 const [open,setOpen]=useState<number|null>(null),[mobile,setMobile]=useState(false),[search,setSearch]=useState(false),[query,setQuery]=useState(''),[scrolled,setScrolled]=useState(false);
 const menuButton=useRef<HTMLButtonElement>(null),closeButton=useRef<HTMLButtonElement>(null),searchInput=useRef<HTMLInputElement>(null);
 const closeMenu=()=>{setMobile(false);menuButton.current?.focus();};
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>30);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 useEffect(()=>{if(!mobile)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';closeButton.current?.focus();return()=>{document.body.style.overflow=old;};},[mobile]);
 useEffect(()=>{if(search)searchInput.current?.focus();},[search]);
 function submit(event:FormEvent){event.preventDefault();setSearch(false);setMobile(false);setOpen(null);router.push(`/criador?busca=${encodeURIComponent(query.trim().slice(0,120))}`);}
 function trap(event:KeyboardEvent<HTMLDivElement>){
  if(event.key==='Escape'){event.preventDefault();closeMenu();return;}if(event.key!=='Tab')return;
  const nodes=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button,input'));const first=nodes[0],last=nodes.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
 return <header className={`site-header${home?' home-nav':''}${home&&scrolled?' is-scrolled':''}`} onMouseLeave={()=>setOpen(null)} onKeyDown={e=>{if(e.key==='Escape'){setOpen(null);setSearch(false);}}}>
  <Link className="logo" href="/">diderot</Link>
  {home?<><nav className="home-desktop-nav" aria-label="Navegação principal">{groups.map((group,index)=><button key={group.label} aria-expanded={open===index} aria-controls={open===index?'home-mega-menu':undefined} onMouseEnter={()=>setOpen(index)} onClick={()=>setOpen(index)}>{group.label} <span aria-hidden="true">⌄</span></button>)}</nav>
  <div className="home-nav-actions"><Link className="login-link" href="/conta">Entrar</Link><Link className="header-cta" href="/cadastro">Criar conta</Link><button className="nav-icon" aria-label="Abrir busca" aria-expanded={search} onClick={()=>{setSearch(!search);setOpen(null);}}>⌕</button><button className="nav-icon mobile-menu-toggle" ref={menuButton} aria-label="Abrir menu" onClick={()=>setMobile(true)}>☰</button></div>
  {open!==null&&<div className="home-mega-menu" id="home-mega-menu">{groups[open].items.map(([title,description,href])=><Link key={title} href={href} onClick={()=>setOpen(null)}><strong>{title}</strong><span>{description}</span></Link>)}</div>}
  {search&&<form className="home-search-panel" onSubmit={submit}><label htmlFor="home-search">Buscar produtos ou marcas</label><input ref={searchInput} id="home-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} maxLength={120}/><button className="dark-button" type="submit">Buscar</button><button type="button" onClick={()=>setSearch(false)}>Fechar busca</button></form>}
  {mobile&&<div className="home-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu de navegação" onKeyDown={trap}><div className="mobile-menu-heading"><span className="logo">diderot</span><button ref={closeButton} aria-label="Fechar menu" onClick={closeMenu}>✕</button></div>{groups.map(group=><section key={group.label}><h2>{group.label}</h2>{group.items.map(([title,,href])=><Link key={title} href={href} onClick={()=>setMobile(false)}>{title}</Link>)}</section>)}<section><h2>Sua conta</h2><Link href="/conta" onClick={()=>setMobile(false)}>Entrar</Link><Link href="/cadastro" onClick={()=>setMobile(false)}>Criar conta</Link><Link href="/recuperar-acesso" onClick={()=>setMobile(false)}>Recuperar acesso</Link></section></div>}
  </>:<><nav aria-label="Navegação principal"><Link href="/criador">Criadora</Link><Link href="/criador#colecoes">Coleções</Link><Link href="/criador#catalogo">Explorar produtos</Link></nav><Link className="header-cta" href="/conta">Minha conta ↗</Link></>}
 </header>;
}
