# Project Files in Files Should NOT Only Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: The set of files explicitly selected via `inFiles([...])` must NOT all have names that match the specified pattern. The rule passes when at least one selected file does not match the pattern (i.e., names are mixed or none match). It fails when every selected file name matches the pattern.

- It is OK if NONE of the selected files match the pattern
- It is OK if SOME of the selected files match the pattern
- It is NOT OK if ALL selected files match the pattern

This rule prevents over-constraining naming across a chosen set of files by disallowing the situation where all selected files conform to the same specified pattern.

**Note**: The `shouldNot.onlyHaveName` rule accepts only a single pattern (string), not an array of patterns.

**Note**: Pattern matching uses glob semantics and honors the current configuration (e.g., `includeMatcher`, `ignoreMatcher`, `extensionTypes`).

## All Possible Scenarios

**Scenario 1**: Selection has files but NONE match the pattern

- **Result**: ✅ PASS - No file matches the specified pattern, so not “all match”

**Scenario 2**: Selection has files and SOME match the pattern

- **Result**: ✅ PASS - Mixed names; not all match the pattern

**Scenario 3**: Selection has files and ALL files match the pattern

- **Result**: ❌ FAIL - All files match the pattern, which is prohibited

## Scenario Examples

### Scenario 1: NONE match in the selection (PASS)

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
  .shouldNot()
  .onlyHaveName('*Report.ts')
  .check();
```

**Result**: ✅ PASS - None of the selected files match `*Report.ts`

---

### Scenario 2: SOME match in the selection (PASS)

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
  .shouldNot()
  .onlyHaveName('*Service.ts')
  .check();
```

**Result**: ✅ PASS - Only `CreateUserService.ts` matches; `UsersController.ts` does not, so not “all match”

---

### Scenario 3: ALL match in the selection (FAIL)

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
  .shouldNot()
  .onlyHaveName('*User*.ts')
  .check();
```

**Result**: ❌ FAIL - All selected files match `*User*.ts`
