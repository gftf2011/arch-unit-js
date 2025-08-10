# Project Files with File Should NOT Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: The selected file must NOT have dependencies that match ANY of the specified patterns. The rule passes only when the file has NO dependencies matching the defined patterns.

- It is NOT OK if ANY of the patterns are present
- It is OK if NONE of the patterns are present

This rule ensures architectural isolation by preventing the selected file from depending on specified components or modules.

**Note**: The `shouldNot.dependsOn` rule validates both project paths and npm dependencies (e.g., `['lodash', 'express']`).

**Note**: The `shouldNot.dependsOn` accepts as parameter also a single string.

## All Possible Scenarios

- Selected file = a single concrete file path (via `withFile(...)`)

**Scenario 1**: File has NO dependencies

- **Result**: ✅ PASS - No patterns are present

**Scenario 2**: File has dependencies but NONE match the patterns

- **Result**: ✅ PASS - No patterns are present

**Scenario 3**: File has dependencies and ANY patterns are present

- **Result**: ❌ FAIL - Patterns are present (violates the rule)

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
  .withFile('**/use-cases/EmptyUseCase.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - `EmptyUseCase.ts` has no dependencies

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
│   │       └── SafeUseCase.ts  // imports: ['../utils/helper', '../config/settings']
│   ├── utils/
│   │   └── helper.ts
│   └── config/
│       └── settings.ts
```

**File Content:**

```typescript
// src/application/use-cases/SafeUseCase.ts
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class SafeUseCase {
  execute() {
    return helper.process(settings.getConfig());
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .withFile('**/use-cases/SafeUseCase.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - `SafeUseCase.ts` imports from `utils` and `config`, not from `domain` or `infrastructure`

---

### Scenario 3: File has dependencies and ANY patterns are present

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── ViolatingUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   │       ├── FullyViolatingUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   │       └── ComplexViolatingUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper', '../config/settings']
│   ├── utils/
│   │   └── helper.ts
│   ├── config/
│   │   └── settings.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/use-cases/ViolatingUseCase.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';

export class ViolatingUseCase {
  execute(userData: any) {
    const user = new User(userData);
    return helper.process(user);
  }
}

// src/application/use-cases/FullyViolatingUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';

export class FullyViolatingUseCase {
  constructor(private db: DatabaseConnection) {}

  async execute(userData: any) {
    const user = new User(userData);
    await this.db.save(user);
    return user;
  }
}

// src/application/use-cases/ComplexViolatingUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class ComplexViolatingUseCase {
  constructor(private db: DatabaseConnection) {}

  async execute(userData: any) {
    const user = new User(userData);
    const processedData = helper.process(userData);
    const config = settings.getConfig();

    await this.db.save(user);
    return { user, processedData, config };
  }
}
```

**API Usage:**

```typescript
// Any of the following should FAIL
await projectFiles()
  .withFile('**/use-cases/ViolatingUseCase.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();

await projectFiles()
  .withFile('**/use-cases/FullyViolatingUseCase.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();

await projectFiles()
  .withFile('**/use-cases/ComplexViolatingUseCase.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - Each target file violates the rule: `ViolatingUseCase.ts` has some patterns, `FullyViolatingUseCase.ts` has all patterns, `ComplexViolatingUseCase.ts` has all patterns + extra dependencies
