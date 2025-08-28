import { faker } from '@faker-js/faker';
import { TestUser } from '@utils/test-types.js';

export const generateTestUser = (): TestUser => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email({ provider: 'example.com' }),
  password: 'TestPassword123!',
});

/**
 * Get test user from environment variables or generate a random one
 * Useful for testing with predefined user credentials
 */
export const getTestUser = (): TestUser => {
  const envEmail = process.env.USER_EMAIL;
  const envPassword = process.env.USER_PASSWORD;

  if (envEmail && envPassword) {
    return {
      firstName: 'Test',
      lastName: 'User',
      email: envEmail,
      password: envPassword,
    };
  }

  return generateTestUser();
};
