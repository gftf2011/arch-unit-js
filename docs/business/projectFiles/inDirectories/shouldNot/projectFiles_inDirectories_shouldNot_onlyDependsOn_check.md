# Project Files in Directories Should NOT Only Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: Files in the specified directories (considered as a union) must NOT depend exclusively on the specified patterns. The rule passes when files have mixed dependencies (include at least one non-allowed dependency) or have no dependencies at all. It fails when any file depends only on a subset or all of the specified patterns and nothing else.

- It is OK if files have NO dependencies
- It is OK if files have mixed dependencies (some of the patterns + additional, non-matching dependencies)
- It is NOT OK if files depend exclusively on the specified patterns (any subset or all)

This rule ensures architectural flexibility across multiple directories by preventing overly restrictive coupling to only the specified dependencies.

**Note**: The `shouldNot.onlyDependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `shouldNot.onlyDependsOn` also accepts a single string as parameter.

## All Possible Scenarios

**Scenario 1**: Files have NO dependencies

- **Result**: ✅ PASS - No dependencies means no exclusive coupling, so no violation

**Scenario 2**: Files have dependencies but NONE match the patterns

- **Result**: ✅ PASS - No specified patterns are present, thus not exclusively depending on them

**Scenario 3**: Files have mixed dependencies (specified patterns + extra)

- **Result**: ✅ PASS - Mixed dependencies are allowed because they are not exclusive

**Scenario 4**: Files have exclusive dependencies to the specified patterns

- **Result**: ❌ FAIL - Exclusive dependencies are not allowed

## Scenario Examples

### Scenario 1: Files in multiple directories have NO dependencies (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── EmptyUseCase.ts        // No imports
│   └── presentation/
│       └── controllers/
│           └── EmptyController.ts     // No imports
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Files without imports cannot exclusively depend on any patterns

### Scenario 2: Files have dependencies but NONE match the patterns (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── SafeUseCase.ts  // imports: ['../utils/helper', '../config/settings']
│   └── presentation/
│       └── controllers/
│           └── SafeController.ts // imports: ['../utils/helper']
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Dependencies point to non-specified areas (`utils`, `config`), so not exclusive

### Scenario 3: Files have mixed dependencies (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── MixedUseCase.ts   // imports: ['../domain/entities/User', '../utils/helper']
│   │       └── FlexibleUseCase.ts // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper']
│   └── presentation/
│       └── controllers/
│           └── ReportsController.ts // imports: ['lodash', '../domain/entities/User']
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Mixed dependencies mean the files are not exclusively tied to the specified patterns

### Scenario 4: Files have exclusive dependencies to specified patterns (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── ExclusiveUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   │       └── CreateUserUseCase.ts // imports: ['../domain/entities/User']
│   └── presentation/
│       └── controllers/
│           └── UsersController.ts    // imports: ['../domain/entities/User']
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - Files depend exclusively on the specified patterns (some or all), which is prohibited

### NPM Dependency Example

You can also prohibit exclusive reliance on certain external (npm) dependencies:

```typescript
projectFiles()
  .inDirectories(['**/presentation/**'])
  .shouldNot()
  .onlyDependsOn(['react', 'react-dom'])
  .check();
```

This fails if files import exclusively from `react`/`react-dom` and nothing else; it passes if there are mixed or no dependencies.
