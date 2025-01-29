import { jwt } from "hono/jwt";
import { JWT_SECRET } from "../../config/config";
import { Context, Next } from "hono";
import { errorResponse, ErrorType } from "../../utils/api-response";

export const authMiddleware = async (c: Context, next: Next) => {
  if (c.req.path.startsWith("/api/v1/auth/")) {
    return next();
  }

  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json(
        errorResponse(ErrorType.UnauthorizedNoAuthheaderFound),
        401
      );
    }

    const jwtMiddleware = jwt({
      secret: JWT_SECRET!,
    });
    return await jwtMiddleware(c, next);
  } catch (error) {
    return c.json(errorResponse(ErrorType.Unauthorized), 401);
  }
};
