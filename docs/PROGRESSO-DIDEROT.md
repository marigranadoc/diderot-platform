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

## Incremento de contas e modalidades — 12/11/2026

Foram implementadas as rotas `/cadastro`, `/recuperar-acesso` e `/conta/criador`, conectadas ao cliente Supabase, e aplicada a migração `20261112101450_creator_onboarding.sql`. O perfil inicial aceita UGC/influencer/afiliado na mesma conta sem solicitar seguidores. Nome, bio e localização são privados do proprietário. Estado: IMPLEMENTADO COM VALIDAÇÃO PARCIAL; Auth real, entrega/retorno de e-mail e isolamento entre dois usuários continuam pendentes. Consulte [ONBOARDING.md](ONBOARDING.md) para evidências, limites e configuração de URLs.

A checagem remota confirmou cadastro por e-mail habilitado com confirmação obrigatória; zero usuários e zero perfis. A autorização adicional do serviço expirou novamente ao solicitar o teste SQL de favoritos. Não foi feita nova tentativa equivalente para contornar a confirmação. O novo teste SQL de perfil também permanece não executado. Nenhum dado real, mensagem ou serviço financeiro foi utilizado.

O build Turbopack falhou internamente duas vezes no subprocesso CSS; Webpack compilou. O comando padrão de build foi ajustado para a opção suportada `--webpack`.

Validação deste incremento: auditoria integral de 40 casos registrou **32 aprovados e 8 falhas GAP** em `evidencias/auditoria-onboarding.json`. Em seguida, o novo teste de troca de conta entre abas encontrou uma corrida (13 aprovados/1 falha em `evidencias/onboarding-final.json`); a tela passou a revalidar a sessão também após o evento de saída. O build final com Webpack e TypeScript passou. A revisão automática bloqueou uma tentativa intermediária por limite de uso, sem avaliação de segurança; após a retomada pelo usuário, a compilação foi autorizada e executada. A confirmação adicional para os testes SQL continua pendente.

Revalidação final: **14/14 testes de onboarding aprovados**, 27,5 s, em `evidencias/onboarding-revalidado.json`, incluindo troca de conta entre abas. São contratos simulados; não comprovam Auth/e-mail reais nem isolamento remoto. Não houve nova execução integral após essa correção específica.

## Serviços do creator — 12/11/2026

Implementado CRUD privado em `/conta/criador/servicos`, com título, descrição, dez tipos, preço inicial em centavos ou sob orçamento. Migração aplicada: `20261112161824_creator_services.sql`. RLS e grants limitam operações ao proprietário; nenhuma permissão de alteração de user_id. Visitantes precisam entrar; conta sem perfil precisa configurá-lo. Operações só mostram sucesso após retorno confirmado; exclusão tem confirmação/cancelamento. [Detalhes e limites](SERVICOS-CREATOR.md).

Estado de U04: PARCIAL — gestão privada implementada; exibição pública, uso em pedidos e validação com duas contas reais ainda pendentes. O advisor registrou um alerta de proteção contra senhas vazadas desabilitada no Auth, com referência de correção no documento do módulo. Nenhuma mudança financeira, mensagem ou dado real foi utilizada.

A execução inicial de regressão teve 22 casos: 20 aprovados e 2 falhas no seletor de preço dos novos testes, preservadas em `evidencias/servicos-creator.json`. O campo foi localizado pelo papel acessível combobox na reexecução. A API remota bloqueou leitura anônima (42501). Build e TypeScript aprovados; isolamento entre usuários autenticados continua pendente de teste real.

Reexecução direcionada: **4/4 testes de serviços aprovados**, 18,7 s, em `evidencias/servicos-revalidado.json`. São contratos com mocks; nenhuma contratação ou transação foi criada.

## Portfólio privado — 12/11/2026

Implementada `/conta/criador/portfolio` com CRUD de trabalhos por link HTTPS, tipo, título, descrição, categoria e participação; exclusão confirmada e falha sem falso sucesso. Migração `20261112162722_creator_portfolio.sql` aplicada com RLS por proprietário e UPDATE de user_id negado. A API real negou leitura anônima (42501); zero itens na inspeção. U03 permanece PARCIAL: upload, miniaturas, publicação e validação remota entre usuários ainda pendentes. [Detalhes](PORTFOLIO-CREATOR.md). Nenhum dado real, mensagem ou operação financeira foi usado. O alerta Auth de proteção contra senhas vazadas permanece registrado.

Validação: build e TypeScript aprovados; **24/24 testes direcionados aprovados**, computador/celular, em `docs/evidencias/portfolio-creator.json`. Cobertura: onboarding, serviços e portfólio; Auth/itens de interface simulados. A API anônima remota foi testada separadamente e negou acesso. As oito lacunas da auditoria integral permanecem abertas; isolamento entre usuários autenticados reais e envio de e-mail ainda não foram validados.

## Painel e validação real — 12/11/2026

Implementado `/painel/criador`, com resumo privado, contagens exatas de serviços/portfólio e acesso aos três módulos. Falha de consulta não vira número zero. Entrada no rodapé e na conta. [Evidências detalhadas](PAINEL-CREATOR.md).

Os testes antes pendentes `supabase/tests/favorites.sql` e `supabase/tests/creator-profiles.sql` foram executados e passaram; adicionado/executado `supabase/tests/creator-content.sql`, também aprovado. Usam duas identidades temporárias, papel/claims controlados no banco e ROLLBACK. A API real da conta demonstrativa passou por criação, releitura, edição e limpeza de fixtures em duas sessões. Chrome móvel simulado passou por login real, painel, acessos de gestão e logout. Nenhuma senha ou token foi salvo no repositório. Não houve envio de mensagem nem operação financeira.

GAP-02 passa a encontrar a entrada da área de creator; isso não conclui gestão de produtos/coleções C02. As lacunas de visitante, marca e administração continuam explícitas. Confirmação/recuperação por e-mail real e duas identidades Auth end-to-end ainda não foram validadas.

A auditoria integral registrou **48 aprovados/8 falhas** em 56 casos (`evidencias/auditoria-painel.json`): seis falhas GAP (visitante, brand e administrador em dois tamanhos) e duas falhas do mock de contagem. Corrigida a exposição do cabeçalho Content-Range no mock. O navegador com backend real já havia passado. GAP-02 passou a verificar a entrada existente, sem comprovar gestão de catálogo. A inspeção após os testes confirmou zero fixtures identificadas de serviços/portfólio remanescentes; dados preexistentes não foram limpos.

Reexecução direcionada do painel: **4/4 aprovados**, 26,3 s, em `evidencias/painel-revalidado.json`. Build e TypeScript aprovados. Não foi repetida a suíte integral após a alteração exclusiva do mock; não anunciar uma execução única 50/56. As verificações API, navegador real e SQL estão em evidências separadas.

## Design system, imagens e home — 12/11/2026

Aplicada referência enviada pela usuária: tokens originais preservados, neutros, tipografia, botões/campos e espaçamentos. Oito fotos reais locais e otimizadas substituem os vetores. Home segue hero → faixa móvel → Curadoria → Círculos → CTA → Categorias → Marcas, com menus por público, busca e rodapé de cinco colunas. Categorias/marcas/busca passam filtros reais à vitrine. Build final aprovado; composição inspecionada em 1440px e 390px, sem rolagem horizontal nos testes já executados. [Detalhes](DESIGN-SYSTEM-DIDEROT.md).

A Reckless recebida substitui Tobias/ShopMy Plain somente na prévia local: o ZIP é TRIAL, Personal Use Only. Binários excluídos do repositório; DM Sans permanece nos textos/controles com licença OFL incluída. As imagens são ilustrativas e não correspondência comprovada aos produtos fictícios. Não houve migração ou alteração de dados reais.

| Área | Evidência implementada | Estado e limite |
|---|---|---|
| Home `/` | Seções, grids, cabeçalho, busca, menu com teclado | Disponível; adaptada ao catálogo demonstrativo |
| Curadoria | Uma criadora e oito produtos existentes | Sem perfis ou endossos de terceiros inventados |
| Círculos | Oito seleções levam a coleções reais | Demonstração; criação de grupos pessoais pendente |
| Categorias/Marcas | Filtros via URL aplicados no catálogo | Oito categorias de navegação; quatro marcas em oito cartões |
| Fotos | WebP locais, alt, carregamento e fontes documentadas | Ilustrativas; sem garantia de SKU/cor |
| Fontes | Reckless local; DM Sans redistribuível | Fonte comercial Reckless definitiva pendente |
| Conta e creator | Fluxos existentes preservados | Contratos simulados reexecutados; sem novas afirmações sobre e-mails |
| Brand/Admin | Nenhum painel criado nesta etapa visual | Pendências da auditoria mantidas |

A primeira execução desta home foi interrompida: continha um seletor de categoria incorreto no teste e coincidiu com recompilação. Não conta como auditoria concluída. A execução integral anterior do design system (antes da home) teve 56 aprovados/6 falhas em `evidencias/auditoria-design-system.json`; as falhas eram favorito de visitante, marca e administrador, nos dois tamanhos. A auditoria final da home é registrada separadamente em `evidencias/auditoria-home-final.json`.

Resultado da auditoria integral da home: **62 aprovados, 6 falhas conhecidas, 68 casos, 277,2 segundos**, computador e celular, sem casos ignorados. Os seis testes novos HOME e seis DS passaram. Falhas: GAP-01 favoritos sem autenticação após reload, GAP-03 entrada de gestão de marca e GAP-04 entrada administrativa, cada um nos dois tamanhos. Evidência integral em `evidencias/auditoria-home-final.json`. Não se trata de 100% de funcionalidades concluídas.

Após essa execução, removida uma regra antiga que sobrepunha o posicionamento inicial do cabeçalho. Recompilação e revalidação visual direcionada são registradas separadamente, sem somar resultados de execuções diferentes como uma auditoria única.

Revalidação após o ajuste do cabeçalho: **12/12 aprovados**, 46 segundos, computador/celular, em `evidencias/home-revalidada.json`. Inclui posicionamento fixo, Reckless, carregamento das fotos, ordem das seções, busca, filtros, menu e responsividade. Build aprovado. A auditoria integral não foi repetida após esse ajuste exclusivo de CSS; seus seis bloqueios permanecem abertos. Prévia local atualizada em http://127.0.0.1:3002.

## Favoritos persistentes de visitante — 12/11/2026

Próxima correção funcional após a home: GAP-01. A lista do visitante agora é gravada de forma versionada no navegador, relida entre rotas/reloads/abas e separada dos favoritos de conta. A interface informa o alcance local. Falhas de leitura/escrita e conteúdo inválido são tratados sem falso sucesso; uma gravação explícita recupera a lista inválida. A troca de identidade invalida respostas antigas antes de carregar a conta correspondente. Não há importação automática, mudança de schema/RLS ou alteração de dados reais.

Arquivos: `lib/guest-favorites.ts`, `components/useFavorites.ts`, `components/Catalog.tsx`; testes novos em `tests/favorites.spec.ts`, ampliação de AUTH-02 e atualização da regressão da vitrine. GAP-01 deixou a etiqueta @pendente, preservando sua verificação efetiva. README atualizado para retirar descrições históricas de SVG, ausência de cadastro e favoritos apenas durante a visita. [Auditoria funcional e limites](FAVORITOS.md).

Build e TypeScript aprovados. A auditoria integral está registrada em `evidencias/auditoria-favoritos-navegador.json`; resultado final abaixo. Testes novos usam armazenamento real do Chrome em computador/celular. Login e falhas de API nesta etapa são contratos simulados; não declarar nova validação remota de banco. As evidências remotas anteriores continuam válidas no escopo documentado.

O próximo bloco do plano é a fundação de marca/organizações com vínculos e autorização no backend, antes das campanhas. A ausência de marca/admin permanece identificada; não há conclusão por simples criação de entrada de navegação.

A auditoria integral desta etapa terminou com **75 aprovados/5 falhas em 80 casos**, 430,6 s. Todos os doze casos FAV e os dois AUTH-02 passaram. Quatro falhas são os painéis brand/admin ausentes. A quinta foi ONB-07 móvel: perfil permanecia desconectado após troca de conta em outra aba. Diagnóstico repetido reproduziu uma falha em seis casos. Corrigida a recriação da escuta de sessão no perfil: agora permanece ativa, separada da recarga de dados. Teste exige confirmação de entrada antes de validar o perfil da outra aba. Build/TypeScript novamente aprovados. Os resultados posteriores não devem ser somados como uma única auditoria integral.

A primeira alteração da escuta não eliminou ONB-07: houve 8/10 aprovações na repetição, com falhas preservadas em `troca-conta-revalidada.json`. Adicionada releitura verificada quando outra aba muda a sessão no armazenamento. O identificador local é somente sinal de mudança; `getUser` continua confirmando a identidade. ONB-08 cobre a ausência de BroadcastChannel. Instrumentação temporária foi removida e não faz parte da aplicação.

A repetição adicional teve 11/12, portanto a primeira solução de storage também não foi considerada concluída. O rastreamento interno (`troca-conta-estado.json`) identificou a ordem que causava o erro: aviso SIGNED_IN chegou antes de getUser conseguir ler a sessão; o evento storage posterior era ignorado porque o ID do aviso já tinha sido registrado. Separadas identidade informada e identidade verificada. ONB-09 reproduz explicitamente essa ordem; apenas getUser confirma a identidade. Instrumentação temporária retirada.

Revalidação da versão com a causa corrigida: **34/34 aprovados**, 162,1 segundos, computador e celular, em `evidencias/favoritos-sessao-final.json`. Inclui favoritos, entrada/saída, cadastro/recuperação, gravação/releitura de perfil e troca entre abas nos três cenários (normal, sem BroadcastChannel, notificação antes do armazenamento). Build e TypeScript aprovados. A auditoria integral não foi repetida após a correção final: preservar seu resultado 75/80, sem somar execuções para anunciar um resultado integral inexistente. Brand/admin continuam ausentes.

Repetição final dos cenários normal e de evento antecipado: **12/12 aprovados**, 56,5 segundos, computador/celular, em `evidencias/troca-conta-corrigida.json`. São três repetições de cada cenário por tamanho, sem retries automáticos. Nenhuma nova alteração funcional foi feita após a validação. A interrupção anterior da atualização da prévia ocorreu porque a revisão automática atingiu o limite de uso, sem conclusão de revisão; não foi uma determinação de ação insegura. Não houve tentativa de contornar essa revisão.

## Organizações e base da marca — 12/11/2026

Implementado `/painel/marca`: cadastro privado, releitura e edição de organização, vínculo responsável automático e entradas na home/conta. Migração `20261112213155_brand_organizations.sql` aplicada. RLS e grants limitam criação/edição ao proprietário e leitura a vínculos autorizados; membros de leitura não editam nem promovem papel. Cada conta cria uma organização nesta etapa. Sem aprovação comercial, convites, campanhas ou administração. [Escopo e evidências](ORGANIZACOES.md).

Testes SQL remotos passaram com três identidades e ROLLBACK; corrigida uma asserção do teste sem abrir o schema privado. API real passou com duas contas temporárias/três sessões, incluindo releitura, edição, bloqueio cruzado e escalada negada. Chrome móvel simulado passou por login, edição real, reload e logout. Interface: 10/10 contratos aprovados nos dois tamanhos. Build e TypeScript aprovados.

As sessões temporárias foram encerradas. A confirmação do Supabase para exclusão das duas contas/organizações de teste expirou; nova autorização foi solicitada. Não registrar fixtures como removidas até conferir a limpeza. Nenhum registro preexistente, mensagem ou operação financeira foi alterado. O alerta anterior de proteção contra senhas vazadas permanece em ORGANIZACOES.md.

GAP-03 agora encontra o painel real; isso não conclui a jornada completa da marca. A auditoria integral está em `evidencias/auditoria-marcas.json`; resultado final abaixo. Administrador continua ausente. Próximo bloco: convites e gestão autorizada de membros, antes de campanhas.

Auditoria integral do incremento: **91 aprovados/3 falhas em 94 casos**, em `evidencias/auditoria-marcas.json`. Duas falhas são administrador ausente. A terceira foi BR-05 móvel, saída em outra aba durante consulta pendente: o conteúdo privado já estava oculto, mas o painel permanecia carregando. Corrigida a limpeza imediata ao sair, invalidando retornos antigos sem aguardar a consulta. A carga também confirma que o usuário verificado ainda corresponde à sessão local antes de consultar dados. Revalidação registrada separadamente; não modificar retroativamente o resultado integral.


Revalidação final: **20/20 aprovados**, 113,6 segundos, dois ciclos dos cinco cenários em computador/celular, em `evidencias/marcas-revalidado.json`. Build/TypeScript aprovados. Navegador com banco real reexecutado e aprovado após a correção (`organizations-browser-revalidated.json`). A auditoria integral não foi repetida após a correção final; seu resultado histórico permanece 91/94.

Limpeza concluída após autorização explícita da usuária. Removidas somente as duas identidades temporárias por pares exatos de ID/e-mail; cascata limitada às organizações e vínculos dessas fixtures. Verificação confirmou zero usuários, sessões, organizações e vínculos dessas identidades. Nenhuma conta ou registro preexistente foi alterado. Evidência final: `evidencias/organizations-cleanup.json`; as confirmações expiradas permanecem como histórico.

## Equipe e convites internos — 12/11/2026

Implementada a seção Equipe e convites no painel da marca. Proprietário registra/cancela convite; destinatário com e-mail confirmado aceita/recusa; aceite cria membro de leitura; proprietário revoga com confirmação. Sem envio de e-mail, promoção de papel, transferência ou acesso administrativo. Migração aplicada: `20261112220605_organization_invitations.sql`. Tabela com acesso direto bloqueado; RPC delimitado usa identidade/e-mail confirmados no banco e verifica proprietário/destinatário. [Regras, tabela funcional e limites](EQUIPE-CONVITES.md).

SQL remoto passou com quatro identidades e ROLLBACK, incluindo expiração, idempotência, isolamento, revogação e rejeição de promoção. API real bloqueou anônimo e passou na leitura autenticada da caixa da conta demonstrativa existente. Nenhum convite real, mensagem externa ou conta permanente foi criado. Não declarar dois logins reais trocando convites: mutações foram verificadas no banco com claims controladas e interface com mocks.

Build e TypeScript aprovados. Primeiro teste dirigido: 16/18, com dois seletores confundindo o título do convite com organização acessível; corrigido para a lista de organizações vinculadas. A auditoria integral após essa alteração está em `evidencias/auditoria-equipe.json`; resultado final abaixo. Alerta anterior de proteção contra senhas vazadas e INFO intencional de tabela sem políticas diretas estão detalhados no documento do módulo. Próximo bloco do plano: campanhas, começando por rascunhos e autorização por organização.

Auditoria integral: **101 aprovados/3 falhas em 104 casos**, 664,5 segundos. Duas falhas são GAP-04/admin ausente; a terceira foi TEAM-04 móvel, pois o mesmo recibo de revogação aparecia no componente de equipe e no painel antes da recarga. Corrigido para que aceite/revogação tenham uma única confirmação no painel; novas ações também limpam o recibo anterior. Não foi reduzida a asserção para ignorar mensagens duplicadas. Resultado integral preservado em `evidencias/auditoria-equipe.json`.

Após essa execução, a composição com convites antes do formulário e a confirmação única são verificadas em uma execução dirigida separada. Não somar execuções para afirmar que a auditoria integral passou por completo. O SQL de organizações anterior também foi reexecutado no banco e passou, em `evidencias/equipe-regressao-organizacoes.json`, preservando restrições de proprietário e grants.

Revisão adicional de escopo: o novo teste negativo demonstrou que a tentativa de revogar um UUID que não era membro podia alterar uma pendência associada ao e-mail daquela conta. Migração corretiva `20261112223445_organization_team_remove_scope.sql` aplicada: sem membro efetivamente removido da própria organização, a operação termina sem consultar e-mails ou alterar convites. A falha reproduzida está em `evidencias/equipe-escopo-revogacao-antes.json`; suíte SQL ampliada passou em `evidencias/equipe-banco-final.json`. Nenhum dado real foi usado nesses testes, todos com ROLLBACK.

Versão final da interface: **20/20 aprovados**, 174,2 segundos, computador/celular, em `evidencias/equipe-final.json`; build e TypeScript aprovados. Inclui marca, aceite, recusa, cancelamento, confirmação de revogação e descarte de respostas após sair. Não foi repetida a auditoria integral após os ajustes finais; o resultado integral permanece 101/104. Administração continua ausente; as limitações de entrega e testes reais por HTTP estão explícitas em EQUIPE-CONVITES.md.

## Campanhas privadas em rascunho — 12/11/2026

Implementada a seção **Campanhas em rascunho** em `/painel/marca`, com contexto UGC/influencer/híbrido, datas opcionais, um grupo de vagas por modalidade e orçamento estimado por creator em centavos BRL. Responsável cria/edita/reconsulta; membro somente consulta. Nenhum campo de seguidores é exigido para UGC. Migração aplicada: `20261112225023_campaign_drafts.sql`. [Tabela funcional, regras, evidências e pendências](CAMPANHAS-RASCUNHOS.md).

O banco salva contexto e grupos em transação única, rejeita campos de publicação, escrita direta e acesso cruzado. Versão esperada impede sobrescrita entre sessões; requisição/UUID estáveis evitam duplicação após resposta perdida. Interface preserva campos em erro e somente confirma após releitura do banco. Cancelar alterações pede descarte; alterações pendentes impedem troca de seção. Respostas privadas pendentes não reaparecem após sair da conta.

SQL remoto com três identidades e ROLLBACK passou: criação/edição/releitura, integridade atômica, isolamento, leitura de membro, gravação negada, idempotência, versão e dados inválidos. API real verificou login da conta demonstrativa existente, leitura com relacionamento e bloqueio anônimo de tabela/RPC. Sem contas permanentes, campanhas reais, mensagens externas ou uso financeiro. Não afirmar mutações por duas sessões Auth reais: SQL usa claims controladas e navegador usa contratos simulados.

Build e TypeScript aprovados. A primeira compilação foi bloqueada pelo Windows ao criar pasta temporária; repetição autorizada passou. Primeira rodada dirigida: **12 aprovados/10 falhas em 22 casos**, devido a seletores do teste (tipo de campanha e alerta interno do Next), sem reduzir as verificações de resultado. Correções restritas aos seletores. Revalidação dirigida ampliada: **36/36 aprovados**, 146,7 segundos, computador/celular, cobrindo campanhas, marca e equipe. Evidências separadas: `evidencias/campanhas-interface-inicial.json` e `evidencias/campanhas-interface-final.json`. Prévia local reiniciada em http://127.0.0.1:3002.

U07/U08 permanecem PARCIAIS: briefing em sete etapas, requisitos/entregáveis/direitos/condições de cada vaga, produtos/referências, publicação e transições ainda pendentes. Também não há candidaturas, contratação, entregas, administração ou financeiro. Próximo bloco: completar briefing e condições por vaga antes de publicar oportunidades. Advisors mantêm o alerta anterior de senhas vazadas; nenhum novo WARN para as tabelas de campanha. Auditoria integral registrada separadamente em `evidencias/auditoria-campanhas.json`; resultado final abaixo quando concluída.

Suplemento SQL de revogação aprovado: o próprio RPC de equipe remove o membro da fixture e o ex-membro deixa de ler rascunhos/vagas. Evidência `evidencias/campanhas-banco-final.json`, tudo com ROLLBACK. As duas confirmações expiradas do suplemento anterior com remoção SQL direta não executaram alteração alguma. A verificação final usa a transição real da aplicação, sem manipular membros preexistentes.

Auditoria integral concluída: **118 aprovados/2 falhas em 120 casos**, 562,5 segundos, computador/celular, sem casos ignorados ou retries. Ambas as falhas são GAP-04, entrada administrativa ausente. Todas as verificações CAMP, marca, equipe, contas e demais funcionalidades implementadas passaram nessa execução. Evidência `evidencias/auditoria-campanhas.json`. Os relatórios publicados desta etapa são compactados mantendo casos, status, duração e mensagens de falha; originais completos preservados em `work/raw-campaign-reports` local. Não declarar a plataforma concluída: administração e jornadas futuras continuam pendentes.

Direcionamento seguinte da usuária: priorizar cadastro com escolha shopper/creator/marca, onboarding e perfil correspondentes, navegação entre áreas e contas/dados fictícios para avaliação. Este pedido autoriza fixtures demonstrativas persistentes identificadas; não autoriza modificar contas reais nem ativar financeiro de produção. O próximo incremento deve tornar esse caminho acessível antes de ampliar publicação/contratação.

## Cadastro por tipo, onboarding e demonstração — 13/11/2026

Implementados cadastro com escolha shopper/creator/marca, onboarding de três etapas, perfil específico em `/conta/perfil`, painel shopper com interesses/favoritos e links entre conta, áreas privadas e demonstração. Perfil de creator e organização são salvos junto com a conclusão do onboarding em transação, usando grants/RLS existentes; preferência não concede privilégio. Migração `20261112235032_account_profiles.sql` aplicada. [Tabela funcional, regras e limites](ACESSO-DEMONSTRACAO.md).

Criadas três identidades fictícias persistentes explicitamente autorizadas, sem alterar usuários preexistentes ou enviar e-mails. Seed real preenchido: Ana/shopper e dois favoritos; Clara/creator, dois serviços e um trabalho por link; Marina/marca, organização Ateliê Aurora e três campanhas em rascunho. Primeira tentativa de serviço rejeitou formato `fixed`; corrigido para o modo existente `starting`; repetição idempotente completou os dados. Não houve publicação, contrato ou financeiro.

`/demo` oferece login real nessas fixtures por botões. Sessão anterior encerrada somente no navegador; credenciais ficam no servidor e resposta não é armazenada em cache. Usuária autorizou explicitamente transferir as senhas fictícias às variáveis sigilosas de produção/prévia na Vercel após bloqueio da revisão automática. Nada foi enviado na tentativa bloqueada; envio final passou após corrigir argumentos do utilitário Windows e trocar array por objetos individuais. Dados da demonstração são compartilhados; não há reset automático nem uso de usuários reais.

Os três briefings em `/explorar/campanhas` e `/campanhas/demo/[slug]` são exemplos públicos estáticos, independentes dos rascunhos privados editáveis. Todos são marcados fictícios e não possuem candidatura/pagamento simulados como concluídos. Publicação, candidaturas, contratação, produção e administração continuam pendentes.

Verificação API real com três identidades passou: leitura própria, negação de leitura/edição cruzadas, coluna de proprietário e preferência admin rejeitadas, erro de onboarding sem alterações parciais em creator/marca e bloqueio anônimo. Evidência `evidencias/experiencias-api.json`; somente logins/consultas e tentativas rejeitadas nessa verificação, com saída local ao fim. Gravações/releituras positivas verificadas no seed real. SQL suplementar preparado; resultado registrado separadamente quando confirmado.

Primeira interface: **34 aprovados/4 falhas em 38 casos**, 139,2 segundos. As quatro falhas revelaram bloqueio da origem local por comparação com hostname interno do Next. Corrigida a comparação para Host real, mantendo negação de origem externa. Relatório preservado em `evidencias/experiencias-inicial.json`. Uma compilação anterior falhou ao buscar catálogo no pré-render do shopper; corrigida para consulta ao abrir o painel. Build/TypeScript passaram após corrigir também o tipo de uma asserção do teste.

## GitHub e publicação na Vercel — 13/11/2026

Confirmado projeto existente `prj_G8nztyaaScl1oZTviX4tTVdUIt3U`, equipe `team_rsLMN5CeW0KbNJHTexG6n7v1` / `mari-granado`, repositório `marigranadoc/diderot-platform`, branch `main`. A integração remota retornou lista vazia/403/404, inclusive após consentimento da equipe; CLI com credenciais próprias acessou o projeto. Não foi criado projeto duplicado. O vínculo GitHub já estava correto, mas framework estava em Other. Corrigidos Next.js, `npm run build`, `npm ci` e saída automática, também registrados em `vercel.json`.

Republicação do commit de campanhas `0ac0cb891b21a54f06591fa5944e019c6c07d377` ficou Ready (`dpl_5Jjk2JMuVUiyEN6u63BTN2ptRjWo`), com home, cadastro, conta e painel da marca HTTP 200 sem autenticação Vercel. Domínio canônico para Auth: https://diderot-platform-mari-granado.vercel.app. A usuária informou Site URL e Redirect URLs desse domínio e caminhos. Não foi alterado o painel do Supabase: controle do navegador foi encerrado ao não conseguir identificar a URL da janela com segurança. Não afirmar teste de entrega/retorno de e-mail real. Para avaliação imediata, contas demo já confirmadas usam login por senha no servidor.

Prévia local atualizada/iniciada na porta 3002; um reinício encontrou a porta já sem processo, então nenhum processo foi encerrado naquela tentativa. Publicação do incremento de acesso, auditoria integral e revalidação visual final são registradas abaixo quando concluídas.

SQL final de perfis aprovado com duas identidades efêmeras e ROLLBACK: três tipos de setup, contexto/perfil atômicos, organização sem duplicação, ausência de privilégios administrativos/transferência de proprietário, RLS cruzado e bloqueio anônimo. A checagem de grant da coluna proprietária complementa a tentativa real negada por HTTP; edição cruzada SQL delimitada ao UUID da fixture. Evidência `evidencias/experiencias-banco.json`. A confirmação inicial expirada não conta como execução. URL/chave pública do Supabase adicionadas somente ao escopo de prévia, sem alterar as variáveis já corretas em produção, após tentativa de sobreposição rejeitada pelo provedor.

Auditoria integral do incremento: **132 aprovados/4 falhas em 136 casos**, 450,0 segundos, computador/celular, sem retries ou casos ignorados. Duas falhas são GAP-04/admin ausente. Duas são DS-01: o teste escolheu o primeiro input, agora um radio de tipo de conta, em vez do campo de e-mail. Corrigido o seletor para `input[type=email]`, mantendo a checagem do raio de borda do campo. Revalidação de design e experiências: **22/22 aprovados**, 88,5 segundos. Resultados separados em `evidencias/auditoria-experiencias.json` e `evidencias/experiencias-final.json`; não somar execuções para declarar uma auditoria integral inexistente. As jornadas EXP-06 usam três identidades Auth reais em ambos os tamanhos, com releitura de favoritos, serviços/portfólio, organização e três rascunhos; não enviam e-mails nem editam dados de negócio.

Após essa rodada, saída de `/conta` padronizada para `scope:local`, preservando outras sessões das contas compartilhadas. Nova compilação e revalidação de Auth/experiências são registradas separadamente. O servidor da demonstração já tinha saída local na troca de identidade; o ajuste cobre também o botão Sair.

Versão final de Auth/experiências: **20/20 aprovados**, 109,6 segundos, computador/celular, em `evidencias/experiencias-sessao-final.json`; build e TypeScript aprovados. AUTH-02 exige pedido de logout local. Verificação API real ampliada confirmou que uma segunda sessão da conta demonstrativa permanece válida após a primeira sair; RLS e atomicidade também passaram novamente. Varredura de 46 assets públicos compilados não encontrou nenhuma das três senhas demonstrativas (`evidencias/experiencias-client-assets.json`). Nenhuma nova alteração funcional foi feita após essa rodada. Administração continua pendente; entrega/retorno de e-mail real não foi testada.

Publicação do incremento aprovada: commit `50133bc423efccf70a9829a1f557b1f860a8d56c` disparou automaticamente `dpl_8tJUHCMR3PMyditximVZZew86Th1`, produção, Ready. A primeira navegação no domínio canônico revelou que ele era somente alias automático protegido: o HTTP 200 final era da tela de login Vercel após redirecionamento. Registrado em `evidencias/experiencias-vercel-inicial.json`, sem anúncio de navegação concluída.

Corrigido o domínio principal: adicionado explicitamente `diderot-platform-mari-granado.vercel.app` como domínio verificado de produção do mesmo projeto. Não foi desativada proteção global; `all_except_custom_domains` continua protegendo prévias. Acesso direto a `/demo` confirmou HTTP 200, sem Location/redirecionamento e com conteúdo do app. Isso preserva o domínio que a usuária já autorizou no Auth do Supabase.

Verificação móvel no domínio público passou: home → demonstração → shopper/perfil/favoritos → creator/serviços/portfólio/briefing fictício → marca/organização/três rascunhos/perfil → cadastro com três escolhas. Origem externa da API negada. Três identidades reais demonstrativas, leituras do Supabase sem interceptações; nenhuma mutação de negócio, envio de e-mail, candidatura, contrato ou pagamento. Saída local ao finalizar. Evidências `evidencias/experiencias-vercel.json` e `evidencias/experiencias-publicacao.json`; capturas em `work/screenshots/vercel-demo-entrada.png` e `vercel-demo-perfil-marca.png`. Prévia local também atualizada na porta 3002. Temporários de credenciais removidos da pasta de trabalho; `.env.local` ignorado e configurações sigilosas autorizadas da Vercel preservados.

## Referência de navegação e setup de projeto existente — 13/11/2026

Solicitações desta etapa: incorporar o documento local de navegação ShopMy ao PRD e aproveitar o Vibe Coding Toolkit no caminho “configurar um projeto existente”. Não recriar aplicação nem promover referências visuais a funcionalidades concluídas.

Fonte preservada em [REFERENCIA-NAVEGACAO-SHOPMY.md](REFERENCIA-NAVEGACAO-SHOPMY.md), idêntica byte a byte ao arquivo fornecido; SHA-256 `3CB0B6324C71708B51A725B01C512CAA376FFCE30D7158B12441D093EC79EE3F`. O arquivo contém relato e links por horário, não os vídeos ou prints individuais. Links de vídeo não foram reproduzidos nesta sessão; portal de marcas/admin/financeiro continuam propostas. Captura de home enviada anteriormente recebeu prévia JPEG real reduzida, conferida visualmente, no anexo.

[PRD v1.3](PRD-DIDEROT.md), seções 35/36, e [telas/fluxos](TELAS-FLUXOS-SHOPMY.md) consolidam as 17 seções e 14 aceites da fonte, sete estados relatados de vitrine/editor, referência pública anterior, oito requisitos NAV-C01–C08 e inventário de telas/rotas. Incluem campos de produto, relações N:N, publicação, importação, jornadas, estados móveis/acessíveis, isolamento e backlog. Preservadas três escolhas de conta, UGC nativo sem seguidores, candidatura por vaga e sete etapas U08 com mesmos nomes/ordem; afiliação permanece mecanismo comercial. Corrigidas descrições antigas que tratavam contas/favoritos/painéis/deploy como inteiramente ausentes.

Toolkit pinado em `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`, MIT preservada. [Setup e catálogo completo](setup.md), [arquitetura observada](architecture.md), [qualidade](quality.md) e [prompts](prompts/README.md) aproveitam documentos existentes em vez de criar PRD concorrente. AGENTS ampliado sem remover bloco Next; CLAUDE é bridge opcional não testado nesse cliente. Não instalar catálogo inteiro, mudar Auth/ORM/UI, habilitar serviços pagos ou ferramentas globais. Harness2 usado somente como adaptação nativa de processo, sem framework, benchmark ou alegação de ganho de modelo.

Verificação documental criada: `docs:check`, `docs:test` e `check` (documentos→testes do verificador→TypeScript). Baseline reproduziu três links para anexo ausente; criação do anexo resolveu sem suprimir links. Duas fixtures automatizadas passam, incluindo falta/restauração, escape de diretório e URL inválida. Conferência adicional passou: fonte exata, oito NAV, 14 AC, sete etapas alinhadas e bloco Next único.

Avaliação do lint não foi adotada: instalação local temporária de ESLint 9.39.5/presetNext 16.4.6 com scripts de pacote desativados rebaixou automaticamente TS 7.0.2 para 6.0.3 por peer do parser e avisou EOL. Diagnóstico: **15 erros/15 avisos em 84 arquivos**, exit 1, principalmente setState em effects, dependências de hooks e dois `any`. Não é baseline válido de TS7, não comprova falha funcional e não foi maquiado desabilitando regras. [Diagnóstico sanitizado](evidencias/lint-candidato.json). Pacotes/config de avaliação removidos; lock original remoto conferido/restaurado integralmente e dependências originais reinstaladas. Nenhuma mudança em componente de aplicação.

Primeira consulta npm falhou por rede; repetição autorizada funcionou. Primeira restauração de dependências falhou por SWC em uso na prévia 3002; parado somente o processo identificado dessa prévia e repetida restauração. Next 16.4.6/React 19.3.1/TS 7.0.2/Playwright 1.65.0 confirmados novamente; check passou após restauração. Primeira compilação demo compilou código/tipos, mas falhou por EPERM ao criar pasta de prerender; repetição autorizada e reabertura da prévia têm resultado final no registro abaixo.

Banco, contas reais/fictícias, dados de negócio, migrações e financeiro não foram alterados. Nenhum commit/push/deploy novo nesta etapa de setup. Auditoria integral e navegação autenticada não foram repetidas porque não houve mudança funcional. Lint compatível, confirmação/recuperação por e-mail real, administração e jornadas comerciais continuam pendentes. Próximo incremento funcional recomendado: briefing completo U08 e condições por vaga nos rascunhos privados. [Evidência final da etapa](evidencias/setup-toolkit.json).

**Resultado final:** `npm.cmd run check` aprovado com TypeScript 7.0.2: 29 documentos, 150 links locais sem destino ausente e 2/2 testes do verificador. Build em modo demo aprovado na repetição autorizada. Prévia reaberta em http://127.0.0.1:3002, catálogo explicitamente demo; home, `/demo`, `/cadastro` e `/conta` responderam HTTP 200, sem redirecionamento e com conteúdo Diderot. Primeira tentativa de consulta pelo runtime restrito falhou; verificação local autorizada passou. Não houve login ou nova jornada visual nessa checagem. Fonte e lock originais conferidos; pendência de lint compatível preservada. A etapa de consolidação e preparação selecionada está concluída, sem anunciar a plataforma ou catálogo inteiro do toolkit como concluídos.


## Briefing privado e plano de lançamento — 13/11/2026

Implementado o editor em sete etapas em /painel/marca → Campanhas em rascunho, com contexto/referências/produtos por link, grupos/modalidades, requisitos, entregáveis, direitos planejados, remunerações separadas e revisão. Migração aditiva 20261113120556_campaign_briefing.sql aplicada; mantém RLS, responsável editor/membro leitor, versão e retry do documento inteiro. UGC rejeita mínimo de seguidores no banco; postagem é explícita, direitos não são aceites e valores não geram operação financeira. [Campos, tabela funcional e limites](CAMPANHAS-RASCUNHOS.md).

Preservados registros e três rascunhos demonstrativos. Editor antigo não pode apagar condições novas por omitir campos. Corrigido bloqueador no formulário anterior: espalhar a linha do banco incluía IDs/status/relacionamentos na edição, incompatíveis com a whitelist do RPC; agora somente campos editáveis retornam ao documento. Regressão valida o segundo salvamento/reentrada e mock rejeita campos desconhecidos. Nenhuma alteração no código após a rodada final de build/testes, somente documentação/evidências.

SQL novo passou com identidades efêmeras/claims controladas e ROLLBACK: persistência, 13 payloads inválidos, precisão/zero/nulo, UGC, guarda legado, atomicidade, retry/conflito, isolamento, membro leitor, revogação e ausência de publicação. Suíte SQL anterior também passou. Primeira tentativa do fixture novo falhou por delimitador gerado incorretamente; corrigido somente no teste. API real com marca/creator/shopper demo passou na leitura própria e negação cruzada/anônima, sem mutação positiva de negócio. [Banco](evidencias/briefing-banco.json) e [API](evidencias/briefing-api.json). Não afirmar dois logins Auth editando por HTTP. Advisors mantêm apenas os avisos anteriores descritos no módulo.

Primeira interface: 16/22 aprovados, 247,3 segundos. Seis falhas em textareas carregadas; nomes acessíveis explícitos corrigidos no componente, sem retirar asserções. [Relatório inicial](evidencias/briefing-interface-inicial.json). Rebuild aprovado. Revalidação ampliada: **24/24 aprovados**, 112,4 segundos, desktop/celular, CAMP-01–11 e EXP-06 com dados reais demonstrativos somente em leitura, sem skips/retries. [Relatório final](evidencias/briefing-interface-final.json). Captura móvel conferida visualmente; sem overflow horizontal nos casos testados. Auditoria integral não repetida, admin continua pendente; não somar rodadas.

PRD atualizado para v1.4/incremento 37, estado consolidado e anexo corrigidos. Criado [plano detalhado do MVP](PLANO-LANCAMENTO-MVP.md), a pedido da usuária: onze blocos com dependências e gates desde contas/catálogo/vitrine/admin até campanhas/candidaturas, contratação/produção, afiliação/financeiro, segurança e homologação. Sem percentual global ou prazo inventado. O próximo incremento recomendado é catálogo manual da marca e relações necessárias à vitrine/campanhas, mantendo administração e confirmação/recuperação no caminho de lançamento.

U07/U08 permanecem parciais: um grupo por modalidade; sem múltiplas vagas, produto vinculado ao catálogo, elegibilidade e transições de publicação. Não há contratação, upload/produção ou financeiro. Frontend novo apenas local, reaberto em http://127.0.0.1:3002 com catálogo demo; sem push/deploy nesta etapa. Banco/contas/dados de negócio existentes preservados, sem e-mails ou financeiro de produção.

## Loja de afiliada/creator, fotos e redes — 13–14/11/2026

Entregue o incremento 38: editor /painel/criador/loja, loja por slug em /loja/[slug], perfil público com foto/bio/redes, produtos pessoais externos/seleção de catálogo demo, coleções/seções com cinco formatos e ordem/visibilidade/cópia, posts com imagem/produtos, prévia, publicação explícita e retirada. Creator/afiliada compartilham identidade/foto; marca tem foto no cartão da organização, responsável editor/membro leitor. Redes ficam abaixo de Explore minhas escolhas, em ordem configurável e nova aba. [Guia e auditoria funcional](LOJA-AFILIADA.md).

Migração 20261113131815_creator_shops_media.sql aplicada, mantendo dados existentes. Documento privado transacional por conta e snapshot público separado, RLS/RPC, recibo idempotente e versão. N:N por IDs locais/ordem validados no documento, não tabelas separadas por produto/seção. Bucket privado WebP e URLs de mídia publicadas com validade de até 15 minutos; retirada bloqueia novas autorizações. Arquivos abandonados não são apagados automaticamente.

SQL final passou com quatro identidades efêmeras/ROLLBACK, reexecutado em 14/11. Inclui propriedade/fotos/Storage, catálogo canônico, vínculos/URLs/tipos inválidos, ocultos, snapshot privado/público, retry/versão, membro da marca, e-mail confirmado e retirada. Metadados de arquivo no SQL são sintéticos. A geração inicial de política falhou antes da aplicação efetiva e foi corrigida; um código esperado no teste cruzado foi ajustado ao conflito realmente retornado, mantendo negação. INFO de tabela creator_shop_public_media sem política é intencional: sem grants diretos, consultada por helpers guardados. WARN anterior de senha vazada e INFO de convites mantidos, detalhes no módulo.

Seed real específico criou apenas a loja fictícia clara-demonstracao na conta demo creator, com dois itens do catálogo e um post com imagem ilustrativa existente. Upload binário privado, bloqueio anônimo pré-publicação, gravação/releitura/retry, publicação explícita e acesso anônimo à imagem publicada passaram. Script preserva loja já existente. Nenhum perfil/avatar profissional, organização, campanha ou outra conta foi sobrescrito; redes demo apontam às páginas iniciais das plataformas. [Banco/API](evidencias/loja-banco-api.json).

Interface inicial: **36 aprovados/4 falhas em 40 casos**, 125,9 segundos. Quatro falhas dos casos SHOP-02/03 confundiam o alerta esperado com o anunciador interno Next; seletores limitados a main sem reduzir verificação. [Inicial](evidencias/loja-interface-inicial.json). Revalidação final 14/11: **40/40 aprovados**, 246,5 segundos, desktop/celular, sem skips/retries. Inclui SHOP-01–06, regressão BR-01–05 e ONB-01–09. [Final](evidencias/loja-interface-final.json). SHOP-04 usa loja/Auth reais somente em leitura; demais SHOP simulam API/Storage, com reprocessamento de foto real no Chrome. Não houve upload de retrato em conta real. Captura móvel pública conferida visualmente: foto/placeholder no topo, redes abaixo do CTA, produtos/post e ausência de overflow.

PRD v1.5, anexo, arquitetura e plano do MVP atualizados. Build anterior aprovado; nesta retomada só seletores/documentação/evidências foram corrigidos, sem alteração funcional posterior à compilação. Auditoria integral não repetida; administração/financeiro e demais pendências continuam no PRD. Frontend novo na prévia local, sem push/deploy nesta etapa; banco/Storage já aplicados.

Verificação final da prévia em 14/11: /demo, /painel/criador/loja e /loja/clara-demonstracao retornaram HTTP 200, sem redirecionamento e com conteúdo Diderot; loja pública contém Instagram/TikTok/YouTube. Check aprovado: TypeScript, 2/2 testes do verificador e links documentais íntegros; última conferência 190 links locais. Prévia disponível em http://127.0.0.1:3002.


## Incremento 39 — apresentação da loja e catálogo (14/11/2026)

Atendido o pedido de redes somente com ícones, silhueta neutra em vez de Sem foto, retorno aos cards compactos anteriores e retirada da comunicação de demonstração da interface. Grade quatro colunas desktop/duas celular, fotos 4:5, marca/nome/preço, busca, categorias, ordenação e favoritos existentes. Posts continuam separados. Ícones mantêm nome acessível, foco, área 44×44 e abertura segura em nova aba. Nomes/bios/legendas conhecidos das fixtures são normalizados só na apresentação; leitura não grava no banco. Registros e flags de origem preservados. Contas compartilhadas continuam identificadas; compras e inscrições indisponíveis continuam explicadas. Sem migração, seed, alteração em massa de negócio ou operação financeira.

Rodada inicial: **81/82 aprovados**, 404,9 segundos, SHOP/HOME/DS/EXP/AUD/BR/ONB excluindo explicitamente @pendente. Falha EXP-06 desktop: entrada shopper não concluiu em dez segundos. [Evidência inicial](evidencias/ajustes-interface-inicial.json).

Após revisão final de textos e acessibilidade, build aprovado e revalidação dirigida: **25/26 aprovados**, 247,9 segundos, SHOP-01/02/04/07, EXP-01–06 e DS-02, nos dois tamanhos. Todos os casos dirigidos de ícones/avatar/catalogação/fotos/favoritos passaram; fotos aguardadas antes da captura. EXP-06 desktop voltou a falhar, desta vez ao trocar para marca, ainda em Entrando depois de trinta segundos; no celular a jornada passou. Aumentar a espera não resolveu integralmente. Causa não isolada; não declarar autenticação homologada nem somar rodadas como aprovação integral. [Evidência final](evidencias/ajustes-interface-final.json). Próxima ação: investigar o caminho da troca de sessão (requisição servidor, encerramento local e instalação de sessão) com tempos/status sanitizados e sem expor tokens.

Contratos de gravação nos testes usam mocks; SHOP-04 lê loja/Auth reais e SHOP-07 lê loja real/salva favorito somente no navegador. Não houve edição de negócio nas contas reais. Capturas desktop/celular conferidas visualmente, sem overflow e com fotografias reais carregadas. PRD v1.6, documento da loja e design system atualizados. Check de tipos, 2/2 testes documentais e 192 links locais aprovados; última compilação inclui a mesma apresentação no cadastro. Prévia local reiniciada em http://127.0.0.1:3002; /, /criador e /loja/clara-demonstracao retornaram HTTP 200. Sem push ou publicação na Vercel nesta etapa.


## Incremento 40 — foto, edição de perfil e cadastro (15/11/2026)

Meu perfil abre direto o formulário preenchido, com salvar/validar/reler e mudança de tipo separada. Foto de creator/afiliada e marca responsável disponível na edição principal, usando os mesmos RPC/Storage/referências existentes. Avatar é relido na navegação após salvar; a foto da creator entra no snapshot público ao publicar a loja. Não há avatar novo de shopper sem vínculo profissional/organização. Navegação lateral desktop/horizontal celular compartilhada entre conta e painéis, com atalhos efetivos para loja/produtos/coleções/posts/serviços/portfólio e áreas pertinentes aos outros tipos. Dados do formulário da loja não são descartados por troca de seção com editor aberto.

Mensagens condicionais citadas retiradas. Signup sem sessão orienta confirmar e-mail; com sessão permite onboarding. Reenvio usa endereço capturado da solicitação, não o campo editado depois. Resposta ofuscada sem nova identidade e erro de cadastro existente oferecem entrada/recuperação sem inventar envio. Recuperação informa solicitação recebida, sem revelar existência de conta ou prometer entrega. Consulta real somente leitura em /auth/v1/settings retornou 200, cadastro habilitado, provedor e-mail habilitado e confirmação obrigatória. Não prova SMTP/recebimento/clique real; não houve envio de e-mail de teste nem desativação da confirmação.

Primeiro teste dos novos casos: **2/4 aprovados**, 41,6 s; upload/releitura/reenvio passaram e SHOP-08 não abria Posts depois de mudar só o endereço. Corrigidos links de seção e sincronização do estado ativo. [Inicial](evidencias/perfil-cadastro-inicial.json).

Regressão privada: **76/78 aprovados**, 391,9 s, desktop/celular, sem skips/retries. SHOP-08 e EXP-07 passaram nos dois tamanhos, incluindo foto compartilhada, publicação de avatar e salvar/reler perfil com erro preservado. EXP-06 real alternou as três contas fictícias com sucesso nesta rodada; os timeouts anteriores não tiveram causa isolada, portanto uma passagem não comprova estabilidade permanente. Duas falhas SHOP-01 aguardavam Bio pública depois de recarregar a página que agora preserva a seção no hash; teste foi ajustado para abrir Loja e perfil antes de conferir os mesmos dados persistidos. [Regressão](evidencias/perfil-cadastro-regressao.json). A rodada precede o tratamento final de resposta ofuscada/reset de foto em troca de identidade; revalidação dirigida registrada a seguir.

Sem migração, seed, nova permissão, edição de dados de negócio real ou financeiro. Upload/publicação/salvamento de negócio nos testes novos são contratos simulados; Auth EXP-06 e leituras públicas existentes são reais. Foto de produto usada somente nas fixtures de teste, sem retrato atribuído a pessoa real. PRD v1.7 e arquitetura/documento da loja atualizados.


Revalidação da versão final: **40/42 aprovados**, 212,9 s, SHOP-01–08/ONB-01–11/EXP-03 e EXP-07 nos dois tamanhos. A correção do seletor SHOP-01 passou, assim como upload, avatar compartilhado, publicação, links de seção, erros e releitura do perfil. As duas falhas ONB-11 estavam no mock de erro explícito: faltavam cabeçalho de versão e sua exposição CORS, necessários para o SDK interpretar body.code. [Rodada](evidencias/perfil-cadastro-revalidado.json).

Tentativa intermediária com versão mas sem exposição CORS: **0/2 aprovados**, 37,4 s; aplicação preservada, fixture corrigida após leitura do parser instalado. [Intermediária](evidencias/perfil-cadastro-erro-intermediario.json). Revalidação final **2/2 aprovados**, 11,5 s, ONB-11 desktop/celular, sem retries/skips: resposta ofuscada e erro explícito agora mostram entrada/recuperação e não inventam confirmação enviada. [Final](evidencias/perfil-cadastro-erro-final.json). Não somar rodadas como uma auditoria integral. Nenhuma falha funcional permanece nos casos alterados após essa correção; entrega SMTP real continua não verificada.

Build final aprovado e revisão React/acessibilidade feita: hooks sem condição, descarte de leitura de avatar ao trocar titular, eventos sem tokens, autorização mantida nos RPCs/RLS, alvo de toque e foco no seletor de arquivo, navegação móvel sem overflow. Check aprovado (tipos, 2/2 testes documentais e links locais). Capturas de perfil desktop/celular conferidas visualmente. Prévia local reiniciada em http://127.0.0.1:3002; /cadastro, /conta/perfil e /loja/clara-demonstracao retornaram 200. Não houve push/publicação na Vercel nesta etapa.


## Incremento 41 — acesso e onboarding (16–17/11/2026)

Login por senha agora valida o usuário no Auth, lê account_profiles do titular e abre o painel salvo; sem perfil ou onboarding incompleto abre /onboarding. Não usa metadata/next para conceder destino. Compara sessão após a consulta e não redireciona com dados do titular anterior. Falha de perfil permite tentar abrir novamente; visita comum a /conta mantém gestão/saída. Login email_not_confirmed oferece reenvio direto para o endereço daquela tentativa.

Novos envios/reenvios de confirmação apontam para /auth/retorno: valida titular/e-mail, processa a sessão pelo SDK e encaminha a cadastro/painel; não reflete texto do link e remove parâmetros. Origem legada /conta preservada. Solicitação de conta compartilhada ganha prazo HTTP de 20 s e preserva conta atual antes da resposta válida; chamadas Auth do servidor têm prazo de 12 s por requisição. Não prometer prazo total de logout/setSession, nem considerar os timeouts históricos definitivamente solucionados. Medição registra só etapa, status e duração. Nenhum token, e-mail, senha ou corpo de resposta é anexado ao diagnóstico.

Em 16/11, consulta somente leitura às configurações públicas confirmou HTTP 200, cadastro/e-mail habilitados e confirmação obrigatória. SMTP, entrega/clique reais e allowlist de redirecionamento não foram modificados nem homologados. Nenhum usuário novo, seed, migração, privilégio ou operação financeira foi criado.

Primeira rodada: **24/24 aprovados**, 243,4 s, ACCESS-01–08 e AUTH-01/02 em computador/celular, antes de adicionar retorno por fragmento e reenvio pelo login. [Inicial](evidencias/acesso-onboarding-inicial.json). Rodada seguinte ficou sem relatório final após interrupção do ambiente: não atribuir contagem. Artefato disponível mostrou ACCESS-09 desktop parado em /auth/retorno apesar de leituras Auth/perfil HTTP 200. A limpeza do endereço no finally podia restaurar a rota de retorno após solicitar navegação. Limpeza movida para antes de router.replace, preservando tratamento de erro. [Falha observada](evidencias/acesso-onboarding-retorno-inicial.json).

Revalidação dirigida da correção: **2/2 aprovados**, 8,1 s, ACCESS-09 desktop/celular. Processa fragmento pelo SDK, abre painel esperado e remove tokens/query do endereço. [Retorno corrigido](evidencias/acesso-retorno-revalidado.json). Credenciais e Auth dessa fixture são simulados; não equivale ao recebimento de e-mail real. Build final aprovado. PRD v1.8, mapa de acesso e arquitetura atualizados. Regressão complementar e próxima ação registradas abaixo.


Regressão final em 17/11: **58/58 aprovados**, 177,9 s, sem skips/retries/flaky. Inclui ACCESS-01–09, AUTH-01–03, ONB-01–11, EXP-06 e SHOP-04/06/08 nos dois tamanhos. Valida painel por perfil salvo, falta de perfil, erro/retry, sessão encerrada durante leitura, retorno com fragmento, URL inválida, e-mail não confirmado, reenvio direto, preservação de sessão antes de resposta, cadastro/recovery e regressão de foto/publicação. [Evidência final](evidencias/acesso-onboarding-regressao.json). Não somar com a rodada inicial para afirmar auditoria integral.

EXP-06 real passou para shopper/creator/marca no desktop e celular. Seis respostas da API de sessão foram 200, entre 196–763 ms no navegador e 193,7–736,6 ms no servidor; logs anexos contêm só caminhos de etapas permitidos, status e duração. Não reproduziu os timeouts antigos nesta rodada e não identifica por si só a causa histórica. A existência de diretório de saída de teste com anexo não é evidência de falha; o resultado consolidado confirmou aprovação.

Check aprovado: tipos, 2/2 testes documentais e links íntegros; build final passou. Prévia local reiniciada, /conta, /cadastro, /auth/retorno e /onboarding retornaram 200. Sem push/deploy nesta etapa. Próximas dependências de lançamento: homologar recebimento/clique real com endereço autorizado e URLs de redirecionamento adequadas; publicar e conferir o mesmo fluxo no domínio da Vercel; depois seguir prioridades do plano do MVP. Administração, campanha/contratação e financeiro não foram marcados concluídos por esses testes.


## Incremento 42 — preparação da publicação (17/11/2026)

Comparado GitHub main (ee3ff813955ea312f79feec840bbb0827902eb57) com a versão local: GitHub ainda não inclui loja própria, fotos, navegação privada e retorno de confirmação recentes. Home pública 200, /auth/retorno e /loja/clara-demonstracao 404. Status Vercel do head confirma vínculo à equipe Mari Granado/projeto diderot-platform. Conector de Vercel retorna 404 e CLI não conserva credenciais; não foi criado projeto duplicado. Preparado envio pela integração Git existente, com preservação de ambiente e sem fontes TRIAL/credenciais. [Plano e limites](PUBLICACAO-VERCEL.md). Ainda não considerar nova versão publicada por esta preparação.


Conclusão do incremento 42: publicado o commit [2a0ca50](https://github.com/marigranadoc/diderot-platform/commit/2a0ca505f8f4f2530a9f7dcf1a4dda02fb44083d), status Vercel success. Rotas de conta/retorno/loja privadas e públicas respondem 200 no domínio canônico. Jornadas reais das três contas fictícias aprovadas no computador e celular, em leitura e com gravações de negócio bloqueadas (zero tentativas). [Evidência](evidencias/publicacao-vercel-jornadas.json) e [publicação](PUBLICACAO-VERCEL.md). Entrega/clique de e-mail real não testados.

## Incremento 43 — criação da loja no fluxo de app (18/11/2026)

Referência fornecida preservada no [guia](REFERENCIA-CONSTRUCAO-LOJA-SHOPMY.md), sem executar instruções do texto como comandos. PRD v1.10 separa seções, coleções e produtos/links, registra escopo e integrações ainda ausentes. Implementação e testes em andamento.

Causa identificada da indisponibilidade de foto em produto do catálogo: formulário não mostrava envio, normalizador do banco apagava image_path e vitrine priorizava imagem canônica. Correção mantém nome/preço/marca canônicos, permite somente arquivo do titular e prioriza foto própria na loja. Não foi possível atribuir a falha relatada a HEIC ou rede sem evidência do arquivo da usuária.

Migração 20261118224903_shop_product_photo_override aplicada: normalização compatível de sections e section_id/archived; validação de vínculos; foto própria; publicação filtrada e índice público de mídia. Nenhuma linha preexistente regravada, sem novos grants/bucket/tabelas. SQL completo com quatro identidades efêmeras/ROLLBACK passou, incluindo CRUD/retry/conflito/RLS, fotos cruzadas, catálogo canônico, legado, arquivar/restaurar e ocultar seção/coleção sem vazamento no snapshot. Storage metadata sintético, sem upload binário novo real nesta etapa.

Advisors de segurança mantêm o WARN preexistente de proteção de senhas vazadas desabilitada ([orientação](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)) e INFO nas duas tabelas fechadas sem grants diretos; sem achado novo. Não foram abertas políticas só para suprimir INFO.

Build inicial falhou com EPERM em pasta gerada .next/server/app/conta/criador; repetido com acesso adequado e passou, sem alterar código para contornar erro. Check passou: tipos, 2/2 testes do verificador e 212 links íntegros. Testes de interface em execução; não considerar incremento publicado ainda.


Interface inicial: **16/20 aprovados**, 128,7 s. SHOP-04 nos dois tamanhos detectou a descrição Curadoria demonstrativa da fixture, agora exposta pelos novos cards; normalização restrita à apresentação foi estendida às coleções. SHOP-09 nos dois tamanhos não encontrou o select pelo label exato (opções entram no texto); trocado para combobox/nome acessível, sem remover a validação do valor. [Inicial](evidencias/loja-criacao-interface-inicial.json).

Build corrigido aprovado. Interface final: **22/22 aprovados**, 139,1 s, sem skips/retries/flaky, SHOP-01–11 no computador e celular. [Final](evidencias/loja-criacao-interface-final.json). Inclui + inferior, diálogo/Escape/retorno de foco, entradas URL/catálogo/registros, seção e coleção criadas juntas, associação/reutilização sem duplicar registro, arquivar/restaurar, ocultar seção, foto própria no item canônico com fallback de decodificação, erro de arquivo inválido com campos preservados, proteção de formulário aberto, releitura/reload, prévia e publicação explícita. SHOP-04 usa conta fictícia e loja reais em leitura; demais casos simulam API/Storage e reprocessam arquivos reais no Chrome. [Banco isolado](evidencias/loja-hierarquia-banco.json) cobre autorização e persistência com ROLLBACK. Não é auditoria integral nem comprova suporte universal a HEIC. Captura móvel da hierarquia revisada, sem overflow.

PRD v1.10, guia preservado, arquitetura e módulo atualizados. Revisão React: efeitos com limpeza de sessão/arquivo, verificação de titular antes/depois do upload, estados de envio/erro e campos preservados; diálogo nativo modal/foco/Escape; opções com nomes acessíveis e ações com tipo adequado. Sem dependência ou serviço novo. Publicação do incremento 43 em preparação.


Publicação confirmada do incremento 43: [bbd1c25](https://github.com/marigranadoc/diderot-platform/commit/bbd1c25263e8cd7d56b6d5f642be4fa66c8538cf), [Vercel success](https://vercel.com/mari-granado/diderot-platform/E9hHS91W5bc6FonqcsHBYyEYsJ8a). [Navegação publicada](evidencias/publicacao-vercel-criacao-jornadas.json) passou para shopper/creator/marca no computador e celular, incluindo menu de criação, editor, perfil/foto, loja pública e campanhas existentes da marca. Escritas de negócio bloqueadas durante a conferência, zero tentativas. Não houve upload/publicação de conteúdo de conta real nesse teste. Domínio: https://diderot-platform-mari-granado.vercel.app. Prévia local também disponível na porta 3002.

Próxima ação: homologar o arquivo de foto específico da usuária caso ainda falhe e planejar a importação automática por URL com validação de destino/limites e fallback manual. Integrações de varejistas, variantes, tracking por posição, comissões, extensões iOS e arrastar continuam pendentes no PRD; não simuladas. Produtos externos sem foto/link completo devem permanecer com visibilidade de produto desmarcada enquanto são preparados, mesmo dentro de coleção oculta. Entrega/clique real de confirmação de e-mail e demais bloqueadores do MVP não foram considerados resolvidos pelo deploy.
