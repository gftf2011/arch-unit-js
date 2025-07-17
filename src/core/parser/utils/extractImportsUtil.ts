import fs from 'fs';

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export const extractImports = (filePath: string) => {
    const code = fs.readFileSync(filePath, 'utf-8');

  const ast = parse(code, {
    sourceType: 'unambiguous', // supports both ESM & CJS
    plugins: ['typescript']    // allows parsing TypeScript syntax
  });

  const imports: string[] = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      imports.push(node.source.value);
    },
    CallExpression({ node }) {
      if (
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        node.arguments.length === 1 &&
        node.arguments[0].type === 'StringLiteral'
      ) {
        imports.push(node.arguments[0].value);
      }
    }
  });

  return imports;
}