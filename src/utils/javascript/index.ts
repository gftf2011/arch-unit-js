export function isTypeScriptRelatedFile(fileName: string): boolean {
  const extensions = ['.ts', '.mts', '.cts', '.d.ts', '.tsx'];
  return extensions.some((ext) => fileName.endsWith(ext));
}

export function isJavascriptRelatedFile(fileName: string): boolean {
  const extensions = ['.js', '.mjs', '.cjs', 'jsx'];
  return extensions.some((ext) => fileName.endsWith(ext));
}
