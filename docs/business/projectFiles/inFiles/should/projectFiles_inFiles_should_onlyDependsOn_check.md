# Project Files in Files Should Only Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: All files explicitly selected via `inFiles([...])` (considered as a set) must have dependencies that match ONLY the specified patterns OR have no dependencies at all. The rule passes when each selected file depends exclusively on any subset of the allowed patterns, on all of them, or on none.

- It is OK if files have NO dependencies
- It is OK if files depend exclusively on SOME of the specified patterns
- It is OK if files depend exclusively on ALL of the specified patterns
- It is NOT OK if files have additional non-matching dependencies

This rule ensures strict architectural compliance across multiple explicitly specified files by allowing them to depend only on the specified architectural components or modules, preventing unwanted coupling to non-specified dependencies.

**Note**: The `should.onlyDependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `should.onlyDependsOn` also accepts a single string as parameter.

**Note**: Pattern matching uses glob semantics and honors the current configuration (e.g., webpack path aliases, `includeMatcher`, `ignoreMatcher`, and `extensionTypes`).

## All Possible Scenarios

**Scenario 1**: File has NO dependencies

- **Result**: ✅ PASS - No dependencies means no violations

**Scenario 2**: File has dependencies but NONE match the patterns

- **Result**: ❌ FAIL - No allowed patterns are present

**Scenario 3**: File has dependencies that match only SOME of the patterns (exclusively)

- **Result**: ✅ PASS - Some allowed patterns are present exclusively

**Scenario 4**: File has dependencies and ALL patterns are present (exclusively)

- **Result**: ✅ PASS - All allowed patterns are present with no extra dependencies

**Scenario 5**: File has dependencies with additional non-matching dependencies

- **Result**: ❌ FAIL - Extra dependencies are not allowed

## Scenario Examples

### Scenario 1: Selected files have NO dependencies (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── services/
│   │       └── EmptyService.ts        // No imports
│   └── presentation/
│       └── controllers/
│           └── EmptyController.ts     // No imports
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmptyService.ts', '**/presentation/controllers/EmptyController.ts'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Files without imports cannot violate the exclusive dependency rule

---

### Scenario 2: Files have dependencies but NONE match the patterns (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── services/
│   │       └── WrongService.ts  // imports: ['../utils/helper', '../config/settings']
│   └── presentation/
│       └── controllers/
│           └── WrongController.ts // imports: ['../utils/helper']
```

**File Content Example:**

```typescript
// src/application/services/WrongService.ts
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class WrongService {
  execute() {
    return helper.process(settings.getConfig());
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/WrongService.ts', '**/presentation/controllers/WrongController.ts'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - Dependencies point to `utils` and/or `config`, not the allowed `domain` or `infrastructure`

---

### Scenario 3: Files depend exclusively on SOME of the allowed patterns (PASS)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/User.ts
│   ├── application/
│   │   └── services/
│   │       └── PartialService.ts  // imports: ['../domain/entities/User']
│   └── presentation/
│       └── controllers/
│           └── ReadOnlyController.ts // imports: [] (no deps)
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/PartialService.ts', '**/presentation/controllers/ReadOnlyController.ts'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Files import only from `domain` (subset of allowed patterns) or have no dependencies

---

### Scenario 4: Files depend exclusively on ALL allowed patterns (PASS)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/User.ts
│   ├── infrastructure/
│   │   └── database/DatabaseConnection.ts
│   └── application/
│       └── services/
│           └── PerfectService.ts // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/PerfectService.ts'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Files import ONLY from `domain` and `infrastructure`

---

### Scenario 5: Files include extra non-matching dependencies (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── services/
│   │       ├── ViolatingService.ts       // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper']
│   │       └── MixedViolatingService.ts  // imports: ['../domain/entities/User', '../utils/helper', '../config/settings']
│   ├── utils/helper.ts
│   └── config/settings.ts
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/ViolatingService.ts', '**/services/MixedViolatingService.ts'])
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - Extra dependencies (`utils`, `config`) are not allowed beyond the specified patterns

### NPM Dependency Example

You can restrict external (npm) dependencies in addition to path globs:

```typescript
await projectFiles()
  .inFiles(['**/presentation/**/SomeController.ts'])
  .should()
  .onlyDependsOn(['express', 'lodash', '**/domain/**'])
  .check();
```

This passes only if files depend exclusively on `express`, `lodash`, and/or modules within `**/domain/**`, with no other external or internal dependencies.
