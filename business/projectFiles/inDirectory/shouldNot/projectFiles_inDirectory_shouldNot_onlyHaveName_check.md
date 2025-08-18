# Project Files in Directory Should NOT Only Have Names with Specified Pattern

## Business Rule Description

**DESCRIPTION**: Files in the directory must NOT all have names that match the specified pattern. The rule passes when files have mixed naming patterns or no files match the pattern.

- It is OK if NONE of the files match the pattern
- It is OK if SOME of the files match the pattern
- It is NOT OK if ALL files match the pattern

This rule ensures naming flexibility by preventing exclusive use of the specified naming convention.

**Note**: The `shouldNot.onlyHaveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

**Scenario 1**: Directory has files but NONE match the pattern

- **Result**: ✅ PASS - No files match the pattern

**Scenario 2**: Directory has files and SOME match the pattern

- **Result**: ✅ PASS - Mixed naming patterns

**Scenario 3**: Directory has files and ALL files match the pattern

- **Result**: ❌ FAIL - Exclusive naming not allowed

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
projectFiles().inDirectory('**/use-cases/**').shouldNot().onlyHaveName('*UseCase.ts').check();
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
projectFiles().inDirectory('**/use-cases/**').shouldNot().onlyHaveName('*UseCase.ts').check();
```

**Result**: ✅ PASS - Mixed naming patterns: some match, some don't

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
projectFiles().inDirectory('**/use-cases/**').shouldNot().onlyHaveName('*UseCase.ts').check();
```

**Result**: ❌ FAIL - All files match the `*UseCase.ts` pattern
