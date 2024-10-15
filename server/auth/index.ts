// import express, { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import User from "./user/user.model.ts";
// import { env } from "../../config/env.ts";
// import { authHelper } from "../utils/authHelper.ts";
//
// const router = express.Router();
//
// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.sendStatus(401);
//
//   jwt.verify(token, env.JWT_SECRET!, (err: any, user: any) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };
//
// router.post("/register", async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const user = new User({ name, email, password, role });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user" });
//   }
// });
//
// router.post("/login", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "No user" });
//     }
//
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//
//     const { accessToken, refreshToken } = authHelper(user._id.toString());
//
//     if (!user.refreshTokens) {
//       user.refreshTokens = [];
//     }
//     user.refreshTokens.push(refreshToken);
//     await user.save();
//
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: env.IS_PRODUCTION,
//       sameSite: "strict",
//       maxAge: 16 * 60 * 1000, // 15 minutes
//     });
//
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: env.IS_PRODUCTION,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });
//
//     const { name, role } = user;
//     res.json({ name, email, role });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error logging in" });
//   }
// });
//
// router.post("/refresh-token", async (req: Request, res: Response) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.sendStatus(401);
//
//   try {
//     const user = await User.findOne({ refreshTokens: refreshToken });
//     if (!user) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }
//
//     const { accessToken, refreshToken: newRefreshToken } = authHelper(user._id.toString());
//
//     user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
//     user.refreshTokens.push(newRefreshToken);
//     await user.save();
//
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: env.IS_PRODUCTION,
//       sameSite: "strict",
//       maxAge: 16 * 60 * 1000,
//     });
//
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: env.IS_PRODUCTION,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//
//     res.sendStatus(204);
//   } catch (error) {
//     res.status(500).json({ message: "Error refreshing token" });
//   }
// });
//
// router.post("/logout", authenticateToken, async (req: Request, res: Response) => {
//   const refreshToken = req.cookies.refreshToken;
//
//   try {
//     const user = await User.findById(req.user.userId);
//     if (user) {
//       user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
//       await user.save();
//     }
//
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");
//     res.json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging out" });
//   }
// });
//
// export default router;
