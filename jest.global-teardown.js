const fs = require('fs');
const path = require('pathe');

const rootDir = path.resolve(path.dirname(__filename));

const projectsDirs = [
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-invalid-dependencies'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-self-import'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-nest-clean'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-ts-sample'),
];

function deleteNodeModulesAndPackageLock(targetPath) {
  const nodeModulesPath = path.join(targetPath, 'node_modules');
  const lockFilePath = path.join(targetPath, 'package-lock.json');

  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    console.log(`Deleted node_modules for sample project: ${targetPath}\n`);
  }

  if (fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath);
    console.log(`Deleted package-lock.json from sample project: ${lockFilePath}\n`);
  }
  console.log(`\n`);
}

function deleteAllNodeModulesAndPackageLocks() {
  for (const projectDir of projectsDirs) {
    deleteNodeModulesAndPackageLock(projectDir);
  }
}

module.exports = function globalTeardown() {
  deleteAllNodeModulesAndPackageLocks();
  console.log('All projects clear\n');
};
