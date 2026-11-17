# Acesso e onboarding

Incremento 41 · 16/11/2026. [PRD](PRD-DIDEROT.md) e [progresso](PROGRESSO-DIDEROT.md).

## Jornada

| Entrada | Verificação | Destino |
|---|---|---|
| /cadastro | Auth signup; sem sessão pede confirmação | E-mail com retorno /auth/retorno; com sessão permite /onboarding |
| /auth/retorno | SDK processa sessão, getUser verifica titular/e-mail; account_profiles é relido | /onboarding ou painel do cadastro salvo |
| /conta, botão Entrar | Senha validada; getUser e perfil salvo; sessão comparada após consulta | /onboarding, /painel/shopper, /painel/criador ou /painel/marca |
| Visita comum a /conta já conectado | Hook existente valida sessão | Mantém opções de conta e saída local |
| /demo | Sessão obtida no servidor; logout local, setSession e getUser | Painel da experiência escolhida, com contas compartilhadas identificadas |

Onboarding conserva escolha, perfil e revisão. Creator/afiliada configura modalidades, depois Minha loja → foto/perfil/redes → produtos/coleções/posts → prévia → publicação → Ver minha loja. Marca responsável configura organização/foto, equipe e rascunhos de campanhas. Shopper organiza interesses e favoritos. Contratação, inscrição em campanha e afiliação financeira continuam fora das capacidades concluídas.

## Falhas e segurança

- Falha ao ler o perfil não escolhe um painel por suposição: oferece tentar novamente.
- Titular diferente ou sessão removida durante a consulta impede redirecionar com os dados anteriores.
- Tipo escolhido no cadastro é preferência inicial, não autorização. Destinos são constantes internas. Parâmetro next não é usado.
- Retorno de confirmação exige e-mail confirmado pelo Auth; descrições de erro do link não entram na interface.
- A solicitação de entrada compartilhada possui prazo HTTP; não limpa a conta atual antes de receber credenciais válidas. Demais passos do SDK não recebem promessa de prazo total.
- Não são registrados corpos de sessão, tokens, e-mails ou senhas. Diagnóstico usa só caminho permitido da etapa, código de resposta e duração.

## Limites de homologação

Testes de senha/callback/onboarding com identidades sintéticas e respostas simuladas comprovam interface e contrato, não entrega SMTP. O caso real EXP-06 autentica apenas as três contas fictícias já autorizadas e lê seus dados. Não cria novos usuários ou envia e-mails. Configuração SMTP e URLs permitidas do projeto não foram modificadas. Homologar recebimento/clique reais e publicação na Vercel separadamente.

Login com retorno email_not_confirmed oferece Reenviar confirmação sem pedir um novo cadastro. O reenvio mantém o endereço que recebeu esse retorno, mesmo que o campo de e-mail seja alterado depois; a mensagem confirma somente a solicitação, sem garantir entrega.

## Retorno do link — revisão de 17/11/2026

A limpeza do endereço acontece antes de solicitar a navegação. Uma limpeza posterior no finally podia restaurar /auth/retorno e interromper a abertura do painel após o SDK processar o fragmento. ACCESS-09 cobre esse caminho com Auth simulado. A homologação por uma mensagem recebida de verdade permanece separada.

## Evidência atual

Regressão dirigida 17/11: 58/58 aprovados, desktop/celular, com limites e tempos em [evidência](evidencias/acesso-onboarding-regressao.json). Casos simulados não substituem entrega SMTP; a autenticação real das três contas fictícias passou nesta rodada. Uma passagem não atribui causa aos timeouts antigos.
