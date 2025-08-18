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

> **Note**: TC39 Proposal (decorators support coming soon).

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
    await app(options).projectFiles().inFile('**/usecases/create-user.js').should().dependsOn('**/domain/**').check(); // No need to expect, if the dependency is not found it throws an error
  });
});
```

And there you have it congrats again 🥳 , you successfully tested your project dependencies which uses `module-alias` !

<br/>

## :notebook: API Documentation

> ### "projectFiles"

<details>
  <summary><b>"inDirectories" API Docs</b></summary>

- [Project Files in Directories Should NOT Depend On Specified Patterns](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_dependsOn_check.md)
- [Project Files in Directories Should NOT Have Cycles](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_haveCycles_check.md)
- [Project Files in Directories Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_haveLocGreaterOrEqualThan_check.md)
- [Project Files in Directories Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_haveLocGreaterThan_check.md)
- [Project Files in Directories Should NOT Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_haveLocLessOrEqualThan_check.md)
- [Project Files in Directories Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_haveLocLessThan_check.md)
- [Project Files in Directories Should NOT Have Name with Specified Pattern](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_haveName_check.md)
- [Project Files in Directories Should NOT Only Depend On Specified Patterns](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_onlyDependsOn_check.md)
- [Project Files in Directories Should NOT Only Have Name with Specified Pattern](business/inDirectories/shouldNot/projectFiles_inDirectories_shouldNot_onlyHaveName_check.md)
- [Project Files in Directories Should Depend On Specified Patterns](business/inDirectories/should/projectFiles_inDirectories_should_dependsOn_check.md)
- [Project Files in Directories Should Have Cycles](business/inDirectories/should/projectFiles_inDirectories_should_haveCycles_check.md)
- [Project Files in Directories Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/should/projectFiles_inDirectories_should_haveLocGreaterOrEqualThan_check.md)
- [Project Files in Directories Should Have Greater L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/should/projectFiles_inDirectories_should_haveLocGreaterThan_check.md)
- [Project Files in Directories Should Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/should/projectFiles_inDirectories_should_haveLocLessOrEqualThan_check.md)
- [Project Files in Directories Should Have Less L.O.C. (Lines Of Code) Than Specified Value](business/inDirectories/should/projectFiles_inDirectories_should_haveLocLessThan_check.md)
- [Project Files in Directories Should Have Name with Specified Pattern](business/inDirectories/should/projectFiles_inDirectories_should_haveName_check.md)
- [Project Files in Directories Should Only Depend On Specified Patterns](business/inDirectories/should/projectFiles_inDirectories_should_onlyDependsOn_check.md)
- [Project Files in Directories Should Only Have Name with Specified Pattern](business/inDirectories/should/projectFiles_inDirectories_should_onlyHaveName_check.md)

</details>

<details>
  <summary><b>"inDirectory" API Docs</b></summary>

- [Project Files in Directory Should NOT Depend On Specified Patterns](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_dependsOn_check.md)
- [Project Files in Directory Should NOT Have Cycles](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_haveCycles_check.md)
- [Project Files in Directory Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_haveLocGreaterOrEqualThan_check.md)
- [Project Files in Directory Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_haveLocGreaterThan_check.md)
- [Project Files in Directory Should NOT Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_haveLocLessOrEqualThan_check.md)
- [Project Files in Directory Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_haveLocLessThan_check.md)
- [Project Files in Directory Should Not Have Name with Specified Pattern](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_haveName_check.md)
- [Project Files in Directory Should NOT Only Depend On Specific Patterns](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_onlyDependsOn_check.md)
- [Project Files in Directory Should NOT Only Have Names with Specified Pattern](business/inDirectory/shouldNot/projectFiles_inDirectory_shouldNot_onlyHaveName_check.md)
- [Project Files in Directory Should Depend On Specified Patterns](business/inDirectory/should/projectFiles_inDirectory_should_dependsOn_check.md)
- [Project Files in Directory Should Have Cycles](business/inDirectory/should/projectFiles_inDirectory_should_haveCycles_check.md)
- [Project Files in Directory Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/should/projectFiles_inDirectory_should_haveLocGreaterOrEqualThan_check.md)
- [Project Files in Directory Should Have Greater L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/should/projectFiles_inDirectory_should_haveLocGreaterThan_check.md)
- [Project Files in Directory Should Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/should/projectFiles_inDirectory_should_haveLocLessOrEqualThan_check.md)
- [Project Files in Directory Should Have Less L.O.C. (Lines Of Code) Than Specified Value](business/inDirectory/should/projectFiles_inDirectory_should_haveLocLessThan_check.md)
- [Project Files in Directory Should Have Name with Specified Pattern](business/inDirectory/should/projectFiles_inDirectory_should_haveName_check.md)
- [Project Files in Directory Should Only Depend On Specified Patterns](business/inDirectory/should/projectFiles_inDirectory_should_onlyDependsOn_check.md)
- [Project Files in Directory Should Only Have Name with Specified Pattern](business/inDirectory/should/projectFiles_inDirectory_should_onlyHaveName_check.md)

</details>

<details>
  <summary><b>"inFile" API Docs</b></summary>

- [Project Files in File Should NOT Depend On Specified Patterns](business/inFile/shouldNot/projectFiles_inFile_shouldNot_dependsOn_check.md)
- [Project Files in File Should NOT Have Cycles](business/inFile/shouldNot/projectFiles_inFile_shouldNot_haveCycles_check.md)
- [Project Files in File Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inFile/shouldNot/projectFiles_inFile_shouldNot_haveLocGreaterOrEqualThan_check.md)
- [Project Files in File Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value](business/inFile/shouldNot/projectFiles_inFile_shouldNot_haveLocGreaterThan_check.md)
- [Project Files in File Should NOT Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inFile/shouldNot/projectFiles_inFile_shouldNot_haveLocLessOrEqualThan_check.md)
- [Project Files in File Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value](business/inFile/shouldNot/projectFiles_inFile_shouldNot_haveLocLessThan_check.md)
- [Project Files in File Should NOT Have Name with Specified Pattern](business/inFile/shouldNot/projectFiles_inFile_shouldNot_haveName_check.md)
- [Project Files in File Should NOT Only Depend On Specified Patterns](business/inFile/shouldNot/projectFiles_inFile_shouldNot_onlyDependsOn_check.md)
- [Project Files in File Should NOT Only Have Name with Specified Pattern](business/inFile/shouldNot/projectFiles_inFile_shouldNot_onlyHaveName_check.md)
- [Project Files in File Should Depend On Specified Patterns](business/inFile/should/projectFiles_inFile_should_dependsOn_check.md)
- [Project Files in File Should Have Cycles](business/inFile/should/projectFiles_inFile_should_haveCycles_check.md)
- [Project Files in File Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inFile/should/projectFiles_inFile_should_haveLocGreaterOrEqualThan_check.md)
- [Project Files in File Should Have Greater L.O.C. (Lines Of Code) Than Specified Value](business/inFile/should/projectFiles_inFile_should_haveLocGreaterThan_check.md)
- [Project Files in File Should Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](business/inFile/should/projectFiles_inFile_should_haveLocLessOrEqualThan_check.md)
- [Project Files in File Should Have Less L.O.C. (Lines Of Code) Than Specified Value](business/inFile/should/projectFiles_inFile_should_haveLocLessThan_check.md)
- [Project Files in File Should Have Name with Specified Pattern](business/inFile/should/projectFiles_inFile_should_haveName_check.md)
- [Project Files in File Should Only Depend On Specified Patterns](business/inFile/should/projectFiles_inFile_should_onlyDependsOn_check.md)
- [Project Files in File Should Only Have Name with Specified Pattern](business/inFile/should/projectFiles_inFile_should_onlyHaveName_check.md)

</details>

<br/>

## :memo: License

This project is under MIT license. See the [LICENSE](LICENSE) file for more details.

---

Made with lots of 🔥🔥🔥 by [Gabriel Ferrari Tarallo Ferraz](https://www.linkedin.com/in/gabriel-ferrari-tarallo-ferraz/)
