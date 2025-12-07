import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

// In your middleware.ts or a separate types file
interface JwtPayload {
    userId: string;
    // Add other properties you encode in your JWT
    // iat?: number;  // issued at
    // exp?: number;  // expiration
}


export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
}