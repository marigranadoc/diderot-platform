import type {ShopDocument} from './creator-shop';

// Presentation-only substitutions for the original seeded copy. IDs and provenance stay intact.
const copy:Record<string,string>={
 'Criação demonstrativa':'Criação de conteúdo',
 'Campanha inteiramente fictícia para avaliação de cadastro e navegação. Sem inscrições, contratação ou cobrança.':'Produção de conteúdo para apresentar a coleção.',
 'Avaliar a experiência da Diderot':'Apresentar a coleção e suas escolhas.',
 'Clara · demonstração':'Clara Martins',
 'Ana · demonstração':'Ana',
 'Marina · demonstração':'Marina',
 'Ateliê Aurora · demonstração':'Ateliê Aurora',
 'Loja fictícia para avaliar a configuração da Diderot. Produtos e preços de exemplo; nenhuma compra ou comissão ativa.':'Moda sem pressa. Beleza no cotidiano. Uma casa com alma.',
 'Post fictício para experimentar fotos e produtos associados. Nenhuma compra, comissão ou contratação ativa.':'Texturas naturais e escolhas que deixam a casa mais acolhedora.',
 'Produto, marca e preço demonstrativos. Fotografia real ilustrativa.':'Uma escolha para fazer parte do seu dia a dia.',
 'Um exemplo de produto para completar os pequenos rituais.':'Para completar os pequenos rituais de cuidado.',
 'Uma embalagem bonita para ilustrar a coleção de cuidados.':'Uma escolha para sua rotina de cuidados.',
 'Serviço fictício, sem contratação ou pagamento ativo.':'Converse sobre formatos, prazos e condições do serviço.',
 'Projeto ilustrativo. Não representa trabalho comercial realizado para uma marca real.':'Estudo de conteúdo de beleza e fotografia de produto.',
 'Creator fictícia para avaliação da Diderot. Produção de conteúdo sobre moda, beleza e casa.':'Produção de conteúdo sobre moda, beleza e casa.',
 'Marca inteiramente fictícia para avaliar equipe e planejamento de campanhas. Não recebe compras ou pagamentos.':'Curadoria e conteúdo para moda, beleza e casa.',
};
export function displayCopy(value:string){return copy[value]??value.replace(/ · demonstração$/i,'').replace(/ · demo$/i,'');}
export function displayShop(doc:ShopDocument):ShopDocument{return {...doc,name:displayCopy(doc.name),bio:displayCopy(doc.bio),items:doc.items.map(item=>({...item,description:displayCopy(item.description)})),posts:doc.posts.map(post=>({...post,title:displayCopy(post.title),caption:displayCopy(post.caption)}))};}

export function displayRecord<T extends object>(value:T):T{return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,typeof item==='string'?displayCopy(item):item])) as T;}
