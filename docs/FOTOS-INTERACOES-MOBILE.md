# Fotos e interações móveis

19/11/2026 · Incremento 46. Preservar a direção visual e melhorar a interação, conforme a última orientação da usuária.

## Diagnóstico

Upload WebP real no Chrome da conta fictícia retornou 200; não foi reproduzida uma falha universal de Storage. Encontrado bloqueio no cliente: prepareImage rejeitava saída diferente de WebP, embora canvas possa retornar PNG se o encoder pedido não estiver disponível. A documentação [MDN de toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) e [compatibilidade mantida pela MDN](https://github.com/mdn/browser-compat-data/blob/main/api/HTMLCanvasElement.json) registram essa diferença. A migração original aceitava apenas WebP no bucket e no vínculo; apenas trocar a extensão no frontend não resolveria.

## Entrega

- [Processamento](../lib/photo-processing.ts): verifica MIME real, limita entrada/saída e mantém proporção de produtos/posts.
- [Enquadramento](../components/PhotoCropDialog.tsx): prévia circular, arraste, zoom, posição, centralização, cancelamento sem envio e exportação quadrada. Portal evita bloqueio pelos fieldsets do formulário.
- [Upload](../components/ShopImageUpload.tsx): valida sessão, usa nome/MIME compatíveis, preserva preparação e erros, oferece nova tentativa.
- [Interações](../app/interactions.css): alternâncias nativas de visibilidade, detalhes com expansão, transições de etapas, feedback em verde, contraste discreto e cabeçalho móvel compacto. Movimento reduzido respeitado.
- [Migração](../supabase/migrations/20261119155541_browser_photo_formats.sql) aplicada: somente WebP/PNG/JPEG, tamanho anterior preservado, bucket privado, proprietário/pasta/perfil profissional mantidos. Helper privado continua sem execução direta por authenticated.

## Verificação

12/12 dirigidos iniciais aprovados; regressão 90/90 em 415,2 s, sem falhas/ignorados/flaky; após acabamento, 18/18 dirigidos em 176,4 s. Arquivo efetivamente enviado conferido em 512×512, recorte e foco, formatos/retry e menu móvel em 320/390/768 px. Build final e check aprovados. Não somar rodadas como auditoria integral. [Evidências](evidencias/fotos-interacoes-validacao.json). [SQL isolado](../supabase/tests/photo-formats.sql) terminou com photo_formats_rls_passed após rollback: formatos válidos, vínculo/releitura, pasta alheia negada, MIME inconsistente e SVG rejeitados. Estado confirmado: bucket_public=false, direct_private_helper=false, authenticated_photo_rpc=true.

Envio real autorizado de PNG com encoder WebP indisponível simulado: HTTP 200, extensão png, MIME image/png; zero gravações REST de negócio. A conta fictícia recebe arquivos privados sem vínculo novo; loja/perfil/publicação não foram alterados pelo probe. Aprovação explícita recebida após a revisão automática bloquear a primeira tentativa. Capturas autenticadas permanecem locais.

Limites: nenhum iPhone físico foi testado. A compatibilidade de HEIC depende do navegador. Não houve e-mails, operações financeiras, seeds ou alteração de dados reais de usuários. Avisos anteriores de segurança (incluindo configuração de senhas) não foram alterados para resolver upload; esta entrega não é auditoria integral de segurança.
