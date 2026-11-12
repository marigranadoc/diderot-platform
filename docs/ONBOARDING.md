# Contas e perfil inicial de creator — 12/11/2026

## Implementado neste incremento

- `/cadastro`: e-mail, senha e confirmação; chamada real `signUp` no cliente quando a pessoa envia o formulário. Mostra orientação de confirmação quando não há sessão; não anuncia login imediato nesse caso. Valida senha mínima de oito caracteres e confirmação correspondente.
- `/recuperar-acesso`: solicitação de link, resposta neutra sobre existência da conta, erro/limite de solicitações e definição de nova senha após sessão verificada. Link inválido/expirado mostra erro e permite pedir outro.
- `/conta`: links de cadastro, recuperação e configuração de creator; tratamento de confirmação inválida/expirada.
- `/conta/criador`: nome profissional, bio, cidade/UF e modalidades UGC, influencer e afiliado. Seleção múltipla na mesma conta, sem campo ou mínimo de seguidores. Perfil permanece privado, sem portfólio/campanhas/publicação nesta etapa.
- `creator_profiles`: inserção e leitura próprias, atualização apenas dos campos profissionais. Usuário não recebe UPDATE em user_id. Modalidades são preferências profissionais, não concessão de papel administrativo ou acesso de marca.

Migração aplicada: `supabase/migrations/20261112101450_creator_onboarding.sql`. Nenhuma tabela anterior foi substituída. Advisor de segurança retornou zero alertas; isso não certifica isolamento comportamental.

## Verificações remotas efetivas

A consulta pública de configurações Auth retornou cadastro habilitado, e-mail habilitado e confirmação por e-mail obrigatória. A inspeção do banco confirmou zero usuários, zero perfis, leitura anônima negada, atualização do proprietário negada e atualização de modalidades concedida sob RLS. Não foram enviados e-mails nem criadas contas reais.

## O que ainda não está validado

A entrega/retorno dos e-mails de confirmação e recuperação, os destinos autorizados e a jornada Auth real não foram testados. O plugin atual não disponibiliza uma operação específica para ler/alterar a configuração de URLs do Auth. Para usar a prévia, conferir no projeto Supabase **Authentication → URL Configuration** o Site URL e os destinos exatos do ambiente:

- `http://127.0.0.1:3002/conta`
- `http://127.0.0.1:3002/recuperar-acesso`

O código usa a origem atual do navegador; se a porta/domínio mudar, os destinos autorizados também devem corresponder ao ambiente. Não abrir curingas amplos em produção. A presença de uma URL no cliente não comprova sua autorização pelo provedor.

`supabase/tests/favorites.sql` foi novamente solicitado, mas a confirmação adicional do serviço expirou; o SQL não foi executado. `supabase/tests/creator-profiles.sql` está preparado e não executado. Esses scripts criam somente fixtures temporárias em transação, validam acesso entre dois usuários e terminam com ROLLBACK. Devem ser executados em ambiente autorizado e conferidos antes de declarar isolamento validado.

## Testes e limitações

`tests/onboarding.spec.ts` cobre contratos de interface: senhas divergentes, cadastro aguardando confirmação, falha e sucesso neutro na recuperação, atualização de senha, link expirado, visitante sem formulário privado, UGC sem seguidores, releitura simulada, combinação das três modalidades e falha de gravação sem falso sucesso. Auth e dados de perfil são interceptados por mocks; não equivalem a entrega de e-mail ou persistência real entre contas.

O catálogo das jornadas públicas continua sendo lido do Supabase. As lacunas GAP existentes continuam na auditoria, sem serem puladas ou marcadas como falhas esperadas.

## Compilação

O Turbopack falhou duas vezes ao iniciar o processo de transformação de CSS. A compilação com Webpack passou. O script `npm.cmd run build` agora usa `next build --webpack`, opção documentada pela versão instalada. A troca não altera o framework nem as regras de produto.

## Próxima etapa

Validar Auth real/URLs e executar os testes SQL de isolamento; então evoluir o perfil privado para portfólio, serviços e diretório com políticas próprias. Não existe ainda painel de gestão de loja, brand ou administrador. Selecionar UGC não concede aprovação, contrato, campanha ou remuneração.

A tela limpa os campos na saída ou troca de usuário em outra aba e consulta novamente a sessão antes de carregar o próximo perfil. O teste ONB-07 cobre esse contrato com duas abas e identidades simuladas.

Atualização de validação: testes de sessão real e isolamento remoto foram executados em 12/11/2026. Consulte [PAINEL-CREATOR.md](PAINEL-CREATOR.md) para resultados e limites; as pendências históricas de isolamento desses módulos foram superadas no escopo dos testes documentados. Entrega de e-mail e duas sessões Auth de identidades distintas continuam pendentes.
