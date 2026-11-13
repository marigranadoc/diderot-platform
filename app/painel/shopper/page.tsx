import ShopperDashboard from '../../../components/ShopperDashboard';
import {getCatalog} from '../../../lib/catalog-store';
export const dynamic='force-dynamic';
export default async function Page(){const {products}=await getCatalog();return <main id="conteudo" className="section"><ShopperDashboard products={products}/></main>;}
