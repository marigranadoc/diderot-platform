import CampaignExplorer from '../../../components/CampaignExplorer';
import Link from 'next/link';
import ProductPhoto from '../../../components/ProductPhoto';
import {demoCampaigns} from '../../../lib/demo-campaigns';
import {products,money} from '../../../lib/catalog';
export default function Page(){return <main id="conteudo" className="section"><section className="demo-campaigns"><span className="eyebrow">CAMPANHAS</span><h1>Explore campanhas</h1><p>Explore briefings UGC, influencer e híbridos. Inscrições ainda não estão disponíveis.</p><CampaignExplorer/><nav className="campaign-actions" aria-label="Navegação das campanhas"><Link href="/painel/criador">Meu painel de creator</Link><Link href="/painel/marca">Meu painel da marca</Link><Link href="/demo">Acessar outra conta</Link></nav></section></main>;}
