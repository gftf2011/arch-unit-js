# Project Files in Files Should Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: Every selected file must have a name that matches the specified pattern. The rule passes only when EACH file name in the selection matches the defined pattern.

- It is NOT OK if ANY selected file does not match the pattern
- It is OK only if ALL selected files match the pattern

This rule ensures naming consistency by requiring the selected set of files to conform to the specified naming convention.

**Note**: The `should.haveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: Some selected files do NOT match the pattern

- **Result**: ❌ FAIL — The selection violates the naming convention

**Scenario 2**: All selected files match the pattern

- **Result**: ✅ PASS — The selection conforms to the naming convention

## Scenario Examples

### Scenario 1: Some files do NOT match the pattern (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── helper.ts
│   │       └── config.ts
│   └── domain/
│       └── entities/
│           └── User.ts
```

**Files Selected:**

```
src/application/use-cases/helper.ts
src/application/use-cases/config.ts
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/application/use-cases/helper.ts', '**/application/use-cases/config.ts'])
  .should()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ❌ FAIL — Neither `helper.ts` nor `config.ts` matches the `*UseCase.ts` pattern

---

### Scenario 2: All files match the pattern (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── CreateUserUseCase.ts
│   │       └── DeleteUserUseCase.ts
│   └── domain/
│       └── entities/
│           └── User.ts
```

**Files Selected:**

```
src/application/use-cases/CreateUserUseCase.ts
src/application/use-cases/DeleteUserUseCase.ts
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles([
    '**/application/use-cases/CreateUserUseCase.ts',
    '**/application/use-cases/DeleteUserUseCase.ts',
  ])
  .should()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ✅ PASS — Both files match the `*UseCase.ts` pattern
