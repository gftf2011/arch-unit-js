# Project Files in File Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: The selected file must NOT have more lines of code than the specified threshold. The rule passes only when the file's actual code line count is less than or equal to the defined maximum limit.

- It is NOT OK if the file has lines of code greater than the threshold
- It is OK if the file has lines of code less than or equal to the threshold

This rule promotes:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `shouldNot.haveLocGreaterThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive on violation (the file must have LESS than or EQUAL to the specified number, not greater than).

**Note**: The `shouldNot.haveLocGreaterThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

**Scenario 1**: File has lines of code LESS than or EQUAL to the threshold

- **Result**: ✅ PASS — The file meets the maximum size constraint

**Scenario 2**: File has lines of code GREATER than the threshold

- **Result**: ❌ FAIL — The file violates the maximum size constraint

## Scenario Examples

### Scenario 1: File has lines of code LESS than or EQUAL to the threshold

```
project/
└── src/
    └── modules/
        └── AppModule.ts  // 12 LOC (equals threshold 12)
```

**File Content:**

```typescript
// src/modules/AppModule.ts (12 lines of actual code — equals threshold)
export class AppModule {
  // LOC 1
  start(): void {} // LOC 2
  stop(): void {} // LOC 3
  init(): void {} // LOC 4
  configure(): void {} // LOC 5
  enable(): void {} // LOC 6
  disable(): void {} // LOC 7
  ready(): boolean {
    return true;
  } // LOC 8
  version(): string {
    return '1.0.0';
  } // LOC 9
  ping(): string {
    return 'pong';
  } // LOC 10
  noop(): void {} // LOC 11
} // LOC 12
```

**API Usage:**

```typescript
projectFiles().inFile('**/modules/AppModule.ts').shouldNot().haveLocGreaterThan(12).check();
```

**Result**: ✅ PASS — `AppModule.ts` has 12 LOC which is ≤ 12

---

### Scenario 2: File has lines of code GREATER than the threshold

```
project/
└── src/
    └── controllers/
        └── TodoController.ts  // 45+ LOC (threshold 30)
```

**File Content:**

```typescript
// src/controllers/TodoController.ts (more than 30 lines of code)
export class TodoController {
  // LOC 1
  get(id: string): string {
    return id;
  } // LOC 2
  create(title: string): boolean {
    return Boolean(title);
  } // LOC 3
  update(id: string, title: string): boolean {
    return Boolean(id && title);
  } // LOC 4
  remove(id: string): boolean {
    return Boolean(id);
  } // LOC 5
  // ... add many small methods to exceed 30 LOC
  a() {
    // LOC 6
    return 1; // LOC 7
  } // LOC 8
  b() {
    // LOC 9
    return 2; // LOC 10
  } // // LOC 11
  c() {
    // LOC 12
    return 3; // LOC 13
  } // LOC 14
  d() {
    // LOC 15
    return 4; // LOC 16
  } // LOC 17
  e() {
    // LOC 18
    return 5; // LOC 19
  } // LOC 20
  f() {
    // LOC 21
    return 6; // LOC 22
  } // LOC 23
  g() {
    // LOC 24
    return 7; // LOC 25
  } // LOC 26
  h() {
    // LOC 27
    return 8; // LOC 28
  } // // LOC 29
  i() {
    // LOC 30
    return 9; // LOC 31
  } // LOC 32
  // and goes on
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/controllers/TodoController.ts')
  .shouldNot()
  .haveLocGreaterThan(30)
  .check();
```

**Result**: ❌ FAIL — `TodoController.ts` exceeds 30 LOC
