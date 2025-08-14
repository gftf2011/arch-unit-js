import micromatch from 'micromatch';
import { createRequire } from 'module';
import * as path from 'pathe';

import {
  DependencyProps,
  Resolvable,
  ResolvableDependencyProps,
  ResolvableResponse,
} from '@/core/dependency/common';
import { nodejs, javascript } from '@/utils';

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
      const clientRequire = createRequire(path.join(this.resolvableProps.rootDir, 'package.json'));
      const ts = clientRequire('typescript');

      const configPath = ts.findConfigFile(
        this.resolvableProps.rootDir,
        ts.sys.fileExists,
        'tsconfig.json',
      );

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

        const resolvedDependencyFileName = result.resolvedModule?.resolvedFileName;

        if (resolvedDependencyFileName) {
          const dependency = micromatch(this.resolvableProps.availableFiles, [
            resolvedDependencyFileName,
          ])[0];
          if (dependency) {
            this.depProps.type = 'valid-path';
            this.depProps.name = dependency;
            return { status: 'resolved', depProps: { ...this.depProps } };
          }
        }
      }
      return { status: 'unresolved', depProps: { ...this.depProps } };
    } catch (_error) {
      return { status: 'unresolved', depProps: { ...this.depProps } };
    }
  }
}

export class ValidPathDependencyResolvable extends Resolvable {
  constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
    super(depProps, resolvableProps);
  }
  public override resolve(): ResolvableResponse {
    const dependencyResolvedPath = path.resolve(
      path.dirname(this.resolvableProps.filePath),
      this.depProps.name,
    );
    const dependencyCandidates = javascript.generateDependenciesCandidates(
      dependencyResolvedPath,
      this.resolvableProps.extensions,
    );
    const dependencyCandidateIfExists =
      javascript.getDependencyCandidateIfExists(dependencyCandidates);

    if (dependencyCandidateIfExists) {
      const dependency = micromatch(this.resolvableProps.availableFiles, [
        dependencyCandidateIfExists,
      ])[0];
      if (dependency) {
        this.depProps.type = 'valid-path';
        this.depProps.name = dependency;
        return { status: 'resolved', depProps: { ...this.depProps } };
      }
    }
    return { status: 'unresolved', depProps: this.depProps };
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
