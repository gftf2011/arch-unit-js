import { Dependency, DependencyProps, ResolvableDependencyProps } from '@/core/dependency/common';
import { ResolvableIterator } from '@/core/dependency/javascript/iterators';
import {
  BuildinModuleResolvable,
  InvalidDependencyResolvable,
  ModuleAliasDependencyResolvable,
  PackageJsonDependencyResolvable,
  PackageJsonDevDependencyResolvable,
  TypescriptPathDependencyResolvable,
  ValidPathDependencyResolvable,
} from '@/core/dependency/javascript/resolvables';

export class JavascriptRelatedDependency extends Dependency {
  private constructor(public props: DependencyProps) {
    super(props);
  }
  public static create(props: Omit<DependencyProps, 'type'>): JavascriptRelatedDependency {
    return new JavascriptRelatedDependency({
      ...props,
      type: 'unknown',
    });
  }

  public override resolve(resolvableProps: ResolvableDependencyProps): this {
    const iterator = new ResolvableIterator();
    iterator.add(new BuildinModuleResolvable({ ...this.props }, { ...resolvableProps }));
    iterator.add(new PackageJsonDependencyResolvable({ ...this.props }, { ...resolvableProps }));
    iterator.add(new PackageJsonDevDependencyResolvable({ ...this.props }, { ...resolvableProps }));
    iterator.add(new ValidPathDependencyResolvable({ ...this.props }, { ...resolvableProps }));
    iterator.add(new ModuleAliasDependencyResolvable({ ...this.props }, { ...resolvableProps }));
    iterator.add(new TypescriptPathDependencyResolvable({ ...this.props }, { ...resolvableProps }));
    iterator.add(new InvalidDependencyResolvable({ ...this.props }, { ...resolvableProps }));

    while (!iterator.resolved()) iterator.next();

    this.props.type = iterator.get()?.depProps.type || 'unknown';
    this.props.name = iterator.get()?.depProps.name || this.props.name;

    return this;
  }
}
