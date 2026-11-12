# Painel do creator e validação real — 12/11/2026

Rota: `/painel/criador`, acessível por Minha conta → Abrir painel do criador e pelo rodapé Área do criador.

## Implementação

Resumo com nome profissional e contagens de serviços/trabalhos lidas por consultas reais sob RLS. Links diretos para perfil, serviços e portfólio. Visitante recebe entrada de conta; sem perfil, é orientado a configurá-lo. Carregamento, falha e nova tentativa explícitos. Uma falha não é exibida como contagem zero. Troca de conta limpa o resumo anterior. Perfil/conteúdo permanecem privados; não há simulação de receita, seguidores, avaliações ou campanhas.

Isso é um painel de organização dos recursos já disponíveis. Não implementa gestão de produtos/coleções, campanhas, marca ou administração. O teste GAP-02 agora encontra uma entrada de gestão; essa aprovação prova a entrada, não a conclusão de C02.

## Evidências efetivas

- `evidencias/creator-sessao-real.json`: login Supabase real da conta demonstrativa; leitura do perfil; criação de fixtures próprias de serviço e portfólio; releitura/edição por segunda sessão da mesma conta; favorito relido em segunda sessão; remoção das fixtures exatas e logout local. Nenhum registro preexistente foi editado/removido.
- `evidencias/creator-navegador-real.json`: Chrome em viewport móvel, login real pela tela, painel com contagens remotas, acesso a serviços/portfólio e logout que bloqueia o painel. Não houve gravação de conteúdo nesse teste de navegador.
- `evidencias/favorites-isolamento-real.json`: `supabase/tests/favorites.sql` executado no PostgreSQL remoto, com duas identidades temporárias, validação de proprietário, acesso cruzado, spoofing, alteração de dono e acesso anônimo.
- `evidencias/perfil-isolamento-real.json`: `supabase/tests/creator-profiles.sql` executado, validando modalidades, leitura/edição próprias e proibições de outro usuário, dono e anônimo.
- `evidencias/conteudo-isolamento-real.json`: `supabase/tests/creator-content.sql` executado para serviços/portfólio: CRUD próprio, acesso cruzado, spoofing, transferência de dono e leitura anônima.

Os três testes SQL executam `SET LOCAL ROLE authenticated` e claims controladas de duas identidades de fixture, exercendo o RLS do banco; terminam com ROLLBACK. Não equivalem a dois logins Auth end-to-end nem provam entrega de e-mail. O teste API usa uma conta real de demonstração em duas sessões, e não duas pessoas reais.

## Repetir sem expor credenciais

`scripts/check-creator-session.mjs` usa `DIDEROT_TEST_EMAIL` e `DIDEROT_TEST_PASSWORD` do ambiente. Ele grava apenas fixtures com IDs aleatórios e as limpa em finally. Destinado a conta demonstrativa com perfil configurado; não usar contas de negócio.

`scripts/check-creator-browser.mjs` usa as mesmas variáveis e `DIDEROT_TEST_BASE_URL` (origem local, padrão 3002). Exige servidor atualizado e Chrome instalado; não grava dados. Não colocar credenciais em arquivos versionados ou relatórios. Nenhuma senha/token foi incluída nas evidências.

## Pendências que permanecem

Confirmação e recuperação por e-mail real, dois logins reais distintos, upload/publicação de mídia, CRUD de loja, organizações/papéis de marca/admin, campanhas e contratação. O alerta anterior de proteção contra senhas vazadas continua pendente: [orientação Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

As afirmações anteriores de zero usuários e isolamento não executado são histórico: agora existe a conta demonstrativa solicitada pelo usuário e os testes de banco listados acima passaram. Nenhuma migração nova foi necessária para o painel.
