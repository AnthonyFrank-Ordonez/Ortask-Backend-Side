"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewTaskSchema = exports.NewUserSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
exports.NewUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('PLease Provide a valid email'),
    username: zod_1.z.string().min(3, 'Username must atleast 3 characters'),
    password: zod_1.z.string().min(8, 'Password must be atleast 8 characters'),
    role: zod_1.z.nativeEnum(types_1.Roles),
});
exports.NewTaskSchema = zod_1.z.object({
    taskName: zod_1.z.string().min(5, 'Task nam must be atleast 5'),
    dueDate: zod_1.z.coerce.date(),
    priority: zod_1.z.nativeEnum(types_1.Priority),
    status: zod_1.z.nativeEnum(types_1.Status),
});
