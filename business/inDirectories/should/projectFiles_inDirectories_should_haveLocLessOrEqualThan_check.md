# Project Files in Directories Should Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the specified directories must have fewer or equal lines of code than the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count less than or equal to the defined limit.

- It is NOT OK if ANY file has lines of code greater than the threshold
- It is OK if ALL files have lines of code less than or equal to the threshold

This rule promotes:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `should.haveLocLessOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive (files can have LESS than or EQUAL to the specified number).

**Note**: The `should.haveLocLessOrEqualThan` accepts a single numeric value as the threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code LESS than or EQUAL to the threshold

- **Result**: ✅ PASS - All files meet the size constraint

**Scenario 2**: ANY files have lines of code GREATER than the threshold

- **Result**: ❌ FAIL - Files violate the size constraint

## Scenario Examples

### Scenario 1: All files have lines of code LESS than or EQUAL to the threshold (across multiple directories)

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts    // 11 LOC (below threshold)
│   │   └── MathHelper.ts      // 15 LOC (equals threshold)
│   ├── constants/
│   │   └── AppConstants.ts    // 4 LOC (below threshold)
│   └── services/
│       └── EmailService.ts    // 14 LOC (below threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/utils/**', '**/constants/**', '**/services/**'])
  .should()
  .haveLocLessOrEqualThan(15)
  .check();
```

**Result**: ✅ PASS - All files (11, 15, 4, 14 LOC) are less than or equal to 15 lines of code

### Scenario 2: ANY files have lines of code GREATER than the threshold (across multiple directories)

```
project/
├── src/
│   ├── components/
│   │   └── DataTable.ts       // 45 LOC (exceeds threshold)
│   ├── legacy/
│   │   └── LegacyProcessor.ts // 78 LOC (exceeds threshold)
│   └── services/
│       └── EmailService.ts    // 14 LOC (equals threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/components/**', '**/legacy/**', '**/services/**'])
  .should()
  .haveLocLessOrEqualThan(14)
  .check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: DataTable.ts (45 LOC), LegacyProcessor.ts (78 LOC) exceed the 14-line threshold

### Key Difference from `haveLocLessThan`

- `should.haveLocLessThan(10)`: Files must have < 10 LOC (exclusive)
- `should.haveLocLessOrEqualThan(10)`: Files can have ≤ 10 LOC (inclusive)

Use `haveLocLessOrEqualThan` when you want to allow files to have exactly the threshold number of lines, making it slightly more permissive than the strict `haveLocLessThan` rule, while applying the constraint across multiple directories.
