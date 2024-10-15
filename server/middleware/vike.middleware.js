import { renderPage } from "vike/server";
export async function vikeMiddleware(req, res, next) {
    const pageContextInit = {
        urlOriginal: req.originalUrl,
        headersOriginal: req.headers,
        user: req?.user,
    };
    const pageContext = await renderPage(pageContextInit);
    if (pageContext.errorWhileRendering) {
        // Install error tracking here, see https://vike.dev/errors
    }
    const { httpResponse } = pageContext;
    if (!httpResponse) {
        return next();
    }
    else {
        const { body, statusCode, headers, earlyHints } = httpResponse;
        if (res.writeEarlyHints)
            res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
        headers.forEach(([name, value]) => res.setHeader(name, value));
        res.status(statusCode);
        // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/streaming
        res.send(body);
    }
}
