# Favoritos de visitante e conta

Atualização funcional de 12/11/2026. Corrige GAP-01 da auditoria; não cria cadastro anônimo no banco.

## Comportamento

Visitantes salvam e removem escolhas nos corações do catálogo de `/criador` e `/colecoes/[slug]`. A confirmação só aparece depois de a gravação no navegador retornar com sucesso. A seleção permanece ao recarregar, navegar entre páginas e reabrir uma aba no mesmo navegador e endereço. A interface informa “favoritos neste navegador”.

Abas da mesma origem recebem mudanças de inclusão, remoção e limpeza pelo evento storage. Antes de escrever, a aplicação relê a seleção atual, evitando substituir escolhas de outra aba a partir de uma tela desatualizada. Uma notificação local mantém componentes da própria página em sincronia. Retorno por histórico/bfcache relê o armazenamento.

O formato é versionado e limitado a 500 identificadores de produtos, sem e-mail, senha, identidade de conta ou dados financeiros. Identificadores são validados e duplicatas removidas na leitura. Conteúdo inválido não é apresentado como favorito válido: a tela avisa e permite recuperar a seleção ao salvar explicitamente uma escolha. Falhas de leitura, quota ou armazenamento bloqueado recebem mensagem, sem confirmar uma alteração que não foi gravada.

## Separação da conta

Entrar mostra exclusivamente os favoritos da conta consultados no Supabase, sob as políticas existentes. Não existe importação automática da seleção do visitante. Sair restaura somente a seleção local anterior; favoritos privados não são copiados para ela. A troca de identidade invalida retornos de consultas antigas e limpa a seleção exibida durante o carregamento. Erros de API não usam a lista local como fallback de uma conta.

Nenhuma tabela, migração, grant ou política foi modificada. Não há escrita remota de favoritos de visitante. A verificação real anterior de conta/RLS está em PAINEL-CREATOR.md; os novos cenários de login desta etapa usam contratos simulados e não substituem uma nova auditoria remota.

## Auditoria funcional

| Módulo | Rota | Funcionalidade | Estado real | Evidência de teste | Problemas/limites | Correção necessária |
|---|---|---|---|---|---|---|
| Shopper | `/criador`, `/colecoes/[slug]` | Salvar, reler e remover favorito local | Implementado | FAV-01, GAP-01 | Apenas navegador/origem atual | Nenhuma para este escopo |
| Shopper | Mesmas rotas, duas abas | Sincronizar inclusão/remoção/limpeza | Implementado | FAV-02 | Escritas exatamente simultâneas usam última gravação | Transações exigiriam outro armazenamento se esse requisito for adotado |
| Shopper | Mesmas rotas | Tratar erro de armazenamento | Implementado | FAV-03/FAV-04 | Navegador pode proibir persistência | Usuário permite armazenamento; UI não promete sucesso |
| Shopper | Mesmas rotas | Recuperar conteúdo inválido | Implementado | FAV-05 | Lista danificada não pode ser reconstruída | Selecionar novamente; sem sobrescrita automática ao carregar |
| Shopper | Outro contexto de navegador | Manter seleção local separada | Implementado | FAV-06 | Não sincroniza dispositivos, perfis ou endereços diferentes | Entrar para favoritos de conta; sem migração automática |
| Conta | `/conta` → catálogo → logout | Separar visitante e conta, persistir/remover favoritos de conta | Contrato verificado com mocks nesta etapa | AUTH-02 ampliado | Não comprova de novo banco/RLS real | Evidências remotas anteriores preservadas |

As rotas são exercitadas em 1440px e 390px, além da auditoria responsiva existente. A ação é verificada por releitura e estado, não por clique isolado. Permissão de visitante limita-se ao armazenamento da própria origem; não concede acesso ao banco. Favoritos de conta continuam dependendo de Auth e RLS.

## Limites e próximo bloco

Persistência local depende das configurações do navegador; dados podem ser removidos pelo usuário ou por políticas de navegação privada. A origem inclui protocolo, host e porta. Não comprova restauração de sessão após reiniciar o processo inteiro do navegador, nem teste em dispositivo físico. Não há garantia transacional entre escritas exatamente simultâneas em abas distintas. Esta etapa não implementa campanhas, contratação, círculos pessoais ou painéis brand/admin.

Próximo bloco funcional: fundação de marca com organizações e vínculos autorizados no backend, antes de campanhas. Nunca atribuir privilégios por um botão “sou uma marca” ou pela modalidade selecionada no perfil.

Fontes técnicas verificadas: [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [MDN storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event), [Supabase onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange). Changelog Supabase consultado; nenhuma atualização de biblioteca ou mudança de schema nesta etapa.

## Regressão de sessão encontrada nesta etapa

A auditoria integral desta correção registrou **75 aprovados e cinco falhas em 80 casos**, 430,6 segundos: quatro falhas de marca/admin e uma falha móvel ONB-07, em que o perfil ficava desconectado após entrar com outra conta em outra aba. Os doze casos FAV (seis cenários em dois tamanhos) e AUTH-02 passaram. Resultado preservado em `evidencias/auditoria-favoritos-navegador.json`.

O diagnóstico direcionado reproduziu ONB-07 uma vez em seis execuções (`evidencias/troca-conta-diagnostico.json`). A inspeção mostrou que a aba de perfil não repetia a consulta após a nova entrada. A assinatura de sessão estava dentro do efeito de recarga, sendo removida/recriada após sair. Ela foi separada e mantida por toda a permanência na tela, enquanto a leitura do perfil continua invalidando respostas antigas. Esse intervalo era uma possível causa da perda do evento, compatível com o comportamento observado. O teste também passou a exigir confirmação da entrada na aba da conta antes de avaliar a outra aba.

Essa correção não altera permissões de banco e não transforma o teste com mocks em autenticação remota real. Resultado de revalidação registrado no progresso; não apresentar 76/80 como uma execução que não aconteceu.

Apenas manter a assinatura ativa não bastou: a repetição posterior ainda teve **8 aprovados/2 falhas em 10 casos**, preservada em `evidencias/troca-conta-revalidada.json`. Uma execução com instrumentação de eventos teve 4/4, mas não foi usada para concluir a correção. Isso invalida tratar a primeira hipótese como causa única comprovada.

A versão seguinte adiciona observação da mudança de sessão no armazenamento do navegador. Essa mudança apenas dispara invalidação e nova consulta `getUser`; o identificador local não autoriza nem preenche o perfil. Atualização de token para a mesma pessoa não descarta o formulário. ONB-08 exercita a troca com BroadcastChannel indisponível, além de ONB-07. A assinatura permanece estável e a limpeza invalida consultas anteriores.

## Causa identificada por rastreamento

Mesmo com a primeira observação de storage, a repetição ainda teve 11/12 aprovações (`troca-conta-final.json`); não foi anunciada como sucesso. A instrumentação interna posterior (`troca-conta-estado.json`) reproduziu a sequência: SIGNED_IN da segunda identidade → getUser retorna AuthSessionMissingError → evento storage com a segunda identidade. O registro local já continha a segunda sessão ao final. A aplicação comparava a identidade informada pelo evento com a identidade informada pelo armazenamento e ignorava a segunda atualização, embora ainda não tivesse verificado a sessão.

A correção mantém separadas a identidade informada pela notificação e a identidade efetivamente confirmada por `getUser`. Uma leitura sem sessão não marca a pessoa como verificada. O evento storage só é ignorado quando a identidade já foi confirmada; caso contrário, dispara nova verificação. ONB-09 entrega deliberadamente SIGNED_IN antes de disponibilizar a sessão no armazenamento e exige carregar o novo perfil depois. Não usa aumento de timeout nem esconde a falha com retry automático do teste. Instrumentação removida do código final.

Validação final dirigida: 34/34 aprovados, 162,1 s, em `evidencias/favoritos-sessao-final.json`. Inclui o cenário causal ONB-09 e todos os cenários de favoritos/conta/perfil, nos dois tamanhos. O relatório integral anterior permanece 75/80; não foi reclassificado retroativamente. Áreas de marca/admin continuam ausentes.

Estabilidade da correção causal: repetição final ONB-07/ONB-09 com 12/12 aprovados, 56,5 s, em `evidencias/troca-conta-corrigida.json`, sem retry automático. Essa execução é separada da validação de 34 casos e da auditoria integral anterior.
