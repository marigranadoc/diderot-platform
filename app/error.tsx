'use client';
import Link from 'next/link';
export default function ErrorPage({reset}: {reset: () => void}) {
  return <main id="conteudo" className="section"><h1>Não foi possível carregar esta página.</h1><p>Tente novamente em instantes.</p><button className="dark-button" onClick={reset}>Tentar novamente</button><p><Link href="/">Voltar ao início</Link></p></main>;
}
