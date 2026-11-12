# Diderot — requisitos de referência para auditoria

O [PRD consolidado da Diderot](PRD-DIDEROT.md), de 12/11/2026, reúne estes requisitos com a implementação atual e o backlog. Este documento permanece como registro da origem dos requisitos.

Data: 11/11/2026. Documento criado nesta auditoria porque o usuário confirmou que não havia PRD. Não é um PRD original recuperado da ShopMy nem uma descrição do seu backend. É uma base rastreável para comparar o protótipo Diderot com comportamentos públicos observados pelo REA.

## Autoridade da evidência

- **O — observado:** página, campo ou transição capturada pelo REA. Observar um formulário não comprova gravação ou aprovação.
- **D — declarado pela referência:** descrição pública de um produto, sem execução autenticada. Não equivale a teste end-to-end.
- **R — requisito da auditoria:** banco, persistência, permissões e jornada administrativa pedidos pelo usuário. Não são inferidos do código privado da ShopMy.
- **L — escopo local anterior:** loja demonstrativa sem pagamentos, cadastro ou banco, conforme README e conversa. A ausência de um requisito futuro é uma lacuna de produto, não necessariamente regressão do protótipo.

E1: [captura pública](evidencias/rea-publico.json), `ev_29d9f301188fb38661cec5c699b1a9a36930d405f84dfbc5bed933ec8a52bf5a`. Rotas `/home`, `/home/creators`, `/home/brands`, `/apply/creator`.

E2: [abertura de seleção de perfil e login](evidencias/rea-formularios.json), `ev_01d6df81641982cc0ea2b74e16290043a874df082e7af0cbba8f978fce6efa3c`. REA clicou em Request Demo e Log In. Request Demo abriu uma seleção de Shopper/Creator/Brand; não comprovou envio de solicitação de demonstração. Login abriu campos Email e Password, botão inicialmente desabilitado e opção de recuperação. Nenhum formulário foi enviado.

E3: [shopper no celular](evidencias/rea-shopper-mobile.json), `ev_67f7246dbcd177de5e0f0c53b366e7c8406257dbd409617badec2fa1caf5c044`. Rotas `/shop/my/circles` e `/shop/my/taste`, 390 × 844. Estado vazio de grupos e instrução de favoritar 25 produtos para formar perfil. Não se verificou criação, persistência ou geração do perfil.

E0: análise anterior em [ANALISE-SHOPMY.md](../ANALISE-SHOPMY.md): loja pública, busca aberta, detalhe de produto e versão móvel. Evidências históricas identificadas nesse documento; não são novas capturas desta auditoria.

## Catálogo de requisitos e critérios de conclusão

| ID | Módulo | Requisito | Origem | Critério para considerar concluído |
|---|---|---|---|---|
| S01 | Shopper | Descobrir conteúdo pela inicial | O/E1, L | Navegar da inicial à loja e a coleções sem erro; ação abre conteúdo correspondente. |
| S02 | Shopper | Explorar múltiplos curadores, marcas, categorias e grupos | O/E1 | Diretórios com resultados reais do ambiente de teste, filtros consistentes e navegação até conteúdo. |
| S03 | Shopper | Perfil de creator com bio | O/E0, L | Perfil abre, identifica autor e exibe catálogo correspondente. |
| S04 | Shopper | Coleções e respectivos produtos | O/E0, L | Cada coleção só contém seus próprios produtos e permite abrir e retornar. |
| S05 | Shopper | Buscar produtos | O/E0, L | Resultado corresponde ao termo; vazio permite recuperação. Tolerância a acentos/espaços é critério próprio da Diderot. |
| S06 | Shopper | Filtrar e ordenar | O/E0 para categorias; L para preços | Categorias e ordenação alteram todos os resultados corretamente, inclusive em coleção. |
| S07 | Shopper | Salvar e remover favoritos | O/E0, R para persistência | Ação altera estado real; para versão completa, recarregar e entrar novamente preserva itens no banco por usuário. Estado React não satisfaz persistência. |
| S08 | Shopper | Ver detalhe e disponibilidade | O/E0, L | Produto correto, descrição/preço demonstrativos claros; CTA revela informação sem segundo clique oculto. |
| S09 | Shopper | Ir ao varejista | O/E0 | Destino válido e associado ao produto; sem simular compra. Transação financeira de produção fora desta auditoria. |
| S10 | Shopper | Criar/administrar grupos de curadores | O/E3 para tela; R para persistência | Criar, reler, editar e excluir apenas grupos próprios no ambiente local de teste. |
| S11 | Shopper | Perfil de gosto | O/E3 para estado inicial | Regras de geração verificadas antes de implementação; preferências persistentes por usuário. Regra de 25 itens pertence à referência, não foi adotada automaticamente. |
| A01 | Contas | Entrar, sair e recuperar acesso | O/E2 para formulário, R | Sessão real; falha de credenciais tratada; logout invalida sessão; testes de acesso anônimo. |
| A02 | Contas | Perfis shopper/creator/brand | O/E2, R | Identidade e papel verificados no servidor, sem confiar em seleção do navegador. |
| C01 | Creator | Candidatura | O/E1 | Primeira etapa observada contém nome público, nome legal, email e telefone; produção futura precisa validação e confirmação de gravação local. Etapas seguintes não observadas. |
| C02 | Creator | Gerir a própria loja, coleções e produtos | D/E1, R | Criar → salvar → recarregar → editar → verificar loja pública; propriedade validada no servidor. |
| C03 | Creator | Links de afiliado e desempenho | D/E1 | Contrato funcional e ambiente de simulação definidos antes de integrar; clique sozinho não comprova comissão. |
| C04 | Creator | Parcerias com marcas | D/E1 | Proposta, aceite/recusa, status e permissões verificáveis com contas fictícias. Fluxo privado não observado. |
| B01 | Brand | Entrada/candidatura da marca | O/E1/E2 apenas seleção de perfil | Definir e verificar fluxo posterior; não chamar seleção de perfil de cadastro concluído. |
| B02 | Brand | Descoberta de creators | D/E1 | Busca e seleção de creators com resultados e permissões do ambiente local. |
| B03 | Brand | Campanhas, gifting e oportunidades | D/E1 | Criar e acompanhar campanha com transições, persistência e autorização; sem envio de mensagens ou bens reais. |
| B04 | Brand | Métricas de desempenho | D/E1 | Fonte, cálculo e acesso segregado comprovados; dados simulados rotulados. |
| M01 | Administrador | Entrada e gestão administrativa | R | Autenticação, autorização por papel e operações administrativas auditáveis. Nenhuma tela administrativa ShopMy foi observada. |
| M02 | Administrador | Aprovação/moderação | R; candidatura sugere revisão, não comprova UI | Especificar estados e testar aprovar/rejeitar com contas fictícias; registrar ator e mudança. |
| T01 | Plataforma | Banco e persistência | R | Esquema/migrações, escrita, releitura, isolamento e erro de banco testados localmente. |
| T02 | Plataforma | Permissões por papel e proprietário | R | Testar anônimo, papel incorreto e outro proprietário; recusa no servidor, não apenas esconder botão. |
| T03 | Plataforma | Erros e recuperação | R, L | 404 e estado vazio; futuramente falhas de autenticação, validação, banco, rede e tentativas repetidas. |
| T04 | Plataforma | Automação e uso móvel | R, L | Testes da regra/resultados e jornadas em computador e celular; registrar navegador, largura e limites. |

## Limites da inspeção

REA usou perfis temporários sem conta, movimento reduzido e service workers bloqueados. Capturas completas significam completude dos artefatos solicitados, não de toda a plataforma. Não houve acesso às áreas privadas, submissões, alteração de dados reais, engenharia reversa de código proprietário ou chamadas financeiras. Declarações comerciais não foram tratadas como desempenho comprovado. Os requisitos administrativos são propostos para a Diderot por solicitação do usuário, não extraídos de uma tela administrativa pública.
