# Project Files in Directory Should NOT Only Depend On Specific Patterns

## Business Rule Description

**DESCRIPTION**: Files in the directory must NOT depend exclusively on the specified patterns. The rule passes when files have mixed dependencies or no dependencies at all.

- It is OK if files have NO dependencies
- It is OK if files have mixed dependencies (some patterns + additional dependencies)
- It is NOT OK if files depend exclusively on the specified patterns (any subset)

This rule ensures architectural flexibility by preventing overly restrictive coupling to only the specified dependencies.

**Note**: The `shouldNot.onlyDependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `shouldNot.onlyDependsOn` accepts as parameter also a single string.

## All Possible Scenarios

**Scenario 1**: File has NO dependencies
- **Result**: ✅ PASS - No dependencies means no violations

**Scenario 2**: File has dependencies but NONE match the patterns
- **Result**: ✅ PASS - No patterns are present, so no exclusive dependency

**Scenario 3**: File has mixed dependencies
- **Result**: ✅ PASS - Mixed dependencies, not exclusive

**Scenario 4**: File has exclusive dependencies to specified patterns
- **Result**: ❌ FAIL - Exclusive dependencies are not allowed

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
  .shouldNot()
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
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `SafeUseCase.ts` imports from `utils` and `config`, not from `domain` or `infrastructure`

### Scenario 3: File has mixed dependencies
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── MixedUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   │       └── FlexibleUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper']
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
// src/application/use-cases/MixedUseCase.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';

export class MixedUseCase {
  execute(userData: any) {
    const user = new User(userData);
    return helper.process(user);
  }
}

// src/application/use-cases/FlexibleUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';
import { helper } from '../utils/helper';

export class FlexibleUseCase {
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
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - Both files have mixed dependencies: `MixedUseCase.ts` has some patterns + extra, `FlexibleUseCase.ts` has all patterns + extra (not exclusive)

### Scenario 4: File has exclusive dependencies to specified patterns
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── ExclusiveUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
│   │       ├── CreateUserUseCase.ts  // imports: ['../domain/entities/User']
│   │       ├── UpdateUserUseCase.ts  // imports: ['../domain/entities/User']
│   │       └── DeleteUserUseCase.ts  // imports: ['../domain/entities/User']
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**
```typescript
// src/application/use-cases/ExclusiveUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection';

export class ExclusiveUseCase {
  constructor(private db: DatabaseConnection) {}

  async execute(userData: any) {
    const user = new User(userData);
    await this.db.save(user);
    return user;
  }
}

// src/application/use-cases/CreateUserUseCase.ts
import { User } from '../domain/entities/User';

export class CreateUserUseCase {
  execute(userData: any) {
    const user = new User(userData.id, userData.title, userData.description);
    return user;
  }
}
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - Files have exclusive dependencies: `ExclusiveUseCase.ts` depends only on all patterns, other files depend only on some patterns (exclusive dependencies not allowed)