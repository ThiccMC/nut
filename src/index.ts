import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import v1 from "./api/v1";
import makeMetrics, { Metric } from "./utils/prometheus";
import env from "./utils/env";
import auth from "./api/auth";
// import { cors } from "@elysiajs/cors";

const swag = (v: string) =>
  swagger({
    documentation: {
      info: {
        title: "ThiccMC API Documentation",
        description:
          "Here you can find API spec for public API. Requirement: Must have a token for POST/PUT/DELETE.",
        version: v,
      },
      security: [
        {
          name: ["huh"],
        },
      ],
    },
    version: "5.3.1",
    path: "/",
    excludeStaticFile: false,
  });

const app = new Elysia()
  // .use(swag("1.0.0"))
  // .use(cors())
  .group("/api", (app) => app.use(auth).use(v1))
  .listen(8080);

// app.get(
//   "/metrics",
//   () =>
//     new Response(
//       makeMetrics(
//         (
//           [
//             {
//               name: "api_http_pending",
//               value: app.server?.pendingRequests || 0,
//             },
//             {
//               name: "api_ws_pending",
//               value: app.server?.pendingWebSockets || 0,
//             },
//           ] as Metric[]
//         ).map((met) => {
//           met.labels = {
//             ...met.labels,
//             host: env.runtime.hostname,
//           };
//           return met;
//         })
//       )
//     )
// );

export type App = typeof app;
Bun.gc(true);
console.log(`=> ${app.server?.hostname}:${app.server?.port}`);

setInterval(() => {
  console.log(app.routes);
}, 1000);
