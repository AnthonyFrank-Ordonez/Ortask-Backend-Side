import { NextFunction, Request, Response } from 'express';
import { NewTaskSchema, NewUserSchema } from './schemas';
import logger from './logger';
import { z } from 'zod';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { COOKIE_OPIONS, FRONTEND_URL, JWT_SECRET } from './config';
import { AuthenticationRequest } from '../types';
import User from '../models/user';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
	logger.info('Method:', req.method);
	logger.info('Path:  ', req.path);
	logger.info('Body:  ', req.body || 'NO-BODY');
	logger.info('---');
	next();
};

const unknowEndpoint = (_req: Request, res: Response) => {
	res.status(404).send({ error: 'Unknown Enpoint' });
	return;
};

const NewUserParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		NewUserSchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

const NewTaskParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		NewTaskSchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

const verifyToken = async (
	req: AuthenticationRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			res.status(401).json({ error: 'User not authenticated or Logout' });
			return;
		}

		const user = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
		if (!user.id) res.status(401).json({ error: 'Invalid Token' });

		const foundUser = await User.findById(user.id);

		if (!foundUser) {
			res.clearCookie('accessToken');
			res.status(404).json({ error: 'User not found' });
			return;
		}

		req.user = {
			id: foundUser._id,
			email: foundUser.email,
			username: foundUser.username,
		};
		next();
	} catch (error: unknown) {
		next(error);
	}
};

const refreshToken = async (
	req: AuthenticationRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			res.status(401).json({ error: 'Refresh token not found' });
			return;
		}

		const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
		const user = await User.findById(decoded.id);

		if (!user || user.refreshToken !== refreshToken) {
			res.status(403).json({ error: 'Invalid Refresh Token' });
			return;
		}

		const accessToken = jwt.sign(
			{ id: user._id, email: user.email, username: user.username },
			JWT_SECRET,
			{
				expiresIn: '15m',
			}
		);

		res.cookie('accessToken', accessToken, {
			...COOKIE_OPIONS,
			maxAge: 15 * 60 * 1000, // 15 minutes
		});

		req.user = { id: user._id, email: user.email, username: user.username };
		next();
	} catch (error: unknown) {
		next(error);
	}
};

const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (error instanceof z.ZodError) {
			logger.error(error.issues);
			res.status(400).send({ error: error.issues });
		} else if (error instanceof Error) {
			if (error.message === 'jwt expired') {
				logger.error(error.message);
				res.cookie('fromVerification', true, { httpOnly: false });
				res.redirect(`${FRONTEND_URL}expire`);
				return;
			}

			logger.error(error.message);
			res.status(400).send({ error: error.message });
		}
	} catch (error: unknown) {
		next(error);
	}
};

export default {
	requestLogger,
	NewUserParser,
	NewTaskParser,
	errorMiddleware,
	unknowEndpoint,
	verifyToken,
	refreshToken,
};
