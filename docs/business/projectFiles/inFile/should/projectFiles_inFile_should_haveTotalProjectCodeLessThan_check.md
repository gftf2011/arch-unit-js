# Project Files in File Should Have Total Project Code Less Than a Percentage Value

## Business Rule Description

**DESCRIPTION**: The selected file must represent less than a given percentage of the total project code size, where both the file and project sizes are measured in bytes. The percentage is a value between 0 and 1, and the comparison is strictly less than.

- It is NOT OK if the file size in bytes is greater than or equal to the allowed percentage of the total project bytes
- It is OK if the file size in bytes is strictly less than the allowed percentage of the total project bytes

This rule helps prevent overly large, monolithic files by constraining any single file from dominating the project size.

**Note**: The `should.haveTotalProjectCodeLessThan` rule compares raw byte sizes (not LOC). The total project code is calculated from the files included by the current configuration (e.g., `extensionTypes`, `includeMatcher`, `ignoreMatcher`).

**Note**: The percentage must be a number between 0 and 1 (e.g., `0.2` for 20%). Values `<= 0` or `> 1` are invalid and should fail validation.

## All Possible Scenarios

**Scenario 1**: File size is LESS than the allowed percentage of total project bytes

- **Result**: ✅ PASS — The file does not exceed the allowed proportion of the project

**Scenario 2**: File size is GREATER than or EQUAL to the allowed percentage of total project bytes

- **Result**: ❌ FAIL — The file exceeds (or equals) the allowed proportion of the project

## Scenario Examples

Assume the total project code size is 10,000 bytes (as determined by the configured matchers).

### Scenario 1: File has bytes LESS than 20% of total (PASS)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed for one file = 2,000 bytes
- File under test: `src/utils/StringHelper.ts` → 1,450 bytes

**API Usage:**

```typescript
projectFiles()
  .inFile('**/utils/StringHelper.ts')
  .should()
  .haveTotalProjectCodeLessThan(0.2)
  .check();
```

**Result**: ✅ PASS — 1,450 bytes < 2,000 bytes (20% of 10,000)

---

### Scenario 2: File has bytes GREATER than or EQUAL to 20% of total (FAIL)

- Total project: 10,000 bytes
- Percentage threshold: 0.2 (20%) → Max allowed = 2,000 bytes
- File under test: `src/services/EmailService.ts` → 2,050 bytes

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/EmailService.ts')
  .should()
  .haveTotalProjectCodeLessThan(0.2)
  .check();
```

**Result**: ❌ FAIL — 2,050 bytes ≥ 2,000 bytes (20% of 10,000)
