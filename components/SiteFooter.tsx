import Link from 'next/link';
const columns=[
 ['Para creators',[['Área do criador','/painel/criador'],['Meu perfil','/conta/criador'],['Meus serviços','/conta/criador/servicos'],['Meu portfólio','/conta/criador/portfolio']]],
 ['Para marcas',[['Marcas do catálogo','/#marcas'],['Conheça a curadoria','/#curadoria'],['Como funciona','/#como-funciona']]],
 ['Para shoppers',[['Loja da Clara','/criador'],['Círculos e seleções','/#circulos'],['Categorias','/#categorias'],['Minha conta','/conta']]],
 ['Explore',[['Todas as escolhas','/criador#catalogo'],['Essenciais','/colecoes/essenciais'],['Pequenos rituais','/colecoes/rituais'],['Uma casa com alma','/colecoes/casa']]],
 ['Ajuda',[['Sobre esta demonstração','/#sobre-demonstracao'],['Criar conta','/cadastro'],['Entrar','/conta'],['Recuperar acesso','/recuperar-acesso']]],
] as const;
export default function SiteFooter(){return <footer className="site-footer"><div className="footer-columns">{columns.map(([title,links])=><section key={title}><h2>{title}</h2><nav aria-label={title}>{links.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</nav></section>)}</div><div className="footer-brand"><Link className="logo" href="/">diderot</Link><small>© 2026 Diderot · Catálogo demonstrativo · Sem compras ou comissões.</small></div></footer>;}
