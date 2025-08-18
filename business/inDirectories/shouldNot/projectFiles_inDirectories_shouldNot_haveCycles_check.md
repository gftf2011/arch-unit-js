# Project Files in Directories Should NOT Have Cycles

## Business Rule Description

DESCRIPTION: Files in the specified directories must NOT have circular dependencies. The rule passes only when the combined dependency graph (from the union of the given directories) contains no cycles.

- It is NOT OK if ANY circular dependencies exist
- It is OK if NO circular dependencies exist

This rule ensures architectural integrity across multiple directories by preventing circular dependencies that can lead to:

- Compilation issues and build failures
- Runtime errors and stack overflow exceptions
- Tight coupling and reduced maintainability
- Difficulty in testing and mocking components
- Problems with module loading and initialization order

Circular dependencies violate clean architecture principles and indicate design flaws that should be resolved through dependency inversion, abstraction layers, or architectural refactoring.

Note: The `shouldNot.haveCycles` rule analyzes the dependency graph across all selected directories and detects cycles of any length (direct cycles, indirect cycles, and self-cycles).

## All Possible Scenarios

Scenario 1: Selected directories contain files with NO dependencies

- Result: ✅ PASS — No cycles possible without dependencies

Scenario 2: Selected directories contain files with dependencies but NO cycles

- Result: ✅ PASS — Clean acyclic dependency structure

Scenario 3: Selected directories contain files with DIRECT cycles (A → B → A)

- Result: ❌ FAIL — Direct circular dependency detected

Scenario 4: Selected directories contain files with INDIRECT cycles (A → B → C → A)

- Result: ❌ FAIL — Indirect circular dependency detected

Scenario 5: Selected directories contain files with SELF cycles (A → A)

- Result: ❌ FAIL — Self-referencing dependency detected

## Scenario Examples

### Scenario 1: Multiple directories, files with NO dependencies

```
project/
├── src/
│   ├── domain/entities/
│   │   ├── User.ts       // No imports
│   │   └── Product.ts    // No imports
│   └── utils/Constants.ts // No imports
```

API Usage:

```typescript
projectFiles().inDirectories(['**/domain/**', '**/utils/**']).shouldNot().haveCycles().check();
```

Result: ✅ PASS — No dependencies means no cycles possible

### Scenario 2: Multiple directories, dependencies but NO cycles

```
project/
├── src/
│   ├── domain/entities/User.ts
│   ├── application/use-cases/CreateUser.ts   // imports: ../domain/entities/User
│   └── infrastructure/repositories/UserRepository.ts // imports: ../domain/entities/User and ../application/use-cases/CreateUser
```

API Usage:

```typescript
projectFiles()
  .inDirectories(['**/application/**', '**/infrastructure/**'])
  .shouldNot()
  .haveCycles()
  .check();
```

Result: ✅ PASS — Acyclic flow across directories: UserRepository → CreateUser → User

### Scenario 3: Multiple directories, DIRECT cycle (A → B → A)

```
project/
├── src/services/OrderService.ts        // imports: ./PaymentService
├── src/services/PaymentService.ts      // imports: ./OrderService  ❌
```

API Usage:

```typescript
projectFiles().inDirectories(['**/services/**']).shouldNot().haveCycles().check();
```

Result: ❌ FAIL — Direct circular dependency: OrderService ↔ PaymentService

### Scenario 4: Multiple directories, INDIRECT cycle (A → B → C → A)

```
project/
├── src/modules/AuthModule.ts       // imports: ./UserModule
├── src/modules/UserModule.ts       // imports: ./ProfileModule
├── src/modules/ProfileModule.ts    // imports: ./AuthModule     ❌
```

API Usage:

```typescript
projectFiles().inDirectories(['**/modules/**']).shouldNot().haveCycles().check();
```

Result: ❌ FAIL — Indirect cycle: AuthModule → UserModule → ProfileModule → AuthModule

### Scenario 5: Multiple directories, SELF cycle (A → A)

```
project/
├── src/components/RecursiveComponent.ts // imports: ./RecursiveComponent  ❌
```

API Usage:

```typescript
projectFiles().inDirectories(['**/components/**']).shouldNot().haveCycles().check();
```

Result: ❌ FAIL — Self-referencing circular dependency: RecursiveComponent → RecursiveComponent
