import Link from 'next/link';
import {notFound} from 'next/navigation';
import ProductPhoto from '../../../../components/ProductPhoto';
import {demoCampaigns} from '../../../../lib/demo-campaigns';
import {products,money} from '../../../../lib/catalog';
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,campaign=demoCampaigns.find(item=>item.slug===slug);if(!campaign)notFound();
 return <main id="conteudo" className="section"><article className="demo-campaign-detail"><div><ProductPhoto product={products.find(product=>product.slug===campaign.product)!}/></div><div><span className="eyebrow">BRIEFING · {campaign.type==='hybrid'?'HÍBRIDA':campaign.type.toUpperCase()}</span><h1>{campaign.title}</h1><p>{campaign.brand}</p><section><h2>Sobre a campanha</h2><p>{campaign.description}</p></section><dl><dt>Categoria</dt><dd>{campaign.category}</dd><dt>Vagas planejadas</dt><dd>{campaign.quantity}</dd><dt>Estimativa por creator</dt><dd>{money(campaign.budget/100)}</dd><dt>Prazo</dt><dd>{campaign.deadline.split('-').reverse().join('/')}</dd></dl><h2>Entregáveis</h2><ul>{campaign.deliverables.map(item=><li key={item}>{item}</li>)}</ul><h2>Condições</h2><ul>{campaign.conditions.map(item=><li key={item}>{item}</li>)}</ul><p className="demo-notice">Inscrições ainda não estão disponíveis para esta campanha.</p><div className="campaign-actions"><Link className="dark-button" href="/explorar/campanhas">Ver outras campanhas</Link><Link href="/conta/perfil">Revisar meu perfil</Link><Link href="/demo">Experimentar outra conta</Link></div></div></article></main>;
}
