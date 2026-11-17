import {notFound} from 'next/navigation';
import CreatorShopView from '../../../components/CreatorShopView';
import {getPublicCreatorShop} from '../../../lib/public-creator-shop';
export const dynamic='force-dynamic';
export default async function PublicCreatorShop({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const shop=await getPublicCreatorShop(slug);if(!shop)notFound();
 return <main id="conteudo"><CreatorShopView document={shop.document} media={shop.media}/></main>;
}
