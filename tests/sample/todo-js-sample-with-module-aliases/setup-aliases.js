'use strict';

const path = require('path');
const moduleAlias = require('module-alias');
const baseDir = __dirname;

moduleAlias.addAliases({
  '#domain1': path.join(baseDir, 'domain'),
  '#usecases1': path.join(baseDir, 'use-cases'),
  '#infra1': path.join(baseDir, 'infra'),
  '#main1': path.join(baseDir, 'main'),
});
