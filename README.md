<div align="center">
<<<<<<< Updated upstream
  <h1 style="font-size:3.5rem;"> ArchUnit JS</h1>
=======
  <h1>ArchUnit JS</h1>
  <p>Architectural rules for JS/TS projects — inspired by ArchUnit</p>

  <a href="https://github.com/gftf2011/arch-unit-js/actions/workflows/test.yml">
    <img src="https://github.com/gftf2011/arch-unit-js/actions/workflows/test.yml/badge.svg?branch=main" alt="CI Status" />
  </a>
  <a href="https://eslint.org/">
    <img src="https://img.shields.io/badge/ESLint-configured-blue?logo=eslint" alt="ESLint" />
  </a>
  <a href="https://prettier.io/">
    <img src="https://img.shields.io/badge/Prettier-configured-ff69b4?logo=prettier" alt="Prettier" />
  </a>
>>>>>>> Stashed changes
</div>

<div align="center">
  <img src="https://github.com/gftf2011/clean-node-todolist/blob/main/.github/images/background.png" alt="Banner" style="max-width: 100%; height: auto;" />
</div>

A JavaScript/TypeScript library for enforcing architectural rules and constraints in your codebase. Inspired by ArchUnit for Java, this tool provides a fluent API to define and validate architectural boundaries, naming conventions, and dependency rules. It is agnostic about the testing framework and supports for several OSs !

> **Note**: Backend-focused (frontend support coming soon).

<div align="left">
<h2>Features</h2>

- **Dependency Rules**: Control which modules can depend on others (`dependsOn`, `onlyDependsOn`)
- **Naming Conventions**: Enforce consistent file naming patterns (`haveName`, `onlyHaveName`)
- **Code Metrics**: Validate lines of code thresholds (`haveLocLessThan`, `haveLocGreaterThan`)
- **Cycle Detection**: Prevent circular dependencies (`shouldNot.haveCycles`)
- **Fluent API**: Intuitive, readable syntax for defining architectural rules
</div>

<div align=left">
## Getting Started

### Installation

```bash
npm install arch-unit-js
```
</div>

<div align="left">
### Basic Usage

```typescript
import { app } from 'arch-unit-js';

const options = {
  extensionTypes: ['**/*.ts', '**/*.js'],
  includeMatcher: ['src/**'],
  ignoreMatcher: ['!**/node_modules/**'],
};

// Enforce naming conventions
await app(options)
  .projectFiles()
  .inDirectory('**/controllers/**')
  .should()
  .haveName('*Controller.ts')
  .check();

// Control dependencies
await app(options)
  .projectFiles()
  .inDirectory('**/domain/**')
  .shouldNot()
  .dependsOn(['**/infrastructure/**'])
  .check();
```
</div>
