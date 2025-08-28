# Project Files in Files Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Every selected file must have lines of code greater than or equal to the specified threshold. The rule passes only when EACH file in the selection meets or exceeds the minimum LOC limit.

- It is NOT OK if ANY selected file has LOC less than the threshold
- It is OK only if ALL selected files have LOC greater than or equal to the threshold

This rule enforces a minimum implementation size across a group of files, helping to prevent:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations scattered across the codebase
- Modules that should contain more substantial logic

**Note**: The `should.haveLocGreaterOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive (files must have GREATER than or EQUAL to the specified number).

**Note**: The `should.haveLocGreaterOrEqualThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: All selected files have LOC GREATER than or EQUAL to the threshold

- **Result**: ✅ PASS — The entire selection meets or exceeds the minimum size requirement

**Scenario 2**: At least one selected file has LOC LESS than the threshold

- **Result**: ❌ FAIL — The selection violates the minimum size requirement

**Scenario 3 (Edge)**: No files selected (empty array)

- **Result**: ❌ FAIL — Invalid input; nothing to check against the threshold

## Scenario Examples

### Scenario 1: All selected files have LOC ≥ threshold (PASS)

```
project/
├── src/
│   ├── services/
│   │   ├── EmailService.ts      // 20 LOC (≥ 15)
│   │   └── NotificationService.ts // 18 LOC (≥ 15)
```

**File Content (illustrative):**

```typescript
// src/services/EmailService.ts (20 LOC)
export class EmailService {
  /* ... 20 lines of actual code ... */
}

// src/services/NotificationService.ts (18 LOC)
export class NotificationService {
  /* ... 18 lines of actual code ... */
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmailService.ts', '**/services/NotificationService.ts'])
  .should()
  .haveLocGreaterOrEqualThan(15)
  .check();
```

**Result**: ✅ PASS — Both files meet the ≥ 15 LOC requirement

---

### Scenario 2: Some files have LOC < threshold (FAIL)

```
project/
├── src/
│   ├── services/
│   │   ├── EmailService.ts        // 20 LOC (≥ 15)
│   │   └── StubNotification.ts    // 10 LOC (< 15)
```

**File Content (illustrative):**

```typescript
// src/services/StubNotification.ts (10 LOC)
export class StubNotification {
  /* ... 10 lines of actual code ... */
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmailService.ts', '**/services/StubNotification.ts'])
  .should()
  .haveLocGreaterOrEqualThan(15)
  .check();
```

**Result**: ❌ FAIL — `StubNotification.ts` has only 10 LOC (< 15)

---

### Scenario 3 (Edge): Empty selection (FAIL)

```
project/
└── src/
    └── services/
        └── (no files provided)
```

**API Usage:**

```typescript
await projectFiles().inFiles([]).should().haveLocGreaterOrEqualThan(15).check();
```

**Result**: ❌ FAIL — No files were provided for checking

---

### Key Difference from `should.haveLocGreaterThan`:

- **`should.haveLocGreaterThan(15)`**: Every file must have > 15 LOC (exclusive minimum)
- **`should.haveLocGreaterOrEqualThan(15)`**: Every file can have ≥ 15 LOC (inclusive minimum)

Use `should.haveLocGreaterOrEqualThan` when you want the minimum to be inclusive of the exact threshold value across multiple files.
