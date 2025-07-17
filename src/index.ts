#!/usr/bin/env node

import { astParser } from './core/parser/ASTParser';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { printCommand } from './commands/print';

yargs(hideBin(process.argv))
  .scriptName('arch-unit')
  .command('print', 'Print the AST of the project', (yargs) => {
    yargs.option('normalized', {
      alias: 'n',
      type: 'boolean',
      default: false,
      describe: 'Print full normalized (absolute) paths from "files dependencies"'
    });
  }, (argv) => {
    const normalized = argv.normalized as boolean;
    printCommand(normalized);
  })
  .help()
  .alias('h', 'help')
  .alias('v', 'version')
  .version('1.0.0')
  .argv;
