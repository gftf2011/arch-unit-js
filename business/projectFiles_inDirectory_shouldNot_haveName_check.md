# Project Files in Directory Should Not Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: All files in the directory must NOT have names that match the specified pattern. The rule passes when files have names that do NOT match the defined pattern. Files that have names matching the specified pattern will fail this rule.

- It is OK if NONE of the files match the specified pattern
- It is NOT OK if SOME of the files match the specified pattern
- It is NOT OK if ALL files match the specified pattern

This rule ensures that files within a specific directory structure do NOT have names that conform to the required naming pattern defined in the checking pattern. It enforces that files must have names that do NOT match the specified pattern, ensuring naming flexibility and preventing restrictive naming conventions.

The rule validates that files have flexible naming relationships, allowing different naming patterns beyond the specified pattern and ensuring that components can have names that follow different conventions beyond those defined by the architectural pattern.

**Note**: The `shouldNot.haveName` rule accepts only a single pattern, not an array of patterns. It validates file names against this single pattern to ensure non-matching naming compliance.

## All Possible Scenarios

**Scenario 1**: Directory has files but NONE match the pattern
- **Result**: ✅ PASS - No files match the specified pattern

**Scenario 2**: Directory has files and SOME match the pattern
- **Result**: ❌ FAIL - Some files match the specified pattern (violates the rule)

**Scenario 3**: Directory has files and ALL files match the pattern
- **Result**: ❌ FAIL - All files match the specified pattern (exclusive matching not allowed)

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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ✅ PASS - No files match the `*UseCase.ts` pattern

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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ❌ FAIL - `CreateUserUseCase.ts` matches the pattern (violates the shouldNot rule)

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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .haveName('*UseCase.ts')
  .check()
```

**Result**: ❌ FAIL - All files match the `*UseCase.ts` pattern (exclusive matching not allowed)