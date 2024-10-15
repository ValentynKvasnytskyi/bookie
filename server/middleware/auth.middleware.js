import jwt from "jsonwebtoken";
import { env } from "../../config/env.ts";
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (req.path.startsWith("/auth")) {
        return next();
    }
    if (!token) {
        return res.status(401).json({ message: "Требуется аутентификация" });
    }
    jwt.verify(token, env.JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ message: "Недействительный токен" });
        console.log(user);
        req.user = user;
        next();
    });
};
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { env } from "../../config/env.ts";
//
// interface AuthRequest extends Request {
//   userId?: string;
// }
//
// const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
//   console.log("headers: ", req.headers);
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
//
//   try {
//     const decoded = jwt.verify(token, env.JWT_SECRET!) as { userId: string };
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     if (error instanceof jwt.TokenExpiredError) {
//       return res.status(401).json({ message: "Token expired" });
//     }
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };
//
// export default authMiddleware;
