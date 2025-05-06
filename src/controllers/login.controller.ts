import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ErrorMessage, LoginResponse, UserAuthentication } from '../types';
import User from '../models/user';
import { COOKIE_OPIONS, JWT_SECRET } from '../utils/config';

export const loginUser = async (
	req: Request<unknown, unknown, UserAuthentication>,
	res: Response<LoginResponse | ErrorMessage>
) => {
	const { email, password, rememberUser } = req.body;
	const user = await User.findOne({ email: email });
	const isPasswordCorrect = await user?.comparePassword(password);

	if (!(user && isPasswordCorrect))
		return res.status(403).json({ error: 'Invalid Username or Pasword' });

	if (user) {
		const accessToken = jwt.sign(
			{ id: user._id, email: user.email, username: user.username },
			JWT_SECRET,
			{
				expiresIn: '15m',
			}
		);

		const refreshTokenExpiration = rememberUser ? '2d' : '1d';

		const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
			expiresIn: refreshTokenExpiration,
		});

		user.rememberUser = rememberUser ? true : false;
		user.refreshToken = refreshToken;
		await user.save();

		if (rememberUser) COOKIE_OPIONS.maxAge = 3 * 24 * 60 * 60 * 1000;

		res.cookie('accessToken', accessToken, {
			...COOKIE_OPIONS,
		});

		res.cookie('refreshToken', refreshToken, COOKIE_OPIONS);

		return res.status(200).json({
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				rememberUser: user.rememberUser,
				tasks: user.tasks,
			},
		});
	}
};
