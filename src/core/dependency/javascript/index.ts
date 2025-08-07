import { Dependency, DependencyProps } from "../common";
import {
    BuildinModuleResolvable,
    InvalidDependencyResolvable,
    PackageJsonDependencyResolvable,
    PackageJsonDevDependencyResolvable,
    ValidPathDependencyResolvable
} from './resolvables';
import { ResolvableIterator } from './iterators';

export class JavascriptRelatedDependency extends Dependency {
    private constructor(public props: DependencyProps) {
        super(props);
    }
    public static create(props: Omit<DependencyProps, 'type'>): JavascriptRelatedDependency {
        return new JavascriptRelatedDependency({
            ...props,
            type: 'unknown'
        });
    }

    public override resolve(
        rootDir: string,
        fileDir: string,
        availableFiles: string[]
    ): JavascriptRelatedDependency {
        const iterator = new ResolvableIterator();
        iterator.add(new BuildinModuleResolvable({ ...this.props }, { rootDir, fileDir, availableFiles }));
        iterator.add(new PackageJsonDependencyResolvable({ ...this.props }, { rootDir, fileDir, availableFiles }));
        iterator.add(new PackageJsonDevDependencyResolvable({ ...this.props }, { rootDir, fileDir, availableFiles }));
        iterator.add(new ValidPathDependencyResolvable({ ...this.props }, { rootDir, fileDir, availableFiles }));
        iterator.add(new InvalidDependencyResolvable({ ...this.props }, { rootDir, fileDir, availableFiles }));

        while (!iterator.resolved()) iterator.next();

        this.props.type = iterator.get()?.depProps.type || 'unknown';
        this.props.name = iterator.get()?.depProps.name || this.props.name;

        return this;
    }
}