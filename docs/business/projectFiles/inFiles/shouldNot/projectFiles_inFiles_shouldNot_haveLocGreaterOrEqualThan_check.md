# Project Files in Files Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Every selected file must have lines of code strictly less than the specified threshold. The rule passes only when EACH file in the selection is below the maximum LOC limit.

- It is NOT OK if ANY selected file has lines of code greater than or equal to the threshold
- It is OK only if ALL selected files have lines of code less than the threshold

This rule promotes:

- Better readability and reduced complexity across modules
- Smaller, composable files that are easier to test and maintain
- Avoidance of “god files” or overly complex modules in a codebase

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have LESS than the specified number; equal is considered a violation).

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: All selected files have LOC LESS than the threshold

- **Result**: ✅ PASS — The entire selection satisfies the maximum size constraint

**Scenario 2**: At least one selected file has LOC GREATER than or EQUAL to the threshold

- **Result**: ❌ FAIL — The selection violates the maximum size constraint

## Scenario Examples

### Scenario 1: All selected files have LOC < threshold (PASS)

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts          // 8 LOC (< 16)
│   │   └── DateHelper.ts            // 10 LOC (< 16)
```

**File Content (illustrative):**

```typescript
// src/utils/StringHelper.ts (8 lines of actual code)
export class StringHelper {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }
}

// src/utils/DateHelper.ts (10 lines of actual code)
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
  .haveLocGreaterOrEqualThan(16)
  .check();
```

**Result**: ✅ PASS — Both files are below 16 LOC

---

### Scenario 2: Some files have LOC ≥ threshold (FAIL)

```
project/
├── src/
│   ├── services/
│   │   ├── EmailService.ts        // 18 LOC (≥ 16) ❌
│   │   └── NotificationService.ts // 14 LOC (< 16)
```

**File Content (illustrative):**

```typescript
// src/services/EmailService.ts (18 LOC — equals/exceeds threshold)
export class EmailService {
  /* ... 18 lines of actual code ... */
}

// src/services/NotificationService.ts (14 LOC — below threshold)
export class NotificationService {
  /* ... 14 lines of actual code ... */
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmailService.ts', '**/services/NotificationService.ts'])
  .shouldNot()
  .haveLocGreaterOrEqualThan(16)
  .check();
```

**Result**: ❌ FAIL — `EmailService.ts` has 18 LOC (≥ 16)

---

### Key Difference from `shouldNot.haveLocGreaterThan`:

- **`shouldNot.haveLocGreaterThan(16)`**: Every file can have ≤ 16 LOC (inclusive maximum)
- **`shouldNot.haveLocGreaterOrEqualThan(16)`**: Every file must have < 16 LOC (exclusive maximum)

Use `shouldNot.haveLocGreaterOrEqualThan` when you need a strict upper bound that does not allow the selected files to have exactly the threshold number of lines or more.
