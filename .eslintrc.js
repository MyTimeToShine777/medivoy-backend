module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'warn',
    'consistent-return': 'warn',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'max-len': ['warn', { code: 120 }],
    'no-await-in-loop': 'off',
    'camelcase': 'warn',
  },
};