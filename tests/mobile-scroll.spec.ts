import { expect, test, type Page } from '@playwright/test'

test.use({ viewport: { width: 412, height: 839 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 })

async function swipe(page: Page, x: number, fromY: number, toY: number) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: fromY }] })
  for (let i = 1; i <= 12; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: fromY + (toY - fromY) * i / 12 }] })
    await page.waitForTimeout(16)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await cdp.detach()
}

test('mobile uses native touch scrolling and case files scroll independently', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false)

  await swipe(page, 200, 360, 100)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(150)
  const beforeDialog = await page.evaluate(() => window.scrollY)

  await page.getByRole('button', { name: 'Case index' }).click()
  await page.locator('.index-file').nth(5).click()
  await expect(page.locator('.dossier')).toBeVisible()
  await expect(page.locator('.dossier')).toContainText('The Origin File')

  const box = await page.locator('.dossier-paper').boundingBox()
  expect(box).not.toBeNull()
  await swipe(page, box!.x + box!.width / 2, box!.y + box!.height * 0.72, box!.y + box!.height * 0.24)
  await expect.poll(() => page.locator('.dossier-paper').evaluate(el => el.scrollTop)).toBeGreaterThan(150)

  await page.getByRole('button', { name: 'Close case file' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(beforeDialog - 5)
  expect(await page.evaluate(() => document.body.style.position)).toBe('')
})
