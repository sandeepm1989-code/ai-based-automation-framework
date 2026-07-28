import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 30 * 1000,
  fullyParallel: true,
  workers: 2,
  reporter: [
    ['line'],
    ['allure-playwright', { outputFolder: './reports/allureReports' }],
    ['html', { outputFolder: './reports/htmlReports', open: 'never' }],
    ['monocart-reporter', {name: 'InfraInsure Automation Execution Report', outputFile: '.reports/monocartReports/index.html'}]
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'codex-based-framework',
      use: { ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});
