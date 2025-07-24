
import micromatch from 'micromatch';
import { Options } from '../common/fluent-api';
import { walkThrough } from '../common/walker';

class ImportMatchConditionSelector {
  constructor(
    readonly negated: boolean,
    readonly rootDir: string,
    readonly firstPattern: string,
    readonly secondPattern: string,
    readonly options: Options
  ) {}

  async check(): Promise<boolean> {
    const files = await walkThrough(this.rootDir, this.options.includeMatcher, this.options.ignoreMatcher, this.options.mimeTypes);
    const filteredFiles = files.filter(file => micromatch([file.path], this.secondPattern).length > 0);
    const filteredImports: string[] = [];

    for (const file of filteredFiles) {
        for (const dependency of file.dependencies) {
            if (micromatch.isMatch(dependency, this.firstPattern, { dot: true })) {
                filteredImports.push(dependency);
            }
        }
    }

    return this.negated ? filteredImports.length === 0 : filteredImports.length > 0;
  }
}

class PositiveMatchConditionSelectorBuilder {
    readonly negated: boolean = false;

    constructor(readonly rootDir: string, readonly pattern: string, readonly options: Options) {}

    beImportedOrRequiredBy(pattern: string): ImportMatchConditionSelector {
        return new ImportMatchConditionSelector(this.negated, this.rootDir, this.pattern, pattern, this.options);
    }
}

class NegativeMatchConditionSelectorBuilder {
    readonly negated: boolean = true;

    constructor(readonly rootDir: string, readonly pattern: string, readonly options: Options) {}

    beImportedOrRequiredBy(pattern: string): ImportMatchConditionSelector {
        return new ImportMatchConditionSelector(this.negated, this.rootDir, this.pattern, pattern, this.options);
    }
}

class ShouldSelectorBuilder {
  constructor(readonly rootDir: string, readonly pattern: string, readonly options: Options) {}

  should(): PositiveMatchConditionSelectorBuilder {
    return new PositiveMatchConditionSelectorBuilder(this.rootDir, this.pattern, this.options);
  }

  shouldNot(): NegativeMatchConditionSelectorBuilder {
    return new NegativeMatchConditionSelectorBuilder(this.rootDir, this.pattern, this.options);
  }
}

class ComponentSelector {
    constructor(readonly rootDir: string, readonly options: Options) {}

    inDirectory(pattern: string): ShouldSelectorBuilder {
        return new ShouldSelectorBuilder(this.rootDir, pattern, this.options);
    }
}

export class ComponentSelectorBuilder {
  private constructor(readonly rootDir: string, readonly options: Options) {}

  static create(rootDir: string, options: Options): ComponentSelectorBuilder {
    return new ComponentSelectorBuilder(rootDir, options);
  }

  projectFiles(): ComponentSelector {
    return new ComponentSelector(this.rootDir, this.options);
  }
}

// inDirectory.should.beInDirectory.check
// inDirectory.shouldNot.beInDirectory.check