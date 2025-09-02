# Project Files in Files Should Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Every selected file must have fewer or equal lines of code than the specified threshold. The rule passes only when EACH file in the selection is less than or equal to the defined limit.

- It is NOT OK if ANY selected file has lines of code greater than the threshold
- It is OK only if ALL selected files have lines of code less than or equal to the threshold

This rule promotes:

- Better code readability and comprehension across modules
- Reduced complexity and improved modularity
- Easier code review and debugging processes
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `should.haveLocLessOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive (files can have LESS than or EQUAL to the specified number).

**Note**: The `should.haveLocLessOrEqualThan` accepts a single numeric value as the threshold parameter.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: All selected files have LOC LESS than or EQUAL to the threshold

- **Result**: ✅ PASS — The selection meets the size constraint

**Scenario 2**: At least one selected file has LOC GREATER than the threshold

- **Result**: ❌ FAIL — The selection violates the size constraint

## Scenario Examples

### Scenario 1: All selected files have LOC ≤ threshold (PASS)

```
project/
├── src/
│   ├── modules/
│   │   ├── AppModule.ts        // 12 LOC (≤ 12)
│   │   └── HealthModule.ts     // 11 LOC (≤ 12)
```

**File Content (illustrative):**

```typescript
// src/modules/AppModule.ts (12 lines of code — equals threshold)
export class AppModule {
  start(): void {}
  stop(): void {}
  init(): void {}
  configure(): void {}
  enable(): void {}
  disable(): void {}
  ready(): boolean {
    return true;
  }
  version(): string {
    return '1.0.0';
  }
  ping(): string {
    return 'pong';
  }
  noop(): void {}
}

// src/modules/HealthModule.ts (11 lines of code — below threshold)
export class HealthModule {
  isOk(): boolean {
    return true;
  }
  ping(): string {
    return 'ok';
  }
  version(): string {
    return '1.0.0';
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/modules/AppModule.ts', '**/modules/HealthModule.ts'])
  .should()
  .haveLocLessOrEqualThan(12)
  .check();
```

**Result**: ✅ PASS — Both files are ≤ 12 LOC

---

### Scenario 2: Some files have LOC > threshold (FAIL)

```
project/
├── src/
│   ├── controllers/
│   │   ├── TodoController.ts   // 45+ LOC (> 30) ❌
│   │   └── StatusController.ts // 3 LOC (≤ 30)
```

**File Content (illustrative):**

```typescript
// src/controllers/TodoController.ts (more than 30 lines of code)
export class TodoController {
  get(id: string): string {
    return id;
  }
  create(t: string): boolean {
    return Boolean(t);
  }
  update(id: string, t: string): boolean {
    return Boolean(id && t);
  }
  remove(id: string): boolean {
    return Boolean(id);
  }
  // ... many small methods to exceed 30 LOC
}

// src/controllers/StatusController.ts (3 LOC — within limit)
export class StatusController {
  status(): string {
    return 'ok';
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/controllers/TodoController.ts', '**/controllers/StatusController.ts'])
  .should()
  .haveLocLessOrEqualThan(30)
  .check();
```

**Result**: ❌ FAIL — `TodoController.ts` exceeds 30 LOC

---

### Key Difference from `haveLocLessThan`:

- **`should.haveLocLessThan(10)`**: Every file must have < 10 LOC (exclusive)
- **`should.haveLocLessOrEqualThan(10)`**: Every file can have ≤ 10 LOC (inclusive)

Use `haveLocLessOrEqualThan` when you want to allow selected files to have exactly the threshold number of lines, making it slightly more permissive than the strict `haveLocLessThan` rule.
