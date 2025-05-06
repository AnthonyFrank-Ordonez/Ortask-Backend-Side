import { Response, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import {
	AuthenticationRequest,
	ErrorMessage,
	NewUserEntry,
	RegisterResponse,
	ResendVerification,
	Users,
} from '../types';
import User from '../models/user';
import {
	APP_URL,
	EMAIL_TEMPLATE,
	FRONTEND_URL,
	JWT_SECRET,
	TRANSPORTER,
} from '../utils/config';
import Handlebars from 'handlebars';

// GET ALL USER CONTROLLER
export const getUser = async (_req: Request, res: Response<Users[]>) => {
	const user = await User.find({});

	res.status(200).json(user);
};

// REGISTER CONTROLLER
export const registerUser = async (
	req: Request<unknown, unknown, NewUserEntry>,
	res: Response<RegisterResponse>
) => {
	const { email, username, password, role } = req.body;

	const user = new User({
		email,
		username,
		password,
		role,
		isVerified: false,
		rememberUser: false,
	});

	const savedUser = await user.save();

	const verificationToken = jwt.sign({ userId: savedUser._id }, JWT_SECRET, {
		expiresIn: '5m',
	});

	const verificationURL = `${APP_URL}/api/users/verify-email?token=${verificationToken}`;

	const compiledTemplate = Handlebars.compile(EMAIL_TEMPLATE);

	const emailHtml = compiledTemplate({
		userName: savedUser.username,
		verificationUrl: verificationURL,
		privacyUrl: 'https://example.com/',
		termsUrl: 'https://example.com/',
	});

	await TRANSPORTER.sendMail({
		from: process.env.EMAIL_USER,
		to: savedUser.email,
		subject: 'Verify Your Email Address',
		html: emailHtml,
	});

	return res.status(200).json({
		message: 'User Registered. Please check your email to verify your account',
	});
};

// LOGOUT USER ROUTE
export const logoutUser = async (req: AuthenticationRequest, res: Response) => {
	const refreshToken = req.cookies.refreshToken;

	if (refreshToken) {
		await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
	}

	res.clearCookie('accessToken');
	res.clearCookie('refreshToken');

	res.status(200).json({ message: 'Logout Successfully' });
};

export const verifyUser = async (req: Request, res: Response<ErrorMessage>) => {
	const token = req.query.token as string;

	if (!token) {
		return res.redirect(`${FRONTEND_URL}expire`);
	}

	const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
	const user = await User.findById(decoded.userId);

	if (!user) return res.status(404).json({ error: 'User not found' });

	if (user?.isVerified) return res.redirect(`${FRONTEND_URL}`);

	if (user) {
		user.isVerified = true;
		await user.save();
	}

	return res.redirect(`${FRONTEND_URL}`);
};

export const resendVerification = async (
	req: Request<unknown, unknown, ResendVerification>,
	res: Response
) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) res.status(404).json({ error: 'User not found' });

	if (user?.isVerified)
		res.status(400).json({ error: 'User is already verified' });
	else {
		const verificationToken = jwt.sign({ userId: user?._id }, JWT_SECRET, {
			expiresIn: '5m',
		});

		const verificationURL = `${APP_URL}/api/users/verify-email?token=${verificationToken}`;

		const compiledTemplate = Handlebars.compile(EMAIL_TEMPLATE);

		const emailHtml = compiledTemplate({
			userName: user?.username,
			verificationUrl: verificationURL,
			privacyUrl: 'https://example.com/',
			termsUrl: 'https://example.com/',
		});

		await TRANSPORTER.sendMail({
			from: process.env.EMAIL_USER,
			to: user?.email,
			subject: 'Verify Your Email Address',
			html: emailHtml,
		});

		res.status(200).json({ message: 'Verification Email Sent' });
	}
};
