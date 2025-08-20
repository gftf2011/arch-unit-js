# Project Files in Directory Should Have Total Project Code Less Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The SUM of the sizes (in bytes) of all files selected from the given directory must be less than a given percentage of the total project code size. The percentage is a value between 0 and 1, and the comparison is strictly less than.

- It is NOT OK if the sum of bytes of all files in the directory is greater than or equal to the allowed percentage of the total project bytes
- It is OK only if the sum of bytes is strictly less than the allowed percentage of the total project bytes

This rule constrains a directory (module, layer, or slice) from dominating the overall project size.

**Note**: The `should.haveTotalProjectCodeLessThan` rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be a number between 0 and 1 (e.g., `0.2` for 20%). Values `<= 0` or `> 1` are invalid.

## All Possible Scenarios

**Scenario 1**: The SUM of file bytes in the directory is LESS than the allowed percentage of total project bytes

- **Result**: ✅ PASS — The directory does not exceed the allowed proportion of the project

**Scenario 2**: The SUM of file bytes in the directory is GREATER than or EQUAL to the allowed percentage of total project bytes

- **Result**: ❌ FAIL — The directory exceeds (or equals) the allowed proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: SUM of files in the directory is LESS than 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed for the directory = 2,000 bytes
- Directory under test: `src/use-cases/`
  - `CreateUserUseCase.ts` → 1,100 bytes
  - `GetAllUsersUseCase.ts` → 700 bytes
  - SUM = 1,800 bytes

**API Usage:**

```typescript
projectFiles().inDirectory('**/use-cases/**').should().haveTotalProjectCodeLessThan(0.2).check();
```

**Result**: ✅ PASS — SUM 1,800 bytes < 2,000 bytes (20% of 10,000)

---

### Scenario 2: SUM of files in the directory is GREATER than or EQUAL to 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed = 2,000 bytes
- Directory under test: `src/main/`
  - `app.ts` → 1,400 bytes
  - `bootstrap.ts` → 800 bytes
  - SUM = 2,200 bytes

**API Usage:**

```typescript
projectFiles().inDirectory('**/main/**').should().haveTotalProjectCodeLessThan(0.2).check();
```

**Result**: ❌ FAIL — SUM 2,200 bytes ≥ 2,000 bytes (20% of 10,000). The error should list the directory and the contributing file(s) with their sizes.
