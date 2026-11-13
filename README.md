# Diderot — Creator Commerce + UGC

Plataforma em implementação com Next.js, TypeScript e Supabase. O catálogo público é demonstrativo: uma criadora fictícia, oito produtos e quatro marcas fictícias; fotografias reais ilustrativas. Não há compras, comissões ou pagamentos ativos.

O [PRD](docs/PRD-DIDEROT.md) reúne a referência investigada na ShopMy e a expansão UGC. O [progresso funcional](docs/PROGRESSO-DIDEROT.md) distingue o que foi implementado, testado e ainda falta. Aparência e botões não comprovam conclusão de um fluxo.

## Rodar no Windows

Execute `npm.cmd install`. Configure `.env.local` conforme [integrações](docs/INTEGRACOES.md), depois `npm.cmd run dev` e abra o endereço informado. O catálogo conectado falha explicitamente quando indisponível. Para usar os exemplos sem banco, configure `DIDEROT_DATA_SOURCE=demo`; não há fallback silencioso.

Para a versão compilada, execute `npm.cmd run build` e `npm.cmd start`. Não use dev e start simultaneamente na mesma porta. Ctrl+C encerra o servidor.

## Disponível

- Acesso publicado: [Diderot na Vercel](https://diderot-platform-mari-granado.vercel.app).
- [Experimentar os três tipos de conta](https://diderot-platform-mari-granado.vercel.app/demo): shopper, creator e marca com dados fictícios compartilhados; entrada sem digitar senha. [Regras, auditoria e limites](docs/ACESSO-DEMONSTRACAO.md).
- `/onboarding` e `/conta/perfil`: escolha de espaço inicial, perfil por tipo, revisão e persistência; criação da organização ou perfil profissional vinculados à mesma conta.
- `/painel/shopper`: perfil, interesses, favoritos de conta e navegação ao catálogo.
- `/explorar/campanhas` e `/campanhas/demo/[slug]`: briefings fictícios navegáveis; não recebem candidaturas nem geram contratação.

- `/`: home editorial com busca, curadoria, seleções temáticas, categorias e marcas; filtros levam a resultados reais do catálogo.
- `/criador`, `/colecoes/[slug]` e `/produto/[slug]`: catálogo, filtros, ordenação e detalhe demonstrativo; sem checkout.
- Favoritos de visitante ficam neste navegador entre páginas e reloads. Favoritos de conta usam Supabase e RLS, separados da seleção local. [Comportamento, testes e limites](docs/FAVORITOS.md).
- `/conta`, `/cadastro`, `/recuperar-acesso`: entrada/saída, cadastro e recuperação; entrega de e-mails reais continua pendente de validação.
- `/painel/criador`, `/conta/criador`: painel e perfil profissional privado, UGC/influencer/afiliado na mesma conta, sem requisito de seguidores para UGC.
- `/conta/criador/servicos`, `/conta/criador/portfolio`: gestão privada de serviços e trabalhos por link. Publicação e upload continuam pendentes.

Login real, duas sessões da conta demonstrativa e isolamento de banco têm [evidências anteriores](docs/PAINEL-CREATOR.md). Não equivalem a todas as jornadas concluídas. Administração, notificações de equipe, cargos de edição, aprovação de marca, publicação de campanhas, candidaturas, contratos, entregas, financeiro, aplicativo nativo e círculos pessoais seguem no backlog. Organizações privadas têm o escopo descrito abaixo.

## Verificar

- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd test`: auditoria integral em Chrome, computador/celular, com servidor próprio na porta 3101. Falha enquanto persistirem testes de requisitos não implementados; não usar para afirmar plataforma completa.
- `npm.cmd run test:vitrine`: exclui explicitamente `@pendente`; verifica o escopo implementado e não aprova as jornadas ainda ausentes.

Chrome deve estar instalado; outro executável pode ser informado em `DIDEROT_CHROME_PATH`. A porta 3101 precisa estar livre. Testes de Auth com mocks são identificados; não comprovam banco real. Testes SQL remotos anteriores usam fixtures e ROLLBACK.

## Identidade visual

[Design system e home](docs/DESIGN-SYSTEM-DIDEROT.md) seguem os arquivos fornecidos pela usuária. Reckless TRIAL fica somente na prévia local, fora do repositório; sem os arquivos, os títulos usam Georgia. Publicação com Reckless depende da fonte licenciada definitiva. DM Sans e fotografias incluem fontes/licenças. Não publicar credenciais ou fontes de avaliação.

## Organizações de marca

`/painel/marca` oferece cadastro e edição privados de uma organização por conta, com vínculo de responsável confirmado no banco e leitura restrita a participantes autorizados. Acesso pela home e Minha conta. SQL remoto, duas contas Auth temporárias e navegador móvel com backend real foram verificados; [escopo, evidências e limites](docs/ORGANIZACOES.md). Aprovação comercial, notificações externas, cargos de edição, publicação de campanhas e administração continuam pendentes.

## Equipe e convites

No painel da marca, abra **Equipe e convites** para registrar convites internos, aceitar/recusar na conta destinatária e revogar membros de leitura. Exige e-mail confirmado; validade de sete dias; nenhum e-mail é enviado. [Permissões, testes e limites](docs/EQUIPE-CONVITES.md). Cargos de edição, notificações e administração ainda não estão disponíveis.

## Campanhas em rascunho

No painel da marca, abra **Campanhas em rascunho**. O responsável planeja contexto, datas, modalidades, quantidade de vagas e orçamento estimado por creator; membros consultam. Salvamento privado no Supabase com releitura, proteção de versão e tentativas repetidas. [Escopo, auditoria e pendências](docs/CAMPANHAS-RASCUNHOS.md). Publicação, briefing completo, candidaturas, contratação e financeiro continuam pendentes. Salvar um rascunho não gera cobrança ou convite.

## Publicação e demonstração

O GitHub está ligado ao projeto existente `diderot-platform` na equipe Vercel `mari-granado`, branch `main`. Framework corrigido para Next.js; `vercel.json` preserva build/instalação. Use o domínio principal acima para cadastro/recuperação, conforme as URLs Auth informadas pela usuária. Entrega de e-mail real ainda não foi verificada.

Credenciais demonstrativas ficam somente no servidor em `DIDEROT_DEMO_ACCOUNTS`; `DIDEROT_DEMO_ENABLED` habilita os botões. Nunca publique credenciais ou use `NEXT_PUBLIC_` para elas. As três fixtures persistentes foram expressamente autorizadas; não apagá-las como limpeza automática. A chave usada pelo servidor de demonstração é pública e continua limitada pelo RLS. Fonte Reckless TRIAL continua fora do GitHub; a versão hospedada usa o fallback quando não há fonte licenciada.
