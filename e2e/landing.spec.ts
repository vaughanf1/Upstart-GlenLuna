import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display main heading and navigation', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(page.getByRole('heading', { name: /discover profitable startup ideas/i })).toBeVisible()

    // Check navigation
    await expect(page.getByRole('link', { name: /idea of the day/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse ideas/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })

  test('should navigate to idea of the day', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /view today's idea/i }).first().click()
    await expect(page).toHaveURL('/idea-of-the-day')
    await expect(page.getByRole('heading', { name: /idea of the day/i })).toBeVisible()
  })

  test('should navigate to ideas catalog', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /browse all ideas/i }).first().click()
    await expect(page).toHaveURL('/ideas')
    await expect(page.getByRole('heading', { name: /startup ideas catalog/i })).toBeVisible()
  })

  test('should display feature cards', async ({ page }) => {
    await page.goto('/')

    // Check feature sections
    await expect(page.getByText(/market trends/i)).toBeVisible()
    await expect(page.getByText(/search intelligence/i)).toBeVisible()
    await expect(page.getByText(/community signals/i)).toBeVisible()
  })

  test('should display how it works section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /how it works/i })).toBeVisible()
    await expect(page.getByText(/data collection/i)).toBeVisible()
    await expect(page.getByText(/smart scoring/i)).toBeVisible()
    await expect(page.getByText(/actionable insights/i)).toBeVisible()
  })
})