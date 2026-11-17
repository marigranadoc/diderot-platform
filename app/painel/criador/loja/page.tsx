import CreatorShopEditor from '../../../../components/CreatorShopEditor';
import {getCatalog} from '../../../../lib/catalog-store';
export const dynamic='force-dynamic';
export default async function CreatorShopSettings(){const {products}=await getCatalog();return <main id="conteudo" className="section"><CreatorShopEditor catalog={products}/></main>;}
