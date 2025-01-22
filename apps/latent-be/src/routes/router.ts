import { Hono } from "hono";
import { health } from "../v1/endpoints/health-check/health";
import { authRouter } from "../v1/endpoints/auth/auth";

const BASE_URL = "/api/v1";

const router = new Hono().basePath(BASE_URL);

router.route("/health", health);
router.route("/auth", authRouter);

export default router;
