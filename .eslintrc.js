module.exports = {
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'semi': ['error', 'always'],
    '@typescript-eslint/semi': ['error', 'always'],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false },
    }],
  },
};