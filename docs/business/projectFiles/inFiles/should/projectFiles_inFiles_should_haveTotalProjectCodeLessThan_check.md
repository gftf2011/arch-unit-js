# Project Files in Files Should Have Total Project Code Less Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The SUM of the sizes (in bytes) of all files selected via `inFiles([...])` must be strictly less than a given percentage of the total project code size. The percentage is a value between 0 and 1, and the comparison is strictly less than (<).

- It is NOT OK if the aggregate bytes of the selected files is greater than or equal to the allowed percentage of the total project bytes
- It is OK only if the aggregate bytes is strictly less than the allowed percentage of the total project bytes

This rule constrains multiple files (treated as a set) from jointly dominating the overall project size. Unlike the “less or equal than” variant, equality at the threshold is NOT allowed here.

**Note**: The `should.haveTotalProjectCodeLessThan` rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be greater than 0 and less or equal than 1 (e.g., `0.2` for 20%).

## All Possible Scenarios

- Selected files = multiple explicit files (via `inFiles([...])`)

**Scenario 1**: The SUM of file bytes is strictly LESS than the allowed percentage of total project bytes

- Result: ✅ PASS — The selection is below the allowed proportion of the project

**Scenario 2**: The SUM of file bytes is GREATER than or EQUAL to the allowed percentage of total project bytes

- Result: ❌ FAIL — The selection meets or exceeds the allowed proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: SUM is strictly LESS than 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed for the selection (strict) < 2,000 bytes
- Files under test:
  - `src/use-cases/CreateUserUseCase.ts` → 1,100 bytes
  - `src/use-cases/GetAllUsersUseCase.ts` → 800 bytes
  - SELECTION SUM = 1,900 bytes (strictly below 2,000)

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/CreateUserUseCase.ts', '**/use-cases/GetAllUsersUseCase.ts'])
  .should()
  .haveTotalProjectCodeLessThan(0.2)
  .check();
```

**Result**: ✅ PASS — SELECTION SUM 1,900 bytes < 2,000 bytes (20% of 10,000)

---

### Scenario 2: SUM is GREATER than or EQUAL to 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Strict bound = 2,000 bytes
- Files under test:
  - `src/main/app.ts` → 1,100 bytes
  - `src/presentation/controllers/UsersController.ts` → 900 bytes
  - SELECTION SUM = 2,000 bytes (equals the threshold; not allowed)

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/main/app.ts', '**/presentation/controllers/UsersController.ts'])
  .should()
  .haveTotalProjectCodeLessThan(0.2)
  .check();
```

**Result**: ❌ FAIL — SELECTION SUM 2,000 bytes ≥ 2,000 bytes (20% of 10,000).
