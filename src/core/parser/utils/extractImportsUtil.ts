import fs from 'fs';
import path from 'path';

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export const extractImports = (filePath: string, normalizePath = false) => {
    const code = fs.readFileSync(filePath, 'utf-8');

  const ast = parse(code, {
    sourceType: 'unambiguous', // supports both ESM & CJS
    plugins: ['typescript']    // allows parsing TypeScript syntax
  });

  const imports: string[] = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      if (normalizePath) {
        imports.push(path.resolve(filePath, node.source.value));
      } else {
        imports.push(node.source.value);
      }
    },
    CallExpression({ node }) {
      if (
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        node.arguments.length === 1 &&
        node.arguments[0].type === 'StringLiteral'
      ) {
        if (normalizePath) {
          imports.push(path.resolve(filePath, node.arguments[0].value));
        } else {
          imports.push(node.arguments[0].value);
        }
      }
    }
  });

  return imports;
}