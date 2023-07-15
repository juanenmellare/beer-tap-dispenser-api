require("dotenv").config();

const host = String(process.env.DATABASE_HOST || "localhost");
const port = Number(process.env.DATABASE_PORT || 5433);
const database = String(
  process.env.DATABASE_NAME || "beer-tap-dispenser-api",
);
const username = String(process.env.DATABASE_USER || "juan");
const password = String(process.env.DATABASE_PASSWORD || "messi");
const dialect = "postgres";


const environmentConfig = {
  username,
  password,
  database,
  host,
  port,
  dialect,
};

module.exports = {
  development: environmentConfig,
  production: environmentConfig,
};
