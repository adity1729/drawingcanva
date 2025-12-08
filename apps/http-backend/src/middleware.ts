import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { JWTPayload } from "@repo/common/types";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";
    console.log("We are in middleware")
    console.log(token);
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        console.log("decoded token", decoded);
        req.userId = decoded.userId;
        console.log("passing to next middleware")
        next();
    } catch (e) {
        console.log(e);
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}