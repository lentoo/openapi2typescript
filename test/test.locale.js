const oneapi = require('../dist/index');

oneapi.generateService({
  schemaPath: './openapi.json',
  serversPath: './servers',
});
