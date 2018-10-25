// require('babel-core/register');

// exports = module.exports = require('./src/app');

import { env, port } from './src/config';
import app from './src/services/express';
// import db from './config/sequelize';

// module.parent check is required to support mocha watch
if (!module.parent) {
  app.listen(port, () => {
    console.info(`server started on port ${port} (${env})`); // eslint-disable-line
  });
}

export default app;
