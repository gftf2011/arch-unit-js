import { CheckOperation } from '@/operations/check-operation';
import { Argument } from '@/common/argument';
import { Options } from '@/common/options';
import { Check } from '@/common/check';
import { GlobPattern, ProjectType } from '@/common/types';
import { HaveNameOperand } from '@/operands/have-name-operand';
import { HaveNameStartingWithOperand } from '@/operands/have-name-starting-with-operand';
import { HaveNameEndingWithOperand } from '@/operands/have-name-ending-with-operand';
import { HaveNameContainingOperand } from '@/operands/have-name-containing-operand';
import { OperationChecker } from '@/operation-checker';
import { DependsOnOperand } from '@/operands/depends-on-operand';
import { OnlyDependsOnOperand } from '@/operands/only-depends-on-operand';

abstract class AbstractCheckConditionBuilder implements Check {
  public abstract projectType: ProjectType;

  constructor(public condition: AbstractConditionBuilder) {}

  abstract and(): Omit<AbstractShouldSelectorBuilder, 'and'>;

  abstract check(): Promise<void>;
}

class CheckConditionBuilder extends AbstractCheckConditionBuilder {
  public override projectType: ProjectType = ProjectType.Any;

  constructor(public condition: AbstractConditionBuilder) {
    super(condition);
  }

  override and(): Omit<ShouldSelectorBuilder, 'and'> {
    return new ShouldSelectorBuilder(
      this.condition.options,
      [...this.condition.rules, ', and'],
      this.condition.args,
      this.condition.operations,
    );
  }

  override async check(): Promise<void> {
    const operationChecker = new OperationChecker(
      this.projectType,
      this.condition.options,
      this.condition.rules,
      this.condition.args,
      this.condition.operations,
    );

    await operationChecker.check();
  }
}

class CheckConditionBuilder_ForJavascript extends AbstractCheckConditionBuilder {
  public override projectType: ProjectType = ProjectType.Javascript;

  constructor(public condition: AbstractConditionBuilder) {
    super(condition);
  }

  override and(): Omit<ShouldSelectorBuilder_ForJavascript, 'and'> {
    return new ShouldSelectorBuilder_ForJavascript(
      this.condition.options,
      [...this.condition.rules, ', and'],
      this.condition.args,
      this.condition.operations,
    );
  }

  override async check(): Promise<void> {
    const operationChecker = new OperationChecker(
      this.projectType,
      this.condition.options,
      this.condition.rules,
      this.condition.args,
      this.condition.operations,
    );

    await operationChecker.check();
  }
}

class CheckConditionBuilder_ForTypescript extends AbstractCheckConditionBuilder {
  public override projectType: ProjectType = ProjectType.Typescript;

  constructor(public condition: AbstractConditionBuilder) {
    super(condition);
  }

  override and(): Omit<ShouldSelectorBuilder_ForTypescript, 'and'> {
    return new ShouldSelectorBuilder_ForTypescript(
      this.condition.options,
      [...this.condition.rules, ', and'],
      this.condition.args,
      this.condition.operations,
    );
  }

  override async check(): Promise<void> {
    const operationChecker = new OperationChecker(
      this.projectType,
      this.condition.options,
      this.condition.rules,
      this.condition.args,
      this.condition.operations,
    );

    await operationChecker.check();
  }
}

class CheckConditionBuilder_ForCss extends AbstractCheckConditionBuilder {
  public override projectType: ProjectType = ProjectType.Css;

  constructor(public condition: AbstractConditionBuilder) {
    super(condition);
  }

  override and(): Omit<ShouldSelectorBuilder_ForCss, 'and'> {
    return new ShouldSelectorBuilder_ForCss(
      this.condition.options,
      [...this.condition.rules, ', and'],
      this.condition.args,
      this.condition.operations,
    );
  }

  override async check(): Promise<void> {
    const operationChecker = new OperationChecker(
      this.projectType,
      this.condition.options,
      this.condition.rules,
      this.condition.args,
      this.condition.operations,
    );

    await operationChecker.check();
  }
}

// ------------------------------------------------------------

abstract class AbstractConditionBuilder {
  public abstract negated: boolean;
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {}

  abstract haveName(pattern: GlobPattern): AbstractCheckConditionBuilder;
  abstract haveNameStartingWith(prefix: string): AbstractCheckConditionBuilder;
  abstract haveNameEndingWith(suffix: string): AbstractCheckConditionBuilder;
  abstract haveNameContaining(substring: string): AbstractCheckConditionBuilder;
  abstract dependsOn(dependencies: GlobPattern | GlobPattern[]): AbstractCheckConditionBuilder;
  abstract onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): AbstractCheckConditionBuilder;
  abstract beFreeOfCycles(): AbstractCheckConditionBuilder;
}

class PositiveConditionBuilder extends AbstractConditionBuilder {
  public override negated: boolean = false;
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder(this);
  }

  override dependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder(this);
  }

  override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder(this);
  }
}

class NegativeConditionBuilder extends AbstractConditionBuilder {
  public override negated: boolean = true;

  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder(this);
  }

  override dependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder(this);
  }

  override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder(this);
  }
}

abstract class AbstractConditionBuilder_ForJavascript extends AbstractConditionBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  abstract haveClassComponent(something: any[]): AbstractCheckConditionBuilder;
}

class PositiveConditionBuilder_ForJavascript extends AbstractConditionBuilder_ForJavascript {
  public override negated: boolean = false;

  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override dependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForJavascript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override onlyDependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForJavascript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder_ForJavascript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveClassComponent(something: any[]): CheckConditionBuilder_ForJavascript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForJavascript(this);
  }
}

class NegativeConditionBuilder_ForJavascript extends AbstractConditionBuilder_ForJavascript {
  public override negated: boolean = true;

  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder_ForJavascript {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override dependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForJavascript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override onlyDependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForJavascript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder_ForJavascript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForJavascript(this);
  }

  override haveClassComponent(something: any[]): CheckConditionBuilder_ForJavascript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForJavascript(this);
  }
}

abstract class AbstractConditionBuilder_ForTypescript extends AbstractConditionBuilder_ForJavascript {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }
}

class PositiveConditionBuilder_ForTypescript extends AbstractConditionBuilder_ForTypescript {
  public override negated: boolean = false;

  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override dependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForTypescript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override onlyDependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForTypescript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder_ForTypescript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveClassComponent(something: any[]): CheckConditionBuilder_ForTypescript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForTypescript(this);
  }
}

class NegativeConditionBuilder_ForTypescript extends AbstractConditionBuilder_ForTypescript {
  public override negated: boolean = true;

  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder_ForTypescript {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override dependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForTypescript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override onlyDependsOn(
    dependencies: GlobPattern | GlobPattern[],
  ): CheckConditionBuilder_ForTypescript {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder_ForTypescript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForTypescript(this);
  }

  override haveClassComponent(something: any[]): CheckConditionBuilder_ForTypescript {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForTypescript(this);
  }
}

abstract class AbstractConditionBuilder_ForCss extends AbstractConditionBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }
}

class PositiveConditionBuilder_ForCss extends AbstractConditionBuilder_ForCss {
  public override negated: boolean = false;

  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder_ForCss {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder_ForCss {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder_ForCss {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder_ForCss {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder_ForCss(this);
  }

  override dependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder_ForCss {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder_ForCss {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder_ForCss(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder_ForCss {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForCss(this);
  }
}

class NegativeConditionBuilder_ForCss extends AbstractConditionBuilder_ForCss {
  public override negated: boolean = true;

  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override haveName(pattern: GlobPattern): CheckConditionBuilder_ForCss {
    this.rules.push(`have name "${pattern}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameOperand(pattern)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override haveNameStartingWith(prefix: string): CheckConditionBuilder_ForCss {
    this.rules.push(`have name starting with "${prefix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameStartingWithOperand(prefix)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override haveNameEndingWith(suffix: string): CheckConditionBuilder_ForCss {
    this.rules.push(`have name ending with "${suffix}"`);
    this.operations.push(new CheckOperation(this.negated, new HaveNameEndingWithOperand(suffix)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override haveNameContaining(substring: string): CheckConditionBuilder_ForCss {
    this.rules.push(`have name containing "${substring}"`);
    this.operations.push(
      new CheckOperation(this.negated, new HaveNameContainingOperand(substring)),
    );
    return new CheckConditionBuilder_ForCss(this);
  }

  override dependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder_ForCss {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(new CheckOperation(this.negated, new DependsOnOperand(dependenciesArray)));
    return new CheckConditionBuilder_ForCss(this);
  }

  override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): CheckConditionBuilder_ForCss {
    const dependenciesArray = typeof dependencies === 'string' ? [dependencies] : dependencies;
    this.rules.push(`only depends on [${dependenciesArray.join(', ')}]`);
    this.operations.push(
      new CheckOperation(this.negated, new OnlyDependsOnOperand(dependenciesArray)),
    );
    return new CheckConditionBuilder_ForCss(this);
  }

  override beFreeOfCycles(): CheckConditionBuilder_ForCss {
    // this.operations.push(new CheckOperation());
    return new CheckConditionBuilder_ForCss(this);
  }
}

// ------------------------------------------------------------

abstract class AbstractShouldSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {}
  abstract should(): PositiveConditionBuilder;
  abstract shouldNot(): NegativeConditionBuilder;
  abstract and(): AbstractFilesSelectorBuilder;
}

class ShouldSelectorBuilder extends AbstractShouldSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }
  should(): PositiveConditionBuilder {
    return new PositiveConditionBuilder(
      this.options,
      [...this.rules, 'should'],
      this.args,
      this.operations,
    );
  }
  shouldNot(): NegativeConditionBuilder {
    return new NegativeConditionBuilder(
      this.options,
      [...this.rules, 'should not'],
      this.args,
      this.operations,
    );
  }
  and(): FilesSelectorBuilder {
    return new FilesSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

class ShouldSelectorBuilder_ForJavascript extends AbstractShouldSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }
  should(): PositiveConditionBuilder_ForJavascript {
    return new PositiveConditionBuilder_ForJavascript(
      this.options,
      [...this.rules, 'should'],
      this.args,
      this.operations,
    );
  }
  shouldNot(): NegativeConditionBuilder_ForJavascript {
    return new NegativeConditionBuilder_ForJavascript(
      this.options,
      [...this.rules, 'should not'],
      this.args,
      this.operations,
    );
  }
  and(): JavascriptFilesSelectorBuilder {
    return new JavascriptFilesSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

class ShouldSelectorBuilder_ForTypescript extends AbstractShouldSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }
  should(): PositiveConditionBuilder_ForTypescript {
    return new PositiveConditionBuilder_ForTypescript(
      this.options,
      [...this.rules, 'should'],
      this.args,
      this.operations,
    );
  }
  shouldNot(): NegativeConditionBuilder_ForTypescript {
    return new NegativeConditionBuilder_ForTypescript(
      this.options,
      [...this.rules, 'should not'],
      this.args,
      this.operations,
    );
  }
  and(): TypescriptFilesSelectorBuilder {
    return new TypescriptFilesSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

class ShouldSelectorBuilder_ForCss extends AbstractShouldSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }
  should(): PositiveConditionBuilder_ForCss {
    return new PositiveConditionBuilder_ForCss(
      this.options,
      [...this.rules, 'should'],
      this.args,
      this.operations,
    );
  }
  shouldNot(): NegativeConditionBuilder_ForCss {
    return new NegativeConditionBuilder_ForCss(
      this.options,
      [...this.rules, 'should not'],
      this.args,
      this.operations,
    );
  }
  and(): CssFilesSelectorBuilder {
    return new CssFilesSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

// ------------------------------------------------------------

abstract class AbstractFilesSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {}

  abstract inFile(pattern: string): AbstractShouldSelectorBuilder;
  abstract inFiles(patterns: string[]): AbstractShouldSelectorBuilder;
  abstract inDirectory(patterns: string[]): AbstractShouldSelectorBuilder;
  abstract inDirectories(patterns: string[]): AbstractShouldSelectorBuilder;
}

class JavascriptFilesSelectorBuilder extends AbstractFilesSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): ShouldSelectorBuilder_ForJavascript {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new ShouldSelectorBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): ShouldSelectorBuilder_ForJavascript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): ShouldSelectorBuilder_ForJavascript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): ShouldSelectorBuilder_ForJavascript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }
}

class TypescriptFilesSelectorBuilder extends AbstractFilesSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): ShouldSelectorBuilder_ForTypescript {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new ShouldSelectorBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): ShouldSelectorBuilder_ForTypescript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): ShouldSelectorBuilder_ForTypescript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): ShouldSelectorBuilder_ForTypescript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }
}

class CssFilesSelectorBuilder extends AbstractFilesSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: CheckOperation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): ShouldSelectorBuilder_ForCss {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new ShouldSelectorBuilder_ForCss(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): ShouldSelectorBuilder_ForCss {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForCss(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): ShouldSelectorBuilder_ForCss {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForCss(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): ShouldSelectorBuilder_ForCss {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder_ForCss(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }
}

export class FilesSelectorBuilder extends AbstractFilesSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[] = [],
    public operations: CheckOperation<any>[] = [],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): ShouldSelectorBuilder {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new ShouldSelectorBuilder(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): ShouldSelectorBuilder {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): ShouldSelectorBuilder {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): ShouldSelectorBuilder {
    this.args.push(Argument.create().setValues(patterns));
    const should = new ShouldSelectorBuilder(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }

  forJavascript(): JavascriptFilesSelectorBuilder {
    const selector = new JavascriptFilesSelectorBuilder(
      this.options,
      [...this.rules, 'for javascript'],
      this.args,
      this.operations,
    );
    return selector;
  }
  forTypescript(): TypescriptFilesSelectorBuilder {
    const selector = new TypescriptFilesSelectorBuilder(
      this.options,
      [...this.rules, 'for typescript'],
      this.args,
      this.operations,
    );
    return selector;
  }
  forCss(): CssFilesSelectorBuilder {
    const selector = new CssFilesSelectorBuilder(
      this.options,
      [...this.rules, 'for css'],
      this.args,
      this.operations,
    );
    return selector;
  }
}
