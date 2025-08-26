import { faker } from '@faker-js/faker';
import { TestUser } from '@utils/test-types.js';

export const generateTestUser = (): TestUser => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email({ provider: 'example.com' }),
  password: 'TestPassword123!',
});
