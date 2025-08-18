'use strict';

const path = require('path');
const moduleAlias = require('module-alias');
const baseDir = __dirname;

moduleAlias.addAliases({
  '#domain': path.join(baseDir, 'domain'),
  '#usecases': path.join(baseDir, 'use-cases'),
  '#infra': path.join(baseDir, 'infra'),
  '#main': path.join(baseDir, 'main'),
});
