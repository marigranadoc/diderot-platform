# Equipe e convites internos

Incremento de 12/11/2026 em `/painel/marca` → **Equipe e convites**. A organização continua privada e o responsável continua sendo o único editor.

## Jornada disponível

O responsável registra um e-mail, consulta o estado do convite e pode cancelá-lo enquanto pendente. A pessoa convidada entra com o mesmo e-mail confirmado, abre o painel e aceita ou recusa. O aceite cria um vínculo de membro com **somente leitura**; depois de atualizar os dados, a organização aparece no painel dessa pessoa. O responsável pode revogar o acesso de um membro, após confirmação na tela. Não pode remover a si próprio, transferir a organização ou promover outra pessoa a responsável.

Os convites existem apenas dentro da Diderot. **Nenhum e-mail ou mensagem externa é enviado.** A pessoa deve ser avisada por outro meio para abrir seu painel; o sistema não confirma ao responsável se aquele e-mail já tem cadastro. Uma conta criada posteriormente com esse e-mail confirmado pode receber o convite ainda válido. Cadastro e confirmação de e-mail têm os limites já documentados no módulo Auth.

O convite expira em sete dias pelo relógio do servidor. Normalização ignora espaços nas pontas e diferenças de maiúsculas/minúsculas. Convite pendente repetido retorna o mesmo registro, sem prolongar sua validade. Um novo convite após expiração, cancelamento, recusa ou revogação é um novo registro. Aceite, recusa e cancelamento repetidos são idempotentes no estado correspondente. Um convite revogado não restaura o vínculo.

Depois de revogar, novas consultas ao banco da pessoa removida são negadas imediatamente pelas regras existentes de organização. Telas já abertas não têm atualização remota automática; devem recarregar/atualizar. Nenhuma aplicação consegue desfazer dados que a pessoa já leu antes da revogação. Não há notificação por push, autoatualização entre contas ou alteração de campanhas nesta etapa.

## Modelo e autorização

Migração `20261112220605_organization_invitations.sql`, gerada com a CLI e alinhada à versão remota. Adiciona `organization_invitations` e o RPC `organization_team`. A tabela tem RLS e nenhum grant de acesso direto ao cliente. Índices cobrem pendências únicas por organização/e-mail, caixa de entrada e FKs de autor/resposta.

O RPC público é SECURITY INVOKER. Encaminha para uma função privada SECURITY DEFINER, com search_path vazio, referências qualificadas, enumeração fechada de ações e auth.uid obrigatório. Sua execução é concedida somente a authenticated; anon/PUBLIC não podem executá-la. USAGE do schema privado foi concedido a authenticated para essa chamada delimitada; a função de trigger de criação de proprietário continua sem EXECUTE para clientes, verificado no teste SQL.

- `inbox`: consulta somente convites pendentes e ainda válidos para o e-mail **atual e confirmado em auth.users**, não para um e-mail fornecido pelo cliente ou em user_metadata.
- `overview`, `invite`, `cancel` e `remove`: exigem proprietário atual da organização no banco. Um membro ou outro proprietário não pode gerenciar essa equipe.
- `accept`/`decline`: exigem o destinatário verificado e convite disponível. Aceite só insere role member; não recebe papel arbitrário.
- Nenhum caminho transfere owner_user_id ou permite alterar diretamente um vínculo.
- As mutações bloqueiam primeiro a organização e depois o convite. Aceite, cancelamento e revogação compartilham a mesma ordem; aceite e criação do vínculo são transacionais.

Os estados disponíveis são pending, accepted, declined, cancelled, revoked e expired. São registros de convite com estado atual e datas, não um log imutável completo de todos os eventos da plataforma. Expiração é aplicada na leitura/aceite; ao convidar novamente, a pendência expirada é arquivada. Não foi adicionado um serviço agendado de limpeza.

## Auditoria funcional

| Módulo | Rota | Funcionalidade | Status real | Evidência de teste | Problemas/limites | Correção necessária |
|---|---|---|---|---|---|---|
| Equipe | `/painel/marca` | Abrir equipe e caixa de entrada | Implementado | TEAM-01/02 e API autenticada real | Exige e-mail confirmado | Confirmação real de e-mails segue no escopo Auth |
| Responsável | Mesma rota | Registrar e cancelar convite | Implementado com persistência no banco | SQL remoto e TEAM-01 | Não envia e-mail; validade 7 dias | Entrega externa futura exige serviço e autorização próprios |
| Destinatário | Mesma rota | Aceitar/recusar e reler | Implementado | SQL remoto e TEAM-02/03 | Somente leitura | Papéis de edição não implementados |
| Responsável | Mesma rota | Revogar vínculo, confirmar/cancelar | Implementado | SQL remoto e TEAM-04 | Sem remoção do responsável | Transferência é outro fluxo |
| Permissões | RPC/API | Isolamento por organização/destinatário | Verificado no banco | `equipe-banco.json`, `equipe-api-anonima.json` | Não é auditoria administrativa completa | Administração permanece pendente |
| Erros | Mesma rota | Falha de rede/consulta/estado expirado | Implementado | TEAM-03/04 | Retorno perdido exige atualização; não há sucesso otimista | Atualizar antes de repetir |
| Sessão | Mesma rota | Descartar retorno após sair | Implementado | TEAM-05 e regressão BR-05 | Sem sincronização remota de revogação | Recarregar outra conta para refletir vínculo atual |
| Mobile | Mesma rota | Controles, confirmação e ausência de overflow | Chrome 390px | Playwright computador/celular e capturas | Não testado em aparelho físico | Validação física futura |

## Evidências e limites de teste

- `evidencias/equipe-banco.json`: SQL no PostgreSQL remoto com quatro identidades sintéticas e ROLLBACK. Cobre proprietário, membro, outro proprietário e conta sem e-mail confirmado; isolamento, normalização, repetição, expiração, cancelamento, recusa, revogação e tentativa de promoção.
- `evidencias/equipe-api-anonima.json`: API real negou RPC sem autenticação (42501).
- `evidencias/equipe-api-sessao-real.json`: login da conta demonstrativa já existente e chamada real somente de leitura à caixa de entrada. Não criou convites nem alterou dados de negócio; sessão própria encerrada localmente, preservando outras sessões.
- `evidencias/equipe-interface.json`: execução inicial 16/18; dois testes confundiram o título público do convite com um cartão de organização já acessível. Corrigido o seletor para verificar somente a lista de organizações vinculadas.
- `evidencias/auditoria-equipe.json`: auditoria integral após correção do seletor; resultado efetivo registrado no progresso.

Mutações autenticadas foram exercitadas em SQL com role/claims controlados e dados revertidos; não foram realizados dois logins Auth por HTTP trocando convites de verdade nesta etapa. A interface usa contratos simulados; eles não substituem banco real. Não houve teste com duas conexões SQL simultâneas, SMTP, push ou dispositivo físico. Nenhuma conta permanente ou convite real foi criado para esses testes.

O advisor registrou INFO de [RLS sem política na tabela de convites](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy): bloqueio direto intencional, sem grants, com acesso somente pelo RPC delimitado e testado. Não abrir a tabela para remover o aviso. O alerta anterior de [proteção contra senhas vazadas desabilitada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) permanece. Avisos informativos de índices não usados em dados pequenos foram preservados, sem removê-los por esse motivo.

## Pendências

Entrega de convites por e-mail, cargos com edição, saída voluntária do membro, transferência de responsável, notificações, política de retenção e auditoria de eventos completa. Campanhas, candidaturas, contratos, pagamentos e administração continuam em etapas futuras. A implementação desta gestão de leitura não aprova uma marca comercialmente.

A seção de equipe e o botão de acesso foram posicionados antes da lista e do formulário de organização. Assim, um destinatário não precisa cadastrar uma marca para localizar e aceitar um convite. Esse ajuste final de composição é revalidado separadamente da auditoria integral que já estava em execução; não altera regras de acesso.

A auditoria integral registrou 101/104 aprovações em 664,5 s. Além dos dois bloqueios administrativos conhecidos, houve uma falha móvel por duas confirmações de revogação simultâneas. A confirmação dessas ações agora é emitida somente pelo painel, sem duplicação transitória no componente filho. A versão final com a composição ajustada é revalidada separadamente. Resultado inicial não foi sobrescrito.

## Fechamento da etapa

A revisão de escopo adicionou um teste que tentava revogar um UUID externo à equipe. Ele revelou que a primeira implementação podia cancelar uma pendência correspondente à conta, mesmo sem haver um vínculo removido. A migração corretiva `20261112223445_organization_team_remove_scope.sql` exige um membro efetivamente removido da própria organização antes de consultar seus e-mails/histórico. Remover um UUID externo é um no-op idempotente, sem revelar associação de e-mail por esse caminho. Evidência antes da correção em `equipe-escopo-revogacao-antes.json`; suíte SQL ampliada aprovada em `equipe-banco-final.json`.

Interface final: **20/20 aprovados**, 174,2 segundos, computador/celular, em `evidencias/equipe-final.json`. Build e TypeScript aprovados. O resultado integral anterior permanece 101/104, sem soma de execuções ou alegação de plataforma completa. As verificações finais do advisor estão em `equipe-security-final.json`; mantêm somente o alerta Auth anterior e o INFO intencional da tabela bloqueada.
