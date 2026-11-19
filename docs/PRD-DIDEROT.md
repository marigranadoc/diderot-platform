# PRD Diderot — produto, implementação e próximos passos

**Versão:** 1.11 — reformulação UX/UI em revisão · **Atualizado em:** 19/11/2026 · **Base de implementação:** incrementos 26–44, nos ambientes e limites de suas evidências; [plano de lançamento do MVP](PLANO-LANCAMENTO-MVP.md) e [mapa de telas e fluxos](TELAS-FLUXOS-SHOPMY.md).

**Estado:** documento de referência para desenvolvimento. O estado implementado está documentado; as decisões de produto propostas estão identificadas e ainda precisam ser validadas. Não representa aprovação para lançamento.

**Diretriz incorporada nesta versão:** expansão fornecida pelo usuário em [Prompt Master — UGC Marketplace + Creator Commerce](REFERENCIA-EXPANSAO-UGC.md), preservado integralmente como fonte. As seções 16–25 convertem essa diretriz em requisitos, estados, critérios de aceite e plano incremental. UGC é um módulo nativo e obrigatório do escopo-alvo, não uma capacidade comprovada pelo REA nem já implementada. A expansão das seções 16–25 preserva requisitos propostos; a entrega atual de UX/UI é descrita separadamente na seção 44 e não comprova os módulos de negócio futuros.

**Base publicada verificada:** [bbd1c25](https://github.com/marigranadoc/diderot-platform/commit/bbd1c25263e8cd7d56b6d5f642be4fa66c8538cf), incluindo o incremento 43. Build, SQL isolado e 22/22 testes da loja aprovados. Jornadas de leitura das três contas fictícias e menu de criação aprovados no domínio público, computador/celular, sem gravações de negócio. [Evidência publicada](evidencias/publicacao-vercel-criacao-jornadas.json).

**Como ler:** estado consolidado nas seções 3, 5, 7 e 9; regras do marketplace UGC nas seções 16–25; execução histórica nas seções 26–34; referência e conciliações na seção 35; setup na 36; briefing novo na 37 e loja/fotos/redes na 38; [plano de lançamento](PLANO-LANCAMENTO-MVP.md). [Telas/fluxos](TELAS-FLUXOS-SHOPMY.md) e [fonte preservada](REFERENCIA-NAVEGACAO-SHOPMY.md).

## 1. Visão e objetivo

A Diderot será uma plataforma de descoberta de produtos por curadoria de pessoas, conectando shoppers, creators e marcas. O shopper deve encontrar escolhas relevantes, conhecer quem recomenda, organizar favoritos e acessar o varejista. O creator deve administrar sua presença e suas seleções. A marca deve encontrar creators e acompanhar parcerias. A administração deve controlar acesso, aprovações e moderação.

A plataforma também será um marketplace de produção UGC: marcas poderão contratar conteúdo para seus próprios canais, sem exigir audiência ou publicação nas redes do criador. Produção, divulgação e afiliação coexistirão na mesma conta e arquitetura, com contratos, entregas, direitos de uso e remunerações discriminados. UGC não é sinônimo de influencer marketing.

A referência de experiência é a ShopMy, conforme evidências públicas coletadas pelo REA. A intenção é aproximar linguagem visual, organização da informação e fluxos observados, preservando a identidade Diderot. O levantamento não acessou áreas privadas nem comprovou todos os processos internos da referência. Não há base para afirmar clonagem integral ou equivalência funcional de 100%.

O objetivo imediato é transformar a vitrine demonstrativa já existente em um produto com identidade, persistência e autorização verificadas. A prioridade é concluir jornadas reais, não apenas acrescentar telas.

### Resultados esperados

| Público | Necessidade | Resultado que o produto deve entregar |
|---|---|---|
| Shopper | Descobrir e reencontrar recomendações | Encontrar produto, entender a curadoria, salvar e recuperar escolhas em outra sessão |
| Creator | Organizar e publicar sua curadoria | Editar sua loja, coleções e itens; conferir a versão pública após salvar |
| Marca | Encontrar parceiros e acompanhar ações | Descobrir creators, criar oportunidades e consultar resultados com origem identificada |
| Administrador | Operar a plataforma com controle | Revisar candidaturas e conteúdo, aplicar decisões autorizadas e consultar histórico |

## 2. Fontes e força da evidência

Neste documento, **observado** significa que um elemento ou estado foi visto. Não significa que sua operação foi concluída. **Declarado** significa que a capacidade foi apresentada publicamente pela referência, sem execução autenticada. **Proposto** significa uma decisão para a Diderot, não uma descoberta sobre o backend da ShopMy.

| Fonte | Conteúdo | O que permite afirmar | Limite |
|---|---|---|---|
| E0 — [análise visual e fluxos](../ANALISE-SHOPMY.md) | Inicial, loja pública, busca aberta, produto e celular | Estrutura, aparência e estados listados na captura | Busca com termos, compra e persistência não executadas |
| E1 — [REA público](evidencias/rea-publico.json) | `/home`, `/home/creators`, `/home/brands`, `/apply/creator` | Descoberta pública, comunicação para creators/marcas e primeira etapa de candidatura | Declarações sobre gestão, afiliados e campanhas não comprovam fluxos privados |
| E2 — [REA formulários](evidencias/rea-formularios.json) | Seleção Shopper/Creator/Brand e login | Seleção de perfil; campos Email/Password; recuperação de acesso | Nenhum envio ou autenticação; Request Demo abriu seleção de perfil, não comprovou pedido de demo |
| E3 — [REA shopper móvel](evidencias/rea-shopper-mobile.json) | `/shop/my/circles` e `/shop/my/taste`, 390 × 844 | Estado vazio de grupos e orientação para favoritar 25 produtos | Criação de grupo e geração de perfil não executadas; regra de 25 itens não adotada pela Diderot |
| D1 — [referência de requisitos](PRD-DIDEROT-REFERENCIA.md) | IDs S/A/C/B/M/T e critérios originais | Rastreabilidade dos requisitos desta auditoria | É documento derivado, não PRD oficial da ShopMy |
| D2 — [progresso e auditoria](PROGRESSO-DIDEROT.md) | Código, testes, falhas e correções | Histórico de implementação e verificação | As tabelas iniciais precedem as integrações posteriores |
| D3 — [integrações](INTEGRACOES.md) | GitHub, Supabase, migrações e permissões | Configuração realizada e limites dos testes | Não comprova prontidão de produção |
| U0 — [diretriz UGC do usuário](REFERENCIA-EXPANSAO-UGC.md) | Marketplace, modalidades, campanhas/vagas, contratação, produção, direitos, financeiro e reputação | Requisitos obrigatórios do escopo-alvo Diderot | Não é inspeção da ShopMy nem evidência de implementação; exemplos monetários são ilustrativos |
| N1 — [referência de navegação fornecida em 13/11](REFERENCIA-NAVEGACAO-SHOPMY.md) | Relato de telas de creator em dois vídeos públicos; cadastro, marcas, produtos e operação propostos | Detalhar gestão de seções, adicionar/editar produto, seleção de itens e escopo Diderot | Fonte secundária fornecida pela usuária; vídeos/prints individuais não reanalisados nesta revisão; marcas/admin/onboarding não demonstrados pelos vídeos |
| N2 — [catálogo consolidado de telas e fluxos](TELAS-FLUXOS-SHOPMY.md) | E0–E3, N1, captura da home e correspondência Diderot | IDs de telas/fluxos, estados, permissões, dados, aceite e dependências | Especificação de destino não equivale a implementação nem a observação direta de todas as telas |

Esta consolidação reutiliza as capturas existentes. Não apresenta uma nova inspeção da ShopMy em 12/11/2026. Evidência pública capturada não revela código privado, algoritmo de recomendação, cálculo de comissão, políticas internas ou telas administrativas.

## 3. O que já foi entregue

### 3.1 Produto e interface

- Aplicação Next.js, React, TypeScript e Tailwind CSS, com layout responsivo.
- Inicial editorial, perfil público da criadora fictícia Clara Martins, três coleções e oito páginas de produto.
- Busca por nome/marca tolerante a acentos, caixa e espaços; filtros Moda/Beleza/Casa; ordenação por seleção e preço.
- Detalhe com fotografia local ilustrativa, marca, preço fictício, nota da criadora, navegação e informação de disponibilidade demonstrativa; oito produtos continuam fictícios.
- Estado vazio com limpeza de filtros, página 404 com retorno, foco visível e verificações pontuais de teclado.
- `/conta`, `/cadastro`, `/onboarding` e `/conta/perfil`: login/saída local, escolha shopper/creator/marca, perfil específico, revisão e persistência; entrega de e-mail real ainda não validada.
- `/painel/shopper`, `/painel/criador` e `/painel/marca`: favoritos/interesses, perfil/serviços/portfólio privados, organização/equipe/convites e rascunhos de campanhas conforme permissões.
- `/demo`: três contas fictícias persistentes com login real e dados preenchidos; briefings públicos fictícios em `/explorar/campanhas` e `/campanhas/demo/[slug]`, sem candidatura ou contratação.
- Incremento 38: `/painel/criador/loja` configura perfil público, foto, redes, produtos/recomendações, coleções e posts; `/loja/[slug]` exibe o snapshot publicado. Foto de marca no painel da organização; creator/afiliada compartilham foto de perfil. Frontend novo na prévia local; banco/Storage já aplicados. [Escopo e evidências](LOJA-AFILIADA.md).
- Favoritos de visitante persistidos neste navegador e separados dos favoritos de conta. Favoritos de conta têm evidências remotas anteriores; limites em FAVORITOS.md e PAINEL-CREATOR.md.
- Tratamento de falha de catálogo com nova tentativa; o modo conectado não substitui falhas silenciosamente por dados locais.

### 3.2 Dados, integração e operação

- Código salvo no [repositório GitHub](https://github.com/marigranadoc/diderot-platform).
- Projeto Supabase `mbxpwrgfujnjonyxzvfw` conectado à vitrine; criação das tabelas `collections`, `products` e `favorites` por migrações versionadas.
- Três coleções e oito produtos fictícios persistidos; contas e dados demonstrativos privados criados por autorização explícita. Não inferir quantidade atual de usuários a partir de inspeções históricas.
- Leitura pública apenas de catálogo publicado; bloqueio de escrita de catálogo para visitantes e usuários autenticados comuns.
- RLS e verificações reais de isolamento de favoritos, perfis, conteúdo de creator, organizações, equipe e rascunhos documentadas nos módulos e nas evidências das seções 26–34.
- Chave publicável em configuração local ignorada pelo GitHub, sem chave de serviço no cliente.
- Automação Playwright em computador e celular e encerramento do servidor temporário corrigido no Windows.
- GitHub ligado à Vercel, framework Next.js e domínio de produção público verificado; [acesso demonstrativo publicado](https://diderot-platform-mari-granado.vercel.app/demo). Credenciais demonstrativas somente no servidor.

### 3.3 Defeitos corrigidos

| Defeito | Correção aplicada | Evidência |
|---|---|---|
| Disponibilidade apenas rolava até conteúdo ainda fechado | Controle nativo abre a explicação no próprio clique e pelo teclado | AUD-02 e AUD-05 |
| Busca falhava com acentos e espaços | Normalização de termos e campos pesquisados | AUD-04 |
| Servidor de testes ficava aberto após a execução | Executor controla processos Node diretamente e preserva código de saída | Relatório de encerramento e execução conectada |
| Teste de conta confundia mensagem da página com aviso interno do Next.js | Seletor limitado à região principal | AUTH-01/02 reexecutados: 4 aprovados |

### 3.4 O que não está concluído

Entrega/retorno de e-mail de cadastro/recuperação ainda não foram validados. Loja própria com edição/publicação existe no incremento 38, separada da loja legada demonstrativa; catálogo operacional de marcas, importação, audiência verificada, rastreamento/comissões, candidatura, contratação, entregas, pagamentos, moderação/administração, diretórios completos, círculos pessoais e perfil de gosto continuam ausentes. Campanhas existem como rascunhos privados e briefings fictícios; não há publicação operacional de campanhas. A versão hospedada e a prévia local podem diferir: os incrementos 35–38 ainda não representam nova publicação do frontend na Vercel. Não foram usados serviços financeiros ou alterados dados reais de negócio.

## 4. Escopo, fases e prioridades

**P1:** bloqueia a jornada do MVP correspondente. **P2:** amplia descoberta, operação ou fidelidade depois da fundação. **P3:** extensão que depende de definição adicional. Não foi demonstrada ocorrência P0; isso não certifica segurança.

| Fase proposta | Entrega | Dependência | Critério de saída |
|---|---|---|---|
| F0 — base existente | Vitrine, catálogo remoto, estrutura visual e auditoria | Já implementada no escopo descrito | Preservar testes de navegação, dados públicos e bloqueio de escrita |
| F1 — conta e confiança | Cadastro/recuperação, sessão real, favoritos, isolamento e papéis | Ambiente de teste e regras de identidade | Duas contas reais de teste passam por login, gravação, releitura, logout e tentativas de acesso cruzado |
| F2 — creator e administração | Candidatura, aprovação, loja própria, CRUD e publicação | F1; modelo de propriedade e trilha de auditoria | Creator publica conteúdo próprio e administrador revisa sem acesso indevido |
| F3 — marcas | Entrada brand, descoberta de creators, campanhas e oportunidades | F1/F2; contratos de parceria definidos | Jornada de marca completa com dados fictícios e transições persistidas |
| F4 — descoberta ampliada | Diretórios, grupos, perfil de gosto, recomendações e compra externa | Conteúdo e regras definidos | Resultados verificáveis, permissões e estados vazios/erro testados |
| F5 — prontidão de lançamento | Observabilidade, compatibilidade, recuperação e deploy | Critérios funcionais e operacionais aprovados | Gate de lançamento cumprido; publicação tratada como ação separada |

As fases são uma proposta de sequência, não um cronograma contratado. Não há estimativas de prazo, orçamento ou metas comerciais aprovadas.

Com a expansão UGC, F3 deixa de significar apenas campanhas genéricas: deve atender campanhas UGC, influencer e híbridas por vaga, contratação direta e produção. O plano integrado das seções 24–25 detalha e amplia esta sequência; um lançamento limitado à vitrine não conclui o escopo UGC.

Ficam fora da implementação imediata: pagamentos ou comissões de produção, envio real de gifting, disparos de mensagens, aplicativo nativo, acesso a áreas privadas não autorizadas e reprodução de código/ativos proprietários da referência. Destinos comerciais e integrações financeiras exigem escopo e ambiente próprios antes de ativação.

## 5. Requisitos funcionais e status atual

**Verificado no escopo:** funciona nas condições testadas, sem implicar produto completo. **Parcial:** há implementação, mas falta parte da jornada ou verificação real. **Ausente:** não implementado. **A definir:** contrato de produto insuficiente. Os IDs existentes foram preservados.

### 5.1 Shopper

| ID | Requisito e origem | Estado atual | O que falta / aceite | Prioridade |
|---|---|---|---|---|
| S01 | Descoberta pela inicial — observado E0/E1 | Verificado no catálogo demonstrativo | Manter navegação inicial → loja → coleção → produto com conteúdo correto; ampliar descoberta em S02 | P1, base existente |
| S02 | Diretórios de creators, marcas, categorias e grupos — observado E1 | Ausente; só uma criadora fictícia | Resultados ligados a entidades reais de teste, filtros, vazio, paginação quando necessária e acesso ao conteúdo correto | P2 |
| S03 | Perfil público de creator — observado E0 | Implementado no escopo da loja própria: nome/bio, foto e redes informados pelo titular e publicados explicitamente | `/criador` legado segue demo; diretório e prova social/verificação ainda pendentes | P1 |
| S04 | Coleções e seus produtos — observado E0 | Leitura remota verificada; gestão ausente | Criar/editar/publicar coleção própria, reler e conferir isolamento; não misturar itens de outra coleção | P1 |
| S05 | Busca na loja — observado E0; normalização própria | Verificado no catálogo carregado | Manter nome/marca e vazio; busca em grande catálogo e comportamento de abrir/fechar ainda não implementados | P1 para funcionamento; P2 para expansão |
| S06 | Categorias/ordenação — E0 e decisão local | Verificado: categoria e preços | Não atribuir ordenação por preço à ShopMy sem evidência; decidir restauração de filtros e URL antes de prometer persistência | P2 |
| S07 | Favoritos — observado E0; persistência exigida | Verificado no escopo: visitante local e conta privada, com API real, isolamento e releitura | Preservar separação local/conta e recuperação de falhas; importação de favoritos locais não implementada | P1, base existente |
| S08 | Detalhe e disponibilidade — observado E0 | Verificado como demonstração | Manter nota da curadoria e preço fictício; disponibilidade atual não é estoque, compra nem confirmação comercial | P1, base existente |
| S09 | Saída para varejista — observado E0, sem compra | Ausente | URL de teste válida e vinculada ao produto; validação de destino; tratar indisponibilidade; não anunciar venda/comissão por haver clique | P2 |
| S10 | Grupos de curadores — tela observada E3 | Ausente | Definir privacidade; criar, nomear, adicionar/remover creators, editar e excluir grupo próprio com releitura e acesso cruzado negado | P2 |
| S11 | Perfil de gosto — estado inicial observado E3 | Ausente; regra a definir | Definir entradas, limiar e atualização; explicar estado insuficiente; provar resultado com dados de teste. Não assumir algoritmo ou limiar de 25 da referência | P3 |
| S12 | Galeria e opções de compra — observado E0 | Galeria/ofertas ausentes; produto usa fotografia ilustrativa única | Galeria acessível e oferta vinculada ao item; selecionar opção muda destino/informação correta. Sem opções fictícias apresentadas como reais | P2 |
| S13 | Recomendações e conteúdo relacionado — observado E0 | Ausente | Seções semelhantes/mesma marca/outros curadores com regra própria documentada, exclusão de conteúdo privado e vazio coerente | P3 |
| S14 | Outros creators que compartilharam o item — observado E0 | Ausente | Relação produto/creator com fonte verificável; abrir perfil correto; não inventar contagem ou recomendação | P2 |
| S15 | Redes sociais e adicionar creator a grupo — observado E0 | Parcial: redes configuráveis e ordenáveis abaixo de “Explore minhas escolhas”; grupos ausentes | Links HTTPS, nova aba, nome acessível e snapshot; grupos dependem de S10 | P2 |

O convite ao aplicativo visto na referência é registrado como observação, não como requisito de criar aplicativo nativo nesta versão.

### 5.2 Contas e autorização

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| A01 | Login, logout e recuperação — observado E2 | Login/saída local e três identidades demo verificados com Auth real; recuperação parcial | Preservar outra sessão ao sair localmente; validar entrega/retorno e reuso de token de recuperação em fluxo real | P1 |
| A02 | Contextos shopper/creator/brand e isolamento — observado E2 e exigência local | Preferência e onboarding implementados; proprietário/membro com RLS; administrador ausente | Preferência não é autorização. Concluir matriz operacional, cargos e admin; preservar isolamento e negação de autoelevação já testados | P1 |
| A03 | Cadastro e confirmação de conta — proposta para completar jornada | Parcial: formulário e resposta de confirmação implementados; e-mail real pendente | Criar conta em ambiente de teste, confirmar quando exigido, tratar duplicidade e erros; definir reenvio e retorno após confirmação | P1 |

A diretriz U0 define que uma conta creator pode reunir UGC, influencer e afiliado, sem cadastros separados. Modalidades profissionais e preferência `account_type` são diferentes de papéis de segurança. A conta já pode manter dados de shopper, creator e organização, trocando o espaço preferido sem apagar contextos. A autorização depende da identidade/propriedade/vínculo; administrador e futuros cargos de operador/financeiro nunca são autoatribuíveis. O documento N1 não elimina shopper do cadastro existente.

### 5.3 Creator

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| C01 | Candidatura — primeira etapa observada E1 | Ausente | Nome público, nome legal, e-mail e telefone foram observados; definir necessidade de cada dado na Diderot. Validar, salvar, reler status e proteger informações privadas; etapas seguintes não foram observadas | P1 |
| C02 | Gestão de loja, coleções e produtos — declarado E1 e telas relatadas N1 | Implementado no escopo pessoal do incremento 38: editor, fotos, redes, itens externos/catálogo demo, seções, posts, prévia e snapshot público | Catálogo operacional de marca, diretório/moderação e vídeo permanecem pendentes; afiliação financeira não é concluída por cadastrar um link. Ver LOJA-AFILIADA e NAV-C01–C08 | P1 |
| C03 | Links de afiliado e desempenho — declarado E1 | Ausente | Definir vínculo creator/produto/destino, fonte de eventos e cálculo; simular atribuição, duplicidade e falhas; não confundir clique com comissão | P2 |
| C04 | Parcerias com marcas — declarado E1 | Ausente | Creator vê apenas suas propostas; aceita/recusa e acompanha status; mudanças persistem e partes não autorizadas são bloqueadas | P2 |

### 5.4 Marca

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| B01 | Entrada/candidatura brand — seleção observada E2 | Parcial: organização privada e vínculo responsável; aprovação pendente | Definir formulário próprio, dados, status, aprovação e identidade da organização; seleção de perfil não conclui cadastro | P1 |
| B02 | Descoberta e seleção de creators — declarado E1 | Ausente | Diretório com filtros definidos, perfil correto e lista de seleção persistente; não expor dados privados da candidatura | P2 |
| B03 | Campanhas, gifting e oportunidades — declarado E1 e proposta U0/N1 | Parcial: editor privado de sete etapas e condições por grupo/modalidade no incremento 37; publicação/gifting/candidaturas ausentes | Concluir múltiplas vagas, catálogo vinculado, elegibilidade e validação/transições de publicação; briefing salvo não concede licença nem gera oportunidade ativa | P1 para MVP brand |
| B04 | Métricas de desempenho — declarado E1 | Ausente | Fonte, janela, fórmula e acesso por organização explicitados; ausência de dados distinta de zero; dados simulados rotulados | P2 |

### 5.5 Administração e plataforma

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| M01 | Entrada e gestão administrativa — exigência do usuário | Ausente | Sessão e papel verificados antes da operação; negação para anônimo/outro papel; alterações auditáveis | P1 |
| M02 | Aprovação e moderação — proposta Diderot | Ausente | Revisar candidatura, aprovar/rejeitar com motivo, consultar histórico e bloquear transições inválidas | P1 |
| T01 | Banco/persistência — exigência do usuário | Verificado por módulo implementado; marketplace futuro parcial | Preservar testes de gravação/releitura reais; novos módulos precisam de verificação própria; mock ou preview não prova persistência | P1 |
| T02 | Permissões por proprietário/vínculo — exigência do usuário | RLS e negativas reais de perfis/conteúdo/organizações/equipe/rascunhos verificadas; admin ausente | Aplicar isolamento e cargos específicos a catálogo, vitrine, candidaturas e financeiro; nunca conceder privilégio por user_metadata | P1 |
| T03 | Erros e recuperação — exigência do usuário | Parcial: 404/vazio verificados; interface de erro de catálogo; erros de Auth/favoritos simulados | Automatizar indisponibilidade e recuperação do catálogo; validar sessão expirada, rede, validação de formulário e gravação repetida | P1 |
| T04 | Testes e uso móvel — exigência do usuário | Parcial: Chromium desktop/mobile; testes e evidências existentes | Jornadas completas, navegadores adicionais e aparelhos reais; acessibilidade e desempenho além das verificações pontuais | P1 |

Nenhuma tela administrativa da ShopMy foi inspecionada. Os requisitos M01/M02 são da Diderot.

## 6. Jornadas e estados de UX

### J1 — Shopper visitante

**Atual:** inicial → perfil público → coleção/busca/filtro → produto → explicação de disponibilidade → retorno. O visitante pode salvar favoritos neste navegador, navegar e recarregar sem perder a seleção quando o armazenamento está disponível. Escolhas locais e da conta permanecem separadas; entrar não importa escolhas automaticamente.

**Alvo:** descobrir vários curadores → produto → salvar com conta ou acessar varejista. A compra acontece fora da Diderot nesta proposta; checkout próprio não é requisito aprovado.

**Estados obrigatórios:** carregamento, lista com resultados, vazio recuperável, produto inexistente, falha de catálogo, favorito local persistido, erro de armazenamento, pedido de login e destino indisponível.

### J2 — Shopper com conta

**Alvo:** cadastrar/confirmar → entrar → salvar → recarregar → sair → entrar novamente → reencontrar → remover. Repetir em outra sessão e com segunda conta sem acesso ao primeiro conjunto.

**Atual:** login/saída local, painel shopper, perfil/interesses e favoritos privados verificados com dados e sessões reais. Cadastro possui escolha de tipo e onboarding; entrega/retorno do e-mail ainda pendente. Sem transferência automática de favoritos locais para a conta. Entrar exibe os favoritos privados; sair restaura a seleção local e preserva outras sessões.

**Estados obrigatórios:** conta não confirmada, credenciais inválidas, envio em andamento, sessão expirada, falha de salvar/remover, confirmação de resultado e logout. Não mostrar sucesso antes de confirmar a operação.

### J3 — Creator

**Alvo proposto:** candidatura → status de revisão → aprovação → configurar loja → criar coleção → adicionar produto → salvar rascunho → publicar → conferir página pública → editar e reler.

**Atual:** onboarding, painel e gestão privada de perfil/modalidades, serviços e portfólio funcionam. Incremento 38 adiciona loja própria com foto/redes, itens/coleções/posts, edição privada, prévia e publicação/retirada confirmadas. Candidatura/revisão administrativa, diretório e moderação ainda não existem. A demo legada `/criador` permanece separada da loja por conta em `/loja/[slug]`.

**Estados propostos:** candidatura em rascunho/enviada/em análise/aprovada/rejeitada; conteúdo em rascunho/publicado/arquivado. A política de reenvio e suspensão precisa ser decidida. Esses estados não foram extraídos da ShopMy.

### J4 — Marca

**Alvo proposto:** cadastrar organização → obter habilitação → descobrir creators → criar campanha em rascunho → selecionar participantes → publicar oportunidade → acompanhar aceite/recusa → encerrar → consultar resultado.

**Atual:** organização, responsável/membros de leitura, convites e rascunhos privados implementados; exemplo demo com três rascunhos e navegação real. Habilitação comercial, catálogo da marca, descoberta de creators, publicação, seleção e métricas ainda pendentes. Gifting não inclui envio físico nesta fase.

**Estados propostos:** campanha rascunho/ativa/encerrada/cancelada; participação pendente/aceita/recusada/concluída. Definir quem pode executar cada transição antes de construir a interface.

### J5 — Administrador

**Alvo proposto:** entrar → validar papel → abrir fila → revisar dados → aprovar/rejeitar com motivo → conferir status atualizado → consultar registro de ator, data e mudança.

**Atual:** jornada bloqueada na entrada. Aprovação não pode ser realizada por atualização irrestrita no navegador.

## 7. Arquitetura de informação e rotas

### Existentes

| Rota | Conteúdo e fonte | Limites |
|---|---|---|
| `/` | Apresentação e coleções/produtos do Supabase; textos editoriais locais | Sem diretórios completos |
| `/criador` | Perfil Clara fixo e catálogo remoto | Não é painel, não representa múltiplos creators |
| `/colecoes/essenciais` | Quatro produtos fictícios | Sem gestão |
| `/colecoes/rituais` | Dois produtos fictícios | Sem gestão |
| `/colecoes/casa` | Dois produtos fictícios | Sem gestão |
| `/produto/[slug]` | Oito detalhes do catálogo | Sem varejista, estoque ou oferta comercial real |
| `/conta` | Login/saída local e navegação por preferência | Auth real verificado; recuperação de e-mail ainda parcial |
| `/cadastro` | Criação por e-mail/senha e escolha de tipo | Destinos informados pela usuária; entrega/retorno de e-mail não testados |
| `/recuperar-acesso` | Solicitação de link e atualização de senha | Entrega de e-mail real não validada |
| `/conta/criador` | Perfil privado e modalidades UGC/influencer/afiliado | Sem mínimo de seguidores; sem publicação/diretório |
| `/onboarding`, `/conta/perfil` | Escolha de espaço, perfil específico e revisão | Preferência não é habilitação comercial ou privilégio |
| `/painel/shopper` | Perfil/interesses e favoritos de conta | Sem perfil de gosto algorítmico |
| `/painel/criador`, `/conta/criador/servicos`, `/conta/criador/portfolio` | Painel, ofertas e trabalhos privados | Sem editor/publicação da vitrine ou upload |
| `/painel/criador/loja`, `/loja/[slug]` | Editor privado e loja pública por creator/afiliada; upload de fotos | Incremento 38 local; somente snapshot publicado acessível ao visitante |
| `/painel/marca` | Organização, equipe, convites e rascunhos de campanhas | Sem catálogo de marca, aprovação comercial ou publicação |
| `/demo` | Três contas fictícias compartilhadas com login real | Não usar dados pessoais; não equivale a três papéis administrativos |
| `/explorar/campanhas`, `/campanhas/demo/[slug]` | Três briefings fictícios navegáveis | Sem inscrição ou sincronização com rascunhos privados |
| URLs inválidas | Página 404 e recuperação | Não equivale a proteção de área privada |

Rotas dinâmicas possuem os slugs existentes, sem inventar entidades para satisfazer navegação. Produtos: `bolsa-oliva`, `camisa-linho`, `serum-botanico`, `vaso-organico`, `sandalia-trama`, `creme-essencial`, `bolsa-areia`, `vaso-calcario`. A demonstração utiliza `/api/demo/session`, endpoint de servidor e não tela. O inventário de telas futuras está no anexo; suas rotas são propostas.

### Propostas, ainda não implementadas

`/explorar`, `/criadores`, `/marcas`, `/criadores/[slug]`, `/favoritos`, `/grupos`, `/meu-gosto`, `/candidatura/criador`, `/candidatura/marca`, `/admin` e rotas dos editores de vitrine/catálogo no anexo são propostas. `/explorar/campanhas` existe somente como demo. A migração do perfil público `/criador` para múltiplos creators deve manter compatibilidade dos links atuais.

## 8. Identidade visual e fidelidade à referência

| Aspecto | Observação REA | Implementação Diderot | Pendência de fidelidade |
|---|---|---|---|
| Destaque inicial | Fotografia ampla, título serifado grande, navegação e seta | Home reorganizada conforme estrutura fornecida, com fotografia ilustrativa local | Conteúdo próprio e variações reais de mídia; não declarar equivalência de todas as telas |
| Tipografia | Serifada nos títulos, sem serifa na interface | Reckless TRIAL apenas local, fallback Georgia; DM Sans no corpo | Arquivo licenciado definitivo para hospedar Reckless |
| Cabeçalho | Escuro e compacto; adaptação móvel | Cabeçalho escuro e logo Diderot | Comparar espaçamento, hierarquia e comportamento nos breakpoints |
| Perfil | Imagem circular, autoria, bio, redes, grupos | Avatar ilustrado, nome, bio e aviso fictício | Redes, grupo e informações verificadas de creator |
| Navegação | Abas horizontais, categorias/contagens e busca expansível | Coleções, filtros e busca sempre visível | Abrir/fechar busca não reproduzido; avaliar navegação horizontal acessível |
| Produtos | Grade, destaque para imagem; duas colunas no celular | Grade responsiva com oito fotografias locais ilustrativas | Galeria, favoritos no detalhe e metadados complementares |
| Detalhe | Imagens/miniaturas, informações, outros curadores, ofertas e relacionados | Fotografia, preço, nota e disponibilidade demo | S12/S13/S14 e saída comercial |
| Estados | Carregamento observado no produto | Erro, vazio e 404; estados de gravação | Inventário visual de carregamento, sucesso, bloqueio e falha em todos os módulos |

**Tokens atuais:** `app/design-tokens.css` e [DESIGN-SYSTEM-DIDEROT.md](DESIGN-SYSTEM-DIDEROT.md) prevalecem sobre a paleta inicial histórica: texto primário `#000`, fundo `#fff`, secundários e divisórias neutros conforme o arquivo fornecido. N1 orienta novos editores e dashboards a reutilizar essa identidade Diderot; não redefine a fonte escolhida pela usuária nem autoriza publicar a fonte TRIAL.

**Aceite visual proposto:** comparar telas equivalentes em 390 × 844 e desktop; verificar hierarquia, grid, proporções, espaçamento, contraste, estados de foco e ausência de corte. Não exigir equivalência pixel a pixel com assets distintos nem declarar equivalência sem comparação. Novos módulos devem reutilizar tokens e componentes documentados.

**Pendências de design system:** consolidar escala de tipografia/espaçamento, catálogo de componentes, variantes/estados, regras de imagens, ícones, formulários, tabelas e navegação dos painéis. O CSS atual não constitui uma biblioteca de design system completa.

## 9. Dados e permissões

### Modelo atual confirmado no código e nas últimas inspeções

| Entidade | Campos principais | Acesso atual | Limite |
|---|---|---|---|
| `collections` | slug, nome, categoria, descrição, posição, publicação, demo, data | Leitura de publicadas para anon/authenticated | Sem proprietário ou editor |
| `products` | slug, nome, marca textual, preço, categoria, coleção, tipo/cor da ilustração, nota, posição, publicação, demo, data | Leitura se produto e coleção estiverem publicados | Marca não é entidade; produto pertence a uma única coleção; sem URL comercial |
| `favorites` | user_id, product_slug, created_at; chave composta | SELECT/INSERT/DELETE do próprio usuário; sem UPDATE; anônimo sem acesso | Isolamento e persistência reais verificados; seleção local não é importada |
| `auth.users` | Identidade gerida pelo Supabase Auth | Referência de perfis, conteúdo e propriedade | Conta não concede admin; confirmação de demo não dispensa confirmação do cadastro normal |
| `account_profiles` | user_id, tipo preferido, nome, cidade, interesses, onboarding | Leitura/escrita própria; sem transferência de user_id | Preferência não é autorização |
| `creator_profiles`, `creator_services`, `creator_portfolio_items` | Perfil/modalidades, ofertas e trabalhos por link | Privados do creator, com RLS | Publicação e fotos em módulos separados; contratação ausente |
| `organizations`, `organization_members` | Organização, proprietário e vínculo owner/member | Responsável escreve; membro consulta; isolamento por vínculo | Uma organização própria por conta; cargos ampliados pendentes |
| `organization_invitations` | Convite, destinatário, estado, validade | Sem acesso direto; RPC guardado por dono/destinatário confirmado | Convite interno, sem envio de e-mail |
| `campaign_drafts`, `campaign_draft_slots` | Contexto privado, versão, requisição e grupos por modalidade | Vínculo lê; responsável grava atomicamente por RPC | Somente draft; sem publicação, candidatura ou pagamento |
| `creator_shops` | Documento privado, slug, snapshot público, versão e recibo | Titular lê; RPC guardado grava/publica; visitante recebe somente snapshot por RPC | Uma loja por conta; limites de 1 MB/200 itens/50 seções/100 posts; relações N:N por IDs no documento |
| `profile_photos`, `creator_shop_public_media`, bucket `diderot-media` | Fotos por creator/marca e índice das mídias publicadas | Pasta própria; membro lê foto da marca; visitantes acessam somente mídias publicadas por autorização temporária | Sem limpeza automática; URLs já emitidas podem durar até 15 minutos |

Migrações: [catálogo](../supabase/migrations/20261111212222_diderot_demo_catalog.sql) e [favoritos](../supabase/migrations/20261111213111_shopper_favorites.sql).

### Evolução proposta, não implementada

Habilitações comerciais e cargos operacionais, lojas/variantes/catálogo canônico de marca, tabelas relacionais dedicadas e escala além do documento da loja pessoal, candidaturas por vaga, grupos, campanhas publicáveis, destinos rastreados, eventos de desempenho e auditoria. Reutilizar perfis, organizações/equipe, rascunhos e loja pessoal já existentes. Não sobrecarregar `products.collection` para simular múltiplos proprietários nem tratar recomendação externa pessoal como produto oficial de marca.

| Ator | Leitura prevista | Escrita prevista | Proibições obrigatórias |
|---|---|---|---|
| Visitante | Conteúdo público e favoritos locais | Somente armazenamento deste navegador; nenhuma escrita pessoal remota | Dados privados, rascunhos e favoritos de contas |
| Shopper | Público + próprios favoritos/grupos | Próprias preferências/grupos | Alterar outro usuário ou atribuir papel |
| Creator habilitado | Público + sua gestão/propostas | Sua loja/coleções e respostas autorizadas | Catálogo privado alheio; aprovação da própria candidatura |
| Membro brand habilitado | Dados da organização e creators públicos | Campanhas e seleções da organização conforme permissão | Organização alheia e dados privados de candidatura |
| Administrador | Escopo operacional definido | Aprovação/moderação autorizadas e auditadas | Operações sem identidade, rastreabilidade ou política definida |

Essa matriz é alvo do produto e deve ser refinada por entidade. Hoje há propriedade de conteúdo privado de creator, responsável/membro de organização e RLS das entidades implementadas; operador/financeiro/admin ainda não existem. O tipo preferido não substitui esses controles.

## 10. Critérios não funcionais e definição de concluído

Para cada funcionalidade aplicável, registrar os oito pontos solicitados na auditoria:

1. A rota abre com o resultado e status corretos.
2. O controle produz o efeito esperado, além de ser clicável.
3. A integração consulta/grava a entidade correta.
4. O resultado permanece após reload e nova sessão quando o requisito exige persistência.
5. Anônimo, papel incorreto e outro proprietário não conseguem acesso indevido.
6. Validação, erro de rede/banco e recuperação têm comportamento explícito.
7. Existe teste automatizado do resultado, com ambiente e evidência identificados.
8. A jornada funciona no celular, sem corte, controle inacessível ou perda de estado indevida.

Marcar “não aplicável” com motivo em conteúdo puramente editorial; não transformar ausência de persistência em aprovação por omissão. Simulações testam contratos de interface; não substituem API/banco/Auth reais.

**Segurança e operação:** nenhuma chave secreta no cliente/repositório; autorização no banco/servidor; migrações reproduzíveis; dados de teste identificados; ausência de dados pessoais em logs desnecessários; procedimento de recuperação e ambiente de teste antes de lançamento. Política de retenção/exclusão de dados e revisão de privacidade ainda precisam ser definidas.

**Acessibilidade e compatibilidade:** rótulos de formulário, teclado, foco, mensagens compreensíveis, contraste e navegação móvel. As verificações atuais são pontuais; não há certificação WCAG nem testes em aparelhos físicos/Safari. A meta de conformidade deve ser formalizada antes do lançamento.

**Desempenho:** definir orçamento de carregamento e cenários representativos, medir antes de aprovar. Não há baseline de carga, volume ou metas numéricas aprovadas; o catálogo de oito itens não prova escala.

## 11. Evidências de teste e lacunas de validação

| Execução registrada | Resultado | Interpretação correta |
|---|---|---|
| Vitrine original | 6 aprovados | Escopo demonstrativo inicial |
| Auditoria ampliada antes das correções | 4 aprovados / 12 falhas | Defeitos de disponibilidade/busca e lacunas de produto |
| [Catálogo conectado](evidencias/auditoria-supabase.json) | 16 aprovados / 8 falhas, 24 casos | Páginas conectadas e ações públicas verificadas; GAP-01/02/03/04 abertos |
| [Primeira execução com contas](evidencias/auditoria-contas.json) | 16 aprovados / 12 falhas, 28 casos | Oito GAP e quatro falhas de seletor dos novos testes |
| [Contratos de conta após correção](evidencias/contratos-contas.json) | 4 aprovados / 0 falhas | Login/favoritos/logout simulados em dois tamanhos; não é teste real de Auth |
| Build e TypeScript | Aprovados no último incremento | Compilação e tipos; não comprovam regra de negócio |
| [Checagem de banco](../scripts/check-database.mjs) executada | Leitura de 3 coleções/8 produtos, escrita anônima negada e releitura preservada | Verifica catálogo demonstrativo via API |
| Advisor de segurança após migrações | Zero alertas registrados | Não substitui auditoria completa nem teste de isolamento |
| [SQL de isolamento de favoritos](../supabase/tests/favorites.sql) | Não executado | Confirmação adicional do serviço expirou; nenhuma conta de teste criada |

Não houve execução integral posterior à correção dos seletores de conta. Portanto, não existe relatório único final “20/28” a ser anunciado como execução realizada.

**Precisão sobre GAP-01:** apesar do histórico descrever shopper com conta, esse teste abre a vitrine sem autenticação, marca favorito e recarrega. Ele prova perda da seleção de visitante, não falha de uma sessão autenticada real. Deve ser reespecificado quando a política de favoritos de visitantes for decidida, preservando o histórico e acrescentando o teste real por conta. Não deve ser simplesmente removido para tornar a suíte verde.

**Próxima bateria obrigatória:** Auth real com duas contas de teste; favoritos entre sessões/aparelhos e tentativas de acesso cruzado; recuperação/expiração; falha de rede do catálogo; gestão e publicação de outro proprietário; papéis inválidos; candidaturas e campanhas; repetição integral após as correções correspondentes.

## 12. Backlog ordenado e dependências

| Ordem | Trabalho | Entrega verificável | Dependências |
|---|---|---|---|
| 1 | Preparar ambiente e contas de teste | Método autorizado, dados sintéticos e limpeza/reversão documentada | Separação de dados reais |
| 2 | Concluir A01/A03 e testar S07/T02 | Cadastro/recuperação e sessão real; favoritos persistentes e isolados | 1; configuração Auth |
| 3 | Definir e implementar A02 | Papéis e propriedade sem autoelevação | 2; decisão de múltiplos papéis |
| 4 | Evoluir esquema para C02 | Creator, loja, autoria e relações de catálogo | 3; cardinalidade de produto/coleção |
| 5 | C01/M01/M02 | Candidatura, fila de aprovação e trilha auditável | 3; estados aprovados |
| 6 | C02 completo | CRUD, rascunho/publicação, releitura e verificação pública | 4/5 |
| 7 | B01/B02/B03 e C04 | Organização, campanha e participação com autorização | 3/6; contrato de parceria |
| 8 | S02/S10/S15 | Diretórios e grupos persistentes | 2/6; privacidade de grupos |
| 9 | S09/S12/C03/B04 | Ofertas/destinos e medição com origem confiável | 6/7; contrato comercial e eventos |
| 10 | S11/S13/S14 | Perfil de gosto e relações/recomendações explicáveis | Volume de conteúdo e regra definida |
| Contínuo | T03/T04 e design system | Erros, acessibilidade, responsividade e testes junto a cada módulo | Cada implementação |

## 13. Métricas propostas

As métricas abaixo ainda não são instrumentadas nem têm metas aprovadas. Devem ser coletadas com eventos definidos e ambiente identificado, sem números fictícios apresentados como resultados.

| Métrica | Definição proposta | Uso |
|---|---|---|
| Conclusão da jornada shopper | Sessões elegíveis que chegam a detalhe e salvam com confirmação / sessões elegíveis | Avaliar descoberta e salvamento |
| Retenção de favoritos | Testes de salvar/reentrar/reler bem-sucedidos / testes executados | Gate funcional, não estimativa de retenção comercial |
| Conclusão de publicação creator | Creators de teste que concluem criação até publicação / tentativas | Encontrar bloqueadores na gestão |
| Tempo de revisão | Tempo entre candidatura enviada e decisão registrada | Operação administrativa |
| Aceite de oportunidade | Participações aceitas / oportunidades entregues elegíveis | Futuro fluxo brand; entrega precisa ser comprovada |
| Falha de operação | Operações com erro / tentativas, segmentadas por módulo | Priorizar confiabilidade |
| Negação correta de acesso | Tentativas indevidas bloqueadas / cenários de segurança definidos | Gate de autorização |

Comissão, vendas atribuídas e retorno financeiro só podem existir após contrato de fonte/cálculo e validação; não são derivados de cliques isolados.

## 14. Decisões abertas e riscos

| Decisão / risco | Situação | Quando resolver |
|---|---|---|
| Cadastro público e confirmação | Cadastro/onboarding implementados; entrega/retorno de confirmação e recuperação ainda não validados com e-mail real | Antes de concluir F1 |
| Uma pessoa com vários papéis | Modalidades UGC/influencer/afiliado na mesma conta definidas por U0; acúmulo de papéis organizacionais ainda pendente | Antes de migrar A02 |
| Favoritos de visitante e migração para conta | Persistência local implementada; transferência para conta não implementada | Definir importação explícita antes de migrar dados |
| Produto compartilhado entre creators/coleções | Esquema atual é insuficiente para múltiplas relações | Antes do CRUD multi-creator |
| Aprovação e suspensão | Estados deste PRD são propostas | Antes de C01/B01/M02 |
| Privacidade de grupos e candidaturas | Política ainda não definida | Antes de coletar dados novos |
| Perfil de gosto e recomendações | Somente estados públicos observados, algoritmo desconhecido | Antes de S11/S13 |
| Afiliados e métricas | Sem provedor, fonte ou regra aprovada | Antes de C03/B04 |
| Imagens/fotografia e tipografia final | Fotografias locais e DM Sans; Reckless TRIAL somente na prévia local | Fonte licenciada definitiva antes de publicar Reckless |
| Cobertura da referência | Áreas privadas não inspecionadas | Registrar novos requisitos como proposta até haver evidência |
| Prontidão operacional | Deploy e navegação demonstrativa públicos validados; carga, recuperação, monitoramento e operação comercial ainda incompletos | Antes de lançamento |

## 15. Gate de lançamento e manutenção deste PRD

O MVP só pode ser tratado como concluído quando todas as jornadas escolhidas para sua versão tiverem critérios de aceite cumpridos, testes reais de persistência/autorização, recuperação de erro e uso móvel. Se uma versão excluir brand ou administração, essa redução precisa ser explícita no escopo; não pode ser anunciada como plataforma completa.

Cada mudança de status deve incluir data, commit, ambiente, teste executado e limite da evidência. Manter [PROGRESSO-DIDEROT.md](PROGRESSO-DIDEROT.md) como registro de execução e este PRD como referência de requisitos/estado consolidado. Não calcular percentual global de conclusão a partir da quantidade de telas ou de testes simulados.

**Próxima entrega recomendada:** encerrar a validação do briefing privado (incremento 37) e seguir para catálogo gerido pela marca e relações necessárias à vitrine/campanhas. Administração mínima e validação real de confirmação/recuperação acompanham os gates de abertura. Publicação exige ainda múltiplas vagas, catálogo vinculado, elegibilidade e transições no backend. Ordem e critérios completos no [plano do MVP](PLANO-LANCAMENTO-MVP.md).

## 16. Expansão nativa: UGC Marketplace + Creator Commerce

**Origem:** U0, diretriz do usuário. **Estado de implementação em 12/11/2026:** U01/U02, portfólio U03, serviços U04 e rascunhos de campanhas U07/U08 estão parcialmente implementados, nos limites dos incrementos 26–33. Organizações e equipe possuem permissões próprias; não há aprovação comercial. Diretório profissional, publicação, candidaturas, contratação, produção, financeiro e administração continuam pendentes. A identidade visual, a vitrine, o catálogo e a base de contas devem ser reutilizados conforme sua validação atual, sem reconstrução indiscriminada.

O marketplace deve atender criação de conteúdo, divulgação para audiência própria e comércio por afiliação. Uma contratação pode combinar essas atividades, mas não pode confundir seus requisitos, entregáveis, direitos ou remuneração.

### 16.1 Regras de produto obrigatórias

| Regra U0 | Requisito consolidado | Aceite mínimo |
|---|---|---|
| R01 | Creator UGC pode ter zero seguidores | Cadastro e candidatura UGC sem campo obrigatório de audiência nem rejeição por ausência desse dado |
| R02 | Publicação pessoal não é obrigatória por padrão em UGC | Vaga UGC nasce sem obrigação de postagem; eventual exigência é explícita no briefing/contrato e visível antes da candidatura |
| R03 | Influencer pode ter requisitos de audiência | Validação de canais/métricas é configurada por vaga de divulgação, sem contaminar vagas UGC |
| R04 | Uma conta suporta UGC, influencer e afiliado | Seleção múltipla no onboarding e edição posterior sem duplicar identidade ou perder histórico |
| R05 | Uma campanha pode conter modalidades e remunerações distintas | Campanha híbrida admite vagas exclusivamente UGC, exclusivamente influencer e híbridas |
| R06 | A vaga possui requisitos, entregáveis, orçamento e capacidade próprios | A candidatura seleciona uma vaga e usa suas condições, não um conjunto genérico de regras da campanha |
| R07 | Produção é remunerada separadamente da comissão | Demonstrativo distingue produção, publicação, comissão, bônus e benefício em produto |
| R08 | Conteúdo não transfere direitos ilimitados automaticamente | Contrato exige licença expressa; nenhum padrão de cessão irrestrita/perpétua |
| R09 | Entregas possuem versões e revisão | Reenvio cria nova versão; anterior permanece acessível aos autorizados |
| R10 | Arquivos privados exigem vínculo autorizado | Usuário externo não acessa nem por URL direta; verificar autorização e validade do acesso |
| R11 | Recebido exige confirmação correspondente | Sem confirmação verificável, estado é pendente/em processamento/externo não confirmado, nunca recebido |
| R12 | Aprovar candidatura não gera obrigação financeira automaticamente | Obrigação depende de condições aceitas pelas partes e regra de vencimento definida |
| R13 | Marca contrata dentro das permissões e limites da conta | Membro sem poder de contratação ou orçamento autorizado não confirma acordo |
| R14 | A última vaga é protegida contra concorrência | Duas aprovações simultâneas não ultrapassam capacidade; validação atômica no backend |
| R15 | Organizações são isoladas | Marca A não lê nem altera propostas, projetos ou arquivos privados da marca B |
| R16 | Mudança contratual exige nova concordância | Valor, prazo, escopo ou licença alterados geram versão/aditivo com novo aceite, sem sobrescrever o acordo anterior |
| R17 | UGC não degrada descoberta e comércio existentes | Reexecutar testes da vitrine/contas; shopper não é forçado a navegar por ferramentas profissionais |

Não há exigência global de seguidores mínimos para participar da Diderot. Qualidade de portfólio, adequação ao briefing, competências e histórico são os critérios relevantes para UGC. Métricas declaradas devem ser identificadas como declaradas; não inventar seguidores, desempenho, avaliações ou receitas.

### 16.2 Diagnóstico e reaproveitamento obrigatório

| Área existente | Classificação no escopo atual | Reutilização / trabalho necessário |
|---|---|---|
| Vitrine, busca, filtros, detalhe e leitura do catálogo | EXISTENTE E FUNCIONAL no escopo demonstrativo verificado | Preservar; evolução multi-creator depende de propriedade e relações |
| Login/logout e favoritos por conta | EXISTENTE, MAS INCOMPLETA | Concluir Auth real e isolamento antes de conectar recursos profissionais |
| Contratos de teste Auth/favoritos | EXISTENTE APENAS COMO MOCK de teste; não são backend de produção | Manter para interface e acrescentar testes reais |
| Perfil Clara | EXISTENTE, MAS INCOMPLETO como perfil profissional | Substituir dados fixos por autoria/perfil editável; não criar uma segunda identidade UGC |
| Catálogo com uma coleção por produto e marca textual | NECESSITA REFATORAÇÃO para múltiplos creators/campanhas | Planejar relações e migração incremental, preservando slugs e registros |
| Modalidades, portfólio, serviços, diretório profissional | PARCIAL | Modalidades e gestão privada de portfólio/serviços disponíveis; diretório/publicação pendentes |
| Campanhas, vagas, candidaturas e contratações | PARCIAL | Rascunho e sete etapas privadas com condições por grupo/modalidade; múltiplas vagas por modalidade, produtos de catálogo vinculados, publicação, candidaturas e contratação pendentes |
| Workspace, arquivos privados, mensagens e revisões | NÃO IMPLEMENTADA | Definir Storage, autorização e versões antes de disponibilizar upload |
| Financeiro, gateway, rastreamento, conversões e comissões | NÃO IMPLEMENTADA | Vitrine não significa afiliação operacional; construir contratos e estados, sem finanças de produção |
| Administração, disputas, moderação e reputação | NÃO IMPLEMENTADA | Definir papéis, transições, auditoria e critérios de elegibilidade |

Antes de cada etapa de implementação, atualizar o inventário do repositório, dependências, rotas, schema/migrações, identidade, campanhas, afiliação, componentes, Auth, Storage e financeiro. Este PRD incorpora o diagnóstico já registrado; não afirma que uma nova inspeção remota foi executada nesta atualização documental.

## 17. Perfis profissionais, serviços e descoberta

| ID | Requisito UGC — não implementado | Critério de aceite | Dependência |
|---|---|---|---|
| U01 | Modalidades de creator | UGC/influencer/afiliado selecionáveis em uma única conta; combinação representa atuação híbrida; edição mantém acordos anteriores | A01/A02/A03 |
| U02 | Perfil profissional | Foto, nome profissional, bio, cidade/estado, nichos, idiomas, categorias, habilidades, disponibilidade e modalidades persistem e respeitam privacidade | U01/C02 |
| U03 | Portfólio | Vídeos, fotos, cases, demonstrações, projetos e links; cada item tem título, categoria, tipo, descrição, miniatura, mídia e participação; marca somente com autorização e métricas com origem | U02, arquivos autorizados |
| U04 | Serviços | Vídeo/pacote UGC, fotografia, unboxing, demonstração, depoimento, roteiro, anúncios, edição e produção bilíngue; preço inicial ou sob orçamento, exibidos no perfil e na contratação | U02/U03 |
| U05 | Diretório profissional para marcas | Filtrar modalidade, nicho, cidade, idioma, estilo, faixa de preço, disponibilidade, experiência e serviço; audiência somente onde aplicável | B02/U02/U04 |
| U06 | Listas e seleção de creators | Marca favorita, organiza listas, abre perfil, convida para campanha ou solicita orçamento; lista privada isolada por organização | U05/A02 |

No diretório UGC, priorizar portfólio, briefing, competências, estilo, idioma, histórico de entrega e avaliações verificadas. O ranking exato permanece decisão de produto; não inferir desempenho a partir do número de seguidores. Dados opcionais ausentes devem aparecer como não informados, sem zeros ou indicadores fictícios de sucesso.

## 18. Campanhas unificadas por vaga

**U07 — Núcleo de campanhas:** campanha define contexto e objetivos; vaga define modalidade, requisitos, entregáveis, capacidade e remuneração. Campanha UGC e influencer têm vagas compatíveis; campanha híbrida pode misturar vagas UGC, influencer e híbridas, cada qual com quantidade e orçamento independentes. Produtos são associados explicitamente à campanha.

**U08 — Criação em sete etapas**, com rascunho persistente, validação contextual e possibilidade de revisar antes de publicar:

| Etapa | Campos e regras |
|---|---|
| 1. Informações gerais | Nome, marca, descrição, objetivo comercial, categoria, produtos, referências visuais, início/fim e prazo de candidatura; validar coerência de datas |
| 2. Modalidades/vagas | UGC, influencer ou híbrida; configurar vagas, quantidades e orçamentos; adaptar os campos por modalidade |
| 3. Requisitos | UGC: nichos, idiomas, localização, experiência desejável, portfólio, estilo e habilidades. Influencer: redes, nicho, audiência, demografia e métricas disponíveis; não exigir seguidores em vaga exclusivamente UGC |
| 4. Entregáveis | Quantidades de vídeos/fotos, formato, resolução, duração, captação, roteiro, prazo, revisões e brutos; postagem e comprovação só quando aplicáveis |
| 5. Direitos de uso | Orgânico/mídia paga, canais, prazo, território, imagem/voz, exclusividade, brutos e renovação; termos devem compor a licença aceita |
| 6. Remuneração | Fixo por conteúdo/pacote/publicação, comissão por venda, bônus e produto como benefício; separar dinheiro, gifting e comissão |
| 7. Revisão/publicação | Resumo completo com vagas, orçamento e condições; salvar, publicar, pausar, encerrar inscrições e arquivar; backend rejeita publicação incompleta |

**U09 — Marketplace de campanhas:** navegação Creator → Descobrir → Campanhas. Filtros Todas/UGC/Influencer/Híbridas, pagas/gifting/afiliação, nicho, remuneração, localização, idioma e entregável. Card exibe logo, nome, modalidades, categoria, remuneração divulgada, entregável, prazo e status. Detalhe apresenta briefing e condições de cada vaga, indicando expressamente quando não exige audiência ou postagem.

**U10 — Candidatura por vaga:** abrir campanha → selecionar vaga/modalidade → escolher portfólio → escrever apresentação → informar orçamento/proposta se permitido → confirmar condições → enviar → marca avaliar, aprovar/rejeitar ou pedir informações. Persistir rascunho, data, autor e histórico. Impedir duplicidade por creator/vaga, salvo reaplicação explicitamente permitida.

### Estados e invariantes

| Recurso | Estados previstos | Regra obrigatória |
|---|---|---|
| Campanha | Rascunho, publicada, pausada, inscrições encerradas, arquivada | Publicar exige validação; pausar/arquivar não apaga contratos existentes nem cancela trabalhos silenciosamente |
| Candidatura | Rascunho, enviada, em análise, informações solicitadas, pré-selecionada, aprovada, rejeitada, retirada | Permissão de transição por ator no backend; histórico append-only; aprovação não equivale a aceite contratual |
| Vaga | Capacidade, ocupação e eventual reserva | Limite verificado atomicamente; definir quando reserva/ocupação é criada, expira ou é liberada antes da implementação |

Os estados desta seção detalham e substituem, para o escopo UGC, as propostas genéricas de campanha/participação da seção 6. Não são estados observados no produto privado da ShopMy.

## 19. Contratação, produção e direitos de uso

**U11 — Contratação direta:** marca descobre creator → seleciona serviço/convite → envia briefing, orçamento e prazo → creator aceita, recusa ou contrapropõe → partes confirmam condições → sistema registra acordo → cria projeto → inicia produção. Deve funcionar sem campanha pública. Uma proposta pode referenciar campanha/vaga, mas essa associação não é obrigatória na contratação direta.

**U12 — Propostas, contratos e licenças:** condições comerciais, entregáveis, cronograma, revisões, remuneração e direitos são versionados. Guardar identidade dos concordantes, versão aceita e data. Alteração relevante exige nova concordância; mensagem informal não substitui aceite. O mecanismo de formalização e os modelos contratuais ainda dependem de definição e revisão jurídica antes do uso comercial; este PRD define requisitos de produto, não fornece conclusão jurídica.

**Licença obrigatória:** usos orgânico/pago, canais, prazo, território, imagem/voz, exclusividade, arquivos brutos e condições de renovação. Não presumir direito de anúncio, exclusividade ou duração ilimitada pelo upload/aprovação. Registrar expiração e histórico; renovação deve produzir novo registro aceito. Definir a relação entre início da licença, entrega, aprovação e pagamento antes de ativar contratos reais.

**U13 — Workspace de produção:** Creator → Trabalhos → Projetos ativos; Marca → Campanhas → Produções. Cada projeto reúne identificação, partes, briefing, entregáveis, cronograma, referências, conversas, proposta aprovada, contrato/licença, status financeiro, revisões e entrega final.

**U14 — Upload e versões:** vídeos, imagens, documentos e brutos conforme contrato. Arquivos privados com autorização por vínculo, validação de tipo/tamanho e feedback de falha. Não sobrescrever entrega anterior; registrar autor, data, versão e relação com entregável. Limites de upload, quotas, retenção, processamento e análise de arquivos ainda devem ser definidos. URLs diretas não podem contornar autorização.

**U15 — Revisão e aprovação:** marca visualiza versão, comenta, aprova ou pede ajustes; creator reenvia nova versão; manter histórico. Aplicar o número de revisões contratado no servidor. Ajuste fora do limite exige acordo complementar, não alteração silenciosa de escopo.

**U16 — Cancelamento e disputa:** fluxos próprios com motivo, participantes, evidências, estado e auditoria; definir responsáveis e efeito sobre orçamento, prazos, licença e obrigações. Cancelar projeto não comprova estorno nem autoriza apagar histórico.

### Fluxo de produção exigido

Contratação confirmada → aguardando produto/materiais, quando aplicável → em produção → conteúdo enviado → em revisão pela marca → ajustes solicitados → reenviado → em revisão → aprovado → concluído. O ciclo de ajustes respeita o contrato. Estados de produção, contrato, licença e pagamento são separados; aprovar conteúdo não marca pagamento como recebido.

## 20. Comunicação, financeiro, afiliação e reputação

### U17 — Conversas e negociação

Conversas vinculadas a campanha ou projeto, participantes autorizados, texto, anexos, notificações e histórico. Suportar negociação de preço, prazo e contraproposta. Mensagem não altera contrato por si só: gerar proposta/aditivo e aceite quando necessário. Definir canais de notificação e preferências; testes usam destinatários sintéticos, sem disparos reais nesta etapa documental.

### U18 — Financeiro unificado, com naturezas separadas

| Visão | Informações obrigatórias |
|---|---|
| Creator | Receitas de produção UGC, publicação patrocinada, comissão de afiliado, bônus e outros serviços; contratado, recebido, pendente, em processamento, comissões aprovadas/estornadas e histórico |
| Marca | Orçamento total e comprometido, pagamentos UGC/influencer, comissões, gastos por campanha, custo por creator e retorno atribuível quando mensurável |
| Administrador | Supervisão de transações, obrigações, disputas e regras comerciais; acesso condicionado a papel e trilha de auditoria |

Produção UGC não depende de vendas; publicação tem cachê próprio, salvo pacote único expressamente acordado; comissão depende de qualificação e atribuição. Valores de produção/publicação/comissão/bônus não devem ser contados duas vezes. Produto recebido é benefício não monetário, nunca dinheiro recebido. As quantias e percentuais do anexo são exemplos, não preços, taxas ou política comercial aprovados.

**U19 — Obrigações e pagamentos:** obrigação nasce somente após condições aceitas e evento contratual definido. Transação, obrigação e receita exibida são registros distintos. Guardar origem, confirmação, identificador e histórico; operações financeiras e webhooks são idempotentes. Repetir evento não duplica saldo. Não afirmar recebimento sem confirmação correspondente; revisão de conteúdo não substitui confirmação financeira.

Sem gateway integrado, manter estados e registros identificados como pagamento externo ou integração pendente. Evidência externa deve ser rotulada e ter procedimento de verificação definido; não apresentar registro manual como confirmação automática de provedor. Nesta fase não usar serviços financeiros de produção. Provedor, taxas, impostos, repasses, reembolsos, conciliação e autorização operacional permanecem dependências a resolver antes de operações reais.

### U20 — Afiliação integrada

Preservar o que já funciona: vitrine, catálogo, busca, coleções e detalhes. Hoje não existem redes de afiliação, links rastreáveis, conversões, comissões ou histórico financeiro operacionais a preservar. Esses itens são pendências, não funcionalidades existentes.

Campanha pode associar produtos e comissão; creator elegível recebe identificador próprio. Documentar atribuição, janela, qualificação, duplicidade, estorno e fonte de confirmação. Clique, conversão observada e venda confirmada são eventos diferentes. Sem integração confiável, marcar conversão como não verificada e não gerar comissão confirmada. Não misturar comissão com remuneração fixa do projeto.

### U21 — Avaliações verificadas

Após projeto elegível concluído, somente participantes efetivos podem avaliar. Marca avalia conteúdo, comunicação, prazo e adequação; creator avalia briefing, comunicação, condições e colaboração. Impedir avaliação sem vínculo/antes da conclusão, duplicidade indevida e autoavaliação. Denúncias/moderação precisam de histórico e autorização. Não gerar avaliações automaticamente nem preencher perfis com notas fictícias. Política de publicação, contestação e edição permanece a definir.

## 21. Navegação e componentes da expansão

As áreas abaixo são **propostas de navegação**, não rotas já disponíveis.

| Área | Organização exigida |
|---|---|
| Creator | Visão geral; Descobrir (produtos, marcas, campanhas UGC/influencer/híbridas); Minha vitrine; Meu portfólio; Meus serviços; Candidaturas; Trabalhos (convites, negociações, ativos, entregas, concluídos); Mensagens; Analytics; Financeiro; Perfil/configurações |
| Marca | Visão geral; Descobrir creators; Favoritos/listas; Campanhas (todas, criar, rascunhos, publicadas, candidaturas, encerradas); Contratações diretas; Produções (em andamento, revisão, aprovadas, concluídas); Produtos/afiliação; Mensagens; Analytics; Financeiro; Equipe/configurações |
| Administração | Visão geral; Usuários; Creators; Marcas; Campanhas; Candidaturas; Contratações; Projetos UGC; Transações; Disputas; Moderação; Configurações |
| Consumidor | Descoberta, vitrines, busca, coleções, ofertas e saída para varejistas quando implementada; sem imposição de ferramentas de produção |

**U22 — Experiência integrada:** desktop/mobile, URLs diretas, carregamento, vazio, erro recuperável, validação, feedback de gravação e confirmação de ações irreversíveis. Preservar identidade Diderot. Não copiar código, identidade visual ou conteúdos proprietários da ShopMy; manter apenas padrões gerais de produto como referência.

Inventário proposto de componentes: `CampaignCard`, `CampaignTypeSelector`, `CampaignCreationWizard`, `CampaignDetail`, `ApplicationForm`, `ApplicationStatus`, `CreatorPortfolio`, `CreatorServiceCard`, `CreatorDiscoveryFilters`, `BrandCreatorCard`, `ProposalComposer`, `ContractSummary`, `ProjectWorkspace`, `DeliverableChecklist`, `ContentUploader`, `RevisionTimeline`, `PaymentBreakdown` e `EarningsDashboard`. Reutilizar primitives e tokens existentes quando adequados; esses componentes ainda não existem.

## 22. Modelo de dados incremental e autorização

Os nomes a seguir são sugestões lógicas da diretriz, **não migrations executadas**. Inspecionar o schema antes de criar tabelas e não duplicar `auth.users` com uma segunda fonte de identidade sem justificativa. As tabelas existentes são `collections`, `products`, `favorites` e, desde 12/11/2026, `creator_profiles` com campos iniciais e modalidades em array. Não criar outra tabela de perfis sem avaliar essa estrutura.

| Domínio | Entidades propostas |
|---|---|
| Identidade/perfil | `creator_profiles` inicial já existe; evoluir sem duplicar. Referência à identidade Auth; `creator_profiles`, `creator_modalities`, `creator_services`, `creator_portfolio_items`, `brand_profiles`, `brand_memberships` |
| Campanhas | `campaigns`, `campaign_slots`, `campaign_requirements`, `campaign_deliverables`, `campaign_products`, `campaign_applications`, `campaign_invitations` |
| Contratação/produção | `proposals`, `contracts`, `contract_deliverables`, `content_licenses`, `project_assignments`, `project_milestones`, `project_submissions`, `submission_files`, `revision_requests` |
| Comunicação | `conversations`, `conversation_participants`, `messages`, `message_attachments`, `notifications` |
| Financeiro | `payment_obligations`, `payment_transactions`, `creator_earnings`, `affiliate_commissions`, `bonus_awards`, `payout_requests` |
| Reputação/auditoria | `reviews`, `review_reports`, `audit_events` |

**Relações essenciais:** organização possui campanhas; campanha possui vagas; candidatura pertence a creator e vaga; proposta/contrato pode vir de candidatura ou contratação direta; projeto deriva de acordo aceito; submissão versiona entregável; arquivo pertence a submissão/projeto; licença aponta para a versão contratual aceita; obrigação discrimina natureza financeira. Agregados como ganhos podem ser derivados, evitando duplicar a fonte financeira de verdade.

**U23 — Integridade e segurança:** FKs e índices, unicidade de candidatura por vaga conforme política, limite de vagas atômico, timestamps/autoria, transições verificadas no backend, RLS onde aplicável, isolamento organizacional e autorização de arquivos. Migrações incrementais e reversíveis quando viável; preservar dados existentes e planejar mudanças de cardinalidade. Registro de auditoria não deve ser editável por quem está sendo auditado.

| Operação | Creator | Marca | Administrador |
|---|---|---|---|
| Editar portfólio/serviço | Próprio perfil | Não | Moderação conforme política, auditada |
| Criar/editar campanha | Não como creator | Membro autorizado da organização | Supervisão/moderação autorizada |
| Ver candidatura privada | Própria | Organização responsável pela vaga | Acesso operacional justificado |
| Aceitar contrato | Sua parte | Representante autorizado | Não aceitar por outra parte sem regra explícita |
| Enviar entrega | Projeto em que foi contratado | Referências/comentários autorizados | Acesso de suporte/moderação definido |
| Aprovar ou pedir revisão | Não aprova sua entrega como marca | Responsável pelo projeto | Mediação conforme política |
| Ler arquivo/mensagem privada | Vínculo com recurso | Vínculo com organização e recurso | Permissão específica; nenhuma exposição pública |
| Marcar pagamento confirmado | Nunca por alteração livre de saldo | Não por simples clique sem evidência | Procedimento auditável, respeitando origem da confirmação |

Modalidade profissional não é permissão administrativa. Um creator híbrido continua sem acesso a dados de outra pessoa ou organização.

## 23. Jornadas e testes obrigatórios da expansão

Todos os cenários abaixo estão **não executados**. São critérios de aceite futuros, com dados sintéticos e ambientes autorizados. Testes de financeiro usam sandbox ou confirmação externa verificável e rotulada, sem operar produção financeira.

| Cenário | Jornada a executar | Resultado exigido |
|---|---|---|
| UAT-A — UGC iniciante | Cadastrar → escolher UGC sem seguidores → adicionar dois vídeos → descobrir campanha UGC → candidatar → marca aprovar → ambas as partes aceitar → criar projeto → enviar → pedir revisão → reenviar → aprovar → registrar pagamento conforme confirmação | Jornada não exige perfil influencer, postagem pessoal ou venda; dados persistem e direitos constam do acordo |
| UAT-B — Influencer | Informar/conectar canais conforme integração → candidatar → aprovar/contratar → publicar → comprovar → associar link rastreável → registrar conversão verificada → calcular comissão | Fonte de métricas explícita; clique não confirma venda; cachê e comissão separados |
| UAT-C — Campanha híbrida | Criar vagas UGC, influencer e híbrida com limites próprios → candidaturas de cada modalidade → contratar → registrar entregas e pagamentos por natureza | Requisitos de audiência não vazam para UGC; capacidade e orçamento independentes; relatórios sem dupla contagem |
| UAT-D — Segurança/concorrência | Acessar candidatura alheia; marca acessar projeto de outra; creator alterar valores aceitos; abrir arquivo privado sem vínculo; duas aprovações para última vaga | Backend nega acessos/mutações e mantém limite de vagas; resultados auditáveis |
| UAT-E — Contratação direta | Solicitar serviço sem campanha → contraproposta → aceite de ambas as partes → projeto → entrega/revisão → conclusão | Campanha pública não é dependência obrigatória; contrato versionado |
| UAT-F — Direitos/revisões | Aceitar licença limitada → solicitar revisão além do contratado → alterar prazo/uso → renovar licença | Limite respeitado; mudança exige novo aceite; versões/licença anterior preservadas |
| UAT-G — Financeiro idempotente | Repetir confirmação/webhook, falhar processamento, registrar estorno e benefício em produto | Não duplica obrigação/transação/ganho; não marca pendente como recebido; gifting separado de dinheiro |
| UAT-H — Reputação e regressão | Participante concluído avalia; estranho tenta avaliar; denúncia/moderação; repetir jornadas públicas | Apenas avaliação elegível; histórico preservado; vitrine e contas não regridem |

Além dos fluxos felizes, testar dados inválidos, rascunho/reload, sessão expirada, falha de rede, upload interrompido, proposta recusada, campanha pausada, prazo encerrado, candidatura duplicada e cancelamento/disputa. Cada caso precisa de rota/ação, efeito no banco, releitura, permissão, erro, teste automatizado e uso móvel, como definido na seção 10.

## 24. Plano integrado de implementação e dependências

O plano abaixo amplia o backlog anterior; UGC não deve ser adiado como acessório depois de um marketplace exclusivamente influencer.

| Etapa | Escopo | Reutilização | Gate / dependência |
|---|---|---|---|
| E1 — Auditoria atualizada | Repositório, schema, rotas, Auth, campanhas, afiliação, Storage, financeiro e componentes; classificar nas cinco categorias | Documentos, testes e diagnóstico existentes | Inventário com evidência; não presumir integrações ausentes como funcionais |
| E2 — Fundação/modelagem | Concluir Auth real e favoritos; papéis/vínculos, modalidades, esquema incremental, estados e políticas | Supabase, migrações, cliente de conta | Duas contas e duas organizações isoladas; nenhum privilégio por seleção de UI |
| E3 — Onboarding/portfólio | U01–U06: UGC sem seguidores, perfil, serviços, mídia e diretório | Identidade visual e perfil público adaptado | Upload autorizado, releitura, acesso cruzado negado |
| E4 — Campanhas | U07–U10: sete etapas, vagas, marketplace e candidaturas | Catálogo e padrões de formulário | Campanhas UGC/influencer/híbrida; unicidade e concorrência verificadas |
| E5 — Contratação/produção | U11–U17: convite, proposta, acordo/licença, projeto, entregas, revisão, mensagens e disputa | Contas, organizações e armazenamento autorizado | UAT-A/E/F e permissões; aprovação não equivale a pagamento |
| E6 — Financeiro/afiliação | U18–U20: naturezas, obrigações, transações, comissões e relatórios | Catálogo; não há integração financeira existente | Sandbox/confirmações verificáveis, idempotência e atribuição; produção permanece desativada |
| E7 — Qualidade/reputação | U21–U23, acessibilidade, mobile, segurança, reputação e regressão integral | Suítes existentes | UAT-A–H e critérios de conclusão sem gaps críticos |

Qualidade é contínua em todas as etapas; E7 não autoriza adiar testes de segurança até o fim. Priorização: identidade/isolamento e integridade como P1; onboarding, campanhas por vaga, acordos e produção como P1 do marketplace UGC; afiliação analítica avançada e recomendações dependem dos contratos/fontes definidos. Datas e custos ainda não estão estimados.

**Dependências externas/comerciais a definir:** armazenamento e processamento de mídia; limites/retenção; templates e formalização contratual; início/expiração de licença; termos de exclusividade; gateway e sandbox; fonte confiável de conversões; regras de comissão/estorno; autorização de membros de marca; política de reserva de vagas; cancelamento/disputa; reputação e canais de notificação. Não preencher lacunas com métricas ou operações simuladas sem identificação.

## 25. Conclusão, relatórios e rastreabilidade da expansão

### Gate adicional de conclusão UGC

A expansão só está concluída quando um creator sem seguidores consegue cadastrar-se e produzir UGC; a marca cria campanhas UGC, influencer e híbridas com vagas distintas; candidaturas são persistidas e avaliadas; acordo registra condições/aceites/licença; projetos recebem arquivos reais de teste com versões; revisões e aprovação funcionam; financeiro discrimina produção, publicação e afiliação sem falsos recebimentos; todos os perfis têm navegação e autorização no backend; dados sobrevivem a nova sessão; os fluxos públicos existentes continuam funcionais; e os testes críticos passam.

Interface isolada, mock, política não testada, ausência de confirmação financeira e teste crítico não executado não satisfazem o gate. Se houver uma entrega parcial sem gateway ou com pagamentos externos, nomear explicitamente esse escopo e suas limitações; não declarar o marketplace completo. Nenhuma migração, rota, integração ou teste UGC foi executado por esta atualização do PRD.

### Relatório obrigatório por etapa

Registrar funcionalidades encontradas, reutilizadas e implementadas; arquivos criados/alterados; migrations executadas/pendentes; rotas adicionadas; integrações efetivamente funcionais; testes/resultados; pendências e bloqueios técnicos reais. Vincular commit, ambiente e evidência. Dependências de serviço, segredo ou decisão comercial devem permanecer explícitas.

### Cobertura do material fornecido

O [anexo integral U0](REFERENCIA-EXPANSAO-UGC.md) preserva o texto original, exemplos e instruções de implementação para as etapas futuras. A consolidação abaixo evita perder requisitos e distingue a diretriz do estado já implementado.

| Seções do Prompt Master U0 | Cobertura neste PRD |
|---|---|
| 1–2: contexto e regra fundamental | Visão, seção 16 e R01–R08 |
| 3: investigação existente | 16.2 e E1 |
| 4: usuários | A02, U01, seção 22 e matriz de permissões |
| 5–8: campanhas, criação, marketplace e candidaturas | U07–U10, seção 18 |
| 9–10: perfil, serviços e diretório | U01–U06, seção 17 |
| 11–12: contratação direta e produção | U11–U16, seção 19 |
| 13: propostas e mensagens | U12/U17 |
| 14–15: financeiro e afiliação | U18–U20 |
| 16: avaliações | U21 |
| 17: navegação | Seção 21 |
| 18: modelo de dados | Seção 22 |
| 19: componentes e UX | U22 e seção 21 |
| 20: dezessete regras críticas | R01–R17, seção 16 |
| 21: cenários A–D | UAT-A–D, ampliados por UAT-E–H |
| 22: plano de implementação | E1–E7, seção 24 |
| 23–24: conclusão e relatório | Seção 25 |
| 25: diretriz final | Visão integrada, UGC nativo e preservação da identidade própria |

**Histórico da versão 1.1:** incorporação documental da expansão solicitada, preservando requisitos REA e estado auditado. Nenhuma capacidade UGC foi reclassificada como entregue por ter sido incluída neste documento.


## 26. Incremento implementado em 12/11/2026

Esta seção atualiza o estado de implementação registrado antes da expansão; requisitos e critérios de aceite continuam válidos.

| Requisito | Implementação atual | Evidência / limite |
|---|---|---|
| A01/A03 | Cadastro, recuperação, atualização de senha e tratamento de link inválido; URLs `/cadastro` e `/recuperar-acesso` | Contratos de interface automatizados; nenhuma mensagem real enviada, retorno e configuração das URLs do Auth não validados |
| U01 | Seleção múltipla UGC/influencer/afiliado na mesma conta, editável e sem campo de seguidores | Migração aplicada e interface `/conta/criador`; não concede acesso administrativo/de marca |
| U02, início | Nome profissional, bio, cidade/UF; perfil privado do proprietário | Inserção/edição/releitura de interface com mocks; foto, nichos, idiomas, disponibilidade, portfólio e publicação ainda pendentes |
| T02 | RLS e grants de `creator_profiles`; sem leitura anônima nem UPDATE de user_id | Inspeção remota confirmada; script de isolamento entre dois usuários preparado, não executado |

Migração aplicada: `20261112101450_creator_onboarding.sql`. Testes novos: `tests/onboarding.spec.ts`. Detalhes de configuração e limites: [ONBOARDING.md](ONBOARDING.md). A versão 1.1 foi documental; esta versão acrescenta código e migração. Os demais módulos UGC continuam pendentes.

## 27. Serviços do creator — incremento de 12/11/2026

U04 agora possui gestão privada em `/conta/criador/servicos`: criar/listar/editar/excluir, dez tipos de serviço, preço inicial BRL ou sob orçamento e confirmação de exclusão. Migração `20261112161824_creator_services.sql` aplicada com RLS por proprietário e proteção de user_id. A oferta não cria contrato nem pagamento. Estado: PARCIAL; publicação no perfil, uso em contratação e validação remota entre usuários continuam pendentes. Evidências e aviso de segurança Auth: [SERVICOS-CREATOR.md](SERVICOS-CREATOR.md). Este incremento sucede as descrições anteriores de U04 como não implementado.

## 28. Portfólio por links — incremento de 12/11/2026

U03 agora tem gestão privada em `/conta/criador/portfolio`, com título, tipo, categoria, descrição, participação e URL HTTPS. Criar, editar, reler e excluir possuem controles e retorno confirmado do banco; exclusão não apaga o arquivo externo. Migração `20261112162722_creator_portfolio.sql` aplicada. Estado PARCIAL: upload de mídia, miniaturas, publicação, vínculo autorizado com marcas e métricas ainda ausentes; não declarar U03 completo. [Evidências e limites](PORTFOLIO-CREATOR.md). A privacidade na Diderot não altera a configuração do site de origem do link.

## 29. Painel e validação real — incremento de 12/11/2026

Disponível `/painel/criador` com perfil, serviços e portfólio, contagens remotas e estado de falha sem números fictícios. Login real e navegação móvel foram verificados com a conta demonstrativa solicitada. Persistência de serviços, portfólio e favorito foi confirmada em duas sessões da mesma conta; somente fixtures identificadas foram criadas/removidas. Testes RLS de favoritos/perfil/conteúdo com duas identidades temporárias e claims controladas passaram no banco remoto e foram revertidos. [Evidências e limites](PAINEL-CREATOR.md).

Essas evidências atualizam as afirmações históricas de Auth real/isolamento não testados. Ainda não comprovam dois logins reais distintos, entrega de e-mail, gestão de loja ou módulos brand/admin. A entrada de creator de GAP-02 existe agora; C02 continua parcial/ausente no que se refere a catálogo editável. Nenhuma migração adicional foi necessária.

## Atualização visual — 12/11/2026

Home reorganizada conforme estrutura e captura ShopMy fornecidas: hero, faixa móvel, Curadoria, Círculos/seleções, CTA, Categorias e Marcas; navegação por público, busca e rodapé. Reckless local substitui Tobias/ShopMy Plain; DM Sans permanece no corpo. Aplicados tokens neutros às telas existentes e oito fotografias reais ilustrativas em lugar de vetores. Filtros de categoria/marca/busca abrem resultados reais no catálogo.

[Implementação, origem das imagens e restrição da fonte TRIAL](DESIGN-SYSTEM-DIDEROT.md). Arquivos Reckless não publicados no GitHub: licença fornecida permite somente uso pessoal. Círculos pessoais, aplicativo nativo, concierge, campanhas, compras e gestão completa de marca/admin continuam pendentes. O visual da referência não altera esse estado funcional. Sem migrações nem dados reais nesta etapa.


## 30. Favoritos de visitante — incremento de 12/11/2026

S07/GAP-01: seleção local versionada mantém favoritos em reloads, navegação e nova aba da mesma origem. Inclusão/remoção e limpeza acompanham outras abas; falha de armazenamento não confirma sucesso. Dados inválidos são identificados e podem ser substituídos por ação explícita. Entrar e sair preserva a separação entre seleção local e favoritos privados; não há migração automática para a conta. Nenhuma alteração de schema/RLS ou dado real. [Comportamento, tabela funcional e limites](FAVORITOS.md). Painéis brand/admin e fundação de organizações continuam pendentes; esta correção não conclui o marketplace.

Também foi corrigida a atualização de sessão no perfil de creator: assinatura mantida durante a permanência na tela e releitura por `getUser` quando outra aba altera a sessão salva. Identificadores locais não concedem acesso. ONB-07/ONB-08 verificam troca de conta com e sem BroadcastChannel; diagnósticos e limites em FAVORITOS.md.

## 31. Organizações e painel da marca — 12/11/2026

B01 passa de ausente a PARCIAL: `/painel/marca` permite cadastrar, reler e editar uma organização privada por conta, com proprietário derivado da sessão e vínculo owner criado atomicamente pelo banco. Leitura somente pelo responsável ou membro vinculado; edição somente pelo responsável; não há escrita pública de membros nem transferência de proprietário. Migração `20261112213155_brand_organizations.sql` aplicada. [Regras e evidências](ORGANIZACOES.md).

SQL remoto com três identidades, API com duas contas temporárias/três sessões e navegador móvel com backend real exercitaram persistência e isolamento. Contratos da interface cobrem falha de leitura/escrita e retorno tardio após sair. Cadastrar a organização não significa aprovação comercial e não concede administração. Convites/equipe, aprovação, múltiplas organizações próprias, diretório, campanhas, métricas e administração continuam pendentes. Não altera as marcas fictícias da vitrine nem cria pagamento/contratação.

## 32. Equipe e convites internos — 12/11/2026

Disponível `/painel/marca` → Equipe e convites. O responsável pode registrar convite de leitura válido por sete dias, cancelar pendências e revogar membros. A pessoa convidada precisa entrar com o e-mail confirmado no banco, aceitar ou recusar; aceitar grava o vínculo e libera consulta à organização. Não há envio de e-mail ou descoberta global de contas. Convites repetidos, expirados, cancelados ou revogados têm transições verificadas e não elevam papel. Migração `20261112220605_organization_invitations.sql` aplicada. [Modelo, evidências e limites](EQUIPE-CONVITES.md).

Verificação real de mutações por SQL remoto com quatro identidades e ROLLBACK; API HTTP verificou bloqueio anônimo e caixa autenticada de leitura. A troca completa entre duas sessões Auth por HTTP, envio de e-mail, cargos de edição, saída voluntária e transferência continuam pendentes. B01 permanece parcial quanto à aprovação comercial; campanhas e administração não foram concluídas.

A revisão final de revogação foi reforçada pela migração `20261112223445_organization_team_remove_scope.sql`: UUID sem vínculo de membro na própria organização não altera convites nem consulta associações de e-mail. Suíte SQL com esse caso e 20/20 testes finais de marca/equipe aprovados; resultados integrais e limites preservados no progresso.

## 33. Rascunhos de campanhas por organização — 12/11/2026

U07/U08 passam a **PARCIAL**: `/painel/marca` → Campanhas em rascunho permite salvar/reler/editar contexto privado UGC, influencer ou híbrido e um grupo de vagas por modalidade, com quantidade e estimativa BRL por creator. UGC não exige seguidores. Responsável escreve; membro somente consulta. RLS, RPC transacional, versão esperada e repetição idempotente protegem isolamento e persistência. Migração `20261112225023_campaign_drafts.sql` aplicada. [Regras, tabela funcional, evidências e limites](CAMPANHAS-RASCUNHOS.md).

Este incremento substitui as descrições anteriores de campanhas totalmente ausentes apenas no escopo de rascunhos. Não conclui as sete etapas de U08, habilitação da marca, direitos/entregáveis/condições por vaga, produtos/referências, publicação, descoberta U09, candidatura U10, contratação ou financeiro. Próximo bloco: briefing completo e condições por vaga, antes de publicar oportunidades. Mutações reais e isolamento foram testados em PostgreSQL com fixtures revertidas; HTTP real verificou leitura autenticada e bloqueio anônimo; Chrome computador/celular usa contratos simulados. Não afirmar duas sessões Auth reais editando campanhas.

## 34. Acesso navegável por tipo de conta e publicação — 13/11/2026

Prioridade explícita da usuária: conseguir entrar e avaliar shopper, creator e marca com perfis/dados fictícios. Cadastro `/cadastro` agora registra a preferência de espaço; `/onboarding` conduz escolha → perfil específico → revisão → painel; `/conta/perfil` permite editar e trocar a preferência sem perder os demais contextos. Shopper tem `/painel/shopper` com interesses e favoritos reais. Creator e marca mantêm seus painéis e dados próprios, com navegação para perfil/conta/demonstração. Tipo de conta é uma preferência, não papel de autorização; vínculos por organização continuam independentes. Migração `20261112235032_account_profiles.sql` aplicada, RLS próprio e RPC INVOKER transacional.

`/demo` oferece três logins Auth reais, sem digitação de credenciais, exclusivamente em fixtures identificadas autorizadas. Shopper possui dois favoritos; creator dois serviços e um portfólio; marca uma organização e três rascunhos UGC/influencer/híbrido. Senhas somente no servidor e variáveis sigilosas da Vercel, após autorização explícita de transferência. Dados demonstrativos são compartilhados e podem ser editados; não usar dados pessoais. Nenhuma conta preexistente, e-mail ou serviço financeiro foi alterado/usado.

`/explorar/campanhas` e `/campanhas/demo/[slug]` mostram três briefings fictícios navegáveis, com imagens ilustrativas, estimativas e condições de exemplo. Isso não conclui U09/U10, não publica rascunhos privados nem oferece candidaturas. Upload/avatar, diretório/perfil público, aprovação comercial, publicação, contratação, produção, financeiro e administração continuam pendentes. [Tabela funcional, evidências, acesso e limites](ACESSO-DEMONSTRACAO.md).

GitHub → Vercel já estava conectado a `marigranadoc/diderot-platform`, branch `main`, no projeto existente da equipe `mari-granado`. Corrigida a configuração Other para Next.js; domínio principal https://diderot-platform-mari-granado.vercel.app. URLs de confirmação/recuperação desse domínio foram informadas pela usuária como autorizadas no Supabase; não afirmar entrega de e-mail real validada. Sessões, seed, persistência e isolamento das três fixtures passaram por API real. Testes finais de interface/publicação e seu alcance são registrados no progresso.

## 35. Referência adicional de navegação ShopMy — 13/11/2026

Fonte N1: [documento fornecido preservado integralmente](REFERENCIA-NAVEGACAO-SHOPMY.md), com sete estados de vitrine/editor descritos por horários de vídeo e propostas de catálogo/marca/campanhas. O [anexo de telas e fluxos](TELAS-FLUXOS-SHOPMY.md) consolida todas as 17 seções e os 14 critérios de aceite, sem substituir a diretriz UGC ou promover propostas a fatos observados.

O anexo contém captura real da home enviada pela usuária, catálogo REF com links por horário, requisitos NAV-C01–C08, inventário de telas atuais/propostas, campos/validações de produto, importação e relações N:N, jornadas shopper/creator/marca/UGC/afiliado/admin, estados móveis/acessíveis, modelo incremental, permissões e prioridades. A fonte é secundária: vídeos e prints do editor não estavam no arquivo e não foram reproduzidos nesta sessão. Não afirmar nova engenharia reversa autenticada ou telas privadas verificadas.

Decisões preservadas: shopper/creator/marca no cadastro; uma identidade com vários contextos sem privilégio por preferência; UGC nativo sem mínimo de seguidores; candidatura por vaga; afiliação como condição comercial separada da modalidade de trabalho; sete etapas U08 **com os mesmos nomes/ordem da seção 18**, acomodando os dez assuntos da fonte; produto canônico da marca separado de recomendação do creator. Operador/financeiro/admin são papéis futuros, não permissões já concedidas. A fonte não autoriza escolher provedor pago, regra fiscal ou publicação de produto externo.

Atualizado o estado consolidado: Auth/onboarding, favoritos, perfil/serviços/portfólio, organizações/equipe, rascunhos e demo já possuem entregas verificadas. Vitrine editável/publicação, catálogo de marca, campanha completa/candidatura, contratação/produção, tracking/financeiro e administração seguem pendentes. As próximas entregas estão ordenadas no anexo; o próximo incremento funcional recomendado continua briefing U08/condições por vaga nos rascunhos privados.

## 36. Preparação de desenvolvimento com Vibe Coding Toolkit — 13/11/2026

Adotado o caminho **configurar projeto existente**, revisão fixa `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`, com atribuição MIT. [Setup, seleção de todos os componentes e limites](setup.md). Preservados stack, lockfile, banco, permissões, identidade visual e integrações; nenhum scaffold substituiu o app.

Entregas locais: AGENTS com comandos/contexto/limites e bloco Next preservado; bridge opcional CLAUDE; arquitetura observada; documentos canônicos mapeados em vez de duplicados; [prompts de implementação/setup/segurança/melhoria de processo](prompts/README.md); [qualidade](quality.md) e verificações documentais automatizadas com fixtures negativas. `npm.cmd run check` combina documentos, testes do verificador e TypeScript; não substitui lint, auditoria integral, build ou jornada com banco real.

Modo de melhoria selecionado: adaptação nativa inspirada em Harness2. Comparativo local reproduz links para anexo faltante e verifica sua correção com o mesmo avaliador; não é benchmark oficial nem evidência de ganho do modelo. Context7 não disponível; reaproveitadas ferramentas/instruções existentes, sem instalação global, API paga ou serviços novos. Lint de aplicação e avaliações independentes do agente continuam com limitações explícitas em setup/qualidade.

Esta etapa consolida requisitos e preparação. Não implementa as novas telas do anexo, não altera dados reais, não usa serviços financeiros e não publica automaticamente. Resultados efetivamente executados estão em [setup-toolkit.json](evidencias/setup-toolkit.json) e no progresso. Gate de término: fonte preservada, conciliações e aceites rastreáveis, arquivos/links íntegros e checks registrados com seus limites.

## 37. Briefing privado em sete etapas — 13/11/2026

Implementado no frontend local em `/painel/marca` → Campanhas em rascunho: informações gerais, modalidades/vagas, requisitos, entregáveis, direitos de uso, remuneração e revisão/publicação. O backend recebeu a migração aditiva `20261113120556_campaign_briefing.sql`. Todos os campos novos são planejamento privado; salvar não publica, contrata, concede licença ou cobra. [Campos, auditoria, evidências e limites](CAMPANHAS-RASCUNHOS.md).

Referências visuais e produtos por nome/link HTTPS persistem em `campaign_drafts.briefing`; não são importação, upload ou vínculo ao catálogo. Cada grupo/modalidade possui requisitos, entregáveis, direitos e remunerações próprias em `campaign_draft_slots.briefing`. UGC não aceita mínimo de seguidores no backend; postagem é exigência explicitamente marcada. Valores de produção/publicação em centavos e comissão em pontos-base; nulo e zero têm significados distintos. Direitos são condições planejadas, sem aceite contratual.

Mantidos RLS, responsável editor/membro leitor, versionamento e retry idempotente do documento completo. Cliente antigo não pode regravar sem briefing um registro com condições novas. Conversão de linha do banco para formulário corrigida para selecionar só os campos editáveis, evitando que IDs/status/relacionamentos sejam enviados de volta ao RPC e bloqueiem edição. Navegação em etapas e nomes acessíveis das textareas recebem testes de reentrada/celular.

U07/U08 permanecem **PARCIAIS**: um grupo por modalidade, referências externas em vez de catálogo vinculado, sem múltiplas vagas da mesma modalidade, elegibilidade comercial, validador de completude para publicação, publicação/pausa/encerramento ou candidatura. Backend segue permitindo somente draft e rejeita tentativa de status publicado. Upload, contratos, licenças aceitas, entregas e financeiro continuam ausentes.

Banco real verificado com identidades efêmeras/ROLLBACK, incluindo persistência, inválidos, precisão, proteção contra cliente antigo, isolamento e revogação; suíte legada também passou. API real das três identidades demo verifica leitura e negação cruzada/anônima, sem gravação de negócio positiva. Resultados da interface e ambiente final no progresso; não equivalem a dois logins Auth editando por HTTP ou homologação comercial.

Atendendo à solicitação de detalhar o lançamento, o [plano do MVP](PLANO-LANCAMENTO-MVP.md) define onze blocos com dependências e gate de saída: escopo; contas; catálogo; vitrine; administração; campanhas/candidaturas; contratação/produção; afiliação; financeiro; operação/segurança; homologação/piloto. Reaproveita o que já existe, sem calcular percentual global ou assumir provedor financeiro/prazo. Recursos avançados só saem do primeiro lançamento por recorte explícito de escopo.

## 38. Loja própria, fotos de perfil e redes — 13–14/11/2026

Solicitação da usuária: foto de marca/creator/afiliada, foto no topo da loja, produtos, coleções, posts, adicionar produto, ver a própria loja e redes sociais abaixo de “Explore minhas escolhas”. As duas imagens fornecidas orientaram menu/seções e cinco formatos visuais; não comprovam API/fluxos privados da ShopMy. [Guia, tabela funcional e limites](LOJA-AFILIADA.md).

Implementado `/painel/criador/loja`, com perfil público e slug exclusivo, upload de fotos, Instagram/TikTok/YouTube e outras redes ordenáveis, itens externos pessoais/seleção do catálogo demo, seções com visuais Prateleiras/Editorial/Posts quadrados/verticais/horizontais, visibilidade/cópia/ordem, posts com foto/legenda e vários produtos. Há salvar/reler, prévia privada, publicação explícita, Ver minha loja em `/loja/[slug]` e retirada do ar. Dados salvos permanecem privados até publicar; editar não muda o snapshot anterior.

Marca troca a foto no cartão da organização: responsável edita e membro consulta. Creator/afiliada compartilham foto de perfil, usada no topo da loja após publicação. Redes aparecem como último elemento do cabeçalho, abaixo do CTA, com nome acessível e nova aba. Links HTTPS são informados pelo titular; não há conexão OAuth, publicação nas redes, métrica verificada ou cálculo de comissão.

Migração `20261113131815_creator_shops_media.sql` aplicada. Uma loja/documento transacional por titular, relações N:N por IDs validados, snapshot público e recibo/versão. Fotos ficam em bucket privado; servidor/banco verificam posse e associação publicada. Itens do catálogo preservam dados canônicos; recomendação externa pessoal não altera produto de marca. Perfil profissional/portfólio e entregáveis UGC continuam distintos da loja pública.

SQL com quatro identidades efêmeras/ROLLBACK passou, incluindo permissões de foto/Storage, snapshot/ocultos, IDs/URLs/valores, catálogo canônico, retry/versão, endereço permanente, e-mail confirmado, membro somente leitura e retirada. Seed API real criou somente loja fictícia `clara-demonstracao`, dois itens e um post, verificando upload privado, negação anônima antes da publicação, salvamento/releitura/retry, publicação e foto pública por URL temporária. [Evidência de banco/API](evidencias/loja-banco-api.json).

Primeira interface: 36/40 aprovados; quatro falhas por seletor de alerta confundindo o anunciador interno Next. Corrigido somente escopo do seletor. Revalidação de 14/11: **40/40 aprovados**, 246,5 segundos, desktop/celular, sem skips/retries, incluindo loja, marca e onboarding. [Inicial](evidencias/loja-interface-inicial.json) e [final](evidencias/loja-interface-final.json). SHOP-04 usa Auth/loja reais em leitura; demais SHOP simulam contratos/upload e exercitam reprocessamento de imagem no Chrome. Não afirmar upload de retrato em conta real; a autorização de foto foi verificada em SQL e fluxo de navegador simulado.

C02 e NAV-C01–C07 têm entrega no escopo documentado; vídeo, catálogo operacional de marcas, diretório/moderação, rastreamento/comissões e pagamentos continuam pendentes. Endereço permanece fixo após publicar; não há renomeação com redirects. O frontend deste incremento está na prévia local, sem nova publicação Vercel. Não foram alterados dados reais de negócio ou usados serviços financeiros.


## 39. Apresentação da loja e catálogo — 14/11/2026

Solicitação: redes sociais somente com ícones abaixo de Explore minhas escolhas; avatar vazio sem texto; produtos no visual anterior; retirar a comunicação de demonstração da interface.

Implementado: ícones SVG acessíveis por rede (nome acessível, foco e nova aba), silhueta neutra para perfis sem foto, cards compactos do catálogo com fotografia 4:5, nome/marca/preço, quatro colunas no desktop e duas no celular. Busca, ordenação por preço e favoritos dos itens canônicos usam os comportamentos existentes; produtos externos preservam destino HTTPS e identificação de link afiliado. Posts seguem separados dos cards de produto. Trocar seção reinicia o filtro de categoria.

Faixa e rótulos demonstrativos removidos da navegação, home, catálogo, produto, campanhas e acessos. Textos conhecidos das contas de avaliação são apresentados sem os rótulos por uma camada de apresentação. Registros de origem, IDs, rotas e controles de permissão permanecem preservados; nenhuma alteração em massa no banco. Ler uma conta não salva automaticamente os textos apresentados. Aviso de contas compartilhadas e indisponibilidade real de compras/inscrições permanecem, sem sugerir operações financeiras ativas.

Critérios de aceite: redes sem texto visível e com nome acessível; ausência de Sem foto; ausência de rótulos demonstrativos no corpo visível da loja; cards responsivos; busca/ordenação/favorito com releitura; detalhe do produto acessível. Evidência e limites da rodada estão no progresso. Não transforma dados sintéticos em catálogo comercial validado nem comprova lançamento do MVP.


## 40. Perfil, foto e confirmação de cadastro — 15/11/2026

A edição em /conta/perfil abre diretamente o formulário preenchido, com Salvar perfil; mantém validação, RPC atômico e releitura antes de navegar. Alterar tipo de conta continua disponível e não altera permissões de organizações. Creator/afiliada com perfil profissional salvo encontra Escolher foto de perfil nesta tela. Marca responsável encontra Escolher foto da marca. A mesma referência de foto é usada na configuração da loja e na navegação privada; a foto da creator aparece no topo da loja pública após publicar/atualizar a publicação. Upload continua privado em WebP, com validação, tratamento de erro e confirmação por releitura. Não foi criado um novo bucket ou cadastro paralelo de avatar. Foto de shopper sem perfil profissional/organização continua fora deste incremento.

As rotas /conta e /painel compartilham navegação de perfil: identidade/foto, Meu perfil, Minha loja, Produtos, Coleções, Posts, Serviços, Portfólio e Perfil profissional para creator; caminhos pertinentes para marca e shopper. No celular, navegação horizontal com rolagem; no desktop, lateral. Links de seção efetivamente trocam a área e respeitam formulário aberto na loja.

Cadastro sem sessão orienta: Confirme seu e-mail para continuar. Procure a mensagem da Diderot na caixa de entrada e no spam. Depois, entre na sua conta. Cadastro com sessão continua para onboarding. Reenviar confirmação chama Auth resend para o e-mail da solicitação concluída, mesmo que o campo seja editado depois. Falhas e limite de solicitações não exibem sucesso. Recuperação informa solicitação recebida, sem afirmar existência de conta ou entrega da mensagem. Nenhuma confirmação de e-mail foi desabilitada.

Consulta somente leitura de /auth/v1/settings confirmou cadastro habilitado, e-mail habilitado e confirmação obrigatória; isso não comprova entrega SMTP nem clique no e-mail real. Testes de signup/reenvio/recuperação usam mocks e não enviam e-mails. Resultados e pendências no progresso. Sem migrações ou alteração de contas reais neste incremento.

No retorno de cadastro sem nova identidade (resposta ofuscada) ou no erro explícito de conta já cadastrada, a interface oferece entrada e recuperação, sem inventar envio de confirmação. Não consulta lista de usuários ou usa chave administrativa. A entrega e o clique em um e-mail real continuam sem teste ponta a ponta nesta etapa.


## 41. Entrada, confirmação e destino do cadastro — 16–17/11/2026

Depois de entrar com e-mail/senha, a aplicação valida o titular no Auth, lê account_profiles e abre o painel correspondente ao cadastro concluído; sem perfil ou onboarding incompleto, abre /onboarding. Não escolhe o painel por user_metadata ou parâmetro next. A sessão é comparada novamente depois da leitura para não abrir o perfil anterior após troca/saída. Erro de consulta mantém opção de tentar abrir novamente, sem inventar perfil ou sucesso. /conta continua disponível para gestão/saída, sem redirecionar automaticamente uma visita comum de quem já está conectado.

Novos envios e reenvios de confirmação usam /auth/retorno. Essa página aguarda a sessão processada pelo SDK, verifica usuário/e-mail confirmado e encaminha ao onboarding/painel; limpa parâmetros do endereço e não reflete descrições recebidas no link. Link inválido/expirado não simula confirmação. O fluxo legado /conta continua disponível para links anteriores. Entrega/clique de e-mail real ainda precisam de homologação; não foi alterado SMTP ou allowlist de redirecionamento.

A solicitação HTTP de entrada compartilhada é abortada após 20 segundos e permite tentar novamente; antes de obter resposta válida não encerra a conta anterior. As consultas de Auth da rota de servidor possuem prazo de 12 segundos por requisição. Logout continua local e instalação de sessão mantém verificação de identidade. Isso não é prova de prazo total de todos os passos internos do SDK. Server-Timing registra só duração; teste real anexa somente etapas, status e tempos, sem tokens, e-mails ou corpos de resposta. Causa dos timeouts históricos ainda não é atribuída a uma etapa sem evidência.

Mapa e limites: [Acesso e onboarding](ACESSO-ONBOARDING.md). Sem migrações, permissões novas ou operações financeiras. Evidências e próxima ação no progresso.

Login com email_not_confirmed disponibiliza reenvio de confirmação na própria tela, vinculado ao endereço daquela tentativa. O novo caso de callback testa também o processamento do fragmento de confirmação pelo SDK e a remoção de tokens do endereço, com sessão sintética.


## 42. Publicação e verificação no domínio público — 17/11/2026

Preparar GitHub/Vercel com os incrementos locais já verificados, preservando projeto, equipe, variáveis e banco. Não publicar credenciais, fontes TRIAL ou relatórios privados. Verificar revisão vinculada, build, rotas, ausência de redirecionamento para login Vercel e jornadas de leitura das contas fictícias no computador/celular. Status inicial e final em [publicação](PUBLICACAO-VERCEL.md) e progresso. Não declarar validação SMTP ou conclusão de financeiro/administração como resultado de deploy.


## 43. Organização da loja em três camadas — 18/11/2026

Referência: [guia fornecido de construção e edição da ShopMy](REFERENCIA-CONSTRUCAO-LOJA-SHOPMY.md). As instruções do guia descrevem a ShopMy; não comprovam capacidades existentes na Diderot. Pedido: adaptar o fluxo para uma experiência de criação semelhante a app, corrigir envio de foto de produto e acrescentar o botão + inferior direito.

Modelo: **seções → coleções → produtos/links**. Seções são abas públicas; coleções agrupam produtos e posts dentro de uma seção. Um produto pode aparecer em várias coleções, com a mesma referência e foto. Não se cria um link rastreado por posição. Coleções antigas são associadas à seção Minhas escolhas quando lidas e no próximo salvamento explícito; nenhuma loja preexistente é regravada em massa. Limites: 20 seções, 50 coleções, 200 produtos, 100 posts.

Fluxo de criação: Minha loja → + → Novo produto → Adicionar por URL, Catálogo ou Meus produtos. URL abre cadastro manual de nome, destino HTTPS, foto e recomendação. Parâmetros do link são preservados: não remover automaticamente query que pode conter variante/afiliação. Catálogo abre busca por nome/marca; selecionar abre formulário antes de salvar, permitindo foto própria e escolha de coleções. Meus produtos abre os registros existentes; editar permite marcar outra coleção para reutilizar ou desmarcar a anterior para mover. Sem coleção, o item aparece em Todas as escolhas e na primeira seção visível. Links não têm rastreamento/comissão ativa.

+ → Nova coleção: escolher seção existente ou criar uma nova no próprio formulário; título, descrição, visual, produtos e posts, visibilidade. + → Nova seção e o + ao final das abas abrem o cadastro da aba. Nome/visibilidade e ordem de seções são editáveis; remover exige uma seção restante e nenhuma coleção vinculada. Coleções permitem editar, duplicar, ocultar, ordenar dentro da seção, arquivar/restaurar e remover com confirmação. Produtos podem ser ordenados globalmente e dentro da coleção pelos controles acessíveis de subir/descer. Ordenação por arrastar/pressionar não integra esta entrega.

Rascunho e público: salvar confirma a gravação por releitura; publicar exige confirmação explícita. Primeiro abre a primeira seção visível; cards de coleção abrem seus conteúdos e oferecem retorno à seção. Prévia privada aplica a mesma regra de elegibilidade da publicação: seções ocultas e coleções ocultas/arquivadas são excluídas. Um produto associado apenas a grupos privados também é excluído; continua público se estiver em outra coleção pública ou em post público. Itens/posts sem coleção continuam elegíveis por sua própria visibilidade. A publicação anterior permanece até publicar novamente. Endereço da loja continua permanente após a primeira publicação.

Foto de produto: correção do bloqueio que ocultava o envio para itens do catálogo, descartava image_path na validação e priorizava a foto canônica na vitrine. Agora a loja aceita foto própria, validada por titular/pasta/arquivo existente, sem alterar nome, marca, preço ou destino canônico do catálogo. O arquivo continua privado até publicação. JPEG/PNG/WebP até 20 MB na entrada, máximo 60 MP; conversão WebP com lado de até 1600 px e saída de até 4 MB. Avatar mantém corte 512×512. Há alternativa de decodificação quando createImageBitmap não está disponível. HEIC/HEIF depende do navegador; falha orienta exportar JPEG/PNG/WebP e preserva os campos. Enviar foto não substitui Salvar produto nem Publicar alterações.

Critérios de aceite: + alcançável no celular/desktop; menu modal com foco e Escape; quatro criações reais; catálogo permite foto própria; vínculo coleção/seção e arquivamento persistem/releem; ordenação afeta a vitrine; conteúdo oculto não vaza pelo snapshot nem índice de mídia; usuário cruzado não salva/reutiliza arquivos de outro titular; erro mantém formulário; prévia e publicação consistentes. Evidências e falhas em [progresso](PROGRESSO-DIDEROT.md).

Pendências explicitamente fora da implementação: extração automática de título/imagem por URL; navegação embutida em sites de varejistas e Create Link; normalização de variantes; alternativas de varejista/comissão; link separado e métricas por posição; links comerciais gerados pela plataforma; compartilhar para Diderot, extensão Safari e teclado iOS; drag-and-drop com suporte móvel. Não exibir botões de sucesso para essas integrações ausentes. Manter as pendências anteriores de administração, contratação e financeiro no plano do MVP.


Validação do incremento 43: publicado e conferido no domínio da Vercel; evidências no progresso. Limite do rascunho: produto externo visível precisa de foto e destino completo ao publicar, inclusive se sua coleção estiver oculta; desmarcar a visibilidade do produto enquanto incompleto. Ocultar/arquivar coleção não altera a visibilidade individual do registro. A elegibilidade pública do grupo e a completude individual são verificações distintas.


## 44. Reformulação UX/UI — 18/11/2026

Pedido da usuária: [Master Prompt UX/UI](REFERENCIA-UX-OVERHAUL.md). Preservar a identidade Diderot, arquitetura e dados; simplificar tarefas com intenção → configuração mínima → prévia → confirmação. Esta diretriz substitui a clonagem literal da ShopMy como objetivo visual. Referência de experiência não autoriza copiar textos, identidade ou código proprietário.

Ambiente: www.shopdiderot.com responde com a aplicação Diderot; trabalho em feat/ux-overhaul-2026-11-18 a partir de main 16a63fe. [Diagnóstico e inventário](UX-OVERHAUL.md). Não atualizar main nem publicar automaticamente em produção; entregar branch/PR e prévia para revisão. Nenhuma tabela/RLS/API deverá mudar só para facilitar o novo frontend.

Escopo implementado em validação: seleção de intenção antes dos campos de senha, mesmas validações Auth; onboarding com opcionais recolhidos e revisão; navegação inferior para creator/marca/shopper e seletor de espaços baseado em perfil profissional/vínculos existentes, sem alterar preferências ou conceder permissões; painel de creator com ação principal e checklist calculado dos dados relidos; loja inicia em prévia quando existente, edição visual com busca e filtros; produto novo em duas etapas (essenciais e destino/prévia), coleção nova em três (identidade, conteúdo, prévia); edições existentes diretas; arquivar/restaurar/duplicar/ordem preservados em menus secundários; arrastar para reordenar no desktop e botões acessíveis como alternativa; serviços/portfólio criados sob demanda com seleção de tipo e prévia privada; perfil com prévia e localização opcional; marca por tarefas e edição curta com prévia; campanhas filtráveis pelos dados existentes; catálogo com limpar e filtros na URL; compartilhamento real de loja por Web Share/clipboard.

Critérios: voltar preserva campos; fechar/navegar com alterações pede confirmação; required visível na etapa pertinente; envio duplicado bloqueado; erro mantém valores; sucesso só após retorno confirmado existente; checklist sem valores inventados; espaços não concedem acesso por metadata; nenhuma candidatura/contratação/comissão simulada. Fotos usam a infraestrutura atual. Portfólio continua por URL, sem upload novo; serviços continuam privados e preço opcional. Produtos/coleções continuam em rascunho até publicação explícita. Limites funcionais anteriores permanecem no plano do MVP.

Verificação: rodadas por módulo e jornadas de leitura com contas fictícias; seis larguras, teclado, erros e capturas antes/depois. Sem cadastro SMTP real, escritas em contas reais ou operações financeiras. Comparações devem medir campos/etapas/cliques observados; não inventar conversão ou declarar certificação WCAG só por inspeção. Resultados, falhas e pendências no progresso.


Estado de entrega do incremento 44: implementado e validado localmente, com revalidação final 92/92 e [PR de revisão](https://github.com/marigranadoc/diderot-platform/pull/1). Build Vercel Ready em prévia protegida; produção preservada. Não equivale a homologação automatizada dessa implantação nem conclusão dos módulos futuros do MVP.
