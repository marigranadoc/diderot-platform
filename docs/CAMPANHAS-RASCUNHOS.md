# Campanhas privadas em rascunho

Incremento original de 12/11/2026; ampliado em 13/11/2026 pelo briefing privado descrito ao fim deste documento. Acesso: `/painel/marca` → **Campanhas em rascunho**, após entrar e vincular uma organização. A seção final atualiza o escopo; resultados anteriores permanecem históricos.

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

## Briefing privado em sete etapas — 13/11/2026

O incremento 37 substitui a pendência acima somente no escopo de planejamento privado: editor de sete etapas, referências e condições por grupo/modalidade. Mantém um grupo por modalidade (até três por campanha híbrida); não implementa múltiplas vagas diferentes da mesma modalidade. Publicação e operação comercial continuam bloqueadas.

| Etapa | Dados implementados | Persistência/limite |
|---|---|---|
| 1. Informações gerais | Contexto/datas anteriores; tom, mensagens, restrições, até 20 links HTTPS e 20 produtos de referência com nome/link | `campaign_drafts.briefing`; links não são consultados/importados. Produto referenciado não é SKU do catálogo, estoque ou envio |
| 2. Modalidades/vagas | Tipo UGC/influencer/híbrida, quantidade e estimativa por creator | Estrutura anterior mantida; trocar tipo retira grupos incompatíveis do formulário, sem salvar automaticamente |
| 3. Requisitos | Nichos, idiomas, região, experiência, portfólio, estilo, habilidades e canais; audiência somente em influencer/híbrida | `campaign_draft_slots.briefing.requirements`; UGC não aceita mínimo de seguidores no banco, mesmo enviando payload direto |
| 4. Entregáveis | Vídeos/fotos, formato/resolução/duração, captação/roteiro, prazo, revisões, brutos e exigência explícita de postagem/comprovação | `deliverables`; publicação pessoal inicia desmarcada, inclusive em UGC; não há upload/entrega real |
| 5. Direitos de uso | Planejamento de orgânico/mídia paga, canais, meses/território, imagem/voz, exclusividade e renovação | `rights`; condições planejadas não concedem licença nem registram aceite |
| 6. Remuneração | Produção e publicação em centavos separados; comissão em pontos-base; regras/vigência, bônus, produto/gifting e pagamento | `compensation`; vazio/nulo é desconhecido, zero é explícito. Sem cobrança, rastreamento, saldo ou liquidação |
| 7. Revisão/publicação | Resumo de contexto, referências e todas as condições por modalidade; navegação entre etapas | Publicação indisponível, sem botão de ação fictícia; salvar mantém `status=draft` |

Salvar é possível em qualquer etapa com título válido e campos opcionais parciais. Validações rejeitam tipo/campo desconhecido, valores fora de limite, precisão inválida, URL sem HTTPS/com credencial e data inválida. Textos adicionais têm até 2.000 caracteres por campo; vídeo/foto até 100, revisões até 20, duração até 86.400 segundos, uso até 120 meses; valores de produção/publicação até R$1.000.000 e comissão até 100%. Estimativa antiga mantém seu intervalo original e significado separado. Estes são limites técnicos de planejamento, não condições comerciais obrigatórias.

Migração aditiva aplicada e alinhada ao histórico remoto: `20261113120556_campaign_briefing.sql`. Colunas JSONB `briefing` com objeto vazio por padrão preservam registros existentes. RPC público e permissões anteriores mantidos, com validação privada de estrutura e conteúdo. Gravação de contexto/grupos/condições, versão e recibo continuam atômicos. Última requisição guarda o documento completo, incluindo condições, para retry idempotente.

Cliente antigo sem o campo de briefing é impedido de regravar um registro que já tenha condições novas, evitando perda silenciosa. Rascunhos ainda sem condições novas continuam compatíveis com o contrato antigo. O responsável pode alterar as próprias condições no editor novo; membro consulta e estranho/anônimo são bloqueados no banco. Helpers privados não recebem EXECUTE de `authenticated`/`anon`.

Corrigido também um bloqueador preexistente: converter a linha do banco em formulário espalhava `id`, organização, status/revisão e relacionamento para o documento de edição; o RPC estrito não aceita esses campos. A conversão agora seleciona somente campos editáveis, e o teste valida o contrato após salvar/reabrir/editar. Novas textareas têm nome acessível explícito estável ao reler valores; a primeira rodada detectou falhas de localização desses campos carregados.

| Módulo | Rota | Funcionalidade | Status real | Evidência / limite | Próxima correção |
|---|---|---|---|---|---|
| Briefing | `/painel/marca` | Navegar sete etapas e salvar condições por modalidade | Implementado no frontend local e banco | CAMP-09/10 e SQL com ROLLBACK; resultado final abaixo | Publicar frontend em etapa autorizada; múltiplas vagas por modalidade |
| Persistência | mesma/RPC | Editar/reler condições, zero/nulo e comissão precisa | Banco real verificado em SQL | `briefing-banco.json`; HTTP verifica leitura, não escrita positiva por duas sessões Auth | Ampliar futura homologação de edição real por HTTP |
| Permissão | mesma | Responsável edita, membro lê, cruzamento/anônimo negados | Mantido e verificado no banco | SQL, API real de três identidades demo e CAMP-11 | Elegibilidade comercial/admin continuam pendentes |
| UX/erros | mesma | Campos preservados, conflito/retry, descarte e navegação móvel | Implementado no escopo | CAMP-01–11; resultados e falhas separados | Não confundir simulação do contrato com teste integral de backend |
| Publicação | mesma | Criar oportunidade pública | Não implementado | Status limitado a draft no banco e aviso no resumo | Catálogo vinculado, múltiplas vagas, revisão/elegibilidade e transições |

SQL novo passou com identidades efêmeras/claims controladas e ROLLBACK: persistência/releitura/edição, 13 variantes de campos/URLs/datas/valores inválidos, UGC sem exigência de audiência, proteção contra cliente antigo, precisão/zero, helper privado, isolamento, revogação, membro somente leitura, retry/conflito e rejeição de publicação. A suíte anterior também passou sem alterações, confirmando o contrato legado para rascunhos antigos. A primeira execução do fixture novo falhou por delimitador SQL gerado incorretamente; corrigido no arquivo de teste, sem falha de migração ou alteração permanente de fixture.

HTTP real de marca/creator/shopper demonstrativos confirmou login, leitura dos campos/relacionamento da própria organização e negação cruzada/anon de leitura e RPC; sessões encerradas localmente. Nenhuma gravação de negócio positiva, conta permanente ou mensagem externa nesse probe. Validação positiva de gravação permanece no SQL, não declarar dois logins Auth editando por HTTP.

Advisors após migração mantiveram somente o WARN anterior de [senhas vazadas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) e INFO intencional de convites fechados ao acesso direto. Sem novo alerta de funções/tabelas deste incremento. Build aprovado; resultados da interface/revalidação são registrados separadamente ao concluir a execução.

Interface inicial: **16 aprovados/6 falhas em 22 casos**, 247,3 segundos, sem retries; falhas dos três casos novos nos dois tamanhos ao localizar textareas com conteúdo já preenchido. Corrigidos os nomes acessíveis no componente, mantendo as verificações de releitura. Também adicionada a regressão do contrato de campos após editar, e mock passa a rejeitar campos desconhecidos como o RPC real. Evidência [inicial](evidencias/briefing-interface-inicial.json).

Revalidação final ampliada: **24/24 aprovados**, 112,4 segundos, sem skips/retries: CAMP-01–11 (contratos simulados) e EXP-06 (três identidades Auth reais, leitura sem mutações de negócio), desktop/celular. [Resultado final](evidencias/briefing-interface-final.json), [SQL](evidencias/briefing-banco.json) e [API](evidencias/briefing-api.json). Conferida visualmente a captura móvel de condições em `work/screenshots/celular-briefing-condicoes.png`; desktop também capturado. Build e check aprovados. Auditoria integral não repetida; não somar rodadas para anunciar plataforma concluída.

Frontend atualizado somente na prévia local, reaberta na porta 3002; sem novo commit/push/deploy neste incremento. Migração já aplicada ao Supabase. Os três rascunhos demonstrativos e os demais dados de negócio foram preservados. Próximo bloco e gates de lançamento no [plano do MVP](PLANO-LANCAMENTO-MVP.md).
