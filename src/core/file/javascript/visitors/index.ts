import type * as t from '@babel/types';
import type { Visitor, NodePath } from '@babel/traverse';

export type DefaultExportInfo = {
    hasDefaultExport: boolean;
    node?: t.ExportDefaultDeclaration;
};

export function createDefaultExportVisitor(info: DefaultExportInfo): Visitor {
    return {
        ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
            info.hasDefaultExport = true;
            info.node = path.node; // optional, keep the node if you need it later
            path.stop(); // optional, stop early once found
        },
    };
}

export type ImportDeclarationInfo = {
    totalImportedDependencies: number;
    addDependency: (dependencyName: string) => void;
};

export function createImportDeclarationVisitor(info: ImportDeclarationInfo): Visitor {
    return {
        ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
            info.totalImportedDependencies++;
            info.addDependency(path.node.source.value);
        },
    };
}

export type CallExpressionInfo = {
    totalRequiredDependencies: number;
    addDependency: (dependencyName: string) => void;
};

export function createCallExpressionVisitor(info: CallExpressionInfo): Visitor {
    return {
        CallExpression(path: NodePath<t.CallExpression>) {
            const node = path.node;
            if (
                node.callee.type === 'Identifier' &&
                node.callee.name === 'require' &&
                node.arguments.length === 1 &&
                node.arguments[0].type === 'StringLiteral'
            ) {
                info.totalRequiredDependencies++;
                info.addDependency(node.arguments[0].value);
            }
        },
    };
}

