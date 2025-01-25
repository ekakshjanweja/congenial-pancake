import { Hono } from "hono";
import { signInAuthRouter } from "./signin";
import { signUpAuthRouter } from "./signup";

export const authRouter = new Hono();

authRouter.route("/signup", signUpAuthRouter);
authRouter.route("/signin", signInAuthRouter);
