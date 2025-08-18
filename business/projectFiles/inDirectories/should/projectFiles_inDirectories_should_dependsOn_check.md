# Project Files in Directories Should Depend On Specified Patterns

## Business Rule Description

DESCRIPTION: Files in the specified directories must have dependencies that match ALL the specified patterns. The rule passes only when every file (from the union of the given directories) has dependencies matching each defined pattern.

- It is NOT OK if NONE of the patterns are present
- It is NOT OK if SOME of the patterns are present
- It is OK if ALL patterns are present (extra dependencies are ignored)

This rule ensures complete architectural compliance by requiring files to depend on all required components or modules across multiple directories.

Note: The should.dependsOn rule validates both project paths and npm dependencies (e.g., ['express', 'lodash']).

Note: The should.dependsOn accepts as parameter also a single string.

## All Possible Scenarios

Scenario 1: File has NO dependencies

- Result: ❌ FAIL - No patterns are present

Scenario 2: File has dependencies but NONE match the patterns

- Result: ❌ FAIL - No patterns are present

Scenario 3: File has dependencies and SOME match the patterns

- Result: ❌ FAIL - Not all patterns are present

Scenario 4: File has dependencies and ALL patterns are present

- Result: ✅ PASS - All required patterns are present

## Scenario Examples

### Scenario 1: File has NO dependencies (across multiple directories)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── EmptyUseCase.ts  // No imports
│   └── main/
│       └── app.ts  // Irrelevant here
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/main/**'])
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

Result: ❌ FAIL - EmptyUseCase.ts has no dependencies

### Scenario 2: Files have dependencies but NONE match the patterns (across multiple directories)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── WrongUseCase.ts  // imports: ['../utils/helper', '../config/settings']
│   ├── main/
│   │   └── app.ts              // imports: ['../utils/logger']
│   ├── utils/
│   │   └── helper.ts
│   └── config/
│       └── settings.ts
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/main/**'])
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

Result: ❌ FAIL - WrongUseCase.ts and app.ts import from utils/config, not domain or infrastructure

### Scenario 3: Files have dependencies and SOME match the patterns (across multiple directories)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── PartialUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   └── main/
│       └── app.ts                 // imports: ['../infrastructure/database/DatabaseConnection']
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/main/**'])
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

Result: ❌ FAIL - PartialUseCase.ts imports from domain but not infrastructure; app.ts imports from infrastructure but not domain

### Scenario 4: Files have dependencies and ALL patterns are present (across multiple directories)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── CorrectUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   └── main/
│       └── app.ts                 // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/main/**'])
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

Result: ✅ PASS - Both files import from domain and infrastructure; extra dependencies (if any) are ignored
