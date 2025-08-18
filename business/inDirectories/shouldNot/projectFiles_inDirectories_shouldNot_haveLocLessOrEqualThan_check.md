# Project Files in Directories Should NOT Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the specified directories must NOT have fewer or equal lines of code than the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count greater than the defined minimum limit.

- It is NOT OK if ANY file has lines of code less than or equal to the threshold
- It is OK if ALL files have lines of code greater than the threshold

This rule enforces minimum code complexity across multiple directories and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `shouldNot.haveLocLessOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have GREATER than the specified number, not equal to).

**Note**: The `shouldNot.haveLocLessOrEqualThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code GREATER than the threshold

- **Result**: ✅ PASS - All files meet the minimum size requirement

**Scenario 2**: ANY files have lines of code LESS than or EQUAL to the threshold

- **Result**: ❌ FAIL - Files violate the minimum size requirement

## Scenario Examples

### Scenario 1: All files have lines of code GREATER than the threshold (across multiple directories)

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 25 LOC (above threshold)
│   │   └── EmailService.ts    // 27 LOC (above threshold)
│   ├── components/
│   │   └── DataTable.ts       // 45 LOC (above threshold)
│   └── utils/
│       └── MathHelper.ts      // 32 LOC (above threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/components/**', '**/utils/**'])
  .shouldNot()
  .haveLocLessOrEqualThan(15)
  .check();
```

**Result**: ✅ PASS - All files (25, 27, 45, 32 LOC) are greater than 15 lines of code

### Scenario 2: ANY files have lines of code LESS than or EQUAL to the threshold (across multiple directories)

```
project/
├── src/
│   ├── services/
│   │   └── StubService.ts     // 13 LOC (below threshold)
│   ├── utils/
│   │   ├── Constants.ts       // 15 LOC (equals threshold)
│   │   └── Helpers.ts         // 9 LOC (below threshold)
│   └── components/
│       └── DataTable.ts       // 45 LOC (above threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/utils/**', '**/components/**'])
  .shouldNot()
  .haveLocLessOrEqualThan(15)
  .check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: StubService.ts (13 LOC), Constants.ts (15 LOC - equals threshold), Helpers.ts (9 LOC) are less than or equal to the 15-line minimum

### Key Difference from `shouldNot.haveLocLessThan`

- `shouldNot.haveLocLessThan(15)`: Files must have ≥ 15 LOC (inclusive minimum)
- `shouldNot.haveLocLessOrEqualThan(15)`: Files must have > 15 LOC (exclusive minimum)

Use `shouldNot.haveLocLessOrEqualThan` when you want to enforce a strict minimum where files cannot have exactly the threshold number of lines, applying the constraint across multiple directories.
