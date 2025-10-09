import { test, expect } from '@playwright/test'

test.describe('Idea of the Day Page', () => {
  test('should display idea of the day', async ({ page }) => {
    await page.goto('/idea-of-the-day')

    // Check page heading
    await expect(page.getByRole('heading', { name: /idea of the day/i })).toBeVisible()

    // Check navigation
    await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse all ideas/i })).toBeVisible()
  })

  test('should display idea details if available', async ({ page }) => {
    await page.goto('/idea-of-the-day')

    // Wait for content to load
    await page.waitForTimeout(1000)

    // Should either show an idea or a "no idea" message
    const hasIdea = await page.getByRole('heading', { level: 3 }).first().isVisible()
    const noIdea = await page.getByText(/no idea available today/i).isVisible()

    expect(hasIdea || noIdea).toBe(true)

    if (hasIdea) {
      // If there's an idea, check for expected elements
      await expect(page.locator('[data-testid="score-badge"], .score-badge, .badge').first()).toBeVisible()
      await expect(page.getByRole('button', { name: /bookmark/i })).toBeVisible()
    }
  })

  test('should have functional navigation links', async ({ page }) => {
    await page.goto('/idea-of-the-day')

    // Test back to home link
    await page.getByRole('link', { name: /back to home/i }).click()
    await expect(page).toHaveURL('/')

    // Go back to idea of the day
    await page.goto('/idea-of-the-day')

    // Test browse all ideas link
    await page.getByRole('link', { name: /browse all ideas/i }).click()
    await expect(page).toHaveURL('/ideas')
  })
})