# Project Files in Directory Should Only Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: All files in the directory must have dependencies that match ONLY the specified patterns OR have no dependencies at all. The rule passes when every file in the directory has dependencies that match EXCLUSIVELY the defined patterns (no other dependencies allowed) OR when files have no dependencies.

- It is OK if NONE of the patterns are present in file dependencies (no dependencies)
- It is NOT OK if SOME of the patterns are present in file dependencies
- It is NOT OK if ALL patterns are present but with additional non-matching dependencies
- It is OK if ALL patterns are present and NO other dependencies exist

This rule ensures that files within a specific directory structure depend EXCLUSIVELY on the required architectural components or modules defined in the checking patterns, OR have no dependencies at all. It enforces that every file must have dependencies that match ONLY the specified patterns, ensuring strict architectural compliance and preventing any unwanted coupling to non-specified dependencies.

The rule validates that files are properly connected to ONLY the necessary architectural elements, preventing any additional dependency relationships and ensuring that components have access to ONLY the required resources, utilities, or modules as defined by the architectural patterns. Files with no dependencies are considered compliant as they cannot violate the exclusive dependency requirement.

**Note**: The `should.onlyDependsOn` rule is not restricted to project paths only. It also validates npm dependencies, allowing you to ensure files depend ONLY on specific external packages (e.g., `['express', 'lodash']`).

## All Possible Scenarios

**Scenario 1**: File has NO dependencies
- **Result**: ✅ PASS - No dependencies means no violations

**Scenario 2**: File has dependencies but NONE match the patterns
- **Result**: ❌ FAIL - No patterns are present

**Scenario 3**: File has dependencies that match only SOME of the patterns (exclusively)
- **Result**: ❌ FAIL - Not all patterns are present

**Scenario 4**: File has dependencies and ALL patterns are present (exclusively)
- **Result**: ✅ PASS - All required patterns are present with no extra dependencies

**Scenario 5**: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
- **Result**: ❌ FAIL - Extra dependencies are not allowed

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
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `EmptyUseCase.ts` has no dependencies, so it cannot violate the exclusive dependency rule

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
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `WrongUseCase.ts` imports from `utils` and `config`, not `domain` or `infrastructure`

### Scenario 3: File has dependencies that match only SOME of the patterns (exclusively)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── PartialUseCase.ts  // imports: ['../domain/entities/User']
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**
```typescript
// src/application/use-cases/PartialUseCase.ts
import { User } from '../domain/entities/User';

export class PartialUseCase {
  execute(userData: any) {
    const user = new User(userData);
    return user;
  }
}
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `PartialUseCase.ts` imports from `domain` but not from `infrastructure`

### Scenario 4: File has dependencies and ALL patterns are present (exclusively)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── PerfectUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**
```typescript
// src/application/use-cases/PerfectUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';

export class PerfectUseCase {
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
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `PerfectUseCase.ts` imports ONLY from `domain` and `infrastructure`

### Scenario 5: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── ViolatingUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper']
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
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';
import { helper } from '../utils/helper';

export class ViolatingUseCase {
  constructor(private db: DatabaseConnection) {}

  async execute(userData: any) {
    const user = new User(userData);
    const processedData = helper.process(userData);
    
    await this.db.save(user);
    return { user, processedData };
  }
}
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `ViolatingUseCase.ts` imports from `domain` and `infrastructure` but also from `utils` (extra dependency not allowed)
