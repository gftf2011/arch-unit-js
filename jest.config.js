module.exports = {
  roots: ['<rootDir>/tests'],
  globalSetup: './jest.global-setup.js',
  globalTeardown: './jest.global-teardown.js',
  setupFilesAfterEnv: ['./jest.global-before-all.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 20000,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageReporters: ['lcov', 'json', 'text', 'clover'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1',

    '^#domain1/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/domain/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
    '^#usecases1/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/use-cases/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
    '^#infra1/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/infra/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
    '^#main1/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/main/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
  },
};
