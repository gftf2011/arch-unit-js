# Project Files in Directories Should NOT Have Total Project Code Less Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The SUM of the sizes (in bytes) of all files selected from the UNION of the given directories must NOT be less than a given percentage of the total project code size. The percentage is a value between 0 and 1.

- It is NOT OK if the aggregate bytes of all files from the union of directories is less than the allowed percentage of the total project bytes
- It is OK if the aggregate bytes is greater than or equal to the allowed percentage of the total project bytes

This rule enforces a minimum proportion for multiple directories (treated as a union), preventing the union from being too small relative to the entire project.

**Note**: This rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be greater than 0 and less or equal than 1 (e.g., `0.2` for 20%).

## All Possible Scenarios

**Scenario 1**: The UNION SUM of file bytes is GREATER than or EQUAL to the allowed percentage of total project bytes

- **Result**: ✅ PASS — The union meets the minimum proportion of the project

**Scenario 2**: The UNION SUM of file bytes is LESS than the allowed percentage of total project bytes

- **Result**: ❌ FAIL — The union is below the minimum proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: UNION SUM is GREATER than or EQUAL to 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Minimum required for the union = 2,000 bytes
- Directories under test (union): `src/main/` and `src/presentation/controllers/`
  - `src/main/app.ts` → 1,400 bytes
  - `src/main/bootstrap.ts` → 800 bytes
  - `src/presentation/controllers/UsersController.ts` → 75 bytes
  - UNION SUM = 2,275 bytes

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/main/**', '**/presentation/controllers/**'])
  .shouldNot()
  .haveTotalProjectCodeLessThan(0.2)
  .check();
```

**Result**: ✅ PASS — UNION SUM 2,275 bytes ≥ 2,000 bytes (20% of 10,000)

---

### Scenario 2: UNION SUM is LESS than 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Minimum required = 2,000 bytes
- Directories under test (union): `src/use-cases/` and `src/presentation/controllers/`
  - `src/use-cases/CreateUserUseCase.ts` → 1,100 bytes
  - `src/use-cases/GetAllUsersUseCase.ts` → 700 bytes
  - `src/presentation/controllers/UsersController.ts` → 150 bytes
  - UNION SUM = 1,950 bytes

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/use-cases/**', '**/presentation/controllers/**'])
  .shouldNot()
  .haveTotalProjectCodeLessThan(0.2)
  .check();
```

**Result**: ❌ FAIL — UNION SUM 1,950 bytes < 2,000 bytes (20% of 10,000)
