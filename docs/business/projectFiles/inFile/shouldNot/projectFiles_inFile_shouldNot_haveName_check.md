# Project Files in File Should NOT Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: The selected file must NOT have a name that matches the specified pattern. The rule passes when the file name does not match the defined pattern.

- It is OK if the file does NOT match the pattern
- It is NOT OK if the file matches the pattern

This rule ensures naming flexibility by preventing a specific file from conforming to the specified naming convention.

**Note**: The `shouldNot.haveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

**Scenario 1**: File does NOT match the pattern

- **Result**: ✅ PASS — The file does not match the specified pattern

**Scenario 2**: File matches the pattern

- **Result**: ❌ FAIL — The file matches the specified pattern (violates the rule)

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
  .shouldNot()
  .haveName('*.repository.ts')
  .check();
```

**Result**: ✅ PASS — `todo.controller.ts` does not match the `*.repository.ts` pattern

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
  .shouldNot()
  .haveName('*controller.ts')
  .check();
```

**Result**: ❌ FAIL — `todo.controller.ts` matches the `*controller.ts` pattern
