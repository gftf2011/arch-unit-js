# Project Files in Files Should NOT Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: None of the selected files may have fewer or equal lines of code than the specified threshold. The rule passes only when EACH file in the selection has more lines of code than the defined limit.

- It is NOT OK if ANY selected file has LOC less than or equal to the threshold
- It is OK only if ALL selected files have LOC strictly greater than the threshold

This rule enforces a minimum implementation size across a set of files, discouraging overly small or trivial modules.

**Note**: The `shouldNot.haveLocLessOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive in the violation check (≤ threshold violates the rule).

**Note**: The `shouldNot.haveLocLessOrEqualThan` accepts a single numeric value as the threshold parameter.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: All selected files have LOC GREATER than the threshold

- **Result**: ✅ PASS — The selection meets the minimum size requirement

**Scenario 2**: At least one selected file has LOC LESS than or EQUAL to the threshold

- **Result**: ❌ FAIL — The selection violates the minimum size requirement

## Scenario Examples

### Scenario 1: All selected files have LOC > threshold (PASS)

```
project/
├── src/
│   ├── services/
│   │   ├── EmailService.ts           // 18 LOC (> 15)
│   │   └── NotificationService.ts    // 17 LOC (> 15)
```

**File Content (illustrative):**

```typescript
// src/services/EmailService.ts (18 LOC)
export class EmailService {
  /* ... 18 lines of actual code ... */
}

// src/services/NotificationService.ts (17 LOC)
export class NotificationService {
  /* ... 17 lines of actual code ... */
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmailService.ts', '**/services/NotificationService.ts'])
  .shouldNot()
  .haveLocLessOrEqualThan(15)
  .check();
```

**Result**: ✅ PASS — Both files are > 15 LOC

---

### Scenario 2: Some files have LOC ≤ threshold (FAIL)

```
project/
├── src/
│   ├── utils/
│   │   └── Constants.ts           // 15 LOC (≤ 15) ❌
│   └── services/
│       └── EmailService.ts        // 18 LOC (> 15)
```

**File Content (illustrative):**

```typescript
// src/utils/Constants.ts (15 LOC — equals threshold)
export const API = { BASE_URL: 'https://api.example.com', TIMEOUT: 5000 };
export const UI = { PAGE_SIZE: 10, THEME: 'light' };
export const VERSION = '1.0.0';
// ... total of 15 lines of real code
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/utils/Constants.ts', '**/services/EmailService.ts'])
  .shouldNot()
  .haveLocLessOrEqualThan(15)
  .check();
```

**Result**: ❌ FAIL — `Constants.ts` is 15 LOC (≤ 15)
