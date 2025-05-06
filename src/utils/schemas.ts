import { z } from 'zod';
import { Priority, Roles, Status } from '../types';

export const NewUserSchema = z.object({
	email: z.string().email('PLease Provide a valid email'),
	username: z.string().min(3, 'Username must atleast 3 characters'),
	password: z.string().min(8, 'Password must be atleast 8 characters'),
	role: z.nativeEnum(Roles),
});

export const NewTaskSchema = z.object({
	taskName: z.string().min(5, 'Task nam must be atleast 5'),
	dueDate: z.coerce.date(),
	priority: z.nativeEnum(Priority),
	status: z.nativeEnum(Status),
});
