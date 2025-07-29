# Project Files in Directory Should NOT Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: All files in the directory must NOT have dependencies that match ANY of the specified patterns. The rule passes only when every file in the directory has NO dependencies that match the defined patterns.

- It is NOT OK if ANY of the patterns are present in file dependencies
- It is NOT OK if ALL of the patterns are present in file dependencies
- It is OK if NONE of the patterns are present in file dependencies

This rule ensures that files within a specific directory structure avoid dependencies on the specified architectural components or modules. It enforces that every file must NOT have any dependencies that match the specified patterns, ensuring architectural isolation and preventing unwanted coupling to restricted dependencies.

The rule validates that files are properly isolated from specific architectural elements, preventing forbidden dependency relationships and ensuring that components do not have access to restricted resources, utilities, or modules as defined by the architectural patterns.

**Note**: The `shouldNot.dependsOn` rule is not restricted to project paths only. It also validates npm dependencies, allowing you to ensure files do NOT depend on specific external packages (e.g., `['jquery', 'moment']`).

## All Possible Scenarios

**Scenario 1**: File has NO dependencies
- **Result**: ✅ PASS - No patterns are present

**Scenario 2**: File has dependencies but NONE match the patterns
- **Result**: ✅ PASS - No patterns are present

**Scenario 3**: File has dependencies and SOME match the patterns
- **Result**: ❌ FAIL - Some patterns are present

**Scenario 4**: File has dependencies and ALL patterns are present
- **Result**: ❌ FAIL - All patterns are present

**Scenario 5**: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
- **Result**: ❌ FAIL - All patterns are present (extra dependencies are ignored)

**Scenario 6**: File has dependencies and SOME match the patterns (plus additional non-matching dependencies)
- **Result**: ❌ FAIL - Some patterns are present (extra dependencies are ignored)

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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `EmptyUseCase.ts` has no dependencies

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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `SafeUseCase.ts` imports from `utils` and `config`, not from `domain` or `infrastructure`

### Scenario 3: File has dependencies and SOME match the patterns
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── ViolatingUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   ├── utils/
│   │   └── helper.ts
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
```

**API Usage:**
```typescript
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `ViolatingUseCase.ts` imports from `domain` (violates the rule)

### Scenario 4: File has dependencies and ALL patterns are present
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── FullyViolatingUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**
```typescript
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
```

**API Usage:**
```typescript
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `FullyViolatingUseCase.ts` imports from both `domain` and `infrastructure` (violates the rule)

### Scenario 5: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `ComplexViolatingUseCase.ts` imports from both `domain` and `infrastructure` (violates the rule, extra imports from `utils` and `config` are ignored)

### Scenario 6: File has dependencies and SOME match the patterns (plus additional non-matching dependencies)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── PartialViolatingUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper', '../config/settings']
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
// src/application/use-cases/PartialViolatingUseCase.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class PartialViolatingUseCase {
  execute(userData: any) {
    const user = new User(userData);
    const processedData = helper.process(userData);
    const config = settings.getConfig();
    
    return { user, processedData, config };
  }
}
```

**API Usage:**
```typescript
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .dependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `PartialViolatingUseCase.ts` imports from `domain` (violates the rule, extra imports from `utils` and `config` are ignored)

