import Link from 'next/link';
import Catalog from '../../components/Catalog';
import {getCatalog} from '../../lib/catalog-store';
export const dynamic = 'force-dynamic';
export default async function Creator(){const {collections,products}=await getCatalog();return <main id="conteudo"><section className="profile"><div className="avatar" aria-hidden="true">C.</div><p className="serif">Curadoria de</p><h1>Clara Martins</h1><p>Moda sem pressa. Beleza no cotidiano. Uma casa com alma.</p><span className="eyebrow">CRIADORA FICTÍCIA · SÃO PAULO COMO CENÁRIO DEMONSTRATIVO</span><a className="dark-button" href="#catalogo">Explore minhas escolhas ↓</a><small>Todos os produtos, marcas e preços desta loja são exemplos.</small></section><nav id="colecoes" className="collection-nav" aria-label="Coleções"><a href="#catalogo" className="selected">Todas as escolhas</a>{collections.map(c=><Link href={`/colecoes/${c.slug}`} key={c.slug}>{c.name}</Link>)}</nav><Catalog products={products}/></main>}
