# Project Files in File Should NOT Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: The selected file must NOT have dependencies that match ANY of the specified patterns. The rule passes only when the file has NO dependencies matching the defined patterns.

- It is NOT OK if ANY of the patterns are present
- It is OK if NONE of the patterns are present

This rule ensures architectural isolation by preventing the selected file from depending on specified components or modules.

**Note**: The `shouldNot.dependsOn` rule validates both project paths and npm dependencies (e.g., `['lodash', 'express']`).

**Note**: The `shouldNot.dependsOn` accepts as parameter also a single string.

## All Possible Scenarios

- Selected file = a single concrete file path (via `inFile(...)`)

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
│   │   └── services/
│   │       └── EmptyService.ts  // No imports
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/services/EmptyService.ts
export class EmptyService {
  execute() {
    return 'Hello World';
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/EmptyService.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - `EmptyService.ts` has no dependencies

---

### Scenario 2: File has dependencies but NONE match the patterns

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       └── SafeService.ts  // imports: ['../utils/helper', '../config/settings']
│   ├── utils/
│   │   └── helper.ts
│   └── config/
│       └── settings.ts
```

**File Content:**

```typescript
// src/application/services/SafeService.ts
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class SafeService {
  execute() {
    return helper.process(settings.getConfig());
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/SafeService.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - `SafeService.ts` imports from `utils` and `config`, not from `domain` or `infrastructure`

---

### Scenario 3: File has dependencies and ANY patterns are present

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       ├── ViolatingService.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   │       ├── FullyViolatingService.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   │       └── ComplexViolatingService.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper', '../config/settings']
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
// src/application/services/ViolatingService.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';

export class ViolatingService {
  execute(userData: any) {
    const user = new User(userData);
    return helper.process(user);
  }
}

// src/application/services/FullyViolatingService.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';

export class FullyViolatingService {
  constructor(private db: DatabaseConnection) {}

  async execute(userData: any) {
    const user = new User(userData);
    await this.db.save(user);
    return user;
  }
}

// src/application/services/ComplexViolatingService.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class ComplexViolatingService {
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
  .inFile('**/services/ViolatingService.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();

await projectFiles()
  .inFile('**/services/FullyViolatingService.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();

await projectFiles()
  .inFile('**/services/ComplexViolatingService.ts')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - Each target file violates the rule: `ViolatingService.ts` has some patterns, `FullyViolatingService.ts` has all patterns, `ComplexViolatingService.ts` has all patterns + extra dependencies
