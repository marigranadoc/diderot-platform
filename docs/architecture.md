# Arquitetura observada

13/11/2026 · Next.js 16.4.6 App Router, React 19.3.1, TypeScript 7.0.2 estrito, Tailwind 4 e npm/package-lock.json. Versões resolvidas localmente; não substituir por novas versões durante setup. Produto e estado em [PRD](PRD-DIDEROT.md).

## Fronteiras existentes

- `app/`: rotas públicas, conta, painéis e `api/demo/session/route.ts`. App Router sem pasta `src/`; preservar essa organização.
- `components/`: home/catálogo, formulários de acesso, perfil/onboarding, serviços/portfólio, marca/equipe/rascunhos. Parte da interface consulta Supabase diretamente com cliente público e RLS. Não alegar camada de repositório que não existe.
- `lib/`: contratos/dados demonstrativos e helpers; `catalog-store.ts` consulta o catálogo publicado ou usa demo somente quando explicitamente configurado; `supabase-browser.ts` inicializa o cliente de Auth/dados. Erro remoto não vira catálogo demo silencioso.
- `supabase/migrations/`: histórico SQL incremental, RLS e RPCs; perfil/onboarding, organização/equipe e rascunhos possuem operações transacionais. Não recriar tabelas nem reescrever migração aplicada.
- `scripts/` e `tests/`: verificações por módulo, seed explicitamente separado e Playwright. Ler scripts antes de executar: há operações reais, não apenas testes locais.
- `public/`: fotografias locais, fontes permitidas e procedência. Reckless TRIAL está ignorada. `app/design-tokens.css` mantém tokens; `app/globals.css` composição/ajustes.

## Identidade, dados e exposição

Supabase Auth identifica a conta. account_profiles guarda destino/preferência e onboarding, não papéis administrativos. Creator tem perfil/serviços/portfólio privados. Marca possui organização com responsável editor e membro leitor, convites internos e rascunhos/vagas privados. Favorites é por usuário; favoritos de visitante são locais e não são importados automaticamente. Conferir regras específicas nos documentos de [creator](PAINEL-CREATOR.md), [organizações](ORGANIZACOES.md), [equipe](EQUIPE-CONVITES.md), [campanhas](CAMPANHAS-RASCUNHOS.md) e [acesso](ACESSO-DEMONSTRACAO.md).

O endpoint de demo usa credenciais fictícias somente no servidor, não retorna as senhas e não permite cache. Pessoas na demo compartilham os dados dessas três identidades. Não usar essas contas para dados pessoais ou testes destrutivos. Variáveis `NEXT_PUBLIC_*` são públicas; não podem conter segredos ou service_role. Não introduzir novo ORM, banco, provedor de Auth ou logger por copiar um template.

## Operação e lacunas

GitHub main alimenta o projeto Vercel existente. Domínio público, configuração e evidência histórica em [acesso](ACESSO-DEMONSTRACAO.md); setup não publica. Incremento 38 implementa loja própria/publicação no frontend local e banco, com escopo em [LOJA-AFILIADA](LOJA-AFILIADA.md). Catálogo operacional da marca, campanhas completas, candidaturas, contratos, produção, financeiro e admin continuam pendentes.

O modelo futuro está no PRD e no [anexo](TELAS-FLUXOS-SHOPMY.md), explicitamente proposto. Nenhuma tabela, migração ou serviço novo é criado por esta documentação.

## Loja e mídia — incremento 38

`creator_shops` mantém um documento privado por titular e snapshot público separado. Itens/seções/posts têm IDs locais e relações N:N ordenadas validadas no RPC; esta versão não usa tabelas separadas por entidade da loja. Limites de 1 MB/200 itens/50 seções/100 posts tornam explícito o escopo inicial. Versão esperada e recibo protegem gravação atômica/retry. Campos canônicos de itens do catálogo são resolvidos no servidor, separados das recomendações externas pessoais.

`profile_photos` armazena referências por creator/organização. Bucket privado `diderot-media` aceita WebP e usa RLS por proprietário, vínculo de marca ou snapshot efetivamente publicado. `creator_shop_public_media` é fechado ao acesso direto; helpers guardados consultam a associação publicada. `/loja/[slug]` consulta RPC público com chave publicável e assina apenas mídias permitidas por 15 minutos; sem service_role ou cache de documento privado. Remoção de publicação impede novas autorizações, sem revogar arquivos já baixados/URLs ainda válidas.


## Navegação privada e edição de perfil — incremento 40

Layouts de /conta e /painel usam ProfileWorkspace. Identidade usa o hook existente com getUser e account_profiles; a navegação não concede autorização. Creator lê sua referência de profile_photos; marca responsável resolve a própria organização antes da foto. O evento local diderot:profile-photo-changed provoca releitura do avatar, sem carregar tokens/dados no evento. Leitura pendente é descartada ao trocar titular ou desmontar. A foto pública continua no snapshot de creator_shops, atualizado somente por publicação explícita.

AccountSetup mode=profile inicia no formulário e reutiliza complete_account_onboarding com releitura; onboarding conserva escolha/revisão. AccessForm mantém confirmação obrigatória, distingue sessão existente, trata falha e permite auth.resend para o endereço capturado da solicitação. Não usa service_role ou busca de existência de e-mail.

A resposta de signup sem sessão e com identities vazio direciona para entrada/recuperação; user_already_exists também oferece esses caminhos. A mensagem neutra preserva a distinção entre resposta do Auth e entrega de e-mail. Referência: [comportamento de identidade ofuscada no Supabase](https://supabase.com/docs/guides/auth/auth-identity-linking).


## Entrada e retorno de confirmação — incremento 41

accountDestination valida getUser, consulta o perfil do titular com abortSignal e compara getSession depois da leitura. Só retorna caminhos constantes por tipo validado ou /onboarding. Account usa geração para descartar respostas após desmontagem; a consulta também rejeita sessão trocada. A navegação após senha e /auth/retorno compartilha essa resolução, sem executar chamadas Auth dentro de onAuthStateChange. Visita manual a /conta mantém gestão/saída.

DemoAccess mantém exclusão mútua por ref e aborta sua solicitação HTTP pendente ao desmontar ou exceder 20 s. A rota servidor usa fetch Auth com prazo por requisição e Server-Timing sem identificadores. Nenhuma chave administrativa foi acrescentada. Limites dos passos internos de logout/setSession permanecem explícitos em ACESSO-ONBOARDING.
