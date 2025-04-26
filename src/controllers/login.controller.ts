import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { ErrorMessage, LoginResponse, UserAuthentication } from '../types';
import User from '../models/user';
import { JWT_SECRET } from '../utils/config';

export const loginUser = async (
	req: Request<unknown, unknown, UserAuthentication>,
	res: Response<LoginResponse | ErrorMessage>
) => {
	const { email, password, rememberUser } = req.body;

	const user = await User.findOne({ email: email });

	const isPasswordCorrect =
		user === null ? false : await bcrypt.compare(password, user.passwordHash);

	if (!(user && isPasswordCorrect))
		res.status(401).json({ error: 'Invalid Username or Pasword' });

	if (user) {
		if (rememberUser) {
			user.rememberUser = true;
			await user.save();
		} else if (user.rememberUser) {
			user.rememberUser = false;
			await user.save();
		}
		const token = jwt.sign({ id: user._id, username: user.email }, JWT_SECRET, {
			expiresIn: '1d',
		});

		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			maxAge: 5 * 24 * 60 * 60 * 1000, // 5 day
		});

		res.status(200).json({
			message: 'Login Success',
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				rememberUser: user.rememberUser,
			},
		});
	}
};
