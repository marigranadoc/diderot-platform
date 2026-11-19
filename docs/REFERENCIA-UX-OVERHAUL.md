# MASTER PROMPT — DIDEROT UX/UI OVERHAUL

## MISSÃO: TRANSFORMAR O DIDEROT EM UMA PLATAFORMA INTUITIVA, VISUAL E ORIENTADA A AÇÕES

**Projeto:** Diderot  
**Website:** https://www.shopdiderot.com/  
**Referência principal de experiência:** https://shopmy.us/home  
**Referência de documentação:** https://guide.shopmy.us/

### 1. CONTEXTO E OBJETIVO

O Diderot é uma plataforma brasileira de creator commerce, curadoria de produtos, afiliação e relacionamento entre criadores, marcas e consumidores.

O projeto já possui uma identidade visual própria, páginas, navegação, componentes e funcionalidades implementadas.

**O objetivo NÃO é recriar a plataforma do zero.**

Quero uma reformulação profunda da experiência de usuário (UX) e uma evolução criteriosa da interface (UI), preservando o design system existente.

Atualmente, parte do aplicativo transmite a sensação de um painel administrativo ou sistema de cadastros: muitos campos, formulários, controles convencionais e etapas pouco intuitivas.

Quero substituir essa sensação pela de um produto digital premium, acessível, moderno e extremamente fácil de utilizar.

A principal referência de UX é o ShopMy, mas sem copiar sua identidade, código, textos ou elementos proprietários.

**Princípio central:**

> O Diderot deve parecer uma plataforma construída para pessoas criarem, descobrirem, organizarem e monetizarem — e não um banco de dados com interface.

O usuário deve conseguir concluir suas principais tarefas sem precisar de tutorial.

---

## 2. INSTRUÇÕES OBRIGATÓRIAS DE EXECUÇÃO

Você atuará simultaneamente como:

- Senior Product Designer
- UX Researcher
- UX Architect
- UI Designer
- Frontend Engineer
- Especialista em Design Systems
- Especialista em acessibilidade e experiência mobile
- QA Engineer

Sua missão é analisar, redesenhar e IMPLEMENTAR a evolução UX/UI diretamente no projeto existente.

Não entregue apenas wireframes, explicações ou documentação.

Quero alterações reais no código, com telas navegáveis e funcionalidades preservadas.

### Antes de alterar qualquer código

1. Identifique o repositório responsável pelo domínio shopdiderot.com.
2. Inspecione a estrutura completa do projeto.
3. Identifique o framework, biblioteca de componentes, autenticação, banco de dados, rotas e integrações.
4. Faça um inventário do design system atual.
5. Mapeie todas as páginas e estados existentes.
6. Identifique os fluxos de creator, marca e shopper.
7. Analise componentes reutilizáveis e oportunidades de melhoria.
8. Diferencie funcionalidades já implementadas de funcionalidades demonstrativas ou planejadas.
9. Registre a situação inicial e estabeleça uma estratégia de mudanças incrementais.
10. Trabalhe em branch própria, quando o ambiente permitir, preservando a versão atual.

Se houver autenticação ou telas protegidas, utilize mecanismos autorizados de acesso e desenvolvimento. Não contorne permissões.

**Não recrie a aplicação, não substitua sua arquitetura sem justificativa e não perca dados existentes.**

---

# PARTE I — PRESERVAÇÃO DO DESIGN SYSTEM

## 3. MANTER A IDENTIDADE VISUAL DIDEROT

A identidade visual atual deve ser o ponto de partida.

Preservar, sempre que possível:

- Paleta de cores atual.
- Tipografia e hierarquia editorial.
- Logo e identidade de marca.
- Estética minimalista e sofisticada.
- Fundos claros e tons neutros.
- Estilo dos cards de produtos.
- Imagens e materiais existentes.
- Tratamento visual dos elementos de curadoria.
- Linguagem editorial e personalidade da marca.
- Consistência entre páginas públicas e áreas autenticadas.

Não quero um redesign genérico de dashboard SaaS.

Evitar transformar o Diderot em uma interface repleta de cards coloridos, gradientes chamativos, sombras exageradas e gráficos desnecessários.

### Melhorias visuais autorizadas

- Refinar espaçamentos.
- Melhorar contrastes.
- Refinar tipografia funcional.
- Padronizar ícones.
- Implementar componentes interativos.
- Criar novas variantes de componentes existentes.
- Melhorar a organização dos conteúdos.
- Introduzir feedback visual.
- Melhorar estados de hover, focus, active e disabled.
- Adicionar animações sutis e funcionais.
- Corrigir problemas de responsividade.

A regra é preservar a linguagem visual, mas modernizar profundamente a experiência de interação.

### 3.1 Sistema de ícones

Inspecione o sistema de ícones existente.

Caso seja necessário complementar, prefira uma biblioteca consistente como Lucide, respeitando as dependências atuais.

Utilize ícones reconhecíveis:

- Home: painel inicial.
- Store: minha loja.
- Plus: criar.
- Package: produtos.
- Layers: coleções.
- Briefcase: oportunidades.
- Users: criadores e parcerias.
- Building2: marcas.
- Wallet: financeiro, caso exista.
- ChartNoAxesCombined: desempenho.
- Heart: favoritos.
- Bookmark: itens salvos.
- Search: buscar.
- Settings: configurações.
- Eye: visualizar.
- Pencil: editar.
- Share2: compartilhar.
- Copy: copiar.
- Check: confirmar.
- ArrowRight: continuar.
- ChevronLeft: voltar.
- MoreHorizontal: ações secundárias.

Ícones devem complementar labels de texto, especialmente em ações essenciais.

Não utilizar emojis como substitutos de iconografia profissional.

---

# PARTE II — NOVA ARQUITETURA DA EXPERIÊNCIA

## 4. SUBSTITUIR A LÓGICA DE FORMULÁRIOS POR FLUXOS GUIADOS

Este é o requisito mais importante do projeto.

Atualmente, tarefas como cadastrar informações, configurar perfil, organizar produtos ou apresentar serviços podem exigir múltiplos campos expostos simultaneamente.

A nova experiência deve ser baseada em:

**Intenção → Escolha → Configuração mínima → Preview → Confirmação.**

Exemplo:

### Experiência convencional indesejada

O usuário abre uma página e encontra:

Nome da coleção  
Descrição  
Categoria  
Imagem  
Visibilidade  
Ordenação  
Produtos  
Botão salvar

### Experiência desejada

**Etapa 1 — O que você quer criar?**

Exibir opções visuais:

- Uma coleção de produtos.
- Um link de produto.
- Uma seção da minha loja.

**Etapa 2 — Personalize sua coleção**

Mostrar:

- Campo principal para o nome.
- Sugestões de nomes.
- Imagens ou templates selecionáveis.
- Configurações avançadas recolhidas.

**Etapa 3 — Adicione produtos**

Interface visual com cards, pesquisa e ações rápidas.

**Etapa 4 — Visualize o resultado**

Preview da coleção.

**Etapa 5 — Finalize**

Ação clara: "Criar coleção".

Mostrar mensagem de sucesso e oferecer próxima ação.

### Regras gerais

1. Uma tarefa principal por etapa.
2. Máximo de informação relevante por tela.
3. Não esconder dados obrigatórios.
4. Evitar etapas artificiais em tarefas muito simples.
5. Permitir voltar sem perder dados.
6. Salvar rascunhos quando suportado.
7. Usar defaults inteligentes.
8. Revelar opções avançadas somente quando necessárias.
9. Usar linguagem simples.
10. Exibir contexto e orientação durante o processo.

Não transformar cada formulário em um wizard desnecessário. Campos simples podem permanecer em edição inline ou modais.

---

# PARTE III — NAVEGAÇÃO GERAL

## 5. REPENSAR A NAVEGAÇÃO DO APLICATIVO

A navegação deve ser organizada pelas tarefas mais frequentes, e não apenas pela estrutura técnica do sistema.

Criar navegação adequada para os três contextos:

- Creator
- Marca
- Shopper

A mesma conta pode ter acesso a diferentes espaços, conforme as permissões existentes.

Preservar regras de autenticação e autorização.

### 5.1 Navegação para creators

Proposta inicial:

**Desktop**

Menu lateral ou navegação compacta:

1. Início
2. Minha loja
3. Produtos e links
4. Coleções
5. Oportunidades
6. Meu perfil
7. Configurações

Módulos adicionais, como financeiro, devem ser exibidos somente quando realmente existentes e pertinentes.

**Mobile**

Priorizar barra inferior com até cinco destinos:

- Início
- Minha loja
- Criar (+)
- Oportunidades
- Perfil

O botão Criar deve ser um acesso rápido e contextual.

Ao tocar em Criar, abrir bottom sheet com opções disponíveis:

- Adicionar produto.
- Criar link.
- Criar coleção.
- Adicionar trabalho ao portfólio.

Não implementar atalhos que direcionem para páginas inexistentes.

Se uma ação estiver indisponível, não apresentá-la como funcional.

### 5.2 Navegação para marcas

Organizar a experiência por tarefas:

- Visão geral.
- Minha marca.
- Campanhas.
- Criadores.
- Equipe e configurações.

Só disponibilizar módulos se houver suporte real.

A interface deve transmitir a sensação de um espaço de gerenciamento de parcerias, não de um cadastro empresarial tradicional.

### 5.3 Navegação para shoppers

Priorizar:

- Descobrir.
- Buscar.
- Coleções ou círculos.
- Favoritos.
- Conta.

Manter a navegação mais leve que a dos painéis de creator e marca.

### 5.4 Troca de contexto

Criar ou refinar um seletor de espaço:

"Você está em: Meu espaço de creator"

Permitir alternar entre espaços autorizados sem precisar deslogar ou criar outra conta.

Essa troca não deve modificar permissões nem conceder acesso automaticamente.

---

# PARTE IV — ONBOARDING E CADASTRO

## 6. REDESENHAR COMPLETAMENTE A EXPERIÊNCIA DE ENTRADA

A rota pública `/cadastro` atualmente apresenta escolha de perfil e campos de criação de conta.

Reorganizar essa experiência, sem comprometer o mecanismo de cadastro.

### Etapa 1 — Como você quer usar o Diderot?

Exibir três cards visualmente bem definidos.

**Card 1 — Quero descobrir**

Ícone: Compass ou ShoppingBag.

Texto:
"Explore produtos, acompanhe curadorias e guarde suas descobertas."

**Card 2 — Quero criar**

Ícone: Sparkles ou Store.

Texto:
"Monte sua loja, compartilhe produtos e apresente seu trabalho."

**Card 3 — Represento uma marca**

Ícone: Building2.

Texto:
"Apresente sua marca e organize oportunidades com criadores."

Cada card deverá ter:

- Ícone.
- Título.
- Descrição curta.
- Estado selecionado.
- Feedback de hover e foco.
- Boa experiência touch.

### Etapa 2 — Criar conta

Após selecionar uma intenção:

- E-mail.
- Senha.
- Confirmação, caso seja necessária ao fluxo atual.
- Ação principal clara.

Não solicitar dados de perfil, marca ou portfólio neste momento.

Preservar validações e segurança existentes.

### Etapa 3 — Configuração inicial personalizada

Após autenticação, direcionar para o onboarding correspondente.

Para creators:

1. Nome e identidade.
2. Tipo de atuação.
3. Personalização inicial da loja.
4. Primeira ação.

Para marcas:

1. Nome da organização.
2. Informações essenciais.
3. Identificação do espaço.
4. Próxima ação disponível.

Para shoppers:

1. Preferências opcionais, se houver suporte.
2. Explorar produtos.
3. Salvar primeiras descobertas.

Permitir pular etapas opcionais.

### 6.1 Progresso

Mostrar indicadores simples como:

"Etapa 2 de 4"

Não criar processos longos apenas para demonstrar progresso.

### 6.2 Conclusão

Mostrar mensagem contextual e conduzir à primeira ação útil.

Exemplo creator:

"Sua conta está pronta. Vamos começar a montar sua loja?"

Botões:

"Adicionar meu primeiro produto"  
"Explorar meu painel"

Se a funcionalidade de adicionar produto ainda não estiver disponível, usar a primeira ação real que estiver implementada.

---

# PARTE V — EXPERIÊNCIA DO CREATOR

## 7. REDESENHAR O PAINEL DO CRIADOR

Prioridade muito alta.

Inspecionar `/painel/criador`.

O dashboard deve responder imediatamente:

1. Onde estou?
2. O que já tenho configurado?
3. O que posso fazer agora?
4. Qual é o meu próximo passo?

### Estrutura proposta

**Cabeçalho**

"Olá, [nome]"

Subtítulo contextual.

Exemplo:
"Seu espaço para organizar, compartilhar e criar novas oportunidades."

**Bloco de ação principal**

CTA destacado:
"Adicionar produto"

Ação secundária:
"Visualizar minha loja"

Adaptar ao estado real da conta.

### 7.1 Cards de acesso rápido

Criar cards elegantes e clicáveis:

- Minha loja.
- Meus produtos.
- Coleções.
- Meu portfólio.
- Meus serviços.
- Explorar oportunidades.

Cada card deve apresentar:

- Ícone.
- Nome.
- Descrição curta.
- Estado relevante.
- Ação.
- Feedback visual.

Não preencher o dashboard com métricas fictícias.

### 7.2 Checklist de configuração

Para contas recém-criadas, mostrar bloco:

**Prepare seu espaço**

Exemplo:

- Completar perfil.
- Adicionar foto.
- Configurar loja.
- Criar primeira coleção.
- Adicionar primeiro produto.

Itens devem refletir dados realmente persistidos.

Exibir progresso, quando possível.

Permitir ocultar o checklist concluído.

### 7.3 Dashboard adaptativo

Conta nova:
priorizar onboarding, empty states e primeira ação.

Conta ativa:
priorizar loja, coleções, links, atividades e métricas realmente existentes.

Conta com serviços:
mostrar acesso aos serviços e portfólio.

Não mostrar painéis vazios sem orientação.

---

## 8. REFORMULAR "MINHA LOJA"

Inspecionar `/painel/criador/loja` e rotas relacionadas.

Quero que a loja seja uma experiência visual, semelhante à gestão de uma vitrine digital.

### Estrutura recomendada

**Cabeçalho**

Minha loja

Ações:
- Visualizar loja.
- Compartilhar.
- Personalizar.

**Área de preview**

Apresentar uma prévia visual real do perfil público do creator.

O usuário deve entender o que seus visitantes verão.

### 8.1 Alternância de modos

Criar dois modos claros:

**Visualizar**

Mostra a loja como o público a vê.

**Editar**

Mostra ferramentas de personalização e organização.

Permitir alternância fácil.

### 8.2 Edição contextual

Sempre que tecnicamente viável:

- Clicar na foto para editá-la.
- Clicar na bio para editar.
- Clicar no título de uma coleção para renomear.
- Usar botão "+" para adicionar conteúdo.
- Usar menu "..." para ações secundárias.

Evitar redirecionamentos para formulários extensos.

### 8.3 Hierarquia de conteúdo

Seções → Coleções → Produtos.

Utilizar essa hierarquia quando compatível com o modelo atual.

Não alterar silenciosamente a estrutura do banco para imitar o ShopMy.

Se o Diderot trabalhar com outra organização, adaptar a interface à estrutura existente e documentar limitações.

### 8.4 Organização visual

Usar cards com:

- Capa.
- Título.
- Quantidade de produtos.
- Visibilidade.
- Ações rápidas.

Se já existir ordenação configurável, implementar ou melhorar drag-and-drop com alternativa acessível por botões.

Se não existir persistência da ordem, não simular uma ordenação funcional.

### 8.5 Estados vazios

Uma loja sem conteúdo deve apresentar:

- Ilustração discreta ou iconografia.
- Mensagem orientadora.
- Uma única ação principal.

Exemplo:

"Sua loja começa com uma boa escolha."

"Adicione seu primeiro produto para começar a montar sua curadoria."

Botão: "Adicionar produto".

---

## 9. EXPERIÊNCIA DE ADICIONAR PRODUTOS

Quero que cadastrar um produto seja uma das tarefas mais fáceis da plataforma.

Reduzir drasticamente a aparência de formulário.

### Fluxo ideal

**Etapa 1 — Como deseja adicionar?**

Apresentar cards:

- Colar link de produto.
- Buscar no catálogo.
- Escolher um produto já salvo.

Exibir somente métodos realmente suportados.

### Etapa 2 — Selecionar ou informar produto

Se houver extração de metadados implementada:

Ao colar URL, preencher automaticamente:

- Título.
- Imagem.
- Loja.
- Preço, quando disponível.

Se o backend não oferecer essa extração, preservar o cadastro manual existente com uma interface melhor.

Não inventar integração de scraping ou afiliação.

### Etapa 3 — Preview do produto

Mostrar card com imagem, título e informações reais.

A edição de dados deve acontecer em painel lateral, modal ou campos inline.

### Etapa 4 — Destino

Perguntar:

"Onde deseja colocar este produto?"

Exibir coleções existentes como cards selecionáveis.

Permitir criar uma coleção durante o processo, se a operação já for suportada.

### Etapa 5 — Confirmação

Mostrar resultado persistido.

Ações:

- Visualizar produto.
- Copiar link, quando disponível.
- Adicionar outro produto.

### Comportamentos obrigatórios

- Validação de URL.
- Evitar submissões duplicadas.
- Mensagem de erro compreensível.
- Feedback durante salvamento.
- Preservação de dados durante edição.
- Tratamento de falhas de rede.
- Não prometer comissões sem integração real.

---

## 10. REFORMULAR CRIAÇÃO E GESTÃO DE COLEÇÕES

Coleções devem parecer curadorias editoriais, não registros de banco de dados.

### Criação

Abrir modal, drawer ou fluxo dedicado:

**Passo 1 — Nomeie sua coleção**

Campo principal.

Sugestões visuais de temas, se forem adequadas ao produto.

Exemplos:
- Favoritos da semana.
- Minha seleção de beleza.
- Essenciais para casa.
- Achados de decoração.

**Passo 2 — Escolha a apresentação**

Se houver suporte:
- Imagem de capa.
- Layout.
- Descrição opcional.

Não criar opções sem persistência.

**Passo 3 — Adicione produtos**

Grid visual.

Seleção de produtos existentes.

**Passo 4 — Conclua**

Preview + confirmação.

### Gestão

Criar:

- Cards visuais.
- Busca.
- Filtros.
- Ações de editar.
- Ações de arquivar ou excluir, conforme suporte.
- Indicadores de publicação.
- Confirmação para ações destrutivas.

Permitir gerenciar sem precisar navegar por várias páginas desconectadas.

---

## 11. PERFIL DO CREATOR

Inspecionar `/conta/criador`.

Transformar a configuração do perfil em um editor visual.

### Visão principal

Mostrar um preview do perfil com:

- Foto.
- Nome.
- Identificação.
- Bio.
- Links e informações disponíveis.

Ao lado, exibir opções de edição agrupadas.

### Seções

**Identidade**

Foto, nome e apresentação.

**Minha atuação**

Opções visuais selecionáveis para os tipos de trabalho suportados.

**Redes sociais**

Links e conexões disponíveis.

**Loja**

Acesso à configuração pública.

**Serviços e portfólio**

Atalhos e indicadores de preenchimento.

### Microinterações

- Preview de imagem após upload.
- Feedback de salvamento.
- Indicador de alterações não salvas.
- Confirmação ao sair com edições pendentes.
- Campos de edição curtos e contextuais.

---

## 12. SERVIÇOS E PORTFÓLIO

Inspecionar:

`/conta/criador/servicos`

`/conta/criador/portfolio`

### Serviços

Substituir, quando possível, a edição puramente textual por cards de serviços.

Exemplos de categorias, apenas quando compatíveis com o sistema:

- UGC.
- Conteúdo para redes sociais.
- Produção de vídeos.
- Consultoria.
- Campanhas com influência.

Cada serviço pode apresentar:

- Nome.
- Descrição.
- Preço inicial, se informado.
- Estado de visibilidade.
- Ações de edição.

Criar fluxo de adicionar serviço com seleção inicial, seguido de campos essenciais.

Manter opção de serviço personalizado.

Não obrigar o creator a publicar preços se o modelo atual permitir omiti-los.

### Portfólio

Criar experiência de galeria.

Cards podem apresentar:

- Thumbnail ou preview, se suportado.
- Título.
- Tipo de trabalho.
- Link.
- Menu de ações.

Ação principal:
"Adicionar trabalho".

Fluxo ideal:
1. Selecionar tipo de conteúdo.
2. Informar link ou arquivo, conforme suporte.
3. Confirmar dados.
4. Visualizar card.

Não implementar upload de mídia se o backend atual só aceitar URLs, sem antes desenvolver infraestrutura apropriada.

Respeitar a visibilidade privada atualmente prevista para serviços e portfólio.

---

# PARTE VI — EXPERIÊNCIA DAS MARCAS

## 13. REDESENHAR O PAINEL DA MARCA

Inspecionar `/painel/marca`.

Transformar a experiência em um espaço de gestão, não apenas de cadastro empresarial.

### Dashboard

Cabeçalho:

"Seu espaço de marca"

Subtítulo:
"Organize sua presença e acompanhe suas oportunidades."

Criar cards para áreas efetivamente existentes:

- Perfil da marca.
- Campanhas.
- Informações da organização.
- Equipe.
- Explorar criadores, se disponível.

### Primeira utilização

Checklist visual:

- Configurar marca.
- Adicionar identidade.
- Completar informações.
- Explorar campanhas ou próxima tarefa disponível.

### Cadastro da marca

Utilizar fluxo guiado:

**Etapa 1 — Identidade**

Nome e dados essenciais.

**Etapa 2 — Apresentação**

Descrição e categorias suportadas.

**Etapa 3 — Informações adicionais**

Dados necessários ao funcionamento existente.

**Etapa 4 — Revisão**

Resumo visual.

Usar cards, seleções, categorias e campos contextualizados.

Preservar validações e entidades do banco.

---

## 14. CAMPANHAS E OPORTUNIDADES

Inspecionar:

`/explorar/campanhas`

E páginas de detalhes.

As campanhas atualmente podem incluir categorias UGC, influencer e híbrida.

A experiência de descoberta deve ser visual e fácil de navegar.

### Lista de campanhas

Criar cards com:

- Imagem.
- Marca.
- Título.
- Tipo de campanha.
- Categoria.
- Remuneração estimada, se existente.
- Prazo.
- Quantidade de vagas, quando informada.
- Estado de disponibilidade.
- CTA: "Ver detalhes".

### Filtros

Quando houver dados estruturados:

- UGC.
- Influencer.
- Híbrida.
- Categoria.
- Remuneração.
- Disponibilidade.

### Detalhe da campanha

Organizar as informações em blocos visuais:

**Sobre a campanha**

Objetivo e descrição.

**O que será produzido**

Entregáveis.

**Condições**

Requisitos e direitos de uso.

**Remuneração**

Valores reais ou estimados, claramente identificados.

**Prazo**

Datas existentes.

**Disponibilidade**

Situação atual.

### Regra de negócio crítica

As inscrições nas campanhas públicas estão indicadas como indisponíveis.

Não criar botões de inscrição que finjam concluir uma candidatura.

Não inventar aprovação, pagamento ou contratação.

Enquanto uma campanha não aceitar inscrições, exibir estado honesto como:

"Inscrições ainda não disponíveis".

Uma eventual funcionalidade de candidatura deverá ser tratada como implementação de produto separada, com backend, autenticação e estados próprios.

Se o mecanismo já existir em outras partes do projeto, investigá-lo antes de implementar nova solução.

---

# PARTE VII — EXPERIÊNCIA DO SHOPPER

## 15. MELHORAR DESCOBERTA, BUSCA E CURADORIA

Preservar a estética editorial existente nas páginas públicas.

O objetivo é melhorar interações, navegação e descoberta.

### Página de exploração

Reforçar:

- Busca evidente.
- Categorias visuais.
- Cards de produtos consistentes.
- Filtros claros.
- Favoritos acessíveis.
- Navegação simples por creators, coleções e produtos.

### Cards de produtos

Cada card deve oferecer:

- Imagem clara.
- Nome.
- Marca, quando existente.
- Preço, quando disponível.
- Ação de favorito.
- Navegação para detalhes.
- Estados de interação.

Priorizar imagem e curadoria.

Não poluir os cards com informações demais.

### Busca

Oferecer experiência responsiva com:

- Campo destacado.
- Botão de limpar.
- Estado de carregamento.
- Resultado vazio útil.
- Filtros, quando suportados.
- Preservação de filtros ao navegar.

### Favoritos

Diferenciar de forma explícita:

- Favoritos locais do navegador.
- Favoritos persistidos na conta.

Se houver sincronização, preservá-la.

Não mostrar como salvo na conta um item que só existe localmente.

### Perfil público do creator

Melhorar visualização de:

- Identidade.
- Bio.
- Coleções.
- Produtos.
- Busca dentro da loja, se suportada.
- Compartilhamento.
- Links de saída.

---

# PARTE VIII — BIBLIOTECA DE COMPONENTES

## 16. CRIAR UM SISTEMA REUTILIZÁVEL DE INTERAÇÕES

Antes de desenvolver componentes novos, auditar os existentes.

Reutilizar e estender o design system.

Criar componentes reutilizáveis apenas quando agregarem valor real.

### Componentes desejados

**SelectionCard**

Card selecionável com ícone, descrição, estado ativo e suporte a teclado.

**ActionCard**

Atalho visual para uma ação frequente.

**StepFlow**

Fluxo guiado com título, indicador de progresso e navegação.

**EmptyState**

Estado vazio contextual com CTA.

**PageHeader**

Cabeçalho consistente.

**ContextualActionMenu**

Menu de ações secundárias.

**BottomSheet**

Painel para ações mobile.

**SideDrawer**

Edição contextual em desktop, quando apropriada.

**InlineEditor**

Edição rápida no próprio conteúdo.

**PreviewCard**

Prévia visual de produtos, coleções e perfis.

**StatusIndicator**

Estados semânticos consistentes.

**ConfirmationDialog**

Confirmação para operações destrutivas.

**ToastFeedback**

Feedback de ações concluídas.

**SkeletonLoader**

Carregamento sem mudanças bruscas de layout.

**ProgressChecklist**

Orientação de configuração inicial.

### Princípios

- Consistência em todos os módulos.
- Reutilização de componentes existentes.
- Baixa duplicação de código.
- Sem estilos inline arbitrários.
- Uso dos tokens do projeto.
- APIs de componentes claras.
- Compatibilidade com a stack atual.

---

# PARTE IX — MICROINTERAÇÕES

## 17. CRIAR SENSAÇÃO DE PRODUTO POLIDO

Adicionar feedback visual útil, evitando excesso.

### Botões

- Hover discreto.
- Estado pressionado.
- Loading.
- Disabled.
- Confirmação contextual.

### Cards

- Transições sutis.
- Borda ou destaque em seleção.
- Feedback de clique.
- Área clicável apropriada.

### Modais

- Animação leve de entrada.
- Foco controlado.
- Fechamento acessível.
- Preservação de dados quando necessário.

### Ações concluídas

Exemplo:

"Produto adicionado à coleção."

Oferecer ação contextual:

"Visualizar coleção".

### Carregamento

Evitar telas vazias com apenas "Carregando...".

Preferir skeletons próximos à estrutura final, quando fizer sentido.

### Erros

Exemplo indesejado:

"Error 400".

Exemplo desejado:

"Não foi possível salvar agora. Tente novamente."

Apresentar orientação adequada sem ocultar detalhes úteis para depuração.

### Animações

Usar preferencialmente transições CSS e recursos existentes.

Evitar dependências pesadas ou animações que prejudiquem desempenho.

Respeitar `prefers-reduced-motion`.

---

# PARTE X — MOBILE-FIRST

## 18. TRATAR O DIDEROT COMO UM APP MOBILE

A experiência no celular deve ser uma prioridade, não uma adaptação de última hora.

### Navegação

- Bottom navigation quando apropriada.
- Sidebar apenas em telas maiores.
- Menus compactos.
- Ícones consistentes.
- Labels claros.

### Interações

- Bottom sheets para ações.
- Modais responsivos.
- Seleções por cards.
- Formulários curtos.
- Controles com área de toque confortável.
- Feedback imediato.

### Layout

- Evitar scroll horizontal acidental.
- Evitar botões cortados.
- Evitar campos muito próximos.
- Evitar dropdowns difíceis de utilizar.
- Respeitar safe areas.
- Garantir teclado mobile utilizável.
- Não esconder o botão principal atrás do teclado.

### CTA em etapas

Quando apropriado, manter ação principal no rodapé da etapa, visível sem competir com a navegação inferior.

Exemplo:

"Continuar".

### Responsividade

Validar pelo menos:

- 320px.
- 375px.
- 390px.
- 768px.
- 1024px.
- 1440px.

Testar também situações com conteúdo extenso e teclado aberto.

---

# PARTE XI — UX WRITING

## 19. REESCREVER MICROCOPY PARA SER MAIS HUMANA

Quero textos claros, objetivos, amigáveis e sofisticados.

Evitar linguagem técnica de banco de dados.

### Exemplos

Em vez de:

"Cadastrar novo registro de produto"

Usar:

"Adicionar produto"

Em vez de:

"Submeter formulário"

Usar:

"Salvar alterações"

Em vez de:

"Gerenciar dados de perfil"

Usar:

"Editar meu perfil"

Em vez de:

"Não existem itens cadastrados"

Usar:

"Você ainda não adicionou nenhum produto."

Em vez de:

"Selecione um tipo de entidade"

Usar:

"Como você quer começar?"

Em vez de:

"Operação realizada com sucesso"

Usar:

"Suas alterações foram salvas."

### Tom de voz

- Natural.
- Claro.
- Elegante.
- Direto.
- Sem excesso de emojis.
- Sem frases excessivamente longas.
- Sem jargões administrativos.

O Diderot deve parecer uma plataforma premium e humana.

---

# PARTE XII — ACESSIBILIDADE E QUALIDADE

## 20. ACESSIBILIDADE

Seguir WCAG 2.2 AA como referência.

Garantir:

- Navegação por teclado.
- Foco visível.
- Labels acessíveis.
- Contraste adequado.
- Áreas de toque confortáveis.
- Ícones com nomes acessíveis.
- Mensagens de erro associadas aos campos.
- Modais com foco gerenciado.
- Estados de loading anunciados quando pertinente.
- Ausência de dependência exclusiva de cor.
- Preferências de movimento reduzido.

Não sacrificar acessibilidade em nome de minimalismo.

---

## 21. PRESERVAÇÃO FUNCIONAL E SEGURANÇA

Esta reformulação é prioritariamente de UX/UI.

Preservar:

- Autenticação.
- Sessões.
- Autorização por perfil.
- Associações entre contas e organizações.
- Banco de dados.
- Dados existentes.
- Rotas públicas.
- Links compartilháveis.
- APIs.
- Integrações.
- Operações de cadastro e atualização.
- Regras de negócio.
- Permissões e isolamento dos dados.

Não modificar tabelas, políticas de acesso ou contratos de API sem necessidade demonstrada.

Se alguma melhoria exigir backend, registrar essa dependência e implementar apenas quando tecnicamente segura e dentro do escopo.

Não simular dados financeiros, campanhas ativas, comissões ou métricas.

Não substituir ações reais por componentes visuais sem funcionamento.

---

# PARTE XIII — IMPLEMENTAÇÃO TÉCNICA

## 22. ESTRATÉGIA DE IMPLEMENTAÇÃO

Implementar em etapas incrementais e testáveis.

### Fase 1 — Auditoria

Entregáveis:

- Inventário das páginas.
- Fluxos atuais.
- Componentes existentes.
- Tokens visuais.
- Principais problemas de UX.
- Fluxos disponíveis e indisponíveis.
- Identificação de riscos técnicos.

### Fase 2 — Fundação visual

- Refinar componentes existentes.
- Padronizar iconografia.
- Criar componentes reutilizáveis necessários.
- Melhorar estados de interação.
- Corrigir inconsistências de layout.

### Fase 3 — Navegação e onboarding

- Melhorar a escolha do perfil.
- Redesenhar o cadastro.
- Criar ou aprimorar orientação inicial.
- Reorganizar navegação por perfil.
- Melhorar mobile navigation.

### Fase 4 — Creator experience

Prioridade máxima:

1. Dashboard.
2. Minha loja.
3. Produtos e links.
4. Coleções.
5. Perfil.
6. Serviços.
7. Portfólio.

### Fase 5 — Brand experience

- Dashboard.
- Perfil e cadastro.
- Navegação para campanhas.
- Visualização de campanhas.
- Gestão disponível.

### Fase 6 — Shopper experience

- Descoberta.
- Busca.
- Categorias.
- Curadorias.
- Favoritos.
- Perfil público.

### Fase 7 — Polimento e QA

- Estados de carregamento.
- Estados vazios.
- Erros.
- Responsividade.
- Acessibilidade.
- Revisão visual.
- Testes funcionais.

As fases devem gerar alterações reais. Não interromper a tarefa depois da auditoria ou da criação de um plano.

---

## 23. ORIENTAÇÕES PARA CÓDIGO

Adapte-se à stack efetivamente encontrada.

Não presuma que o projeto utiliza bibliotecas específicas.

Se estiver usando Next.js, React, TypeScript e Tailwind, siga a arquitetura e os padrões existentes.

Prioridades:

- Componentes reutilizáveis.
- Type safety.
- Código legível.
- Organização modular.
- Menos duplicação.
- Baixo acoplamento.
- Compatibilidade com SSR e hidratação, quando aplicável.
- Evitar novas dependências desnecessárias.
- Manter bundle enxuto.
- Preservar SEO das páginas públicas.
- Não criar regressões de performance.

Evitar refatorações extensas sem relação direta com a melhoria de UX.

Não mexer em regras de negócio apenas para facilitar o frontend.

---

# PARTE XIV — CRITÉRIOS DE ACEITE

## 24. O QUE SIGNIFICA CONCLUIR O TRABALHO

A implementação só deve ser considerada concluída quando:

### Navegação

- As principais tarefas são facilmente descobertas.
- Os menus representam ações e destinos reais.
- O usuário consegue identificar onde está.
- Existe navegação coerente entre creator, marca e shopper.
- A versão mobile não possui menus cortados ou sobrepostos.

### Formulários

- Formulários complexos foram simplificados ou divididos quando apropriado.
- Campos avançados não competem visualmente com informações essenciais.
- O usuário recebe orientação contextual.
- Validação e persistência permanecem funcionais.

### Creator

- O dashboard apresenta próximas ações claras.
- A gestão de loja é visual.
- Produtos e coleções são fáceis de localizar.
- A criação e edição possuem feedback.
- Serviços e portfólio têm boa apresentação.
- Estados vazios orientam a primeira ação.

### Marca

- O espaço da marca tem estrutura compreensível.
- O onboarding é mais simples.
- Campanhas apresentam informações hierarquizadas.
- Funcionalidades indisponíveis são claramente identificadas.

### Shopper

- Busca e descoberta são claras.
- Os cards preservam a estética editorial.
- Filtros e favoritos funcionam corretamente.
- Perfis públicos são responsivos.

### Qualidade técnica

- Build concluída.
- Testes pertinentes executados.
- Sem erros críticos no console.
- Sem links internos quebrados nos fluxos alterados.
- Sem regressões conhecidas de autenticação.
- Sem perda de dados.
- Sem alterações inesperadas no design system.
- Sem ações que apenas pareçam funcionar.

---

## 25. TESTES DE JORNADA OBRIGATÓRIOS

Execute testes reais, com dados de teste autorizados, para os fluxos disponíveis.

### Jornada A — Novo creator

1. Acessar cadastro.
2. Selecionar creator.
3. Criar conta de teste, quando permitido.
4. Completar configuração inicial.
5. Acessar dashboard.
6. Configurar informações do perfil.
7. Criar coleção.
8. Adicionar produto.
9. Visualizar loja.

Verificar persistência e consistência.

### Jornada B — Creator existente

1. Entrar.
2. Acessar loja.
3. Editar coleção.
4. Organizar produtos.
5. Atualizar perfil.
6. Adicionar trabalho ao portfólio.
7. Confirmar dados após recarregar.

### Jornada C — Marca

1. Entrar.
2. Acessar painel.
3. Editar perfil da organização.
4. Explorar campanhas.
5. Abrir detalhes.
6. Verificar estados disponíveis.

### Jornada D — Shopper

1. Acessar home.
2. Explorar curadoria.
3. Aplicar filtros.
4. Abrir produto.
5. Favoritar.
6. Navegar para creator.
7. Testar navegação mobile.

Se uma funcionalidade não existir ou estiver indisponível, marcar o teste como não aplicável ou bloqueado, sem inventar uma implementação.

---

# PARTE XV — MÉTRICAS E COMPARAÇÃO

## 26. MEDIR A MELHORIA DE USABILIDADE

Comparar fluxos antes e depois.

Registrar:

- Quantidade de cliques para concluir tarefas.
- Quantidade de campos inicialmente visíveis.
- Quantidade de telas por fluxo.
- Existência de ações claramente identificáveis.
- Quantidade de redirecionamentos desnecessários.
- Problemas de navegação mobile.
- Problemas de validação.
- Estados sem feedback.

Não criar números fictícios de conversão.

### Objetivos de design

As tarefas frequentes devem usar a menor quantidade razoável de interações.

Adicionar um produto deve ser uma operação curta e orientada.

Criar coleção deve ser compreensível sem tutorial.

Editar perfil não deve exigir navegar por múltiplas páginas sem necessidade.

O usuário deve encontrar a ação principal de seu espaço imediatamente.

---

# PARTE XVI — LIMITES DE ESCOPO

## 27. O QUE NÃO FAZER

- Não criar um novo website do zero.
- Não modificar completamente a paleta.
- Não substituir a tipografia por uma fonte genérica.
- Não descaracterizar o Diderot.
- Não copiar literalmente a interface do ShopMy.
- Não adicionar dashboards artificiais.
- Não adicionar gráficos sem dados reais.
- Não criar funcionalidades financeiras fictícias.
- Não inventar integrações de afiliação.
- Não ativar inscrições em campanhas sem backend.
- Não criar componentes apenas decorativos.
- Não utilizar ícones sem significado.
- Não transformar tarefas simples em processos longos.
- Não introduzir dependências desnecessárias.
- Não remover funcionalidades existentes.
- Não quebrar a autenticação.
- Não modificar produção sem verificar o ambiente e o fluxo de deploy.
- Não concluir o trabalho apresentando apenas sugestões.

---

# PARTE XVII — ENTREGA FINAL

## 28. FORMATO DA ENTREGA

Após implementar, apresente:

### A. Diagnóstico

Quais problemas de UX foram identificados?

Quais fluxos foram encontrados?

Quais funcionalidades estavam disponíveis?

### B. Alterações realizadas

Listar por módulo:

- Onboarding.
- Navegação.
- Creator.
- Loja.
- Produtos.
- Coleções.
- Portfólio.
- Serviços.
- Marcas.
- Campanhas.
- Shopper.

### C. Comparação antes/depois

Demonstrar visualmente as principais melhorias, quando houver ambiente para screenshots.

### D. Evidência funcional

Descrever quais jornadas foram testadas e quais passaram.

### E. Pendências

Informar:

- Funcionalidades não implementadas por falta de backend.
- Problemas anteriores identificados.
- Dependências externas.
- Limitações de acesso.
- Melhorias opcionais futuras.

### F. Código

Apresentar arquivos modificados, testes realizados e referência ao commit ou pull request, quando disponível.

Não publicar automaticamente em produção sem autorização explícita para deploy.

---

# DIRETRIZ FINAL E INEGOCIÁVEL

Quero que você pense como o Product Designer responsável por transformar o Diderot em um aplicativo brasileiro de creator commerce com a fluidez de produtos como ShopMy, mantendo uma identidade editorial própria.

O usuário não deve sentir que está preenchendo formulários para alimentar um sistema.

Ele deve sentir que está construindo sua loja, organizando sua curadoria, encontrando oportunidades e criando conexões de maneira natural.

**Preserve a estética. Redesenhe a experiência. Simplifique a navegação. Reduza a fricção. Implemente os fluxos. Teste o resultado.**

Não execute apenas mudanças cosméticas.

O sucesso desta tarefa será medido pela melhoria real da experiência de uso, especialmente em dispositivos móveis e nas tarefas recorrentes dos creators.

Comece auditando o projeto existente, priorize as jornadas críticas e execute a reformulação progressivamente até entregar uma interface consistente, funcional e refinada.