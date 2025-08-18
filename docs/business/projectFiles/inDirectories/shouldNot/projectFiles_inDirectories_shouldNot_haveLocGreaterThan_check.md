# Project Files in Directories Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the specified directories must NOT have more lines of code than the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count less than or equal to the defined maximum limit.

- It is NOT OK if ANY file has lines of code greater than the threshold
- It is OK if ALL files have lines of code less than or equal to the threshold

This rule promotes:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `shouldNot.haveLocGreaterThan` rule counts only actual code lines, excluding blank lines and comments. The constraint is an inclusive maximum (files must have LESS than or EQUAL to the specified number).

**Note**: The `shouldNot.haveLocGreaterThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code LESS than or EQUAL to the threshold

- **Result**: ✅ PASS - All files meet the maximum size constraint

**Scenario 2**: ANY files have lines of code GREATER than the threshold

- **Result**: ❌ FAIL - Files violate the maximum size constraint

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
  .shouldNot()
  .haveLocGreaterThan(15)
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
  .shouldNot()
  .haveLocGreaterThan(14)
  .check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: DataTable.ts (45 LOC), LegacyProcessor.ts (78 LOC) exceed the 14-line maximum

Use `shouldNot.haveLocGreaterThan` across multiple directories when you want to enforce a strict upper bound on file size to prevent overly complex files and promote better organization and maintainability throughout broader areas of the codebase.
