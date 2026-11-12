import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = { title: 'Diderot — descobertas com intenção', description: 'Loja demonstrativa Diderot: curadoria, coleções e descobertas.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body><a href="#conteudo" className="skip">Pular para o conteúdo</a><div className="demo-bar">PROTÓTIPO DEMONSTRATIVO · pessoas, marcas, produtos e preços fictícios</div><header className="site-header"><Link className="logo" href="/">diderot<span>®</span></Link><nav aria-label="Navegação principal"><Link href="/criador">Criadora</Link><Link href="/criador#colecoes">Coleções</Link><Link href="/criador#catalogo">Explorar produtos</Link></nav><Link className="header-cta" href="/conta">Minha conta <span>↗</span></Link></header>{children}<footer><Link className="logo" href="/">diderot</Link><p>Bom gosto se compartilha.</p><nav aria-label="Rodapé"><Link href="/">Início</Link><Link href="/criador">A criadora</Link><Link href="/criador#catalogo">Produtos</Link><Link href="/painel/criador">Área do criador</Link></nav><small>Demonstração local · sem compras ou comissões.</small></footer></body></html>;
}
