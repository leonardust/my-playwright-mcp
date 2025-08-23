export const ValidationConstants = {
  ERROR_CLASS: /octavalidate-inp-error/,
  VALIDATION_ATTRIBUTE: 'octavalidate',
  VALIDATION_RULES: {
    EMAIL: 'R,EMAIL',
    ALPHA_ONLY: 'R,ALPHA_ONLY',
    SURNAME: 'R,SURNAME',
  },
} as const;
