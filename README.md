<div align="center">
  <h1>ArchUnit JS<h1>
</div>

<div align="center">
  <img src='https://img.shields.io/badge/ESLint-configured-blue?logo=eslint' alt='Coverage Status' />
  <img src='https://img.shields.io/badge/Prettier-configured-ff69b4?logo=prettier' alt='Quality Gate Status' />
<div>

<div align="center">
  <img src="https://github.com/gftf2011/clean-node-todolist/blob/main/.github/images/background.png" />
</div>

A JavaScript/TypeScript library for enforcing architectural rules and constraints in your codebase. Inspired by ArchUnit for Java, this tool provides a fluent API to define and validate architectural boundaries, naming conventions, and dependency rules.

> **Note**: Currently supports backend projects only.

<div align="left">
<h2>Features</h2>

- **Dependency Rules**: Control which modules can depend on others (`dependsOn`, `onlyDependsOn`)
- **Naming Conventions**: Enforce consistent file naming patterns (`haveName`, `onlyHaveName`)
- **Code Metrics**: Validate lines of code thresholds (`haveLocLessThan`, `haveLocGreaterThan`)
- **Cycle Detection**: Prevent circular dependencies (`shouldNot.haveCycles`)
- **Fluent API**: Intuitive, readable syntax for defining architectural rules
</div>

## Getting Started

### Installation

```bash
npm install arch-unit-js
```

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
