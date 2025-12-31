import { test, expect } from '@playwright/test'

test.describe('Responsividade básica', () => {
  test('container não ultrapassa viewport em mobile', async ({ page, browserName }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 360, height: 800 })
    const container = page.locator('.container')

    await expect(container).toBeVisible()

    const box = await container.boundingBox()
    const vp = await page.viewportSize()
    if (box && vp) {
      expect(box.width).toBeLessThanOrEqual(vp.width + 1)
    }
  })

  test('componentes principais visíveis em desktop', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.locator('.header-title')).toBeVisible()
    await expect(page.locator('.puzzle1-grid')).toBeVisible()
  })
})