import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./api/docs/swagger.options.ts";
import { morganMiddleware } from "./middleware/morgan.middleware.ts";
import { helmetMiddleware } from "./middleware/helmet.middleware.ts";
import { connectDB } from "./db/mongoose.ts";
import { env } from "../config/env.ts";
import { root } from "./root.ts";
import apiRoutes from "./api/routes/index.ts";
import { authenticateToken } from "./middleware/auth.middleware.ts";
import { vikeMiddleware } from "./middleware/vike.middleware.ts";
import { setupViteDevMiddleware } from "./middleware/vite.middleware.ts";
// import authRoutes from "./auth/auth/auth.routes.ts";

await startServer();

async function startServer() {
  const app: Express = express();

  // Set the application to trust the reverse proxy
  app.set("trust proxy", true);

  // Middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(morganMiddleware);
  app.use(helmetMiddleware);

  // Auth routes
  // app.use(authRoutes);

  // Api routes
  app.use("/api", apiRoutes);

  // Api docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Serve static
  if (env.IS_PRODUCTION) {
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(sirv(`${root}/dist/client`));
  } else {
    const vite = await import("vite");
    const viteDevMiddleware = await setupViteDevMiddleware(vite);
    app.use(viteDevMiddleware);
  }

  // Vike routes
  app.get("*", vikeMiddleware);

  connectDB().then(() => {
    console.log("Connected to MongoDB");

    app.listen(env.PORT, () => {
      console.log(`Server running at http://localhost:${env.PORT}`);
    });
  });
}
