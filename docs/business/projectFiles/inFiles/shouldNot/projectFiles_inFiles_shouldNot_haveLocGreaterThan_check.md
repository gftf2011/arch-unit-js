# Project Files in Files Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: None of the selected files may have more lines of code than the specified threshold. The rule passes only when EACH file in the selection is less than or equal to the maximum limit.

- It is NOT OK if ANY selected file has LOC greater than the threshold
- It is OK only if ALL selected files have LOC less than or equal to the threshold

This rule helps control file size and complexity across a set of files by discouraging overly large implementations.

**Note**: The `shouldNot.haveLocGreaterThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive for violation: LOC strictly greater than the threshold violates the rule; equal is allowed.

**Note**: The `shouldNot.haveLocGreaterThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: All selected files have LOC LESS than or EQUAL to the threshold

- **Result**: ✅ PASS — The entire selection respects the maximum size limit

**Scenario 2**: At least one selected file has LOC GREATER than the threshold

- **Result**: ❌ FAIL — The selection violates the maximum size requirement

## Scenario Examples

### Scenario 1: All selected files have LOC ≤ threshold (PASS)

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts          // 4 LOC (≤ 16)
│   │   └── DateHelper.ts            // 4 LOC (≤ 16)
```

**File Content (illustrative):**

```typescript
// src/utils/StringHelper.ts (4 LOC)
export class StringHelper {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }
}

// src/utils/DateHelper.ts (4 LOC)
export class DateHelper {
  static nowIso(): string {
    return new Date().toISOString();
  }
  static addDays(d: Date, days: number): Date {
    const n = new Date(d);
    n.setDate(n.getDate() + days);
    return n;
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/utils/StringHelper.ts', '**/utils/DateHelper.ts'])
  .shouldNot()
  .haveLocGreaterThan(16)
  .check();
```

**Result**: ✅ PASS — Both files are ≤ 16 LOC

---

### Scenario 2: Some files have LOC > threshold (FAIL)

```
project/
├── src/
│   ├── services/
│   │   ├── EmailService.ts        // 18 LOC (> 16) ❌
│   │   └── NotificationService.ts // 14 LOC (≤ 16)
```

**File Content (illustrative):**

```typescript
// src/services/EmailService.ts (18 LOC — above threshold)
export class EmailService {
  /* ... 18 lines of actual code ... */
}

// src/services/NotificationService.ts (14 LOC — within limit)
export class NotificationService {
  /* ... 14 lines of actual code ... */
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmailService.ts', '**/services/NotificationService.ts'])
  .shouldNot()
  .haveLocGreaterThan(16)
  .check();
```

**Result**: ❌ FAIL — `EmailService.ts` has 18 LOC (> 16)
