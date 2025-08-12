import type { Visitor, NodePath } from '@babel/traverse';
import type * as t from '@babel/types';

import { ResolveDependenciesVisitorInfo } from './info';
import { BabelVisitor } from './common';

export class ResolveDependenciesVisitor implements BabelVisitor<ResolveDependenciesVisitorInfo> {
  public visit(info: ResolveDependenciesVisitorInfo): Visitor {
    return {
      ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
        info.totalImportedDependencies++;
        info.addDependency(path.node.source.value, 'import');
      },
      CallExpression(path: NodePath<t.CallExpression>) {
        const node = path.node;

        // Handle dynamic import('...')
        if (node.callee.type === 'Import') {
          const arg = node.arguments[0] as t.Expression | undefined;

          let value: string | undefined;
          let resolvable = false;

          if (arg && arg.type === 'StringLiteral') {
            value = arg.value;
            resolvable = true;
          } else if (arg && arg.type === 'TemplateLiteral' && arg.expressions.length === 0) {
            value = arg.quasis[0]?.value.cooked ?? '';
            resolvable = true;
          }

          if (resolvable && value) {
            info.totalDinamicImportedDependencies++;
            info.addDependency(value, 'import');
          }
          return;
        }

        // Handle require('...')
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          info.totalRequiredDependencies++;
          info.addDependency(node.arguments[0].value, 'require');
        }
      },
    };
  }
}
