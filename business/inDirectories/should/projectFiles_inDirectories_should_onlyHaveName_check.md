# Project Files in Directories Should Only Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: All files from the union of the given directories must have names that match the specified pattern. The rule passes only when every file name in this union matches the defined pattern.

- It is NOT OK if NONE of the files match the pattern
- It is NOT OK if SOME of the files match the pattern
- It is OK only if ALL files match the pattern

This rule enforces naming consistency across multiple directories by requiring all files in the union to conform to the specified naming convention.

**Note**: The `should.onlyHaveName` rule accepts only a single pattern (string), not an array of patterns.

## All Possible Scenarios

**Scenario 1**: Union of directories has files but NONE match the pattern

- **Result**: ❌ FAIL - No files match the specified pattern

**Scenario 2**: Union of directories has files and SOME match the pattern

- **Result**: ❌ FAIL - Not all files match the specified pattern

**Scenario 3**: Union of directories has files and ALL files match the pattern

- **Result**: ✅ PASS - All files match the specified pattern

## Scenario Examples

### Scenario 1: NONE match in the union (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── CreateUserUseCase.ts
│   └── presentation/
│       └── controllers/
│           └── UsersController.ts
```

**Directories Content (union):**

```
src/application/use-cases/
└── CreateUserUseCase.ts

src/presentation/controllers/
└── UsersController.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .should()
  .onlyHaveName('*Report.ts')
  .check();
```

**Result**: ❌ FAIL - None of the files in the union match `*Report.ts`

### Scenario 2: SOME match in the union (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── CreateUserUseCase.ts
│   └── presentation/
│       └── controllers/
│           └── UsersController.ts
```

**Directories Content (union):**

```
src/application/use-cases/
└── CreateUserUseCase.ts

src/presentation/controllers/
└── UsersController.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .should()
  .onlyHaveName('*UseCase.ts')
  .check();
```

**Result**: ❌ FAIL - Only `CreateUserUseCase.ts` match; others do not

### Scenario 3: ALL match in the union (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── CreateUserUseCase.ts
│   └── presentation/
│       └── controllers/
│           └── UsersController.ts
```

**Directories Content (union):**

```
src/application/use-cases/
└── CreateUserUseCase.ts

src/presentation/controllers/
└── UsersController.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .should()
  .onlyHaveName('*User*.ts')
  .check();
```

**Result**: ✅ PASS - All files in the union match `*User*.ts`
