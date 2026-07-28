import { test, expect } from '../../factories/pageFactory';

test.describe('Database Layer Suite', () => {

  test('Verify policy status in DB', async ({ dbClient }) => {
    const policy = await dbClient.getPolicyDetails('POL-101');
    expect(policy).toBeDefined();
    expect(policy.status).toBe('ACTIVE');
  });

});