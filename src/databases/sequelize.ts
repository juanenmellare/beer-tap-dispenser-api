import { Sequelize } from 'sequelize';
import {
  databaseName,
  databaseDialect,
  databaseHost,
  databaseLogging,
  databasePassword,
  databasePort,
  databaseUsername,
} from '../configs';

const sequelize: Sequelize = new Sequelize({
  dialect: databaseDialect,
  host: databaseHost,
  port: databasePort,
  database: databaseName,
  username: databaseUsername,
  password: databasePassword,
  logging: databaseLogging,
});

export const checkSequelizeConnection = (): void => {
  const baseMessage = `Database \'${databaseName}\' on port \'${databasePort}\' is connected`;
  sequelize
    .authenticate()
    .then(() => console.log(`${baseMessage} successfully!`))
    .catch((error) => console.error(`${baseMessage} unsuccessful:\n${error.toString()}`));
};

const options = {
  underscored: true,
  timestamps: false,
};

export default {
  sequelize,
  ...options,
};
