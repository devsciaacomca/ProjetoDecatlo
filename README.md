# 🚀 Projeto Decatlo — Guia para começar

## 1. Antes de começar

Para participar do desenvolvimento do projeto, **mande no grupo o seu usuário do GitHub**.

Exemplo:

> Meu GitHub: `joao123`

Vou adicionar cada integrante como colaborador do repositório.

**Repositório do projeto:**

https://github.com/devsciaacomca/ProjetoDecatlo

**Projeto publicado na Vercel:**

https://projeto-decatlo.vercel.app

---

# 2. Instalar os programas necessários

Antes de clonar o projeto, você precisa ter instalado:

- **Git**
- **Node.js**
- **Visual Studio Code**

Depois de instalar, abra o terminal e verifique:

```bash
git --version
```

e:

```bash
node -v
```

Se os comandos mostrarem as versões instaladas, está tudo certo.

---

# 3. Clonar o projeto

Depois que você for adicionado ao repositório, abra o terminal na pasta onde deseja guardar o projeto.

Execute:

```bash
git clone https://github.com/devsciaacomca/ProjetoDecatlo.git
```

Depois entre na pasta:

```bash
cd ProjetoDecatlo
```

---

# 4. Abrir no VS Code

Dentro da pasta do projeto, execute:

```bash
code .
```

Se o comando `code` não funcionar, basta abrir o VS Code manualmente e selecionar:

**File → Open Folder → ProjetoDecatlo**

---

# 5. Instalar as dependências

Com o terminal dentro da pasta do projeto, execute:

```bash
npm install
```

Esse comando instala todas as bibliotecas utilizadas pelo projeto.

⚠️ **Não é necessário baixar ou enviar a pasta `node_modules` pelo GitHub.**

Cada desenvolvedor deve executar o `npm install` na própria máquina.

---

# 6. Executar o projeto

Depois que a instalação terminar, execute:

```bash
npm run dev
```

O Next.js iniciará o servidor de desenvolvimento.

Normalmente o projeto ficará disponível em:

```text
http://localhost:3000
```

Abra esse endereço no navegador.

---

# 7. Fluxo de trabalho

Depois que o projeto estiver funcionando, **não trabalhe diretamente na `main`**.

Antes de começar uma tarefa, atualize o projeto:

```bash
git pull origin main
```

Depois crie uma branch para sua tarefa:

```bash
git checkout -b nome-da-tarefa
```

Exemplo:

```bash
git checkout -b pagina-atletas
```

Faça suas alterações normalmente.

---

# 8. Salvar suas alterações no GitHub

Depois de terminar uma parte do trabalho:

```bash
git add .
```

Depois faça o commit:

```bash
git commit -m "feat: adiciona pagina de atletas"
```

E envie sua branch:

```bash
git push origin nome-da-tarefa
```

Exemplo:

```bash
git push origin pagina-atletas
```

Depois disso, abra um **Pull Request (PR)** no GitHub para que a alteração possa ser revisada e depois integrada à `main`.

---

# 9. Resumo dos comandos

### Primeira vez

```bash
git clone https://github.com/devsciaacomca/ProjetoDecatlo.git

cd ProjetoDecatlo

npm install

npm run dev
```

### Para começar uma nova tarefa

```bash
git pull origin main

git checkout -b minha-tarefa
```

### Depois de fazer alterações

```bash
git add .

git commit -m "feat: minha alteração"

git push origin minha-tarefa
```

Depois é só abrir o Pull Request no GitHub.

---

# ⚠️ Importante

### Não faça:

```bash
git push origin main
```

diretamente, salvo quando isso for combinado com o responsável pelo projeto.

### Também não envie:

- `node_modules`
- `.next`
- arquivos `.env` ou `.env.local`
- senhas, tokens ou chaves de API

Se o projeto precisar de alguma variável de ambiente para funcionar, ela deve ser configurada separadamente na máquina de cada desenvolvedor.

---

# 🌐 Projeto online

Para visualizar a versão publicada:

https://projeto-decatlo.vercel.app

A Vercel pode realizar novos deploys a partir das alterações enviadas ao repositório, dependendo da configuração do projeto.

---

## ✅ Checklist

Antes de começar, confirme:

- [ ] Enviei meu usuário do GitHub para o Samuel
- [ ] Fui adicionado ao repositório
- [ ] Instalei o Git
- [ ] Instalei o Node.js
- [ ] Clonei o projeto
- [ ] Executei `npm install`
- [ ] Executei `npm run dev`
- [ ] Consegui acessar `localhost:3000`
- [ ] Entendi como criar uma branch
- [ ] Entendi como enviar um Pull Request

**Se tudo estiver marcado, você já está pronto para começar a desenvolver. 🚀**
