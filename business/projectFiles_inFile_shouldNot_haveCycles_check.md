# Project Files in File Should NOT Have Cycles

## Business Rule Description

**DESCRIPTION**: The selected file must NOT participate in any circular dependency. The rule passes only when the dependency graph that includes the target file is acyclic (no direct, indirect, or self cycles involving the selected file).

- It is NOT OK if the selected file is part of ANY circular dependency
- It is OK if the selected file has NO dependencies or only acyclic dependencies

This rule preserves architectural integrity by ensuring the chosen file is not involved in circular references that typically cause:

- Build/compilation instability and runtime issues
- Tight coupling and brittle designs
- Hard-to-test, hard-to-maintain code

**Note**: The `shouldNot.haveCycles` check detects cycles of any length (self, direct, indirect) that include the selected file.

## All Possible Scenarios

- Selected file = one concrete file path (via `inFile(...)`)

**Scenario 1**: Selected file has NO dependencies

- **Result**: ✅ PASS — No cycles possible

**Scenario 2**: Selected file has dependencies but is NOT part of any cycle

- **Result**: ✅ PASS — Acyclic graph for the selected file

**Scenario 3**: Selected file is part of a DIRECT cycle (A → B → A)

- **Result**: ❌ FAIL — Direct circular dependency involving the selected file

**Scenario 4**: Selected file is part of an INDIRECT cycle (A → B → C → A)

- **Result**: ❌ FAIL — Indirect circular dependency involving the selected file

**Scenario 5**: Selected file has a SELF cycle (A → A)

- **Result**: ❌ FAIL — The file imports itself directly or effectively

## Scenario Examples

### Scenario 1: Selected file has NO dependencies

```
project/
├── src/
│   └── domain/
│       └── entities/
│           └── User.ts   // No imports
```

**File Content:**

```typescript
// src/domain/entities/User.ts
export class User {
  constructor(
    public name: string,
    public email: string,
  ) {}
}
```

**API Usage:**

```typescript
projectFiles().inFile('**/domain/entities/User.ts').shouldNot().haveCycles().check();
```

**Result**: ✅ PASS — No dependencies, so no cycles

---

### Scenario 2: Selected file has dependencies but NO cycles

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   └── application/
│       └── use-cases/
│           └── CreateUser.ts   // Imports User.ts
```

**File Content:**

```typescript
// src/application/use-cases/CreateUser.ts
import { User } from '../../domain/entities/User';

export class CreateUser {
  execute(name: string, email: string): User {
    return new User(name, email);
  }
}
```

**API Usage:**

```typescript
projectFiles().inFile('**/application/use-cases/CreateUser.ts').shouldNot().haveCycles().check();
```

**Result**: ✅ PASS — Selected file has no cyclic path back to itself

---

### Scenario 3: Selected file is part of a DIRECT cycle (A → B → A)

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
await projectFiles().inFile('**/services/OrderService.ts').shouldNot().haveCycles().check(); // ❌ FAIL — OrderService participates in a direct cycle
```

**Result**: ❌ FAIL — OrderService ↔ PaymentService

---

### Scenario 4: Selected file is part of an INDIRECT cycle (A → B → C → A)

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
await projectFiles().inFile('**/modules/ProfileModule.ts').shouldNot().haveCycles().check(); // ❌ FAIL — ProfileModule is in an indirect cycle
```

**Result**: ❌ FAIL — AuthModule → UserModule → ProfileModule → AuthModule

---

### Scenario 5: Selected file has a SELF cycle (A → A)

```
project/
├── src/
│   └── components/
│       └── Recursive.ts  // Imports itself
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
await projectFiles().inFile('**/components/Recursive.ts').shouldNot().haveCycles().check();
```

**Result**: ❌ FAIL — File references itself directly, forming a cycle
