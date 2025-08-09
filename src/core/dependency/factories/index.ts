import { Dependency, DependencyProps } from '../common';
import { JavascriptRelatedDependency } from '../javascript';

export class DependencyFactory {
  public static create(props: Omit<DependencyProps, 'type'>): Dependency {
    if (props.comesFrom === 'javascript') {
      return JavascriptRelatedDependency.create(props);
    }
    throw new Error(`Unsupported dependency type: ${props.name}`);
  }
}
