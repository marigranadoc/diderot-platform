# GitHub e Supabase

Destino do código autorizado: https://github.com/marigranadoc/diderot-platform

Projeto Supabase solicitado: https://mbxpwrgfujnjonyxzvfw.supabase.co

## Estado

O GitHub confirmou acesso de escrita ao repositório inicialmente vazio. A base local inclui a vitrine, os testes e a auditoria. Salvar o código no GitHub não publica o site.

A integração de banco **ainda está pendente**: o plugin Supabase aparece instalado, mas suas ferramentas não foram expostas nesta sessão. Não foi possível listar tabelas, verificar dados existentes ou executar SQL. O navegador também exigiu login na tentativa anterior. Nenhuma alteração foi aplicada ao projeto remoto.

`.env.example` declara a URL e o nome da configuração pública esperada. Isso não cria um cliente conectado e não comprova acesso ao banco. Chaves privadas, arquivos `.env` e credenciais não devem ser enviados ao GitHub. A URL do projeto não é suficiente para autenticar operações.

## Próximos passos após autorizar a conexão Supabase

1. Confirmar que o projeto acessível corresponde a `mbxpwrgfujnjonyxzvfw`.
2. Inventariar tabelas, políticas de acesso, migrações e presença de dados reais, sem ler dados pessoais desnecessários.
3. Preparar esquema e migrações compatíveis com o estado encontrado. Não executar reset nem substituir tabelas existentes.
4. Integrar o cliente Supabase e sessões no Next.js; habilitar RLS e validar papel e propriedade no servidor.
5. Testar gravação, recarregamento, remoção e isolamento com contas e dados demonstrativos em ambiente identificado como de teste.
6. Atualizar a matriz de auditoria apenas com evidências reais. A configuração de um serviço não conclui automaticamente as jornadas de shopper, creator, brand e administrador.

Documentação consultada: https://supabase.com/docs/guides/ai-tools/mcp e https://supabase.com/changelog.md. Autorização do plugin e configuração do código são etapas diferentes; reconectar pode exigir recarregar a sessão para expor as ferramentas.
