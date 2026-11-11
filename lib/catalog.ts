export const collections = [
  { slug: 'essenciais', name: 'Essenciais do dia a dia', category: 'Moda', description: 'Peças simples, muitas possibilidades.' },
  { slug: 'rituais', name: 'Pequenos rituais', category: 'Beleza', description: 'Uma pausa para cuidar de você.' },
  { slug: 'casa', name: 'Uma casa com alma', category: 'Casa', description: 'Objetos que fazem parte da história.' },
];
export const products = [
  { slug: 'bolsa-oliva', name: 'Bolsa Oliva', brand: 'Estúdio Um', price: 389, category: 'Moda', collection: 'essenciais', kind: 'bag', color: '#74775e', note: 'Gosto do formato leve e do tom que combina com quase tudo.' },
  { slug: 'camisa-linho', name: 'Camisa de linho', brand: 'Casa Clara', price: 249, category: 'Moda', collection: 'essenciais', kind: 'shirt', color: '#d4c6ad', note: 'Uma peça versátil para dias que pedem conforto.' },
  { slug: 'serum-botanico', name: 'Sérum botânico', brand: 'Ritual', price: 129, category: 'Beleza', collection: 'rituais', kind: 'bottle', color: '#986746', note: 'Uma embalagem bonita para ilustrar a coleção de cuidados.' },
  { slug: 'vaso-organico', name: 'Vaso orgânico', brand: 'Barro & Forma', price: 179, category: 'Casa', collection: 'casa', kind: 'vase', color: '#a75e46', note: 'Texturas naturais deixam qualquer cantinho mais acolhedor.' },
  { slug: 'sandalia-trama', name: 'Sandália Trama', brand: 'Estúdio Um', price: 219, category: 'Moda', collection: 'essenciais', kind: 'shoe', color: '#7c543c', note: 'Linhas delicadas, com inspiração nos dias de verão.' },
  { slug: 'creme-essencial', name: 'Creme essencial', brand: 'Ritual', price: 89, category: 'Beleza', collection: 'rituais', kind: 'bottle', color: '#a7aa8d', note: 'Um exemplo de produto para completar os pequenos rituais.' },
  { slug: 'bolsa-areia', name: 'Bolsa Areia', brand: 'Casa Clara', price: 329, category: 'Moda', collection: 'essenciais', kind: 'bag', color: '#b19570', note: 'A textura e a cor trazem um pouco de calma à composição.' },
  { slug: 'vaso-calcario', name: 'Vaso Calcário', brand: 'Barro & Forma', price: 159, category: 'Casa', collection: 'casa', kind: 'vase', color: '#c4b9a3', note: 'Uma forma escultural que funciona com ou sem flores.' },
];
export type Product = typeof products[number];
export const money = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
