<div align="center">
  <h1 style="font-size:4.5rem;"> ArchUnit JS</h1>
</div>

<br/>

<div align="center">
  <a href="#page_facing_up-about">About</a> •
  <a href="#hammer_and_wrench-supported-os">Supported OS</a> • 
  <a href="#ledger-features">Features</a> •
  <a href="#racing_car-getting-started">Getting Started</a> •
  <a href="#notebook-api-documentation">API Documentation</a> •
  <a href="#memo-license">License</a>
</div>

<br/>

<div align="center">
  <img src="https://github.com/gftf2011/clean-node-todolist/blob/main/.github/images/background.png" alt="Banner" style="max-width: 100%; height: auto;" />
</div>

<div align="center">
  <a href='https://coveralls.io/github/gftf2011/arch-unit-js?branch=dev'><img src='https://coveralls.io/repos/github/gftf2011/arch-unit-js/badge.svg?branch=dev' alt='Coverage Status' /></a>
  <img src='https://sonarcloud.io/api/project_badges/measure?project=gftf2011_arch-unit-js&metric=alert_status' alt='Quality Gate Status' />
  <a href="https://github.com/gftf2011/arch-unit-js/actions" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/gftf2011/arch-unit-js/actions/workflows/merge-main.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://eslint.org/">
    <img src="https://img.shields.io/badge/ESLint-configured-blue?logo=eslint" alt="ESLint" />
  </a>
  <a href="https://prettier.io/">
    <img src="https://img.shields.io/badge/Prettier-configured-ff69b4?logo=prettier" alt="Prettier" />
  </a>
  <a href="https://www.npmjs.com/package/arch-unit-js">
    <img src="https://img.shields.io/npm/v/arch-unit-js.svg" alt="npm version" />
  </a>
</div>

<br/>

## :page_facing_up: About

A JavaScript/TypeScript library for enforcing architectural rules and constraints in your codebase. Inspired by ArchUnit for Java, this tool provides a fluent API to define and validate architectural boundaries, naming conventions, and dependency rules. It is agnostic about the testing framework and supports for several OS systems !

> **Note**: Backend-focused (frontend support coming soon).

> **Note**: TC39 Decorators Proposal (support coming soon).

<br/>

## :hammer_and_wrench: Supported OS

- [x] Mac OS
- [x] Linux
- [x] Windows

<br/>

## :ledger: Features

- **Dependency Rules**: Control which modules can depend on others (`dependsOn`, `onlyDependsOn`)
- **Naming Conventions**: Enforce consistent file naming patterns (`haveName`, `onlyHaveName`)
- **Code Metrics**: Validate lines of code thresholds (`haveLocLessThan`, `haveLocGreaterThan`)
- **Project Metrics**: Validate code project percentage thresholds (`haveTotalProjectCodeLessThan`, `haveTotalProjectCodeLessOrEqualThan`)
- **Cycle Detection**: Prevent circular dependencies (`shouldNot.haveCycles`)
- **Fluent API**: Intuitive, readable syntax for defining architectural rules

<br/>

## :racing_car: Getting Started

> ### Installation

Install using **npm**

```bash
npm install --save-dev arch-unit-js
```

> ### JavaScript - (Basic Scenario)

Let's get started by writing a simple function that generates a **UUID** using the lib _uuid_. First, create a `uuid.js` file, inside a `utils` directory:

```javascript
// file path: ./utils/uuid.js
const { v4 as uuidv4 } = require('uuid');

export function generateUUID() {
  return uuidv4();
}
```

Then create a test file `utils-arch.spec.js` in a `tests` directory, where we are going to test that all files inside the `utils` directory should have the _uuid_ lib inside:

```javascript
// file path: ./tests/utils-arch.spec.js
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'], // Positive Glob pattern, where you specify all extension types your application has
  includeMatcher: ['<rootDir>/**'], // Positive Glob pattern, where you specify all files and directories based on the project <rootDir>
  ignoreMatcher: ['!**/node_modules/**'], // (Optional) - Negative Glob pattern, where you specify all files and directories you do NOT want to check
};

// We are using Jest, but you can use any other testing library
describe('Architecture Test', () => {
  it('"./utils/uuid.js" file should depend on "uuid" lib', async () => {
    await app(options).projectFiles().inDirectory('**/utils/**').should().dependsOn('uuid').check(); // No need to expect, if the dependency is not found it throws an error
  });
});
```

Now run the test and congrats 🥳, you just tested your application topology !

> #### `module-alias`
>
> `arch-unit-js` also provides support for applications which still use `module-alias@2.x.x` with the next example !

Create a file `register.js` , in the root of your project, function which calls the `module-alias` first:

```javascript
// file path: ./register.js
'use strict';

const path = require('path');
const moduleAlias = require('module-alias');
const baseDir = __dirname;

moduleAlias.addAliases({
  '#domain': path.join(baseDir, 'domain'),
  '#usecases': path.join(baseDir, 'use-cases'),
});
```

Now let's create a simple `domain` layer in a directory with a file `user.js`:

```javascript
// file path: ./domain/user.js
export class User {
  constructor(id, name) {}
}
```

To use the `domain` layer, create the `use-cases` layer within a directory with the same name, with a file called `create-user.js`:

```javascript
// file path: ./use-cases/create-user.js
const { User } = require('#domain/user');

const createUserUseCase = () => new User(1, 'Roko');
```

Now, let's test if `create-user.js` does depends on the `#domain` layer, create a `tests` directory and inside create a `arch-use-case.test.js` file.

```javascript
// file path: ./tests/arch-use-case.test.js
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'], // Positive Glob pattern, where you specify all extension types your application has
  includeMatcher: ['<rootDir>/**'], // Positive Glob pattern, where you specify all files and directories based on the project <rootDir>
  ignoreMatcher: ['!**/node_modules/**'], // (Optional) - Negative Glob pattern, where you specify all files and directories you do NOT want to check
};

// We are using Jest, but you can use any other testing library
describe('Architecture Test', () => {
  beforeAll(() => {
    require('../register'); // calls the `module-alias` and stores the alias in the node Modules package
  });

  it('"./createUserUseCase.js" file should depend on "#domain"', async () => {
    await app(options)
      .projectFiles()
      .inFile('**/usecases/create-user.js')
      .should()
      .dependsOn('**/domain/**')
      .check(); // No need to expect, if the dependency is not found it throws an error
  });
});
```

And there you have it congrats again 🥳 , you successfully tested your project dependencies which uses `module-alias` !

> ### TypeScript - (Basic Scenario)

`arch-unit-js` also provides support for `typescript`. To include `typescript` support just provide the path to your **tsconfig.json** using the "_typescriptPath_"

```typescript
import { Options } from 'arch-unit-js';

const options: Options = {
  extensionTypes: ['**/*.ts'], // Positive Glob pattern, where you specify all extension types your application has
  includeMatcher: ['<rootDir>/**'], // Positive Glob pattern, where you specify all files and directories based on the project <rootDir>
  typescriptPath: '<rootDir>/tsconfig.json', // Path to project 'tsconfig.json' - (using <rootDir> as wildcard)
};
```

<br/>

## :notebook: API Documentation

## `app(options)`

When checking your architecture you need to test against your application and some of them have different folder structures. And here's where `app` comes to play.

The initial `app` API is the representation of your application and to define which files compose your application, you can use as parameter the 'options' to compose your application.
```javascript
const { app } = require('arch-unit-js');

app({
  extensionTypes: ['**/*.js'], // Required
  includeMatcher: ['<rootDir>/**'], // Required
  ignoreMatcher: ['!**/node_modules/**'], // Optional
  typescriptPath: '<rootDir>/tsconfig.json' // Optional
});
```

The 'options' parameter is an object which has:
- The `extensionTypes` which is a `string[]` of glob patterns, representing the allowed extensions which compose your project files
- The `includeMatcher` which is a `string[]` of glob patterns, representing the source directories of your application
- The `ignoreMatcher` which is a `string[]` of glob patterns, representing the resources you want to ignore
- The `typescriptPath` which is a path like `string`, representing the path to your `typescript` config file

> **Note**: All the patterns passed to the `ignoreMatcher` must have a `!` , which indicates the given pattern must be ignored from the application !

## Globals

### `projectFiles()`

`projectFiles()` is the function used every time you want to make a broad test against your project structure. You will use it alongside with a "selector" to choose the files location which will be checked by a "matcher" !

To understand better, let's use an example, where you want to test to check if a file `stringUtils.js` has less than 50 L.O.C. - (Lines Of Code). Here's how to start.
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"**/stringUtils.js" file should have less than 50 - L.O.C.', async () => {
    await app(options)
      .projectFiles()
      .inFile('**/stringUtils.js')
      .should()
      .haveLocLessThan(50)
      .check();
});
```

In this case we have the `inFile` as the "selector" which selects the files which will be tested by the "matcher" , in this case we are only targeting `stringUtils.js`. Then we have the `should` which is a "modifier" which indicates it is a positive test done by the "matcher". And finally there is the `haveLocLessThan` which is the "matcher" whose going to test if the selected files match the criteria !

## Selectors

### `inDirectories(pattern: string[], excludePattern?: string[])`

Use the `inDirectories` to select different files from multiple directories within your project. The "selectors" chains with the "modifiers" to indicate which will be the "matcher" behavior.

Let's say we have an application and we have the directories `**/infra/repositories/**` & `**/infra/providers/**`. We want to enforce the files inside this folders contains only very specific dependencies which are the `mysql2` & `crypto`.
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"**/infra/repositories/**" & "**/infra/providers/**" should only depends on "mysql2" & "crypto"', async () => {
    await app(options)
      .projectFiles()
      .inDirectories(['**/infra/repositories/**', '**/infra/providers/**'])
      .should()
      .onlyDependsOn(['mysql2', 'crypto'])
      .check();
});
```

Now, let's imagine the structure from the selected directories changed, and now they use _barrel exports_ which means both have now an `index.js` file exporting all the files.

But the `index.js` does not comply with the checking "matcher" rule. For this scenario the `inDirectories` has a second parameter which is used to exclude files and folders you don't want to be checked by the "matcher".
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"**/infra/repositories/**" & "**/infra/providers/**" should only depends on "mysql2" & "crypto" , excluding "**/infra/**/index.js"', async () => {
    await app(options)
      .projectFiles()
      .inDirectories(['**/infra/repositories/**', '**/infra/providers/**'], ['!**/infra/**/index.js'])
      .should()
      .onlyDependsOn(['mysql2', 'crypto'])
      .check();
});
```

> **Note**: All the patterns passed to the `excludePattern` must have a `!` , which indicates the given pattern must be excluded from the "matcher" check !

### `inDirectory(pattern: string, excludePattern?: string[])`

Use the `inDirectory` to select different files from a single directory within your project. It's behavior is the same as the one described for the `inDirectories` selector, with the exception the `pattern` parameter is a single `string`.

To ilustrate it's behavior let's use an example where we are going to have again a directory `**/infra/repositories/**` and we want to test it it's files use the `mysql2`, but to make interesting the files implementation are using `mysql2/promise` now.
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"**/infra/repositories/**" should depends on "mysql2/**"', async () => {
    await app(options)
      .projectFiles()
      .inDirectory('**/infra/repositories/**')
      .should()
      .dependsOn('mysql2/**')
      .check();
});
```

Just like the previous example, let's imagine the structure from the selected directory changed, and now uses _barrel exports_ which means it has an `index.js` file exporting all the other files.
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"**/infra/repositories/**" should depends on "mysql2/*" , excluding "**/infra/repositories/**/index.js"', async () => {
    await app(options)
      .projectFiles()
      .inDirectory('**/infra/repositories/**', ['!**/infra/repositories/**/index.js'])
      .should()
      .dependsOn('mysql2/**')
      .check();
});
```

### `inFiles(pattern: string[])` - (Coming Soon)

### `inFile(pattern: string)`

Use the `inFile` to select different files OR a single file within your project. This selector is focused in selecting specific files or single file which match the pattern only, providing better semantics towards the test itself.

To ilustrate it's behavior let's use an example where we want to check if a file `**/domain/entities/address.entity.js` has more than 80 - L.O.C. - (Lines Of Code).
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"**/domain/entities/address.entity.js" should have more than 80 - L.O.C.', async () => {
    await app(options)
      .projectFiles()
      .inFile('**/domain/entities/address.entity.js')
      .should()
      .haveLocGreaterThan(80)
      .check();
});
```

## Modifiers

### `should()`

Use the `should` modifier to indicate to "arch-unit-js" what the "matcher" should test. It chains with the "matcher" to indicate how the selected files will be checked !

We can use the another example, where we want all the files in a directory "utils" should match the name _`*.utils.js`_.
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"utils" directory should have all files matching the name "*.utils.js"', async () => {
    await app(options)
      .projectFiles()
      .inDirectory('**/utils/**')
      .should()
      .haveName('*.utils.js')
      .check();
});
```

### `shouldNot()`

The `shouldNot` modifier indicates the opposite of `should` , so it is a negative test modifier which tells the "matcher" the selected files should not match the checked pattern.

The code below test if a file `numberUtils.js` has 50 L.O.C. or more.
```javascript
const { app } = require('arch-unit-js');

const options = {
  extensionTypes: ['**/*.js'],
  includeMatcher: ['<rootDir>/**']
};

it('"**/numberUtils.js" file should have less than 50 - L.O.C.', async () => {
    await app(options)
      .projectFiles()
      .inFile('**/numberUtils.js')
      .shouldNot()
      .haveLocLessThan(50)
      .check();
});
```

By using the `shouldNot` "modifier" the "matcher" behave was modified to check if the selected files had a L.O.C. greater or equal than the specified value !

## :memo: License

This project is under MIT license. See the [LICENSE](LICENSE) file for more details.

---

Made with lots of 🔥🔥🔥 by [Gabriel Ferrari Tarallo Ferraz](https://www.linkedin.com/in/gabriel-ferrari-tarallo-ferraz/)
