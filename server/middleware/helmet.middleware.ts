import helmet, { HelmetOptions } from "helmet";
import { env } from "../../config/env.ts";

export const helmetMiddleware = helmet(getHelmetOptions());
function getHelmetOptions(): HelmetOptions {
  const productionOptions: HelmetOptions = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
  };

  const developOptions: HelmetOptions = {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  };

  return env.ENVIRONMENT === "production" ? productionOptions : developOptions;
}
