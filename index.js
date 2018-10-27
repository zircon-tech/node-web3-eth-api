import { env, port } from './src/config';
import app from './src/services/express';

// module.parent check is required to support mocha watch
if (!module.parent) {
  app.listen(port, () => {
    console.info(`server started on port ${port} (${env})`); // eslint-disable-line
  });
}

export default app;
