export class Arguments {
    private constructor(private label: string = "", private values: string[] = []) {
        this.label = label;
    }

    public static create(): Arguments {
        return new Arguments();
    }

    setLabel(label: string): Arguments {
        this.label = label;
        return this;
    }

    getLabel(): string {
        return this.label;
    }

    setValues(values: string[]): Arguments {
        this.values = values;
        return this;
    }

    getValues(): string[] {
        return this.values;
    }
}