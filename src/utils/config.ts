import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { cookiesOpt } from '../types';

const PORT = process.env.PORT!;
const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;
const ALLOWED_ORIGINS: string[] = [
	'http://localhost:4173',
	'https://ortask.afordonez.com',
	'http://localhost:5173',
	'http://localhost:3002',
];

const FRONTEND_URL =
	process.env.NODE_ENV !== 'production'
		? process.env.LOCAL_FRONTEND_URL!
		: process.env.PROD_FRONTEND_URL!;

const APP_URL =
	process.env.NODE_ENV === 'development'
		? process.env.LOCAL_APP_URL!
		: process.env.PROD_APP_URL!;

const COOKIE_OPIONS: cookiesOpt = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

if (process.env.NODE_ENV !== 'production') {
	ALLOWED_ORIGINS.push('http://localhost:5173');
}

const TRANSPORTER = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER!,
		pass: process.env.EMAIL_PASS!,
	},
});

const EMAIL_TEMPLATE = fs.readFileSync(
	path.join(__dirname, '..', '..', 'template', 'verificationEmail.html'),
	'utf-8'
);

export {
	PORT,
	MONGODB_URI,
	ALLOWED_ORIGINS,
	JWT_SECRET,
	APP_URL,
	TRANSPORTER,
	EMAIL_TEMPLATE,
	FRONTEND_URL,
	COOKIE_OPIONS,
};
