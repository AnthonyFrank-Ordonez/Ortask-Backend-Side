import express from 'express';
import {
	getUser,
	logoutUser,
	registerUser,
	resendVerification,
	verifyUser,
} from '../controllers/users.controller';
import asyncHandler from '../utils/asyncHandler';
import middleware from '../utils/middleware';

const usersRouter = express.Router();

usersRouter.get('/', middleware.verifyToken, asyncHandler(getUser));
usersRouter.post(
	'/register',
	middleware.NewUserParser,
	asyncHandler(registerUser)
);
usersRouter.post('/logout', logoutUser);
usersRouter.get('/verify-email', asyncHandler(verifyUser));
usersRouter.post('/resend-verification', asyncHandler(resendVerification));

export default usersRouter;
