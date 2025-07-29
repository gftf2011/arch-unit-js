# Project Files in Directory Should NOT Only Have Names with Specified Pattern

## Business Rule Description

**DESCRIPTION**: All files in the directory must NOT have names that match ONLY the specified pattern. The rule passes when files have names that are NOT exclusively the defined pattern OR when files have no names at all. Files that have names matching exclusively the specified pattern will fail this rule.

- It is OK if NONE of the files match the specified pattern
- It is OK if SOME of the files match the specified pattern
- It is NOT OK if ALL files match the specified pattern

This rule ensures that files within a specific directory structure do NOT have names that conform EXCLUSIVELY to the required naming pattern defined in the checking pattern. It enforces that files must have names that are NOT limited to only the specified pattern, ensuring naming flexibility and preventing overly restrictive naming conventions.

The rule validates that files have flexible naming relationships, allowing additional naming patterns beyond the specified pattern and ensuring that components can have names that follow different conventions beyond those defined by the architectural pattern.

**Note**: The `shouldNot.onlyHaveName` rule accepts only a single pattern, not an array of patterns. It validates file names against this single pattern to ensure non-exclusive naming compliance.

## All Possible Scenarios

**Scenario 1**: Directory has files but NONE match the pattern
- **Result**: ✅ PASS - No files match the specified pattern, so no exclusive naming

**Scenario 2**: Directory has files and SOME match the pattern
- **Result**: ✅ PASS - Mixed naming patterns, not exclusive

**Scenario 3**: Directory has files and ALL files match the pattern (exclusively)
- **Result**: ❌ FAIL - Exclusive naming patterns are not allowed

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
  .onlyHaveName('*UseCase.ts')
  .check()
```

**Result**: ✅ PASS - No files match the `*UseCase.ts` pattern, so no exclusive naming

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
  .onlyHaveName('*UseCase.ts')
  .check()
```

**Result**: ✅ PASS - Mixed naming patterns: `CreateUserUseCase.ts` matches the pattern, but `helper.ts` and `config.ts` do not (not exclusive)

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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .onlyHaveName('*UseCase.ts')
  .check()
```

**Result**: ❌ FAIL - All files match the `*UseCase.ts` pattern (exclusive naming not allowed)
