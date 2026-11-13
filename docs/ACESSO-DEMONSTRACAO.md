# Acesso, perfis e demonstração por tipo de conta

Incremento de 13/11/2026. Endereço principal: https://diderot-platform-mari-granado.vercel.app. A entrada **Experimentar como shopper, creator ou marca**, no topo das páginas, abre `/demo`.

## Para avaliar o app

Em `/demo`, escolha **Entrar como shopper**, **Entrar como creator** ou **Entrar como marca**. O botão autentica uma conta fictícia real do Supabase e abre seu painel. Não exige digitar credenciais. A troca encerra somente a sessão local anterior; outras sessões da pessoa continuam intactas. As contas são compartilhadas entre avaliadores: alterações em perfis, favoritos, serviços ou rascunhos serão vistas por outras pessoas que usem a mesma demonstração. Use somente informações fictícias.

| Tipo | Dados iniciais | Jornada disponível |
|---|---|---|
| Shopper | Ana, São Paulo, interesses em Moda/Beleza/Casa, dois favoritos | Painel → produto → favoritos → perfil → conta/saída/troca |
| Creator | Clara, modalidades UGC/influencer/afiliado, dois serviços, um trabalho por link | Painel → perfil profissional → serviços → portfólio → briefings fictícios → conta/troca |
| Marca | Marina, organização Ateliê Aurora, três campanhas em rascunho | Painel → organização → equipe/convites → consultar/editar rascunhos → perfil → conta/troca |

As identidades têm os e-mails `demo.shopper.diderot@example.invalid`, `demo.creator.diderot@example.invalid` e `demo.brand.diderot@example.invalid`. Não recebem e-mails. Foram criadas especificamente por autorização da usuária; não substituem nem alteram identidades preexistentes. As senhas são aleatórias, não estão no repositório e não são exibidas no navegador. O servidor usa somente a chave pública do Supabase para autenticar essas identidades; não recebe chave administrativa.

Os dados iniciais foram preenchidos por `scripts/seed-demo-data.mjs`, com logins e gravações reais. O script verifica os três e-mails/IDs configurados e insere exemplos ausentes; não deve ser usado como reset automático de alterações feitas pelos avaliadores. A primeira tentativa de serviços rejeitou `fixed`; corrigida para o modo existente `starting`, e a execução completa passou. Nenhum e-mail, publicação de campanha, contratação ou operação financeira foi executado.

## Cadastro e onboarding normais

`/cadastro` apresenta shopper, creator e marca antes de e-mail e senha. A escolha é enviada como preferência `account_type` ao Auth, sem conceder papel administrativo ou vínculo organizacional. Com confirmação de e-mail exigida, o formulário informa o próximo passo e só trata a pessoa como conectada se o provedor retornar sessão. Não há desativação global da confirmação para facilitar a demonstração.

Após entrar, **Continuar meu cadastro** leva a `/onboarding`: 1) escolher o espaço inicial; 2) preencher o perfil específico; 3) revisar e salvar. Shopper informa nome, cidade e interesses; creator informa nome profissional, cidade/UF, bio e modalidades; marca informa nome da pessoa, cidade e nome/site/sobre da organização. UGC não exige seguidores. Salvar conclui o cadastro e encaminha ao painel correspondente. Usuário com onboarding concluído que visita `/onboarding` vai ao seu painel; `/conta/perfil` permite revisar e editar seu perfil/tipo inicial.

O hub `/conta` apresenta o painel preferido e mantém os acessos aos outros contextos. Uma conta pode explorar produtos, trabalhar como creator e possuir/vincular uma organização, sem duplicar sua identidade. A preferência de espaço nunca é usada como autorização. Organizações continuam protegidas pelos vínculos no banco; ser “marca” no formulário não abre organizações alheias. Trocar preferência não apaga perfil profissional, organização, serviços ou favoritos.

## Rotas e ações reais

| Módulo | Rota | Funcionalidade / status real | Evidência | Problemas e correção restante |
|---|---|---|---|---|
| Entrada demo | `/demo` | Login real em três contas fictícias; troca local de sessão | EXP-06, seed e API reais | Dados compartilhados; sem reset automático |
| Cadastro | `/cadastro` | Escolha de tipo + Auth oficial e estado de confirmação | EXP-03 + ONB existente | Entrega/retorno de um e-mail real ainda não verificados |
| Onboarding | `/onboarding` | Três etapas, revisão, persistência e destino por preferência | EXP-01/02, seed/API reais | Não representa habilitação comercial |
| Perfil | `/conta/perfil` | Perfil próprio por tipo, edição e releitura | API real com três identidades; EXP-06 | Sem upload de avatar, publicação ou diretório |
| Shopper | `/painel/shopper` | Nome/interesses próprios, favoritos persistidos, acesso ao catálogo | EXP-06 + favoritos existentes | Favoritos fora do catálogo atual não são exibidos |
| Creator | `/painel/criador` e telas existentes | Dados fictícios persistidos, serviços/portfólio editáveis, navegação entre áreas | Seed real + EXP-06 | Publicação, contratação e entregas pendentes |
| Marca | `/painel/marca` | Organização, equipe e três rascunhos fictícios privados | Seed real + EXP-06 + CAMP/TEAM | Publicação, candidaturas e contratação pendentes |
| Briefings de exemplo | `/explorar/campanhas`, `/campanhas/demo/[slug]` | Três exemplos navegáveis UGC/influencer/híbrido, com entregáveis e condições ilustrativas | EXP-04 | Exemplos estáticos separados dos rascunhos; edição privada não os publica nem sincroniza |
| Admin | Ausente | Não implementado | GAP-04 mantido | Exige papel e autorização próprios |

Os briefings públicos são exemplos explicitamente fictícios. Não há botão de candidatura ou pagamento que simule uma ação concluída. O link para revisar o perfil e a volta às campanhas são reais. Os rascunhos privados da marca podem ser editados e persistidos, mas ainda não têm publicação para creators. As imagens são fotografias ilustrativas já existentes no catálogo.

## Banco, sessões e erros

Migração aplicada: `20261112235032_account_profiles.sql`. Tabela `account_profiles` privada por `auth.uid()`, sem acesso anônimo, sem atualização de proprietário e sem `admin` entre os tipos possíveis. Campos: nome, tipo preferido, cidade, interesses e conclusão do onboarding. O RPC `complete_account_onboarding` é SECURITY INVOKER, exige identidade, usa os grants/RLS existentes e salva o perfil de conta e o contexto profissional/organizacional em uma transação. Repetir setup de marca atualiza sua organização, sem duplicar vínculo/dono. Nenhum trigger novo pode bloquear o cadastro Auth.

A interface verifica a identidade, confirma a sessão local, descarta respostas antigas após saída/troca e trata erro de leitura como erro, sem inventar perfil vazio. Gravação só navega após retorno confirmado e releitura. Erro preserva os campos e a revisão. Metadados do usuário apenas sugerem a escolha inicial do onboarding.

`/api/demo/session` aceita somente POST, três tipos predefinidos e origem correspondente ao Host da solicitação. Identidade retornada deve coincidir com o UUID configurado. Só funciona com `DIDEROT_DEMO_ENABLED=true`; credenciais ficam em `DIDEROT_DEMO_ACCOUNTS`, no servidor, com resposta `Cache-Control: no-store`. São sessões normais limitadas por RLS, não elevação de acesso ou mecanismo de impersonação de usuários reais.

## Integração GitHub → Vercel

Projeto existente `diderot-platform`, equipe `mari-granado`, GitHub `marigranadoc/diderot-platform`, branch de produção `main`. O vínculo já existia. A integração remota retornou lista vazia/403/404 mesmo após autorização da equipe; a consulta autenticada pelo CLI identificou o projeto correto. Nenhum projeto duplicado foi criado.

Corrigidos framework de Other para Next.js, build `npm run build`, instalação `npm ci`, sem diretório estático de saída. `vercel.json` registra esses ajustes no repositório. O commit anterior `0ac0cb891b21a54f06591fa5944e019c6c07d377` foi republicado e ficou Ready, com home/cadastro/conta/painel HTTP 200 e sem login obrigatório na Vercel. Domínio principal para Auth: https://diderot-platform-mari-granado.vercel.app; o alias `diderot-platform-ten.vercel.app` também existe.

A usuária confirmou Site URL no domínio principal e Redirect URLs que incluem esse domínio e seus caminhos. O app usa `/conta` para confirmação e `/recuperar-acesso` para recuperação. Não foi alterada a configuração no painel: o controle de navegador foi encerrado por falha em identificar a URL da janela. Localhost não consta na lista informada; para testar e-mail use o domínio principal ou autorize destinos locais exatos no painel. As contas demonstrativas já confirmadas não dependem desse e-mail.

Credenciais das três fixtures foram enviadas às variáveis sigilosas do projeto, em produção/prévia, somente após autorização explícita da usuária. A revisão automática bloqueou a primeira transferência por exigir consentimento específico; nada foi enviado naquela tentativa. Corrigidos dois problemas do utilitário Windows: separação indevida do parâmetro `upsert` e envio de array onde o CLI exigia objeto. O envio final dos dois objetos passou. Não usar logs/arquivos privados da operação como evidência pública; nenhum segredo deve entrar no GitHub.

## Verificação e limites

`scripts/check-demo-access.mjs` passou com três logins Auth reais: leitura própria, leitura/edição cruzadas negadas, troca de `user_id` e preferência `admin` rejeitadas, configuração inválida sem alteração parcial em creator/marca e bloqueio de visitante. As gravações positivas e releituras estão na execução real de seed. Sessões de verificação encerradas localmente. Evidência `evidencias/experiencias-api.json`.

O SQL adicional `supabase/tests/account-profiles.sql` passou após ajustar a checagem de grant da coluna proprietária e delimitar a tentativa de edição cruzada ao UUID da fixture. Usa duas identidades efêmeras e ROLLBACK: setup shopper/creator/marca, atomicidade, repetição sem duplicar organização, rejeição de admin, RLS cruzado e visitante. Resultado em `evidencias/experiencias-banco.json`. A primeira confirmação desse suplemento expirou sem executar mudanças; a repetição final passou. A verificação por API real acima também cobre isolamento e atomicidade com as fixtures autorizadas. Advisors mantêm o WARN anterior de proteção contra senhas vazadas desativada e INFO intencional de convites sem políticas diretas; nenhuma nova advertência de segurança da tabela de perfis, em `evidencias/experiencias-advisors.json`.

Primeira rodada de interface: 34 aprovados/4 falhas em 38 casos. As quatro falhas expuseram a comparação de origem contra hostname interno do Next, que bloqueava a demonstração. Corrigida a comparação para o Host real, preservando rejeição de origem externa. Relatório inicial preservado. Build/TypeScript aprovados após corrigir o tipo de uma asserção do teste. O painel shopper passou a buscar catálogo ao abrir, em vez de depender de rede no pré-render da compilação. Resultado integral posterior e validação publicada são registrados no progresso.

Auditoria integral: 132 aprovados/4 falhas em 136 casos, 450,0 s, em `evidencias/auditoria-experiencias.json`. As falhas são duas de administrador ausente e duas de seletor DS-01 escolhendo o novo radio em vez de e-mail. Seletor corrigido com a verificação de estilo preservada. Revalidação design/experiências: 22/22 aprovados, 88,5 s, em `evidencias/experiencias-final.json`. Após isso, o botão Sair passou a encerrar somente a sessão local; verificação posterior registrada separadamente. Não anunciar a auditoria integral como 100% aprovada.

Verificação da versão final após a saída local: 20/20 casos Auth/experiências aprovados, 109,6 s, nos dois tamanhos, em `evidencias/experiencias-sessao-final.json`. Build/TypeScript aprovados. API real confirmou outra sessão da mesma conta ainda válida após a primeira sair; navegador verifica o parâmetro de logout local. Comparação exata das três senhas contra 46 assets públicos compilados passou, sem registrar valores em evidência. Publicação e navegação no domínio principal são verificadas separadamente por `scripts/check-deployed-demo.mjs`.
