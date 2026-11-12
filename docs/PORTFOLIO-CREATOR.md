# Portfólio privado por links — 12/11/2026

Rota: `/conta/criador/portfolio`, acessível pelo perfil de creator salvo.

## Entrega

Cadastro, listagem, edição e exclusão confirmada de trabalhos: vídeo UGC, fotografia, case, conteúdo demonstrativo, projeto realizado e outro trabalho. Campos: título, tipo, categoria, descrição, participação e link HTTPS. Links com credenciais e outros protocolos são recusados; links salvos também são revalidados antes de aparecer como destino clicável. Abertura externa usa noopener/noreferrer. O aplicativo não baixa, incorpora nem faz preview automático do destino. Nenhum servidor recebe instrução para buscar a URL.

Os registros ficam privados. Isso não altera a visibilidade dos arquivos no site externo. Excluir item remove o registro da Diderot e preserva o arquivo no serviço de origem. Falhas de gravação não mostram falso sucesso nem substituem os dados anteriores. Visitante precisa entrar e conta sem perfil precisa configurá-lo. Troca de sessão limpa os dados carregados.

Migração aplicada: `20261112162722_creator_portfolio.sql`. Tabela `creator_portfolio_items` com FK para o perfil, índice de proprietário/data, validações e RLS próprias para leitura/inserção/atualização/exclusão. Não há grant de UPDATE em user_id. Inspeção remota confirmou zero itens, leitura anônima negada e transferência de proprietário bloqueada. `node scripts/check-portfolio.mjs` confirmou rejeição da leitura anônima pela API (42501).

## Limites de U03

Estado PARCIAL: gestão privada por links implementada. Upload de arquivos, miniaturas, armazenamento/transformação de mídia, publicação no perfil, marcas autorizadas e métricas ainda não estão implementados. Cadastrar um case é uma declaração do creator, não confirmação de vínculo com marca, resultado ou trabalho contratado. Não há avaliações nem números de desempenho gerados.

Testes de interface usam Auth e itens simulados; a verificação API anônima é real. Não houve envio de e-mails, criação de contas reais, navegação aos links externos ou alteração de dados reais. Isolamento entre duas contas reais continua pendente conforme ONBOARDING.md. As oito lacunas gerais seguem abertas; testes deste módulo não aprovam a plataforma inteira.

## Segurança

O advisor manteve o alerta anterior de proteção contra senhas vazadas desabilitada no Auth, sem novo aviso da tabela. [Orientação de correção](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Essa configuração permanece pendente e não foi alterada neste incremento.

## Continuidade

Antes de upload/publicação, definir buckets privados, limites de arquivo, retenção, processamento e acesso assinado, além de regras de consentimento/publicação. Não tornar os registros privados públicos por conveniência. Campanhas e contratação continuam dependentes da identidade, vínculos e regras de projeto.

Validação: build e TypeScript aprovados; **24/24 testes direcionados aprovados**, computador/celular, em `evidencias/portfolio-creator.json`. Cobertura: onboarding, serviços e portfólio; Auth/itens de interface simulados. A API anônima remota foi testada separadamente e negou acesso. As oito lacunas da auditoria integral permanecem abertas; isolamento entre usuários autenticados reais e envio de e-mail ainda não foram validados.
