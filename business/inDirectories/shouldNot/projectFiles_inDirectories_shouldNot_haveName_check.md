# Project Files in Directories Should NOT Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: Files in the specified directories (from the union of the given directories) must NOT have names that match the specified pattern. The rule passes when no files from the union match the defined pattern.

- It is OK if NONE of the files match the pattern
- It is NOT OK if ANY files match the pattern

This rule ensures naming flexibility across multiple directories by preventing files from conforming to the specified naming convention.

**Note**: The `shouldNot.haveName` rule accepts only a single pattern (string), not an array of patterns.

## All Possible Scenarios

**Scenario 1**: Directories have files but NONE match the pattern

- **Result**: ✅ PASS - No files match the specified pattern

**Scenario 2**: Directories have files and ANY files match the pattern

- **Result**: ❌ FAIL - Files match the specified pattern (violates the rule)

## Scenario Examples

### Scenario 1: Multiple directories have files but NONE match the pattern (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── helper.ts
│   │       ├── config.ts
│   │       └── utils.ts
│   └── services/
│       ├── EmailService.ts
│       └── UserService.ts
```

**Directories Content (union):**

```
src/application/use-cases/
├── helper.ts
├── config.ts
└── utils.ts

src/services/
├── EmailService.ts
└── UserService.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/services/**'])
  .shouldNot()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ✅ PASS - No files match the `*UseCase.ts` pattern

### Scenario 2: Multiple directories have files and ANY files match the pattern (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── CreateUserUseCase.ts
│   │       ├── helper.ts
│   │       └── config.ts
│   └── services/
│       └── EmailUserService.ts
```

**Directories Content (union):**

```
src/application/use-cases/
├── CreateUserUseCase.ts  // matches pattern
├── helper.ts
└── config.ts

src/services/
└── EmailUserService.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/services/**'])
  .shouldNot()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ❌ FAIL - Forbidden matches found: CreateUserUseCase.ts
