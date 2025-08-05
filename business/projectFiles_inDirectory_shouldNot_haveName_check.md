# Project Files in Directory Should Not Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: Files in the directory must NOT have names that match the specified pattern. The rule passes when no files match the defined pattern.

- It is OK if NONE of the files match the pattern
- It is NOT OK if ANY files match the pattern

This rule ensures naming flexibility by preventing files from conforming to the specified naming convention.

**Note**: The `shouldNot.haveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

**Scenario 1**: Directory has files but NONE match the pattern
- **Result**: ✅ PASS - No files match the specified pattern

**Scenario 2**: Directory has files and ANY files match the pattern
- **Result**: ❌ FAIL - Files match the specified pattern (violates the rule)

## Scenario Examples

### Scenario 1: Directory has files but NONE match the pattern
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── helper.ts
│   │       ├── config.ts
│   │       └── utils.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**Directory Content:**
```
src/application/use-cases/
├── helper.ts
├── config.ts
└── utils.ts
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ✅ PASS - No files match the `*UseCase.ts` pattern

### Scenario 2: Directory has files and ANY files match the pattern
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases-mixed/
│   │   │   ├── CreateUserUseCase.ts
│   │   │   ├── helper.ts
│   │   │   └── config.ts
│   │   └── use-cases-all/
│   │       ├── CreateUserUseCase.ts
│   │       ├── UpdateUserUseCase.ts
│   │       └── DeleteUserUseCase.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**Directory Content (Mixed):**
```
src/application/use-cases-mixed/
├── CreateUserUseCase.ts  // matches pattern
├── helper.ts             // doesn't match
└── config.ts             // doesn't match
```

**Directory Content (All Match):**
```
src/application/use-cases-all/
├── CreateUserUseCase.ts  // matches pattern
├── UpdateUserUseCase.ts  // matches pattern
└── DeleteUserUseCase.ts  // matches pattern
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases-mixed/**')
  .shouldNot()
  .haveName('*UseCase.ts')
  .check()

projectFiles()
  .inDirectory('**/use-cases-all/**')
  .shouldNot()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ❌ FAIL - Both directories fail: `use-cases-mixed` has some files matching, `use-cases-all` has all files matching the pattern