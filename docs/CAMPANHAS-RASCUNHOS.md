# Campanhas privadas em rascunho

Incremento de 12/11/2026. Acesso: `/painel/marca` → **Campanhas em rascunho**, após entrar e vincular uma organização. Mantém a identidade visual existente, com formulário responsivo e estados explícitos de consulta, edição, falha e confirmação.

## Escopo entregue

O responsável pode criar, listar, abrir, editar e reler rascunhos da própria organização. Membros vinculados consultam os registros em somente leitura. É possível escolher a organização acessível antes de abrir um registro. Uma organização sem rascunhos é distinguida de uma falha de consulta ou acesso revogado.

Campos: título obrigatório de 2–120 caracteres; tipo UGC, influencer ou híbrida; descrição até 5.000 caracteres; objetivo até 500; categoria até 100; início, término e prazo de candidatura opcionais. Término não pode anteceder início; prazo de candidatura não pode ultrapassar término. Não existe requisito de seguidores para UGC.

Cada modalidade tem um grupo de vagas nesta etapa, com quantidade inteira de 1–1.000 e orçamento estimado opcional por creator de R$ 0,01 a R$ 1.000.000. Valores são armazenados como centavos inteiros; orçamento vazio significa desconhecido, não zero. Rascunho pode não ter vagas. Tipo UGC só aceita grupo UGC; influencer só influencer; híbrida permite os três grupos. Trocar tipo remove grupos incompatíveis apenas do formulário até salvar. Os valores não geram cobrança nem compromisso de contratação.

Salvar é uma ação explícita. A interface só confirma após retorno da operação e releitura do registro com a versão confirmada. Campos permanecem disponíveis após falha. Cancelar alterações não salvas pede descarte explícito. Trocar de seção/atualizar organizações fica bloqueado enquanto há alterações ou gravação. Sair da conta remove o painel e invalida respostas pendentes; sair de página com campos alterados usa a proteção padrão do navegador quando disponível. Não há autosalvamento nem recuperação local de campos abandonados.

## Banco e permissões

Migração aplicada: `20261112225023_campaign_drafts.sql`. Tabelas `campaign_drafts` e `campaign_draft_slots` com RLS e somente SELECT para contas autenticadas. A leitura acompanha os vínculos autorizados em `organizations`; visitantes não têm acesso. Revogar vínculo retira o acesso em consultas posteriores. Dados já exibidos não são apagados remotamente de um navegador que permaneça aberto sem nova consulta; não há assinatura Realtime nesta etapa.

Gravação somente por `save_campaign_draft`. Wrapper público INVOKER chama função privada DEFINER com `search_path` vazio, identidade confirmada por `auth.uid()` e verificação/lock do proprietário da organização. Nenhum papel ou dono é aceito do formulário. Atualização do contexto e substituição dos grupos ocorrem na mesma transação. Campos desconhecidos, status publicado, tipos incompatíveis, datas incoerentes e valores inválidos são rejeitados no banco. Escrita direta nas tabelas está bloqueada.

Cada edição informa a versão esperada; divergência retorna `40001` e não sobrescreve a outra sessão. Cada tentativa usa identificador de requisição e UUID do rascunho estáveis: repetir o mesmo conteúdo após resposta perdida não duplica nem incrementa versão novamente. Reutilizar a mesma requisição com conteúdo diferente é rejeitado. Após falha, se o conteúdo for alterado, uma nova requisição pode encontrar conflito com a gravação anterior; atualizar e abrir a versão armazenada resolve o estado. O mecanismo guarda a última requisição por rascunho, não um histórico completo.

## Auditoria funcional deste incremento

| Módulo | Rota | Funcionalidade | Status real | Evidência de teste | Problemas / correção necessária |
|---|---|---|---|---|---|
| Marca | `/painel/marca` | Abrir organização e campanhas | Implementado, sessão/vínculo exigidos | BR + CAMP-06; leitura HTTP real | Cadastro não equivale à habilitação comercial |
| Rascunho | mesma | Criar/editar/reler contexto e grupos | Implementado no escopo acima | CAMP-01–04; SQL remoto atômico | Etapas completas do briefing ainda pendentes |
| Permissões | mesma/RPC | Owner escreve; membro lê; estranho e anônimo bloqueados | Implementado no banco | SQL com três identidades + ROLLBACK; CAMP-05; HTTP anônimo | Não representa cargos de edição ou administrador |
| Erros | mesma | Falha de consulta/gravação, resposta perdida e conflito | Implementado | CAMP-03/04/06 e SQL de versão/requisição | Sem histórico/auditoria de todas as versões |
| Persistência | mesma | Gravação transacional e releitura | Banco real testado via SQL; interface por contratos simulados | `campanhas-banco.json`, CAMP-01 | Ainda validar edição por duas sessões Auth reais via HTTP |
| Celular | mesma | Formulário, consulta, salvamento, cancelamento | Verificação automatizada em Chrome 390×844 | CAMP-01–06 | Não equivale a aparelhos físicos/iOS |
| Creator | futura descoberta | Encontrar campanha/candidatar-se | Não implementado | Requisito U09/U10 | Depende de briefing completo, publicação e condições por vaga |
| Administrador | ausente | Moderação/habilitação | Não implementado | GAP-04 permanece falhando | Implementar papel e autorização antes de ações administrativas |

## Evidências e alcance

`supabase/tests/campaign-drafts.sql` passou no Supabase remoto com três identidades efêmeras, claims controladas e ROLLBACK: criação/edição/releitura, grupos atômicos, tentativa repetida, conflito, conteúdo inválido sem mudança parcial, isolamento cruzado, leitura de membro e bloqueio de edição/gravação direta/publicação. Nenhuma conta permanente, campanha real, mensagem externa ou serviço financeiro foi criado/usado.

Revalidação ampliada também passou: o responsável usa o RPC real de equipe para revogar o membro da fixture; consultas seguintes do ex-membro retornam zero rascunhos e vagas. Resultado em `evidencias/campanhas-banco-final.json`. Duas confirmações expiraram no suplemento inicial que retirava o vínculo por SQL direto; nada foi executado nessas tentativas. O teste final percorre a revogação do módulo existente, com todos os dados revertidos ao fim da transação.

Interface dirigida final: **36/36 aprovados**, 146,7 s, computador/celular, incluindo CAMP-01–08 e regressão de marca/equipe, em `evidencias/campanhas-interface-final.json`. A primeira execução teve 12/22 aprovados; seletores de teste corrigidos para o campo de tipo e para limitar avisos ao conteúdo principal. `evidencias/campanhas-interface-inicial.json` preserva as falhas. Build/TypeScript aprovados. A auditoria integral e seu resultado estão no progresso; não somar execuções distintas.

`scripts/check-campaign-session.mjs` passou com login da conta demonstrativa existente, leitura HTTP real das tabelas com relacionamento, escopo por organização e bloqueio anônimo de tabela/RPC. É uma prova de integração de leitura, sem mutações pela API nem dois logins de pessoas diferentes. A sessão de verificação foi encerrada localmente. Resultado em `evidencias/campanhas-api.json`. As mutações reais foram verificadas no PostgreSQL; navegador usa contratos simulados em `tests/campaigns.spec.ts`.

Advisors: nenhuma nova advertência de segurança nas tabelas de campanhas. Permanece WARN anterior de [proteção contra senhas vazadas desativada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). INFO de RLS sem políticas em convites é intencional: tabela fechada, acesso pelo RPC guardado. Índices recém-criados sem uso histórico não foram removidos por esse aviso. Resultados em `evidencias/campanhas-advisors-*.json`.

## O que falta antes de publicar

U07/U08 continuam **PARCIAIS**, não concluídos. Faltam múltiplas vagas por modalidade, requisitos por vaga, entregáveis, briefing em sete etapas, produtos/referências, direitos de uso, condições de remuneração/gifting/afiliação, revisão completa, aprovação comercial, publicação/pausa/encerramento/arquivamento, descoberta e candidaturas. Ainda não há exclusão de rascunho, contratação, produção, entregas, métricas, histórico completo ou financeiro. A próxima etapa é completar o briefing e as condições das vagas, com validação de publicação no backend antes de disponibilizar oportunidades a creators.
