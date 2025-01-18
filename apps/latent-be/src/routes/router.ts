import { Hono } from "hono";
import { health } from "../v1/endpoints/health-check/health";
import { userRouter } from "../v1/endpoints/user/user";

const BASE_URL = "/api/v1";

const router = new Hono().basePath(BASE_URL);

router.route("/health", health);
router.route("/user", userRouter);

export default router;
