# Project Files in Directory Should Only Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: All files in the directory must have dependencies that match ONLY the specified patterns OR have no dependencies at all. The rule passes when files depend exclusively on any subset of the defined patterns or have no dependencies.

- It is OK if files have NO dependencies
- It is OK if files depend exclusively on SOME of the specified patterns  
- It is OK if files depend exclusively on ALL of the specified patterns
- It is NOT OK if files have additional non-matching dependencies

This rule ensures strict architectural compliance by allowing files to depend only on the specified architectural components or modules, preventing unwanted coupling to non-specified dependencies.

**Note**: The `should.onlyDependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

## All Possible Scenarios

**Scenario 1**: File has NO dependencies
- **Result**: ✅ PASS - No dependencies means no violations

**Scenario 2**: File has dependencies but NONE match the patterns
- **Result**: ❌ FAIL - No patterns are present

**Scenario 3**: File has dependencies that match only SOME of the patterns (exclusively)
- **Result**: ✅ PASS - Some patterns are present exclusively

**Scenario 4**: File has dependencies and ALL patterns are present (exclusively)
- **Result**: ✅ PASS - All required patterns are present with no extra dependencies

**Scenario 5**: File has dependencies with additional non-matching dependencies
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

**Result**: ✅ PASS - `PartialUseCase.ts` imports exclusively from `domain` (matches one of the specified patterns)

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

### Scenario 5: File has dependencies with additional non-matching dependencies
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── ViolatingUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper']
│   │       └── MixedViolatingUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper', '../config/settings']
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

// src/application/use-cases/MixedViolatingUseCase.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class MixedViolatingUseCase {
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
projectFiles()
  .inDirectory('**/use-cases/**')
  .should()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - Both files have extra dependencies: `ViolatingUseCase.ts` has all required patterns plus `utils`, `MixedViolatingUseCase.ts` has some required patterns plus `utils` and `config` (extra dependencies not allowed)
