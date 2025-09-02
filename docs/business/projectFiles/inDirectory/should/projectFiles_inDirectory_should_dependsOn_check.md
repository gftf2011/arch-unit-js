# Project Files in Directory Should Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: Files in the directory must have dependencies that match ALL the specified patterns. The rule passes only when every file has dependencies matching each defined pattern.

- It is NOT OK if NONE of the patterns are present
- It is NOT OK if SOME of the patterns are present
- It is OK if ALL patterns are present (extra dependencies are ignored)

This rule ensures complete architectural compliance by requiring files to depend on all specified components or modules.

**Note**: The `should.dependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `should.dependsOn` accepts as parameter also a single string.

## All Possible Scenarios

**Scenario 1**: File has NO dependencies

- **Result**: ❌ FAIL - No patterns are present

**Scenario 2**: File has dependencies but NONE match the patterns

- **Result**: ❌ FAIL - No patterns are present

**Scenario 3**: File has dependencies and SOME match the patterns

- **Result**: ❌ FAIL - Not all patterns are present

**Scenario 4**: File has dependencies and ALL patterns are present

- **Result**: ✅ PASS - All required patterns are present

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
  .inDirectory('**/services/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - `EmptyService.ts` has no dependencies

### Scenario 2: File has dependencies but NONE match the patterns

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       └── WrongService.ts  // imports: ['../utils/helper', '../config/settings']
│   ├── utils/
│   │   └── helper.ts
│   └── config/
│       └── settings.ts
```

**File Content:**

```typescript
// src/application/services/WrongService.ts
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class WrongService {
  execute() {
    return helper.process(settings.getConfig());
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inDirectory('**/services/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - `WrongService.ts` imports from `utils` and `config`, not `domain` or `infrastructure`

### Scenario 3: File has dependencies and SOME match the patterns

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       └── PartialService.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   ├── utils/
│   │   └── helper.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**

```typescript
// src/application/services/PartialService.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';

export class PartialService {
  execute(userData: any) {
    const user = new User(userData);
    return helper.process(user);
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inDirectory('**/services/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ❌ FAIL - `PartialService.ts` imports from `domain` but not from `infrastructure`

### Scenario 4: File has dependencies and ALL patterns are present

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── services/
│   │       ├── CorrectService.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   │       └── CompleteService.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper', '../config/settings']
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
// src/application/services/CorrectService.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';

export class CorrectService {
  constructor(private db: DatabaseConnection) {}

  async execute(userData: any) {
    const user = new User(userData);
    await this.db.save(user);
    return user;
  }
}

// src/application/services/CompleteService.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class CompleteService {
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
projectFiles()
  .inDirectory('**/services/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check();
```

**Result**: ✅ PASS - Both files import from `domain` and `infrastructure`: `CorrectService.ts` has minimal dependencies, `CompleteService.ts` has extra dependencies (ignored)
