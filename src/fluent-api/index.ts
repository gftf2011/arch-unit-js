// // Types for AST nodes
// export type ASTNode = DirectoryNode | FileNode;

// export interface DirectoryNode {
//   name: string;
//   path: string;
//   type: 'directory';
//   children: ASTNode[];
// }

// export interface FileNode {
//   name: string;
//   path: string;
//   type: 'file';
//   dependencies?: string[];
// }

// // Helper: pattern matching (e.g., '..domain.castmember..' to regex)
// function matchesPattern(filePath: string, pattern: string): boolean {
//   // Convert '..domain.castmember..' to regex: '.*domain\\.castmember.*'
//   const regex = new RegExp(
//     pattern
//       .replace(/\./g, '\\.')
//       .replace(/\\\.\\\./g, '.*') // replace '..' with .*
//   );
//   return regex.test(filePath);
// }

// // Helper: recursively find files matching a pattern
// function findFilesMatching(ast: ASTNode, pattern: string | null): FileNode[] {
//   const result: FileNode[] = [];
//   function traverse(node: ASTNode) {
//     if (node.type === 'file' && (!pattern || matchesPattern(node.path, pattern))) {
//       result.push(node);
//     }
//     if (node.type === 'directory' && node.children) {
//       node.children.forEach(traverse);
//     }
//   }
//   traverse(ast);
//   return result;
// }

// // Fluent API classes
// class ClassSelector {
//   private packagePattern: string | null = null;

//   that() {
//     return this;
//   }

//   resideInAPackage(pattern: string) {
//     this.packagePattern = pattern;
//     return this;
//   }

//   should() {
//     return new ClassCondition(this.packagePattern);
//   }
// }

// class ClassCondition {
//   constructor(private fromPattern: string | null) {}

//   dependOnClassesThat() {
//     return {
//       resideInAPackage: (toPattern: string) => new Rule(this.fromPattern, toPattern)
//     };
//   }
// }

// class Rule {
//   constructor(private fromPattern: string | null, private toPattern: string) {}

//   check(ast: ASTNode) {
//     const violations: { file: string; dependency: string }[] = [];
//     const files = findFilesMatching(ast, this.fromPattern);
//     for (const file of files) {
//       for (const dep of file.dependencies || []) {
//         if (matchesPattern(dep, this.toPattern)) {
//           violations.push({ file: file.path, dependency: dep });
//         }
//       }
//     }
//     return violations;
//   }
// }

// // Entry point
// export function noClasses() {
//   return new ClassSelector();
// }

// // Example usage (uncomment to test):
// // import ast from '../example/data.json';
// // const violations = noClasses()
// //   .that().resideInAPackage('..domain.castmember..')
// //   .should().dependOnClassesThat()
// //   .resideInAPackage('..application..')
// //   .check(ast);
// // console.log(violations);
class ComponentSelector {
  that() {
    return this;
  }

  resideInFolder() {
    return this;
  }
}

export function noComponents() {
  return new ComponentSelector();
}

// const violations = noClasses()
//   .that().resideInAPackage('..domain.castmember..')
//   .should().dependOnClassesThat()
//   .resideInAPackage('..application..')
//   .check(ast);