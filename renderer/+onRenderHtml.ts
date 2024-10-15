// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString } from "@vue/server-renderer";
import { dangerouslySkipEscape, escapeInject } from "vike/server";
import { createVueApp } from "./createVueApp";
import { getPageTitle } from "./getPageTitle";
import type { OnRenderHtmlAsync } from "vike/types";

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const app = createVueApp(pageContext);
  const html = await renderToString(app);
  const title = getPageTitle(pageContext);
  // const desc = pageContext?.data?.description || pageContext.config.description || "Demo of using Vike";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
      <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // https://vike.dev/streaming
      enableEagerStreaming: false,
    },
  };
};
