import { z } from 'zod';
import { NewTaskSchema, NewUserSchema } from './utils/schemas';
import mongoose, { Document, HydratedDocument } from 'mongoose';
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

export enum Roles {
	Employee = 'Employee',
	Lead = 'Lead',
	Manager = 'Manager',
	Admin = 'Admin',
}

export interface IUser extends Document {
	id: string;
	_id: mongoose.Types.ObjectId;
	__v?: number;
	username: string;
	email: string;
	password: string;
	role: Roles;
	tasks: Array<mongoose.Types.ObjectId>;
	isVerified: boolean;
	rememberUser: boolean;
	refreshToken: string;
	profileImageId: mongoose.Types.ObjectId;

	comparePassword: (
		this: HydratedDocument<IUser>,
		inputPassword: string
	) => Promise<boolean>;
}

export interface ITask extends Document {
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
	refreshToken: string;
	tasks: Array<mongoose.Types.ObjectId>;
}

export interface Tasks extends NewTaskEntry {
	_id: mongoose.Types.ObjectId;
	id?: string;
	taskName: string;
	dueDate: Date;
	priority: Priority;
	status: Status;
	slug: string;
	user: Array<mongoose.Types.ObjectId>;
}

export interface LoginUser extends SanitizeUser {
	id: mongoose.Types.ObjectId;
	isVerified: boolean;
	rememberUser: boolean;
	tasks: Array<mongoose.Types.ObjectId>;
}

export interface AuthenticationRequest extends Request {
	user?: {
		id: mongoose.Types.ObjectId | string | undefined | null;
		email: string;
		username: string;
	};
	cookies: {
		accessToken: string;
		refreshToken: string;
		userInfo: string;
	};
}

export interface TransformedObject {
	[key: string]: any;
	id?: string;
	_id?: any;
	__v?: any;
	passwordHash?: any;
}

export interface cookiesOpt {
	httpOnly: boolean;
	secure: boolean;
	sameSite: boolean | 'strict' | 'lax' | 'none' | undefined;
	maxAge?: number;
}

export interface TaskUpdate {
	updatedStatus: string;
}

export interface UserAuthentication {
	email: string;
	password: string;
	rememberUser: boolean;
}

export interface UserProfile {
	username: string;
	profilePicture: string;
}

export interface UpdatedUserProfile {
	username: string;
	profileImageId?: mongoose.Types.ObjectId;
}

export interface LoginResponse {
	user: LoginUser;
}

export interface RegisterResponse {
	message: string;
}

export interface AuthResponse {
	isAuthenticated: boolean;
	user: IUser;
}

export interface UpdateProfileResponse {
	success: boolean;
	user: {
		id: mongoose.Types.ObjectId | undefined;
		username: string | undefined;
		hasProfilePicture: boolean;
	};
}

export interface UserProfileResponse {
	success: boolean;
	user: {
		id: mongoose.Types.ObjectId;
		username: string;
		profilePictureUrl: string | null;
	};
}

export interface ErrorMessage {
	error: string;
}

export interface VerificationEmail {
	message: string;
	verificationSuccess: boolean;
}

export interface ResendVerification {
	email: string;
}
