import { Options } from '../../common/options';

export class SlicesSelectorBuilder {
  constructor(private readonly props: { options: Options }) {}

  matching(): any {}
  forJavascript(): Omit<
    Omit<Omit<SlicesSelectorBuilder, 'forJavascript'>, 'forTypescript'>,
    'forCss'
  > {
    const selector = new SlicesSelectorBuilder({ options: this.props.options });
    return selector;
  }
  forTypescript(): Omit<
    Omit<Omit<SlicesSelectorBuilder, 'forJavascript'>, 'forTypescript'>,
    'forCss'
  > {
    const selector = new SlicesSelectorBuilder({ options: this.props.options });
    return selector;
  }
  forCss(): Omit<Omit<Omit<SlicesSelectorBuilder, 'forJavascript'>, 'forTypescript'>, 'forCss'> {
    const selector = new SlicesSelectorBuilder({ options: this.props.options });
    return selector;
  }
}
