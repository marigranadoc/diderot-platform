import Image from 'next/image';
import type {Product} from '../lib/catalog';
import sources from '../public/products/sources.json';

export default function ProductPhoto({product,hero=false,sizes}:{product:Product;hero?:boolean;sizes?:string}){
 const photo=sources.find(item=>item.slug===product.slug);
 if(!photo)return <div className="product-photo photo-unavailable"><span>Fotografia indisponível</span></div>;
 return <div className={`product-photo${hero?' hero-photo':''}`}>
  <Image src={photo.local} alt={`Fotografia ilustrativa de ${product.name}`} fill sizes={sizes??(hero?'100vw':'(max-width: 768px) 50vw, 33vw')} preload={hero} style={{objectFit:'cover'}}/>
 </div>;
}
