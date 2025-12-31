Melhorias de responsividade — Resumo

Objetivo: melhorar a experiência em dispositivos móveis e telas pequenas.

Principais alterações:
- Adicionado layout grid responsivo em `Puzzle1` (`.puzzle1-grid`) e `aspect-ratio` nas peças para manter quadrados em telas pequenas.
- Ajustes para `Puzzle4`:
  - `.puzzle4-board-wrap` e `.puzzle4-base` agora suportam largura 100% e `max-width` para escalar corretamente.
  - O cálculo de escala (`ResizeObserver`) permanece e agora funciona melhor com as regras de CSS atualizadas.
- Confetti (`Confetti.tsx`): reduz a quantidade de partículas em telas pequenas para melhor performance.
- Pequenas correções de CSS para `container`, `header-title` e `btn-primary` em telas <= 480px.
- Adicionado teste unitário `Confetti.responsive.test.tsx` que valida comportamento de redução de peças.

Como testar localmente:
1. No diretório `site`, rode `npm install` (pode haver conflitos de dependências com React 19 / libs de teste; se ocorrer, uso `--legacy-peer-deps` ou atualizamos as libs).
2. Rode `npm run dev` e abra o site.
3. Emuladores: usar ferramentas DevTools (toggle device toolbar) para verificar quebra em 360x800 e 412x915.
4. Interaja com cada puzzle (Puzzle 1 a 5) e verifique se elementos não transbordam e são tocáveis.

Testes E2E com Playwright:
- Instale dependências: `npm install --prefix site` (se necessário: `npm install --prefix site --legacy-peer-deps`).
- Para instalar as browsers do Playwright: `npx playwright install`.
- Execute E2E: `npm run test:e2e` (vai iniciar o dev server automaticamente via config do Playwright).

Notas importantes:
- O Vite exige Node.js >= 20.19.0; você está usando 20.17.0 — recomendo atualizar Node para evitar warnings ou problemas de execução durante o desenvolvimento/E2E.
- Migrei o projeto para **React 18** e alinhei os tipos e dependências de teste para compatibilidade.
- Adicionado workflow CI (`.github/workflows/ci.yml`) que executa unit tests (Vitest) e E2E (Playwright) automaticamente em push/PR.
