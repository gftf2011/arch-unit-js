import { Operation } from "../../operations/base";
import { Arguments } from "../common/arguments";
import { Options } from "../common/options";

type GlobPattern = string;

class CheckConditionBuilder {
    constructor(public should: ShouldSelectorBuilder) {}

    and(): ShouldSelectorBuilder {
        return new ShouldSelectorBuilder(this.should.options, this.should.rules, this.should.args, this.should.operations);
    }
}

abstract class AbstractConditionBuilder {
    public abstract negated: boolean;
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {}

    abstract haveName(pattern: GlobPattern): any
    abstract haveNameStartingWith(prefix: string): any
    abstract haveNameEndingWith(suffix: string): any
    abstract haveNameContaining(substring: string): any
    abstract dependsOn(dependencies: GlobPattern | GlobPattern[]): any
    abstract onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any
    abstract beFreeOfCycles(): any
}

class PositiveConditionBuilder extends AbstractConditionBuilder {
    public override negated: boolean = false;
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation(this.negated));
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation(this.negated));
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation(this.negated));
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }
}

class NegativeConditionBuilder extends AbstractConditionBuilder {
    public override negated: boolean = true;
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation());
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }
}

abstract class AbstractConditionBuilder_ForJavascript extends AbstractConditionBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    abstract haveClassComponent(something: any[]): any
}

class PositiveConditionBuilder_ForJavascript extends AbstractConditionBuilder_ForJavascript {
    public override negated: boolean = false;

    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation());
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }

    override haveClassComponent(something: any[]): any {
        // this.operations.push(new Operation());
    }
}

class NegativeConditionBuilder_ForJavascript extends AbstractConditionBuilder_ForJavascript {
    public override negated: boolean = true;

    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation());
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }

    override haveClassComponent(something: any[]): any {
        // this.operations.push(new Operation());
    }
}

abstract class AbstractConditionBuilder_ForTypescript extends AbstractConditionBuilder_ForJavascript {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }
}

class PositiveConditionBuilder_ForTypescript extends AbstractConditionBuilder_ForTypescript {
    public override negated: boolean = false;

    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation());
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }

    override haveClassComponent(something: any[]): any {
        // this.operations.push(new Operation());
    }
}

class NegativeConditionBuilder_ForTypescript extends AbstractConditionBuilder_ForTypescript {
    public override negated: boolean = true;

    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation());
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }

    override haveClassComponent(something: any[]): any {
        // this.operations.push(new Operation());
    }
}

abstract class AbstractConditionBuilder_ForCss extends AbstractConditionBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }
}

class PositiveConditionBuilder_ForCss extends AbstractConditionBuilder_ForCss {
    public override negated: boolean = false;

    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation());
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }
}

class NegativeConditionBuilder_ForCss extends AbstractConditionBuilder_ForCss {
    public override negated: boolean = true;

    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    override haveName(pattern: GlobPattern): any {
        // this.operations.push(new Operation());
    }

    override haveNameStartingWith(prefix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameEndingWith(suffix: string): any {
        // this.operations.push(new Operation());
    }

    override haveNameContaining(substring: string): any {
        // this.operations.push(new Operation());
    }

    override dependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override onlyDependsOn(dependencies: GlobPattern | GlobPattern[]): any {
        // this.operations.push(new Operation());
    }

    override beFreeOfCycles(): any {
        // this.operations.push(new Operation());
    }
}

abstract class AbstractShouldSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {}
    abstract should(): PositiveConditionBuilder
    abstract shouldNot(): NegativeConditionBuilder
    abstract and(): AbstractFilesSelectorBuilder
}

class ShouldSelectorBuilder extends AbstractShouldSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }
    should(): PositiveConditionBuilder {
        return new PositiveConditionBuilder(
            this.options,
            [...this.rules, 'should'],
            this.args,
            this.operations
        );
    }
    shouldNot(): NegativeConditionBuilder {
        return new NegativeConditionBuilder(
            this.options,
            [...this.rules, 'should not'],
            this.args,
            this.operations
        );
    }
    and(): FilesSelectorBuilder {
        return new FilesSelectorBuilder(
            this.options,
            [...this.rules, 'and'],
            this.args,
            this.operations
        );
    }
}

class ShouldSelectorBuilder_ForJavascript extends AbstractShouldSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }
    should(): PositiveConditionBuilder_ForJavascript {
        return new PositiveConditionBuilder_ForJavascript(
            this.options,
            [...this.rules, 'should'],
            this.args,
            this.operations
        );
    }
    shouldNot(): NegativeConditionBuilder_ForJavascript {
        return new NegativeConditionBuilder_ForJavascript(
            this.options,
            [...this.rules, 'should not'],
            this.args,
            this.operations
        );
    }
    and(): JavascriptFilesSelectorBuilder {
        return new JavascriptFilesSelectorBuilder(
            this.options,
            [...this.rules, 'and'],
            this.args,
            this.operations
        );
    }
}

class ShouldSelectorBuilder_ForTypescript extends AbstractShouldSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }
    should(): PositiveConditionBuilder_ForTypescript {
        return new PositiveConditionBuilder_ForTypescript(
            this.options,
            [...this.rules, 'should'],
            this.args,
            this.operations
        );
    }
    shouldNot(): NegativeConditionBuilder_ForTypescript {
        return new NegativeConditionBuilder_ForTypescript(
            this.options,
            [...this.rules, 'should not'],
            this.args,
            this.operations
        );
    }
    and(): TypescriptFilesSelectorBuilder {
        return new TypescriptFilesSelectorBuilder(
            this.options,
            [...this.rules, 'and'],
            this.args,
            this.operations
        );
    }
}

class ShouldSelectorBuilder_ForCss extends AbstractShouldSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }
    should(): PositiveConditionBuilder_ForCss {
        return new PositiveConditionBuilder_ForCss(
            this.options,
            [...this.rules, 'should'],
            this.args,
            this.operations
        );
    }
    shouldNot(): NegativeConditionBuilder_ForCss {
        return new NegativeConditionBuilder_ForCss(
            this.options,
            [...this.rules, 'should not'],
            this.args,
            this.operations
        );
    }
    and(): CssFilesSelectorBuilder {
        return new CssFilesSelectorBuilder(
            this.options,
            [...this.rules, 'and'],
            this.args,
            this.operations
        );
    }
}

abstract class AbstractFilesSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[] = [],
        public operations: Operation[] = []
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
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    inFile(pattern: string): ShouldSelectorBuilder_ForJavascript {
        this.args.push(Arguments.create().setValues([pattern]));
        const should = new ShouldSelectorBuilder_ForJavascript(
            this.options,
            [...this.rules, 'in file'],
            this.args,
            this.operations
        );
        return should;
    }
    inFiles(patterns: string[]): ShouldSelectorBuilder_ForJavascript {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForJavascript(
            this.options,
            [...this.rules, 'in files'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectory(patterns: string[]): ShouldSelectorBuilder_ForJavascript {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForJavascript(
            this.options,
            [...this.rules, 'in directory'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectories(patterns: string[]): ShouldSelectorBuilder_ForJavascript {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForJavascript(
            this.options,
            [...this.rules, 'in directories'],
            this.args,
            this.operations
        );
        return should;
    }
}

class TypescriptFilesSelectorBuilder extends AbstractFilesSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    inFile(pattern: string): ShouldSelectorBuilder_ForTypescript {
        this.args.push(Arguments.create().setValues([pattern]));
        const should = new ShouldSelectorBuilder_ForTypescript(
            this.options,
            [...this.rules, 'in file'],
            this.args,
            this.operations
        );
        return should;
    }
    inFiles(patterns: string[]): ShouldSelectorBuilder_ForTypescript {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForTypescript(
            this.options,
            [...this.rules, 'in files'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectory(patterns: string[]): ShouldSelectorBuilder_ForTypescript {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForTypescript(
            this.options,
            [...this.rules, 'in directory'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectories(patterns: string[]): ShouldSelectorBuilder_ForTypescript {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForTypescript(
            this.options,
            [...this.rules, 'in directories'],
            this.args,
            this.operations
        );
        return should;
    }
}

class CssFilesSelectorBuilder extends AbstractFilesSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[],
        public operations: Operation[]
    ) {
        super(options, rules, args, operations);
    }

    inFile(pattern: string): ShouldSelectorBuilder_ForCss {
        this.args.push(Arguments.create().setValues([pattern]));
        const should = new ShouldSelectorBuilder_ForCss(
            this.options,
            [...this.rules, 'in file'],
            this.args,
            this.operations
        );
        return should;
    }
    inFiles(patterns: string[]): ShouldSelectorBuilder_ForCss {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForCss(
            this.options,
            [...this.rules, 'in files'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectory(patterns: string[]): ShouldSelectorBuilder_ForCss {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForCss(
            this.options,
            [...this.rules, 'in directory'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectories(patterns: string[]): ShouldSelectorBuilder_ForCss {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder_ForCss(
            this.options,
            [...this.rules, 'in directories'],
            this.args,
            this.operations
        );
        return should;
    }
}

export class FilesSelectorBuilder extends AbstractFilesSelectorBuilder {
    constructor(
        public options: Options,
        public rules: string[],
        public args: Arguments[] = [],
        public operations: Operation[] = []
    ) {
        super(options, rules, args, operations);
    }

    inFile(pattern: string): ShouldSelectorBuilder {
        this.args.push(Arguments.create().setValues([pattern]));
        const should = new ShouldSelectorBuilder(
            this.options,
            [...this.rules, 'in file'],
            this.args,
            this.operations
        );
        return should;
    }
    inFiles(patterns: string[]): ShouldSelectorBuilder {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder(
            this.options,
            [...this.rules, 'in files'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectory(patterns: string[]): ShouldSelectorBuilder {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder(
            this.options,
            [...this.rules, 'in directory'],
            this.args,
            this.operations
        );
        return should;
    }
    inDirectories(patterns: string[]): ShouldSelectorBuilder {
        this.args.push(Arguments.create().setValues(patterns));
        const should = new ShouldSelectorBuilder(
            this.options,
            [...this.rules, 'in directories'],
            this.args,
            this.operations
        );
        return should;
    }

    forJavascript(): JavascriptFilesSelectorBuilder {
        const selector = new JavascriptFilesSelectorBuilder(
            this.options,
            [...this.rules, 'for javascript'],
            this.args,
            this.operations
        );
        return selector;
    }
    forTypescript(): TypescriptFilesSelectorBuilder {
        const selector = new TypescriptFilesSelectorBuilder(
            this.options,
            [...this.rules, 'for typescript'],
            this.args,
            this.operations
        );
        return selector;
    }
    forCss(): CssFilesSelectorBuilder {
        const selector = new CssFilesSelectorBuilder(
            this.options,
            [...this.rules, 'for css'],
            this.args,
            this.operations
        );
        return selector;
    }
}