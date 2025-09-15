import { Argument } from '@/common/argument';
import { Options } from '@/common/options';
import { Operation } from '@/operations/operation';

interface GeneralMetricsType {
  general(): any;
}

interface NealFordMetricsType {
  nealFord(): any;
}

interface RobertCecilMartinMetricsType {
  robertCecilMartin(): any;
}

abstract class AbstractMetricsTypeBuilder implements GeneralMetricsType, NealFordMetricsType {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {}

  abstract general(): any;

  abstract nealFord(): any;
}

class MetricsTypeBuilder extends AbstractMetricsTypeBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override general(): any {}

  override nealFord(): any {}
}

abstract class AbstractMetricsTypeBuilder_ForJavascript
  extends AbstractMetricsTypeBuilder
  implements RobertCecilMartinMetricsType
{
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  abstract robertCecilMartin(): any;
}

class MetricsTypeBuilder_ForJavascript extends AbstractMetricsTypeBuilder_ForJavascript {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override general(): any {}

  override nealFord(): any {}

  override robertCecilMartin(): any {}
}

abstract class AbstractMetricsTypeBuilder_ForTypescript
  extends AbstractMetricsTypeBuilder
  implements RobertCecilMartinMetricsType
{
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  abstract robertCecilMartin(): any;
}

class MetricsTypeBuilder_ForTypescript extends AbstractMetricsTypeBuilder_ForTypescript {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override general(): any {}

  override nealFord(): any {}

  override robertCecilMartin(): any {}
}

class MetricsTypeBuilder_ForCss extends AbstractMetricsTypeBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  override general(): any {}

  override nealFord(): any {}
}

// ------------------------------------------------------------

abstract class AbstractMetricsBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {}

  abstract metrics(): AbstractMetricsTypeBuilder;

  abstract and(): AbstractMetricsSelectorBuilder;
}

class MetricsBuilder extends AbstractMetricsBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  metrics(): MetricsTypeBuilder {
    return new MetricsTypeBuilder(
      this.options,
      [...this.rules, 'metrics'],
      this.args,
      this.operations,
    );
  }

  and(): MetricsSelectorBuilder {
    return new MetricsSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

class MetricsBuilder_ForJavascript extends AbstractMetricsBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  metrics(): MetricsTypeBuilder_ForJavascript {
    return new MetricsTypeBuilder_ForJavascript(
      this.options,
      [...this.rules, 'metrics'],
      this.args,
      this.operations,
    );
  }

  and(): JavascriptMetricsSelectorBuilder {
    return new JavascriptMetricsSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

class MetricsBuilder_ForTypescript extends AbstractMetricsBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  metrics(): MetricsTypeBuilder_ForTypescript {
    return new MetricsTypeBuilder_ForTypescript(
      this.options,
      [...this.rules, 'metrics'],
      this.args,
      this.operations,
    );
  }

  and(): TypescriptMetricsSelectorBuilder {
    return new TypescriptMetricsSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

class MetricsBuilder_ForCss extends AbstractMetricsBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  metrics(): MetricsTypeBuilder_ForCss {
    return new MetricsTypeBuilder_ForCss(
      this.options,
      [...this.rules, 'metrics'],
      this.args,
      this.operations,
    );
  }

  and(): CssMetricsSelectorBuilder {
    return new CssMetricsSelectorBuilder(
      this.options,
      [...this.rules, 'and'],
      this.args,
      this.operations,
    );
  }
}

// ------------------------------------------------------------

abstract class AbstractMetricsSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {}

  abstract inFile(pattern: string): AbstractMetricsBuilder;
  abstract inFiles(patterns: string[]): AbstractMetricsBuilder;
  abstract inDirectory(patterns: string[]): AbstractMetricsBuilder;
  abstract inDirectories(patterns: string[]): AbstractMetricsBuilder;
}

export class JavascriptMetricsSelectorBuilder extends AbstractMetricsSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): MetricsBuilder_ForJavascript {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new MetricsBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): MetricsBuilder_ForJavascript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): MetricsBuilder_ForJavascript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): MetricsBuilder_ForJavascript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForJavascript(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }
}

export class TypescriptMetricsSelectorBuilder extends AbstractMetricsSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): MetricsBuilder_ForTypescript {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new MetricsBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): MetricsBuilder_ForTypescript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): MetricsBuilder_ForTypescript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): MetricsBuilder_ForTypescript {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForTypescript(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }
}

class CssMetricsSelectorBuilder extends AbstractMetricsSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[],
    public operations: Operation<any>[],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): MetricsBuilder_ForCss {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new MetricsBuilder_ForCss(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): MetricsBuilder_ForCss {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForCss(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): MetricsBuilder_ForCss {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForCss(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): MetricsBuilder_ForCss {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder_ForCss(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }
}

export class MetricsSelectorBuilder extends AbstractMetricsSelectorBuilder {
  constructor(
    public options: Options,
    public rules: string[],
    public args: Argument[] = [],
    public operations: Operation<any>[] = [],
  ) {
    super(options, rules, args, operations);
  }

  inFile(pattern: string): MetricsBuilder {
    this.args.push(Argument.create().setValues([pattern]));
    const should = new MetricsBuilder(
      this.options,
      [...this.rules, 'in file'],
      this.args,
      this.operations,
    );
    return should;
  }
  inFiles(patterns: string[]): MetricsBuilder {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder(
      this.options,
      [...this.rules, 'in files'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectory(patterns: string[]): MetricsBuilder {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder(
      this.options,
      [...this.rules, 'in directory'],
      this.args,
      this.operations,
    );
    return should;
  }
  inDirectories(patterns: string[]): MetricsBuilder {
    this.args.push(Argument.create().setValues(patterns));
    const should = new MetricsBuilder(
      this.options,
      [...this.rules, 'in directories'],
      this.args,
      this.operations,
    );
    return should;
  }

  forJavascript(): JavascriptMetricsSelectorBuilder {
    const selector = new JavascriptMetricsSelectorBuilder(
      this.options,
      [...this.rules, 'for javascript'],
      this.args,
      this.operations,
    );
    return selector;
  }
  forTypescript(): TypescriptMetricsSelectorBuilder {
    const selector = new TypescriptMetricsSelectorBuilder(
      this.options,
      [...this.rules, 'for typescript'],
      this.args,
      this.operations,
    );
    return selector;
  }
  forCss(): CssMetricsSelectorBuilder {
    const selector = new CssMetricsSelectorBuilder(
      this.options,
      [...this.rules, 'for css'],
      this.args,
      this.operations,
    );
    return selector;
  }
}
