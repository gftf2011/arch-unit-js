# Project Files in File Should Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: The selected file must have dependencies that match ALL the specified patterns. The rule passes only when the file has dependencies matching each defined pattern.

- It is NOT OK if NONE of the patterns are present
- It is NOT OK if SOME of the patterns are present
- It is OK if ALL patterns are present (extra dependencies are ignored)

This rule ensures complete architectural compliance by requiring the target file to depend on all specified components or modules.

**Note**: The `should.dependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `should.dependsOn` accepts as parameter also a single string.

## All Possible Scenarios

- Selected file = a single concrete file path (via `inFile(...)`)

**Scenario 1**: File has NO dependencies

- Result: ❌ FAIL — No patterns are present

**Scenario 2**: File has dependencies but NONE match the patterns

- Result: ❌ FAIL — No patterns are present

**Scenario 3**: File has dependencies and SOME match the patterns

- Result: ❌ FAIL — Not all patterns are present

**Scenario 4**: File has dependencies and ALL patterns are present

- Result: ✅ PASS — All required patterns are present

## Scenario Examples

### Scenario 1: File has NO dependencies

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── EmptyUseCase.ts  // No imports
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/EmptyUseCase.ts
export class EmptyUseCase {
  execute() {
    return 'Hello World';
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/use-cases/EmptyUseCase.ts')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — `EmptyUseCase.ts` has no dependencies

---

### Scenario 2: File has dependencies but NONE match the patterns

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── WrongUseCase.ts  // imports: ['../utils/helper', '../config/settings']
│   ├── utils/
│   │   └── helper.ts
│   └── config/
│       └── settings.ts
```

**File Content:**

```typescript
// src/application/use-cases/WrongUseCase.ts
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class WrongUseCase {
  execute() {
    return helper.process(settings.getConfig());
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/use-cases/WrongUseCase.ts')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — `WrongUseCase.ts` imports from `utils` and `config`, not `domain` or `infrastructure`

---

### Scenario 3: File has dependencies and SOME match the patterns

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── PartialUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   ├── utils/
│   │   └── helper.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/PartialUseCase.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';

export class PartialUseCase {
  execute(userData: any) {
    const user = new User(userData);
    return helper.process(user);
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/use-cases/PartialUseCase.ts')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL — `PartialUseCase.ts` imports from `domain` but not from `infrastructure`

---

### Scenario 4: File has dependencies and ALL patterns are present

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── CorrectUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/CorrectUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';

export class CorrectUseCase {
  constructor(private db: DatabaseConnection) {}

  async execute(userData: any) {
    const user = new User(userData);
    await this.db.save(user);
    return user;
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/use-cases/CorrectUseCase.ts')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS — The file imports from both `domain` and `infrastructure`
