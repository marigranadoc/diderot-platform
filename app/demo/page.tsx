import DemoAccess from '../../components/DemoAccess';
export const dynamic='force-dynamic';
export default function Page(){return <main id="conteudo" className="section"><DemoAccess enabled={process.env.DIDEROT_DEMO_ENABLED==='true'}/></main>;}
