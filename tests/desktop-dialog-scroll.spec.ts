import { expect, test } from '@playwright/test'

test('desktop smooth scrolling does not trap wheel scrolling inside a case file', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/lenis/)
  await page.locator('.rail-stop').nth(6).click()
  await page.locator('#main').getByRole('button', { name: 'Open origin file' }).click()
  await expect(page.locator('.dossier')).toBeVisible()
  await page.locator('.dossier-paper').hover()
  await page.mouse.wheel(0, 650)
  await expect.poll(() => page.locator('.dossier-paper').evaluate(el => el.scrollTop)).toBeGreaterThan(150)
  await page.getByRole('button', { name: 'Close case file' }).click()
  await expect(page.locator('.dossier')).not.toBeVisible()
})
