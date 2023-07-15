// Application
const applicationPort: number = Number(process.env.PORT) || 3000;

// Database
const databaseDialect = 'postgres';
const databaseHost = String(process.env.DATABASE_HOST || 'localhost');
const databasePort = Number(process.env.DATABASE_PORT || 5433);
const databaseName = String(process.env.DATABASE_NAME || 'beer-tap-dispenser-api');
const databaseUsername = String(process.env.DATABASE_USER || 'juan');
const databasePassword = String(process.env.DATABASE_PASSWORD || 'messi');
const databaseLogging = false;

// Dispensers
const beerEurosPerLiter = 12.25;
const totalSpentDecimals = 3;

export {
  applicationPort,
  databaseDialect,
  databaseHost,
  databasePort,
  databaseName,
  databaseUsername,
  databasePassword,
  databaseLogging,
  beerEurosPerLiter,
  totalSpentDecimals,
};
