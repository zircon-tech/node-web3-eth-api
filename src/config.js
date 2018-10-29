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
  PORT: Joi.number()
    .default(5000),
  API_ROOT: Joi.string()
    .default(''),
  API_KEY: Joi.string()
    .default('supersecret')
    .description('API KEY'),
  DB_NAME: Joi.string()
    .default('api')
    .description('MySQL database name'),
  DB_PORT: Joi.number()
    .default(3306),
  DB_HOST: Joi.string()
    .default('localhost'),
  DB_USERNAME: Joi.string().required()
    .default('mysql')
    .description('MySQL username'),
  DB_PASSWORD: Joi.string().allow('')
    .default('password')
    .description('Postgres password'),
  TEST_DB_NAME: Joi.string()
    .default('testapi')
    .description('MySQL test database name'),
  CLIENT_CALLBACK_URL: Joi.string()
    .description('Consumer callback for tx notifications'),
  ETH_HTTP_PROVIDER: Joi.string().required()
    .default('http://localhost:8045')
    .description('Ethereum provider access point'),
  ETH_SOCKET_PROVIDER: Joi.string().required()
    .default('http://localhost:8046')
    .description('Ethereum web socket provider access point'),
  ETH_PRIVATE_KEY: Joi.string().required()
    .description('Account private key'),
  ETH_DOCUMENT_CONTRACT_ADDRESS: Joi.string().required()
    .description('Document contract address'),
  ETH_DEFAULT_ACCOUNT_ADDRESS: Joi.string().required()
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
    port: envVars.PORT || 5000,
    apiRoot: envVars.API_ROOT || '',
    apiKey: envVars.API_KEY || 'supersecret',
    db: {
      database: envVars.DB_NAME,
      port: envVars.DB_PORT,
      host: envVars.DB_HOST,
      username: envVars.DB_USERNAME,
      password: envVars.DB_PASSWORD,
      dialect: 'mysql',
    },
    clientCallbackUrl: envVars.CLIENT_CALLBACK_URL,
    ethHttpProvider: envVars.ETH_HTTP_PROVIDER,
    ethSocketProvider: envVars.ETH_SOCKET_PROVIDER,
    ethPrivateKey: envVars.ETH_PRIVATE_KEY,
    ethDocumentContractAddress: envVars.ETH_DOCUMENT_CONTRACT_ADDRESS,
    ethDefaultAccountAddress: envVars.ETH_DEFAULT_ACCOUNT_ADDRESS,
    ethConfirmations: 10,
  },
  test: {
    db: {
      database: envVars.TEST_DB_NAME,
    },
  },
  production: {
    db: {
      database: envVars.DB_NAME,
      port: envVars.DB_PORT,
      host: envVars.DB_HOST,
      username: envVars.DB_USERNAME,
      password: envVars.DB_PASSWORD,
      dialect: 'mysql',
    },
  },
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
