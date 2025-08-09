<div align="center">
  <h1 style="font-size:4.5rem;"> ArchUnit JS</h1>

  <a href="https://eslint.org/">
    <img src="https://img.shields.io/badge/ESLint-configured-blue?logo=eslint" alt="ESLint" />
  </a>
  <a href="https://prettier.io/">
    <img src="https://img.shields.io/badge/Prettier-configured-ff69b4?logo=prettier" alt="Prettier" />
  </a>
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
<h3><strong>Getting Started:</strong></h3>
<h2>Installation</h2>

```bash
npm install arch-unit-js
```
</div>

<br/>

<div align="left">
<h2>Basic Usage</h2>

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
