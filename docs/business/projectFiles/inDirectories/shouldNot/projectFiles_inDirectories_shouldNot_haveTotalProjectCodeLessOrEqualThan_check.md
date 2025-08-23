# Project Files in Directories Should NOT Have Total Project Code Less Or Equal Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The SUM of the sizes (in bytes) of all files selected from the UNION of the given directories must NOT be less than or equal to a given percentage of the total project code size. The percentage is a value between 0 and 1, and the comparison is strictly greater than (>) the threshold.

- It is NOT OK if the aggregate bytes of all files from the union of directories is less than or equal to the allowed percentage of the total project bytes
- It is OK only if the aggregate bytes is strictly greater than the allowed percentage of the total project bytes

This rule enforces a minimum proportion for multiple directories (treated as a union): the union must exceed the specified proportion of the entire project size.

**Note**: This rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be greater than 0 and less or equal than 1 (e.g., `0.2` for 20%).

## All Possible Scenarios

**Scenario 1**: The UNION SUM of file bytes is GREATER than the allowed percentage of total project bytes

- Result: ✅ PASS — The union exceeds the minimum required proportion of the project

**Scenario 2**: The UNION SUM of file bytes is LESS than or EQUAL to the allowed percentage of total project bytes

- Result: ❌ FAIL — The union does not exceed the minimum required proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: UNION SUM is GREATER than 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Minimum strictly required for the union = > 2,000 bytes
- Directories under test (union): `src/main/` and `src/presentation/controllers/`
  - `src/main/app.ts` → 1,400 bytes
  - `src/main/bootstrap.ts` → 800 bytes
  - `src/presentation/controllers/UsersController.ts` → 100 bytes
  - UNION SUM = 2,300 bytes

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/main/**', '**/presentation/controllers/**'])
  .shouldNot()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ✅ PASS — UNION SUM 2,300 bytes > 2,000 bytes (20% of 10,000)

---

### Scenario 2: UNION SUM is LESS than or EQUAL to 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Maximum allowed to still PASS would be greater than 2,000 bytes
- Directories under test (union): `src/use-cases/` and `src/presentation/controllers/`
  - `src/use-cases/CreateUserUseCase.ts` → 1,100 bytes
  - `src/use-cases/GetAllUsersUseCase.ts` → 700 bytes
  - `src/presentation/controllers/UsersController.ts` → 200 bytes
  - UNION SUM = 2,000 bytes (exactly at the threshold)

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .shouldNot()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ❌ FAIL — UNION SUM 2,000 bytes ≤ 2,000 bytes (20% of 10,000). The error should list the union and the contributing file(s) with their sizes.
