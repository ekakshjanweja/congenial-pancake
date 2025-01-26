import { Hono } from "hono";
import { health } from "../v1/endpoints/health-check/health";
import { authRouter } from "../v1/endpoints/auth/auth";

const router = new Hono();

router.route("/health", health);
router.route("/auth", authRouter);

export default router;
