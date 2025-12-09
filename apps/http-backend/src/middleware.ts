import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { JWTPayload } from "@repo/backend-common/types";


export function middleware(req: Request, res: Response, next: NextFunction) {
    console.log("Inside middleware");
    const token = req.headers["authorization"] ?? "";
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.userId = decoded.userId;
        next();
    } catch (e) {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}