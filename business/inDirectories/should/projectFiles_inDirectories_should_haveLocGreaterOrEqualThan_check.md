# Project Files in Directories Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

DESCRIPTION: Files in the specified directories must have lines of code greater than or equal to the given threshold. The rule passes only when every file (from the union of the given directories) has an actual code line count greater than or equal to the defined minimum.

- It is NOT OK if ANY file has lines of code less than the threshold
- It is OK if ALL files have lines of code greater than or equal to the threshold

This rule enforces minimum implementation size across multiple directories and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Under-developed components that lack proper functionality

Note: The `should.haveLocGreaterOrEqualThan` rule counts only code lines (blank lines and comments are excluded). The threshold is inclusive (≥).

Note: The `should.haveLocGreaterOrEqualThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

Scenario 1: All files have lines of code GREATER than or EQUAL to the threshold

- Result: ✅ PASS — All files meet the minimum size requirement

Scenario 2: ANY files have lines of code LESS than the threshold

- Result: ❌ FAIL — Files violate the minimum size requirement

## Scenario Examples

### Scenario 1: All files have lines of code GREATER than or EQUAL to the threshold (across multiple directories)

```
project/
├── src/
│   ├── application/use-cases/
│   │   ├── CreateUser.ts      // 25 LOC (above threshold)
│   │   └── ProcessOrder.ts    // 16 LOC (equals threshold)
│   └── main/
│       └── app.ts             // 32 LOC (above threshold)
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/application/**', '**/main/**'])
  .should()
  .haveLocGreaterOrEqualThan(16)
  .check();
```

Result: ✅ PASS — All matched files have ≥ 16 LOC

### Scenario 2: ANY files have lines of code LESS than the threshold (across multiple directories)

```
project/
├── src/
│   ├── application/use-cases/
│   │   ├── CreateUser.ts      // 25 LOC (above threshold)
│   │   └── StubUseCase.ts     // 13 LOC (below threshold)
│   └── main/
│       └── app.ts             // 32 LOC (above threshold)
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/application/**', '**/main/**'])
  .should()
  .haveLocGreaterOrEqualThan(16)
  .check();
```

Result: ❌ FAIL — `StubUseCase.ts` (13 LOC) is below the 16-line minimum

### Key Difference from `should.haveLocGreaterThan`

- `should.haveLocGreaterThan(15)`: Files must have > 15 LOC (exclusive minimum)
- `should.haveLocGreaterOrEqualThan(15)`: Files can have ≥ 15 LOC (inclusive minimum)
