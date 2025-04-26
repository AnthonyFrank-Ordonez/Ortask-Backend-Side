import { Response } from 'express';
import { AuthenticationRequest, AuthResponse } from '../types';

export const checkAuth = (
	req: AuthenticationRequest,
	res: Response<AuthResponse>
) => {
	const userData = req.user || null;

	if (userData) {
		res.status(200).json({ isAuthenticated: true, user: userData });
	}
};
