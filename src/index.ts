#!/usr/bin/env node

import { astParser } from './core/parser/ASTParser';

import { argv } from 'process';

const command = argv[2];

if (command === 'print') {
  console.log(astParser());
} else {
  console.log(`Unknown command: "${command}". Try: arch print`);
}