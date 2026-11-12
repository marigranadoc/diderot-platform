import type { Metadata, Viewport } from 'next';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import './globals.css';
export const metadata: Metadata = { title: 'Diderot — descobertas com intenção', description: 'Loja demonstrativa Diderot: curadoria, coleções e descobertas.' };
export const viewport:Viewport={themeColor:'#1f1f1f'};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body><a href="#conteudo" className="skip">Pular para o conteúdo</a><div className="demo-bar">PROTÓTIPO DEMONSTRATIVO · pessoas, marcas, produtos e preços fictícios</div><SiteHeader/>{children}<SiteFooter/></body></html>;
}
