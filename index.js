import { env, port } from './src/config';
import app from './src/services/express';
import watcher from './src/watcher';

// module.parent check is required to support mocha watch
if (!module.parent) {
  app.listen(port, () => {
    console.info(`server started on port ${port} (${env})`); // eslint-disable-line
  });
}

// Web3 transaction watcher
watcher.watchContractTransactions();

export default app;
