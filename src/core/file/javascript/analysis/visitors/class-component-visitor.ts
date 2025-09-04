import type { Visitor, NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { BabelVisitor } from '@/core/file/javascript/analysis/visitors/common';
import {
  ClassComponent,
  ClassComponentVisitorInfo,
} from '@/core/file/javascript/analysis/visitors/info';

export class ClassComponentVisitor implements BabelVisitor<any> {
  public visit(info: ClassComponentVisitorInfo): Visitor {
    const mapBabelTypes = (node: t.Node): string | undefined => {
      if (t.isIdentifier(node)) return `${node.name}${node.optional ? '?' : ''}`;
      if (t.isBooleanLiteral(node)) return `${node.value}`;
      if (t.isNumericLiteral(node))
        return `${node.extra?.raw || node.extra?.rawValue || node.value}`;
      if (t.isStringLiteral(node))
        return `${node.extra?.raw || `'${node.extra?.rawValue}'` || `'${node.value}'`}`;
      if (t.isTemplateElement(node)) return `${node.value.raw || node.value.cooked}`;
      if (t.isTSBigIntKeyword(node)) return 'bigint';
      if (t.isTSNumberKeyword(node)) return 'number';
      if (t.isTSBooleanKeyword(node)) return 'boolean';
      if (t.isTSStringKeyword(node)) return 'string';
      if (t.isTSUndefinedKeyword(node)) return 'undefined';
      if (t.isTSNullKeyword(node)) return 'null';
      if (t.isTSNeverKeyword(node)) return 'never';
      if (t.isTSUnknownKeyword(node)) return 'unknown';
      if (t.isTSAnyKeyword(node)) return 'any';
      if (t.isTSVoidKeyword(node)) return 'void';
      if (t.isTSObjectKeyword(node)) return 'object';
      if (t.isTSTypeQuery(node)) return `typeof ${mapBabelTypes(node.exprName)}`;
      if (t.isRestElement(node)) return `...${mapBabelTypes(node.argument)}`;
      if (t.isTSTypeAnnotation(node)) return mapBabelTypes(node.typeAnnotation);
      if (t.isTSLiteralType(node)) return mapBabelTypes(node.literal);
      if (t.isTSArrayType(node)) return `${mapBabelTypes(node.elementType)}[]`;
      if (t.isTSPropertySignature(node)) {
        if (!node.computed)
          return `${node.readonly ? 'readonly ' : ''}${mapBabelTypes(node.key)}${node.optional ? '?' : ''}: ${mapBabelTypes(node.typeAnnotation as t.Node)}`;
        if (node.computed)
          return `[${node.readonly ? 'readonly ' : ''}${mapBabelTypes(node.key)}${node.optional ? '?' : ''}]: ${mapBabelTypes(node.typeAnnotation as t.Node)}`;
      }
      if (t.isTSIndexedAccessType(node))
        return `${mapBabelTypes(node.objectType as t.Node)}[${mapBabelTypes(node.indexType as t.Node)}]`;
      if (t.isTemplateLiteral(node)) {
        const quasis: string[] = [];
        for (let i = 0; i < node.quasis.length; i++) {
          let quasiStr = mapBabelTypes(node.quasis[i]);
          if (
            node.quasis[i].tail === false &&
            node.expressions &&
            node.expressions[i] !== undefined
          ) {
            quasiStr += (('${' + mapBabelTypes(node.expressions[i] as t.Node)) as string) + '}';
          }
          quasis.push(`${quasiStr}`);
        }
        return `\`${quasis.join('')}\``;
      }
      if (t.isTSParenthesizedType(node)) return `(${mapBabelTypes(node.typeAnnotation as t.Node)})`;
      if (t.isTSQualifiedName(node))
        return `${mapBabelTypes(node.left)}.${mapBabelTypes(node.right)}`;
      if (t.isTSMethodSignature(node)) {
        let methodName = `${mapBabelTypes(node.key)}`;
        const parameters = [];
        for (const parameter of node.parameters) {
          const parameterName = `${mapBabelTypes(parameter)}: ${mapBabelTypes(parameter.typeAnnotation as t.Node)}`;
          parameters.push(parameterName);
        }
        methodName += `(${parameters.join(', ')})`;
        return `${methodName}: ${mapBabelTypes(node.typeAnnotation as t.Node)}`;
      }
      if (t.isTSFunctionType(node)) {
        const parameters = [];
        for (const parameter of node.parameters) {
          const parameterName = `${mapBabelTypes(parameter)}: ${mapBabelTypes(parameter.typeAnnotation as t.Node)}`;
          parameters.push(parameterName);
        }
        return `(${parameters.join(', ')}) => ${mapBabelTypes(node.typeAnnotation as t.Node)}`;
      }
      if (t.isTSCallSignatureDeclaration(node)) {
        const parameters = [];
        for (const parameter of node.parameters) {
          const parameterName = `${mapBabelTypes(parameter)}: ${mapBabelTypes(parameter.typeAnnotation as t.Node)}`;
          parameters.push(parameterName);
        }
        return `(${parameters.join(', ')}): ${mapBabelTypes(node.typeAnnotation as t.Node)}`;
      }
      if (t.isTSIndexSignature(node)) {
        const parameters: [string, string][] = [];
        for (const parameter of node.parameters) {
          const tuple: [string, string] = [
            mapBabelTypes(parameter) as string,
            mapBabelTypes(parameter.typeAnnotation as t.Node) as string,
          ];
          parameters.push(tuple);
        }
        return `[${parameters.map(([key, value]) => `${key}: ${value}`).join('')}]: ${mapBabelTypes(node.typeAnnotation as t.Node)}`;
      }
      if (t.isTSTupleType(node)) {
        const elements = [];
        for (const element of node.elementTypes) elements.push(mapBabelTypes(element));
        return `[${elements.join(', ')}]`;
      }
      if (t.isTSTypeLiteral(node)) {
        const members = [];
        for (const member of node.members) members.push(mapBabelTypes(member));
        return members.length > 0 ? `{ ${members.join(', ')} }` : '{}';
      }
      if (t.isTSTypeReference(node)) {
        console.log(node);
        let name = '';
        if (node.typeName) name += mapBabelTypes(node.typeName);
        if (node.typeParameters) name += mapBabelTypes(node.typeParameters);
        return name;
      }
      if (t.isTSTypeParameterInstantiation(node)) {
        const params = [];
        for (const param of node.params) params.push(mapBabelTypes(param));
        return `<${params.join(', ')}>`;
      }
      if (t.isTSUnionType(node)) {
        const types = [];
        for (const type of node.types) types.push(mapBabelTypes(type));
        return types.join(' | ');
      }
      if (t.isTSIntersectionType(node)) {
        const types = [];
        for (const type of node.types) types.push(mapBabelTypes(type));
        return types.join(' & ');
      }
    };
    return {
      ClassDeclaration(path: NodePath<t.ClassDeclaration>) {
        const node = path.node;

        let classComponent: ClassComponent = {
          name: node.id?.name || '',
          extendsFrom: mapBabelTypes(node.superClass as t.Node) || '',
          implementsFrom: [],
        };

        info.addClassComponent(classComponent);
      },
    };
  }
}
