# Project Files in Directories Should NOT Only Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: Files from the union of the given directories must NOT all have names that match the specified pattern. The rule passes when the union has mixed naming patterns or none of the files match the pattern. It fails if every file in the union matches the pattern.

- It is OK if NONE of the files in the union match the pattern
- It is OK if SOME of the files in the union match the pattern
- It is NOT OK if ALL files in the union match the pattern

This rule ensures naming flexibility across multiple directories by preventing exclusive use of the specified naming convention.

**Note**: The `shouldNot.onlyHaveName` rule accepts only a single pattern (string), not an array of patterns.

## All Possible Scenarios

**Scenario 1**: Union of directories has files but NONE match the pattern

- **Result**: ✅ PASS - No files match the specified pattern

**Scenario 2**: Union of directories has files and SOME match the pattern

- **Result**: ✅ PASS - Mixed naming patterns

**Scenario 3**: Union of directories has files and ALL files match the pattern

- **Result**: ❌ FAIL - Exclusive naming not allowed

## Scenario Examples

### Scenario 1: NONE match in the union (PASS)

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
  .shouldNot()
  .onlyHaveName('*Report.ts')
  .check();
```

**Result**: ✅ PASS - None of the files in the union match `*Report.ts`

### Scenario 2: SOME match in the union (PASS)

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
  .shouldNot()
  .onlyHaveName('*UseCase.ts')
  .check();
```

**Result**: ✅ PASS - Mixed naming patterns: some match, some don't

### Scenario 3: ALL match in the union (FAIL)

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
  .shouldNot()
  .onlyHaveName('*User*.ts')
  .check();
```

**Result**: ❌ FAIL - All files in the union match `*User*.ts`
