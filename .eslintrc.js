// http://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: ['eslint:recommended', 'standard', 'plugin:flowtype/recommended'],
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  // required to lint *.vue files
  plugins: [
    'flowtype',
    'html'
  ],
  env: {
    browser: true,
    mocha: true
  },
  globals: {
    expect: true,
    sinon: true,
    path: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
