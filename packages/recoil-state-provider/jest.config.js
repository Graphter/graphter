module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
  },
  unmockedModulePathPatterns: [
  ],
  snapshotSerializers: [

  ],
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  testPathIgnorePatterns: ['node_modules']
};