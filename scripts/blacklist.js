const { execSync } = require('child_process');

const blacklist = [
  'ansi-styles@6.2.2',
  'debug@4.4.2',
  'chalk@5.6.1',
  'supports-color@10.2.1',
  'strip-ansi@7.1.1',
  'ansi-regex@6.2.1',
  'wrap-ansi@9.0.1',
  'color-convert@3.1.1',
  'color-name@2.0.1',
  'is-arrayish@0.3.3',
  'slice-ansi@7.1.1',
  'color@5.0.1',
  'color-string@2.1.1',
  'simple-swizzle@0.2.3',
  'supports-hyperlinks@4.1.1',
  'has-ansi@6.0.1',
  'chalk-template@1.1.1',
  'backslash@0.2.1',
  'error-ex@1.3.3',
  'proto-tinker-wc@1.8.7',
];

const isWin = process.platform === 'win32';
const cmd = isWin ? 'npm.cmd' : 'npm';

let hasBlacklistDependency = true;

try {
  execSync(`${cmd} ls ${blacklist.join(' ')}`, { stdio: 'ignore' });
} catch (_error) {
  hasBlacklistDependency = false;
}

if (hasBlacklistDependency) {
  console.log('❌ Error: One or more banned dependencies are installed!');
  process.exit(1);
} else {
  console.log('✅ No banned dependencies found.');
}
