import { Options } from "../../common/options";

export class MetricsSelectorBuilder {
    constructor(private readonly props: { options: Options }) {}

    inFile(): any {}
    inFiles(): any {}
    inDirectory(): any {}
    inDirectories(): any {}
    forJavascript(): Omit<Omit<Omit<MetricsSelectorBuilder, 'forJavascript'>, 'forTypescript'>, 'forCss'> {
        const selector = new MetricsSelectorBuilder({ options: this.props.options });
        return selector;
    }
    forTypescript(): Omit<Omit<Omit<MetricsSelectorBuilder, 'forJavascript'>, 'forTypescript'>, 'forCss'> {
        const selector = new MetricsSelectorBuilder({ options: this.props.options });
        return selector;
    }
    forCss(): Omit<Omit<Omit<MetricsSelectorBuilder, 'forJavascript'>, 'forTypescript'>, 'forCss'> {
        const selector = new MetricsSelectorBuilder({ options: this.props.options });
        return selector;
    }
}