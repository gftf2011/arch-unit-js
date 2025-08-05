# Project Files in Directory Should Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: All files in the directory must have names that match the specified pattern. The rule passes only when every file name matches the defined pattern.

- It is NOT OK if NONE of the files match the pattern
- It is NOT OK if SOME of the files match the pattern
- It is OK if ALL files match the pattern

This rule ensures naming consistency by requiring all files to conform to the specified naming convention.

**Note**: The `should.haveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

**Scenario 1**: Directory has files but NONE match the pattern
- **Result**: ❌ FAIL - No files match the specified pattern

**Scenario 2**: Directory has files and SOME match the pattern
- **Result**: ❌ FAIL - Not all files match the specified pattern

**Scenario 3**: Directory has files and ALL files match the pattern
- **Result**: ✅ PASS - All files match the specified pattern

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
  .should()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ❌ FAIL - No files match the `*UseCase.ts` pattern

### Scenario 2: Directory has files and SOME match the pattern
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── CreateUserUseCase.ts
│   │       ├── helper.ts
│   │       └── config.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**Directory Content:**
```
src/application/use-cases/
├── CreateUserUseCase.ts
├── helper.ts
└── config.ts
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .should()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ❌ FAIL - Only `CreateUserUseCase.ts` matches the pattern

### Scenario 3: Directory has files and ALL files match the pattern
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── CreateUserUseCase.ts
│   │       ├── UpdateUserUseCase.ts
│   │       └── DeleteUserUseCase.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**Directory Content:**
```
src/application/use-cases/
├── CreateUserUseCase.ts
├── UpdateUserUseCase.ts
└── DeleteUserUseCase.ts
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .should()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ✅ PASS - All files match the `*UseCase.ts` pattern