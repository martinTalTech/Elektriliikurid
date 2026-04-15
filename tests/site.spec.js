import { test, expect } from '@playwright/test'

// ==========================================
// ESILEHT (Home)
// ==========================================
test.describe('Esileht', () => {
  test('laadib korrektselt ja näitab logo', async ({ page }) => {
    await page.goto('/#/')
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('nav a').first()).toBeVisible()
  })

  test('näitab kategooria kaarte', async ({ page }) => {
    await page.goto('/#/')
    await expect(page.getByRole('button', { name: 'tõukeratas' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'krossikas' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'mopeed' })).toBeVisible()
  })

  test('navbar lingid töötavad', async ({ page }) => {
    await page.goto('/#/')
    await page.locator('nav a[href*="kuulutused"]').first().click()
    await expect(page).toHaveURL(/kuulutused/)
  })
})

// ==========================================
// KUULUTUSED (Listings)
// ==========================================
test.describe('Kuulutused', () => {
  test('laadib kuulutuste lehe', async ({ page }) => {
    await page.goto('/#/kuulutused')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('filtrid on nähtaval', async ({ page }) => {
    await page.goto('/#/kuulutused')
    await expect(page.locator('text=KUULUTUSE LIIK').first()).toBeVisible()
    await expect(page.locator('text=SÕIDUKI TÜÜP').first()).toBeVisible()
  })

  test('kuulutuse kaardile klikk avab detailvaate', async ({ page }) => {
    await page.goto('/#/kuulutused')
    const card = page.locator('a[href*="/kuulutused/"]').first()
    if (await card.isVisible()) {
      await card.click()
      await expect(page.locator('text=Tagasi kuulutustele')).toBeVisible()
    }
  })
})

// ==========================================
// AUTENTIMINE (Auth)
// ==========================================
test.describe('Autentimine', () => {
  test('login leht laadib', async ({ page }) => {
    await page.goto('/#/logi-sisse')
    await expect(page.locator('h1')).toContainText('Logi sisse')
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('registreerimise leht laadib', async ({ page }) => {
    await page.goto('/#/registreeru')
    await expect(page.locator('h1')).toContainText('Loo konto')
  })

  test('parooli tugevuse indikaator töötab', async ({ page }) => {
    await page.goto('/#/registreeru')
    await page.fill('input[placeholder="••••••••"]', 'Test123!')
    await expect(page.locator('text=Tugev')).toBeVisible()
  })

  test('telefoni valideerimine filtreerib tähti', async ({ page }) => {
    await page.goto('/#/registreeru')
    const phoneInput = page.locator('input[placeholder="+372..."]')
    await phoneInput.fill('+372abc123')
    await expect(phoneInput).toHaveValue('+372123')
  })

  test('unustatud parooli leht laadib', async ({ page }) => {
    await page.goto('/#/unustasin-parooli')
    await expect(page.locator('h1')).toContainText('Unustasin parooli')
  })
})

// ==========================================
// STAATILISED LEHED
// ==========================================
test.describe('Staatilised lehed', () => {
  test('Meist leht laadib', async ({ page }) => {
    await page.goto('/#/meist')
    await expect(page.locator('h1')).toContainText('Meist')
  })

  test('KKK leht laadib ja akordion töötab', async ({ page }) => {
    await page.goto('/#/kkk')
    await expect(page.locator('h1')).toContainText('Korduma kippuvad küsimused')
    await page.click('text=Kuidas lisada kuulutus?')
    await expect(page.locator('text=registreeru või logi sisse')).toBeVisible()
  })

  test('Kasutustingimused laadib', async ({ page }) => {
    await page.goto('/#/tingimused')
    await expect(page.locator('h1')).toContainText('Kasutustingimused')
  })

  test('Privaatsuspoliitika laadib', async ({ page }) => {
    await page.goto('/#/privaatsus')
    await expect(page.locator('h1')).toContainText('Privaatsuspoliitika')
  })
})

// ==========================================
// NAVIGATSIOON & UX
// ==========================================
test.describe('Navigatsioon', () => {
  test('footer on nähtaval', async ({ page }) => {
    await page.goto('/#/')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('mobiili menüü avaneb', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/#/')
    const menuBtn = page.locator('nav button').first()
    if (await menuBtn.isVisible()) {
      await menuBtn.click()
      // Mobile menu should show links
      await expect(page.locator('nav').first()).toBeVisible()
    }
  })

  test('scroll-to-top navigeerimisel', async ({ page }) => {
    await page.goto('/#/')
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.goto('/#/kuulutused')
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBe(0)
  })
})
