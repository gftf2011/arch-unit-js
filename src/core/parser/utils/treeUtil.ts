import fs from 'fs';
import path from 'path';
import { extractImports } from './extractImportsUtil';

type FolderTree = Dirctory | File;

type File = {
    name: string;
    path: string;
    type: 'file';
    imports: string[];
}

type Dirctory = {
    name: string;
    path: string;
    type: 'directory';
    children: FolderTree[];
}

export function buildFolderTree(fullPath: string): FolderTree {
    const name = path.basename(fullPath);

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
        const item: Dirctory = {
            name,
            path: fullPath,
            type: 'directory',
            children: []
        };
    
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        for (const entry of entries) {
            const newFullPath = path.join(fullPath, entry.name);
            item.children.push(buildFolderTree(newFullPath));
        }

        return item;
    } else {
        const item: File = {
            name,
            path: fullPath,
            type: 'file',
            imports: extractImports(fullPath)
        }

        return item;
    }
}

// import { parse } from '@babel/parser';
// import traverse from '@babel/traverse';

// export class ASTParser {
//   constructor() {
//     this.parsedFiles = [];
//   }

//   parseFile(filePath, content) {
//     try {
//       const ast = parse(content, {
//         sourceType: 'module',
//         plugins: ['typescript']
//       });

//       const result = {
//         path: filePath,
//         imports: [],
//         classes: [],
//         functions: []
//       };

//       traverse(ast, {
//         ImportDeclaration: (path) => {
//           result.imports.push(path.node.source.value);
//         },
//         ClassDeclaration: (path) => {
//           if (path.node.id) {
//             result.classes.push(path.node.id.name);
//           }
//         },
//         FunctionDeclaration: (path) => {
//           if (path.node.id) {
//             result.functions.push(path.node.id.name);
//           }
//         }
//       });

//       this.parsedFiles.push(result);
//       return result;
//     } catch (error) {
//       console.error(`Error parsing ${filePath}:`, error.message);
//       return null;
//     }
//   }

//   getParsedFiles() {
//     return this.parsedFiles;
//   }

//   clear() {
//     this.parsedFiles = [];
//   }
// } 