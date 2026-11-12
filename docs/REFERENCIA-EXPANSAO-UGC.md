# PROMPT MASTER — EXPANSÃO DA DIDEROT PARA UGC MARKETPLACE + CREATOR COMMERCE

## 1. CONTEXTO E OBJETIVO

Você é o Principal Product Architect, Senior Full-Stack Engineer e UX Architect responsável pela evolução da plataforma **Diderot**.

A Diderot é uma plataforma brasileira de Creator Commerce inspirada no modelo de funcionalidades da ShopMy, incluindo:

- Descoberta de produtos e marcas.
- Vitrines personalizadas de criadores.
- Links de afiliados e rastreamento de conversões.
- Relacionamento entre marcas e criadores.
- Campanhas e oportunidades comerciais.
- Gestão financeira e comissões.
- Perfis públicos de criadores.
- Dashboard para marcas, criadores e administradores.

**NOVA DIRETRIZ OBRIGATÓRIA:**

A Diderot não deve ser apenas uma plataforma de afiliação e influencer marketing.

Ela também deve funcionar como um **marketplace completo de UGC (User Generated Content)**, permitindo que marcas contratem criadores para produzir conteúdos profissionais e autênticos, independentemente do tamanho de sua audiência.

As campanhas não podem ser exclusivas de influencers.

Uma campanha pode envolver:

1. Criadores UGC.
2. Influenciadores digitais.
3. Criadores híbridos (UGC + influencer).

Todas essas modalidades devem coexistir dentro da mesma arquitetura.

---

## 2. REGRA FUNDAMENTAL DO PRODUTO

**UGC não é sinônimo de influencer marketing.**

Um influenciador geralmente é contratado para divulgar conteúdos à própria audiência.

Um criador UGC pode ser contratado exclusivamente para produzir fotos e vídeos destinados aos canais de comunicação e publicidade da marca, sem precisar publicar conteúdo em suas redes sociais.

Portanto:

- Criadores UGC não precisam ter muitos seguidores.
- Não deve existir exigência global de audiência mínima para participar da Diderot.
- Campanhas UGC não devem exigir publicação no Instagram ou TikTok, exceto quando o briefing expressamente determinar isso.
- Uma marca pode contratar um criador apenas para receber vídeos.
- Uma marca pode contratar um influencer apenas para gerar divulgação.
- Uma marca pode contratar o mesmo profissional para produzir conteúdo e divulgar produtos.
- O pagamento por produção de conteúdo deve ser independente da comissão por vendas.
- O sistema deve suportar remuneração fixa, variável e híbrida.
- Direitos de uso de imagem, conteúdo e publicidade devem fazer parte da contratação.

**NÃO trate UGC como uma funcionalidade secundária dentro do influencer marketing.**

UGC deve ser um módulo nativo da Diderot.

---

# 3. INVESTIGAÇÃO OBRIGATÓRIA DO PROJETO EXISTENTE

Antes de implementar qualquer alteração:

1. Investigue todo o repositório atual da Diderot.
2. Identifique o framework, as bibliotecas e a arquitetura existentes.
3. Analise o banco de dados e as migrations.
4. Identifique todos os tipos de usuários atuais.
5. Inspecione as rotas públicas, privadas e administrativas.
6. Identifique a estrutura atual de campanhas.
7. Analise as regras de afiliação e comissões.
8. Identifique componentes reutilizáveis.
9. Analise o fluxo de cadastro e autenticação.
10. Verifique as integrações financeiras e de armazenamento existentes.

Classifique cada funcionalidade em:

- EXISTENTE E FUNCIONAL.
- EXISTENTE, MAS INCOMPLETA.
- EXISTENTE APENAS COMO INTERFACE OU MOCK.
- NÃO IMPLEMENTADA.
- NECESSITA REFATORAÇÃO.

Não reconstrua funcionalidades que já existem e funcionam corretamente.

Preserve a identidade visual da Diderot, seus fluxos consolidados, sua arquitetura tecnológica e os dados existentes.

Não faça uma simples mudança visual. Implemente regras de negócio, persistência, permissões e fluxos funcionais.

---

# 4. TIPOS DE USUÁRIOS

A plataforma deve suportar quatro grandes categorias:

### 4.1 Criador

Uma única conta de criador pode ter as seguintes modalidades de atuação:

- UGC Creator.
- Influencer.
- Afiliado.
- Híbrido: combinação das modalidades anteriores.

O criador pode selecionar uma ou mais modalidades durante o onboarding e alterá-las posteriormente.

Não crie cadastros independentes que obriguem a mesma pessoa a possuir várias contas.

### 4.2 Marca

Pessoa jurídica ou equipe responsável por:

- Encontrar criadores.
- Publicar campanhas.
- Analisar candidaturas.
- Contratar profissionais.
- Gerenciar entregas.
- Aprovar conteúdos.
- Gerenciar direitos de uso.
- Efetuar pagamentos.
- Acompanhar resultados.

### 4.3 Consumidor

Pessoa que navega pelas vitrines, descobre produtos e acessa links de compra.

Não precisa ser necessariamente criadora.

### 4.4 Administrador Diderot

Responsável por:

- Moderação de contas.
- Aprovação e revisão de marcas.
- Supervisão de campanhas.
- Gestão de denúncias e disputas.
- Supervisão financeira.
- Configuração de regras comerciais.
- Auditoria das atividades.

Implemente controle de permissões por papel e vínculo com cada recurso.

---

# 5. NOVO SISTEMA UNIFICADO DE CAMPANHAS

Este é o módulo mais importante da expansão.

A área de campanhas deve ser reconstruída ou adaptada para suportar três modalidades:

## 5.1 Campanha UGC

A marca publica uma oportunidade para contratar pessoas que vão produzir conteúdos.

Exemplo:

**Marca:** Empresa de skincare

**Campanha:** Produção de vídeos UGC para lançamento de um sérum.

**Entrega:**
- 3 vídeos verticais.
- Duração entre 15 e 30 segundos.
- Formato 9:16.
- Arquivos em alta qualidade.
- Roteiro baseado no briefing.
- 1 rodada de revisão.

**Remuneração:** R$ 450 por criador.

**Publicação nas redes pessoais:** Não obrigatória.

**Seguidores mínimos:** Não exigidos.

**Uso do conteúdo:** 90 dias em anúncios digitais, conforme contrato.

O criador se candidata, a marca seleciona, a contratação é formalizada e os vídeos são enviados dentro da plataforma.

## 5.2 Campanha Influencer

A marca contrata criadores para divulgação.

Exemplo:

**Campanha:** Lançamento de cosmético.

**Entrega:**
- 1 Reels.
- 3 Stories.
- Link rastreável.

**Remuneração:**
- R$ 600 fixos.
- Comissão de 10% sobre vendas qualificadas.

**Publicação:** Obrigatória.

**Métricas:**
- Alcance.
- Visualizações.
- Cliques.
- Engajamento.
- Conversões.
- Receita atribuída.

## 5.3 Campanha Híbrida

A marca contrata criadores para produzir conteúdos e também promover produtos.

Exemplo:

**Entrega UGC:**
- 2 vídeos para utilização em anúncios da marca.

**Entrega Influencer:**
- 1 Reels publicado no perfil do criador.

**Afiliação:**
- Link individual de rastreamento.
- Comissão de 12%.

**Remuneração:**
- R$ 350 pela produção.
- R$ 300 pela publicação.
- Comissão variável pelas vendas.

O sistema deverá calcular e apresentar separadamente cada componente financeiro.

**REGRA OBRIGATÓRIA:** Uma campanha híbrida pode ter vagas exclusivamente UGC, exclusivamente influencer e híbridas. A marca poderá configurar essas modalidades por vaga, com quantidades e orçamentos independentes.

---

# 6. CRIAÇÃO DE CAMPANHAS PELAS MARCAS

Criar um fluxo completo em etapas.

### Etapa 1 — Informações gerais
- Nome da campanha.
- Marca.
- Descrição.
- Objetivo comercial.
- Categoria.
- Produtos envolvidos.
- Imagens de referência.
- Data de início e término.
- Prazo de candidatura.

### Etapa 2 — Modalidades

Permitir selecionar:
- UGC.
- Influencer.
- Híbrida.

A interface deve adaptar os campos conforme a modalidade escolhida.

### Etapa 3 — Requisitos

Para UGC:
- Nichos desejados.
- Idiomas.
- Localização.
- Experiência desejável.
- Portfólio.
- Estilo de conteúdo.
- Habilidades técnicas.

Para Influencer:
- Redes sociais.
- Nicho.
- Audiência.
- Perfil demográfico.
- Métricas de desempenho.

Nunca tornar seguidores obrigatórios em candidaturas exclusivamente UGC.

### Etapa 4 — Entregáveis

A marca define:
- Quantidade de vídeos.
- Quantidade de fotos.
- Formato.
- Resolução.
- Duração.
- Orientações de captação.
- Necessidade de roteiro.
- Prazo de entrega.
- Número de revisões.
- Necessidade de arquivos brutos.
- Publicações obrigatórias, quando aplicáveis.
- Comprovação de publicação, quando aplicável.

### Etapa 5 — Direitos de uso

Configurar:
- Uso orgânico.
- Uso em mídia paga.
- Canais autorizados.
- Prazo de licença.
- Territórios.
- Uso de imagem e voz.
- Exclusividade, se necessária.
- Entrega de arquivos brutos.
- Possibilidade de renovação.

Registrar a licença aceita no contrato.

Não presumir cessão irrestrita ou perpétua de direitos.

### Etapa 6 — Remuneração

Permitir:
- Valor fixo por conteúdo.
- Valor fixo por pacote.
- Valor fixo por publicação.
- Comissão por venda.
- Bônus por desempenho.
- Produto como benefício.
- Combinação das modalidades acima.

Diferenciar campanhas pagas, campanhas de gifting e campanhas com comissão.

Não apresentar produto recebido como pagamento em dinheiro.

### Etapa 7 — Revisão e publicação

Mostrar resumo completo da campanha.

Permitir:
- Salvar rascunho.
- Publicar.
- Pausar.
- Encerrar inscrições.
- Arquivar.

Validar dados obrigatórios antes da publicação.

---

# 7. MARKETPLACE DE CAMPANHAS

Criar uma área acessível aos criadores:

**Diderot → Descobrir → Campanhas**

Filtros:

- Todas.
- UGC.
- Influencer.
- Híbridas.
- Pagas.
- Gifting.
- Com afiliação.
- Nicho.
- Faixa de remuneração.
- Localização.
- Idioma.
- Tipo de entrega.

Cada card de campanha deve mostrar:

- Logo da marca.
- Nome da campanha.
- Modalidades de contratação.
- Categoria.
- Remuneração divulgada.
- Tipo de entregável.
- Prazo de candidatura.
- Status da oportunidade.

Ao abrir uma campanha, o usuário deve visualizar uma página completa com briefing, requisitos, valores e condições.

A interface deve indicar claramente quando uma campanha não exige audiência nem publicação.

---

# 8. SISTEMA DE CANDIDATURAS

Implementar candidaturas reais, persistidas no banco de dados.

Fluxo:

1. Criador abre a campanha.
2. Verifica os requisitos.
3. Seleciona a modalidade ou vaga disponível.
4. Escolhe o portfólio relevante.
5. Envia uma apresentação personalizada.
6. Informa orçamento ou proposta, quando permitido.
7. Confirma condições.
8. Envia candidatura.
9. A marca recebe a candidatura.
10. A marca avalia o candidato.
11. Aprova, rejeita ou solicita esclarecimentos.

Estados mínimos:

- Rascunho.
- Enviada.
- Em análise.
- Informações solicitadas.
- Pré-selecionada.
- Aprovada.
- Rejeitada.
- Retirada.

Evitar candidaturas duplicadas para a mesma vaga, exceto quando houver regras explícitas para reaplicação.

Implementar histórico, data e autoria das mudanças de status.

---

# 9. NOVO PERFIL DE CRIADOR UGC

Adicionar funcionalidades específicas ao perfil existente.

### Informações profissionais

- Foto.
- Nome profissional.
- Bio.
- Cidade e estado.
- Nichos.
- Idiomas.
- Categorias de conteúdo.
- Habilidades.
- Disponibilidade.
- Modalidades de trabalho.

### Portfólio

O criador deve poder adicionar:

- Vídeos UGC.
- Fotografias.
- Cases.
- Conteúdos demonstrativos.
- Projetos realizados.
- Links externos.

Cada trabalho pode conter:

- Título.
- Categoria.
- Tipo de vídeo.
- Descrição.
- Miniatura.
- Mídia.
- Marca relacionada, quando autorizada.
- Tipo de participação.
- Métricas declaradas, se disponíveis.

### Serviços

Permitir configurar serviços como:

- Vídeo UGC.
- Pacote de vídeos.
- Fotografia de produto.
- Unboxing.
- Demonstração.
- Depoimento.
- Vídeo com roteiro.
- Conteúdo para anúncios.
- Edição de vídeo.
- Produção bilíngue.

O criador pode definir preços iniciais ou trabalhar sob orçamento.

Esses serviços devem poder ser exibidos no perfil público e utilizados nos pedidos de contratação.

**IMPORTANTE:** O perfil não deve obrigar o criador UGC a preencher número de seguidores.

---

# 10. DIRETÓRIO DE CRIADORES PARA MARCAS

Criar uma área própria:

**Dashboard da Marca → Descobrir Criadores**

A marca poderá pesquisar profissionais utilizando filtros:

- UGC.
- Influencer.
- Híbrido.
- Nicho.
- Cidade.
- Idioma.
- Estilo de conteúdo.
- Faixa de preço.
- Disponibilidade.
- Experiência.
- Tipo de serviço.

Para influencers, permitir filtros adicionais de audiência e métricas quando houver dados disponíveis.

Para UGC, priorizar:

- Qualidade do portfólio.
- Adequação ao briefing.
- Competências.
- Estilo.
- Idioma.
- Histórico de entregas.
- Avaliações verificadas.

A marca deve conseguir:

- Favoritar criadores.
- Criar listas.
- Visualizar perfis.
- Convidar para campanhas.
- Solicitar orçamento.
- Iniciar uma negociação.

Não apresentar valores fictícios de seguidores, desempenho ou avaliação.

---

# 11. CONTRATAÇÃO DIRETA

Além de candidaturas a campanhas, implementar contratação direta.

Fluxo:

1. Marca descobre um criador.
2. Abre seu perfil.
3. Seleciona "Convidar para campanha" ou "Solicitar conteúdo".
4. Define o serviço.
5. Envia briefing.
6. Informa orçamento e prazo.
7. Criador aceita, recusa ou apresenta contraproposta.
8. As partes confirmam condições.
9. O sistema registra o acordo.
10. Um projeto é criado.
11. A produção é iniciada.

Esse fluxo deve funcionar mesmo que não exista uma campanha pública.

---

# 12. WORKSPACE DE PRODUÇÃO UGC

Criar uma área de gerenciamento de projetos:

**Criador → Trabalhos → Projetos ativos**

E:

**Marca → Campanhas → Produções**

Cada projeto deve possuir:

- Identificação.
- Marca.
- Criador contratado.
- Briefing.
- Entregáveis.
- Cronograma.
- Arquivos de referência.
- Conversas.
- Propostas aprovadas.
- Contrato e licença.
- Status de pagamento.
- Histórico de revisões.
- Entrega final.

### Estados de produção

1. Contratação confirmada.
2. Aguardando produto ou materiais.
3. Em produção.
4. Conteúdo enviado.
5. Em revisão pela marca.
6. Ajustes solicitados.
7. Reenviado.
8. Aprovado.
9. Concluído.

Prever cancelamento e disputa como fluxos próprios, com regras e registros auditáveis.

### Upload de arquivos

Suportar:
- Vídeos.
- Imagens.
- Documentos.
- Arquivos brutos, conforme contrato.

Armazenar os arquivos de maneira segura, com acesso autorizado.

### Aprovação

A marca deve conseguir:
- Visualizar a entrega.
- Aprovar.
- Solicitar ajustes.
- Adicionar comentários.
- Ver versões anteriores.

Aplicar o limite de revisões contratado.

Não sobrescrever versões anteriores de conteúdo.

---

# 13. SISTEMA DE PROPOSTAS E MENSAGENS

Criar ou expandir o sistema de comunicação entre marcas e criadores.

Funcionalidades:
- Conversas vinculadas a campanhas.
- Conversas vinculadas a projetos.
- Mensagens de texto.
- Anexos.
- Notificações.
- Histórico.
- Negociação de preços.
- Alterações de prazo.
- Contrapropostas.

Toda alteração contratual relevante deve exigir confirmação apropriada, não apenas uma mensagem informal.

O sistema deve respeitar permissões de acesso.

---

# 14. FINANCEIRO UNIFICADO

O dashboard financeiro deve separar fontes de receita.

Para o criador:

**Receitas**
- Produção UGC.
- Publicações patrocinadas.
- Comissões de afiliados.
- Bônus de campanhas.
- Outros serviços.

**Indicadores**
- Total contratado.
- Total recebido.
- Valores pendentes.
- Valores em processamento.
- Comissões aprovadas.
- Comissões estornadas.
- Histórico de transações.

Para a marca:

- Orçamento total.
- Orçamento comprometido.
- Pagamentos de UGC.
- Pagamentos de influencers.
- Comissões de afiliação.
- Gastos por campanha.
- Custo por criador.
- Retorno atribuível a campanhas, quando mensurável.

### Regras

O pagamento de UGC não depende de vendas.

A comissão de afiliado depende das regras de rastreamento, qualificação e atribuição aplicáveis.

O cachê pela publicação é independente do pagamento pela produção, exceto quando o contrato definir um pacote único.

Não misturar valores contratados com valores efetivamente pagos.

Não criar saldos fictícios nem afirmar que um pagamento foi realizado sem confirmação de um provedor financeiro.

Se não houver gateway integrado, implementar os estados e os registros necessários, identificando os pagamentos como externos ou pendentes de integração.

---

# 15. PRESERVAR E INTEGRAR A AFILIAÇÃO

Todas as funcionalidades de afiliação existentes devem permanecer operacionais.

Incluindo, conforme a implementação atual:

- Vitrines.
- Catálogo.
- Links rastreáveis.
- Produtos.
- Redes de afiliação.
- Cliques.
- Conversões.
- Comissões.
- Relatórios.
- Histórico financeiro.

Criar integração entre campanhas e afiliação.

Uma marca poderá associar produtos a uma campanha e oferecer comissões aos criadores participantes.

Cada criador elegível poderá receber um identificador de rastreamento próprio.

As vendas devem ser atribuídas conforme regras documentadas.

Não registrar uma venda como confirmada apenas porque ocorreu um clique.

Se a plataforma não possuir integração confiável de conversões, deixar explícito que o evento não está verificado.

---

# 16. AVALIAÇÕES E REPUTAÇÃO

Após a conclusão de projetos elegíveis, permitir avaliações mútuas.

A marca poderá avaliar:

- Qualidade do conteúdo.
- Comunicação.
- Cumprimento de prazo.
- Adequação ao briefing.

O criador poderá avaliar:

- Clareza do briefing.
- Comunicação.
- Cumprimento das condições.
- Experiência de colaboração.

Somente participantes efetivos de trabalhos concluídos devem conseguir enviar avaliações verificadas.

Implementar mecanismos de moderação.

Não gerar avaliações automaticamente.

---

# 17. NAVEGAÇÃO E EXPERIÊNCIA DO USUÁRIO

A Diderot deve apresentar navegação coerente para cada perfil.

## Área do Criador

- Visão geral.
- Descobrir.
  - Produtos.
  - Marcas.
  - Campanhas UGC.
  - Campanhas Influencer.
  - Campanhas Híbridas.
- Minha vitrine.
- Meu portfólio.
- Meus serviços.
- Candidaturas.
- Trabalhos.
  - Convites.
  - Negociações.
  - Projetos ativos.
  - Entregas.
  - Concluídos.
- Mensagens.
- Analytics.
- Financeiro.
- Perfil e configurações.

## Área da Marca

- Visão geral.
- Descobrir criadores.
- Criadores favoritos.
- Campanhas.
  - Todas.
  - Criar campanha.
  - Rascunhos.
  - Publicadas.
  - Candidaturas.
  - Encerradas.
- Contratações diretas.
- Produções.
  - Em andamento.
  - Aguardando revisão.
  - Aprovadas.
  - Concluídas.
- Produtos e afiliação.
- Mensagens.
- Analytics.
- Financeiro.
- Equipe e configurações.

## Área do Administrador

- Visão geral.
- Usuários.
- Criadores.
- Marcas.
- Campanhas.
- Candidaturas.
- Contratações.
- Projetos UGC.
- Transações.
- Disputas.
- Moderação.
- Configurações.

## Área do Consumidor

Preservar a experiência de:

- Descoberta de criadores.
- Navegação por vitrines.
- Busca de produtos.
- Visualização de coleções.
- Acesso a ofertas.
- Redirecionamento para lojas.

**Não forçar consumidores a visualizar ferramentas de gestão UGC.**

---

# 18. MODELO DE DADOS

Investigue o schema atual antes de adicionar entidades.

Adapte ou crie, conforme necessário:

### Identidade e perfis
- users
- creator_profiles
- creator_modalities
- creator_services
- creator_portfolio_items
- brand_profiles
- brand_memberships

### Campanhas
- campaigns
- campaign_slots
- campaign_requirements
- campaign_deliverables
- campaign_products
- campaign_applications
- campaign_invitations

### Contratações
- proposals
- contracts
- contract_deliverables
- content_licenses
- project_assignments
- project_milestones
- project_submissions
- submission_files
- revision_requests

### Comunicação
- conversations
- conversation_participants
- messages
- message_attachments
- notifications

### Financeiro
- payment_obligations
- payment_transactions
- creator_earnings
- affiliate_commissions
- bonus_awards
- payout_requests

### Reputação
- reviews
- review_reports

### Auditoria
- audit_events

Os nomes são sugestões, não um comando para duplicar tabelas já existentes.

### Requisitos técnicos do modelo

- Chaves estrangeiras e integridade referencial.
- Migrations incrementais e reversíveis sempre que viável.
- Índices para consultas frequentes.
- Idempotência em operações financeiras e webhooks.
- Timestamps e autoria das alterações importantes.
- Isolamento entre marcas.
- Controle de acesso a arquivos e dados privados.
- Validação de transições de status no backend.
- Políticas de autorização no banco, como RLS, quando compatíveis com a arquitetura atual.

Não destruir dados ou realizar migrations destrutivas sem necessidade.

---

# 19. EXPERIÊNCIA VISUAL E COMPONENTES

Preserve a identidade visual atual da Diderot.

O novo módulo deve parecer nativo da plataforma.

Criar ou reutilizar:

- CampaignCard.
- CampaignTypeSelector.
- CampaignCreationWizard.
- CampaignDetail.
- ApplicationForm.
- ApplicationStatus.
- CreatorPortfolio.
- CreatorServiceCard.
- CreatorDiscoveryFilters.
- BrandCreatorCard.
- ProposalComposer.
- ContractSummary.
- ProjectWorkspace.
- DeliverableChecklist.
- ContentUploader.
- RevisionTimeline.
- PaymentBreakdown.
- EarningsDashboard.

Requisitos de UX:

- Desktop e mobile.
- Layout responsivo.
- Navegação intuitiva.
- Estados de carregamento.
- Estados vazios.
- Tratamento de erros.
- Confirmações para ações irreversíveis.
- Feedback visual de operações.
- Formulários com validação.
- Acessibilidade básica.
- URLs diretas funcionais.

Não incluir botões que apenas simulem operações.

Não construir dashboards com métricas fictícias apresentadas como reais.

---

# 20. REGRAS DE NEGÓCIO CRÍTICAS

Implemente e teste as seguintes regras:

**REGRA 01:** Um creator UGC pode ter zero seguidores e ainda participar de campanhas UGC.

**REGRA 02:** Campanhas UGC não exigem postagem pública por padrão.

**REGRA 03:** Campanhas Influencer podem exigir métricas de audiência compatíveis com o briefing.

**REGRA 04:** Uma conta pode atuar como UGC, influencer e afiliado simultaneamente.

**REGRA 05:** Uma campanha pode possuir vagas com modalidades e remunerações diferentes.

**REGRA 06:** Cada vaga possui requisitos, entregáveis, orçamento e capacidade próprios.

**REGRA 07:** O pagamento por produção é separado das comissões de afiliação.

**REGRA 08:** O conteúdo produzido não transfere automaticamente direitos ilimitados à marca.

**REGRA 09:** Cada entrega deve possuir versões, status e histórico de revisão.

**REGRA 10:** Somente usuários autorizados podem acessar arquivos privados de um projeto.

**REGRA 11:** Nenhum valor deve constar como recebido antes da confirmação correspondente.

**REGRA 12:** Uma candidatura aprovada não deve criar automaticamente uma obrigação financeira sem condições contratuais aceitas.

**REGRA 13:** A marca só pode contratar dentro das permissões e limites aplicáveis à sua conta.

**REGRA 14:** A capacidade de vagas deve ser protegida contra aprovações simultâneas acima do limite.

**REGRA 15:** Uma marca não pode acessar propostas, projetos ou dados privados de outra marca.

**REGRA 16:** Alterações no contrato após aceite precisam de um novo registro de concordância.

**REGRA 17:** Os fluxos públicos de descoberta e compra não podem ser prejudicados pela inclusão do marketplace UGC.

---

# 21. TESTES OBRIGATÓRIOS

Crie testes automatizados e, quando houver infraestrutura disponível, testes end-to-end.

### Cenário A — UGC iniciante

1. Usuário cria uma conta.
2. Escolhe UGC Creator.
3. Não informa seguidores.
4. Adiciona dois vídeos ao portfólio.
5. Descobre uma campanha UGC.
6. Envia candidatura.
7. Marca aprova.
8. As partes aceitam as condições.
9. Projeto é criado.
10. Criador envia conteúdo.
11. Marca solicita revisão.
12. Criador reenvia.
13. Marca aprova.
14. Pagamento é registrado conforme confirmação real.

Resultado esperado: fluxo completo sem exigir perfil de influencer.

### Cenário B — Influencer

1. Criador conecta ou informa seus canais, conforme integração disponível.
2. Candidata-se a campanha de divulgação.
3. Recebe aprovação.
4. Publica conteúdo.
5. Envia comprovação.
6. Link rastreável é associado.
7. Conversões verificadas são registradas.
8. Comissão é calculada.

### Cenário C — Campanha híbrida

1. Marca cria campanha com vagas UGC e influencer.
2. Criador UGC aplica para vaga UGC.
3. Influencer aplica para vaga de divulgação.
4. Criador híbrido aplica para uma vaga híbrida.
5. A marca gerencia contratações.
6. As entregas são registradas separadamente.
7. Os pagamentos são discriminados por natureza.
8. Os relatórios não misturam cachês e comissões.

### Cenário D — Segurança

1. Usuário tenta acessar candidatura de outra conta.
2. Marca tenta acessar projeto de outra empresa.
3. Criador tenta alterar valores aprovados sem autorização.
4. Usuário tenta acessar arquivo privado sem vínculo.
5. Duas candidaturas são aprovadas simultaneamente para a última vaga.

Resultado esperado: operações indevidas bloqueadas no backend.

---

# 22. PLANO DE IMPLEMENTAÇÃO

Organize o desenvolvimento em etapas:

### Fase 1 — Auditoria
- Mapear sistema existente.
- Identificar dependências.
- Levantar lacunas.
- Propor alterações compatíveis.

### Fase 2 — Modelagem
- Adaptar banco.
- Criar migrations.
- Implementar permissões.
- Definir estados de negócio.

### Fase 3 — Onboarding e portfólio
- Modalidades de criador.
- Cadastro UGC.
- Serviços.
- Portfólio.

### Fase 4 — Campanhas
- Tipos de campanha.
- Vagas.
- Formulário de criação.
- Diretório.
- Candidaturas.

### Fase 5 — Contratações e projetos
- Convites.
- Propostas.
- Aceite.
- Workspace.
- Uploads.
- Revisões.
- Aprovações.

### Fase 6 — Financeiro e afiliação
- Remuneração fixa.
- Comissões.
- Pagamentos.
- Relatórios.
- Integrações existentes.

### Fase 7 — Qualidade
- Testes.
- Segurança.
- Responsividade.
- Fluxos ponta a ponta.
- Correções.

Implemente de maneira incremental, preservando o funcionamento do produto atual.

---

# 23. CRITÉRIOS DE CONCLUSÃO

A expansão somente poderá ser considerada concluída quando:

- Um criador UGC conseguir se cadastrar sem informar seguidores.
- A marca conseguir criar uma campanha exclusivamente UGC.
- A marca conseguir criar uma campanha exclusivamente influencer.
- A marca conseguir criar uma campanha híbrida com vagas distintas.
- O criador conseguir descobrir e se candidatar a campanhas.
- A marca conseguir receber, avaliar e aprovar candidaturas.
- A contratação conseguir registrar condições e aceite.
- Os projetos conseguirem receber entregas reais.
- As revisões e aprovações funcionarem.
- O financeiro discriminar produção, publicação e afiliação.
- A navegação de todos os perfis estiver funcional.
- As permissões forem aplicadas no backend.
- Os dados persistirem após atualização ou nova sessão.
- Os fluxos anteriores de afiliação continuarem operacionais.
- Os testes críticos passarem.

Não considere concluída uma funcionalidade que apenas possui uma interface visual.

---

# 24. RELATÓRIO FINAL OBRIGATÓRIO

Ao concluir cada etapa, apresente:

1. Funcionalidades encontradas no projeto original.
2. Funcionalidades reutilizadas.
3. Funcionalidades implementadas.
4. Arquivos criados e modificados.
5. Migrations executadas ou pendentes.
6. Rotas adicionadas.
7. Integrações efetivamente funcionais.
8. Testes executados e seus resultados.
9. Funcionalidades pendentes.
10. Bloqueios técnicos reais.

Não declare "100% concluído" enquanto existirem fluxos com botões falsos, dados simulados sem identificação, integração financeira ausente ou testes críticos não realizados.

Quando depender de serviços externos, segredos, credenciais ou decisões comerciais, sinalize a dependência sem inventar que a integração está ativa.

---

# 25. DIRETRIZ FINAL

**A Diderot deve conectar criação de conteúdo, influência e comércio em uma plataforma única.**

O objetivo não é simplesmente adicionar uma aba chamada "UGC".

O objetivo é implementar uma nova camada completa de negócios, com:

- Descoberta de oportunidades.
- Portfólios.
- Contratação.
- Produção.
- Gestão de entregas.
- Aprovações.
- Direitos de uso.
- Pagamentos.
- Relacionamento com marcas.
- Afiliação integrada.

O UGC deve ser tratado como um produto de primeira classe na arquitetura.

**Comece investigando o repositório existente. Depois apresente o diagnóstico e implemente incrementalmente os módulos necessários, sem interromper o desenvolvimento apenas na etapa de planejamento.**

Não copie código, identidade visual ou conteúdos proprietários da ShopMy. Utilize apenas padrões de produto e funcionalidades gerais como referência, preservando a identidade própria da Diderot.
