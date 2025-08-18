const { exec } = require('child_process');
const path = require('pathe');
const { promisify } = require('util');

const execAsync = promisify(exec);

const rootDir = path.resolve(path.dirname(__filename));

const projectsDirs = [
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-invalid-dependencies'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-module-aliases'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-self-import'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-nest-clean'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-ts-sample'),
];

async function npmInstall(targetPath) {
  try {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'npm.cmd' : 'npm';
    await execAsync(`${cmd} install`, { cwd: targetPath });
  } catch (error) {
    throw error;
  }
}

async function installAllProjects() {
  for (const projectDir of projectsDirs) {
    await npmInstall(projectDir);
  }
}

module.exports = function globalSetup() {
  return installAllProjects();
};
