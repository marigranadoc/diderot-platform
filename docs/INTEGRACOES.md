# GitHub e Supabase

Repositório: https://github.com/marigranadoc/diderot-platform

Projeto: https://mbxpwrgfujnjonyxzvfw.supabase.co — nome Diderot, região us-east-1, PostgreSQL 17, ativo em 11/11/2026.

## Integração realizada

Após a conexão ficar disponível, a inspeção confirmou zero tabelas públicas, migrações, usuários Auth e objetos Storage. A migração `20261111212222_diderot_demo_catalog.sql` criou `collections` e `products`, contendo apenas as três coleções e oito produtos fictícios já usados pela vitrine. Nenhum dado real foi alterado.

O arquivo foi inicialmente gerado pela CLI Supabase 3.1.0 e depois alinhado à versão registrada pela aplicação remota via MCP. Não aplicar a mesma migração novamente no projeto existente. Para novos ambientes, o arquivo versionado é a fonte do esquema e seed.

As quatro páginas de aplicação usam `lib/catalog-store.ts` no servidor e consultam a API Supabase. A chave publicável está no `.env.local` ignorado pelo GitHub; nenhuma chave de serviço é usada. Coleções e produtos publicados têm leitura pública com RLS. Visitantes e usuários autenticados não recebem INSERT, UPDATE ou DELETE. Produtos de coleções não publicadas também ficam ocultos.

Falhas de consulta não são substituídas silenciosamente por dados locais: a página apresenta erro com opção de tentar novamente. O modo offline exige `DIDEROT_DATA_SOURCE=demo`; o padrão conectado usa `DIDEROT_DATA_SOURCE=supabase`.

## Reproduzir

1. Instalar dependências com `npm.cmd ci`.
2. Copiar `.env.example` para `.env.local` e preencher a chave publicável no ambiente autorizado. Não usar chave secreta ou service_role.
3. Executar `node scripts/check-database.mjs` para verificar API pública, quantidades, rejeição de escrita e releitura.
4. Executar `npm.cmd run build` e `npm.cmd test` para verificar as telas conectadas. As lacunas de contas e gestão ainda causam falhas explícitas.

O teste de banco é destinado ao catálogo demonstrativo atual (3 coleções/8 produtos). Não é um monitor genérico para um catálogo comercial futuro.

## Verificação de segurança

Consultas SQL com registros temporários e ROLLBACK confirmaram que produtos de coleções não publicadas são invisíveis para anon e authenticated. A role authenticated não tem permissão de UPDATE. O teste pela API confirmou erro PostgreSQL 42501 na tentativa anônima de atualização de um identificador inexistente. A releitura preservou Bolsa Oliva / R$ 389. O advisor de segurança retornou zero alertas após a migração; isso não equivale a auditoria completa de segurança.

## Ainda pendente

Auth, gestão de perfis/papéis, favoritos por conta, CRUD do creator, marcas, campanhas e administração não foram implementados. O catálogo conectado não conclui essas jornadas. Não há deploy do site, checkout, envio de mensagens nem serviços financeiros.

Referências: [changelog](https://supabase.com/changelog.md), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [cliente JavaScript](https://supabase.com/docs/reference/javascript/initializing).
