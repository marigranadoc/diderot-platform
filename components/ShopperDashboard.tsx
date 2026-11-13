'use client';
import Link from 'next/link';
import {money,type Product} from '../lib/catalog';
import ProductPhoto from './ProductPhoto';
import {useFavorites} from './useFavorites';
import {useAccountProfile} from './useAccountProfile';
export default function ShopperDashboard({products}:{products:Product[]}){
 const account=useAccountProfile(),favorites=useFavorites();
 const selected=products.filter(product=>favorites.saved.includes(product.slug));
 return <section className="creator-dashboard shopper-dashboard"><span className="eyebrow">DESCOBERTAS QUE TÊM A SUA CARA</span><h1>Meu espaço de shopper</h1>
 {account.loading?<p role="status">Carregando seu espaço…</p>:account.error?<><p role="alert">{account.error}</p><button onClick={account.reload}>Tentar novamente</button></>:!account.userId?<><p>Entre para ver seu perfil e seus favoritos de conta.</p><Link className="dark-button" href="/conta">Entrar na minha conta</Link></>:<>
 <div className="service-card"><h2>{account.profile?`Olá, ${account.profile.display_name}.`:'Deixe seu espaço do seu jeito.'}</h2><p>{account.profile?.interests.length?`Seus interesses: ${account.profile.interests.join(', ')}.`:'Explore moda, beleza e casa pelas escolhas de quem inspira você.'}</p><Link href={account.profile?'/conta/perfil':'/onboarding'}>{account.profile?'Editar meu perfil':'Completar meu cadastro'}</Link></div>
 <div className="campaign-actions"><Link className="dark-button" href="/criador#catalogo">Explorar produtos</Link><Link href="/#curadoria">Descobrir curadorias</Link><Link href="/demo">Trocar conta demonstrativa</Link></div><h2>Meus favoritos</h2>
 {favorites.busy?<p role="status">Carregando favoritos…</p>:favorites.error?<p role="alert">{favorites.error}</p>:!favorites.signedIn?<p>Confirme sua sessão em Minha conta para consultar seus favoritos privados.</p>:selected.length===0?<p>Você ainda não tem favoritos neste catálogo. Explore os produtos e toque no coração para salvar.</p>:<div className="product-grid">{selected.map(product=><article className="product-card" key={product.slug}><Link href={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`}><ProductPhoto product={product}/><span>{product.brand}</span><h3>{product.name}</h3><p>{money(product.price)}</p></Link><button disabled={favorites.busy} onClick={()=>favorites.toggle(product.slug)}>Remover {product.name} dos favoritos</button></article>)}</div>}
 </>}<Link href="/conta">Minha conta e saída</Link></section>;
}
