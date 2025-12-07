import { z } from "zod";
export declare const CreateUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const SignInUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const RoomSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=types.d.ts.map