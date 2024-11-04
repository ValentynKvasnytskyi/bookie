import { root } from "../root.ts";

export async function setupViteDevMiddleware(vite: any) {
  const viteDevServer = await vite.createServer({
    root,
    server: { middlewareMode: true },
  });

  return viteDevServer.middlewares;
}
