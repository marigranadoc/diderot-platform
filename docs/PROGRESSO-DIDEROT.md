# Progresso e auditoria funcional da Diderot

**Expansão documental — 12/11/2026:** PRD atualizado para a versão 1.1 com UGC Marketplace + Creator Commerce. Acrescentados U01–U23, as 17 regras obrigatórias do usuário, jornadas UAT-A–H e plano E1–E7. O [material original](REFERENCIA-EXPANSAO-UGC.md) foi preservado integralmente e mapeado para as seções 16–25 do [PRD](PRD-DIDEROT.md). UGC, influencer e afiliado coexistem na mesma conta creator; campanhas híbridas possuem vagas independentes. Nenhuma funcionalidade, migração, operação financeira ou teste da aplicação foi executado nesta alteração. Verificação documental: requisitos presentes, links locais válidos e anexo idêntico ao arquivo fornecido. O estado funcional e os bloqueios da auditoria permanecem os registrados abaixo.

**Referência consolidada em 12/11/2026:** [PRD-DIDEROT.md](PRD-DIDEROT.md). O novo PRD distingue estado atual, histórico, funcionalidades observadas pelo REA, declarações públicas e propostas Diderot. Esta atualização foi documental: não alterou aplicação ou banco e não executou novamente as suítes. Foram conferidos os 27 IDs originais, os links locais e as contagens dos relatórios existentes. GAP-01 executa como visitante; não comprova falha com uma conta autenticada real.

Auditoria: **11/11/2026**, horário de referência America/Sao_Paulo. Pasta do projeto: `C:\Users\Andrea\Documents\Codex\2026-11-11\diderot\outputs\diderot`.

## Diagnóstico

A Diderot implementa uma **vitrine pública demonstrativa**. Não implementa a plataforma completa de shopper, creator, brand e administrador. O caminho `/criador` é o perfil público de uma criadora fictícia, não um painel de gestão.

Existem 13 endereços de conteúdo: início, perfil público, três coleções e oito produtos. Também existe uma página 404. O catálogo agora é lido de duas tabelas Supabase por `lib/catalog-store.ts`, com migração e dados demonstrativos persistidos. `lib/catalog.ts` permanece como fixture do modo offline explícito. Os filtros e favoritos ainda usam estado React em `components/Catalog.tsx`. Agora há cliente de login/logout em `/conta` e operações de favoritos com RLS por usuário. A validação com Auth real continua pendente, não há cadastro público nem papéis de creator/brand/admin. Não há integração financeira nem alteração de dados reais nesta auditoria.

O usuário confirmou que não havia PRD. Foi criado [PRD-DIDEROT-REFERENCIA.md](PRD-DIDEROT-REFERENCIA.md), separando requisitos observados via REA, declarações comerciais da ShopMy, exigências desta auditoria e escopo anterior do protótipo. Esse documento é uma referência derivada, não um PRD oficial da ShopMy nem prova de acesso a áreas privadas.

## Método e evidências

1. Inventário completo dos arquivos de aplicação, dependências e testes; revisão de todas as páginas, layout, catálogo e componentes.
2. Execução dos seis testes existentes antes de alterações: **6 aprovados**, em computador e celular, em 23,8 segundos. O resultado só comprova as verificações descritas nesses testes.
3. REA visitou a inicial, páginas de creator/brand e candidatura, abriu seleção de perfil e login, e visitou grupos/perfil de gosto no celular. Nenhum formulário foi enviado, conta criada, mensagem enviada ou compra efetuada.
4. Nova suíte reproduziu ações sem resultado, busca, persistência e entrada das jornadas ausentes antes de corrigir a aplicação.
5. Correções restritas aos comportamentos existentes, nova compilação e repetição da auditoria contra um servidor próprio de teste na porta 3101. A suíte recusa reutilizar um servidor antigo para evitar testar código desatualizado.

Evidência primária: [REA público](evidencias/rea-publico.json), [REA formulários](evidencias/rea-formularios.json), [REA shopper móvel](evidencias/rea-shopper-mobile.json), [testes antes](evidencias/auditoria-antes.json) e [testes depois](evidencias/auditoria-depois.json).

Testes: `tests/store.spec.ts` contém os três cenários anteriores, executados em dois tamanhos; `tests/audit.spec.ts` contém cinco cenários de validação e quatro cenários de lacunas, também executados nos dois tamanhos. Identificadores AUD e GAP abaixo correspondem aos nomes desses testes. Provar a ausência de uma entrada não equivale a executar etapas internas inexistentes.

## Matriz original da auditoria (antes da integração Supabase)

A matriz abaixo preserva o diagnóstico inicial. A atualização de integração ao final deste documento substitui especificamente as conclusões sobre a origem e persistência do catálogo; não conclui contas, favoritos ou gestão.

### Tabela funcional: requisito, código, teste e correção

**Status:** DEMO = executa de verdade sobre dados fictícios locais; PARCIAL = parte da jornada existe; AUSENTE = não implementado; CORRIGIDO = falha reproduzida e corrigida; NÃO VERIFICADO = evidência insuficiente. Um status DEMO não implica banco, autenticação ou persistência.

| Módulo | Rota | Funcionalidade | Status real | Evidência de teste | Problemas | Correção necessária |
|---|---|---|---|---|---|---|
| Shopper S01 | `/` | Inicial, links para perfil e coleções, seta de descoberta | DEMO funcional | Store: navegação e links; AUD-01; AUD-05 | Conteúdo fixo, uma criadora | Manter rótulos demo; catálogo dinâmico depende de T01 |
| Shopper S03 | `/criador` | Avatar, bio e acesso ao catálogo | DEMO funcional | Store: jornada; AUD-01 | Não edita perfil nem escolhe outro creator | C02 para gestão; S02 para múltiplos creators |
| Shopper S04 | `/colecoes/essenciais` | Coleção com quatro produtos | DEMO funcional | AUD-01 e AUD-03 | Coleção fixa em arquivo | T01/C02 para CRUD persistente |
| Shopper S04 | `/colecoes/rituais` | Coleção com dois produtos | DEMO funcional | Store: jornada; AUD-01/AUD-03 | Coleção fixa | T01/C02 |
| Shopper S04 | `/colecoes/casa` | Coleção com dois produtos | DEMO funcional | Store: rotas; AUD-01/AUD-03 | Coleção fixa | T01/C02 |
| Shopper S05 | `/criador` e `/colecoes/*` | Buscar nome e marca | CORRIGIDO, DEMO | AUD-04; Store: busca e vazio | Antes: acentos/espaços impediam resultados; não é busca no banco | Correção aplicada: normalização de termo e catálogo |
| Shopper S06 | `/criador` e `/colecoes/*` | Filtrar Todos/Moda/Beleza/Casa | DEMO funcional | Store; AUD-03 verifica contagens e isolamento | Filtro não aparece na URL nem persiste após sair | Decidir requisito de URL/restauração em etapa futura |
| Shopper S06 | `/criador` e `/colecoes/*` | Ordenar menor/maior preço/seleção | DEMO funcional | AUD-03 compara toda a ordem por preço; Store | Estado apenas na tela | Persistência da preferência não implementada nem prometida |
| Shopper S07 | `/criador` e `/colecoes/*` | Favoritar e desfavoritar | PARCIAL | Store; AUD-03; GAP-01 falha após reload | Só `useState`; perde ao recarregar e ao remontar catálogo; texto “nesta visita” não garante retenção entre páginas | T01/A01 e favoritos por usuário; não mascarar com um coração clicável |
| Shopper S08 | `/produto/bolsa-oliva` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | AUD-01/AUD-02; Store | Sem estoque real | CTA agora revela mensagem; venda permanece ausente |
| Shopper S08 | `/produto/camisa-linho` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | AUD-01/AUD-02 | Produto/preço fictícios | Manter identificação; T01 para catálogo editável |
| Shopper S08 | `/produto/serum-botanico` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | Store: jornada; AUD-01/AUD-02 | Não comercializa item | Sem integração financeira nesta auditoria |
| Shopper S08 | `/produto/vaso-organico` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | AUD-01/AUD-02 | Sem estoque ou varejista | S09 futuro |
| Shopper S08 | `/produto/sandalia-trama` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | AUD-01/AUD-02 | Item ilustrado fictício | S09 futuro |
| Shopper S08 | `/produto/creme-essencial` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | AUD-01/AUD-02 | Item ilustrado fictício | S09 futuro |
| Shopper S08 | `/produto/bolsa-areia` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | AUD-01/AUD-02 | Item ilustrado fictício | S09 futuro |
| Shopper S08 | `/produto/vaso-calcario` | Detalhe e disponibilidade | DEMO; CTA CORRIGIDO | AUD-01/AUD-02 | Item ilustrado fictício | S09 futuro |
| Shopper S09 | Nenhuma rota/destino comercial | Comprar no varejista | AUSENTE | Revisão de todos os hrefs e página de produto | “Ver disponibilidade” explica a demo; não é compra | Definir destinos de teste e contratos de afiliados; produção fora do escopo |
| Shopper S02 | Nenhuma rota de diretório | Descobrir múltiplos creators, marcas e grupos | AUSENTE | Inventário `app`; comparação REA E1 | Só uma loja e categorias locais | Criar diretórios após fundação T01 |
| Shopper S10 | Nenhuma | Criar/editar grupos | AUSENTE | Inventário; REA E3 fornece referência pública | Sem entidade, sessão, formulário ou API | T01/A01/T02 antes do CRUD |
| Shopper S11 | Nenhuma | Perfil de gosto/recomendações | AUSENTE | Inventário; REA E3 só estado inicial | Nenhuma preferência persistente ou regra definida | Especificar regra local e teste; não alegar algoritmo extraído |
| Contas A01 | Nenhuma | Login, logout e recuperação | AUSENTE | Inventário sem auth/sessão; REA E2 observa formulário externo | Sem identidade autenticada | Implementação futura conjunta com T01/T02; sem serviço pago |
| Contas A02 | Nenhuma | Papéis e isolamento entre contas | AUSENTE | Código sem verificação de papel; jornadas GAP bloqueadas na entrada | Não há usuários nem autorização | Validação obrigatória no servidor antes de habilitar escrita |
| Creator C01 | Nenhuma candidatura Diderot | Solicitar entrada como creator | AUSENTE | Inventário; REA E1 observa primeira etapa externa | Perfil público não é candidatura | Definir candidatura e transições com dados fictícios |
| Creator C02 | `/criador` é pública; gestão inexistente | Editar loja, produtos e coleções | AUSENTE | GAP-02 falha nos dois tamanhos; inventário | Não chega a autenticação, gravação ou publicação da loja | T01/A01/T02 e CRUD com propriedade |
| Creator C03 | Nenhuma | Afiliados e desempenho | AUSENTE | Sem endpoints/modelos; referência D/E1 | Sem comissão ou rastreio real | Especificar e testar simulação; não ativar finanças reais |
| Creator C04 | Nenhuma | Parcerias e oportunidades | AUSENTE | Sem telas/API; referência D/E1 | Fluxo privado ShopMy não foi executado | Definir contrato próprio e implementar depois de papéis |
| Brand B01 | Nenhuma | Entrada/cadastro da marca | AUSENTE | GAP-03 falha; REA E2 abriu seleção de perfil | Não há formulário ou conta brand | T01/A01/T02; candidatura local |
| Brand B02 | Nenhuma | Descobrir e selecionar creators | AUSENTE | Inventário; declarado na página pública E1 | Nenhuma área da marca | Diretório e acesso por papel após fundação |
| Brand B03 | Nenhuma | Campanhas/gifting/oportunidades | AUSENTE | GAP-03 interrompe na entrada; nenhuma entidade no código | Não há transições persistentes | Implementar contrato local com objetos fictícios; sem mensagens ou envio real |
| Brand B04 | Nenhuma | Relatórios de desempenho | AUSENTE | Sem fonte/cálculo/endpoints | Métricas não existem | Definir origem e cálculos; não inventar números |
| Administrador M01 | Nenhuma | Login e painel administrativo | AUSENTE | GAP-04 falha; inventário | Não existe rota nem middleware de administração | T01/A01/T02 antes de painel e operações |
| Administrador M02 | Nenhuma | Aprovar/moderar usuários/conteúdo | AUSENTE | Sem entidade, estados ou log de auditoria | UI ShopMy administrativa não observada | Definir contrato Diderot e testar autorização/rejeição/registro de ator |
| Plataforma T01 | Nenhuma API de negócio | Banco, escrita e releitura | AUSENTE | `lib/catalog.ts`, `Catalog.tsx`, dependências e inventário | Arquivos estáticos não são banco; memória de navegador não é persistência | Esquema, migrações, repositórios e testes locais de integração |
| Plataforma T02 | Todas públicas | Controle de permissão | AUSENTE para gestão; leitura pública intencional | Inventário; sem auth ou mutações | Página 404 não comprova autorização | Testar anônimo, outro papel e outro proprietário após implementar backend |
| Plataforma T03 | 404 de produto/coleção/URL inválidos | Erro de rota e retorno à loja | DEMO funcional | AUD-01 verifica HTTP 404 e clica retorno | Sem validação de escrita, erro de banco/rede ou error boundary próprio | Implementar esses estados junto com operações futuras |
| Plataforma T03 | Catálogo sem resultados | Estado vazio e limpar filtros | DEMO funcional | Store: busca/vazio | Apenas cenário local | Ampliar para erros reais quando houver integração |
| Plataforma T04 | Todas as 13 rotas | Celular e automação | PARCIAL para produto completo; vitrine testada | AUD-01 em 1440/390; AUD-05 em 320/768 nas quatro telas principais | Só Chromium desktop com viewport móvel; sem Safari/Android/iOS reais | Testar aparelhos/engines adicionais; jornadas ausentes seguem bloqueadas |

## Oito verificações por tela

Banco e persistência abaixo se referem a **operações de negócio**, não ao fato de o catálogo voltar a aparecer porque está escrito no código. “Pública” significa que leitura anônima é permitida por desenho; não significa existência de controle de autorização.

| Tela / rota | 1. Abre? | 2. Ação real? | 3. Banco? | 4. Persiste? | 5. Permissão? | 6. Erros? | 7. Automação? | 8. Celular? |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | Navega e rola | Não | Sem escrita | Pública; sem auth | Só 404 global | Store/AUD-01 | 390 e 320/768 |
| `/criador` | 200 | Busca, filtra, ordena, favorita | Não | Favoritos/filtros: não | Pública; sem auth | Vazio/limpar | Store/AUD-01/03/04/GAP-01 | 390 e 320/768 |
| `/colecoes/essenciais` | 200 | Isola quatro itens, controles reais | Não | Estado local: não | Pública | Vazio/404 slug | AUD-01/03 | 390 |
| `/colecoes/rituais` | 200 | Isola dois itens, controles reais | Não | Estado local: não | Pública | Vazio/404 slug | Store/AUD-01/03 | 390 e 320/768 |
| `/colecoes/casa` | 200 | Isola dois itens, controles reais | Não | Estado local: não | Pública | Vazio/404 slug | Store/AUD-01/03 | 390 |
| `/produto/bolsa-oliva` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | Store/AUD-01/02/05 | 390 e 320/768 |
| `/produto/camisa-linho` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | AUD-01/02 | 390 |
| `/produto/serum-botanico` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | Store/AUD-01/02 | 390 |
| `/produto/vaso-organico` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | AUD-01/02 | 390 |
| `/produto/sandalia-trama` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | AUD-01/02 | 390 |
| `/produto/creme-essencial` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | AUD-01/02 | 390 |
| `/produto/bolsa-areia` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | AUD-01/02 | 390 |
| `/produto/vaso-calcario` | 200 | Revela informação e navega | Não | Sem escrita | Pública | 404 slug inválido | AUD-01/02 | 390 |
| Página 404 | HTTP 404 | Retorno à loja funciona | Não | Sem escrita | Pública | Mensagem e recuperação | AUD-01 | 390 |
| Login/cadastro | Não existe | Não existe | Não | Não | Não | Não | Inspeção; entrada ausente | Não implementado |
| Painel creator | Não existe | Não existe | Não | Não | Não | Não | GAP-02 falha | Bloqueado em 390 |
| Painel brand | Não existe | Não existe | Não | Não | Não | Não | GAP-03 falha | Bloqueado em 390 |
| Painel administrador | Não existe | Não existe | Não | Não | Não | Não | GAP-04 falha | Bloqueado em 390 |

## Jornadas completas e ponto exato de interrupção

| Persona | Jornada tentada | Resultado real | Onde para | O que não foi possível testar |
|---|---|---|---|---|
| Shopper visitante | Início → perfil → coleção → produto → disponibilidade → voltar | Funciona como demo; não é jornada comercial completa | Não há varejista/venda | Compra, confirmação, atribuição de comissão |
| Shopper com conta | Favoritar → recarregar → reencontrar favorito | Falha GAP-01 | Favorito desaparece após reload | Retenção em conta, sincronização entre aparelhos, isolamento |
| Creator | Entrar na gestão → autenticar → criar produto/coleção → salvar → reler → ver loja pública | Bloqueada GAP-02 | Não existe entrada nem tela de gestão; perfil público só leitura | Todas as etapas privadas e persistência |
| Brand | Entrar → autenticar → descobrir creators → criar campanha → acompanhar resultado | Bloqueada GAP-03 | Não existe área da marca | Campanhas, convites, transições e métricas |
| Administrador | Entrar → verificar papel → revisar candidatura → aprovar/rejeitar → reler registro | Bloqueada GAP-04 | Não existe painel/login/papel | Aprovação, moderação e trilha de auditoria |

Essas interrupções são falhas de prontidão do produto. Não foram transformadas em testes “esperados para falhar” ou puladas. A auditoria completa termina com falha enquanto as lacunas permanecerem. A automação de entrada por texto é acompanhada do inventário de código; não se presume ausência de backend apenas porque um rótulo não foi encontrado.

## Pendências por criticidade

Não foi demonstrada uma ocorrência P0 envolvendo dados reais, dinheiro ou exploração. Isso não é uma certificação de segurança. P1 abaixo significa bloqueador para lançar uma plataforma com contas e gestão.

| Ordem | Prioridade | Pendência | Estado | Dependência / ação |
|---|---|---|---|---|
| 1 | P1 | T01/A01/T02: banco local, identidade e autorização | Aberta | Implementar como fundação conjunta; escrita só após verificar papel/proprietário; testar isolamento e releitura. Não substituir por mock ou localStorage e declarar backend pronto. |
| 2 | P1 | C02: creator gerir e persistir catálogo | Aberta | Depende da fundação; executar create/edit/delete/reload e verificar a loja pública. |
| 3 | P1 | M01/M02: administração e estados de aprovação | Aberta | Definir estados próprios; autorização no servidor e registro das mudanças. Referência privada não disponível. |
| 4 | P1 | B01/B03: marca e campanhas | Aberta | Depende de contas/entidades; nenhum disparo ou pagamento real. |
| 5 | P1 | S07: favoritos persistentes por conta | Aberta | GAP-01 reproduz perda; a demo anterior já declarava favoritos temporários. Tornar persistente é requisito da versão completa. |
| 6 | P1 do fluxo existente | S08: CTA de disponibilidade ocultava o resultado | **Corrigida** | Substituída rolagem para bloco fechado por abertura nativa do próprio bloco. AUD-02 testa os oito itens e AUD-05 testa teclado. |
| 7 | P2 | S05: busca com acentos/espaços | **Corrigida** | Normalização Unicode, caixa e espaços; AUD-04. Não foi afirmado que a ShopMy usa a mesma regra. |
| 8 | P2 | Diretórios, grupos, perfil de gosto, afiliados e relatórios | Aberta | Requisitos de produto ainda ausentes; definir contratos e implementar após fundação. |
| 9 | P2 | Estados de erro de backend e falhas de autorização | Aberta | Não existem operações correspondentes para testar hoje; criar testes negativos junto das operações. |
| 10 | P2 | Portabilidade da automação e cobertura de aparelhos | Parcialmente corrigida | Servidor isolado e Chrome configurável implementados; falta Safari/aparelhos reais e teste de integrações. |

Não foram criados módulos novos de contas/gestão nesta auditoria. Essas lacunas exigem implementação de produto e continuam abertas; não há fluxo preexistente desses módulos para reparar pontualmente. As correções aplicadas eliminam defeitos reproduzidos na vitrine existente, sem criar uma aparência de integração inexistente.

## Execuções e falhas

| Execução | Resultado | Interpretação |
|---|---|---|
| Testes antigos antes da mudança | 6 aprovados / 0 falhas; 23,8 s | Cobertura pequena, voltada à demo |
| Auditoria ampliada antes | 4 aprovados / 12 falhas; 108,3 s; 16 casos | 2 defeitos da vitrine e 4 lacunas de jornada, cada um em dois tamanhos |
| Build após correções | Aprovado, Next.js 16.4.6 | Compilação, TypeScript e geração das rotas concluídos |
| Typecheck separado | Aprovado | Não comprova regras de negócio |
| Auditoria final | 16 aprovados / 8 falhas, zero pulados; `evidencias/auditoria-final.json` | GAP-01/02/03/04 falharam em computador e celular. O encerramento do servidor temporário no Windows exigiu intervenção; não confundir com falha nas asserções. |

O teste novo de busca teve sua expectativa de dados corrigida: existem **dois**, e não três, produtos da marca fictícia Estúdio Um. A falha inicial da busca ocorreu já no primeiro caso `serum`, independentemente dessa expectativa. Os relatórios antes/depois preservam a diferença.

## Como repetir

1. Na pasta do projeto, executar `npm.cmd run build`.
2. Executar `npm.cmd test` ou `npm.cmd run test:audit` para a auditoria completa. O comando inicia e encerra seu próprio servidor na porta 3101 e retorna erro enquanto GAP-01/02/03/04 estiverem abertos.
3. `npm.cmd run test:vitrine` executa somente as verificações do escopo implementado, excluindo explicitamente nomes `@pendente`. Esse resultado **não** aprova a plataforma inteira; `npm test` não exclui essas lacunas.
4. Para relatório JSON, definir `PLAYWRIGHT_JSON_OUTPUT_FILE` e executar com `--reporter=list,json`.
5. A prévia do usuário continua separada na porta 3000. Para atualizar a prévia compilada, reiniciar `npm.cmd start` depois do build. Chrome pode ser definido pela variável `DIDEROT_CHROME_PATH`.

## Limites da conclusão

Testes móveis são em Chromium com viewports, não aparelhos físicos. A suíte não comprova banco, permissões, segurança de contas, entrega de mensagens, transações ou o comportamento de áreas privadas externas. Acessibilidade recebeu verificações pontuais de rótulos, teclado, âncoras e largura; não houve auditoria WCAG completa. Não foram executados testes de carga, compatibilidade multibrowser, recuperação de banco ou integrações ausentes. Não há justificativa para anunciar a plataforma como pronta para produção.

## Atualização: integração Supabase em 11/11/2026

| Módulo | Rota | Funcionalidade | Status real | Evidência de teste | Problemas | Correção necessária |
|---|---|---|---|---|---|---|
| Catálogo T01/S01/S04/S06 | `/`, `/criador`, `/colecoes/[slug]`, `/produto/[slug]` | Leitura persistente de coleções/produtos | INTEGRADO ao Supabase; 3 coleções/8 produtos fictícios | `scripts/check-database.mjs`; consultas SQL e API | Ainda sem CRUD de gestão | Implementar identidade, propriedade e gestão antes de conceder escrita |
| Permissões T02 | API de collections/products | Apenas leitura dos publicados | RLS ativa e escrita negada a anon/authenticated | API UPDATE retorna 42501; teste SQL com ROLLBACK oculta itens não publicados | Ainda não há autorização por creator | Implementar junto ao modelo de contas, sem liberar escrita global |
| Erros T03 | Quatro páginas conectadas | Falha de banco apresenta erro/repetição | Implementado em `app/error.tsx`; sem fallback silencioso | Build e revisão; falha de rede visual ainda não automatizada | Cobertura negativa de interface pendente | Testar indisponibilidade e recuperação |
| Automação T04 | Suíte | Encerramento no Windows | Corrigido com processos Node diretos | `auditoria-encerramento.json`: 16 aprovados/8 falhas; processo encerrou sozinho com código 1; porta liberada | Chromium apenas | Ampliar navegadores quando houver jornadas autenticadas |

A integração usa somente chave publicável local, com pacote @supabase/supabase-js fixado em 2.119.0 e lockfile. Os registros temporários dos testes RLS foram revertidos. Nenhum usuário Auth foi criado, nenhum dado real foi alterado e nenhuma integração financeira foi usada.

A prioridade seguinte permanece A01/T02: identidade e autorização por proprietário. A persistência do catálogo resolve parte de T01, mas GAP-01/02/03/04 continuam abertos. Não há justificativa para declarar as jornadas de shopper, creator, brand ou administrador completas.

Resultado conectado: **16 aprovados / 8 falhas**, 24 casos, zero pulados, aproximadamente 2,4 minutos, em `evidencias/auditoria-supabase.json`. Build e TypeScript aprovados. O processo encerrou sozinho com código 1, preservando as falhas reais. A mensagem antiga de GAP-01 no relatório diz que não há banco; essa descrição foi corrigida no teste após a execução: há banco para catálogo, mas não para favoritos. A asserção e a falha permanecem as mesmas.

## Acesso por conta e favoritos — implementação parcial

Foi adicionada `/conta` para entrar e sair com e-mail/senha via Supabase Auth. Não há cadastro público nem recuperação de senha; o projeto ainda possui zero usuários Auth. Nenhum e-mail foi enviado pela automação.

A migração `20261111213111_shopper_favorites.sql` criou favoritos com chave composta usuário/produto, referência a Auth, RLS por `auth.uid()` e permissão somente SELECT/INSERT/DELETE para authenticated. Anônimos não recebem acesso. UPDATE não é concedido, impedindo transferência de proprietário. A interface só muda o estado após o banco confirmar uma linha gravada/removida; falhas mantêm o estado anterior e mostram erro. Visitantes continuam usando favoritos temporários, com convite explícito para entrar.

A inspeção confirmou as políticas aplicadas e o advisor de segurança retornou zero alertas. O teste comportamental entre dois usuários, em `supabase/tests/favorites.sql`, **não foi executado**: a confirmação adicional do serviço expirou. A contagem posterior confirmou zero usuários e zero favoritos. Não afirmar isolamento testado somente pela existência da política.

Os cenários AUTH-01/02 usam respostas simuladas de Auth e favoritos no navegador. Verificam erro de login, login, salvar, recarregar, erro de escrita, remover, recarregar e sair; não comprovam uma sessão Auth real nem persistência remota por usuário. GAP-01 permanece aberto para a jornada sem conta e a validação ponta a ponta autenticada continua pendente.

Execução inicial com contas: 28 casos, 16 aprovados e 12 falhas (`evidencias/auditoria-contas.json`). Quatro falhas eram seletores ambíguos dos testes AUTH: o aviso do Next.js também tem role alert. O seletor foi limitado ao conteúdo principal, preservando a verificação da mensagem. As oito falhas GAP continuam registradas.

Reexecução após corrigir os seletores: **4/4 contratos de conta aprovados**, 19,1 s, em `evidencias/contratos-contas.json`. A suíte anterior preserva 16 cenários públicos aprovados e oito lacunas GAP. Não foi feita nova execução integral após a correção exclusivamente dos seletores. Build e TypeScript passaram. O teste de isolamento com usuários continua NÃO EXECUTADO.

| Módulo | Rota | Funcionalidade | Status real | Evidência | Problemas | Correção necessária |
|---|---|---|---|---|---|---|
| Conta A01 | `/conta` | Login/logout com e-mail/senha | Implementado; contrato simulado aprovado | AUTH-01/02 em computador/celular; build/typecheck | Zero usuários; cadastro e recuperação ausentes; login remoto não validado | Preparar contas/ambiente de teste e validar Auth real |
| Favoritos S07 | `/criador`, coleções | Salvar/reler/remover por usuário | Implementado no cliente e banco; validação completa pendente | AUTH-02 simulado; inspeção de políticas e grants remotos | Teste SQL entre usuários aguardando execução; visitantes temporários | Executar `supabase/tests/favorites.sql` em ambiente autorizado e jornada real com duas sessões |
