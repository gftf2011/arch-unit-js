import type { Visitor, NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { BabelVisitor } from '@/core/file/javascript/analysis/visitors/common';
import {
  ClassComponent,
  ClassComponentVisitorInfo,
} from '@/core/file/javascript/analysis/visitors/info';

export class ClassComponentVisitor implements BabelVisitor<any> {
  public visit(info: ClassComponentVisitorInfo): Visitor {
    const babelTypesMapper = (n: t.Node): string | undefined => {
        if (t.isAccessor(n)) {
            const node: t.Accessor = n;
            let acc: any = "";
            acc += node.abstract;
            acc += node.accessibility;
            acc += node.computed;
            acc += node.declare;
            node.decorators?.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            });
            acc += node.definite;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.key);
            acc += node.optional;
            acc += node.override;
            acc += node.readonly;
            acc += node.static;
            acc += node.type;
            acc += node.typeAnnotation ? babelTypesMapper(node.typeAnnotation) : node.typeAnnotation;
            acc += node.value ? babelTypesMapper(node.value) : node.value;
            acc += node.variance ? babelTypesMapper(node.variance) : node.variance;
            return acc;
        } else if (t.isAnyTypeAnnotation(n)) {
            const node: t.AnyTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isArgumentPlaceholder(n)) {
            const node: t.ArgumentPlaceholder = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isArrayExpression((n))) {
            const node: t.ArrayExpression = n;
            let acc: any = "";
            node.elements.forEach((element) => {
                acc += element ? babelTypesMapper(element) : element;
            });
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isArrayPattern(n)) {
            const node: t.ArrayPattern = n;
            let acc: any = "";
            node.decorators ? node.decorators?.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            node.elements.forEach((element) => {
                acc += element ? babelTypesMapper(element) : element;
            });
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.optional;
            acc += node.type;
            acc += node.typeAnnotation ? babelTypesMapper(node.typeAnnotation) : node.typeAnnotation;
            return acc;
        } else if (t.isArrayTypeAnnotation(n)) {
            const node: t.ArrayTypeAnnotation = n;
            let acc: any = "";
            acc += babelTypesMapper(node.elementType);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isArrowFunctionExpression(n)) {
            const node: t.ArrowFunctionExpression = n;
            let acc: any = "";
            acc += node.async;
            acc += babelTypesMapper(node.body);
            acc += node.expression;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.predicate ? babelTypesMapper(node.predicate) : node.predicate;
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isAssignmentExpression(n)) {
            const node: t.AssignmentExpression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.left);
            acc += node.operator;
            acc += babelTypesMapper(node.right);
            acc += node.type;
            return acc;
        } else if (t.isAwaitExpression(n)) {
            const node: t.AwaitExpression = n;
            let acc: any = "";
            acc += babelTypesMapper(node.argument);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isBigIntLiteral(n)) {
            const node: t.BigIntLiteral = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += node.value;
            return acc;
        } else if (t.isBinaryExpression(n)) {
            const node: t.BinaryExpression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.left);
            acc += node.operator;
            acc += babelTypesMapper(node.right);
            acc += node.type;
            return acc;
        } else if (t.isBindExpression(n)) {
            const node: t.BindExpression = n;
            let acc: any = "";
            acc += babelTypesMapper(node.callee);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.object ? babelTypesMapper(node.object) : node.object;
            acc += node.type;
            return acc;
        } else if (t.isBlock(n)) {
            const node: t.Block = n;
            let acc: any = "";
            node.body.forEach((body) => {
                acc += babelTypesMapper(body);
            });
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isBlockParent(n)) {
            const node: t.BlockParent = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isBlockStatement(n)) {
            const node: t.BlockStatement = n;
            let acc: any = "";
            node.body.forEach((body) => {
                acc += babelTypesMapper(body);
            });
            node.directives.forEach((directive) => {
                acc += babelTypesMapper(directive);
            });
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isBooleanLiteral(n)) {
            const node: t.BooleanLiteral = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.value;
            acc += node.type;
            return acc;
        } else if (t.isBooleanLiteralTypeAnnotation(n)) {
            const node: t.BooleanLiteralTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.value;
            acc += node.type;
            return acc;
        } else if (t.isBooleanTypeAnnotation(n)) {
            const node: t.BooleanTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isBreakStatement(n)) {
            const node: t.BreakStatement = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.label ? babelTypesMapper(node.label) : node.label;
            acc += node.type;
            return acc;
        } else if (t.isCallExpression(n)) {
            const node: t.CallExpression = n;
            let acc: any = "";
            node.arguments.forEach((argument) => {
                acc += babelTypesMapper(argument);
            });
            acc += babelTypesMapper(node.callee);
            acc += node.optional;
            acc += node.type;
            acc += node.typeArguments ? babelTypesMapper(node.typeArguments) : node.typeArguments;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isCatchClause(n)) {
            const node: t.CatchClause = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.param ? babelTypesMapper(node.param) : node.param;
            acc += node.type;
            return acc;
        } else if (t.isClass(n)) {
            const node: t.Class = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.id ? babelTypesMapper(node.id) : node.id;
            node.implements ? node.implements.forEach((implement) => {
                acc += babelTypesMapper(implement);
            }) : (acc += node.implements);
            acc += node.mixins ? babelTypesMapper(node.mixins) : node.mixins;
            acc += node.superClass ? babelTypesMapper(node.superClass) : node.superClass;
            acc += node.superTypeParameters ? babelTypesMapper(node.superTypeParameters) : node.superTypeParameters;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isClassAccessorProperty(n)) {
            const node: t.ClassAccessorProperty = n;
            let acc: any = "";
            acc += node.abstract;
            acc += node.accessibility;
            acc += node.computed;
            acc += node.declare;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += node.definite;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.key);
            acc += node.optional;
            acc += node.override;
            acc += node.readonly;
            acc += node.static;
            acc += node.type;
            acc += node.typeAnnotation ? babelTypesMapper(node.typeAnnotation) : node.typeAnnotation;
            acc += node.value ? babelTypesMapper(node.value) : node.value;
            acc += node.variance ? babelTypesMapper(node.variance) : node.variance;
            return acc;
        } else if (t.isClassBody(n)) {
            const node: t.ClassBody = n;
            let acc: any = "";
            node.body.forEach((body) => {
                acc += babelTypesMapper(body);
            });
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isClassDeclaration(n)) {
            const node: t.ClassDeclaration = n;
            let acc: any = "";
            acc += node.abstract;
            acc += babelTypesMapper(node.body);
            acc += node.declare;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.id ? babelTypesMapper(node.id) : node.id;
            node.implements ? node.implements.forEach((implement) => {
                acc += babelTypesMapper(implement);
            }) : (acc += node.implements);
            acc += node.mixins ? babelTypesMapper(node.mixins) : node.mixins;
            acc += node.superClass ? babelTypesMapper(node.superClass) : node.superClass;
            acc += node.superTypeParameters ? babelTypesMapper(node.superTypeParameters) : node.superTypeParameters;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isClassExpression(n)) {
            const node: t.ClassExpression = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.id ? babelTypesMapper(node.id) : node.id;
            node.implements ? node.implements.forEach((implement) => {
                acc += babelTypesMapper(implement);
            }) : (acc += node.implements);
            acc += node.mixins ? babelTypesMapper(node.mixins) : node.mixins;
            acc += node.superClass ? babelTypesMapper(node.superClass) : node.superClass;
            acc += node.superTypeParameters ? babelTypesMapper(node.superTypeParameters) : node.superTypeParameters;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isClassImplements(n)) {
            const node: t.ClassImplements = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isClassMethod(n)) {
            const node: t.ClassMethod = n;
            let acc: any = "";
            acc += node.abstract;
            acc += node.access;
            acc += node.accessibility;
            acc += node.async;
            acc += node.body ? babelTypesMapper(node.body) : node.body;
            acc += node.computed;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            acc += babelTypesMapper(node.key);
            acc += node.kind;
            acc += node.optional;
            acc += node.override;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.static;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isClassPrivateMethod(n)) {
            const node: t.ClassPrivateMethod = n;
            let acc: any = "";
            acc += node.abstract;
            acc += node.access;
            acc += node.accessibility;
            acc += node.async;
            acc += node.body ? babelTypesMapper(node.body) : node.body;
            acc += node.computed;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            acc += babelTypesMapper(node.key);
            acc += node.kind;
            acc += node.optional;
            acc += node.override;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.static;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isClassPrivateProperty(n)) {
            const node: t.ClassPrivateProperty = n;
            let acc: any = "";
            acc += node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += node.definite;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.key);
            acc += node.optional;
            acc += node.readonly;
            acc += node.static;
            acc += node.type;
            acc += node.typeAnnotation ? babelTypesMapper(node.typeAnnotation) : node.typeAnnotation;
            acc += node.value ? babelTypesMapper(node.value) : node.value;
            acc += node.variance ? babelTypesMapper(node.variance) : node.variance;
            return acc;
        } else if (t.isClassProperty(n)) {
            const node: t.ClassProperty = n;
            let acc: any = "";
            acc += node.abstract;
            acc += node.accessibility;
            acc += node.computed;
            acc += node.declare;
            acc += node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += node.definite;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.key);
            acc += node.optional;
            acc += node.readonly;
            acc += node.static;
            acc += node.type;
            acc += node.typeAnnotation ? babelTypesMapper(node.typeAnnotation) : node.typeAnnotation;
            acc += node.value ? babelTypesMapper(node.value) : node.value;
            acc += node.variance ? babelTypesMapper(node.variance) : node.variance;
            return acc;
        } else if (t.isCompletionStatement(n)) {
            const node: t.CompletionStatement = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isConditional(n)) {
            const node: t.Conditional = n;
            let acc: any = "";
            acc += node.alternate ? babelTypesMapper(node.alternate) : node.alternate;
            acc += babelTypesMapper(node.consequent);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.test);
            acc += node.type;
            return acc;
        } else if (t.isConditionalExpression(n)) {
            const node: t.ConditionalExpression = n;
            let acc: any = "";
            acc += babelTypesMapper(node.alternate);
            acc += babelTypesMapper(node.consequent);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.test);
            acc += node.type;
            return acc;
        } else if (t.isContinueStatement(n)) {
            const node: t.ContinueStatement = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.label ? babelTypesMapper(node.label) : node.label;
            acc += node.type;
            return acc;
        } else if (t.isDebuggerStatement(n)) {
            const node: t.DebuggerStatement = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isDecimalLiteral(n)) {
            const node: t.DecimalLiteral = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.value;
            acc += node.type;
            return acc;
        } else if (t.isDeclaration(n)) {
            const node: t.Declaration = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isDeclareClass(n)) {
            const node: t.DeclareClass = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            node.extends ?  node.extends.forEach((extend) => {
                acc += babelTypesMapper(extend);
            }) : (acc += node.extends);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            node.implements ?  node.implements.forEach((implement) => {
                acc += babelTypesMapper(implement);
            }) : (acc += node.implements);
            node.mixins ? node.mixins.forEach((mixin) => {
                acc += babelTypesMapper(mixin);
            }) : (acc += node.mixins);
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isDeclareExportAllDeclaration(n)) {
            const node: t.DeclareExportAllDeclaration = n;
            let acc: any = "";
            node.attributes ? node.attributes.forEach((attribute) => {
                acc += babelTypesMapper(attribute);
            }) : (acc += node.attributes);
            acc += node.exportKind;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.source);
            acc += node.type;
            return acc;
        } else if (t.isDeclareExportDeclaration(n)) {
            const node: t.DeclareExportDeclaration = n;
            let acc: any = "";
            node.attributes ? node.attributes.forEach((attribute) => {
                acc += babelTypesMapper(attribute);
            }) : (acc += node.attributes);
            acc += node.declaration ? babelTypesMapper(node.declaration) : node.declaration;
            acc += node.default;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.source ? babelTypesMapper(node.source) : node.source;
            node.specifiers ? node.specifiers.forEach((specifier) => {
                acc += babelTypesMapper(specifier);
            }) : (acc += node.specifiers);
            acc += node.type;
            return acc;
        } else if (t.isDeclareFunction(n)) {
            const node: t.DeclareFunction = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.predicate ? babelTypesMapper(node.predicate) : node.predicate;
            acc += node.type;
            return acc;
        } else if (t.isDeclareInterface(n)) {
            const node: t.DeclareInterface = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            node.extends ? node.extends.forEach((extend) => {
                acc += babelTypesMapper(extend);
            }) : (acc += node.extends);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isDeclareModule(n)) {
            const node: t.DeclareModule = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.kind;
            acc += node.type;
            return acc;
        } else if (t.isDeclareModuleExports(n)) {
            const node: t.DeclareModuleExports = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += babelTypesMapper(node.typeAnnotation);
            return acc;
        } else if (t.isDeclareOpaqueType(n)) {
            const node: t.DeclareOpaqueType = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.impltype ? babelTypesMapper(node.impltype) : node.impltype;
            acc += node.supertype ? babelTypesMapper(node.supertype) : node.supertype;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isDeclareTypeAlias(n)) {
            const node: t.DeclareTypeAlias = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += babelTypesMapper(node.right);
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isDeclareVariable(n)) {
            const node: t.DeclareVariable = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.type;
            return acc;
        } else if (t.isDeclaredPredicate(n)) {
            const node: t.DeclaredPredicate = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += babelTypesMapper(node.value);
            return acc;
        } else if (t.isDecorator(n)) {
            const node: t.Decorator = n;
            let acc: any = "";
            acc += babelTypesMapper(node.expression);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isDirective(n)) {
            const node: t.Directive = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += node.value;
            return acc;
        } else if (t.isDirectiveLiteral(n)) {
            const node: t.DirectiveLiteral = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.value;
            acc += node.type;
            return acc;
        } else if (t.isDoExpression(n)) {
            const node: t.DoExpression = n;
            let acc: any = "";
            acc += node.async;
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isDoWhileStatement(n)) {
            const node: t.DoWhileStatement = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.test;
            acc += node.type;
            return acc;
        } else if (t.isEmptyStatement(n)) {
            const node: t.EmptyStatement = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isEmptyTypeAnnotation(n)) {
            const node: t.EmptyTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isEnumBody(n)) {
            const node: t.EnumBody = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.hasUnknownMembers;
            node.members.forEach((member) => {
                acc += babelTypesMapper(member);
            });
            acc += node.type;
            return acc;
        } else if (t.isEnumBooleanBody(n)) {
            const node: t.EnumBooleanBody = n;
            let acc: any = "";
            acc += node.explicitType;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.hasUnknownMembers;
            node.members.forEach((member) => {
                acc += babelTypesMapper(member);
            });
            acc += node.type;
            return acc;
        } else if (t.isEnumBooleanMember(n)) {
            const node: t.EnumBooleanMember = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += babelTypesMapper(node.init);
            acc += node.type;
            return acc;
        } else if (t.isEnumDeclaration(n)) {
            const node: t.EnumDeclaration = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc +=  babelTypesMapper(node.id);
            acc += node.type;
            return acc;
        } else if (t.isEnumDefaultedMember(n)) {
            const node: t.EnumDefaultedMember = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.type;
            return acc;
        } else if (t.isEnumMember(n)) {
            const node: t.EnumMember = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += babelTypesMapper(node.init);
            acc += node.type;
            return acc;
        } else if (t.isEnumNumberBody(n)) {
            const node: t.EnumNumberBody = n;
            let acc: any = "";
            acc += node.explicitType;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.hasUnknownMembers;
            node.members.forEach((member) => {
                acc += babelTypesMapper(member);
            });
            acc += node.type;
            return acc;
        } else if (t.isEnumNumberMember(n)) {
            const node: t.EnumNumberMember = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += babelTypesMapper(node.init);
            acc += node.type;
            return acc;
        } else if (t.isEnumStringBody(n)) {
            const node: t.EnumStringBody = n;
            let acc: any = "";
            acc += node.explicitType;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.hasUnknownMembers;
            node.members.forEach((member) => {
                acc += babelTypesMapper(member);
            });
            acc += node.type;
            return acc;
        } else if (t.isEnumStringMember(n)) {
            const node: t.EnumStringMember = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += babelTypesMapper(node.init);
            acc += node.type;
            return acc;
        } else if (t.isEnumSymbolBody(n)) {
            const node: t.EnumSymbolBody = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.hasUnknownMembers;
            node.members.forEach((member) => {
                acc += babelTypesMapper(member);
            });
            acc += node.type;
            return acc;
        } else if (t.isExistsTypeAnnotation(n)) {
            const node: t.ExistsTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isExportAllDeclaration(n)) {
            const node: t.ExportAllDeclaration = n;
            let acc: any = "";
            node.attributes ? node.attributes.forEach((attribute) => {
                acc += babelTypesMapper(attribute);
            }) : (acc += node.attributes);
            acc += node.exportKind;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.source);
            acc += node.type;
            return acc;
        } else if (t.isExportDeclaration(n)) {
            const node: t.ExportDeclaration = n;
            let acc: any = "";
            acc += node.exportKind;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isExportDefaultDeclaration(n)) {
            const node: t.ExportDefaultDeclaration = n;
            let acc: any = "";
            acc += babelTypesMapper(node.declaration);
            acc += node.exportKind;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isExportDefaultSpecifier(n)) {
            const node: t.ExportDefaultSpecifier = n;
            let acc: any = "";
            acc += babelTypesMapper(node.exported);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isExportNamedDeclaration(n)) {
            const node: t.ExportNamedDeclaration = n;
            let acc: any = "";
            node.attributes ? node.attributes.forEach((attribute) => {
                acc += babelTypesMapper(attribute);
            }) : (acc += node.attributes);
            acc += node.declaration ? babelTypesMapper(node.declaration) : node.declaration;
            acc += node.exportKind;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.source ? babelTypesMapper(node.source) : node.source;
            node.specifiers.forEach((specifier) => {
                acc += babelTypesMapper(specifier);
            });
            acc += node.type;
            return acc;
        } else if (t.isExportNamespaceSpecifier(n)) {
            const node: t.ExportNamespaceSpecifier = n;
            let acc: any = "";
            acc += babelTypesMapper(node.exported);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isExportSpecifier(n)) {
            const node: t.ExportSpecifier = n;
            let acc: any = "";
            acc += node.exportKind;
            acc += babelTypesMapper(node.exported);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.local);
            acc += node.type;
            return acc;
        } else if (t.isExpression(n)) {
            const node: t.Expression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isExpressionStatement(n)) {
            const node: t.ExpressionStatement = n;
            let acc: any = "";
            acc += babelTypesMapper(node.expression);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isExpressionWrapper(n)) {
            const node: t.ExpressionWrapper = n;
            let acc: any = "";
            acc += babelTypesMapper(node.expression);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFile(n)) {
            const node: t.File = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.program);
            node.tokens ? node.tokens.forEach((token) => {
                acc += token?.type?.label + token?.value;
            }) : (acc += node.tokens);
            acc += node.type;
            return acc;
        } else if (t.isFlow(n)) {
            const node: t.Flow = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFlowBaseAnnotation(n)) {
            const node: t.FlowBaseAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFlowDeclaration(n)) {
            const node: t.FlowDeclaration = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFlowPredicate(n)) {
            const node: t.FlowPredicate = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFlowType(n)) {
            const node: t.FlowType = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFor(n)) {
            const node: t.For = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isForInStatement(n)) {
            const node: t.ForInStatement = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.left);
            acc += babelTypesMapper(node.right);
            acc += node.type;
            return acc;
        } else if (t.isForOfStatement(n)) {
            const node: t.ForOfStatement = n;
            let acc: any = "";
            acc += node.await;
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.left);
            acc += babelTypesMapper(node.right);
            acc += node.type;
            return acc;
        } else if (t.isForStatement(n)) {
            const node: t.ForStatement = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.init ? babelTypesMapper(node.init) : node.init;
            acc += node.test ? babelTypesMapper(node.test) : node.test;
            acc += node.type;
            acc += node.update ? babelTypesMapper(node.update) : node.update;
            return acc;
        } else if (t.isForXStatement(n)) {
            const node: t.ForXStatement = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.left);
            acc += babelTypesMapper(node.right);
            acc += node.type;
            return acc;
        } else if (t.isFunction(n)) {
            const node: t.Function = n;
            let acc: any = "";
            acc += node.async;
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            acc += node.type;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isFunctionDeclaration(n)) {
            const node: t.FunctionDeclaration = n;
            let acc: any = "";
            acc += node.async;
            acc += node.body ? babelTypesMapper(node.body) : node.body;
            acc += node.declare;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            acc += node.id ? babelTypesMapper(node.id) : node.id;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.predicate ? babelTypesMapper(node.predicate) : node.predicate;
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isFunctionExpression(n)) {
            const node: t.FunctionExpression = n;
            let acc: any = "";
            acc += node.async;
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            acc += node.id ? babelTypesMapper(node.id) : node.id;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.predicate ? babelTypesMapper(node.predicate) : node.predicate;
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isFunctionParameter(n)) {
            const node: t.FunctionParameter = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFunctionParent(n)) {
            const node: t.FunctionParent = n;
            let acc: any = "";
            if (Array.isArray(node.body)) {
                node.body.forEach((item) => {
                    acc += babelTypesMapper(item);
                });
            } else {
                acc += babelTypesMapper(node);
            }
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isFunctionTypeAnnotation(n)) {
            const node: t.FunctionTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.rest ? babelTypesMapper(node.rest) : node.rest;
            acc += babelTypesMapper(node.returnType);
            acc += node.this ? babelTypesMapper(node.this) : node.this;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isFunctionTypeParam(n)) {
            const node: t.FunctionTypeParam = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.name ? babelTypesMapper(node.name) : node.name;
            acc += node.optional;
            acc += node.type;
            acc += babelTypesMapper(node.typeAnnotation);
            return acc;
        } else if (t.isGenericTypeAnnotation(n)) {
            const node: t.GenericTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isIdentifier(n)) {
            const node: t.Identifier = n;
            let acc: any = "";
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.name;
            acc += node.optional;
            acc += node.type;
            acc += node.typeAnnotation ? babelTypesMapper(node.typeAnnotation) : node.typeAnnotation;
            return acc;
        } else if (t.isIfStatement(n)) {
            const node: t.IfStatement = n;
            let acc: any = "";
            acc += node.alternate ? babelTypesMapper(node.alternate) : node.alternate;
            acc += babelTypesMapper(node.consequent);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.test);
            acc += node.type;
            return acc;
        } else if (t.isImport(n)) {
            const node: t.Import = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isImportAttribute(n)) {
            const node: t.ImportAttribute = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.key);
            acc += node.type;
            acc += babelTypesMapper(node.value);
            return acc;
        } else if (t.isImportDeclaration(n)) {
            const node: t.ImportDeclaration = n;
            let acc: any = "";
            node.attributes ? node.attributes.forEach((attribute) => {
                acc += babelTypesMapper(attribute);
            }) : (acc += node.attributes);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.importKind;
            acc += node.module;
            acc +=  node.phase;
            acc += babelTypesMapper(node.source);
            node.specifiers.forEach((specifier) => {
                acc += babelTypesMapper(specifier);
            });
            acc += node.type;
            return acc;
        } else if (t.isImportDefaultSpecifier(n)) {
            const node: t.ImportDefaultSpecifier = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.local);
            acc += node.type;
            return acc;
        } else if (t.isImportExpression(n)) {
            const node: t.ImportExpression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.options ? babelTypesMapper(node.options) : node.options;
            acc += node.phase;
            acc += babelTypesMapper(node.source);
            acc += node.type;
            return acc;
        } else if (t.isImportNamespaceSpecifier(n)) {
            const node: t.ImportNamespaceSpecifier = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.local);
            acc += node.type;
            return acc;
        } else if (t.isImportOrExportDeclaration(n)) {
            const node: t.ImportOrExportDeclaration = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isImportSpecifier(n)) {
            const node: t.ImportSpecifier = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.importKind;
            acc += babelTypesMapper(node.imported);
            acc += babelTypesMapper(node.local);
            acc += node.type;
            return acc;
        } else if (t.isIndexedAccessType(n)) {
            const node: t.IndexedAccessType = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.indexType);
            acc += babelTypesMapper(node.objectType);
            acc += node.type;
            return acc;
        } else if (t.isInferredPredicate(n)) {
            const node: t.InferredPredicate = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isInterfaceDeclaration(n)) {
            const node: t.InterfaceDeclaration = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            node.extends ? node.extends.forEach((item) => { 
                acc += babelTypesMapper(item);
            }) : (acc += node.extends);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isInterfaceExtends(n)) {
            const node: t.InterfaceExtends = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isInterfaceTypeAnnotation(n)) {
            const node: t.InterfaceTypeAnnotation = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            node.extends ? node.extends.forEach((item) => {
                acc += babelTypesMapper(item);
            }) : (acc += node.extends);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isInterpreterDirective(n)) {
            const node: t.InterpreterDirective = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += node.value;
            return acc;
        } else if (t.isIntersectionTypeAnnotation(n)) {
            const node: t.IntersectionTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            node.types.forEach((item) => {
                acc += babelTypesMapper(item);
            });
            return acc;
        } else if (t.isJSX(n)) {
            const node: t.JSX = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isJSXAttribute(n)) {
            const node: t.JSXAttribute = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.name);
            acc += node.type
            acc += node.value ? babelTypesMapper(node.value) : node.value;
            return acc;
        } else if (t.isJSXClosingElement(n)) {
            const node: t.JSXClosingElement = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.name);
            acc += node.type;
            return acc;
        } else if (t.isJSXClosingFragment(n)) {
            const node: t.JSXClosingFragment = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isJSXElement(n)) {
            const node: t.JSXElement = n;
            let acc: any = "";
            node.children.forEach((child) => {
                acc += babelTypesMapper(child);
            });
            acc += node.closingElement ? babelTypesMapper(node.closingElement) : node.closingElement;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.openingElement);
            acc += node.selfClosing;
            acc += node.type;
            return acc;
        } else if (t.isJSXEmptyExpression(n)) {
            const node: t.JSXEmptyExpression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isJSXExpressionContainer(n)) {
            const node: t.JSXExpressionContainer = n;
            let acc: any = "";
            acc += babelTypesMapper(node.expression);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.expression);
            acc += node.type;
            return acc;
        } else if (t.isJSXFragment(n)) {
            const node: t.JSXFragment = n;
            let acc: any = "";
            node.children.forEach((child) => {
                acc += babelTypesMapper(child);
            });
            acc += babelTypesMapper(node.closingFragment);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.openingFragment);
            acc += node.type;
            return acc;
        } else if (t.isJSXIdentifier(n)) {
            const node: t.JSXIdentifier = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.name;
            acc += node.type;
            return acc;
        } else if (t.isJSXMemberExpression(n)) {
            const node: t.JSXMemberExpression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.object);
            acc += babelTypesMapper(node.property);
            acc += node.type;
            return acc;
        } else if (t.isJSXNamespacedName(n)) {
            const node: t.JSXNamespacedName = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.namespace);
            acc += babelTypesMapper(node.name);
            acc += node.type;
            return acc;
        } else if (t.isJSXOpeningElement(n)) {
            const node: t.JSXOpeningElement = n;
            let acc: any = "";
            node.attributes.forEach((attribute) => {
                acc += babelTypesMapper(attribute);
            });
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.name);
            acc += node.selfClosing;
            acc += node.type;
            acc += node.typeArguments ? babelTypesMapper(node.typeArguments) : node.typeArguments;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isJSXOpeningFragment(n)) {
            const node: t.JSXOpeningFragment = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isJSXSpreadAttribute(n)) {
            const node: t.JSXSpreadAttribute = n;
            let acc: any = "";
            acc += babelTypesMapper(node.argument);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isJSXSpreadChild(n)) {
            const node: t.JSXSpreadChild = n;
            let acc: any = "";
            acc += babelTypesMapper(node.expression);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isJSXText(n)) {
            const node: t.JSXText = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += node.value;
            return acc;
        } else if (t.isLVal(n)) {
            const node: t.LVal = n;
            let acc: any = "";
            acc += node.accessibility;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.override;
            acc += babelTypesMapper(node.parameter);
            acc += node.readonly;
            acc += node.type;
            return acc;
        } else if (t.isLabeledStatement(n)) {
            const node: t.LabeledStatement = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.label);
            acc += node.type;
            return acc;
        } else if (t.isLiteral(n)) {
            const node: t.Literal = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isLogicalExpression(n)) {
            const node: t.LogicalExpression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.left);
            acc += node.operator;
            acc += babelTypesMapper(node.right);
            acc += node.type;
            return acc;
        } else if (t.isLoop(n)) {
            const node: t.Loop = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isMemberExpression(n)) {
            const node: t.MemberExpression = n;
            let acc: any = "";
            acc += node.computed;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.object);
            acc += node.optional;
            acc += babelTypesMapper(node.property);
            acc += node.type;
            return acc;
        } else if (t.isMetaProperty(n)) {
            const node: t.MetaProperty = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.meta);
            acc += babelTypesMapper(node.property);
            acc += node.type;
            return acc;
        } else if (t.isMethod(n)) {
            const node: t.Method = n;
            let acc: any = "";
            acc += node.async;
            acc += babelTypesMapper(node.body);
            acc += node.generator;
            acc += node.computed;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            acc += babelTypesMapper(node.key);
            acc += node.kind;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isMiscellaneous(n)) {
            const node: t.Miscellaneous = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isMixedTypeAnnotation(n)) {
            const node: t.MixedTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isModuleExpression(n)) {
            const node: t.ModuleExpression = n;
            let acc: any = "";
            acc += babelTypesMapper(node.body);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isModuleSpecifier(n)) {
            const node: t.ModuleSpecifier = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isNewExpression(n)) {
            const node: t.NewExpression = n;
            let acc: any = "";
            node.arguments.forEach((arg) => {
                acc += babelTypesMapper(arg);
            });
            acc += babelTypesMapper(node.callee);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.optional;
            acc += node.type;
            acc += node.typeArguments ? babelTypesMapper(node.typeArguments) : node.typeArguments;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isNode(n)) {
            const node: t.Node = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isNoop(n)) {
            const node: t.Noop = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isNullLiteral(n)) {
            const node: t.NullLiteral = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isNullLiteralTypeAnnotation(n)) {
            const node: t.NullLiteralTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isNullableTypeAnnotation(n)) {
            const node: t.NullableTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += babelTypesMapper(node.typeAnnotation);
            return acc;
        } else if (t.isNumberLiteralTypeAnnotation(n)) {
            const node: t.NumberLiteralTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += node.value;
            return acc;
        } else if (t.isNumberTypeAnnotation(n)) {
            const node: t.NumberTypeAnnotation = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isNumericLiteral(n)) {
            const node: t.NumericLiteral = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            acc += node.value;
            return acc;
        } else if (t.isObjectExpression(n)) {
            const node: t.ObjectExpression = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            node.properties.forEach((property) => {
                acc += babelTypesMapper(property);
            });
            acc += node.type;
            return acc;
        } else if (t.isObjectMethod(n)) {
            const node: t.ObjectMethod = n;
            let acc: any = "";
            acc += node.async;
            acc += babelTypesMapper(node.body);
            acc += node.computed;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.generator;
            acc += babelTypesMapper(node.key);
            acc += node.kind;
            node.params.forEach((param) => {
                acc += babelTypesMapper(param);
            });
            acc += node.returnType ? babelTypesMapper(node.returnType) : node.returnType;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isObjectPattern(n)) {
            const node: t.ObjectPattern = n;
            let acc: any = "";
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.optional;
            node.properties.forEach((property) => {
                acc += babelTypesMapper(property);
            });
            acc += node.type;
            acc += node.typeAnnotation ? babelTypesMapper(node.typeAnnotation) : node.typeAnnotation;
            return acc;
        } else if (t.isObjectProperty(n)) {
            const node: t.ObjectProperty = n;
            let acc: any = "";
            acc += node.computed;
            node.decorators ? node.decorators.forEach((decorator) => {
                acc += babelTypesMapper(decorator);
            }) : (acc += node.decorators);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.key);
            acc += node.shorthand;
            acc += babelTypesMapper(node.value);
            acc += node.type;
            acc += babelTypesMapper(node.value);
            return acc;
        } else if (t.isObjectTypeAnnotation(n)) {
            const node: t.ObjectTypeAnnotation = n;
            let acc: any = "";
            node.callProperties ? node.callProperties.forEach((callProperty) => {
                acc += babelTypesMapper(callProperty);
            }) : (acc += node.callProperties);
            acc += node.exact;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            node.indexers ? node.indexers.forEach((indexer) => {
                acc += babelTypesMapper(indexer);
            }) : (acc += node.indexers);
            acc += node.inexact;
            node.internalSlots ? node.internalSlots.forEach((internalSlot) => {
                acc += babelTypesMapper(internalSlot);
            }) : (acc += node.internalSlots);
            node.properties.forEach((property) => {
                acc += babelTypesMapper(property);
            });
            acc += node.type;
            return acc;
        } else if (t.isObjectTypeCallProperty(n)) {
            const node: t.ObjectTypeCallProperty = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.static;
            acc += node.type;
            acc += babelTypesMapper(node.value);
            return acc;
        } else if (t.isObjectTypeIndexer(n)) {
            const node: t.ObjectTypeIndexer = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.id ? babelTypesMapper(node.id) : node.id;
            acc += babelTypesMapper(node.key);
            acc += node.static;
            acc += node.type;
            acc += babelTypesMapper(node.value);
            acc += node.variance ? babelTypesMapper(node.variance) : node.variance;
            return acc;
        } else if (t.isObjectTypeInternalSlot(n)) {
            const node: t.ObjectTypeInternalSlot = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += node.method;
            acc += node.optional;
            acc += node.static;
            acc += node.type;
            acc += babelTypesMapper(node.value);
            return acc;
        } else if (t.isObjectTypeProperty(n)) {
            const node: t.ObjectTypeProperty = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.key);
            acc += node.kind;
            acc += node.method;
            acc += node.optional;
            acc += node.proto;
            acc += node.static;
            acc += node.type;
            acc += babelTypesMapper(node.value);
            acc += node.variance ? babelTypesMapper(node.variance) : node.variance;
            return acc;
        } else if (t.isObjectTypeSpreadProperty(n)) {
            const node: t.ObjectTypeSpreadProperty = n;
            let acc: any = "";
            acc += babelTypesMapper(node.argument);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.type;
            return acc;
        } else if (t.isOpaqueType(n)) {
            const node: t.OpaqueType = n;
            let acc: any = "";
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.id);
            acc += babelTypesMapper(node.impltype);
            acc += node.supertype ? babelTypesMapper(node.supertype) : node.supertype;
            acc += node.type;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isOptionalCallExpression(n)) {
            const node: t.OptionalCallExpression = n;
            let acc: any = "";
            node.arguments.forEach((argument) => {
                acc += babelTypesMapper(argument);
            });
            acc += babelTypesMapper(node.callee);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.optional;
            acc += node.type;
            acc += node.typeArguments ? babelTypesMapper(node.typeArguments) : node.typeArguments;
            acc += node.typeParameters ? babelTypesMapper(node.typeParameters) : node.typeParameters;
            return acc;
        } else if (t.isOptionalIndexedAccessType(n)) {
            const node: t.OptionalIndexedAccessType = n;
            let acc: any = "";
            acc += babelTypesMapper(node.objectType);
            acc += babelTypesMapper(node.indexType);
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += node.optional;
            acc += node.type;
            return acc;
        } else if (t.isOptionalMemberExpression(n)) {
            const node: t.OptionalMemberExpression = n;
            let acc: any = "";
            acc += node.computed;
            acc += (node.extra?.raw as any) + (node.extra?.rawValue as any);
            acc += babelTypesMapper(node.object);
            acc += node.optional;
            acc += babelTypesMapper(node.property);
            acc += node.type;
            return acc;
        }
    };
    return {
      ClassDeclaration(path: NodePath<t.ClassDeclaration>) {
        const node = path.node;

        const classComponent: ClassComponent = {
          name: node.id?.name || '',
          extendsFrom: babelTypesMapper(node.superClass as t.Node) || '',
          implementsFrom: [],
        };

        info.addClassComponent(classComponent);
      },
    };
  }
}
