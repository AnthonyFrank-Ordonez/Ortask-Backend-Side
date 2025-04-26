import { NextFunction, Request, Response } from 'express';
import { NewTaskSchema, NewUserSchema } from './schemas';
import logger from './logger';
import { z } from 'zod';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from './config';
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

const authenticateToken = async (
	req: AuthenticationRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.token;

	if (!token) {
		res.status(401).json({ error: 'User not authenticated or Logout' });
	} else {
		try {
			const user = jwt.verify(token, JWT_SECRET) as JwtPayload;
			if (!user.id) res.status(401).json({ error: 'Invalid Token' });

			const foundUser = await User.findById(user.id);

			if (!foundUser) {
				res.clearCookie('token');
				res.status(404).json({ error: 'User not found' });
			} else {
				req.user = foundUser;
				next();
			}
		} catch (error: unknown) {
			next(error);
		}
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
	authenticateToken,
};
