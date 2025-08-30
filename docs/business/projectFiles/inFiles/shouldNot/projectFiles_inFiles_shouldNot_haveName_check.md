# Project Files in Files Should NOT Have Name with Specified Pattern

## Business Rule Description

**DESCRIPTION**: None of the selected files may have a name that matches the specified pattern. The rule passes only when EACH file name in the selection does NOT match the defined pattern.

- It is NOT OK if ANY selected file matches the pattern
- It is OK only if ALL selected files do not match the pattern

This rule prevents certain naming conventions from appearing in a selected set of files, enforcing boundaries or avoiding reserved naming schemes.

**Note**: The `shouldNot.haveName` rule accepts only a single pattern, not an array of patterns.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: Some selected files match the pattern

- **Result**: ❌ FAIL — The selection violates the naming restriction

**Scenario 2**: None of the selected files match the pattern

- **Result**: ✅ PASS — The selection respects the naming restriction

## Scenario Examples

### Scenario 1: Some files match the pattern (FAIL)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── CreateTodo.js
│   │       └── GetAllTodos.js
│   └── domain/
│       └── entities/
│           └── Todo.js
```

**Files Selected:**

```
src/application/use-cases/CreateTodo.js
src/application/use-cases/GetAllTodos.js
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/application/use-cases/CreateTodo.js', '**/application/use-cases/GetAllTodos.js'])
  .shouldNot()
  .haveName('*Todo*.js')
  .check();
```

**Result**: ❌ FAIL — Both selected files match the `*Todo*.js` pattern

---

### Scenario 2: No files match the pattern (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── helper.js
│   │       └── config.js
│   └── domain/
│       └── entities/
│           └── Todo.js
```

**Files Selected:**

```
src/application/use-cases/helper.js
src/application/use-cases/config.js
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/application/use-cases/helper.js', '**/application/use-cases/config.js'])
  .shouldNot()
  .haveName('*UseCase.js')
  .check();
```

**Result**: ✅ PASS — Neither file matches the `*UseCase.js` pattern
