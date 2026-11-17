# PRD de referência UX/UI — Diderot

**Versão:** 1.0  
**Data:** 13/11/2026  
**Objetivo:** especificar cadastro, área de marcas, catálogo e inclusão de produtos da Diderot, usando a ShopMy como referência funcional e visual, com identidade e regras próprias.

## 1. Síntese

A Diderot conecta marcas, creators, UGC creators e consumidores em uma plataforma de descoberta e monetização de produtos. A experiência deve permitir que:

1. Creators criem uma vitrine pública, encontrem produtos, gerem links rastreáveis, organizem coleções e acompanhem conversões e ganhos.
2. Marcas cadastrem sua operação e catálogo, publiquem campanhas, encontrem creators, recebam entregas UGC e acompanhem resultados de afiliados.
3. Consumidores descubram produtos, listas e conteúdos com uma rota clara até a loja da marca.
4. A equipe Diderot revise cadastros e ofertas, modere conteúdo e resolva exceções operacionais.

O material em vídeo demonstra principalmente a experiência de creator: vitrine, navegação por seções, pesquisa/inclusão de produtos e organização de conteúdo. Não mostra um fluxo completo de cadastro nem o portal administrativo de marcas. Por isso, as áreas de marca, onboarding, pagamentos e operação abaixo são requisitos propostos para a Diderot, e não afirmações de que estavam visíveis nos vídeos.

## 2. Evidências e limites da referência

| Fonte | Trecho observado | O que sustenta |
|---|---|---|
| [Vídeo 1 — I tried ShopMy Affiliate Marketing as an Amazon Influencer](https://www.youtube.com/watch?v=uxgy0fjd8Gw) | 02:58 | A apresentadora comenta pesquisar se uma marca está disponível na ShopMy. A tela mostrada nesse instante não é uma captura legível da ShopMy. |
| [Vídeo 1](https://www.youtube.com/watch?v=uxgy0fjd8Gw&t=892s) | 14:52 | A vitrine/listagem de produtos aparece dentro do vídeo; a autora fala sobre links de afiliados e divulgação de produtos. |
| [Vídeo 2 — Utilizando links de afiliados da ShopMy para criadores](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=128s) | 02:08 | Vitrine pública com grade de produtos e navegação de loja. |
| [Vídeo 2](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=200s) | 03:20 | Perfil público do creator com identidade, navegação e seções de produtos. |
| [Vídeo 2](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=266s) | 04:26 | Grade de produtos/looks em uma seção da loja. |
| [Vídeo 2](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=333s) | 05:33 | Janela de gerenciamento das seções da vitrine. |
| [Vídeo 2](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=400s) | 06:40 | Tela de inclusão/edição de produto com imagem e campos do item. |
| [Vídeo 2](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=467s) | 07:47 | Grade de conteúdo visual usada como vitrine; miniaturas atuam como entrada para itens/links. |
| [Vídeo 2](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=533s) | 08:53 | Seleção de produtos em grade para a loja/coleção. |

**Leitura visual:** os vídeos são gravações de tela em baixa resolução, com a interface ocupando apenas parte do quadro e, em alguns trechos, com sobreposição da apresentadora/legendas. Os timestamps acima servem para reabrir cada estado no vídeo. As capturas individuais foram exibidas durante esta conversa; os links do quadro levam ao ponto correspondente.

## 3. Problema e oportunidade

Marcas precisam distribuir produtos e campanhas por meio de creators com atribuição mensurável. Creators precisam encontrar marcas confiáveis, transformar produtos em conteúdo e receber com clareza. Consumidores precisam de recomendações organizadas, úteis e transparentes sobre publicidade/afiliados.

A Diderot deve reduzir o trabalho manual entre descoberta, convite, entrega, publicação, rastreamento e pagamento. O produto deve unir três mecanismos relacionados, mas independentes:

- **Afiliados:** produto + link ou cupom rastreável + comissão por venda atribuída.
- **UGC:** briefing + proposta/contrato + produção + aprovação + entrega + remuneração por conteúdo/uso.
- **Campanhas híbridas:** combinação explícita de remuneração por conteúdo, produto enviado e/ou comissão.

## 4. Objetivos e métricas

### Objetivos do produto

- Completar o onboarding de creators e marcas sem ajuda humana na maioria dos casos.
- Publicar uma vitrine pública de creator que possa ser compartilhada fora da plataforma.
- Tornar simples adicionar, categorizar, editar e retirar produtos.
- Permitir às marcas controlar catálogo, campanhas, seleção de creators, conteúdo e pagamentos.
- Dar rastreabilidade por creator, campanha, produto e link/cupom.
- Manter status de moderação, elegibilidade e pagamento compreensíveis.

### Métricas iniciais

- Taxa de conclusão do cadastro por tipo de conta.
- Tempo entre cadastro e primeira ação de valor (publicar produto, criar campanha ou aplicar).
- Percentual de creators que publicam pelo menos um produto na vitrine.
- Produtos publicados por creator ativo e taxa de produto com link válido.
- Campanhas publicadas, candidaturas qualificadas, aceites e conclusão no prazo.
- Cliques, sessões, pedidos atribuídos, receita, comissão provisionada e comissão paga.
- Taxa de reprovação de cadastro/conteúdo e motivo.
- Tickets de suporte por etapa e falhas de rastreamento.

## 5. Papéis e permissões

| Papel | Permissões principais |
|---|---|
| Creator / UGC creator | Gerir perfil e vitrine; pesquisar produtos; criar coleções; candidatar-se a campanhas; enviar conteúdo; ver contratos, links, métricas e saldo. |
| Marca — proprietário | Criar organização; gerir membros e faturamento; catálogo; campanhas; creators; aprovações; relatórios e pagamentos. |
| Marca — operador | Operar catálogo, campanhas e conteúdo conforme permissões atribuídas pelo proprietário. |
| Consumidor | Navegar em vitrines e páginas públicas; abrir produto/loja; opcionalmente guardar favoritos. Não vê dados privados de campanha ou creator. |
| Operação Diderot | Revisar organizações, produtos, perfis e campanhas; moderar; resolver disputa; ajustar estados operacionais com trilha de auditoria. |
| Financeiro Diderot | Consultar repasses, faturas, comissões, estornos e conciliação; acesso limitado a dados necessários. |

Um usuário pode pertencer a mais de uma organização. A Diderot deve permitir alternar contexto sem misturar dados pessoais, de creator e de marca.

## 6. Mapa de navegação

### Área pública

- Página inicial / descoberta
- Explorar creators
- Explorar produtos e coleções
- Página pública do creator (vitrine)
- Página pública de produto
- Entrar
- Criar conta
- Sobre / como funciona / políticas

### Área do creator

- Visão geral
- Minha vitrine
- Produtos
- Coleções
- Buscar produtos
- Campanhas
- Minhas candidaturas e campanhas ativas
- Conteúdos UGC e entregas
- Links e cupons
- Desempenho
- Ganhos e pagamentos
- Perfil e canais sociais
- Configurações

### Área da marca

- Visão geral
- Catálogo de produtos
- Novo produto / editar produto
- Campanhas
- Nova campanha
- Descobrir creators
- Candidaturas e seleção
- Entregas e aprovações UGC
- Afiliados, links e cupons
- Conversões e relatórios
- Faturamento / pagamentos
- Membros e permissões
- Configurações da organização

### Área administrativa Diderot

- Fila de cadastros
- Revisão de marca e domínio
- Revisão de creator e canais
- Moderação de produto, campanha e conteúdo
- Pagamentos e conciliação
- Denúncias e disputas
- Auditoria e logs

## 7. Fluxo de cadastro e onboarding

### 7.1 Entrada

Na primeira tela, apresentar duas escolhas com texto explicativo, sem exigir que a pessoa compreenda nomenclaturas internas:

- **Quero criar conteúdo e recomendar produtos** — creator, afiliado ou UGC creator.
- **Quero divulgar minha marca e trabalhar com creators** — marca/loja.

O mesmo e-mail não deve criar duas contas pessoais distintas. Após login, o usuário pode criar ou aceitar convite para outro contexto.

### 7.2 Cadastro comum

Campos obrigatórios:

1. Nome completo.
2. E-mail e confirmação/verificação.
3. Senha com requisitos apresentados antes do envio ou login via provedor social.
4. País de residência e idioma.
5. Aceite dos termos e política de privacidade em controles separados.
6. Preferências de comunicação opcionais, desmarcadas por padrão.

### 7.3 Onboarding de creator

1. **Tipo de atuação:** afiliado, UGC, influencer, ou combinação.
2. **Perfil:** nome público, @handle, foto, bio curta, cidade/estado opcional.
3. **Canais:** plataforma, URL/handle, faixa de audiência opcional, categoria/conteúdo principal.
4. **Preferências:** nichos, produtos que aceita divulgar, formatos, faixa de preço para UGC, interesse em produto enviado, comissão e/ou fee.
5. **Dados de pagamento e fiscais:** coletar apenas quando necessário para pagar, em etapa segura posterior; não misturar no perfil público.
6. **Revisão e publicação:** resumo do perfil, preview da vitrine e checklist do que falta.

Estados: `rascunho` → `e-mail pendente` → `em revisão` (se aplicável) → `ativo` / `requer ajustes` / `rejeitado`. Exibir motivo e ação seguinte; não deixar o usuário preso em estado genérico.

### 7.4 Onboarding de marca

1. **Conta da organização:** razão/nome comercial, país, moeda, site/domínio, categoria e tamanho da operação.
2. **Pessoa responsável:** nome, cargo, e-mail corporativo, telefone opcional.
3. **Verificação:** domínio de e-mail, site e dados comerciais necessários; indicar prazo e documentos faltantes.
4. **Modelo de trabalho:** afiliado, UGC, campanhas híbridas ou envio de produtos.
5. **Comercial e operações:** faixas de comissão, regiões atendidas, logística de amostras, prazo de aprovação, políticas de conteúdo e pagamento.
6. **Conexão de loja:** plataforma/e-commerce; URL, integração disponível, feed/catálogo ou inclusão manual.
7. **Convidar equipe:** e-mail + papel; convite pendente/cancelado.
8. **Checklist de ativação:** verificar marca, adicionar produtos, definir comissão, criar campanha e revisar perfil público.

Estados: `rascunho` → `verificação pendente` → `em revisão` → `ativa` / `requer ajustes` / `suspensa`. Somente marcas ativas podem publicar campanhas ou ativar produtos; pode-se permitir rascunho antes da aprovação.

## 8. Área de marcas

### 8.1 Visão geral

Mostrar quatro grupos de informação, com período selecionável:

- **Atividade:** campanhas ativas, candidaturas novas, conteúdos para revisar.
- **Desempenho:** cliques, pedidos atribuídos, vendas, receita, comissão e taxa de conversão.
- **Ações pendentes:** produtos incompletos, links quebrados, entregas vencendo, faturas.
- **Atalhos:** cadastrar produto, criar campanha, descobrir creators.

Cada métrica deve ter definição, moeda, janela de atribuição e data da última atualização disponíveis em tooltip/ajuda.

### 8.2 Catálogo de produtos

Lista com busca, filtros, ordenação e estados:

- Busca por nome, SKU, URL, categoria ou creator associado.
- Filtros: ativo/rascunho/pausado; estoque; categoria; integração; com/sem comissão; com/sem imagem; data de atualização.
- Colunas/cartões: imagem, nome, SKU, preço/moeda, comissão, estoque/status, canal de venda, cliques/vendas, atualizado em.
- Ações: visualizar, editar, duplicar, pausar/reativar, copiar link, adicionar a campanha.
- Importação: CSV/feed/API com prévia, validação e relatório de linhas recusadas.
- Deduplicação por SKU + loja ou URL canônica. Registrar origem/importação e manter histórico de alterações.

### 8.3 Descobrir creators

- Busca por nome/handle e filtro por plataforma, nicho, país/região, faixa de audiência, tipo de trabalho, faixa de preço, disponibilidade e desempenho.
- Perfil detalhado: canais conectados/verificados, bio, exemplos de conteúdo, categorias, formatos, métricas com período/data, modelo de parceria, campanhas anteriores e avaliações verificadas.
- Ações: salvar em lista, convidar para campanha, enviar convite direto, abrir conversa na plataforma.
- Restringir métricas privadas e dados de contato à permissão e contexto contratual adequados.

### 8.4 Campanhas

Wizard de campanha em etapas:

1. Nome, objetivo e modalidade (UGC, afiliado, híbrida).
2. Produtos e lojas elegíveis.
3. Entregáveis (quantidade, formato, duração, dimensões, direitos de uso, mídia paga/whitelisting se aplicável).
4. Perfil de creator e critérios de seleção.
5. Oferta: fee, produto/amostra, comissão, bônus e quem paga frete/impostos.
6. Briefing, mensagens-chave, restrições e exemplos de referência.
7. Datas: candidatura, seleção, envio, entrega, revisão, publicação e término.
8. Região, idioma e regras de elegibilidade.
9. Orçamento e fonte de pagamento.
10. Preview, validação e publicação.

Estados: `rascunho`, `em revisão`, `agendada`, `aberta`, `pausada`, `encerrada`, `cancelada`. A candidatura percorre `recebida`, `em análise`, `convidado`, `aceita`, `recusada`, `retirada`.

### 8.5 Entregas UGC

Quadro ou lista por campanha com criador, briefing, prazo, versão enviada, feedback, estado da aprovação, direitos e pagamento.

- Aprovar, solicitar alteração com comentário por versão ou rejeitar com motivo.
- Manter histórico de versão e comentários.
- Não permitir que “aprovar conteúdo” represente aceite de direitos comerciais; direitos/licenças são termos separados.
- Só marcar como concluído após cumprir entregáveis e registrar confirmação de pagamento conforme contrato.

## 9. Novo produto — especificação item por item

### 9.1 Ponto de entrada

Botão **Novo produto** no Catálogo, atalho na Visão geral e ação **Adicionar produtos à campanha**. Ao abrir, oferecer três caminhos:

1. Importar da loja/feed conectado.
2. Buscar produto existente no catálogo Diderot / marca integrada.
3. Cadastrar manualmente.

Creators adicionam itens existentes à própria vitrine por pesquisa, URL ou catálogo permitido. Eles não podem criar um produto oficial da marca em nome da marca. Se o item ainda não existir, creator pode propor/importar link para revisão, sem publicar como item verificado até haver validação.

### 9.2 Campos do cadastro manual da marca

| Campo | Regra |
|---|---|
| Nome do produto | Obrigatório; até 120 caracteres; texto simples. |
| Marca / organização | Preenchido pelo contexto de organização; não editável por usuário sem permissão. |
| SKU / identificador | Recomendado; único por loja quando informado. |
| URL canônica da loja | Obrigatória para produto comprável; validar domínio e redirecionamento. |
| Imagem principal | Obrigatória; upload/URL com preview, proporção e tamanho validados. |
| Imagens adicionais | Opcional; definir ordem e texto alternativo. |
| Descrição curta | Obrigatória; limite explícito e contador. |
| Categoria e subcategoria | Obrigatória; taxonomia Diderot, com sugestão automática revisável. |
| Preço e moeda | Obrigatório; valor positivo; guardar moeda original e preço observado. |
| Disponibilidade/estoque | Em estoque, baixo, esgotado, sob encomenda ou desconhecido. Sincronizar quando integrado. |
| Variações | Cor, tamanho, modelo ou outra opção; variante tem SKU/URL/preço/estoque próprio. |
| Comissão | Percentual ou valor fixo; por produto/campanha; apresentar base de cálculo e janela de atribuição. |
| Regiões elegíveis | Países/estados onde o produto pode ser enviado/comprado. |
| Regras para creators | Amostra disponível, exclusões, restrições de uso e categorias incompatíveis. |
| Tags | Busca, sazonalidade, campanha, coleção. |
| Status | Rascunho, em revisão, ativo, pausado, esgotado, rejeitado. |

### 9.3 Validação e publicação

- Validar campos antes de salvar; manter o rascunho se houver erro.
- Mostrar preview do cartão de produto e da página pública.
- Em publicação, checar URL acessível, imagem legível, preço/moeda, categoria, duplicidade e regras da organização.
- Se a comissão for zero/não definida, produto pode ficar visível, mas não entrar em programas de afiliados; deixar isso claro.
- Alteração de preço, estoque ou comissão registra autor, valor anterior/novo, origem e horário.
- Remoção lógica preserva histórico de pedidos, links e relatórios.

### 9.4 Inclusão de produto pelo creator

1. Abrir **Adicionar produto**.
2. Pesquisar por nome/marca/categoria ou colar URL.
3. Ver resultados com foto, nome, preço, loja, comissão e região.
4. Conferir detalhe do item e disponibilidade do link.
5. Selecionar vitrine/coleção e editar título/legenda de recomendação.
6. Visualizar como consumidor verá o card.
7. Publicar, salvar como rascunho ou enviar para revisão.

O sistema deve sempre distinguir **link direto** de **link afiliado rastreável**, mostrar a comissão aplicável, e nunca prometer comissão quando rastreamento não está confirmado.

## 10. Vitrine pública do creator

- URL compartilhável e identificador legível.
- Cabeçalho com foto, nome público, bio e canais sociais opcionais.
- Navegação por seções/coleções, com ordem configurável.
- Grade de produto com imagem, nome, loja, preço/moeda e indicação clara de link comissionado quando houver.
- Cards de conteúdo podem incluir foto ou vídeo e ligar a um ou mais produtos.
- Busca/filtro dentro da vitrine quando a quantidade de itens justificar.
- Estado vazio com explicação e CTA para adicionar o primeiro produto.
- Produto indisponível: informar, ocultar da grade quando apropriado, ou manter com aviso e link alternativo configurável.
- Layout responsivo; otimizar imagem, toque e carregamento em celular.

## 11. UX/UI: padrões a adotar na Diderot

- Separar bem navegação global (módulos) da navegação local (abas/filtros da tela).
- Deixar o CTA primário único e contextual: **Adicionar produto**, **Criar campanha**, **Enviar candidatura**.
- Usar busca persistente em catálogos; filtros removíveis em chips; mostrar quantidade de resultados.
- Usar formulários em etapas para tarefas longas, com progresso, salvar rascunho e validação junto ao campo.
- Mostrar estados de sistema com linguagem concreta: “Pendente: confirme seu domínio”, não só “Em análise”.
- Confirmação antes de publicar/pausar campanhas ou alterar comissão; explicar impacto no rastreamento.
- Acessibilidade: contraste WCAG AA, foco visível, teclado completo, labels, textos alternativos e mensagens de erro anunciáveis.
- Mobile first para creator; desktop com tabelas e filtros densos para marcas.
- Não depender só de cor para estados; combinar cor, ícone e rótulo.
- Mostrar moeda, fuso, período, política de comissão e atribuição no contexto de cada métrica.

## 12. Requisitos não funcionais

- Permissões por papel e organização; isolamento entre organizações.
- Registro de auditoria para edição de preço/comissão, seleção de creator, publicação e pagamento.
- Dados sensíveis de pagamento separados de perfil público, criptografados e acessíveis somente por necessidade.
- Consentimento e transparência de publicidade/afiliados de acordo com regras aplicáveis ao mercado brasileiro.
- Busca paginada, suporte a catálogo volumoso e thumbnails otimizadas.
- Link de rastreamento com identificadores não previsíveis, prevenção de duplicidade e atribuição documentada.
- Webhooks/importações idempotentes; registrar falhas e permitir reprocessamento seguro.
- Exibir data/hora da última sincronização e degradar sem apagar dados sincronizados anteriormente.

## 13. Modelo de dados inicial

- `users`: identidade, e-mail verificado, locale, status.
- `creator_profiles`: nome público, bio, avatar, nichos, status de revisão, slug.
- `social_accounts`: plataforma, handle, URL, verificação, métricas/snapshot e data.
- `organizations`: nome, dados comerciais, domínio, país, status, owner.
- `organization_members`: usuário, organização, papel, convite/status.
- `stores`: organização, plataforma, URL, integração e estado de sincronização.
- `products`: organização, loja, nome, SKU, descrição, imagem, categoria, status.
- `product_variants`: produto, opções, SKU, preço, disponibilidade, URL.
- `commission_rules`: produto/campanha, método, valor, moeda, janela de atribuição, vigência.
- `creator_store_items`: creator, produto, título/legenda, ordem, coleção, estado.
- `collections`: creator, título, descrição, capa, ordem, visibilidade.
- `campaigns`: organização, modalidade, briefing, regras, orçamento, prazos, status.
- `campaign_products`: campanha, produto, comissão/oferta específica.
- `applications`: creator, campanha, resposta, estado, timestamps.
- `deliverables`: campanha/aplicação, tipo, prazo, direitos, estado.
- `content_versions`: arquivo/URL, versão, comentário, estado de aprovação.
- `tracking_links`: creator, produto/campanha, destino, código, estado, janela.
- `click_events`, `orders`, `attribution_records`: eventos, fonte, conversão, deduplicação e reversões.
- `payouts`, `invoices`, `ledger_entries`: saldo provisionado, aprovado, pago, estornado e conciliação.
- `audit_events`: ator, entidade, mudança, data e fonte.

## 14. Critérios de aceite essenciais

1. Visitante escolhe Creator ou Marca e vê apenas o onboarding correspondente.
2. E-mail não verificado não pode publicar campanha nem ativar pagamentos.
3. Creator pode concluir perfil, salvar rascunho, adicionar item e publicar preview da vitrine.
4. Creator vê se o link é rastreado e qual regra de comissão se aplica antes de publicar.
5. Marca pode criar produto com validação de URL, imagem, preço, moeda e categoria.
6. Erro na inclusão de produto preserva campos preenchidos e explica como corrigir.
7. Marca pode criar campanha com modalidade e remuneração explícitas; ausência de comissão/fee deve ser indicada como não remunerada.
8. Creator pode candidatar-se e acompanhar estado; marca pode revisar e registrar motivo de decisão.
9. Aprovação de UGC preserva versões e não altera automaticamente direitos de uso.
10. Produto pausado/esgotado deixa de aceitar nova divulgação conforme regra, preservando dados históricos.
11. Relatórios identificam período, moeda, janela de atribuição e última sincronização.
12. Usuário da organização A não acessa dados da organização B, mesmo alterando URL/ID de tela.
13. Toda alteração de preço, comissão, status e pagamento deixa registro de auditoria.
14. Vitrine tem estados de carregamento, erro, vazio, indisponibilidade e conteúdo responsivo.

## 15. Prioridade de implementação

### MVP — base de monetização

- Cadastro e onboarding de creator e marca.
- Perfil público e vitrine com coleções.
- Catálogo da marca e cadastro manual/importação CSV.
- Pesquisa de produto e inclusão na vitrine.
- Links rastreáveis/códigos de campanha e dashboard básico.
- Campanha simples de afiliado e candidatura.
- Administração de revisão e estados.

### Próxima etapa — UGC operacional

- Briefings, entregáveis, versões e revisão.
- Convite/seleção de creator e mensagens dentro da plataforma.
- Propostas de fee + produto + comissão.
- Pagamentos e conciliação com trilha de auditoria.

### Evolução

- Integrações de loja/API e sincronização de catálogo/estoque.
- Atribuição mais avançada, cupons, regras multi-touch e relatórios.
- Busca/ranking de creators e recomendação de produtos.
- Lista de favoritos para consumidores e vitrines editoriais.

## 16. Decisões de produto pendentes para o time

1. Verificação obrigatória de todos os creators ou apenas de campanhas/pagamentos?
2. Comissão padrão por marca, produto ou campanha? Qual precedência e vigência?
3. Quais plataformas de e-commerce entram primeiro no Brasil?
4. Como tratar cupom quando a marca não fornece link individual?
5. Qual provedor de pagamento e fluxo fiscal para creators PJ/PF?
6. Quais dados de audiência são inseridos manualmente e quais serão verificados via API?
7. Quais direitos UGC são padrão e quais exigem negociação separada?
8. Produto manual de creator pode ser publicado como link externo sem revisão? Sob quais avisos e limites?

## 17. Referência visual rápida

Abrir cada link no ponto indicado para rever a tela de origem. Os prints exibidos durante a análise foram selecionados nestes estados:

1. [Vitrine pública com grade de produtos — Vídeo 2, 02:08](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=128s)
2. [Perfil e navegação da vitrine — Vídeo 2, 03:20](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=200s)
3. [Seção de looks/produtos — Vídeo 2, 04:26](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=266s)
4. [Organização das seções da vitrine — Vídeo 2, 05:33](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=333s)
5. [Inclusão/edição do produto — Vídeo 2, 06:40](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=400s)
6. [Grade de conteúdo visual — Vídeo 2, 07:47](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=467s)
7. [Seleção de produtos em grade — Vídeo 2, 08:53](https://www.youtube.com/watch?v=Yh3vjXKOPdA&t=533s)

**Nota de adaptação:** usar a hierarquia e os padrões observados como referência, sem copiar identidade visual, textos, logotipos ou ativos da ShopMy. Para a Diderot, desenhar o portal de marcas como módulo próprio e ligar catálogo, campanha e creator por estados e permissões explícitos.
