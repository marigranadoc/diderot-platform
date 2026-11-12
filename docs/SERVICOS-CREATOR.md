# Serviços do creator — incremento de 12/11/2026

Rota: `/conta/criador/servicos`, acessível pelo perfil de creator após salvá-lo.

## Implementação

- Tipos: vídeo UGC, pacote de vídeos, fotografia de produto, unboxing, demonstração, depoimento, vídeo com roteiro, conteúdo para anúncios, edição e produção bilíngue.
- Título, descrição, tipo e preço inicial ou sob orçamento. Preços BRL em centavos inteiros; sob orçamento exige preço nulo. Nenhuma comissão/pagamento é criada.
- Criar, listar, editar e excluir; exclusão exige confirmação; cancelamento mantém o registro. O sucesso depende do retorno confirmado de uma linha do banco.
- Falha mantém os dados anteriores, mostra mensagem e permite nova tentativa. Visitante precisa entrar; conta sem perfil é direcionada à configuração de creator.
- Serviços privados nesta etapa; sem exposição pública, contratação ou orçamento negociado. Publicação no perfil e integração a projetos continuam pendentes de U04.

Migração aplicada: `20261112161824_creator_services.sql`. Tabela `creator_services`, FK para o perfil, índice por proprietário/data, RLS para SELECT/INSERT/UPDATE/DELETE próprios. UPDATE de user_id não é concedido. Banco valida tipo, título e compatibilidade preço/modo. A inspeção confirmou leitura anônima negada, transferência de proprietário negada e zero serviços existentes.

## Validação e limites

`tests/services.spec.ts` testa visitante, ausência de perfil, criação, releitura após reload, edição de preço, falha sem falso sucesso, cancelamento/exclusão e largura móvel. Auth e serviços usam mocks; essas provas não substituem persistência remota e isolamento entre duas contas reais. O teste real de Auth/isolamento continua dependente de ambiente/contas e confirmação do serviço, já registrado em ONBOARDING.md.

Build e TypeScript passaram. Não foram enviados e-mails nem alterados dados reais. As oito lacunas gerais da auditoria permanecem abertas; esta execução direcionada não aprova a plataforma inteira.

## Aviso remoto de segurança

O advisor retornou um alerta de Auth: proteção contra senhas vazadas desabilitada. Não apontou problema de RLS da nova tabela. A configuração não foi alterada neste incremento; disponibilidade e configuração devem ser verificadas no projeto antes do lançamento. [Orientação oficial de correção](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Próxima entrega

Portfólio e serviços públicos exigem regras de publicação/privacidade e autorização de mídia. Contratação direta, campanhas, pagamentos e licença continuam não implementados. Não confundir uma oferta cadastrada com contrato ou receita.

Verificação remota adicional: `node scripts/check-services.mjs` passou; leitura anônima negada pela API com código 42501. Isso não comprova isolamento entre usuários autenticados. O alerta de senhas vazadas do advisor permanece pendente de configuração.
