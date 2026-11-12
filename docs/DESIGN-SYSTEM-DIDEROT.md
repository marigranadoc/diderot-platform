# Identidade visual e home Diderot

Atualização de 12/11/2026, baseada nos três arquivos de referência enviados pela usuária: design system, tokens e estrutura da home, além da captura de tela. As referências descrevem aparência e estrutura; não comprovam disponibilidade de serviços na Diderot.

## Implementação

- Tokens fornecidos preservados integralmente em `app/design-tokens.css`; ajustes de fonte e composição ficam em `app/globals.css`. Referência de tokens SHA-256: 8cca951d3495f275ed6e2f5123234ffff4a3fbfe20ef2301bbdbf12aa04964ea.
- Preto, branco, escala de cinzas, bordas, campos, botões, espaçamento e hierarquia tipográfica aplicados às telas públicas e privadas existentes.
- Reckless substitui Tobias e ShopMy Plain nas variáveis serif e plain; DM Sans permanece nos textos, formulários e controles, conforme o design system. Fallback Georgia.
- Home: hero fotográfico 85vh/90svh no celular, cabeçalho com menus por público e busca, faixa móvel escura, mosaico de curadoria, oito seleções temáticas, CTA fotográfico, oito categorias, oito cartões de marcas e rodapé em cinco colunas. Grids de quatro colunas passam a duas no tablet/celular. Ações de seção descem para depois do grid no celular.
- Busca, categorias e marcas transmitem filtros pela URL para o catálogo. Menus, links, cadastro e acesso apontam para rotas existentes. Menu com Escape, foco inicial, contenção de Tab e retorno do foco.
- Oito fotografias reais locais WebP substituem os desenhos vetoriais em home, catálogo, coleções e detalhe. `public/products/sources.json` registra autores, fontes e licença Unsplash. Fotos ilustrativas: não são comprovação de SKU, marca ou cor do produto fictício.

## Fonte enviada e licença

O ZIP contém fontes Reckless TRIAL e `Befonts-License.txt` com **Personal Use Only**. Quatro arquivos Standard M foram instalados somente na prévia local. `public/fonts/reckless/` está ignorado e seus binários não são enviados ao GitHub. Não publicar esta versão como fonte comercial licenciada. Para instalar novamente nesta prévia: `powershell -File scripts/install-reckless-preview.ps1 -Archive CAMINHO_DO_ZIP`. Uma implantação sem os arquivos usa Georgia; a fonte definitiva requer os arquivos e direitos adequados.

DM Sans veio do repositório oficial Google Fonts, licença SIL OFL 1.1, com origem e licença em `public/fonts/`. A revisão automática inicialmente recusou o envio por falta de comprovação da licença; a licença foi verificada e a nova tentativa de envio da DM Sans foi aceita. Reckless permanece local.

## Limites funcionais

Há uma criadora fictícia, oito produtos e quatro marcas demonstrativas. O mosaico usa a criadora e suas escolhas, sem inventar nove perfis ou endossos de celebridades. Os oito cartões de marcas representam produtos das quatro marcas existentes. Círculos são atalhos de coleções por tema, identificados como demonstração; criar círculos pessoais segue pendente. Não há app nativo ou concierge ativo; a faixa móvel convida à loja responsiva. Não foram criados botões de download, contratação ou campanha fictícios. Nenhuma migração, dado real ou serviço financeiro foi alterado nesta etapa.

## Verificação

Build de produção aprovado. Testes DS cobrem tokens, fotos e responsividade; testes HOME cobrem sequência, contagens, carregamento, busca/filtros reais e teclado. Auditoria existente verifica rotas, erros, produtos, coleções e fluxos de conta com contratos simulados. A execução anterior do design system registrou 56 aprovados e seis falhas conhecidas de visitante/marca/admin; resultado final desta home registrado em PROGRESSO-DIDEROT.md e nas evidências.

Resultado registrado: auditoria integral 62/68, com seis falhas conhecidas (visitante, marca/admin nos dois tamanhos). Depois do último ajuste exclusivo do cabeçalho, build e 12/12 testes direcionados aprovados. Evidências: `evidencias/auditoria-home-final.json` e `evidencias/home-revalidada.json`. Não combinar essas execuções como uma única aprovação integral.
