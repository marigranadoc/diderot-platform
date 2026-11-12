# PRD Diderot — produto, implementação e próximos passos

**Versão:** 1.2 — primeiro incremento de contas e onboarding UGC · **Atualizado em:** 12/11/2026 · **Base de implementação:** histórico de 11/11/2026 e incremento de 12/11/2026, detalhado na seção 26.

**Estado:** documento de referência para desenvolvimento. O estado implementado está documentado; as decisões de produto propostas estão identificadas e ainda precisam ser validadas. Não representa aprovação para lançamento.

**Diretriz incorporada nesta versão:** expansão fornecida pelo usuário em [Prompt Master — UGC Marketplace + Creator Commerce](REFERENCIA-EXPANSAO-UGC.md), preservado integralmente como fonte. As seções 16–25 convertem essa diretriz em requisitos, estados, critérios de aceite e plano incremental. UGC é um módulo nativo e obrigatório do escopo-alvo, não uma capacidade comprovada pelo REA nem já implementada. Esta atualização é documental; não executa as instruções de implementação contidas no anexo.

**Código-base desta versão:** [eb8639a](https://github.com/marigranadoc/diderot-platform/commit/eb8639a0973b5552df360cd9bb9404eaf8be89af). Este PRD consolida o estado atual; matrizes antigas em outros documentos permanecem como histórico.

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

Esta consolidação reutiliza as capturas existentes. Não apresenta uma nova inspeção da ShopMy em 12/11/2026. Evidência pública capturada não revela código privado, algoritmo de recomendação, cálculo de comissão, políticas internas ou telas administrativas.

## 3. O que já foi entregue

### 3.1 Produto e interface

- Aplicação Next.js, React, TypeScript e Tailwind CSS, com layout responsivo.
- Inicial editorial, perfil público da criadora fictícia Clara Martins, três coleções e oito páginas de produto.
- Busca por nome/marca tolerante a acentos, caixa e espaços; filtros Moda/Beleza/Casa; ordenação por seleção e preço.
- Detalhe com ilustração SVG original, marca, preço fictício, nota da criadora, navegação e informação de disponibilidade demonstrativa.
- Estado vazio com limpeza de filtros, página 404 com retorno, foco visível e verificações pontuais de teclado.
- Tela `/conta` com login/logout para contas existentes, mensagens de erro e indicação de que cadastro público ainda não está disponível.
- Favoritos temporários para visitantes e operações de favoritos por conta implementadas, aguardando validação remota completa.
- Tratamento de falha de catálogo com nova tentativa; o modo conectado não substitui falhas silenciosamente por dados locais.

### 3.2 Dados, integração e operação

- Código salvo no [repositório GitHub](https://github.com/marigranadoc/diderot-platform).
- Projeto Supabase `mbxpwrgfujnjonyxzvfw` conectado à vitrine; criação das tabelas `collections`, `products` e `favorites` por migrações versionadas.
- Três coleções e oito produtos fictícios persistidos. Na última inspeção registrada: zero usuários Auth e zero favoritos.
- Leitura pública apenas de catálogo publicado; bloqueio de escrita de catálogo para visitantes e usuários autenticados comuns.
- Regras de favoritos por usuário, inspecionadas no banco; teste comportamental de isolamento ainda não executado.
- Chave publicável em configuração local ignorada pelo GitHub, sem chave de serviço no cliente.
- Automação Playwright em computador e celular e encerramento do servidor temporário corrigido no Windows.

### 3.3 Defeitos corrigidos

| Defeito | Correção aplicada | Evidência |
|---|---|---|
| Disponibilidade apenas rolava até conteúdo ainda fechado | Controle nativo abre a explicação no próprio clique e pelo teclado | AUD-02 e AUD-05 |
| Busca falhava com acentos e espaços | Normalização de termos e campos pesquisados | AUD-04 |
| Servidor de testes ficava aberto após a execução | Executor controla processos Node diretamente e preserva código de saída | Relatório de encerramento e execução conectada |
| Teste de conta confundia mensagem da página com aviso interno do Next.js | Seletor limitado à região principal | AUTH-01/02 reexecutados: 4 aprovados |

### 3.4 O que não está concluído

Cadastro e recuperação agora têm formulários integrados, mas a jornada com e-mail/Auth real permanece sem validação. Há perfil inicial privado e modalidades profissionais; não há papéis operacionais de creator/brand/admin, gestão de catálogo, candidatura, campanhas, moderação, diretórios de múltiplos creators, grupos, perfil de gosto, recomendações, afiliados ou relatórios. Não houve publicação do site, uso de pagamentos, envio de mensagens, compra ou alteração de dados reais. A implementação de login e favoritos não comprova uma jornada autenticada remota concluída.

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
| S03 | Perfil público de creator — observado E0 | Parcial: bio/avatar fixos | Perfil vinculado a creator, edição autorizada e publicação; redes e prova social somente quando houver dados verificáveis | P1 |
| S04 | Coleções e seus produtos — observado E0 | Leitura remota verificada; gestão ausente | Criar/editar/publicar coleção própria, reler e conferir isolamento; não misturar itens de outra coleção | P1 |
| S05 | Busca na loja — observado E0; normalização própria | Verificado no catálogo carregado | Manter nome/marca e vazio; busca em grande catálogo e comportamento de abrir/fechar ainda não implementados | P1 para funcionamento; P2 para expansão |
| S06 | Categorias/ordenação — E0 e decisão local | Verificado: categoria e preços | Não atribuir ordenação por preço à ShopMy sem evidência; decidir restauração de filtros e URL antes de prometer persistência | P2 |
| S07 | Favoritos — observado E0; persistência exigida | Parcial: cliente e tabela implementados; contratos simulados passam | Salvar/remover, recarregar, sair/entrar e conferir em outra sessão real; dois usuários isolados; repetição e falhas sem falso sucesso | P1 |
| S08 | Detalhe e disponibilidade — observado E0 | Verificado como demonstração | Manter nota da curadoria e preço fictício; disponibilidade atual não é estoque, compra nem confirmação comercial | P1, base existente |
| S09 | Saída para varejista — observado E0, sem compra | Ausente | URL de teste válida e vinculada ao produto; validação de destino; tratar indisponibilidade; não anunciar venda/comissão por haver clique | P2 |
| S10 | Grupos de curadores — tela observada E3 | Ausente | Definir privacidade; criar, nomear, adicionar/remover creators, editar e excluir grupo próprio com releitura e acesso cruzado negado | P2 |
| S11 | Perfil de gosto — estado inicial observado E3 | Ausente; regra a definir | Definir entradas, limiar e atualização; explicar estado insuficiente; provar resultado com dados de teste. Não assumir algoritmo ou limiar de 25 da referência | P3 |
| S12 | Galeria e opções de compra — observado E0 | Ausente; produto usa uma ilustração | Galeria acessível e oferta vinculada ao item; selecionar opção muda destino/informação correta. Sem opções fictícias apresentadas como reais | P2 |
| S13 | Recomendações e conteúdo relacionado — observado E0 | Ausente | Seções semelhantes/mesma marca/outros curadores com regra própria documentada, exclusão de conteúdo privado e vazio coerente | P3 |
| S14 | Outros creators que compartilharam o item — observado E0 | Ausente | Relação produto/creator com fonte verificável; abrir perfil correto; não inventar contagem ou recomendação | P2 |
| S15 | Redes sociais e adicionar creator a grupo — observado E0 | Ausente | Links válidos informados pelo creator; adicionar grupo autorizado e confirmado; dependências C02/S10 | P2 |

O convite ao aplicativo visto na referência é registrado como observação, não como requisito de criar aplicativo nativo nesta versão.

### 5.2 Contas e autorização

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| A01 | Login, logout e recuperação — observado E2 | Parcial: login/logout e recuperação implementados; contratos simulados | Sessão real, credenciais inválidas, expiração, retorno após reload e saída verificados; recuperação com token expirado/reutilizado tratada em ambiente de teste | P1 |
| A02 | Papéis shopper/creator/brand e isolamento — observado E2 e exigência local | Ausente para papéis; favoritos têm política por usuário | Papel e propriedade validados no servidor/banco; selecionar perfil na tela não concede privilégio; usuário não promove a si mesmo | P1 |
| A03 | Cadastro e confirmação de conta — proposta para completar jornada | Parcial: formulário e resposta de confirmação implementados; e-mail real pendente | Criar conta em ambiente de teste, confirmar quando exigido, tratar duplicidade e erros; definir reenvio e retorno após confirmação | P1 |

A diretriz U0 define que uma conta creator pode reunir UGC, influencer e afiliado, sem cadastros separados. Essas modalidades profissionais são diferentes de papéis de segurança. Continua pendente a política de acumulação entre shopper, creator, membro de marca e administrador. Proposta inicial: shopper pode habilitar atuação creator; marcas têm vínculo organizacional; administrador nunca é autoatribuível. A seleção de modalidades não concede acesso a recursos de terceiros.

### 5.3 Creator

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| C01 | Candidatura — primeira etapa observada E1 | Ausente | Nome público, nome legal, e-mail e telefone foram observados; definir necessidade de cada dado na Diderot. Validar, salvar, reler status e proteger informações privadas; etapas seguintes não foram observadas | P1 |
| C02 | Gestão de loja, coleções e produtos — declarado E1 | Ausente; `/criador` é apenas perfil público | Criar/editar, salvar, recarregar, publicar/despublicar e conferir versão pública; impedir edição de outro creator; registrar erros e alterações relevantes | P1 |
| C03 | Links de afiliado e desempenho — declarado E1 | Ausente | Definir vínculo creator/produto/destino, fonte de eventos e cálculo; simular atribuição, duplicidade e falhas; não confundir clique com comissão | P2 |
| C04 | Parcerias com marcas — declarado E1 | Ausente | Creator vê apenas suas propostas; aceita/recusa e acompanha status; mudanças persistem e partes não autorizadas são bloqueadas | P2 |

### 5.4 Marca

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| B01 | Entrada/candidatura brand — seleção observada E2 | Ausente | Definir formulário próprio, dados, status, aprovação e identidade da organização; seleção de perfil não conclui cadastro | P1 |
| B02 | Descoberta e seleção de creators — declarado E1 | Ausente | Diretório com filtros definidos, perfil correto e lista de seleção persistente; não expor dados privados da candidatura | P2 |
| B03 | Campanhas, gifting e oportunidades — declarado E1 | Ausente | Criar rascunho, publicar para destinatários autorizados, aceitar/recusar, encerrar e reler; falhas e transições inválidas tratadas; sem bens ou mensagens reais nos testes | P1 para MVP brand |
| B04 | Métricas de desempenho — declarado E1 | Ausente | Fonte, janela, fórmula e acesso por organização explicitados; ausência de dados distinta de zero; dados simulados rotulados | P2 |

### 5.5 Administração e plataforma

| ID | Requisito e origem | Estado atual | Critério de aceite / pendência | Prioridade |
|---|---|---|---|---|
| M01 | Entrada e gestão administrativa — exigência do usuário | Ausente | Sessão e papel verificados antes da operação; negação para anônimo/outro papel; alterações auditáveis | P1 |
| M02 | Aprovação e moderação — proposta Diderot | Ausente | Revisar candidatura, aprovar/rejeitar com motivo, consultar histórico e bloquear transições inválidas | P1 |
| T01 | Banco/persistência — exigência do usuário | Parcial: catálogo remoto e migrações verificados; favoritos sem E2E real | Concluir mutações, releitura entre sessões, consistência e erros para cada entidade; catálogo estático não deve mascarar falha de integração | P1 |
| T02 | Permissões por papel/proprietário — exigência do usuário | Parcial: leitura do catálogo e bloqueio de escrita verificados; política de favoritos inspecionada | Testes reais de acesso cruzado, papel incorreto, sessão inválida e mutação indevida; nenhuma confiança em user_metadata para conceder privilégio | P1 |
| T03 | Erros e recuperação — exigência do usuário | Parcial: 404/vazio verificados; interface de erro de catálogo; erros de Auth/favoritos simulados | Automatizar indisponibilidade e recuperação do catálogo; validar sessão expirada, rede, validação de formulário e gravação repetida | P1 |
| T04 | Testes e uso móvel — exigência do usuário | Parcial: Chromium desktop/mobile; testes e evidências existentes | Jornadas completas, navegadores adicionais e aparelhos reais; acessibilidade e desempenho além das verificações pontuais | P1 |

Nenhuma tela administrativa da ShopMy foi inspecionada. Os requisitos M01/M02 são da Diderot.

## 6. Jornadas e estados de UX

### J1 — Shopper visitante

**Atual:** inicial → perfil público → coleção/busca/filtro → produto → explicação de disponibilidade → retorno. O visitante pode marcar favoritos temporários e recebe convite para entrar. Essa seleção não é retida entre sessões.

**Alvo:** descobrir vários curadores → produto → salvar com conta ou acessar varejista. A compra acontece fora da Diderot nesta proposta; checkout próprio não é requisito aprovado.

**Estados obrigatórios:** carregamento, lista com resultados, vazio recuperável, produto inexistente, falha de catálogo, favorito temporário, pedido de login e destino indisponível.

### J2 — Shopper com conta

**Alvo:** cadastrar/confirmar → entrar → salvar → recarregar → sair → entrar novamente → reencontrar → remover. Repetir em outra sessão e com segunda conta sem acesso ao primeiro conjunto.

**Atual:** cliente de login/logout e operações de favoritos implementados; contrato de interface simulado passou. Não há conta real de teste registrada; o formulário de cadastro está implementado, sem validação da entrega/retorno do e-mail. A transferência de favoritos temporários para a conta é uma decisão pendente, não um comportamento implementado.

**Estados obrigatórios:** conta não confirmada, credenciais inválidas, envio em andamento, sessão expirada, falha de salvar/remover, confirmação de resultado e logout. Não mostrar sucesso antes de confirmar a operação.

### J3 — Creator

**Alvo proposto:** candidatura → status de revisão → aprovação → configurar loja → criar coleção → adicionar produto → salvar rascunho → publicar → conferir página pública → editar e reler.

**Atual:** para na entrada; painel e candidatura inexistentes. A loja Clara não prova gestão de creator.

**Estados propostos:** candidatura em rascunho/enviada/em análise/aprovada/rejeitada; conteúdo em rascunho/publicado/arquivado. A política de reenvio e suspensão precisa ser decidida. Esses estados não foram extraídos da ShopMy.

### J4 — Marca

**Alvo proposto:** cadastrar organização → obter habilitação → descobrir creators → criar campanha em rascunho → selecionar participantes → publicar oportunidade → acompanhar aceite/recusa → encerrar → consultar resultado.

**Atual:** nenhuma etapa privada implementada. Gifting significa somente fluxo de solicitação e acompanhamento com dados de teste nesta fase, sem envio físico.

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
| `/conta` | Login/logout e links de conta | Validação remota completa pendente |
| `/cadastro` | Criação por e-mail/senha | Confirmação real e destinos do Auth não validados |
| `/recuperar-acesso` | Solicitação de link e atualização de senha | Entrega de e-mail real não validada |
| `/conta/criador` | Perfil privado e modalidades UGC/influencer/afiliado | Sem seguidores; testes de contrato simulados; isolamento SQL pendente |
| URLs inválidas | Página 404 e recuperação | Não equivale a proteção de área privada |

São 17 endereços de conteúdo existentes: 13 da vitrine, `/conta`, `/cadastro`, `/recuperar-acesso` e `/conta/criador`, além do comportamento 404. Slugs dos produtos: `bolsa-oliva`, `camisa-linho`, `serum-botanico`, `vaso-organico`, `sandalia-trama`, `creme-essencial`, `bolsa-areia`, `vaso-calcario`.

### Propostas, ainda não implementadas

`/explorar`, `/criadores`, `/marcas`, `/criadores/[slug]`, `/favoritos`, `/grupos`, `/meu-gosto`, `/candidatura/criador`, `/candidatura/marca`, `/painel/criador`, `/painel/marca` e `/admin` são uma proposta de organização. Não devem ser apresentadas como rotas existentes. A migração do perfil público `/criador` para múltiplos creators deve manter redirecionamento ou compatibilidade dos links atuais.

## 8. Identidade visual e fidelidade à referência

| Aspecto | Observação REA | Implementação Diderot | Pendência de fidelidade |
|---|---|---|---|
| Destaque inicial | Fotografia ampla, título serifado grande, navegação e seta | Composição editorial verde com ilustração original | Comparação visual formal; fotografia não foi incorporada |
| Tipografia | Serifada nos títulos, sem serifa na interface | Georgia e Arial | Fontes exatas da referência não verificadas; definir tipografia própria final |
| Cabeçalho | Escuro e compacto; adaptação móvel | Cabeçalho escuro e logo Diderot | Comparar espaçamento, hierarquia e comportamento nos breakpoints |
| Perfil | Imagem circular, autoria, bio, redes, grupos | Avatar ilustrado, nome, bio e aviso fictício | Redes, grupo e informações verificadas de creator |
| Navegação | Abas horizontais, categorias/contagens e busca expansível | Coleções, filtros e busca sempre visível | Abrir/fechar busca não reproduzido; avaliar navegação horizontal acessível |
| Produtos | Grade, destaque para imagem; duas colunas no celular | Grade responsiva com SVGs próprios | Galeria, favoritos no detalhe e metadados complementares |
| Detalhe | Imagens/miniaturas, informações, outros curadores, ofertas e relacionados | Ilustração, preço, nota e disponibilidade demo | S12/S13/S14 e saída comercial |
| Estados | Carregamento observado no produto | Erro, vazio e 404; estados de gravação | Inventário visual de carregamento, sucesso, bloqueio e falha em todos os módulos |

**Tokens implementados, próprios da Diderot:** texto `#23241f`, papel `#faf9f6`, verde `#354333`, divisórias `#deded7`, secundário `#727469`; cabeçalho com ajuste escuro `#20211e`. Esses valores não são tokens extraídos da ShopMy.

**Aceite visual proposto:** comparar telas equivalentes em 390 × 844 e desktop; verificar hierarquia, grid, proporções, espaçamento, contraste, estados de foco e ausência de corte. Não exigir equivalência pixel a pixel com assets distintos nem declarar equivalência sem comparação. Novos módulos devem reutilizar tokens e componentes documentados.

**Pendências de design system:** consolidar escala de tipografia/espaçamento, catálogo de componentes, variantes/estados, regras de imagens, ícones, formulários, tabelas e navegação dos painéis. O CSS atual não constitui uma biblioteca de design system completa.

## 9. Dados e permissões

### Modelo atual confirmado no código e nas últimas inspeções

| Entidade | Campos principais | Acesso atual | Limite |
|---|---|---|---|
| `collections` | slug, nome, categoria, descrição, posição, publicação, demo, data | Leitura de publicadas para anon/authenticated | Sem proprietário ou editor |
| `products` | slug, nome, marca textual, preço, categoria, coleção, tipo/cor da ilustração, nota, posição, publicação, demo, data | Leitura se produto e coleção estiverem publicados | Marca não é entidade; produto pertence a uma única coleção; sem URL comercial |
| `favorites` | user_id, product_slug, created_at; chave composta | SELECT/INSERT/DELETE do próprio usuário; sem UPDATE; anônimo sem acesso | Políticas inspecionadas, isolamento comportamental pendente |
| `auth.users` | Identidade gerida pelo Supabase Auth | Utilizada como referência dos favoritos | Zero registros na última inspeção; sem camada de papéis Diderot |

Migrações: [catálogo](../supabase/migrations/20261111212222_diderot_demo_catalog.sql) e [favoritos](../supabase/migrations/20261111213111_shopper_favorites.sql).

### Evolução proposta, não implementada

Perfis, habilitações de papel, lojas, organizações/membros, candidaturas, relação de itens por coleção, grupos/membros, campanhas/participações, destinos de varejista, eventos de desempenho e registros de auditoria. Antes de migrar, decidir se um produto pode aparecer em várias coleções/creators e como evitar duplicação. O esquema atual não suporta esse comportamento por si só.

| Ator | Leitura prevista | Escrita prevista | Proibições obrigatórias |
|---|---|---|---|
| Visitante | Conteúdo público | Nenhuma escrita persistente pessoal | Dados privados, rascunhos e favoritos de contas |
| Shopper | Público + próprios favoritos/grupos | Próprias preferências/grupos | Alterar outro usuário ou atribuir papel |
| Creator habilitado | Público + sua gestão/propostas | Sua loja/coleções e respostas autorizadas | Catálogo privado alheio; aprovação da própria candidatura |
| Membro brand habilitado | Dados da organização e creators públicos | Campanhas e seleções da organização conforme permissão | Organização alheia e dados privados de candidatura |
| Administrador | Escopo operacional definido | Aprovação/moderação autorizadas e auditadas | Operações sem identidade, rastreabilidade ou política definida |

Essa matriz é alvo do produto. Hoje não existem papéis operacionais de creator, brand ou administrador. A leitura pública e as regras de favoritos são os controles já implementados.

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
| Cadastro público e confirmação | Sem fluxo ou configuração verificados end-to-end | Antes de concluir F1 |
| Uma pessoa com vários papéis | Modalidades UGC/influencer/afiliado na mesma conta definidas por U0; acúmulo de papéis organizacionais ainda pendente | Antes de migrar A02 |
| Favoritos de visitante e migração para conta | Temporários hoje; transferência não implementada | Antes de reespecificar GAP-01 |
| Produto compartilhado entre creators/coleções | Esquema atual é insuficiente para múltiplas relações | Antes do CRUD multi-creator |
| Aprovação e suspensão | Estados deste PRD são propostas | Antes de C01/B01/M02 |
| Privacidade de grupos e candidaturas | Política ainda não definida | Antes de coletar dados novos |
| Perfil de gosto e recomendações | Somente estados públicos observados, algoritmo desconhecido | Antes de S11/S13 |
| Afiliados e métricas | Sem provedor, fonte ou regra aprovada | Antes de C03/B04 |
| Imagens/fotografia e tipografia final | SVGs/Georgia/Arial atuais; assets da referência não incorporados | Na consolidação visual |
| Cobertura da referência | Áreas privadas não inspecionadas | Registrar novos requisitos como proposta até haver evidência |
| Prontidão operacional | Sem deploy validado, carga, recuperação e monitoramento completos | Antes de lançamento |

## 15. Gate de lançamento e manutenção deste PRD

O MVP só pode ser tratado como concluído quando todas as jornadas escolhidas para sua versão tiverem critérios de aceite cumpridos, testes reais de persistência/autorização, recuperação de erro e uso móvel. Se uma versão excluir brand ou administração, essa redução precisa ser explícita no escopo; não pode ser anunciada como plataforma completa.

Cada mudança de status deve incluir data, commit, ambiente, teste executado e limite da evidência. Manter [PROGRESSO-DIDEROT.md](PROGRESSO-DIDEROT.md) como registro de execução e este PRD como referência de requisitos/estado consolidado. Não calcular percentual global de conclusão a partir da quantidade de telas ou de testes simulados.

**Próxima entrega recomendada:** concluir a fundação de identidade e a validação real de favoritos antes de ampliar os painéis. O catálogo remoto já fornece uma base concreta; as jornadas de shopper autenticado, creator, marca e administrador ainda não estão concluídas.

## 16. Expansão nativa: UGC Marketplace + Creator Commerce

**Origem:** U0, diretriz do usuário. **Estado de implementação:** U01 e o início de U02 foram implementados parcialmente em 12/11/2026; os demais módulos novos abaixo permanecem não implementados. A identidade visual, a vitrine, o catálogo e a base de contas devem ser reutilizados conforme sua validação atual, sem reconstrução indiscriminada.

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
| Modalidades, portfólio, serviços, diretório profissional | NÃO IMPLEMENTADA | Criar após identidade/propriedade |
| Campanhas, vagas, candidaturas e contratações | NÃO IMPLEMENTADA | Não há módulo de campanhas a reconstruir; implementar núcleo unificado |
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
