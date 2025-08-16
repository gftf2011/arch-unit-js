# Project Files in Directories Should Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: All files in the specified directories (considered as a union) must have names that match the specified pattern. The rule passes only when every file name matches the defined pattern.

- It is NOT OK if NONE of the files match the pattern
- It is NOT OK if SOME of the files match the pattern
- It is OK only if ALL files match the pattern

This rule ensures naming consistency across multiple directories by requiring all files to conform to the specified naming convention.

**Note**: The `should.haveName` rule accepts only a single pattern (string), not an array of patterns.

## All Possible Scenarios

**Scenario 1**: Directories have files but NONE match the pattern

- **Result**: ❌ FAIL - No files match the specified pattern

**Scenario 2**: Directories have files and SOME match the pattern

- **Result**: ❌ FAIL - Not all files match the specified pattern

**Scenario 3**: Directories have files and ALL files match the pattern

- **Result**: ✅ PASS - All files match the specified pattern

## Scenario Examples

### Scenario 1: Multiple directories have files but NONE match the pattern

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
  .should()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ❌ FAIL - No files match the `*UseCase.ts` pattern

### Scenario 2: Multiple directories have files and SOME match the pattern

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── CreateUserUseCase.ts
│   │       ├── helper.ts
│   │       └── config.ts
│   └── services/
│       ├── UpdateUserUseCase.ts
│       └── EmailService.ts
```

**Directories Content (union):**

```
src/application/use-cases/
├── CreateUserUseCase.ts
├── helper.ts
└── config.ts

src/services/
├── UpdateUserUseCase.ts
└── EmailService.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/services/**'])
  .should()
  .haveName('*UseCase.ts')
  .check();
```

**Result**: ❌ FAIL - Only `CreateUserUseCase.ts` and `UpdateUserUseCase.ts` match the pattern; others do not

### Scenario 3: Multiple directories have files and ALL files match the pattern

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── CreateUserUseCase.ts
│   │       ├── UpdateUserUseCase.ts
│   │       └── DeleteUserUseCase.ts
│   └── services/
│       └── EmailUserService.ts
```

**Directories Content (union):**

```
src/application/use-cases/
├── CreateUserUseCase.ts
├── UpdateUserUseCase.ts
└── DeleteUserUseCase.ts

src/services/
└── EmailUserService.ts
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/services/**'])
  .should()
  .haveName('*User*.ts')
  .check();
```

**Result**: ✅ PASS - All files match the `*User*.ts` pattern
