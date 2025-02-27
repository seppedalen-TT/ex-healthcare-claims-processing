/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// NOTE: this file should stay inside src folder

const { createProxyMiddleware } = require("http-proxy-middleware");

const httpJsonDevUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:" + process.env.REACT_APP_HTTP_JSON_PORT
    : `https://api.projectdabl.com/data/${process.env.REACT_APP_LEDGER_ID}`;

/**
 * @return {Boolean}
 */
const filter = function (pathname, req) {
  // Proxy requests to the http json api when in development
  const proxied =
    pathname.match("^/v1") && process.env.NODE_ENV === "development";

  if (proxied) {
    console.log(
      `Request with path ${pathname} proxied from host ${req.headers.host} to host ${httpJsonDevUrl}`
    );
  }

  return proxied;
};

module.exports = function (app) {
  app.use(
    createProxyMiddleware(filter, {
      target: httpJsonDevUrl,
      ws: true, //Proxy websockets
      changeOrigin: true,
    })
  );
};
