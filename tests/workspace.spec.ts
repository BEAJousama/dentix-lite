import { test, expect } from "@playwright/test";
const liteRoutes = ["/dashboard", "/patients", "/login"];
const proRoutes = [
  "/appointments",
  "/patients/sarah-johnson",
  "/dentists",
  "/staff",
  "/treatments",
  "/prescriptions",
  "/invoices",
  "/payments",
  "/messages",
  "/reports",
  "/settings/clinic",
];
test("Lite routes and Pro previews render without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [...liteRoutes, ...proRoutes]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1,h2").first()).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("Pro previews link to the same screen in the live demo", async ({
  page,
}) => {
  await page.goto("/patients/sarah-johnson");
  await expect(
    page.getByRole("link", { name: /Open in live demo/ }).first(),
  ).toHaveAttribute("href", /\/patients\/sarah-johnson$/);
  await expect(page.locator(".pro-preview img")).toBeVisible();
});
test("unknown routes still return the 404 page", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
});
test("patient search filters the directory", async ({ page }) => {
  await page.goto("/patients");
  await page.getByPlaceholder("Search patients...").fill("Sarah");
  await expect(page.locator("tbody tr")).toHaveCount(1);
});
test("the dashboard opens the booking dialog", async ({ page }) => {
  await page.goto("/dashboard");
  await page
    .getByRole("button", { name: "New appointment", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
test("command palette opens with the keyboard", async ({ page }) => {
  await page.goto("/dashboard");
  await page.keyboard.press("Control+k");
  await page.getByPlaceholder("Search your workspace...").fill("Sarah");
  await expect(
    page.getByRole("button", { name: "Sarah Johnson Patient", exact: true }),
  ).toBeVisible();
});
test("mobile pages fit the viewport and navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/dashboard", "/patients", "/appointments"]) {
    await page.goto(route);
    const size = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: window.innerWidth,
    }));
    expect(size.scroll, route).toBeLessThanOrEqual(size.width + 1);
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Patients", exact: true })
    .click();
  await expect(page).toHaveURL(/\/patients$/);
});
