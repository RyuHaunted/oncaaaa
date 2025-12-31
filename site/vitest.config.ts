import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.ts',
    exclude: ['tests/e2e/**'],
    testTimeout: 10000
  }
})
