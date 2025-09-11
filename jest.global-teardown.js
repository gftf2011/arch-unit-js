const fs = require('fs');
const path = require('pathe');

const rootDir = path.resolve(path.dirname(__filename));

const projects = [
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample'),
    workspace: false,
  },
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-invalid-dependencies'),
    workspace: false,
  },
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-module-aliases'),
    workspace: false,
  },
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-self-import'),
    workspace: false,
  },
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-nest-clean'),
    workspace: false,
  },
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-ts-sample'),
    workspace: false,
  },
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-js-clean-decorators'),
    workspace: false,
  },
  {
    path: path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces'),
    workspace: true,
    packages: [
      path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces', 'packages', 'a'),
      path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces', 'packages', 'b'),
      path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces', 'packages', 'c'),
      path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces', 'packages', 'd'),
      path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces', 'packages', 'e'),
      path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces', 'packages', 'f'),
      path.resolve(rootDir, 'tests', 'sample', 'todo-workspaces', 'packages', 'g'),
    ],
  },
];

function deleteNodeModulesAndPackageLock(target) {
  const nodeModulesPath = path.join(target.path, 'node_modules');
  const lockFilePath = path.join(target.path, 'package-lock.json');

  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  }

  if (fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath);
  }

  if (target.workspace) {
    for (const package of target.packages) {
      const nodeModulesPath = path.join(package, 'node_modules');
      const lockFilePath = path.join(package, 'package-lock.json');

      if (fs.existsSync(nodeModulesPath)) {
        fs.rmSync(nodeModulesPath, { recursive: true, force: true });
      }

      if (fs.existsSync(lockFilePath)) {
        fs.unlinkSync(lockFilePath);
      }
    }
  }
}

function deleteAllNodeModulesAndPackageLocks() {
  for (const project of projects) {
    deleteNodeModulesAndPackageLock(project);
  }
}

module.exports = function globalTeardown() {
  deleteAllNodeModulesAndPackageLocks();
};
