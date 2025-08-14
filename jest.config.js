module.exports = {
  roots: ['<rootDir>/tests'],
  globalSetup: './jest.global-setup.js',
  globalTeardown: './jest.global-teardown.js',
  setupFilesAfterEnv: ['./jest.global-before-all.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
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

    '^#domain/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/domain/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
    '^#usecases/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/use-cases/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
    '^#infra/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/infra/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
    '^#main/(.*)$': '<rootDir>/tests/sample/todo-js-sample-with-module-aliases/main/$1', // map to solve module-alias in todo-js-sample-with-module-aliases
  },
};
