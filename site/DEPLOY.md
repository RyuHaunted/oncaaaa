# Deploy (GitHub Pages)

Este repositório usa Vite. O build de produção é gerado em `site/dist`.

Uma GitHub Action foi adicionada para buildar o site e publicar `site/dist` na branch `gh-pages` automaticamente quando houver push para `main`.

- Workflow: `.github/workflows/deploy.yml`
- Publica o conteúdo de `site/dist` na branch `gh-pages`

Se seu site estiver em `https://username.github.io/repo/`, ajuste `base: '/repo/'` em `site/vite.config.ts`.

Manual deploy (alternativa):

```bash
cd site
npm run build
npx gh-pages -d dist
```