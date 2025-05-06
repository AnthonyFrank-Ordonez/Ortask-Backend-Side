import express from 'express';
import middleware from '../utils/middleware';
import {
	checkAuth,
	refreshUserToken,
} from '../controllers/check-auth.controller';
import asyncHandler from '../utils/asyncHandler';

const checkAuthRouter = express.Router();

checkAuthRouter.get('/', middleware.verifyToken, asyncHandler(checkAuth));
checkAuthRouter.post('/refresh', middleware.refreshToken, refreshUserToken);

export default checkAuthRouter;
