# Project Files in Directories Should NOT Depend On Specified Patterns

## Business Rule Description

DESCRIPTION: Files in the specified directories must NOT have dependencies that match ANY of the specified patterns. The rule passes only when every file (from the union of the given directories) have NO dependencies matching the defined patterns.

- It is NOT OK if ANY of the patterns are present
- It is OK if NONE of the patterns are present

This rule ensures architectural isolation across multiple directories by preventing dependencies on specified components or modules.

Note: The shouldNot.dependsOn rule validates both project paths and npm dependencies (e.g., ['lodash', 'express']).

Note: The shouldNot.dependsOn accepts as parameter also a single string.

## All Possible Scenarios

Scenario 1: Files have NO dependencies

- Result: ✅ PASS — No patterns are present

Scenario 2: Files have dependencies but NONE match the patterns

- Result: ✅ PASS — No patterns are present

Scenario 3: Files have dependencies and ANY patterns are present

- Result: ❌ FAIL — Patterns are present (violates the rule)

## Scenario Examples

### Scenario 1: Files have NO dependencies (across multiple directories)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       └── EmptyService.ts  // No imports
│   └── main/
│       └── app.ts  // Irrelevant for this rule
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/main/**'])
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

Result: ✅ PASS — EmptyService.ts has no dependencies

### Scenario 2: Files have dependencies but NONE match the patterns (across multiple directories)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       └── SafeService.ts  // imports: ['../utils/helper', '../config/settings']
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
  .inDirectories(['**/services/**', '**/main/**'])
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

Result: ✅ PASS — Neither SafeService.ts nor app.ts import from domain or infrastructure

### Scenario 3: Files have dependencies and ANY patterns are present (across multiple directories)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       ├── ViolatingService.ts   // imports: ['../domain/entities/User', '../utils/helper']
│   └── main/
│       └── app.ts                    // imports: ['../infrastructure/database/DatabaseConnection']
├── src/infrastructure/
│   └── database/DatabaseConnection.ts
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/main/**'])
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

Result: ❌ FAIL — ViolatingService.ts imports from domain; app.ts imports from infrastructure (any match violates the rule)
