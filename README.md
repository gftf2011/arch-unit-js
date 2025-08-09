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
  <a href="https://eslint.org/">
    <img src="https://img.shields.io/badge/ESLint-configured-blue?logo=eslint" alt="ESLint" />
  </a>
  <a href="https://prettier.io/">
    <img src="https://img.shields.io/badge/Prettier-configured-ff69b4?logo=prettier" alt="Prettier" />
  </a>
  <a href="https://www.npmjs.com/package/arch-unit-js">
    <img src="https://img.shields.io/npm/v/arch-unit-js.svg" alt="npm version" />
  </a>
  <a href="https://github.com/gftf2011/arch-unit-js/actions/workflows/test.yml">
    <img src="https://github.com/gftf2011/arch-unit-js/actions/workflows/test.yml/badge.svg?branch=main" alt="CI Status" />
  </a>
</div>

<br/>

## :page_facing_up: About

A JavaScript/TypeScript library for enforcing architectural rules and constraints in your codebase. Inspired by ArchUnit for Java, this tool provides a fluent API to define and validate architectural boundaries, naming conventions, and dependency rules. It is agnostic about the testing framework and supports for several OS systems !

> **Note**: Backend-focused (frontend support coming soon).

<br/>

## :hammer_and_wrench: Supported OS

- [x] Mac OS
- [x] Linux
- [x] Windows - WSL

<br/>

## :ledger: Features

- **Dependency Rules**: Control which modules can depend on others (`dependsOn`, `onlyDependsOn`)
- **Naming Conventions**: Enforce consistent file naming patterns (`haveName`, `onlyHaveName`)
- **Code Metrics**: Validate lines of code thresholds (`haveLocLessThan`, `haveLocGreaterThan`)
- **Cycle Detection**: Prevent circular dependencies (`shouldNot.haveCycles`)
- **Fluent API**: Intuitive, readable syntax for defining architectural rules

<br/>

## :racing_car: Getting Started

### - Installation

Install using **npm**

```bash
npm install arch-unit-js
```

### - Basic JavaScript Scenario

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
  ignoreMatcher: ['!**/node_modules/**'], // Negative Glob pattern, where you specify all files and directories you do NOT want to check
};

// We are using Jest, but you can use any other testing library
describe('Architecture Test', () => {
  it('"./utils/uuid.js" file should depend on "uuid" lib', async () => {
    await app(options).projectFiles().inDirectory('**/utils/**').should().dependsOn('uuid').check(); // No need to expect, if the dependency is not found it throws an error
  });
});
```

Now run the test and congrats 🥳, you just tested your application topology !

<br/>

## :notebook: API Documentation

- [Project Files in Directory Should NOT Depend On Specified Patterns](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_dependsOn_check.md)
- [Project Files in Directory Should NOT Have Cycles](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_haveCycles_check.md)
- [Project Files in Directory Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_haveLocGreaterOrEqualThan_check.md)
- [Project Files in Directory Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_haveLocGreaterThan_check.md)
- [Project Files in Directory Should NOT Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_haveLocLessOrEqualThan_check.md)
- [Project Files in Directory Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_haveLocLessThan_check.md)
- [Project Files in Directory Should Not Have Name with Specified Pattern](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_haveName_check.md)
- [Project Files in Directory Should NOT Only Depend On Specific Patterns](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_onlyDependsOn_check.md)
- [Project Files in Directory Should NOT Only Have Names with Specified Pattern](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_shouldNot_onlyHaveName_check.md)
- [Project Files in Directory Should Depend On Specified Patterns](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_dependsOn_check.md)
- [Project Files in Directory Should Have Cycles](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_haveCycles_check.md)
- [Project Files in Directory Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_haveLocGreaterOrEqualThan_check.md)
- [Project Files in Directory Should Have Greater L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_haveLocGreaterThan_check.md)
- [Project Files in Directory Should Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_haveLocLessOrEqualThan_check.md)
- [Project Files in Directory Should Have Less L.O.C. (Lines Of Code) Than Specified Value](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_haveLocLessThan_check.md)
- [Project Files in Directory Should Have Name with Specified Pattern](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_haveName_check.md)
- [Project Files in Directory Should Only Depend On Specified Patterns](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_onlyDependsOn_check.md)
- [Project Files in Directory Should Only Have Name with Specified Pattern](https://github.com/gftf2011/arch-unit-js/blob/main/business/projectFiles_inDirectory_should_onlyHaveName_check.md)

<br/>

## :memo: License

This project is under MIT license. See the [LICENSE](https://github.com/gftf2011/arch-unit-js/blob/main/LICENSE) file for more details.

---

Made with lots of 🔥🔥🔥 by [Gabriel Ferrari Tarallo Ferraz](https://www.linkedin.com/in/gabriel-ferrari-tarallo-ferraz/)
