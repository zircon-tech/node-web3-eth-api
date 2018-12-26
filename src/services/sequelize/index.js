import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { db as config } from '../../config';

const sequelizeOptions = {
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};
const sequelize = new Sequelize(
  config.dbConnectionString,
  sequelizeOptions
);

const modelsDir = path.normalize(`${__dirname}/../../api/models`);

// loop through all files in models directory ignoring hidden files
fs.readdirSync(modelsDir)
  .filter(file => file.indexOf('.') !== 0 && file.indexOf('.map') === -1)
  // import model files and save model names
  .forEach((file) => {
    const model = sequelize.import(path.join(modelsDir, file));
    config[model.name] = model;
  });

Object.keys(config).forEach((modelName) => {
  if (config[modelName].associate) {
    config[modelName].associate(config);
  }
});

// assign the sequelize variables to the config object and returning the config.
module.exports = _.extend(
  {
    sequelize,
    Sequelize,
  },
  config
);
