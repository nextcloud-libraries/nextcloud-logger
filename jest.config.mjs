/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  clearMocks: true,
  preset: 'ts-jest',
  collectCoverageFrom: ['lib/**/*.ts'],
  testEnvironment: 'jsdom',
}
