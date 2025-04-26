import { z } from 'zod';
import { NewTaskSchema, NewUserSchema } from './utils/schemas';
import mongoose, { Document } from 'mongoose';
import { Request } from 'express';

export type NewUserEntry = z.infer<typeof NewUserSchema>;
export type NewTaskEntry = z.infer<typeof NewTaskSchema>;
export type SanitizeUser = Omit<NewUserEntry, 'password'>;

export enum Priority {
	Medium = 'Medium',
	Highest = 'Highest',
	Critical = 'Critical',
}

export enum Status {
	ToDo = 'To Do',
	InProgress = 'In Progress',
	Completed = 'Completed',
}

export interface MongoUser extends Document {
	id?: string;
	_id: mongoose.Types.ObjectId;
	__v?: number;
	username: string;
	email: string;
	passwordHash: string;
	role: string;
	tasks: Array<mongoose.Types.ObjectId>;
	isVerified: boolean;
	rememberUser: boolean;
}

export interface MongoTask extends Document {
	id?: string;
	_id: mongoose.Types.ObjectId;
	__v?: number;
	taskName: string;
	dueDate: Date;
	priority: Priority;
	status: Status;
	slug: string;
	user: Array<mongoose.Types.ObjectId>;
}

export interface Users extends SanitizeUser {
	_id: mongoose.Types.ObjectId;
	id?: string;
	isVerified: boolean;
	rememberUser: boolean;
	tasks: Array<mongoose.Types.ObjectId>;
}

export interface Tasks extends NewTaskEntry {
	_id: mongoose.Types.ObjectId;
	id?: string;
	slug: string;
	user: Array<mongoose.Types.ObjectId>;
}

export interface LoginUser extends SanitizeUser {
	id: mongoose.Types.ObjectId;
	isVerified: boolean;
	rememberUser: boolean;
}

export interface AuthenticationRequest extends Request {
	user?: MongoUser | null;
	cookies: {
		token: string;
		userInfo: string;
	};
}

export interface UserAuthentication {
	email: string;
	password: string;
	rememberUser: boolean;
}

export interface LoginResponse {
	message: string;
	user: LoginUser;
}

export interface RegisterResponse {
	message: string;
}

export interface AuthResponse {
	isAuthenticated: boolean;
	user: MongoUser;
}

export interface VerificationEmail {
	message: string;
	verificationSuccess: boolean;
}

export interface ErrorMessage {
	error: string;
}

export interface ResendVerification {
	email: string;
}
