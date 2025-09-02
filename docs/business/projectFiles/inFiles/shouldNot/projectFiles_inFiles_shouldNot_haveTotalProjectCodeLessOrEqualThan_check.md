# Project Files in Files Should NOT Have Total Project Code Less Or Equal Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The SUM of the sizes (in bytes) of all files selected via `inFiles([...])` must NOT be less than or equal to a given percentage of the total project code size. In other words, the aggregate size must be strictly GREATER than the specified percentage of total project bytes. The percentage is a value between 0 and 1.

- It is NOT OK if the aggregate bytes of the selected files is less than or equal to the allowed percentage of the total project bytes
- It is OK only if the aggregate bytes is strictly greater than the allowed percentage of the total project bytes

This rule ensures a minimum proportional footprint for a chosen set of files relative to the project, disallowing “too small” selections at or under the threshold.

**Note**: The `shouldNot.haveTotalProjectCodeLessOrEqualThan` rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be greater than 0 and less or equal than 1 (e.g., `0.2` for 20%).

## All Possible Scenarios

- Selected files = multiple explicit files (via `inFiles([...])`)

**Scenario 1**: The SUM of file bytes is GREATER than the allowed percentage of total project bytes

- Result: ✅ PASS — The selection exceeds the minimum proportion of the project

**Scenario 2**: The SUM of file bytes is LESS than or EQUAL to the allowed percentage of total project bytes

- Result: ❌ FAIL — The selection is at or under the threshold (violates the rule)

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: SUM is GREATER than 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Minimum required for the selection > 2,000 bytes
- Files under test:
  - `src/main/app.ts` → 1,400 bytes
  - `src/presentation/controllers/UsersController.ts` → 900 bytes
  - SELECTION SUM = 2,300 bytes (strictly greater than 2,000)

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/main/app.ts', '**/presentation/controllers/UsersController.ts'])
  .shouldNot()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ✅ PASS — SELECTION SUM 2,300 bytes > 2,000 bytes (20% of 10,000)

---

### Scenario 2: SUM is LESS than or EQUAL to 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed (for violation check) = 2,000 bytes
- Files under test:
  - `src/use-cases/CreateUserUseCase.ts` → 1,100 bytes
  - `src/use-cases/GetAllUsersUseCase.ts` → 900 bytes
  - SELECTION SUM = 2,000 bytes (exactly at the threshold)

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/use-cases/CreateUserUseCase.ts', '**/use-cases/GetAllUsersUseCase.ts'])
  .shouldNot()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ❌ FAIL — SELECTION SUM 2,000 bytes ≤ 2,000 bytes (20% of 10,000)
