'use strict';

const path = require('path');
const moduleAlias = require('module-alias');
const baseDir = __dirname;

moduleAlias.addAliases({
  '#domain2': path.join(baseDir, 'domain'),
  '#usecases2': path.join(baseDir, 'use-cases'),
  '#infra2': path.join(baseDir, 'infra'),
  '#main2': path.join(baseDir, 'main'),
});
