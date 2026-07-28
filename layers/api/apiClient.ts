import { APIRequestContext, expect } from '@playwright/test';

export class apiClient {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async getUserById(userId: number) {
    const response = await this.request.get(`${this.baseUrl}/users/${userId}`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async createPolicyQuote(payload: object) {
    const response = await this.request.post(`${this.baseUrl}/posts`, {
      data: payload,
    });
    expect(response.status()).toBe(201);
    return await response.json();
  }
}