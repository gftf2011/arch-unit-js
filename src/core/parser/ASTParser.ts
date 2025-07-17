import { cwd } from "process";
import { buildFolderTree } from "./utils/treeUtil";

export const astParser = (normalized: boolean) => {
    const projectRoot = cwd();

    const tree = buildFolderTree(projectRoot, normalized);

    return tree;
}