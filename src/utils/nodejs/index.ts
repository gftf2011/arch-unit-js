import fs from 'fs';
import module from 'module';
import * as path from 'pathe';

export function isBuiltinModule(dependency: string): boolean {
  const builtinModules = new Set(module.builtinModules);
  return builtinModules.has(dependency);
}

export function isPackageJsonDependency(dirs: string[], dependency: string): boolean {
  let hasDependency = false;
  for (const dir of dirs) {
    try {
      const packageJsonPath = path.join(dir, 'package.json');
      fs.statSync(packageJsonPath);
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (Object.keys(packageJson.dependencies).some((key) => dependency.includes(key))) {
        hasDependency = true;
        break;
      }
    } catch (_error) {
      continue;
    }
  }
  return hasDependency;
}

export function isPackageJsonDevDependency(dirs: string[], dependency: string): boolean {
  let hasDependency = false;
  for (const dir of dirs) {
    try {
      const packageJsonPath = path.join(dir, 'package.json');
      fs.statSync(packageJsonPath);
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (Object.keys(packageJson.devDependencies).some((key) => dependency.includes(key))) {
        hasDependency = true;
        break;
      }
    } catch (_error) {
      continue;
    }
  }
  return hasDependency;
}
