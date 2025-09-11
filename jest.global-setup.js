const { exec } = require('child_process');
const path = require('pathe');
const { promisify } = require('util');

const execAsync = promisify(exec);

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

async function npmInstall(target) {
  try {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'npm.cmd' : 'npm';
    await execAsync(`${cmd} install${target.workspace ? ' --workspaces' : ''}`, {
      cwd: target.path,
    });
    await execAsync(
      `node ${path.resolve(rootDir, 'scripts', 'blacklist.js')} --cwd ${target.path}`,
      {
        cwd: rootDir,
      },
    );
    if (target.packages) {
      for (const package of target.packages) {
        await execAsync(
          `node ${path.resolve(rootDir, 'scripts', 'blacklist.js')} --cwd ${package}`,
          {
            cwd: rootDir,
          },
        );
      }
    }
  } catch (error) {
    throw error;
  }
}

async function installAllProjects() {
  for (const project of projects) {
    await npmInstall(project);
  }
}

module.exports = function globalSetup() {
  return installAllProjects();
};
