import Link from 'next/link';
import {notFound} from 'next/navigation';
import ProductPhoto from '../../../../components/ProductPhoto';
import {demoCampaigns} from '../../../../lib/demo-campaigns';
import {products,money} from '../../../../lib/catalog';
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,campaign=demoCampaigns.find(item=>item.slug===slug);if(!campaign)notFound();
 return <main id="conteudo" className="section"><article className="demo-campaign-detail"><div><ProductPhoto product={products.find(product=>product.slug===campaign.product)!}/></div><div><span className="eyebrow">CAMPANHA FICTÍCIA · {campaign.type==='hybrid'?'HÍBRIDA':campaign.type.toUpperCase()}</span><h1>{campaign.title}</h1><p>{campaign.brand}</p><p>{campaign.description}</p><dl><dt>Categoria</dt><dd>{campaign.category}</dd><dt>Vagas ilustrativas</dt><dd>{campaign.quantity}</dd><dt>Estimativa por creator</dt><dd>{money(campaign.budget/100)}</dd><dt>Prazo ilustrativo</dt><dd>{campaign.deadline.split('-').reverse().join('/')}</dd></dl><h2>Entregáveis de exemplo</h2><ul>{campaign.deliverables.map(item=><li key={item}>{item}</li>)}</ul><h2>Condições de exemplo</h2><ul>{campaign.conditions.map(item=><li key={item}>{item}</li>)}</ul><p className="demo-notice">Demonstração para avaliação da navegação. As fotografias são ilustrativas. Não há candidatura, contratação, transferência de direitos ou pagamento por esta página.</p><div className="campaign-actions"><Link className="dark-button" href="/explorar/campanhas">Ver outras campanhas</Link><Link href="/conta/perfil">Revisar meu perfil</Link><Link href="/demo">Experimentar outra conta</Link></div></div></article></main>;
}
