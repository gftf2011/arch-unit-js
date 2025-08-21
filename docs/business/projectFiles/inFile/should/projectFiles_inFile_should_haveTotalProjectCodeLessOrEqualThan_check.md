# Project Files in File Should Have Total Project Code Less Or Equal Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The selected file must represent less than or equal to a given percentage of the total project code size, where both the file and project sizes are measured in bytes. The percentage is a value between 0 and 1, and the comparison is less than or equal to (≤).

- It is NOT OK if the file size in bytes is greater than the allowed percentage of the total project bytes
- It is OK if the file size in bytes is less than or equal to the allowed percentage of the total project bytes

This rule helps prevent overly large, monolithic files by constraining any single file from dominating the project size, allowing equality at the threshold.

**Note**: The `should.haveTotalProjectCodeLessOrEqualThan` rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be greater than 0 and less or equal than 1 (e.g., `0.2` for 20%).

## All Possible Scenarios

**Scenario 1**: File size is LESS than or EQUAL to the allowed percentage of total project bytes

- **Result**: ✅ PASS — The file does not exceed the allowed proportion of the project

**Scenario 2**: File size is GREATER than the allowed percentage of total project bytes

- **Result**: ❌ FAIL — The file exceeds the allowed proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: File has bytes LESS than or EQUAL to 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed for one file = 2,000 bytes
- File under test: `src/utils/StringHelper.ts` → 2,000 bytes (exactly at the threshold)

**API Usage:**

```typescript
projectFiles()
  .inFile('**/utils/StringHelper.ts')
  .should()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ✅ PASS — 2,000 bytes ≤ 2,000 bytes (20% of 10,000)

---

### Scenario 2: File has bytes GREATER than 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed = 2,000 bytes
- File under test: `src/services/EmailService.ts` → 2,050 bytes

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/EmailService.ts')
  .should()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ❌ FAIL — 2,050 bytes > 2,000 bytes (20% of 10,000). The error should include the file path and threshold used.
