import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../auth/user/user.model.ts";
import { env } from "../../config/env.ts";
import { generateTokens, setTokenCookie } from "../utils/authHelper.ts";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.redirect("/login");
  }

  try {
    const user = jwt.verify(accessToken, env.JWT_SECRET as string) as any;
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return res.status(401).json({ message: "Требуется аутентификация" });
      }

      try {
        const user = await User.findOne({ refreshTokens: refreshToken });
        if (!user) {
          return res.status(403).json({ message: "Недействительный refresh token" });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        user.refreshTokens = user.refreshTokens?.filter((token) => token !== refreshToken);
        user.refreshTokens?.push(newRefreshToken);
        await user.save();
        setTokenCookie(res, "accessToken", newAccessToken, 16 * 60 * 1000);
        setTokenCookie(res, "refreshToken", newRefreshToken, 7 * 24 * 60 * 60 * 1000);

        req.user = { userId: user._id };
        next();
      } catch (refreshError) {
        return res.status(403).json({ message: "Ошибка обновления токена" });
      }
    } else {
      return res.status(403).json({ message: "Недействительный токен" });
    }
  }
};
