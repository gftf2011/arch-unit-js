# Project Files in Directories Should Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the specified directories must have fewer lines of code than the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count below the defined limit.

- It is NOT OK if ANY file has lines of code greater than or equal to the threshold
- It is OK if ALL files have lines of code less than the threshold

This rule promotes:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `should.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have LESS than the specified number, not equal to).

**Note**: The `should.haveLocLessThan` accepts a single numeric value as the threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code LESS than the threshold

- **Result**: ✅ PASS - All files meet the size constraint

**Scenario 2**: ANY files have lines of code GREATER than or EQUAL to the threshold

- **Result**: ❌ FAIL - Files violate the size constraint

## Scenario Examples

### Scenario 1: All files have lines of code LESS than the threshold (across multiple directories)

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts    // 11 LOC (below threshold)
│   │   └── DateHelper.ts      // 12 LOC (below threshold)
│   ├── constants/
│   │   └── AppConstants.ts    // 4 LOC (below threshold)
│   └── services/
│       └── LightService.ts    // 6 LOC (below threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/utils/**', '**/constants/**', '**/services/**'])
  .should()
  .haveLocLessThan(15)
  .check();
```

**Result**: ✅ PASS - All files (11, 12, 4, 6 LOC) are less than 15 lines of code

### Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold (across multiple directories)

```
project/
├── src/
│   ├── services/
│   │   └── EmailService.ts    // 14 LOC (equals threshold)
│   ├── components/
│   │   └── DataTable.ts       // 45 LOC (exceeds threshold)
│   └── legacy/
│       └── LegacyProcessor.ts // 78 LOC (exceeds threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/components/**', '**/legacy/**'])
  .should()
  .haveLocLessThan(14)
  .check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: EmailService.ts (14 LOC - equal to threshold), DataTable.ts (45 LOC), LegacyProcessor.ts (78 LOC)
