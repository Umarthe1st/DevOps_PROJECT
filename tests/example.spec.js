// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Reservation Frontend', () => {
  let baseUrl;

  test.beforeAll(async ({ request }) => {
    // Start the server and get the base URL
    baseUrl = 'http://localhost:5050'; // Replace with your dynamic server setup logic
  });

  test.afterAll(async ({ request }) => {
    // Stop the server
    console.log('Stopping the server...');
    // Add server shutdown logic here
  });

  test('should view all reservations', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);
    // Add assertions or actions for verifying reservations list
    const reservations = await page.locator('#tableContent');
    await expect(reservations).toBeVisible();
  });  

  test('should display an error if any field is empty', async ({ page }) => {
    await page.goto(baseUrl);

    // Edit button
    await page.locator('button.btn-warning:has-text("Edit")').last().click();

    // Clear fields
    await page.fill('#editName', '');
    await page.fill('#editLocation', '');
    await page.fill('#editGuests', '');
    await page.fill('#editContact', '');

    // Click update button
    await page.click('#updateButton');

    // Assert error message
    const message = page.locator('#editMessage');
    await expect(message).toContainText('All fields are required!');
    await expect(message).toHaveClass(/text-danger/);
  });

  test('should display an error if the contact number is less than 8 characters', async ({ page }) => {
    await page.goto(baseUrl);

    // Edit button
    await page.locator('button.btn-warning:has-text("Edit")').last().click();

    // Enter invalid contact
    await page.fill('#editContact', '12345');

    // Click update button
    await page.click('#updateButton');

    // Assert error message
    const message = page.locator('#editMessage');
    await expect(message).toContainText('Contact number must be at least 8 digits!');
    await expect(message).toHaveClass(/text-danger/);
  });
});

test.describe('Reservation Frontend', () => {
  let baseUrl;

  test.beforeAll(async ({ request }) => {
    // Start the server and get the base URL
    baseUrl = 'http://localhost:5050'; // Replace with your dynamic server setup logic
  });

  test.afterAll(async ({ request }) => {
    // Stop the server
    console.log('Stopping the server...');
    // Add server shutdown logic here
  });

  test('should delete a reservation', async ({ page }) => {
    await page.goto(baseUrl);

    // Click delete button
    await page.locator('button.btn-danger:has-text("Delete")').last().click();

    // Verify deletion
    await expect(page.locator('#tableContent')).not.toContainText('Updated Reservation');
  });


})