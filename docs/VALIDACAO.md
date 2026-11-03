# Checklist de validação — iCasei 2026

Este documento separa o que **foi verificado na estrutura pública do repositório**, o que **já foi testado localmente durante o desenvolvimento** e o que **ainda depende de uma rodada de testes na versão final**.

## Verificações realizadas durante a revisão

- O repositório `dadacm/teste-front-end-2026` existe e contém o monorepo pnpm.
- `package.json` da raiz define `pnpm@10.34.9` e `format:check`.
- Shell e MF_VIDEOS possuem scripts `test`, `lint` e `build`; o BFF possui `test`, `typecheck`, `build` e `dev`.
- `apps/bff/.env.example` contém `YOUTUBE_API_KEY`, `PORT`, `NODE_ENV`, `DATABASE_PATH`.
- O enunciado exige Docker, micro-frontends, rotas diretas, autenticação e testes unitários.
- **Antes do push:** verificar que a versão final publicada de `docker-compose.yaml` inclui `bff`, `shell`, `mf-drawer` e `mf-videos` e que os quatro serviços realmente sobem no Docker.
- A tela `RegisterPage.tsx` foi implementada durante a etapa final; confirmar `git status`, os testes, o commit e o push antes da entrega.

## Pré-voo: arquivos e segredos

Na raiz do projeto:

```bash
git status --short
git ls-files '*.env' '**/.env'
# Não deve haver arquivos .env com segredos versionados.

cp -n apps/bff/.env.example apps/bff/.env
# Preencha YOUTUBE_API_KEY no arquivo local se ainda não estiver configurada.

docker compose config --quiet
```

**Não execute `docker compose config` sem `--quiet` ao compartilhar logs:** o Compose pode exibir valores de segredos.

## 1. Docker e disponibilidade

```bash
docker compose up -d --build
docker compose ps
curl -fsS http://localhost:5173/api/health
curl -I http://localhost:5174/remoteEntry.js
curl -I http://localhost:5175/remoteEntry.js
```

**Esperado:** quatro serviços em execução; `bff` saudável, rota `/api/health` respondendo, `remoteEntry.js` de ambos remotes com `200`. Se o Compose mostrar apenas um serviço, confira se você está usando o arquivo atualizado com os quatro serviços.

## 2. Fluxo de cadastro e autenticação (manual)

- [ ] Abrir `http://localhost:5173/login` e clicar em **Cadastre-se**.
- [ ] Confirmar que abre `/register` e que usa `Input` para E-mail, Senha e Confirme sua senha.
- [ ] Tentar senhas diferentes e verificar **As senhas não coincidem.**.
- [ ] Tentar senha com menos de 12 caracteres e verificar bloqueio do formulário.
- [ ] Cadastrar uma conta nova e verificar retorno a `/login`.
- [ ] Entrar com a conta recém-criada e verificar acesso a `/videos`.
- [ ] Tentar cadastrar o mesmo e-mail de novo e verificar erro de conta existente.
- [ ] Abrir `/favorites` diretamente com sessão válida.
- [ ] Fazer logout e confirmar que as páginas protegidas redirecionam para o login.

## 3. Busca e persistência (manual)

- [ ] Pesquisar um termo com a chave válida da YouTube Data API.
- [ ] Reproduzir um vídeo.
- [ ] Marcar favorito e conferir contador no Drawer.
- [ ] Recarregar a página e confirmar que favoritos persistem.
- [ ] Remover favorito e conferir redução de contagem.
- [ ] Testar estado vazio dos favoritos.

## 4. Qualidade automatizada

```bash
pnpm install --frozen-lockfile
pnpm --filter shell test
pnpm --filter mf-drawer test
pnpm --filter mf-videos test
pnpm --filter @icasei/bff test
pnpm --filter shell lint
pnpm --filter mf-drawer lint
pnpm --filter mf-videos lint
pnpm --filter @icasei/bff typecheck
pnpm --filter shell build
pnpm --filter mf-drawer build
pnpm --filter mf-videos build
pnpm --filter @icasei/bff build
pnpm format:check
```

Os comandos constam de scripts do projeto; **o resultado na versão final deve ser confirmado no computador de desenvolvimento**. Um `pnpm format:check` que falhe por formatação de documentação exige ajuste ou uso de `pnpm format` para padronizar.

## 5. Critérios de publicação

- [ ] README aponta para `docs/design-visual.png`, `docs/design-reference.html`, `docs/DESIGN.md` e este checklist.
- [ ] Documentação e Docker Compose refletem os quatro serviços da versão final.
- [ ] Cadastro, testes e últimos ajustes estão commitados e enviados ao fork.
- [ ] Arquivos `.env`, chaves de API e credenciais não estão versionados.

> Observação: este checklist não declara que testes foram executados nesta revisão: a revisão conferiu arquivos e scripts do GitHub, e utilizou relatos anteriores de execução local. Os itens de navegador e Docker devem ser marcados após teste efetivo.
