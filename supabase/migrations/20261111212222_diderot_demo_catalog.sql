-- Initial catalog, containing only the existing fictional demonstration data.
create table public.collections (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  category text not null check (category in ('Moda', 'Beleza', 'Casa')),
  description text not null,
  position integer not null unique check (position >= 0),
  published boolean not null default false,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.products (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  brand text not null,
  price numeric(12,2) not null check (price >= 0),
  category text not null check (category in ('Moda', 'Beleza', 'Casa')),
  collection text not null references public.collections(slug) on delete restrict,
  kind text not null check (kind in ('bag','shirt','bottle','vase','shoe')),
  color text not null check (color ~ '^#[0-9a-fA-F]{6}$'),
  note text not null,
  position integer not null unique check (position >= 0),
  published boolean not null default false,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);
create index products_collection_idx on public.products(collection);
alter table public.collections enable row level security;
alter table public.products enable row level security;
revoke all on public.collections, public.products from anon, authenticated;
grant select on public.collections, public.products to anon, authenticated;
create policy published_collections on public.collections for select to anon, authenticated
  using (published);
create policy published_products on public.products for select to anon, authenticated
  using (published and exists (select 1 from public.collections c where c.slug = products.collection and c.published));

-- Seed only fictional records; no existing rows are changed.
insert into public.collections ("slug","name","category","description",position,published,is_demo) values
('essenciais','Essenciais do dia a dia','Moda','Peças simples, muitas possibilidades.',0,true,true),
('rituais','Pequenos rituais','Beleza','Uma pausa para cuidar de você.',1,true,true),
('casa','Uma casa com alma','Casa','Objetos que fazem parte da história.',2,true,true);
insert into public.products ("slug","name","brand","price","category","collection","kind","color","note",position,published,is_demo) values
('bolsa-oliva','Bolsa Oliva','Estúdio Um',389,'Moda','essenciais','bag','#74775e','Gosto do formato leve e do tom que combina com quase tudo.',0,true,true),
('camisa-linho','Camisa de linho','Casa Clara',249,'Moda','essenciais','shirt','#d4c6ad','Uma peça versátil para dias que pedem conforto.',1,true,true),
('serum-botanico','Sérum botânico','Ritual',129,'Beleza','rituais','bottle','#986746','Uma embalagem bonita para ilustrar a coleção de cuidados.',2,true,true),
('vaso-organico','Vaso orgânico','Barro & Forma',179,'Casa','casa','vase','#a75e46','Texturas naturais deixam qualquer cantinho mais acolhedor.',3,true,true),
('sandalia-trama','Sandália Trama','Estúdio Um',219,'Moda','essenciais','shoe','#7c543c','Linhas delicadas, com inspiração nos dias de verão.',4,true,true),
('creme-essencial','Creme essencial','Ritual',89,'Beleza','rituais','bottle','#a7aa8d','Um exemplo de produto para completar os pequenos rituais.',5,true,true),
('bolsa-areia','Bolsa Areia','Casa Clara',329,'Moda','essenciais','bag','#b19570','A textura e a cor trazem um pouco de calma à composição.',6,true,true),
('vaso-calcario','Vaso Calcário','Barro & Forma',159,'Casa','casa','vase','#c4b9a3','Uma forma escultural que funciona com ou sem flores.',7,true,true);
