# Changelog - Projeto Decatlo 🏆

Este documento registra de forma amigável e humana todas as grandes novidades, mudanças e correções que fazemos no projeto.

## [Versão Inicial da API] - 16 de Agosto de 2026

Hoje foi um dia de fundações fortes! Colocamos a "mão na massa" para construir a espinha dorsal do nosso backend, preparando o terreno para quando o banco de dados oficial (Prisma) chegar.

### ✨ O que há de novo?
- **O Nascimento da API:** Criamos toda a estrutura de pastas do nosso backend direto no Next.js (`app/api`).
- **Respostas Padronizadas:** Criamos um utilitário (`lib/api-response.ts`) para garantir que o Frontend sempre receba as respostas do servidor (seja sucesso ou erro) no mesmo formato previsível. Chega de surpresas!
- **Validações de Ferro (Zod):** 
  - Adicionamos um esquema de segurança de **Autenticação** que obriga senhas a terem no mínimo 8 caracteres.
  - Criamos a validação de **Perguntas** com regras inteligentes (ex: se o professor tentar criar uma pergunta objetiva, o sistema obriga a enviar pelo menos duas alternativas).
- **Tradução para o Nosso Idioma:** Toda a estrutura de pastas e arquivos recém-criada foi traduzida para PT-BR (`autenticacao`, `perguntas`, `jogo`, `auditoria`, `validacoes`), deixando o código muito mais semântico para a equipe.

### 🛣️ Endpoints Criados (Prontos para Integração)
Foram criadas as rotas que farão a mágica acontecer:
- 🔐 `/api/autenticacao/login` - Para verificar credenciais.
- 📝 `/api/perguntas` - Para listar e cadastrar as perguntas do jogo.
- 🎮 `/api/jogo` - Para gerenciar o estado da partida em tempo real no telão.
- 🕵️ `/api/auditoria` - Para rastrear e salvar os logs de quem fez o quê no painel.

### 🛡️ Segurança e Boas Práticas
- Adicionamos regras estritas no nosso `AGENTS.md` para proteger a branch `main` e proibir o envio de arquivos sensíveis (`.env`, tokens, senhas) para o GitHub.
- Todo o trabalho de hoje foi encapsulado de forma limpa e segura na branch `EstruturaAPI`.

---
*Feito com ☕ e muito código limpo!*

---

## [Backend & Integração de Usuários] - 26 de Agosto de 2026

Hoje eu peguei pesado na construção e integração da gestão de usuários do nosso sistema! Como você já tinha deixado as telas de perfil e de usuários prontas, minha missão foi dar vida a elas conectando tudo ao nosso banco de dados.

### ✨ O que eu fiz hoje?
- **CRUD Completo de Usuários:** Criei as rotas `/api/usuarios` (GET e POST) e `/api/usuarios/[id]` (GET, PUT, DELETE) para que a tela de gerenciamento funcionasse de verdade, persistindo tudo no Prisma.
- **Perfil do Usuário Logado:** Implementei as rotas `/api/usuario/perfil` e `/api/usuario/senha`. Agora, quem está logado consegue atualizar os próprios dados e trocar de senha com segurança (validando a senha atual com `bcryptjs`).
- **Validações e Segurança (Zod):** Desenvolvi todos os schemas de validação (`createUserSchema`, `updatePasswordSchema`, etc) exigindo, por exemplo, NIP com exatos 8 dígitos e senha com mínimo de 6 caracteres.
- **Controle de Acesso (Roles):** Criei uma função utilitária `hasPermission` para garantir que apenas administradores ou usuários autorizados possam listar, criar ou excluir usuários do sistema.
- **Integração Frontend:** Fiz a mágica acontecer! Descomentei e refatorei os códigos das suas páginas `/dashboard/usuarios` e `/dashboard/perfil`. Substituí os dados de exemplo (`usuariosIniciais`) por requisições `fetch` reais para a nova API. 
- **População Inicial (Seed):** Modifiquei o arquivo `prisma/seed.ts` para já gerar todos os quatro perfis padrões no banco (*Administrador*, *Apresentador*, *Cadastrador*, *Usuário*), evitando que a API recuse a criação de contas com perfis inexistentes.

Tudo testado e conectado! 🚀
