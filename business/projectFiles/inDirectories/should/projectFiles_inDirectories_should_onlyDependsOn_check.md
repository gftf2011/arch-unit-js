# Project Files in Directories Should Only Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: All files in the specified directories (considered as a union) must have dependencies that match ONLY the specified patterns OR have no dependencies at all. The rule passes when each file depends exclusively on any subset of the defined patterns, on all of them, or on none.

- It is OK if files have NO dependencies
- It is OK if files depend exclusively on SOME of the specified patterns
- It is OK if files depend exclusively on ALL of the specified patterns
- It is NOT OK if files have additional non-matching dependencies

This rule ensures strict architectural compliance across multiple directories by allowing files to depend only on the specified architectural components or modules, preventing unwanted coupling to non-specified dependencies.

**Note**: The `should.onlyDependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `should.onlyDependsOn` also accepts a single string as parameter.

## All Possible Scenarios

**Scenario 1**: File has NO dependencies

- **Result**: ✅ PASS - No dependencies means no violations

**Scenario 2**: File has dependencies but NONE match the patterns

- **Result**: ❌ FAIL - No patterns are present

**Scenario 3**: File has dependencies that match only SOME of the patterns (exclusively)

- **Result**: ✅ PASS - Some patterns are present exclusively

**Scenario 4**: File has dependencies and ALL patterns are present (exclusively)

- **Result**: ✅ PASS - All required patterns are present with no extra dependencies

**Scenario 5**: File has dependencies with additional non-matching dependencies

- **Result**: ❌ FAIL - Extra dependencies are not allowed

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
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Files without imports cannot violate the exclusive dependency rule

### Scenario 2: Files have dependencies but NONE match the patterns (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── WrongUseCase.ts  // imports: ['../utils/helper', '../config/settings']
│   └── presentation/
│       └── controllers/
│           └── WrongController.ts // imports: ['../utils/helper']
```

**File Content Example:**

```typescript
// src/application/use-cases/WrongUseCase.ts
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class WrongUseCase {
  execute() {
    return helper.process(settings.getConfig());
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - Dependencies point to `utils` and/or `config`, not the allowed `domain` or `infrastructure`

### Scenario 3: Files depend exclusively on SOME of the allowed patterns (PASS)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── PartialUseCase.ts  // imports: ['../domain/entities/User']
│   └── presentation/
│       └── controllers/
│           └── ReadOnlyController.ts // imports: [] (no deps)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Files import only from `domain` (subset of allowed patterns) or have no dependencies

### Scenario 4: Files depend exclusively on ALL allowed patterns (PASS)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/User.ts
│   ├── infrastructure/
│   │   └── database/DatabaseConnection.ts
│   └── application/
│       └── use-cases/
│           └── PerfectUseCase.ts // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Files import ONLY from `domain` and `infrastructure`

### Scenario 5: Files include extra non-matching dependencies (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── ViolatingUseCase.ts       // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper']
│   │       └── MixedViolatingUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper', '../config/settings']
│   ├── utils/helper.ts
│   └── config/settings.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - Extra dependencies (`utils`, `config`) are not allowed beyond the specified patterns

### NPM Dependency Example

You can restrict external (npm) dependencies in addition to path globs:

```typescript
projectFiles()
  .inDirectories(['**/presentation/**'])
  .should()
  .onlyDependsOn(['react', 'react-dom', '**/domain/**'])
  .check();
```

This passes only if files depend exclusively on `react`, `react-dom`, and/or modules within `**/domain/**`, with no other external or internal dependencies.
