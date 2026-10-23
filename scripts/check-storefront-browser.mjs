import { chromium } from '../.local/browser-check/node_modules/playwright/index.mjs'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  // Avoid creating analytics events during smoke tests.
  await context.route('**/api/analytics', route => route.fulfill({ status: 200, body: '{}' }))
  const catalog = 'http://localhost:3100/catalogo?categoria=ternos&tipo=Heritage+Intreccio&tamanho=44'
  await page.goto(catalog)
  await page.locator('.product-card').first().waitFor()
  assert.equal(await page.locator('.product-card').count(), 3)
  const href = await page.locator('.product-card').first().getAttribute('href')
  assert.match(href, /retorno=/)
  await page.locator('.product-card').first().click()
  await page.getByRole('button', { name: 'Adicionar ao Carrinho', exact: true }).waitFor()
  const returnLink = page.getByRole('link', { name: 'Voltar ao catálogo' }).first()
  assert.equal(await returnLink.getAttribute('href'), new URL(catalog).pathname + new URL(catalog).search)
  await returnLink.click()
  await page.locator('.product-card').first().waitFor()
  assert.equal(await page.locator('select').nth(0).inputValue(), 'Heritage Intreccio')
  assert.equal(await page.locator('select').nth(1).inputValue(), '44')
  await page.locator('.product-card').first().getByRole('button').click()
  await page.getByRole('heading', { name: 'Meu Carrinho' }).waitFor()
  assert.match(await page.locator('.product-card').first().getByRole('button').innerText(), /Adicionado/)
  // Capture checkout without opening WhatsApp outside the test browser.
  await page.evaluate(() => { window.open = (url) => { window.__checkoutURL = String(url); return null } })
  await page.getByRole('button', { name: 'Finalizar via WhatsApp' }).click()
  const checkout = await page.evaluate(() => window.__checkoutURL)
  assert.match(new URL(checkout).searchParams.get('text'), /http:\/\/localhost:3100\/produto\//)
  await page.getByRole('button', { name: 'WhatsApp aberto!' }).waitFor()
  await mkdir('.local/storefront-check', { recursive: true })
  await page.screenshot({ path: '.local/storefront-check/cart-desktop.png' })
  await page.goto('http://localhost:3100/')
  await page.getByRole('heading', { name: /Vista-se com/ }).waitFor()
  assert.equal(await page.locator('link[rel="icon"]').getAttribute('href').then(href => href.startsWith('/icon.svg')), true)
  assert.equal(await page.locator('section img[src="/brand/clube-da-gravata.jpg"]').count(), 0)
  assert.equal(await page.locator('header img[src="/brand/clube-da-gravata.jpg"]').evaluate(img => img.complete && img.naturalWidth > 0), true)
  await page.screenshot({ path: '.local/storefront-check/home-desktop.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: '.local/storefront-check/home-mobile.png' })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
  assert.deepEqual(errors, [])
  console.log('Navegador: filtros preservados, Heritage disponível, adição confirmada, checkout com link, logo, ícone e layout móvel verificados.')
} finally { await browser.close() }
