import * as dotenv from 'dotenv';
dotenv.config();

export interface GlobalConfig {
  environment: 'qa' | 'staging' | 'prod';
  browser: 'chrome' | 'firefox' | 'webkit';
  tenant: string;
  dbHost: string;
  dbPort: number;
}

export const getGlobalConfig = (): GlobalConfig => ({
  environment: (process.env.TEST_ENV as any) || 'qa',
  browser: (process.env.BROWSER as any) || 'chrome',
  tenant: process.env.TENANT || 'tenantA', // Default Tenant
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT) || 5432,
});