export interface TenantSettings {
  tenantId: string;
  baseUrl: string;
  apiBaseUrl: string;
  enableDiscountModule: boolean;
}

export const TENANTS: Record<string, TenantSettings> = {
  tenantA: {
    tenantId: 'tenantA',
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    enableDiscountModule: false,
  },
  tenantB: {
    tenantId: 'tenantB',
    baseUrl: 'https://app-tenantb.com',
    apiBaseUrl: 'https://reqres.in/api',
    enableDiscountModule: true,
  },
};