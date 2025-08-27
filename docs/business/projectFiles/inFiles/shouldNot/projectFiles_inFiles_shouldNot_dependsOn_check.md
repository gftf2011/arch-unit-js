# Project Files in Files Should NOT Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: None of the selected files must have dependencies that match ANY of the specified patterns. The rule passes only when EVERY selected file avoids importing any of the given patterns.

- It is NOT OK if ANY pattern is present in a file
- It is OK if NONE of the patterns are present in a file
- It is OK only if ALL selected files avoid ALL specified patterns

This rule enforces architectural boundaries by ensuring target files do not depend on forbidden modules, layers, or packages.

**Note**: The `shouldNot.dependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `shouldNot.dependsOn` accepts as parameter also a single string.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: Some selected files have NO dependencies

- Result: ✅ PASS — They do not contain forbidden imports

**Scenario 2**: Some selected files have dependencies but NONE match the patterns

- Result: ✅ PASS — No forbidden imports are present

**Scenario 3**: Some selected files have dependencies and SOME match the patterns

- Result: ❌ FAIL — Forbidden imports are present in those files

**Scenario 4**: All selected files have dependencies and ALL patterns are present

- Result: ❌ FAIL — Forbidden imports are present in every file

## Scenario Examples

### Scenario 1: Some files have NO dependencies (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── EmptyA.ts  // No imports
│   │       └── EmptyB.ts  // No imports
│   └── infrastructure/
│       └── db/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/EmptyA.ts
export class EmptyA {
  execute() {
    return 'A';
  }
}

// src/application/use-cases/EmptyB.ts
export class EmptyB {
  execute() {
    return 'B';
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/EmptyA.ts', '**/use-cases/EmptyB.ts'])
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS — Neither file has any imports, so no forbidden dependencies

---

### Scenario 2: Some files have dependencies but NONE match the patterns (PASS)

```
project/
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── A.ts  // imports: ['../utils/a']
│   │       └── B.ts  // imports: ['../config/b']
│   ├── utils/
│   │   └── a.ts
│   └── config/
│       └── b.ts
```

**File Content:**

```typescript
// src/application/use-cases/A.ts
import { a } from '../utils/a';
export class A {
  run() {
    return a();
  }
}

// src/application/use-cases/B.ts
import { b } from '../config/b';
export class B {
  run() {
    return b();
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/A.ts', '**/use-cases/B.ts'])
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS — Selected files import from `utils`/`config`, not the forbidden `domain`/`infrastructure`

---

### Scenario 3: Some files have dependencies and SOME match the patterns (FAIL)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── PartialA.ts  // imports: ['../domain/entities/User']
│   │       └── PartialB.ts  // imports: ['../infrastructure/db/DatabaseConnection']
│   └── infrastructure/
│       └── db/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/PartialA.ts
import { User } from '../domain/entities/User';
export class PartialA {
  run(d: any) {
    return new User(d);
  }
}

// src/application/use-cases/PartialB.ts
import { DatabaseConnection } from '../infrastructure/db/DatabaseConnection';
export class PartialB {
  async run(d: any) {
    return new DatabaseConnection().save(d);
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/PartialA.ts', '**/use-cases/PartialB.ts'])
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — Forbidden imports found: `PartialA.ts` uses `domain`; `PartialB.ts` uses `infrastructure`

---

### Scenario 4: All selected files have dependencies and ALL patterns are present (FAIL)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── WrongA.ts  // imports: ['../domain/entities/User', '../infrastructure/db/DatabaseConnection']
│   │       └── WrongB.ts  // imports: ['../domain/entities/User', '../infrastructure/db/DatabaseConnection']
│   └── infrastructure/
│       └── db/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/WrongA.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/db/DatabaseConnection';
export class WrongA {
  async run(d: any) {
    const u = new User(d);
    return new DatabaseConnection().save(u);
  }
}

// src/application/use-cases/WrongB.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/db/DatabaseConnection';
export class WrongB {
  async run(d: any) {
    const u = new User(d);
    return new DatabaseConnection().save(u);
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/WrongA.ts', '**/use-cases/WrongB.ts'])
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — Both files import from the forbidden `domain` and `infrastructure` paths
