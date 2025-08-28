import { faker } from '@faker-js/faker';
import { logger } from '@utils/logger.js';
import { TestUser } from '@utils/test-types.js';

export const generateTestUser = (): TestUser => {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: 'example.com' }),
    password: 'TestPassword123!',
  };

  logger.log('test', `Test user generated: ${user.email}`);
  return user;
};

/**
 * Get test user from environment variables or generate a random one
 * Useful for testing with predefined user credentials
 */
export const getTestUser = (): TestUser => {
  const envEmail = process.env.USER_EMAIL;
  const envPassword = process.env.USER_PASSWORD;

  if (envEmail && envPassword) {
    const user = {
      firstName: 'Test',
      lastName: 'User',
      email: envEmail,
      password: envPassword,
    };
    logger.log('test', `Using environment test user: ${user.email}`);
    return user;
  }

  return generateTestUser();
};
