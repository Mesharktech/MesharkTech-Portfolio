import { test, expect } from '@playwright/test';

test('AI Chat widget can be opened and closed', async ({ page }) => {
  await page.goto('/');

  // The AI chat FAB should be visible
  const chatButton = page.getByRole('button', { name: 'Open Meshark AI Chat' });
  await expect(chatButton).toBeVisible();

  // Click to open
  await chatButton.click();

  // Verify chat window opens
  const chatWindow = page.getByRole('dialog', { name: 'Meshark AI Chat' });
  await expect(chatWindow).toBeVisible();

  // Verify the input is focused
  const chatInput = page.getByPlaceholder('Ask me anything...');
  await expect(chatInput).toBeVisible();

  // Send a message
  await chatInput.fill('What are your prices?');
  await chatInput.press('Enter');

  // Verify typing indicator or user message appears
  await expect(page.getByText('What are your prices?')).toBeVisible();

  // Close the chat
  const closeButton = page.getByTitle('Close');
  await closeButton.click();

  // Verify feedback screen appears before closing completely
  await expect(page.getByText('Feedback')).toBeVisible();
});
