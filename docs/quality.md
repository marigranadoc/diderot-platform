# Qualidade e evidência

13/11/2026 · Preparação de projeto existente baseada no Vibe Coding Toolkit, revisão `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`. [Seleção e resultados](setup.md). Nenhum resultado antigo é substituído por uma compilação atual.

## Comandos disponíveis

| Comando no Windows | O que prova / limite |
|---|---|
| `npm.cmd run docs:check` | Destinos locais dos links Markdown no README/AGENTS e em docs, inclusive imagens; não consulta links externos nem valida âncoras, renderização ou semântica de requisitos |
| `npm.cmd run docs:test` | Reproduz anexo ausente/restaurado, escape do diretório e URL local inválida em fixtures temporárias locais, sem `.env` ou rede |
| `npm.cmd run typecheck` | Compatibilidade estática TypeScript, não valida dados recebidos ou RLS |
| `npm.cmd run check` | Os três checks acima, sequenciais; sem acesso ao banco ou servidor |
| `npm.cmd run build` | Compilação Next/Webpack e rotas; no modo conectado pode consultar catálogo Supabase; usar modo demo para validação sem serviço |
| `npm.cmd test` / `test:audit` | Auditoria integral Chrome, desktop 1440×1000/celular 390×844, porta própria 3101; inclui lacunas e EXP-06 com identidades demo reais |
| `npm.cmd run test:vitrine` | Exclui `@pendente`; continua contendo integrações reais, não é suíte offline nem plataforma concluída |

Não existe lint permanente configurado nesta base. Typecheck não substitui ESLint. Foi avaliado preset Next 16.4.6 com ESLint 9.39.5; a instalação rebaixou TypeScript para 6.0.3 por peer do parser e alertou EOL do ESLint 9. A combinação foi rejeitada, ferramentas/config removidas e stack original restaurada. O diagnóstico dessa tentativa encontrou erros de setState síncrono em effects e `any`, além de avisos de dependências de hooks; não é baseline da stack TS7, nem comprova falha funcional sozinho. Reavaliar combinação suportada, preservar geração/revogação de sessões e testar regressão de Auth antes de corrigir componentes. Detalhes em [setup](setup.md).

A adoção permanente de lint Next e regras tipadas async precisa medir baseline/dívida, custo e compatibilidade com TS7 antes de ativar bloqueios. Não instalar Drizzle/Vitest/Zod/Biome/Pino ou impor refatoração de componentes como efeito da documentação. Não criar exceções amplas para obter verde. Esse trabalho permanece pendente explícito.

## Isolamento e seleção de testes

Leia o arquivo de teste e os scripts antes de rodar. `seed-demo-data.mjs` não é check: grava fixtures autorizadas e não deve rodar em setup. Os scripts de banco/sessão podem acessar serviço real; não encadear em `check`. Nenhum npm hook ou bloqueio de push foi adicionado.

Para compilar sem catálogo remoto, defina `DIDEROT_DATA_SOURCE=demo` apenas no processo e restaure o valor anterior no fim. Não altere `.env.local` compartilhado. Não compilar enquanto dev/start/test usam `.next`. Chrome precisa estar disponível; `DIDEROT_CHROME_PATH` seleciona um executável compatível. O runner recusa porta 3101 ocupada e encerra somente seus processos. Use casos existentes por módulo, sem esconder lacunas com novos filtros genéricos. Um teste só com mock não comprova banco real; uma leitura HTTP não comprova gravação.

## Rotina de entrega

Documentação: docs:check e docs:test; contratos TypeScript: typecheck; comportamento: build e testes do módulo; autorização/persistência: fixtures isoladas com testes positivos/negativos e releitura. Alterações em SQL requerem revisão da migração e RLS/grants, incluindo acesso cruzado. Revisão de interface inclui teclado, foco, estados e celular. Só ampliar a rodada quando houver alteração/falha/risco que a justifique.

A última auditoria integral de aplicação é histórica: 132 aprovados/4 falhas em 136, sendo admin ausente (duas) e seletor DS-01 (duas). Seletor corrigido e 22/22 dirigidos; ajuste de saída local teve 20/20 próprios. Não somar rodadas ou apresentar como auditoria integral atual. [Evidência e limites](PROGRESSO-DIDEROT.md).

## Prompts e avaliação do trabalho do agente

Use [implementação Diderot](prompts/01-implementar-incremento.md) para uma entrega, [setup existente](prompts/12-projeto-existente.md) para reaplicar preparação e [melhoria do processo](prompts/15-melhoria-harness.md) para falha observada de contexto/ferramenta. Preserve cliente, modelo, autenticação e permissões. Modo selecionado: **adaptação nativa inspirada em Harness2**, sem instalar/executar o framework oficial ou benchmarks/modelos pagos.

Smokes locais desta etapa: descoberta do PRD/estado real por leitura de AGENTS e mapa; verificador antes/depois com três referências ao anexo faltante; fixtures de falha/restauração; comandos sem serviços. O comparativo documental usa o mesmo verificador antes/depois, não mede melhora de raciocínio do modelo. Reinício do cliente, subagente independente, pausa/retomada, fixture oficial de autorização e concorrência de agentes: **não executados**. Não atribuir taxa de confiabilidade, economia de tokens ou ganho de benchmark.

Reaplicação: comparar com setup registrado, incorporar somente mudanças necessárias, preservar bloco gerado pelo Next e conteúdo customizado; executar os mesmos checks. Não reiniciar otimização ou instalar duplicatas. Lição validada em 13/11: link no PRD não comprova que o anexo existe; exigir docs:check junto da consolidação. Invalidar/rever esta lição quando formatos ou estrutura de documentação mudarem.

## Segurança e dependências

[Prompt de revisão de segurança](prompts/13-revisao-seguranca.md) adotado, não executado como auditoria integral nesta etapa. Seu padrão é somente leitura: rastrear entrada→validação/autorização→operação, evidências reproduzíveis locais e relatório redigido fora do repositório, por exemplo em uma pasta privada de revisões na área de trabalho da usuária. Nenhum relatório privado, segredo, dado pessoal ou payload deve ser publicado. Correções e testes contra serviços exigem escopo/autorização próprios.

Não houve auditoria de dependências ou advisory novo nesta etapa; não declarar ausência de vulnerabilidades. Auditorias remotas podem transmitir manifestos e devem ser escolhidas conscientemente. Não atualizar dependências automaticamente para zerar alertas. Compilação/lint aprovados não comprovam segurança.
