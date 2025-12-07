"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSchema = exports.SignInUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.SignInUserSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.RoomSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
