# Diderot — primeiro módulo

Documento consolidado do produto: [PRD Diderot — escopo, estado atual e backlog](docs/PRD-DIDEROT.md), versão 1.0 de 12/11/2026. Inclui evidências REA, requisitos, jornadas, critérios de aceite e limites de validação.

Loja pública demonstrativa feita com Next.js, TypeScript e Tailwind CSS. Todo o conteúdo comercial é fictício; as ilustrações são originais em SVG. Não há pagamentos, cadastro ou rastreamento.

## Abrir no Windows

Na pasta deste projeto, execute `npm.cmd install` e depois `npm.cmd run dev`. Abra o endereço local informado no terminal. Para encerrar, use Ctrl+C.

## Verificar

- `npm.cmd run typecheck`
- `npm.cmd run build`
- Depois do build, `npm.cmd test` executa a auditoria completa, iniciando seu próprio servidor em `http://127.0.0.1:3101`. Retorna falha enquanto faltarem persistência e áreas de gestão. A porta 3101 precisa estar livre. Os testes usam o Chrome instalado; informe outro executável pela variável `DIDEROT_CHROME_PATH`.
- `npm.cmd run test:vitrine` verifica somente o escopo demonstrativo implementado. Exclui explicitamente os testes `@pendente` e não aprova a plataforma completa.

Histórico da primeira construção: build, TypeScript e seis testes da vitrine aprovados. Esses testes não verificavam banco, autenticação ou áreas de gestão. A auditoria posterior ampliou a cobertura e registrou falhas reais; consulte [docs/PROGRESSO-DIDEROT.md](docs/PROGRESSO-DIDEROT.md) e [a referência derivada via REA](docs/PRD-DIDEROT-REFERENCIA.md).

Para abrir a versão compilada: `npm.cmd run build` e `npm.cmd start`. Não execute `dev` e `start` na mesma porta ao mesmo tempo.

## Páginas

- `/`: apresentação e descoberta de coleções.
- `/criador`: perfil, coleções, busca, filtros, ordenação e favoritos durante a visita.
- `/colecoes/essenciais`, `/colecoes/rituais`, `/colecoes/casa`: coleções.
- `/produto/bolsa-oliva` e outros itens do catálogo: detalhes.

Favoritos existem apenas na instância da tela: desaparecem ao recarregar ou remontar o catálogo ao navegar. A disponibilidade abre uma explicação demonstrativa; não leva a uma loja real. Esta etapa não inclui toda a plataforma ShopMy.

## Catálogo conectado

A vitrine consulta o Supabase no servidor. Antes de iniciar, configure `.env.local` conforme [docs/INTEGRACOES.md](docs/INTEGRACOES.md). Para a demonstração offline, defina explicitamente `DIDEROT_DATA_SOURCE=demo`. O modo conectado não usa fallback silencioso. `node scripts/check-database.mjs` verifica o catálogo demonstrativo remoto e o bloqueio de escrita pública. Login, favoritos persistentes e gestão permanecem pendentes.

A rota `/conta` permite login/logout para contas existentes; visitantes mantêm favoritos temporários. Favoritos de contas usam a tabela `favorites` com regras por usuário, mas a jornada com Auth real ainda aguarda validação. Testes simulados de interface não comprovam persistência remota. Cadastro público e recuperação de senha ainda não estão disponíveis.
