import {notFound} from 'next/navigation';
import Link from 'next/link';
import {collections} from '../../../lib/catalog';
import Catalog from '../../../components/Catalog';
export default async function Collection({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=collections.find(c=>c.slug===slug);if(!c)notFound();return <main id="conteudo"><section className="collection-intro"><Link href="/criador">← Loja da Clara</Link><span className="eyebrow">COLEÇÃO DEMONSTRATIVA · {c.category}</span><h1>{c.name}</h1><p>{c.description}</p></section><Catalog collection={c.slug}/></main>}
