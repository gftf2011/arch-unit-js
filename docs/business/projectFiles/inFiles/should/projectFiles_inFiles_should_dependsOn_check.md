# Project Files in Files Should Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: All selected files must have dependencies that match ALL the specified patterns. The rule passes only when EACH file has dependencies matching every defined pattern.

- It is NOT OK if NONE of the patterns are present in a file
- It is NOT OK if SOME of the patterns are present in a file
- It is OK only if ALL patterns are present in EVERY selected file (extra dependencies are ignored)

This rule ensures complete architectural compliance by requiring every target file to depend on all specified components or modules.

**Note**: The `should.dependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `should.dependsOn` accepts as parameter also a single string.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: Some selected files have NO dependencies

- Result: ❌ FAIL — No patterns are present in those files

**Scenario 2**: Some selected files have dependencies but NONE match the patterns

- Result: ❌ FAIL — No patterns are present in those files

**Scenario 3**: Some selected files have dependencies and SOME match the patterns

- Result: ❌ FAIL — Not all patterns are present in those files

**Scenario 4**: All selected files have dependencies and ALL patterns are present

- Result: ✅ PASS — All required patterns are present for each file

## Scenario Examples

### Scenario 1: Some files have NO dependencies (FAIL)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
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
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — Neither `EmptyA.ts` nor `EmptyB.ts` has dependencies

---

### Scenario 2: Some files have dependencies but NONE match the patterns (FAIL)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── WrongA.ts  // imports: ['../utils/a']
│   │       └── WrongB.ts  // imports: ['../config/b']
│   ├── utils/
│   │   └── a.ts
│   └── config/
│       └── b.ts
```

**File Content:**

```typescript
// src/application/use-cases/WrongA.ts
import { a } from '../utils/a';
export class WrongA {
  run() {
    return a();
  }
}

// src/application/use-cases/WrongB.ts
import { b } from '../config/b';
export class WrongB {
  run() {
    return b();
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/WrongA.ts', '**/use-cases/WrongB.ts'])
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — Selected files import from `utils`/`config`, not `domain`/`infrastructure`

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
  run(data: any) {
    return new User(data);
  }
}

// src/application/use-cases/PartialB.ts
import { DatabaseConnection } from '../infrastructure/db/DatabaseConnection';
export class PartialB {
  async run(data: any) {
    return new DatabaseConnection().save(data);
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/PartialA.ts', '**/use-cases/PartialB.ts'])
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — `PartialA.ts` lacks `infrastructure`; `PartialB.ts` lacks `domain`

---

### Scenario 4: All selected files have dependencies and ALL patterns are present (PASS)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── CorrectA.ts  // imports: ['../domain/entities/User', '../infrastructure/db/DatabaseConnection']
│   │       └── CorrectB.ts  // imports: ['../domain/entities/User', '../infrastructure/db/DatabaseConnection']
│   └── infrastructure/
│       └── db/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/CorrectA.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/db/DatabaseConnection';
export class CorrectA {
  async run(d: any) {
    const u = new User(d);
    return new DatabaseConnection().save(u);
  }
}

// src/application/use-cases/CorrectB.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/db/DatabaseConnection';
export class CorrectB {
  async run(d: any) {
    const u = new User(d);
    return new DatabaseConnection().save(u);
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFiles(['**/use-cases/CorrectA.ts', '**/use-cases/CorrectB.ts'])
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS — Both files import from `domain` and `infrastructure`
