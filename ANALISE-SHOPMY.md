# Referência ShopMy e implementação Diderot

Inspeção em 11 de novembro de 2026. Escopo: páginas públicas, sem conta, sem realizar compras. Ferramenta: REA, captura controlada em Chrome temporário, encerrado pelo próprio REA após cada cenário.

## O que foi observado diretamente

| Tela ou estado | Evidência | Observação |
|---|---|---|
| Página inicial, 1280 × 720 | `ev_5fc27e52939dd7eda7661ce7cd7d079459c18b92f4dcbbcf53eb79673b67995a` | Destaque fotográfico de largura total; navegação sobre o destaque; texto claro; título serifado muito grande à esquerda; objeto à direita; seta circular para continuar. |
| Descoberta na página inicial | DOM e árvore de acessibilidade da mesma captura | Seções por curador, grupos de curadores, categoria e marca. Cada seção tem título, explicação e link para explorar mais. Rodapé com grupos de links. |
| Loja pública da criadora | Captura REA de `/shop/sofiarichiegrainge` | Cabeçalho escuro; foto circular central; linha de autoria; nome serifado; bio; botão para adicionar a um grupo; informação social e links de redes sociais. |
| Navegação da loja | Mesma captura | Abas horizontais, aba selecionada com contorno arredondado, botão de busca à esquerda; segunda faixa de categorias e contagens; produtos abaixo. |
| Busca aberta | REA acionou `Search shop` | A faixa de abas deu lugar a um campo central e um controle de fechar. A busca aberta foi observada; resultados após digitação ainda não foram verificados na ShopMy. |
| Loja no celular, 390 × 844 | Cenário REA com viewport móvel | Cabeçalho compacto; perfil central; navegação horizontal que excede a largura; duas colunas de produto. |
| Produto no celular | REA clicou o primeiro produto da loja e aguardou | Imagem grande, miniaturas na lateral, nome serifado, marca e categoria, favorito, curadores que compartilharam, descrição, link para varejista e opções de compra. |
| Conteúdo abaixo do produto | Árvore de acessibilidade do produto | Recomendações semelhantes, outras marcas, mais produtos da marca, outros curadores e convite para aplicativo. |

## Sistema visual observado

Identificadores adicionais das capturas: perfil `ev_f5f7f58a62e87041bb532c8fa37ca71350627cc758f175404777db392516221d`; busca aberta `ev_31f8cde16b967df7c2f14a2a16c88985df8154f83869424af43272b525f36111`; loja e produto no celular `ev_17f93052ef9a4b20e9c627405632118b0a12a75fb16cb77b23d9c18e8906ea91`. Esses identificadores documentam a origem das observações nesta sessão; não são endereços públicos.

Estas são observações visuais, não valores extraídos do código CSS. Cores exatas, nomes das fontes e medidas de todos os componentes permanecem não verificados.

- Tipografia: serifada de contraste alto nos títulos e nomes; sem serifa em navegação, botões e metadados. Hierarquia forte entre título, introdução e informação secundária.
- Cores: branco nas lojas, preto ou carvão no cabeçalho e nos botões, cinzas discretos para metadados e divisórias. O verde da página inicial vem principalmente da imagem do destaque.
- Forma: produtos em grades regulares; pouco ornamento; bordas finas; botões retangulares; imagens de perfil circulares; abas selecionadas arredondadas.
- Espaçamento: bastante área livre no perfil, produto como foco da grade, navegação em faixas horizontais separadas por linhas sutis.
- Imagens: fotografia de objetos e pessoas na referência. A Diderot usa ilustrações próprias explicitamente demonstrativas.
- Movimento e estados: estado de carregamento do produto foi observado antes do conteúdo final. Abrir a busca transforma a faixa de navegação. Nenhum comportamento de animação foi medido integralmente.

## Fluxos e correspondência na Diderot

| Intenção | Referência observada | Diderot implementada |
|---|---|---|
| Descobrir | Inicial → curadores, categorias, grupos ou marcas | Inicial → loja da Clara ou coleção |
| Conhecer quem recomenda | Perfil, bio, redes, prova social | Perfil fictício, bio e aviso de demonstração; sem números de confiança inventados |
| Navegar por temas | Abas e categorias | Coleções com endereço próprio e filtros por categoria |
| Buscar | Controle abre campo no lugar das abas | Campo sempre visível; pesquisa por nome ou marca |
| Ordenar | Não verificado neste levantamento | Seleção da criadora, menor preço, maior preço |
| Salvar | Favorito e grupos; resultado do cadastro não verificado | Favoritos temporários durante a visita; sem conta |
| Ver item | Cartão → página de produto | Cartão → produto com nota da criadora e retorno à coleção |
| Comprar | Link de afiliado para varejista, observado sem abrir | Explicação de disponibilidade demonstrativa; sem venda |
| Usar celular | Cabeçalho compacto, abas horizontais, duas colunas | Layout adaptado e grade de duas colunas |

## Decisões próprias da Diderot

Implementação escrita nesta tarefa em Next.js, TypeScript e Tailwind CSS, com estilos próprios. Paleta Diderot: carvão `#23241f`, papel `#faf9f6`, verde `#354333`, divisória `#deded7`, texto secundário `#727469`. Tipos locais Georgia e Arial evitam dependência de fontes externas. Ilustrações SVG originais, catálogo fictício com oito itens, três coleções e uma criadora fictícia.

## Cobertura e limites

Isto não é uma extração de 100% da ShopMy nem uma prova de equivalência integral. Foram observados os estados públicos listados acima, em duas larguras. Não foram verificados cadastro, login, recuperação de senha, gestão de criadores, marcas, comissões, pagamentos, persistência em conta, aplicativo, todos os filtros e todos os estados de erro. Redução de movimento e bloqueio de service workers fazem parte do ambiente padrão de captura REA e podem alterar detalhes do comportamento.

Não foi baixado nem incorporado o CSS ou JavaScript da ShopMy. A tentativa de baixar a folha CSS completa foi bloqueada pela revisão automática por conflito com a restrição de não copiar código proprietário. A análise seguiu com imagens, estrutura pública e interações observadas.

O próximo passo para aumentar fidelidade é escolher e verificar cada fluxo público adicional, registrar seus estados, implementar sua correspondência e comparar novamente. Não chamar funções não verificadas de concluídas.
