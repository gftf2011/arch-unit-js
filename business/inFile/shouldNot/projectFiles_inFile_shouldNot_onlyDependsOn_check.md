# Project Files in File Should NOT Only Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: The selected file must NOT depend exclusively on the specified patterns. The rule passes when the file has mixed dependencies (some match + at least one non-matching) or has no dependencies at all. The rule fails when the file depends only on the specified patterns (exclusively), whether that is SOME or ALL of them.

- It is OK if the file has NO dependencies
- It is OK if the file has MIXED dependencies (some patterns + additional non-matching dependencies)
- It is OK if the file has dependencies but NONE match the patterns
- It is NOT OK if the file depends EXCLUSIVELY on the specified patterns (any subset)

This rule ensures architectural flexibility by preventing overly restrictive coupling to only the specified dependencies.

**Note**: The `shouldNot.onlyDependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `shouldNot.onlyDependsOn` accepts as parameter also a single string.

## All Possible Scenarios

**Scenario 1**: File has NO dependencies

- **Result**: ✅ PASS — No dependencies means no exclusive coupling

**Scenario 2**: File has dependencies but NONE match the patterns

- **Result**: ✅ PASS — No patterns are present, so not exclusive

**Scenario 3**: File has mixed dependencies (some match + extra non-matching)

- **Result**: ✅ PASS — Mixed dependencies, not exclusive

**Scenario 4**: File has exclusive dependencies to specified patterns (any subset or all)

- **Result**: ❌ FAIL — Exclusive dependencies are not allowed

## Scenario Examples

### Scenario 1: File has NO dependencies

```
project/
└── src/
    └── use-cases/
        └── EmptyUseCase.ts  // No imports
```

**File Content:**

```typescript
// src/use-cases/EmptyUseCase.ts
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
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ✅ PASS — No dependencies to be exclusive

---

### Scenario 2: File has dependencies but NONE match the patterns

```
project/
└── src/
    ├── use-cases/
    │   └── SafeUseCase.ts  // imports: ['../utils/helper', '../config/settings']
    ├── utils/helper.ts
    └── config/settings.ts
```

**File Content:**

```typescript
// src/use-cases/SafeUseCase.ts
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
  .inFile('**/use-cases/SafeUseCase.ts')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ✅ PASS — No allowed patterns are present, so not exclusive

---

### Scenario 3: File has mixed dependencies (some match + extra non-matching)

```
project/
└── src/
    ├── use-cases/MixedUseCase.ts  // imports: ['../domain/entities/User', '../utils/helper']
    ├── domain/entities/User.ts
    └── utils/helper.ts
```

**File Content:**

```typescript
// src/use-cases/MixedUseCase.ts
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
projectFiles()
  .inFile('**/use-cases/MixedUseCase.ts')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ✅ PASS — Depends on a specified pattern (`domain`) plus an extra non-matching (`utils`), so not exclusive

---

### Scenario 4: File has exclusive dependencies to specified patterns

```
project/
└── src/
    ├── use-cases/ExclusiveUseCase.ts  // imports: ['../domain/entities/User', '../infra/database/DatabaseConnection']
    ├── domain/entities/User.ts
    └── infra/database/DatabaseConnection.ts
```

**File Content:**

```typescript
// src/use-cases/ExclusiveUseCase.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infra/database/DatabaseConnection';

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
projectFiles()
  .inFile('**/use-cases/ExclusiveUseCase.ts')
  .shouldNot()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ❌ FAIL — Depends exclusively on the specified patterns (no extra dependencies)
