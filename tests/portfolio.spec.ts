import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => { await page.addInitScript(() => localStorage.setItem('dn-motion', 'off')) })

test('room loads, camera rail moves, VALVIX dossier opens', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/')
  await expect(page.getByRole('heading', { name: 'THE BUILDER’S ROOM' })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
  await page.locator('.rail-stop').nth(4).click()
  await expect(page.getByRole('heading', { name: 'VALVIX', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Open studio manifest' }).click()
  await expect(page.locator('.dossier')).toBeVisible()
  await expect(page.locator('.dossier')).toContainText('10+ Android apps')
  await page.getByRole('button', { name: 'Close case file' }).click()
  await page.getByRole('button', { name: 'Case index' }).click()
  await expect(page.locator('.case-index')).toBeVisible()
  await page.locator('.index-move').nth(1).click()
  await expect(page.getByRole('heading', { name: 'AIOS', exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('mobile room has no horizontal overflow and case index works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  await page.getByRole('button', { name: 'Case index' }).click()
  await page.locator('.index-file').nth(4).click()
  await expect(page.locator('.dossier')).toContainText('VALVIX')
})

test('reduced motion keeps room and files usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/')
  await expect(page.getByRole('button', { name: 'Motion off' })).toBeVisible()
  await page.locator('#main').getByRole('button', { name: 'Subject profile' }).click()
  await expect(page.locator('.dossier')).toContainText('Dominal')
})

test('after contact, scroll reveals origin file and capability map', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/')
  await page.locator('.rail-stop').nth(5).click()
  await expect(page.getByRole('heading', { name: 'LET’S BUILD THE NEXT SYSTEM.' })).toBeVisible()
  await page.getByRole('button', { name: 'My journey' }).click()
  await expect(page.getByRole('heading', { name: 'THE ORIGIN FILE.' })).toBeVisible()
  await page.locator('#main').getByRole('button', { name: 'Open origin file' }).click()
  await expect(page.locator('.dossier')).toContainText('Web development')
  await expect(page.locator('.dossier')).toContainText('Agentic AI')
  await page.getByRole('button', { name: 'Close case file' }).click()
  await page.locator('.rail-stop').nth(7).click()
  await expect(page.getByRole('heading', { name: 'ONE BUILDER. END-TO-END.' })).toBeVisible()
  await page.locator('#main').getByRole('button', { name: 'Open capability map' }).click()
  await expect(page.locator('.dossier')).toContainText('Servers / data')
})
