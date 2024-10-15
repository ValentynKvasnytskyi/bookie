import { getEnv } from "./getEnv.ts";
const ENVIRONMENT = getEnv("NODE_ENV", "development");
export const env = {
    DEFAULT_LOCALE: getEnv("VITE_DEFAULT_LOCALE", "uk"),
    SUPPORTED_LOCALES: getEnv("VITE_LOCALES", "uk,ru").split(","),
    BASE_URL: getEnv("VITE_BASE_URL", "http://localhost:3000"),
    ENVIRONMENT,
    IS_DEVELOPMENT: ENVIRONMENT === "development",
    IS_PRODUCTION: ENVIRONMENT === "production",
    PORT: Number(getEnv("PORT", "3000")),
    HRM_PORT: Number(getEnv("HMR_PORT", "24678")),
    MONGO_URI: getEnv("MONGO_DB_URI", ""),
    CORS_ORIGIN: getEnv("CORS_ORIGIN", "http://localhost:*"),
    JWT_SECRET: getEnv("JWT_SECRET"),
};
