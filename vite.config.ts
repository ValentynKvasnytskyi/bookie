import vue from "@vitejs/plugin-vue";
import vike from "vike/plugin";
import { UserConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

const config: UserConfig = {
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    vike({
      baseServer: "/",
    }),
  ],
};

export default config;
