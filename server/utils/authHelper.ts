import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../../config/env.ts";
import { Response } from "express";

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = crypto.randomBytes(40).toString("hex");
  return { accessToken, refreshToken };
};

export function setTokenCookie(res: Response, tokenName: string, token: string, expires: number) {
  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: "strict",
    maxAge: expires,
  });
}
