# Project Files in File Should Only Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: The selected file must have a name that matches the specified pattern. For a single file selection, the rule passes only when the file name matches the defined pattern; otherwise it fails.

- It is NOT OK if the file name does not match the pattern
- It is OK if the file name matches the pattern

This rule ensures naming consistency by requiring the selected file to conform to the specified naming convention.

**Note**: The `should.onlyHaveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

**Scenario 1**: File does NOT match the pattern

- **Result**: ❌ FAIL — The selected file does not match the specified pattern

**Scenario 2**: File matches the pattern

- **Result**: ✅ PASS — The selected file matches the specified pattern

## Scenario Examples

### Scenario 1: File does NOT match the pattern

```
project/
└── src/
    └── modules/
        └── todo/
            └── todo.controller.ts
```

**File Selected:**

```
src/modules/todo/todo.controller.ts
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/modules/todo/todo.controller.ts')
  .should()
  .onlyHaveName('*UseCase.ts')
  .check();
```

**Result**: ❌ FAIL — `todo.controller.ts` does not match the `*UseCase.ts` pattern

---

### Scenario 2: File matches the pattern

```
project/
└── src/
    └── modules/
        └── todo/
            └── todo.controller.ts
```

**File Selected:**

```
src/modules/todo/todo.controller.ts
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/modules/todo/todo.controller.ts')
  .should()
  .onlyHaveName('*controller.ts')
  .check();
```

**Result**: ✅ PASS — `todo.controller.ts` matches the `*controller.ts` pattern
