import app from './app';
import * as dotenv from 'dotenv';
import { checkSequelizeConnection } from './databases/sequelize';
import { applicationPort } from './configs';

dotenv.config();

checkSequelizeConnection();

app.listen(applicationPort, () => console.log(`Listening on port ${applicationPort}`));
