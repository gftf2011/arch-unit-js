import { Visitor } from '@babel/traverse';

export interface BabelVisitor<T> {
  visit(info: T): Visitor;
}
