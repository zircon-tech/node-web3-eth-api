/* eslint-disable no-unused-vars */
import path from 'path';
import Joi from 'joi';
import merge from 'lodash/merge';
import dotenv from 'dotenv-safe';

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  dotenv.load({ path: path.join(__dirname, '../.env') });
}

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  NODE_PORT: Joi.number()
    .default(5000),
  NODE_API_ROOT: Joi.string()
    .default(''),
  NODE_API_KEY: Joi.string()
    .default('supersecret')
    .description('API KEY'),
  NODE_DB_CONNECTION_STRING: Joi.string()
    .default('Server=myServerAddress;Port=3306;Database=myDataBase;Uid=myUsername;Pwd=myPassword;')
    .description('Database connection string'),
  NODE_TEST_DB_NAME: Joi.string()
    .default('testapi')
    .description('MySQL test database name'),
  NODE_CLIENT_CALLBACK_URL: Joi.string()
    .description('Consumer callback for tx notifications'),
  NODE_ETH_HTTP_PROVIDER: Joi.string().required()
    .default('http://localhost:8045')
    .description('Ethereum provider access point'),
  NODE_ETH_SOCKET_PROVIDER: Joi.string().required()
    .default('http://localhost:8046')
    .description('Ethereum web socket provider access point'),
  NODE_ETH_PRIVATE_KEY: Joi.string().required()
    .description('Account private key'),
  NODE_ETH_DOCUMENT_CONTRACT_ADDRESS: Joi.string().required()
    .description('Document contract address'),
  NODE_ETH_DEFAULT_ACCOUNT_ADDRESS: Joi.string().required()
    .description('Default account address to send data from'),
})
.unknown()
.required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  all: {
    env: envVars.NODE_ENV || 'development',
    port: envVars.NODE_PORT || 5000,
    apiRoot: envVars.NODE_API_ROOT || '',
    apiKey: envVars.NODE_API_KEY || 'supersecret',
    db: {
      dbConnectionString: envVars.NODE_DB_CONNECTION_STRING,
      dialect: 'mysql',
    },
    clientCallbackUrl: envVars.NODE_CLIENT_CALLBACK_URL,
    ethHttpProvider: envVars.NODE_ETH_HTTP_PROVIDER,
    ethSocketProvider: envVars.NODE_ETH_SOCKET_PROVIDER,
    ethPrivateKey: envVars.NODE_ETH_PRIVATE_KEY,
    ethDocumentContractAddress: envVars.NODE_ETH_DOCUMENT_CONTRACT_ADDRESS,
    ethDefaultAccountAddress: envVars.NODE_ETH_DEFAULT_ACCOUNT_ADDRESS,
    ethConfirmations: 10,
  },
  test: {
    db: {
      database: envVars.NODE_TEST_DB_NAME,
    },
  },
  production: {
    db: {
      dbConnectionString: envVars.NODE_DB_CONNECTION_STRING,
      dialect: 'mssql',
    },
  },
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
