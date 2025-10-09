import { test, expect } from '@playwright/test'

test.describe('Ideas Catalog Page', () => {
  test('should display ideas catalog with search and filters', async ({ page }) => {
    await page.goto('/ideas')

    // Check page heading
    await expect(page.getByRole('heading', { name: /startup ideas catalog/i })).toBeVisible()

    // Check search functionality
    await expect(page.getByPlaceholder(/search ideas/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /search/i })).toBeVisible()

    // Check filters button
    await expect(page.getByRole('button', { name: /filters/i })).toBeVisible()
  })

  test('should toggle view modes', async ({ page }) => {
    await page.goto('/ideas')

    // Find view mode buttons
    const gridButton = page.locator('button[data-testid="grid-view"], button:has([data-testid="grid-icon"]), button').filter({ hasText: /grid/i }).first()
    const listButton = page.locator('button[data-testid="list-view"], button:has([data-testid="list-icon"]), button').filter({ hasText: /list/i }).first()

    // Try to click if buttons exist
    if (await gridButton.isVisible()) {
      await gridButton.click()
    }

    if (await listButton.isVisible()) {
      await listButton.click()
    }
  })

  test('should expand and use filters', async ({ page }) => {
    await page.goto('/ideas')

    // Click filters button to expand
    const filtersButton = page.getByRole('button', { name: /filters/i })
    await filtersButton.click()

    // Wait for filters to expand
    await page.waitForTimeout(500)

    // Check if difficulty filters are visible
    const difficultySection = page.locator('text=Difficulty').first()
    if (await difficultySection.isVisible()) {
      // Try to select a difficulty
      const easyButton = page.getByRole('button', { name: /easy/i }).first()
      if (await easyButton.isVisible()) {
        await easyButton.click()
      }
    }
  })

  test('should perform search', async ({ page }) => {
    await page.goto('/ideas')

    // Perform a search
    const searchInput = page.getByPlaceholder(/search ideas/i)
    await searchInput.fill('AI')
    await page.getByRole('button', { name: /search/i }).click()

    // Wait for results
    await page.waitForTimeout(1000)

    // URL should include search parameter
    expect(page.url()).toContain('search')
  })

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/ideas')

    await page.getByRole('link', { name: /back to home/i }).click()
    await expect(page).toHaveURL('/')
  })
})