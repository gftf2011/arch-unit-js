# Project Files in File Should Only Depend On Specified Patterns

## Business Rule Description

**DESCRIPTION**: The selected file must have dependencies that match ONLY the specified patterns, or have no dependencies at all. The rule passes when the file depends exclusively on any subset of the defined patterns (or none).

- It is OK if the file has NO dependencies
- It is OK if the file depends exclusively on SOME of the specified patterns
- It is OK if the file depends exclusively on ALL of the specified patterns
- It is NOT OK if the file has additional non-matching dependencies

This rule ensures strict architectural compliance by allowing the file to depend only on the specified architectural components or modules, preventing unwanted coupling to non-specified dependencies.

**Note**: The `should.onlyDependsOn` rule validates both project paths and npm dependencies (e.g., `['express', 'lodash']`).

**Note**: The `should.onlyDependsOn` accepts as parameter also a single string.

## All Possible Scenarios

**Scenario 1**: File has NO dependencies

- **Result**: ✅ PASS — No dependencies means no violations

**Scenario 2**: File has dependencies but NONE match the patterns

- **Result**: ❌ FAIL — No patterns are present

**Scenario 3**: File has dependencies that match only SOME of the patterns (exclusively)

- **Result**: ✅ PASS — Some patterns are present exclusively

**Scenario 4**: File has dependencies and ALL patterns are present (exclusively)

- **Result**: ✅ PASS — All required patterns are present with no extra dependencies

**Scenario 5**: File has dependencies with additional non-matching dependencies

- **Result**: ❌ FAIL — Extra dependencies are not allowed

## Scenario Examples

### Scenario 1: File has NO dependencies

```
project/
└── src/
    └── services/
        └── EmptyService.ts  // No imports
```

**File Content:**

```typescript
// src/services/EmptyService.ts
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
  .should()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ✅ PASS — No dependencies to violate the exclusive rule

---

### Scenario 2: File has dependencies but NONE match the patterns

```
project/
└── src/
    ├── services/
    │   └── WrongService.ts  // imports: ['../utils/helper', '../config/settings']
    ├── utils/helper.ts
    └── config/settings.ts
```

**File Content:**

```typescript
// src/services/WrongService.ts
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
  .inFile('**/services/WrongService.ts')
  .should()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ❌ FAIL — Imports come from `utils` and `config`, not from `domain`/`infra`

---

### Scenario 3: File has dependencies that match only SOME of the patterns (exclusively)

```
project/
└── src/
    ├── domain/entities/User.ts
    └── services/PartialService.ts  // imports: ['../domain/entities/User']
```

**File Content:**

```typescript
// src/services/PartialService.ts
import { User } from '../domain/entities/User';

export class PartialService {
  execute(dto: any) {
    return new User(dto);
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/PartialService.ts')
  .should()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ✅ PASS — Imports exclusively from `domain` (subset of allowed patterns)

---

### Scenario 4: File has dependencies and ALL patterns are present (exclusively)

```
project/
└── src/
    ├── domain/entities/User.ts
    ├── infra/database/DatabaseConnection.ts
    └── services/PerfectService.ts  // imports both allowed patterns
```

**File Content:**

```typescript
// src/services/PerfectService.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infra/database/DatabaseConnection';

export class PerfectService {
  constructor(private db: DatabaseConnection) {}
  async execute(dto: any) {
    const user = new User(dto);
    await this.db.save(user);
    return user;
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/PerfectService.ts')
  .should()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ✅ PASS — Imports only from the allowed patterns

---

### Scenario 5: File has dependencies with additional non-matching dependencies

```
project/
└── src/
    ├── services/ViolatingService.ts  // imports: ['../domain/entities/User', '../infra/database/DatabaseConnection', '../utils/helper']
    ├── domain/entities/User.ts
    ├── infra/database/DatabaseConnection.ts
    └── utils/helper.ts
```

**File Content:**

```typescript
// src/services/ViolatingService.ts
import { User } from '../domain/entities/User';
import { DatabaseConnection } from '../infra/database/DatabaseConnection';
import { helper } from '../utils/helper';

export class ViolatingService {
  constructor(private db: DatabaseConnection) {}
  async execute(dto: any) {
    const user = new User(dto);
    const processed = helper.process(dto); // extra non-allowed dependency
    await this.db.save(user);
    return { user, processed };
  }
}
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/ViolatingService.ts')
  .should()
  .onlyDependsOn(['**/domain/**', '**/infra/**'])
  .check();
```

**Result**: ❌ FAIL — Includes `utils` in addition to allowed patterns (extra dependency not permitted)
