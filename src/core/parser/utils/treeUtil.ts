import fs from 'fs';
import path from 'path';
import { extractImports } from './extractImportsUtil';

type FolderTree = Dirctory | File;

type File = {
    name: string;
    path: string;
    type: 'file';
    dependencies: string[];
}

type Dirctory = {
    name: string;
    path: string;
    type: 'directory';
    children: FolderTree[];
}

export function buildFolderTree(fullPath: string, normalized: boolean): FolderTree {
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
            item.children.push(buildFolderTree(newFullPath, normalized));
        }

        return item;
    } else {
        const item: File = {
            name,
            path: fullPath,
            type: 'file',
            dependencies: extractImports(fullPath, normalized)
        }

        return item;
    }
}