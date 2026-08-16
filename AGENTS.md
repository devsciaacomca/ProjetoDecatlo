<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Regras do Projeto (Git e Segurança)
- Nunca faça `git push origin main` diretamente, a menos que seja explicitamente combinado com o responsável pelo projeto. Sempre crie branches separadas para cada tarefa.
- É estritamente proibido enviar (commitar) os seguintes arquivos/pastas:
  - `node_modules`
  - `.next`
  - Arquivos `.env` ou `.env.local`
  - Quaisquer senhas, tokens, secrets ou chaves de API.
- Se o projeto precisar de alguma variável de ambiente para funcionar, não as coloque no código; elas devem ser configuradas separadamente na máquina de cada desenvolvedor.
