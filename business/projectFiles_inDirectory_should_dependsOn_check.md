# Project Files in Directory Should Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: All files in the directory must have dependencies that match ALL the specified patterns. The rule passes only when every file in the directory has dependencies that match each of the defined patterns.

- It is NOT OK if NONE of the patterns are present in file dependencies
- It is NOT OK if SOME of the patterns are present in file dependencies
- It is OK if ALL patterns are present in file dependencies

This rule ensures that files within a specific directory structure depend on all the required architectural components or modules defined in the checking patterns. It enforces that every file must have dependencies that match each specified pattern, ensuring complete architectural compliance and proper coupling to all required dependencies.

The rule validates that files are properly connected to all necessary architectural elements, preventing incomplete dependency relationships and ensuring that components have access to all required resources, utilities, or modules as defined by the architectural patterns.

**Note**: The `should.dependsOn` rule is not restricted to project paths only. It also validates npm dependencies, allowing you to ensure files depend on specific external packages (e.g., `['express', 'lodash']`).

## All Possible Scenarios

**Scenario 1**: File has NO dependencies
- **Result**: ❌ FAIL - No patterns are present

**Scenario 2**: File has dependencies but NONE match the patterns
- **Result**: ❌ FAIL - No patterns are present

**Scenario 3**: File has dependencies and SOME match the patterns
- **Result**: ❌ FAIL - Not all patterns are present

**Scenario 4**: File has dependencies and ALL patterns are present
- **Result**: ✅ PASS - All required patterns are present

**Scenario 5**: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
- **Result**: ✅ PASS - All required patterns are present (extra dependencies are ignored)

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
    return "Hello World";
  }
}
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `EmptyUseCase.ts` has no dependencies

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
  .inDirectory('**/use-cases/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `WrongUseCase.ts` imports from `utils` and `config`, not `domain` or `infrastructure`

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
  .inDirectory('**/use-cases/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `PartialUseCase.ts` imports from `domain` but not from `infrastructure`

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
  .inDirectory('**/use-cases/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `CorrectUseCase.ts` imports from both `domain` and `infrastructure`

### Scenario 5: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── CompleteUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper', '../config/settings']
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
// src/application/use-cases/CompleteUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class CompleteUseCase {
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
  .inDirectory('**/use-cases/**')
  .should()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `CompleteUseCase.ts` imports from both `domain` and `infrastructure` (extra imports from `utils` and `config` are ignored)

