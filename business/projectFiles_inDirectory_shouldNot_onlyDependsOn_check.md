# Project Files in Directory Should NOT Only Depend On Specific Patterns

## Business Rule Description

**DESCRIPTION**: All files in the directory must NOT have dependencies that match ONLY the specified patterns. The rule passes when files have dependencies that are NOT exclusively the defined patterns OR when files have no dependencies at all. Files that depend exclusively on the specified patterns will fail this rule.

- It is OK if NONE of the patterns are present in file dependencies (no dependencies)
- It is OK if SOME of the patterns are present in file dependencies (mixed dependencies)
- It is OK if ALL patterns are present but with additional non-matching dependencies (mixed dependencies)
- It is NOT OK if ALL patterns are present and NO other dependencies exist (exclusive dependencies)

This rule ensures that files within a specific directory structure do NOT depend EXCLUSIVELY on the required architectural components or modules defined in the checking patterns. It enforces that files must have dependencies that are NOT limited to only the specified patterns, ensuring architectural flexibility and preventing overly restrictive coupling to only specific dependencies.

The rule validates that files have flexible dependency relationships, allowing additional dependencies beyond the specified patterns and ensuring that components have access to a broader range of resources, utilities, or modules beyond those defined by the architectural patterns. Files with no dependencies are considered compliant as they cannot violate the exclusive dependency requirement.

**Note**: The `shouldNot.onlyDependsOn` rule is not restricted to project paths only. It also validates npm dependencies, allowing you to ensure files do NOT depend ONLY on specific external packages (e.g., `['express', 'lodash']`).

## All Possible Scenarios

**Scenario 1**: File has NO dependencies
- **Result**: ✅ PASS - No dependencies means no violations

**Scenario 2**: File has dependencies but NONE match the patterns
- **Result**: ✅ PASS - No patterns are present, so no exclusive dependency

**Scenario 3**: File has dependencies and SOME match the patterns
- **Result**: ✅ PASS - Mixed dependencies, not exclusive

**Scenario 4**: File has dependencies and ALL patterns are present (exclusively)
- **Result**: ❌ FAIL - Exclusive dependencies are not allowed

**Scenario 5**: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
- **Result**: ✅ PASS - Mixed dependencies, not exclusive

**Scenario 6**: File has dependencies and SOME match the patterns (plus additional non-matching dependencies)
- **Result**: ✅ PASS - Mixed dependencies, not exclusive

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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
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
│   │       └── MixedUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper']
│   ├── utils/
│   │   └── helper.ts
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
```

**API Usage:**
```typescript
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `MixedUseCase.ts` imports from `domain` and `utils` (mixed dependencies, not exclusive)

### Scenario 4: File has dependencies and ALL patterns are present (exclusively)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── ExclusiveUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection']
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
```

**API Usage:**
```typescript
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ❌ FAIL - `ExclusiveUseCase.ts` imports ONLY from `domain` and `infrastructure` (exclusive dependencies not allowed)

### Scenario 5: File has dependencies and ALL patterns are present (plus additional non-matching dependencies)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── FlexibleUseCase.ts  // imports: ['../domain/entities/User', '../infrastructure/database/DatabaseConnection', '../utils/helper']
│   ├── utils/
│   │   └── helper.ts
│   └── infrastructure/
│       └── database/
│           └── DatabaseConnection.ts
```

**File Content:**
```typescript
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
app()
  .inDirectory('**/use-cases/**')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `FlexibleUseCase.ts` imports from `domain`, `infrastructure`, and `utils` (mixed dependencies, not exclusive)

### Scenario 6: File has dependencies and SOME match the patterns (plus additional non-matching dependencies)
```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── DiverseUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper', '../config/settings']
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
// src/application/use-cases/DiverseUseCase.ts
import { User } from '../domain/entities/User';
import { helper } from '../utils/helper';
import { settings } from '../config/settings';

export class DiverseUseCase {
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
  .onlyDependsOn(['**/domain/**', '**/infrastructure/**'])
  .check()
```

**Result**: ✅ PASS - `DiverseUseCase.ts` imports from `domain`, `utils`, and `config` (mixed dependencies, not exclusive)