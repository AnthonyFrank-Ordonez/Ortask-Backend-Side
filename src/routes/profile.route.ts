import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import middleware from '../utils/middleware';
import {
	downloadProfileImage,
	getUserProfile,
	updateUserProfile,
} from '../controllers/profile.controller';

const profileRouter = express.Router();

profileRouter.post(
	'/',
	middleware.verifyToken,
	asyncHandler(updateUserProfile)
);

profileRouter.get('/', middleware.verifyToken, asyncHandler(getUserProfile));

profileRouter.get(
	'/profile-image/:imageId',
	middleware.verifyToken,
	asyncHandler(downloadProfileImage)
);

export default profileRouter;
