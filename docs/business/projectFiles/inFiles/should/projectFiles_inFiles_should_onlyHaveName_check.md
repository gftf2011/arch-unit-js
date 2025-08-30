# Project Files in Files Should Only Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: All files explicitly selected via `inFiles([...])` must have names that match the specified pattern. The rule passes only when every selected file name matches the defined pattern.

- It is NOT OK if NONE of the selected files match the pattern
- It is NOT OK if SOME of the selected files match the pattern
- It is OK only if ALL selected files match the pattern

This rule enforces naming consistency across multiple explicitly provided files by requiring every selected file to conform to the specified naming convention.

**Note**: The `should.onlyHaveName` rule accepts only a single pattern (string), not an array of patterns.

**Note**: Pattern matching uses glob semantics and honors the current configuration (e.g., `includeMatcher`, `ignoreMatcher`, `extensionTypes`).

## All Possible Scenarios

**Scenario 1**: Selection has files but NONE match the pattern

- **Result**: ❌ FAIL - No files match the specified pattern

**Scenario 2**: Selection has files and SOME match the pattern

- **Result**: ❌ FAIL - Not all files match the specified pattern

**Scenario 3**: Selection has files and ALL files match the pattern

- **Result**: ✅ PASS - All files match the specified pattern

## Scenario Examples

### Scenario 1: NONE match in the selection (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── services/
│   │       └── CreateUserService.ts
│   └── presentation/
│       └── controllers/
│           └── UsersController.ts
```

**Files Under Test (selection):**

```
src/application/services/CreateUserService.ts
src/presentation/controllers/UsersController.ts
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/CreateUserService.ts', '**/presentation/controllers/UsersController.ts'])
  .should()
  .onlyHaveName('*Report.ts')
  .check();
```

**Result**: ❌ FAIL - None of the selected files match `*Report.ts`

---

### Scenario 2: SOME match in the selection (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── services/
│   │       └── CreateUserService.ts
│   └── presentation/
│       └── controllers/
│           └── UsersController.ts
```

**Files Under Test (selection):**

```
src/application/services/CreateUserService.ts
src/presentation/controllers/UsersController.ts
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/CreateUserService.ts', '**/presentation/controllers/UsersController.ts'])
  .should()
  .onlyHaveName('*Service.ts')
  .check();
```

**Result**: ❌ FAIL - Only `CreateUserService.ts` matches; `UsersController.ts` does not

---

### Scenario 3: ALL match in the selection (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── services/
│   │       └── CreateUserService.ts
│   └── presentation/
│       └── controllers/
│           └── UsersController.ts
```

**Files Under Test (selection):**

```
src/application/services/CreateUserService.ts
src/presentation/controllers/UsersController.ts
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/CreateUserService.ts', '**/presentation/controllers/UsersController.ts'])
  .should()
  .onlyHaveName('*User*.ts')
  .check();
```

**Result**: ✅ PASS - All selected files match `*User*.ts`
