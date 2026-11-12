# Organizações e painel da marca

Incremento de 12/11/2026. Rota `/painel/marca`, acessível pela home (Para marcas e rodapé) e pela conta autenticada.

## O que funciona

Uma conta autenticada pode cadastrar uma organização privada, reler e editar nome, site HTTPS opcional e descrição. O banco atribui o responsável a partir da sessão e cria seu vínculo de owner na mesma transação da organização. A tela só confirma a gravação depois de receber a organização e confirmar o vínculo no banco. Cancelar edição não grava; falha não vira sucesso ou lista vazia. Atualizar organizações permite conferir gravações cujo retorno tenha sido interrompido.

Cada conta pode criar uma organização neste incremento, por restrição UNIQUE no banco. Isso evita duplicação em tentativas repetidas. Vínculos autorizados podem permitir leitura de outras organizações, e o aplicativo agora possui convites internos, descritos em EQUIPE-CONVITES.md. Selecionar uma modalidade profissional, abrir o painel ou cadastrar a organização não concede papel administrativo nem aprovação comercial de marca.

Visitantes recebem entrada de conta, sem dados privados. O responsável pode editar somente sua organização. Membro pode ler a organização vinculada, sem editar, promover papel ou ver os vínculos de outras pessoas. Troca de sessão limpa o conteúdo e invalida respostas antigas; a sessão é verificada antes de salvar. Avisos de sessão e alterações no armazenamento apenas disparam verificação, sem assumir que um ID local é autenticado.

## Banco e permissões

Migração aplicada: `20261112213155_brand_organizations.sql`. O arquivo foi gerado com a CLI oficial e alinhado à versão registrada pelo Supabase remoto. Tabelas novas `organizations` e `organization_members`, ambas com RLS. Nenhuma tabela de negócio anterior foi alterada.

- Leitura de organização: responsável ou vínculo próprio existente.
- INSERT: somente nome/site/descrição. Owner, UUID e data vêm dos padrões do banco; o cliente não pode escrever owner_user_id.
- UPDATE: somente nome/site/descrição e somente pelo responsável. Transferência de proprietário não foi concedida.
- Vínculos: somente leitura dos próprios vínculos. INSERT, UPDATE e DELETE não são concedidos ao cliente.
- Sem leitura/escrita anônima e sem DELETE de organizações pela aplicação.
- Índice UNIQUE de proprietário; PK de vínculos por organização/usuário e índice por usuário/organização para consulta e políticas.

O trigger `diderot_private.attach_organization_owner` usa SECURITY DEFINER exclusivamente para inserir o vínculo do proprietário da organização recém-criada. Não é um RPC público: schema privado, execução revogada de PUBLIC/anon/authenticated, search_path vazio e referências qualificadas. Confere auth.uid igual ao proprietário antes de inserir. Não recebe ID de organização arbitrária nem concede outras funções. Esse privilégio restrito permite criar os dois registros atomicamente sem abrir uma API de autopromoção.

## Evidências

| Verificação | Evidência | Alcance |
|---|---|---|
| Criar/editar/reler e associação atômica | `evidencias/organizations-rls.json`, `supabase/tests/organizations.sql` | PostgreSQL remoto, três identidades sintéticas, ROLLBACK |
| Isolamento, spoofing, transferência, papel e anônimo | Mesmo teste SQL | Duas organizações, owner e membro de leitura, negações efetivas |
| API real | `evidencias/organizations-api-real.json` | Duas contas Auth temporárias, três sessões, criar/reler/editar e negar acesso cruzado/escalada |
| Navegador e banco reais | `evidencias/organizations-browser-real.json` | Login, edição, reload e logout em Chrome 390×844; organização temporária |
| Interface e erros | `evidencias/marcas-interface.json` | 10/10 computador/celular; contratos com mocks, inclusive resposta tardia após sair |
| Limpeza dos testes | `evidencias/organizations-cleanup.json` | Concluída após autorização explícita; zero contas, sessões, organizações ou vínculos de fixture |
| Advisors | `evidencias/organizations-security.json`, `organizations-performance.json` | Sem novo alerta de RLS/definer; avisos anteriores preservados |

A primeira execução SQL falhou apenas na asserção de privilégio que tentava resolver o nome de uma função em schema sem USAGE. A asserção passou a consultar o OID pelo catálogo; o schema não foi aberto aos usuários. Falha preservada em `organizations-rls-initial.json`; reexecução passou.

Os testes API/navegador usaram duas identidades recém-geradas com e-mails .invalid, sem mensagens enviadas. Não alteraram contas ou registros preexistentes. Sessões foram encerradas antes de solicitar a remoção das fixtures. O SQL de isolamento reverte todas as suas gravações. O navegador móvel é simulado, não um dispositivo físico.

## Avisos e pendências

O advisor mantém o alerta anterior de [proteção contra senhas vazadas desabilitada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Há apenas avisos informativos de índices antigos ainda não usados; não foram removidos por isso. Orientação do advisor: [índices sem uso](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

B01 está PARCIAL: cadastro privado e vínculo responsável funcionam; revisão/aprovação comercial, envio de convites por e-mail, cargos de edição, múltiplas organizações próprias, transferência e exclusão estão pendentes. B02/B03/B04 (diretório, campanhas e métricas) continuam ausentes, assim como administração. Não há publicação automática no catálogo demonstrativo, contratação, pagamento, envio de e-mail de convite ou serviço financeiro.

GAP-03 encontra uma entrada real do painel, mas essa aprovação de entrada não equivale à conclusão de toda a jornada da marca. O fluxo implementado possui evidências de gravação, releitura e permissão acima.

## Auditoria funcional do incremento

| Módulo | Rota | Funcionalidade | Status real | Evidência de teste | Problemas | Correção necessária |
|---|---|---|---|---|---|---|
| Marca | `/painel/marca` | Acesso e estado de visitante | Implementado | BR-01, navegador real | Administração não é concedida | Nenhuma no escopo |
| Organização | `/painel/marca` | Criar com vínculo responsável | Implementado, transação no banco | SQL remoto, API real, BR-02 | Uma organização própria por conta | Multiplicidade futura exige alteração explícita |
| Organização | Mesma rota | Editar, cancelar, reler após reload | Implementado | API real entre sessões e navegador real | Sem transferência/exclusão | Fluxos posteriores separados |
| Permissões | Mesma rota/API | Isolamento e membro de leitura | Implementado | SQL três identidades e API duas contas | Convites internos implementados; sem cargos de edição | Etapa futura para cargos de edição e notificações |
| Erros | Mesma rota | Consulta/escrita indisponível sem falso sucesso | Implementado | BR-03 | Gravação sem confirmação exige releitura | Atualizar organizações, sem duplicar cadastro |
| Sessão | Mesma rota | Saída em outra aba com consulta pendente | Implementado e revalidado | BR-05, marcas-revalidado.json | Falha inicial preservada no relatório integral | Nenhuma no escopo corrigido |
| Mobile | Mesma rota | Criar/editar/reler e sair | Chrome 390px verificado | BR e navegador com banco real | Dispositivo físico não testado | Validação física futura |
| Administração | Sem rota | Aprovação/moderação | Ausente | GAP-04 falha nos dois tamanhos | Jornada bloqueada | Implementar autorização e operações administrativas |

A auditoria integral inicial deste incremento teve **91 aprovados/3 falhas em 94 casos**, aproximadamente 7 minutos, em `auditoria-marcas.json`. Duas falhas são GAP-04/admin ausente; a terceira é BR-05 móvel. Corrigida a saída: limpar o conteúdo e invalidar consultas imediatamente, sem aguardar nova leitura; antes de consultar dados, a identidade verificada também precisa corresponder à sessão atualmente selecionada no navegador. A releitura local não concede autorização: getUser e RLS continuam exigidos. Revalidação registrada separadamente, sem alterar o resultado histórico.


Revalidação final: **20/20 aprovados**, 113,6 segundos, dois ciclos dos cinco cenários em computador/celular, em `evidencias/marcas-revalidado.json`. Build/TypeScript aprovados. Navegador com banco real reexecutado e aprovado após a correção (`organizations-browser-revalidated.json`). A auditoria integral não foi repetida após a correção final; seu resultado histórico permanece 91/94.

Limpeza concluída após autorização explícita da usuária. Removidas somente as duas identidades temporárias por pares exatos de ID/e-mail; cascata limitada às organizações e vínculos dessas fixtures. Verificação confirmou zero usuários, sessões, organizações e vínculos dessas identidades. Nenhuma conta ou registro preexistente foi alterado. Evidência final: `evidencias/organizations-cleanup.json`; as confirmações expiradas permanecem como histórico.


Atualização: [Equipe e convites internos](EQUIPE-CONVITES.md) agora permite convite, aceite/recusa e revogação de membros de leitura por operações delimitadas no banco. Não há grants diretos de escrita nos vínculos. A função de workflow privada possui EXECUTE para authenticated por meio do wrapper público INVOKER; o trigger anterior permanece sem execução direta pelos clientes.
