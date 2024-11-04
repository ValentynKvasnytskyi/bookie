import { Request, Response } from "express";
import User from "./user/user.model.ts";
import Companies from "../api/entities/companies/companies.model.ts";
import { generateTokens } from "../utils/authHelper.ts";
import { env } from "../../config/env.ts";

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, companyData } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      let companyId;
      if (role !== "super_admin") {
        if (!companyData) {
          return res.status(400).json({ message: "Company data required" });
        }

        const company = await Companies.create({
          name: companyData.name,
          description: companyData.description,
          phoneNumber: companyData.phoneNumber,
          slug: companyData.name.toLowerCase().replace(/\s+/g, "-"),
        });
        companyId = company._id;
      }

      const user = new User({
        name,
        email,
        password,
        role,
        company: companyId,
      });
      await user.save();

      res.status(201).json({ message: "User and company registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password").populate("company", "name slug");
      if (!user || !user.isActive) {
        return res.status(400).json({ user: null });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      // Обновляем refresh tokens и время последнего входа
      user.refreshTokens?.push(refreshToken);
      user.lastLogin = new Date();
      await user.save();

      // Устанавливаем cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: "strict",
        maxAge: 16 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Отправляем данные пользователя
      const { name, role, company } = user;
      res.json({
        name,
        email,
        role,
        company: company ?? null,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  }

  static async tokenRefresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
      const user = await User.findOne({ refreshTokens: refreshToken });
      if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());

      user.refreshTokens = user.refreshTokens?.filter((token) => token !== refreshToken);
      user.refreshTokens?.push(newRefreshToken);
      await user.save();

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: "strict",
        maxAge: 16 * 60 * 1000,
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error refreshing token" });
    }
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    try {
      const user = await User.findById((req as any).user.userId);
      if (user) {
        user.refreshTokens = user.refreshTokens?.filter((token) => token !== refreshToken);
        await user.save();
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error logging out" });
    }
  }
}
