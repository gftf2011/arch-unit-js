#!/usr/bin/env node

import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ast } from './core/ast';

yargs(hideBin(process.argv))
  .scriptName('arch-unit')
  .command('print <dirPath>', 'Print the AST of the project', (yargs) => {
    yargs
    .positional('dirPath', {
      type: 'string',
      describe: 'The path to the project to be printed',
      demandOption: true,
    })
    .option('normalized', {
      alias: 'n',
      type: 'boolean',
      default: false,
      describe: 'Print full normalized (absolute) paths from "files dependencies"'
    });
  }, (argv) => {
    const dirPath = argv.dirPath as string;
    if (!dirPath) {
      console.error('Please provide a valid <dirPath> argument');
      process.exit(1);
    }
    const projectPath = path.resolve(process.cwd(), dirPath);
    const normalized = argv.normalized as boolean;
    const tree = ast.tree.generate(projectPath, normalized);
    console.log(JSON.stringify(tree, null, 2));
  })
  .help()
  .alias('h', 'help')
  .alias('v', 'version')
  .version('1.0.0')
  .argv;
