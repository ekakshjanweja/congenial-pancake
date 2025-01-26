import { Hono } from "hono";
import { signInAuthRouter } from "./signin";
import { signUpAuthRouter } from "./signup";
import { adminSignInAuthRouter } from "./admin-signin";
import { adminSignUpAuthRouter } from "./admin-signup";

export const authRouter = new Hono();

authRouter.route("/signup", signUpAuthRouter);
authRouter.route("/signin", signInAuthRouter);
authRouter.route("/admin/signin", adminSignInAuthRouter);
authRouter.route("/admin/signup", adminSignUpAuthRouter);
