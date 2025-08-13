const path = require('pathe');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const rootDir = path.resolve(path.dirname(__filename));

const projectsDirs = [
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-invalid-dependencies'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-js-sample-with-self-import'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-nest-clean'),
  path.resolve(rootDir, 'tests', 'sample', 'todo-ts-sample'),
];

async function npmInstall(targetPath) {
  try {
    await execAsync('npm install', { cwd: targetPath });
    console.log(`Installed dependencies for sample project: ${targetPath}\n\n`);
  } catch (error) {
    console.error(`Error installing dependencies for sample project: ${targetPath}\n\n`);
    throw error;
  }
}

async function installAllProjects() {
  for (const projectDir of projectsDirs) {
    await npmInstall(projectDir);
  }
}

module.exports = function globalSetup() {
  return installAllProjects()
    .then(() => console.log('All projects installed\n'))
    .catch((error) => console.error('Error installing projects\n', error));
};
