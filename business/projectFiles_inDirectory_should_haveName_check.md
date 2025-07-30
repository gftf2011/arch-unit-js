# Project Files in Directory Should Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: All files in the directory must have names that match ONLY the specified pattern. The rule passes when every file in the directory has a name that matches EXCLUSIVELY the defined pattern (no other naming patterns allowed).

- It is NOT OK if NONE of the files match the specified pattern
- It is NOT OK if SOME of the files match the specified pattern
- It is OK if ALL files match the specified pattern

This rule ensures that files within a specific directory structure have names that conform EXCLUSIVELY to the required naming pattern defined in the checking pattern. It enforces that every file must have a name that matches ONLY the specified pattern, ensuring strict naming consistency and preventing any files with non-conforming names.

The rule validates that files are properly named according to the specified pattern, preventing any naming inconsistencies and ensuring that all components follow the same naming convention as defined by the architectural pattern.

**Note**: The `should.haveName` rule accepts only a single pattern, not an array of patterns. It validates file names against this single pattern to ensure exclusive naming compliance.

## All Possible Scenarios

**Scenario 1**: Directory has files but NONE match the pattern
- **Result**: ❌ FAIL - No files match the specified pattern

**Scenario 2**: Directory has files and SOME match the pattern
- **Result**: ❌ FAIL - Not all files match the specified pattern

**Scenario 3**: Directory has files and ALL files match the pattern (exclusively)
- **Result**: ✅ PASS - All files match the specified pattern with no extra files

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

**Result**: ❌ FAIL - Only `CreateUserUseCase.ts` matches the pattern, but `helper.ts` and `config.ts` do not

### Scenario 3: Directory has files and ALL files match the pattern (exclusively)
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

**Result**: ✅ PASS - All files match the `*UseCase.ts` pattern (exclusive matching)