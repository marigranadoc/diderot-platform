# Publicação na Vercel

Preparação em 17/11/2026. Esta seção inicial não afirma implantação nova.

Projeto existente: diderot-platform, prj_G8nztyaaScl1oZTviX4tTVdUIt3U. Equipe Mari Granado, team_rsLMN5CeW0KbNJHTexG6n7v1. GitHub marigranadoc/diderot-platform, branch main. Domínio público: https://diderot-platform-mari-granado.vercel.app.

O GitHub confirmou main em ee3ff813955ea312f79feec840bbb0827902eb57, sem as melhorias locais dos incrementos 37–41. Status Vercel desse commit aponta ao projeto/equipe esperados. A home pública respondeu 200; /auth/retorno e /loja/clara-demonstracao responderam 404 antes da atualização.

A integração Vercel lista a equipe, mas não encontra o projeto por nome ou ID; CLI em cache não tem credenciais nesta retomada. Não criar projeto duplicado ou trocar equipe. Usar a integração Git já vinculada e verificar status da revisão no GitHub e resposta pública. Nenhuma configuração de ambiente/SMTP foi alterada.

Pacote: comparar hashes de arquivos com main, preservar arquivos remotos não alterados e publicar atomicamente com verificação do head esperado. Excluir .env.local, fontes Reckless TRIAL, node_modules, build, relatórios brutos e sessões. Verificação contra valores das senhas fictícias não encontrou credenciais em arquivos candidatos. Fotografias de produto/fontes OFL existentes permanecem; três capturas fornecidas de referência integram apenas a documentação. Sem binários TRIAL: navegador usa fallback Georgia.

Pré-requisitos funcionais: build/check e regressão local de acesso 58/58 registrados no progresso. Migrações de briefing/loja já constam aplicadas nas evidências anteriores; incluir arquivos SQL no repositório não executa migrações. Financeiro permanece inativo. Testes publicados devem usar somente contas fictícias e leitura, sem criar usuários ou enviar e-mails.

O estado final de commit, implantação, domínio e jornadas será registrado após a publicação. Entrega/clique de e-mail real permanece pendente de homologação.


## Publicação confirmada — 17–18/11/2026

GitHub main atualizado atomicamente para [2a0ca505f8f4f2530a9f7dcf1a4dda02fb44083d](https://github.com/marigranadoc/diderot-platform/commit/2a0ca505f8f4f2530a9f7dcf1a4dda02fb44083d). Integração Git disparou a [implantação Vercel](https://vercel.com/mari-granado/diderot-platform/EgZjXyodwuvq1MDD2zTrxPEFQUGs), status success. As rotas antes 404 passaram a 200 no domínio canônico. Verificação com Chrome no computador e celular: entrada das três contas fictícias, painéis e navegação da creator, loja pública com fotos e redes, campanhas da marca, rejeição de origem externa na API de entrada. [Evidência](evidencias/publicacao-vercel-jornadas.json). Escritas de negócio bloqueadas durante a verificação; zero tentativas. Nenhum envio de e-mail, alteração de dados reais ou financeiro. O script scripts/check-deployed-release.mjs reproduz a verificação. O incremento 43 terá estado de publicação próprio.


## Incremento 43 publicado — 18/11/2026

Código [bbd1c25](https://github.com/marigranadoc/diderot-platform/commit/bbd1c25263e8cd7d56b6d5f642be4fa66c8538cf), [implantação aprovada](https://vercel.com/mari-granado/diderot-platform/E9hHS91W5bc6FonqcsHBYyEYsJ8a). Migração do banco aplicada separadamente antes do frontend. [Conferência pública](evidencias/publicacao-vercel-criacao-jornadas.json) passou com três contas fictícias, computador e celular; inclui + e suas opções, sem salvar/alterar conteúdo. Zero gravações de negócio durante a verificação. Cadastro não enviou e-mail; não realizou upload binário real nem publicou loja durante essa conferência. Não houve mudança de projeto, ambiente ou dados preexistentes.
