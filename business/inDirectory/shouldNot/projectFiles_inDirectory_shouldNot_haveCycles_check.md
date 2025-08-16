# Project Files in Directory Should NOT Have Cycles

## Business Rule Description

**DESCRIPTION**: Files in the directory must NOT have circular dependencies. The rule passes only when the dependency graph contains no cycles, ensuring a clean acyclic architecture.

- It is NOT OK if ANY circular dependencies exist
- It is OK if NO circular dependencies exist

This rule ensures architectural integrity by preventing circular dependencies that can lead to:

- Compilation issues and build failures
- Runtime errors and stack overflow exceptions
- Tight coupling and reduced maintainability
- Difficulty in testing and mocking components
- Problems with module loading and initialization order

Circular dependencies violate clean architecture principles and indicate design flaws that should be resolved through dependency inversion, abstraction layers, or architectural refactoring.

**Note**: The `shouldNot.haveCycles` rule analyzes the complete dependency graph within the specified directory to detect cycles of any length (direct cycles, indirect cycles, and complex multi-file cycles).

## All Possible Scenarios

**Scenario 1**: Directory has files with NO dependencies

- **Result**: ✅ PASS - No cycles possible without dependencies

**Scenario 2**: Directory has files with dependencies but NO cycles

- **Result**: ✅ PASS - Clean acyclic dependency structure

**Scenario 3**: Directory has files with DIRECT cycles (A → B → A)

- **Result**: ❌ FAIL - Direct circular dependency detected

**Scenario 4**: Directory has files with INDIRECT cycles (A → B → C → A)

- **Result**: ❌ FAIL - Indirect circular dependency detected

**Scenario 5**: Directory has files with SELF cycles (A → A)

- **Result**: ❌ FAIL - Self-referencing dependency detected

## Scenario Examples

### Scenario 1: Directory has files with NO dependencies

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       ├── User.ts      // No imports
│   │       └── Product.ts   // No imports
│   └── utils/
│       └── Constants.ts     // No imports
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

// src/domain/entities/Product.ts
export class Product {
  constructor(
    public id: string,
    public name: string,
  ) {}
}

// src/utils/Constants.ts
export const API_URL = 'https://api.example.com';
export const MAX_RETRIES = 3;
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').shouldNot().haveCycles().check();
```

**Result**: ✅ PASS - No dependencies means no cycles possible

### Scenario 2: Directory has files with dependencies but NO cycles

```
project/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── User.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── CreateUser.ts    // Imports User.ts
│   └── infrastructure/
│       └── repositories/
│           └── UserRepository.ts // Imports User.ts and CreateUser.ts
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

// src/application/use-cases/CreateUser.ts
import { User } from '../../domain/entities/User';

export class CreateUser {
  execute(name: string, email: string): User {
    return new User(name, email);
  }
}

// src/infrastructure/repositories/UserRepository.ts
import { User } from '../../domain/entities/User';
import { CreateUser } from '../../application/use-cases/CreateUser';

export class UserRepository {
  private createUser = new CreateUser();

  save(name: string, email: string): User {
    return this.createUser.execute(name, email);
  }
}
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').shouldNot().haveCycles().check();
```

**Result**: ✅ PASS - Clean acyclic dependency flow: UserRepository → CreateUser → User

### Scenario 3: Directory has files with DIRECT cycles (A → B → A)

```
project/
├── src/
│   ├── services/
│   │   ├── OrderService.ts     // Imports PaymentService.ts
│   │   └── PaymentService.ts   // Imports OrderService.ts
```

**File Content:**

```typescript
// src/services/OrderService.ts
import { PaymentService } from './PaymentService';

export class OrderService {
  private paymentService = new PaymentService();

  processOrder(orderId: string) {
    return this.paymentService.processPayment(orderId);
  }
}

// src/services/PaymentService.ts
import { OrderService } from './OrderService'; // ❌ CIRCULAR DEPENDENCY

export class PaymentService {
  private orderService = new OrderService();

  processPayment(orderId: string) {
    return this.orderService.validateOrder(orderId);
  }
}
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/services/**').shouldNot().haveCycles().check();
```

**Result**: ❌ FAIL - Direct circular dependency: OrderService ↔ PaymentService

### Scenario 4: Directory has files with INDIRECT cycles (A → B → C → A)

```
project/
├── src/
│   ├── modules/
│   │   ├── AuthModule.ts      // Imports UserModule.ts
│   │   ├── UserModule.ts      // Imports ProfileModule.ts
│   │   └── ProfileModule.ts   // Imports AuthModule.ts
```

**File Content:**

```typescript
// src/modules/AuthModule.ts
import { UserModule } from './UserModule';

export class AuthModule {
  private userModule = new UserModule();

  authenticate(token: string) {
    return this.userModule.validateUser(token);
  }
}

// src/modules/UserModule.ts
import { ProfileModule } from './ProfileModule';

export class UserModule {
  private profileModule = new ProfileModule();

  validateUser(token: string) {
    return this.profileModule.getUserProfile(token);
  }
}

// src/modules/ProfileModule.ts
import { AuthModule } from './AuthModule'; // ❌ CIRCULAR DEPENDENCY

export class ProfileModule {
  private authModule = new AuthModule();

  getUserProfile(token: string) {
    return this.authModule.verifyToken(token);
  }
}
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/modules/**').shouldNot().haveCycles().check();
```

**Result**: ❌ FAIL - Indirect circular dependency: AuthModule → UserModule → ProfileModule → AuthModule

### Scenario 5: Directory has files with SELF cycles (A → A)

```
project/
├── src/
│   └── components/
│       └── RecursiveComponent.ts  // Imports itself
```

**File Content:**

```typescript
// src/components/RecursiveComponent.ts
import { RecursiveComponent } from './RecursiveComponent'; // ❌ SELF CIRCULAR DEPENDENCY

export class RecursiveComponent {
  private instance = new RecursiveComponent();

  render() {
    return this.instance.render();
  }
}
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/components/**').shouldNot().haveCycles().check();
```

**Result**: ❌ FAIL - Self-referencing circular dependency: RecursiveComponent → RecursiveComponent
