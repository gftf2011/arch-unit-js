import { astParser } from "../../core/parser/ASTParser";

export const printCommand = (normalized: boolean) => {
  const tree = astParser(normalized);
  console.log(JSON.stringify(tree, null, 2));
};