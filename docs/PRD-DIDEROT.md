# PRD Diderot — produto, implementação e próximos passos

**Versão:** 1.0 · **Consolidado em:** 12/11/2026 · **Base de evidências:** inspeções e execuções de 11/11/2026.

**Estado:** documento de referência para desenvolvimento. O estado implementado está documentado; as decisões de produto propostas estão identificadas e ainda precisam ser validadas. Não representa aprovação para lançamento.

**Código-base desta versão:** [eb8639a](https://github.com/marigranadoc/diderot-platform/commit/eb8639a0973b5552df360cd9bb9404eaf8be89af). Este PRD consolida o estado atual; matrizes antigas em outros documentos permanecem como histórico.

## 1. Visão e objetivo

A Diderot será uma plataforma de descoberta de produtos por curadoria de pessoas, conectando shoppers, creators e marcas. O shopper deve encontrar escolhas relevantes, conhecer quem recomenda, organizar favoritos e acessar o varejista. O creator deve administrar sua presença e suas seleções. A marca deve encontrar creators e acompanhar parcerias. A administração deve controlar acesso, aprovações e moderação.

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

Não há cadastro público, recuperação de senha, papéis de creator/brand/admin, gestão de catálogo, candidatura, campanhas, moderação, diretórios de múltiplos creators, grupos, perfil de gosto, recomendações, afiliados ou relatórios. Não houve publicação do site, uso de pagamentos, envio de mensagens, compra ou alteração de dados reais. A implementação de login e favoritos não comprova uma jornada autenticada remota concluída.

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
| A01 | Login, logout e recuperação — observado E2 | Parcial: login/logout por senha, teste simulado; recuperação ausente | Sessão real, credenciais inválidas, expiração, retorno após reload e saída verificados; recuperação com token expirado/reutilizado tratada em ambiente de teste | P1 |
| A02 | Papéis shopper/creator/brand e isolamento — observado E2 e exigência local | Ausente para papéis; favoritos têm política por usuário | Papel e propriedade validados no servidor/banco; selecionar perfil na tela não concede privilégio; usuário não promove a si mesmo | P1 |
| A03 | Cadastro e confirmação de conta — proposta para completar jornada | Ausente | Criar conta em ambiente de teste, confirmar quando exigido, tratar duplicidade e erros; definir reenvio e retorno após confirmação | P1 |

Não existe aprovação de estratégia de múltiplos papéis por conta. Proposta inicial: todo usuário pode atuar como shopper; creator e brand exigem habilitação; administrador nunca é papel autoatribuível. A decisão final deve anteceder a migração de papéis.

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

**Atual:** cliente de login/logout e operações de favoritos implementados; contrato de interface simulado passou. Não há conta real de teste registrada nem cadastro público. A transferência de favoritos temporários para a conta é uma decisão pendente, não um comportamento implementado.

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
| `/conta` | Cliente Supabase Auth para conta existente | Login remoto, cadastro e recuperação ainda não concluídos |
| URLs inválidas | Página 404 e recuperação | Não equivale a proteção de área privada |

São 14 endereços de conteúdo existentes: 13 da vitrine mais `/conta`, além do comportamento 404. Slugs dos produtos: `bolsa-oliva`, `camisa-linho`, `serum-botanico`, `vaso-organico`, `sandalia-trama`, `creme-essencial`, `bolsa-areia`, `vaso-calcario`.

### Propostas, ainda não implementadas

`/explorar`, `/criadores`, `/marcas`, `/criadores/[slug]`, `/favoritos`, `/grupos`, `/meu-gosto`, `/cadastro`, `/recuperar-acesso`, `/candidatura/criador`, `/candidatura/marca`, `/painel/criador`, `/painel/marca` e `/admin` são uma proposta de organização. Não devem ser apresentadas como rotas existentes. A migração do perfil público `/criador` para múltiplos creators deve manter redirecionamento ou compatibilidade dos links atuais.

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
| Uma pessoa com vários papéis | Política não definida | Antes de migrar A02 |
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
