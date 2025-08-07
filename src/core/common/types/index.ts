// FILES RELATED TYPES

export type FileType = 'file' | JavascriptOrTypescriptRelatedFileType;
export type JavascriptOrTypescriptRelatedFileType = 'javascript-file' | 'typescript-file';

// DEPENDENCIES RELATED TYPES

export type JavascriptRelatedDependencyType = 'node-builtin-module' | 'node-package' | 'node-dev-package' | 'valid-path' | 'invalid';
export type JavascriptRelatedDependencyResolvedWith = 'require' | 'import';
export type JavascriptRelatedDependencyComesFrom = 'javascript';

export type DependencyType = 'unknown' | JavascriptRelatedDependencyType;
export type DependencyResolvedWith = JavascriptRelatedDependencyResolvedWith;
export type NodeDependencyComesFrom = JavascriptRelatedDependencyComesFrom;
