import morgan from "morgan";
import { logger } from "../utils/logger.ts";
import { env } from "../../config/env.ts";
const stream = {
    write: (message) => logger.http(message),
};
const skip = () => {
    return env.ENVIRONMENT !== "development";
};
export const morganMiddleware = morgan("tiny", {
    stream,
    skip,
});
