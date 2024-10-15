import type { Config } from "vike/types";
import vikeVue from "vike-vue/config";
const config = {
  clientRouting: true,
  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
  },
  hydrationCanBeAborted: true,
  passToClient: ["locale", "urlLogical", "translations", "query"],
  // prefetchStaticAssets: "viewport",
  extends: [vikeVue],
} satisfies Config;

export { config };
