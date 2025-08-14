# Project Files in Directories Should Have Greater L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the specified directories must have lines of code greater than the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count above the defined minimum limit.

- It is NOT OK if ANY file has lines of code less than or equal to the threshold
- It is OK if ALL files have lines of code greater than the threshold

This rule enforces minimum code complexity across multiple directories and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `should.haveLocGreaterThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have GREATER than the specified number, not equal to).

**Note**: The `should.haveLocGreaterThan` accepts a single numeric value as the minimum threshold parameter.

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
│   │   ├── UserService.ts     // 27 LOC (above threshold)
│   │   └── EmailService.ts    // 18 LOC (above threshold)
│   ├── components/
│   │   └── DataTable.ts       // 45 LOC (above threshold)
│   └── utils/
│       └── Helpers.ts         // 22 LOC (above threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/components/**', '**/utils/**'])
  .should()
  .haveLocGreaterThan(15)
  .check();
```

**Result**: ✅ PASS - All files (27, 18, 45, 22 LOC) are greater than 15 lines of code

### Scenario 2: ANY files have lines of code LESS than or EQUAL to the threshold (across multiple directories)

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 25 LOC (above threshold)
│   │   └── StubService.ts     // 13 LOC (below threshold)
│   ├── components/
│   │   └── DataTable.ts       // 45 LOC (above threshold)
│   └── utils/
│       ├── Constants.ts       // 15 LOC (equals threshold)
│       └── Helpers.ts         // 9 LOC (below threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/components/**', '**/utils/**'])
  .should()
  .haveLocGreaterThan(15)
  .check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: StubService.ts (13 LOC), Constants.ts (15 LOC - equals threshold), Helpers.ts (9 LOC) are less than or equal to the 15-line minimum

Use `should.haveLocGreaterThan` when you want to enforce a strict minimum where files cannot have exactly the threshold number of lines or fewer, ensuring all files across multiple directories meet a substantial implementation standard.