import type { Metadata, Viewport } from 'next';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import './globals.css';
import './experience.css';
import './interactions.css';
export const metadata: Metadata = { title: 'Diderot — descobertas com intenção', description: 'Diderot: curadoria, coleções e descobertas.' };
export const viewport:Viewport={themeColor:'#1f1f1f'};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body><a href="#conteudo" className="skip">Pular para o conteúdo</a><SiteHeader/>{children}<SiteFooter/></body></html>;
}
