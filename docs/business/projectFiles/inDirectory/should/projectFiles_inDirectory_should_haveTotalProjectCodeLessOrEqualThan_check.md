# Project Files in Directory Should Have Total Project Code Less Or Equal Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The SUM of the sizes (in bytes) of all files selected from the given directory must be less than or equal to a given percentage of the total project code size. The percentage is a value between 0 and 1, and the comparison is less than or equal to (≤).

- It is NOT OK if the sum of bytes of all files in the directory is greater than the allowed percentage of the total project bytes
- It is OK only if the sum of bytes is less than or equal to the allowed percentage of the total project bytes

This rule constrains a directory (module, layer, or slice) from dominating the overall project size, allowing equality at the threshold.

**Note**: The `should.haveTotalProjectCodeLessOrEqualThan` rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be greater than 0 and less or equal than 1 (e.g., `0.2` for 20%).

## All Possible Scenarios

**Scenario 1**: The SUM of file bytes in the directory is LESS than or EQUAL to the allowed percentage of total project bytes

- **Result**: ✅ PASS — The directory does not exceed the allowed proportion of the project

**Scenario 2**: The SUM of file bytes in the directory is GREATER than the allowed percentage of total project bytes

- **Result**: ❌ FAIL — The directory exceeds the allowed proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: SUM of files in the directory is LESS than or EQUAL to 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed for the directory = 2,000 bytes
- Directory under test: `src/use-cases/`
  - `CreateUserUseCase.ts` → 1,100 bytes
  - `GetAllUsersUseCase.ts` → 700 bytes
  - `UsersController.ts` → 200 bytes
  - SUM = 2,000 bytes (exactly at the threshold)

**API Usage:**

```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .should()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ✅ PASS — SUM 2,000 bytes ≤ 2,000 bytes (20% of 10,000)

---

### Scenario 2: SUM of files in the directory is GREATER than 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed = 2,000 bytes
- Directory under test: `src/main/`
  - `app.ts` → 1,400 bytes
  - `bootstrap.ts` → 800 bytes
  - SUM = 2,200 bytes

**API Usage:**

```typescript
projectFiles().inDirectory('**/main/**').should().haveTotalProjectCodeLessOrEqualThan(0.2).check();
```

**Result**: ❌ FAIL — SUM 2,200 bytes > 2,000 bytes (20% of 10,000). The error should list the directory and the contributing file(s) with their sizes.
