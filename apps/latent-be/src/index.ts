import { Hono } from "hono";

const BASE_URL = "/api/v1";

const app = new Hono().basePath(BASE_URL);

// export default {
//   port: 8080,
//   fetch: app.fetch,
// };

export default app;
