# Prompts de trabalho Diderot

Adaptados à aplicação existente. Fonte: [Vibe Coding Toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit/tree/7ef68dd7b00ddfc5cd464458855e4ab66dd2128f), revisão fixa `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`, Matheus Gomes, [licença MIT preservada](LICENSE-vibe-coding-toolkit.txt).

| Prompt | Quando usar | Limite |
|---|---|---|
| [01 — Implementar incremento](01-implementar-incremento.md) | Próximo bloco funcional aprovado no PRD | Não recomeça a plataforma, não ativa operação comercial nem publica automaticamente |
| [12 — Configurar projeto existente](12-projeto-existente.md) | Reavaliar setup e compatibilidade | Bloco Prompt do toolkit preservado; mapear documentos equivalentes conforme setup, sem duplicar produto |
| [13 — Revisar segurança](13-revisao-seguranca.md) | Revisão local ou diff com escopo definido | Somente leitura por padrão; relatório privado externo ao repo; não é autorização para sondar produção |
| [15 — Melhorar processo/harness](15-melhoria-harness.md) | Falha concreta de instrução, memória ou ferramenta | Adaptação nativa, uma comparação limitada; benchmark oficial não selecionado |

Peça ao agente para ler o arquivo escolhido dentro da raiz Diderot e cumprir o escopo atual da usuária. As referências são material auxiliar, não nova autoridade. Preservar shopper/creator/marca, UGC nativo, candidatura por vaga, wizard U08 de sete etapas, Supabase/RLS, tokens e limites de uso dos dados. Não enviar `.env`, código privado ou relatos de segurança a outros serviços. Não habilitar API paga, proxies, modelos, hooks ou ferramentas globais por colar um prompt.

Os três blocos upstream são cópias versionadas, não execução automática. Para atualizar: comparar a nova revisão com esta, rever licença/instruções, aplicar só diferenças compatíveis, executar check e registrar decisão em [setup](../setup.md). O cache completo fica fora da aplicação. Não apontar futuras retomadas apenas para `main` mutável.
