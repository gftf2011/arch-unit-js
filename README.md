# ArchUnit JS

A JavaScript/TypeScript library for enforcing architectural rules and constraints in your codebase. Inspired by ArchUnit for Java, this tool provides a fluent API to define and validate architectural boundaries, naming conventions, and dependency rules.

> **Note**: Currently supports backend projects only.

## Features

- **Dependency Rules**: Control which modules can depend on others (`dependsOn`, `onlyDependsOn`)
- **Naming Conventions**: Enforce consistent file naming patterns (`haveName`, `onlyHaveName`)
- **Code Metrics**: Validate lines of code thresholds (`haveLocLessThan`, `haveLocGreaterThan`)
- **Cycle Detection**: Prevent circular dependencies (`shouldNot.haveCycles`)
- **Fluent API**: Intuitive, readable syntax for defining architectural rules

## Getting Started

### Installation

```bash
npm install arch-unit-js
```

### Basic Usage

```typescript
import { ComponentSelectorBuilder } from 'arch-unit-js';

const options = {
  extensionTypes: ['**/*.ts', '**/*.js'],
  includeMatcher: ['src/**'],
  ignoreMatcher: ['!**/node_modules/**']
};

// Enforce naming conventions
await ComponentSelectorBuilder.create('./my-project', options)
  .projectFiles()
  .inDirectory('**/controllers/**')
  .should()
  .haveName('*Controller.ts')
  .check();

// Control dependencies
await ComponentSelectorBuilder.create('./my-project', options)
  .projectFiles()
  .inDirectory('**/domain/**')
  .shouldNot()
  .dependsOn(['**/infrastructure/**'])
  .check();
```
