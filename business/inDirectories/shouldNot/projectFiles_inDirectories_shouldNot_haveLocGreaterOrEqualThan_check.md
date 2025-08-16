# Project Files in Directories Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the specified directories must NOT have lines of code greater than or equal to the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count less than the defined maximum limit.

- It is NOT OK if ANY file has lines of code greater than or equal to the threshold
- It is OK if ALL files have lines of code less than the threshold

This rule promotes across multiple directories:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have LESS than the specified number, not equal to).

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code LESS than the threshold

- **Result**: ✅ PASS - All files meet the maximum size constraint

**Scenario 2**: ANY files have lines of code GREATER than or EQUAL to the threshold

- **Result**: ❌ FAIL - Files violate the maximum size constraint

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
│   └── validators/
│       └── InputValidator.ts  // 15 LOC (below threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/utils/**', '**/constants/**', '**/validators/**'])
  .shouldNot()
  .haveLocGreaterOrEqualThan(16)
  .check();
```

**Result**: ✅ PASS - All files (11, 12, 4, 15 LOC) are less than 16 lines of code

### Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold (across multiple directories)

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 8 LOC (below threshold)
│   │   └── EmailService.ts    // 18 LOC (equals threshold)
│   ├── components/
│   │   └── DataTable.ts       // 47 LOC (exceeds threshold)
│   └── legacy/
│       └── LegacyProcessor.ts // 78 LOC (exceeds threshold)
```

**API Usage:**

```typescript
projectFiles()
  .inDirectories(['**/services/**', '**/components/**', '**/legacy/**'])
  .shouldNot()
  .haveLocGreaterOrEqualThan(18)
  .check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: EmailService.ts (18 LOC - equals threshold), DataTable.ts (47 LOC), LegacyProcessor.ts (78 LOC) are greater than or equal to the 18-line maximum

### Key Difference from `shouldNot.haveLocGreaterThan`

- **`shouldNot.haveLocGreaterThan(15)`**: Files can have ≤ 15 LOC (inclusive maximum)
- **`shouldNot.haveLocGreaterOrEqualThan(15)`**: Files must have < 15 LOC (exclusive maximum)

Use `shouldNot.haveLocGreaterOrEqualThan` when you want to enforce a strict maximum where files cannot have exactly the threshold number of lines or more, making it more restrictive than the inclusive `shouldNot.haveLocGreaterThan` rule across multiple directories.
