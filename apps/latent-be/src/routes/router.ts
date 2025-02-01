import { Hono } from "hono";
import { health } from "../v1/endpoints/health-check/health";
import { authRouter } from "../v1/endpoints/auth/auth";
import { eventRouter } from "../v1/endpoints/event/event";
import { locationRouter } from "../v1/endpoints/location/location";
import { seatRouter } from "../v1/endpoints/seat";

const router = new Hono();

router.route("/health", health);
router.route("/auth", authRouter);
router.route("/event", eventRouter);
router.route("/location", locationRouter);
router.route("/seat", seatRouter);

export default router;
