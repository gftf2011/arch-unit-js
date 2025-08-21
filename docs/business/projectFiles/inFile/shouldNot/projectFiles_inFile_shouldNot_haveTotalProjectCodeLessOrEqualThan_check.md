# Project Files in File Should NOT Have Total Project Code Less Or Equal Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The selected file must NOT represent less than or equal to a given percentage of the total project code size (in bytes). The percentage is a value between 0 and 1, and the comparison is strictly greater than (>) the threshold.

- It is NOT OK if the file size in bytes is less than or equal to the allowed percentage of the total project bytes
- It is OK only if the file size in bytes is strictly greater than the allowed percentage of the total project bytes

This rule prevents tiny or trivial files when a minimum proportion of the project’s code size is expected for that file.

**Note**: This rule compares raw byte sizes (not LOC). The total project code is calculated from files selected by your configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be greater than 0 and less or equal than 1 (e.g., `0.2` for 20%).

## All Possible Scenarios

**Scenario 1**: File bytes are GREATER than the allowed percentage of total project bytes

- **Result**: ✅ PASS — The file exceeds the minimum required proportion of the project

**Scenario 2**: File bytes are LESS than or EQUAL to the allowed percentage of total project bytes

- **Result**: ❌ FAIL — The file does not exceed the minimum required proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: File has bytes GREATER than 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Minimum strictly required for one file = > 2,000 bytes
- File under test: `src/services/EmailService.ts` → 2,500 bytes

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/EmailService.ts')
  .shouldNot()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ✅ PASS — 2,500 bytes > 2,000 bytes (20% of 10,000)

---

### Scenario 2: File has bytes LESS than or EQUAL to 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Minimum strictly required must be greater than 2,000 bytes
- File under test: `src/utils/StringHelper.ts` → 2,000 bytes (exactly at the threshold)

**API Usage:**

```typescript
projectFiles()
  .inFile('**/utils/StringHelper.ts')
  .shouldNot()
  .haveTotalProjectCodeLessOrEqualThan(0.2)
  .check();
```

**Result**: ❌ FAIL — 2,000 bytes ≤ 2,000 bytes (20% of 10,000). The error should include the file path and the threshold used.
