import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV,
  DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  BASE_URL: process.env.BASE_URL,
};

export default CONFIG;
