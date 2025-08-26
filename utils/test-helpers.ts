import { TestUser } from '@utils/test-types.js';

export const randomString = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(
    ''
  );
};

export const uniqueEmail = (): string => {
  const timestamp = Date.now();
  const localPart = `test${timestamp}${randomString(5)}`;
  return `${localPart}@example.com`;
};

export const generateTestUser = (): TestUser => ({
  firstName: randomString(6),
  lastName: randomString(6),
  email: uniqueEmail(),
  password: 'TestPassword123!',
});
