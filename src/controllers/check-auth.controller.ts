import { Response } from 'express';
import { AuthenticationRequest, AuthResponse, ErrorMessage } from '../types';
import User from '../models/user';

export const checkAuth = async (
	req: AuthenticationRequest,
	res: Response<AuthResponse | ErrorMessage>
) => {
	const userData = req.user || null;

	if (userData) {
		const user = await User.findById(userData.id).select(
			'-password -refreshToken'
		);

		if (user)
			return res.status(200).json({ isAuthenticated: true, user: user });

		return res.status(404).json({ error: 'User Not Found!' });
	}
};

export const refreshUserToken = (req: AuthenticationRequest, res: Response) => {
	const user = req.user;

	res.status(200).json({
		user: {
			id: user?.id,
			email: user?.email,
			username: user?.username,
		},
	});
};
