/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)?$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
}
