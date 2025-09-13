import { Options } from '../common/options';
import { FilesSelectorBuilder } from './files';
import { LayersSelectorBuilder } from './layers';
import { MetricsSelectorBuilder } from './metrics';
import { SlicesSelectorBuilder } from './slices';

export class ProjectBuilder {
  private constructor(private readonly props: { options: Options }) {}

  static create(options: Options): ProjectBuilder {
    return new ProjectBuilder({ options });
  }

  projectFiles(): FilesSelectorBuilder {
    const selector = new FilesSelectorBuilder(this.props.options, ['project files']);
    return selector;
  }

  // projectMetrics(): MetricsSelectorBuilder {
  //     const selector = new MetricsSelectorBuilder(
  //         this.props.options,
  //         ['project metrics']
  //     );
  //     return selector;
  // }

  // projectSlices(): SlicesSelectorBuilder {
  //     const selector = new SlicesSelectorBuilder({
  //         ...this.props,
  //         rules: ['project slices']
  //     });
  //     return selector;
  // }

  // projectLayers(): LayersSelectorBuilder {
  //     const selector = new LayersSelectorBuilder({
  //         ...this.props,
  //         rules: ['project layers']
  //     });
  //     return selector;
  // }
}
