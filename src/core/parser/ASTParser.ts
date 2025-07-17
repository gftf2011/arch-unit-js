import { cwd } from "process";
import { buildFolderTree } from "./utils/treeUtil";

export const astParser = () => {
    const projectRoot = cwd();

    const tree = buildFolderTree(projectRoot);
    console.log(JSON.stringify(tree, null, 2));

    return projectRoot;
}