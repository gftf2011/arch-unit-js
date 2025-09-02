# Project Files in Files Should NOT Have Cycles

## Business Rule Description

**DESCRIPTION**: None of the selected files must participate in any circular dependency. The rule passes only when the dependency graph containing EACH selected file is acyclic (no direct, indirect, or self cycles involving any of the selected files).

- It is NOT OK if ANY selected file is part of ANY circular dependency
- It is OK if selected files have NO dependencies or only acyclic dependencies

This rule preserves architectural integrity by ensuring the chosen set of files is not involved in circular references that typically cause:

- Build/compilation instability and runtime issues
- Tight coupling and brittle designs
- Hard-to-test, hard-to-maintain code

**Note**: The `shouldNot.haveCycles` check detects cycles of any length (self, direct, indirect) that include any of the selected files.

## All Possible Scenarios

- Selected files = multiple concrete file paths or glob patterns (via `inFiles([...])`)

**Scenario 1**: Some or all selected files have NO dependencies

- **Result**: ✅ PASS — No cycles possible for those files

**Scenario 2**: Selected files have dependencies but NONE are part of any cycle

- **Result**: ✅ PASS — Acyclic graphs for all selected files

**Scenario 3**: At least one selected file is part of a DIRECT cycle (A → B → A)

- **Result**: ❌ FAIL — Direct circular dependency involving a selected file

**Scenario 4**: At least one selected file is part of an INDIRECT cycle (A → B → C → A)

- **Result**: ❌ FAIL — Indirect circular dependency involving a selected file

**Scenario 5**: At least one selected file has a SELF cycle (A → A)

- **Result**: ❌ FAIL — The file imports itself directly or effectively

## Scenario Examples

### Scenario 1: Selected files have NO dependencies (PASS)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   └── application/
│       └── use-cases/
│           ├── EmptyA.ts  // No imports
│           └── EmptyB.ts  // No imports
```

**File Content:**

```typescript
// src/application/use-cases/EmptyA.ts
export class EmptyA {
  execute() {
    return 'A';
  }
}

// src/application/use-cases/EmptyB.ts
export class EmptyB {
  execute() {
    return 'B';
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/use-cases/EmptyA.ts', '**/use-cases/EmptyB.ts'])
  .shouldNot()
  .haveCycles()
  .check();
```

**Result**: ✅ PASS — No dependencies, so no cycles for the selected files

---

### Scenario 2: Selected files have dependencies but NO cycles (PASS)

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   └── application/
│       └── use-cases/
│           ├── CreateUser.ts   // Imports User.ts
│           └── ListUsers.ts    // Imports User.ts
```

**File Content:**

```typescript
// src/application/use-cases/CreateUser.ts
import { User } from '../domain/entities/User';
export class CreateUser {
  execute(n: string, e: string) {
    return new User(n, e);
  }
}

// src/application/use-cases/ListUsers.ts
import { User } from '../domain/entities/User';
export class ListUsers {
  all(): Array<User> {
    return [];
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/use-cases/CreateUser.ts', '**/use-cases/ListUsers.ts'])
  .shouldNot()
  .haveCycles()
  .check();
```

**Result**: ✅ PASS — Selected files have no cyclic path back to themselves

---

### Scenario 3: At least one selected file is part of a DIRECT cycle (FAIL)

```
project/
├── src/
│   └── services/
│       ├── OrderService.ts     // Imports PaymentService.ts
│       └── PaymentService.ts   // Imports OrderService.ts
```

**File Content:**

```typescript
// src/services/OrderService.ts
import { PaymentService } from './PaymentService';
export class OrderService {
  private payment = new PaymentService();
  process(orderId: string) {
    return this.payment.charge(orderId);
  }
}

// src/services/PaymentService.ts
import { OrderService } from './OrderService'; // ❌ CYCLE
export class PaymentService {
  private order = new OrderService();
  charge(orderId: string) {
    return this.order.process(orderId);
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/OrderService.ts', '**/services/PaymentService.ts'])
  .shouldNot()
  .haveCycles()
  .check(); // ❌ FAIL — both selected files participate in a direct cycle
```

**Result**: ❌ FAIL — OrderService ↔ PaymentService

---

### Scenario 4: At least one selected file is part of an INDIRECT cycle (FAIL)

```
project/
├── src/
│   └── modules/
│       ├── AuthModule.ts      // Imports UserModule.ts
│       ├── UserModule.ts      // Imports ProfileModule.ts
│       └── ProfileModule.ts   // Imports AuthModule.ts
```

**File Content:**

```typescript
// src/modules/AuthModule.ts
import { UserModule } from './UserModule';
export class AuthModule {
  user = new UserModule();
}

// src/modules/UserModule.ts
import { ProfileModule } from './ProfileModule';
export class UserModule {
  profile = new ProfileModule();
}

// src/modules/ProfileModule.ts
import { AuthModule } from './AuthModule'; // ❌ CYCLE
export class ProfileModule {
  auth = new AuthModule();
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/modules/AuthModule.ts', '**/modules/ProfileModule.ts'])
  .shouldNot()
  .haveCycles()
  .check(); // ❌ FAIL — selected files are part of the indirect cycle
```

**Result**: ❌ FAIL — AuthModule → UserModule → ProfileModule → AuthModule

---

### Scenario 5: At least one selected file has a SELF cycle (FAIL)

```
project/
├── src/
│   └── components/
│       ├── Recursive.ts  // Imports itself
│       └── Helper.ts
```

**File Content:**

```typescript
// src/components/Recursive.ts
import { Recursive } from './Recursive'; // ❌ SELF CYCLE
export class Recursive {
  render() {
    return new Recursive().render();
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/components/Recursive.ts', '**/components/Helper.ts'])
  .shouldNot()
  .haveCycles()
  .check();
```

**Result**: ❌ FAIL — One of the selected files references itself directly, forming a cycle
