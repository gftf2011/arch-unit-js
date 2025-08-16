# Project Files in Directories Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the specified directories must NOT have fewer lines of code than the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count greater than or equal to the defined minimum limit.

- It is NOT OK if ANY file has lines of code less than the threshold
- It is OK if ALL files have lines of code greater than or equal to the threshold

This rule enforces minimum code complexity across multiple directories and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `shouldNot.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive (files must have GREATER than or EQUAL to the specified number).

**Note**: The `shouldNot.haveLocLessThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code GREATER than or EQUAL to the threshold

- **Result**: ✅ PASS - All files meet the minimum size requirement

**Scenario 2**: ANY files have lines of code LESS than the threshold

- **Result**: ❌ FAIL - Files violate the minimum size requirement

## Scenario Examples

### Scenario 1: All files have lines of code GREATER than or EQUAL to the threshold (across multiple directories)

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 25 LOC (above threshold)
│   │   └── EmailService.ts    // 20 LOC (equals threshold)
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
  .haveLocLessThan(20)
  .check();
```

**Result**: ✅ PASS - All files (25, 20, 45, 32 LOC) are greater than or equal to 20 lines of code

### Scenario 2: ANY files have lines of code LESS than the threshold (across multiple directories)

```
project/
├── src/
│   ├── services/
│   │   └── StubService.ts     // 10 LOC (below threshold)
│   ├── utils/
│   │   └── Constants.ts       // 3 LOC (below threshold)
│   └── components/
│       └── DataTable.ts       // 45 LOC (above threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/utils/**', '**/components/**'])
  .shouldNot()
  .haveLocLessThan(15)
  .check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: StubService.ts (10 LOC), Constants.ts (3 LOC) are below the 15-line minimum
