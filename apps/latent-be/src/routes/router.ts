import app from "..";
import { HEALTH_ROUTE_NAME, healthRouter } from "./v1/health";
import { USER_ROUTE_NAME, userRouter } from "./v1/user";

app.route(HEALTH_ROUTE_NAME, healthRouter);
app.route(USER_ROUTE_NAME, userRouter);
