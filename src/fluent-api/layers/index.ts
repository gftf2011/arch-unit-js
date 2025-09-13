import { Options } from '../../common/options';

export class LayersSelectorBuilder {
  constructor(private readonly props: { options: Options }) {}

  layer(): any {}
  forJavascript(): Omit<
    Omit<Omit<LayersSelectorBuilder, 'forJavascript'>, 'forTypescript'>,
    'forCss'
  > {
    const selector = new LayersSelectorBuilder({ options: this.props.options });
    return selector;
  }
  forTypescript(): Omit<
    Omit<Omit<LayersSelectorBuilder, 'forJavascript'>, 'forTypescript'>,
    'forCss'
  > {
    const selector = new LayersSelectorBuilder({ options: this.props.options });
    return selector;
  }
  forCss(): Omit<Omit<Omit<LayersSelectorBuilder, 'forJavascript'>, 'forTypescript'>, 'forCss'> {
    const selector = new LayersSelectorBuilder({ options: this.props.options });
    return selector;
  }
}
