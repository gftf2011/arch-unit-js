const { spawn } = require('child_process');
const path = require('pathe');

const rootDir = path.resolve(
  path.dirname(__filename),
  'tests',
  'sample',
  'todo-js-sample-with-module-aliases',
);

beforeAll(async () => {
  // This will run in every test file UNLESS we skip it.
  if (global.__GLOBAL_BEFORE_ALL_HAS_RUN__) {
    return;
  }

  // Set the flag so it won't run again
  global.__GLOBAL_BEFORE_ALL_HAS_RUN__ = true;

  const resolveSpawn = async () => {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [path.resolve(rootDir, 'setup-aliases.js')], {
        stdio: 'inherit',
      });
      child.on('close', (code) => {
        if (code === 0)
          resolve(true); // success
        else reject(new Error(`Process exited with code ${code}`));
      });

      child.on('error', (err) => reject(err));
    });
  };
  await resolveSpawn();
});
