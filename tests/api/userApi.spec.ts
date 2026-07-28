import { test, expect } from '../../factories/pageFactory';

test.describe('API Layer Suite', () => {

  test('Verify User Endpoint fetching', async ({ apiClient }) => {
    const user = await apiClient.getUserById(2);
    expect(user.id).toBe(2);
  });

});