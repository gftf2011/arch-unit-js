# Project Files in File Should Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: The selected file must have a name that matches the specified pattern. The rule passes only when the file name matches the defined pattern.

- It is NOT OK if the file does not match the pattern
- It is OK if the file matches the pattern

This rule ensures naming consistency by requiring the selected file to conform to the specified naming convention.

**Note**: The `should.haveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

**Scenario 1**: File does NOT match the pattern

- **Result**: ❌ FAIL — The selected file does not match the specified pattern

**Scenario 2**: File matches the pattern

- **Result**: ✅ PASS — The selected file matches the specified pattern

## Scenario Examples

### Scenario 1: File does NOT match the pattern

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

**File Selected:**

```
src/application/use-cases/helper.ts
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/application/use-cases/helper.ts')
  .should()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ❌ FAIL — `helper.ts` does not match the `*UseCase.ts` pattern

---

### Scenario 2: File matches the pattern

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── CreateUserUseCase.ts
│   └── domain/
│       └── entities/
│           └── User.ts
```

**File Selected:**

```
src/application/use-cases/CreateUserUseCase.ts
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/application/use-cases/CreateUserUseCase.ts')
  .should()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ✅ PASS — `CreateUserUseCase.ts` matches the `*UseCase.ts` pattern
