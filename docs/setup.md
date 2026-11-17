# Setup da Diderot como projeto existente

13/11/2026 · Fonte: [Vibe Coding Toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit/tree/7ef68dd7b00ddfc5cd464458855e4ab66dd2128f), revisão `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`, MIT. Aplicado o caminho de **projeto existente**, não bootstrap de aplicação nova. Cache de fontes fica na pasta de trabalho externa à aplicação, sem dependências, credenciais ou scripts upstream executados. [Prompts e atribuição](prompts/README.md).

## Diagnóstico e escolhas

Raiz: diretório que contém package.json/AGENTS, originalmente `outputs/diderot` na pasta de trabalho. Windows/PowerShell, Node v26.13.0, npm, lockfile existente. Resolvidos: Next 16.4.6, React 19.3.1, TypeScript 7.0.2 e Playwright 1.65.0. Preservados App Router sem `src/`, SupabaseJS2.119.0, Tailwind4, RLS/RPC, design system, fotografias e testes. Sem ORM novo, substituição de banco/Auth, reestruturação de pastas ou atualização de dependências.

Baseline remoto conhecido: `ee3ff813955ea312f79feec840bbb0827902eb57`, implementação de acesso `50133bc423efccf70a9829a1f557b1f860a8d56c`. Este registro descreve alterações locais da etapa; não implica commit/push ou publicação nova. Histórico Git local indisponível para comparação por CLI nesta sessão; não inventar estado limpo ou commit atual local. Evidências funcionais anteriores continuam no progresso e documentos do módulo.

Cliente real: Codex desktop, sessão já autenticada, modelo GPT-6 conforme contexto fornecido pelo host; versão exata do cliente/esforço/custo não expostos. Não houve troca de provedor/modelo, API faturada, proxy ou mudança de permissão. Nenhum subagente ou revisão independente foi executado nesta etapa. Context7 não aparece entre ferramentas carregadas; usar documentação local da versão instalada e fontes primárias quando necessário. Não afirmar conexão só por existir um guia no toolkit.

## Mapa dos nove documentos do toolkit

| Responsabilidade sugerida | Destino Diderot | Decisão |
|---|---|---|
| README.md | [README](../README.md) | Preservado e ampliado com mapa de trabalho |
| PRODUCT.md | [PRD-DIDEROT](PRD-DIDEROT.md) | Equivalente canônico existente; não criar um segundo produto conflitante |
| AGENTS.md | [AGENTS](../AGENTS.md) | Instruções específicas, mantendo bloco gerado pelo Next |
| CLAUDE.md | [CLAUDE](../CLAUDE.md) | Bridge opcional; descoberta Claude não testada |
| docs/architecture.md | [architecture](architecture.md) | Arquitetura observada e fronteiras, não modelo futuro como fato |
| docs/design.md | [DESIGN-SYSTEM-DIDEROT](DESIGN-SYSTEM-DIDEROT.md) | Reutilizado com estrutura da home, fontes e procedência |
| docs/onboarding.md | [INTEGRACOES](INTEGRACOES.md), [README](../README.md), [ACESSO-DEMONSTRACAO](ACESSO-DEMONSTRACAO.md) | Preparação e primeiro acesso existentes; relatos antigos são históricos |
| docs/quality.md | [quality](quality.md) | Comandos, evidências, isolamento e lacunas |
| docs/setup.md | Este documento | Revisão adotada, decisões de catálogo e validação |

## Avaliação do catálogo completo

Disponível/carregado não significa executado. A tabela usa o catálogo de 23 componentes da revisão fixa e registra seleção nesta etapa. Não foi instalada ferramenta global ou uma segunda cópia de integração existente.

| Componente | Seleção e evidência / motivo |
|---|---|
| 01 Superpowers | Não carregado; processo de diagnóstico→escopo→implementação→verificação adaptado aos prompts locais. Plugin não instalado, não alegar execução de seus comandos |
| 02 Subagentes | Recurso nativo disponível; não utilizado nesta etapa. Delegar futuramente apenas escopo independente autorizado, preservando modelo e isolamento de recursos |
| 03 RTK | Não adotado: saída já filtrada pelas ferramentas existentes; não instalar proxy de terminal sem necessidade medida |
| 04 Ponytail | Princípio de menor solução completa incorporado; plugin não instalado, sem valor demonstrado para esta entrega documental |
| 05 Caveman | Comunicação concisa adaptada ao português e preferências da usuária; não adicionar plugin ou substituir instruções de estilo |
| 06 ESLint/Biome | **Avaliado e rejeitado nesta combinação**: preset Next 16.4.6/ESLint 9.39.5 foi instalado temporariamente com scripts de pacote desativados. npm rebaixou TypeScript 7.0.2→6.0.3 por peer dependency do parser `<6.1.0`; ESLint 9 também avisou EOL. Diagnóstico executou com erro no código existente, sem desativar regras. Ferramentas/config removidas e lock/dependências originais restaurados. Lint compatível e async tipado continuam pendentes; check documental não substitui lint |
| 07 Graphify | Não selecionado: estrutura pequena identificável por rotas/arquivos e mapa de arquitetura; evitar grafo gerado sem caso de uso |
| 08 Obsidian | Não aplicável como dependência: memória canônica versionada suficiente; não criar vault externo |
| 09 Claude memory | AGENTS + PRD/progresso como equivalente de memória por demanda; bridge CLAUDE preparado, cliente Claude não executado |
| 10 Hooks | Não selecionado: checks explícitos, sem hook global, Git hook ou bloqueio automático de push |
| 11 agent-browser | Equivalente existente: Playwright/Chrome e CUA/REA; testes de aplicação anteriores registrados. Não instalar CLI duplicada; nenhuma navegação nova necessária para docs |
| 12 Context7 | Indisponível entre ferramentas carregadas; fallback para docs locais Next e fontes oficiais. Não configurar MCP/conta global implicitamente |
| 13 Artifact skills | Recursos de documentos/PDF/apresentações/planilhas disponíveis no host; não utilizados porque entrega é Markdown; não instalar catálogo duplicado |
| 14 Chrome DevTools MCP | Não carregado como MCP independente; Playwright/REA cobrem inspeção atual. Não alegar captura de rede/performance nesta etapa |
| 15 Codex | Reutilizado cliente existente; AGENTS ampliado. Não reinstalar cliente ou alterar autenticação/configuração global |
| 16 Vercel skills | Integração e instruções Supabase/Vercel já disponíveis pelo host; preservar. Deploy/React/auth/env/postgres aplicáveis por tarefa, não executados nesta etapa documental; find-skills duplicado não instalado |
| 17 Next runtime/performance | Docs locais Next disponíveis e consultadas; `next-dev-loop` oficial não selecionado: falta agent-browser CLI e build atual usa Webpack. Bundle optimizer não executado, sem demanda/medição de bundle nesta etapa |
| 18 PostgreSQL | Supabase e práticas Postgres disponíveis no host, banco e migrações preservados. Nenhum SQL/migração executado para preparar documentos |
| 19 GitHub CI repair | Connector GitHub disponível; gh CLI não disponível. Nenhuma falha Actions nova investigada, não alegar uso de gh-fix-ci ou reparo remoto |
| 20 Security review | Prompt13 copiado com MIT, padrão somente leitura/relatório privado. Auditoria baseline/diff integral não executada; skill differential-review não carregada |
| 21 shadcn/ui | Não aplicável: design próprio existente, sem components.json. Não selecionar biblioteca visual por instalar toolkit |
| 22 Sentry MCP | Não escolhido, sem projeto/escopo fornecido; não criar serviço externo nem instalar SDK |
| 23 Harness2 | **Adaptação nativa configurada** por Prompt15; check documental comparável e smokes locais. Framework/CLI/demo oficial/benchmarks não instalados/executados |
| Extras/aia | Não selecionados: sem necessidade que justifique outra camada de agente/custo/ferramenta |

Não confundir instruções disponíveis nesta sessão com instalação permanente por projeto. Nenhuma nova skill foi instalada nesta aplicação; o valor adotado é o fluxo de trabalho, prompts versionados, contexto e verificações locais. Atualizar seleção quando uma tarefa concreta exigir outra capacidade, sem copiar todo o catálogo.

## Memória, retomada e reaplicação

Índice: AGENTS → PRD/progresso → documento do módulo. Fontes originais e limites ficam no PRD/anexo; evidências têm arquivo/data/escopo. Codex descobre AGENTS ao trabalhar na raiz da aplicação; se o workspace aberto for a pasta externa, ler este AGENTS explicitamente. A leitura foi verificada nesta sessão; descoberta automática após reinício do cliente não foi testada. CLAUDE usa importação própria, não regra interpretada pelo Codex.

Memória antiga não vence código/teste atual. Cada incremento registra mudança, evidência real, próxima dependência e condição de invalidação. Para retomar esta etapa: PRD35/36, anexo ShopMy, este setup e último progresso. Próximo incremento funcional: briefing completo U08/condições por vaga, ainda privado, após validação de escopo e dependências. Não apagar três contas demo autorizadas como limpeza automática.

Para reaplicar, ler Prompt12 local e comparar contra esta revisão; não duplicar blocos AGENTS, scripts, prompts ou MCPs. Não há instalador mutante automático. Preservação do bloco Next e ausência de duplicação são conferidas por inspeção; um segundo setup integral em contexto novo **não foi executado**.

## Validação desta etapa

Baseline documental medido: 20 arquivos e 73 links locais examinados; três referências ao anexo inexistente falharam. Corrigido pela criação do anexo, sem suprimir/verificar menos links. O mesmo verificador é reutilizado ao fim. Testes de seu comportamento negativo/positivo usam diretórios descartáveis e nenhum segredo.

A consulta inicial ao registro npm falhou por rede no ambiente restrito; consulta autorizada confirmou preset 16.4.6 e seus peers. Instalação de avaliação usou `--ignore-scripts --no-audit --no-fund`, sem executar hooks externos. A incompatibilidade apareceu como resolução automática do TypeScript, não como prova de que o parser suportava TS7. O lint diagnóstico teve exit 1; não constitui baseline confiável da stack original, pois ocorreu com TS6. Não houve downgrade adotado nem regras desligadas para obter aprovação. Consulte [suporte oficial ESLint](https://eslint.org/version-support/) ao escolher a próxima combinação.

Na restauração, a primeira reinstalação foi impedida pelo SWC em uso na prévia 3002. O servidor identificado dessa porta foi parado e a reinstalação repetida após restaurar o lock original. Arquivo de 77KB precisou ser escrito em trechos por limite do canal de revisão; não contornou permissão de arquivo ou envio de segredo. A prévia deve ser reaberta e verificada, com resultado no registro final. Esses incidentes não alteraram banco ou produção.

Resultados finais dos comandos, hashes e escopo são registrados em [evidência de setup](evidencias/setup-toolkit.json) e [progresso](PROGRESSO-DIDEROT.md). Conferir esse arquivo em vez de presumir aprovação por leitura deste plano. Comparação antes/depois documental não é avaliação comportamental independente de um agente nem ganho de benchmark Harness2. Casos de pausa/retomada, concorrência, fixture oficial de autorização e cliente reiniciado permanecem não executados.

Licença e revisão upstream preservadas. Fonte de navegação ShopMy preservada sem execução de suas instruções; captura de home tem prévia real local, verificada visualmente. Nenhuma alteração funcional, dado de negócio, migração, credencial, fonte TRIAL ou serviço financeiro foi publicado nesta etapa. Build/demo ou checks de documentos não alteram o estado de pendências de produto.
