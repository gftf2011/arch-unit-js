import { create } from 'enhanced-resolve';
import micromatch from 'micromatch';
import { createRequire } from 'module';
import * as path from 'pathe';

import {
  DependencyProps,
  Resolvable,
  ResolvableDependencyProps,
  ResolvableResponse,
} from '@/core/dependency/common';
import { nodejs } from '@/utils';

export class BuildinModuleResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }
  public override resolve(): ResolvableResponse {
    if (nodejs.isBuiltinModule(this.depProps.name)) {
      this.depProps.type = 'node-builtin-module';
      return { status: 'resolved', depProps: { ...this.depProps } };
    }
    return { status: 'unresolved', depProps: this.depProps };
  }
}

export class PackageJsonDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }
  public override resolve(): ResolvableResponse {
    if (nodejs.isPackageJsonDependency(this.resolvableProps.rootDir, this.depProps.name)) {
      this.depProps.type = 'node-package';
      return { status: 'resolved', depProps: { ...this.depProps } };
    }
    return { status: 'unresolved', depProps: this.depProps };
  }
}

export class PackageJsonDevDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }
  public override resolve(): ResolvableResponse {
    if (nodejs.isPackageJsonDevDependency(this.resolvableProps.rootDir, this.depProps.name)) {
      this.depProps.type = 'node-dev-package';
      return { status: 'resolved', depProps: { ...this.depProps } };
    }
    return { status: 'unresolved', depProps: this.depProps };
  }
}

export class ModuleAliasDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }

  public override resolve(): ResolvableResponse {
    if (this.depProps.resolvedWith === 'require') {
      try {
        const candidate = path.normalize(require.resolve(this.depProps.name));
        const dependency = micromatch(this.resolvableProps.availableFiles, [candidate])[0];
        if (dependency) {
          this.depProps.type = 'valid-path';
          this.depProps.name = dependency;
          return { status: 'resolved', depProps: { ...this.depProps } };
        }
      } catch (_) {
        return { status: 'unresolved', depProps: this.depProps };
      }
    }
    return { status: 'unresolved', depProps: this.depProps };
  }
}

export class TypescriptPathDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }
  public override resolve(): ResolvableResponse {
    try {
      if (this.resolvableProps.typescriptPath) {
        const require = createRequire(path.join(this.resolvableProps.rootDir, 'package.json'));
        const ts = require('typescript');

        const { dir, base } = path.parse(this.resolvableProps.typescriptPath);

        const configPath = ts.findConfigFile(dir, ts.sys.fileExists, base);

        if (configPath) {
          const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
          const parsed = ts.parseJsonConfigFileContent(
            configFile.config,
            ts.sys,
            path.dirname(configPath),
          );
          const result = ts.resolveModuleName(
            this.depProps.name,
            this.resolvableProps.filePath,
            parsed.options,
            ts.sys,
          );

          const resolvedDependency = result.resolvedModule?.resolvedFileName;

          if (resolvedDependency) {
            const dependency = micromatch(this.resolvableProps.availableFiles, [
              resolvedDependency,
            ])[0];
            if (dependency) {
              this.depProps.type = 'valid-path';
              this.depProps.name = dependency;
              return { status: 'resolved', depProps: { ...this.depProps } };
            }
          }
        }
      }
      return { status: 'unresolved', depProps: { ...this.depProps } };
    } catch (_error) {
      return { status: 'unresolved', depProps: { ...this.depProps } };
    }
  }
}

export class WebpackDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }

  private resolveWebpackConfig(webpackPath: string): any[] {
    const { dir, base } = path.parse(webpackPath);
    const require = createRequire(dir);
    const webpackConfig = require(`${dir}/${base}`);

    let config: any = null;

    if (webpackConfig && webpackConfig.__esModule !== true) {
      if (Object.getPrototypeOf(webpackConfig) === null) {
        const key = Object.keys(webpackConfig)[0];
        const value = webpackConfig[key];
        config = typeof value === 'function' ? value({}, {}) : value;
      } else {
        config = typeof webpackConfig === 'function' ? webpackConfig({}, {}) : webpackConfig;
      }
    } else if (webpackConfig.default) {
      config =
        typeof webpackConfig.default === 'function'
          ? webpackConfig.default({}, {})
          : webpackConfig.default;
    }

    if (config) {
      return Array.isArray(config) ? config : [config];
    }

    throw new Error('Invalid webpack config');
  }

  private filterWebpackConfig(webpackConfigs: any[]): any[] {
    if (this.resolvableProps.webpack?.names) {
      return webpackConfigs.filter((webpackConfig) => {
        return this.resolvableProps.webpack?.names?.includes(webpackConfig.name);
      });
    }
    return webpackConfigs;
  }

  public override resolve(): ResolvableResponse {
    if (!this.resolvableProps.webpack) {
      return { status: 'unresolved', depProps: this.depProps };
    }
    try {
      const webpackConfigs = this.resolveWebpackConfig(this.resolvableProps.webpack?.path);
      const filteredWebpackConfigs = this.filterWebpackConfig(webpackConfigs);
      for (const webpackConfig of filteredWebpackConfigs) {
        const resolver = create.sync(webpackConfig.resolve || {});
        const { dir } = path.parse(this.resolvableProps.filePath);
        try {
          const resolvedDependency = resolver(dir, this.depProps.name);
          if (resolvedDependency) {
            const dependency = micromatch(this.resolvableProps.availableFiles, [
              resolvedDependency,
            ])[0];
            if (dependency) {
              this.depProps.type = 'valid-path';
              this.depProps.name = dependency;
              return { status: 'resolved', depProps: { ...this.depProps } };
            }
          }
        } catch (_error) {
          continue;
        }
      }
      return { status: 'unresolved', depProps: this.depProps };
    } catch (_error) {
      return { status: 'unresolved', depProps: this.depProps };
    }
  }
}

export class ValidPathDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }
  public override resolve(): ResolvableResponse {
    try {
      const require = createRequire(this.resolvableProps.filePath);

      const dependencyCandidate = path.normalize(require.resolve(this.depProps.name));

      const dependency = micromatch(this.resolvableProps.availableFiles, [dependencyCandidate])[0];
      if (dependency) {
        this.depProps.type = 'valid-path';
        this.depProps.name = dependency;
        return { status: 'resolved', depProps: { ...this.depProps } };
      }
      return { status: 'unresolved', depProps: this.depProps };
    } catch (_error) {
      return { status: 'unresolved', depProps: this.depProps };
    }
  }
}

export class InvalidDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }
  public override resolve(): ResolvableResponse {
    this.depProps.type = 'invalid';
    return { status: 'resolved', depProps: { ...this.depProps } };
  }
}
