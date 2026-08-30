# Passos para quando o PC reiniciar 🚀

Como criamos tabelas novas no Prisma e refatoramos as rotas, precisamos do banco de dados rodando antes de conseguir testar o sistema.

Siga os passos abaixo na ordem:

### 1. Inicie o Docker Desktop
Abra o programa **Docker Desktop** no Windows e aguarde até que o ícone dele fique verde/informe que a "Engine" está rodando.

### 2. Suba o Banco de Dados Local
Abra o terminal na raiz do projeto (`ProjetoDecatlo`) e rode o comando:
```bash
docker-compose up -d
```
*Isso vai ler o arquivo `docker-compose.yml` que criamos e criar um container do PostgreSQL rodando na porta 5432.*

### 3. Rode as Migrations do Prisma
Como temos um banco "zerado", precisamos que o Prisma crie as tabelas lá dentro. Rode:
```bash
npx prisma migrate dev --name init_e_novas_tabelas
```

### 4. Popule o Banco com as Permissões (Seed)
Para você conseguir criar usuários e fazer login, os Perfis (Administrador, etc) precisam existir no banco. Rode:
```bash
npx prisma db seed
```

### 5. Inicie o Projeto e Teste!
Agora é só rodar o seu frontend/backend:
```bash
npm run dev
```

Abra `http://localhost:3000` no seu navegador, vá na tela de **Usuários**, crie usuários novos, teste a pesquisa, paginação, e valide se tudo ficou perfeito.

Se travar em qualquer um dos passos, é só mandar mensagem aqui no chat que a gente resolve!
