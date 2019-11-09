module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['google', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'no-unused-vars': 1,
    'require-jsdoc': 0,
    'new-cap': 0,
  },
};
