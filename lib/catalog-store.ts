import {createClient} from '@supabase/supabase-js';
import {collections as demoCollections, products as demoProducts, type Product} from './catalog';

export async function getCatalog() {
  if (process.env.DIDEROT_DATA_SOURCE === 'demo') {
    return {collections: demoCollections, products: demoProducts};
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Configuração do catálogo ausente.');
  const client = createClient(url, key, {
    auth: {persistSession: false, autoRefreshToken: false},
    global: {fetch: (input, init) => fetch(input, {...init, cache: 'no-store', signal: AbortSignal.timeout(10000)})},
  });
  const [collectionsResult, productsResult] = await Promise.all([
    client.from('collections').select('slug,name,category,description').order('position'),
    client.from('products').select('slug,name,brand,price,category,collection,kind,color,note').order('position'),
  ]);
  if (collectionsResult.error || productsResult.error) {
    console.error('catalog_read_failed', {collections: collectionsResult.error?.code, products: productsResult.error?.code});
    throw new Error('Não foi possível carregar o catálogo.');
  }
  return {collections: collectionsResult.data as typeof demoCollections, products: productsResult.data as Product[]};
}
