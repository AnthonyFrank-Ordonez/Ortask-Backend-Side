import { Request, Response } from 'express';
import {
	AuthenticationRequest,
	ErrorMessage,
	UpdatedUserProfile,
	UpdateProfileResponse,
	UserProfile,
	UserProfileResponse,
} from '../types';
import User from '../models/user';
import { gfs } from '../app';
import mongoose from 'mongoose';
import { FRONTEND_URL } from '../utils/config';

export const updateUserProfile = async (
	req: Request<unknown, unknown, UserProfile>,
	res: Response<UpdateProfileResponse>
) => {
	const authRequest = req as AuthenticationRequest;
	const userId = authRequest.user?.id;
	const { username, profilePicture } = req.body;

	const updatedData: UpdatedUserProfile = { username };

	if (profilePicture && profilePicture.startsWith('data:image')) {
		// Extract base64 Data:
		const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');

		// Delete exisiting profile image if it exists:
		const user = await User.findById(userId);
		if (user?.profileImageId) {
			await gfs.delete(new mongoose.Types.ObjectId(user.profileImageId));
		}

		// Create file name
		const fileName = `profile_${userId}_${Date.now()}.jpg`;

		// Create write stream to GridFS
		const uploadStream = gfs.openUploadStream(fileName, {
			contentType: 'image/jpeg',
			metadata: { userId },
		});

		// Store the ID to reference in the user document
		updatedData.profileImageId = uploadStream.id;

		// Write the buffer to GridFs
		uploadStream.end(buffer);
	}

	// Update user in database
	const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
		new: true,
	});

	res.status(200).json({
		success: true,
		user: {
			id: updatedUser?._id,
			username: updatedUser?.username,
			hasProfilePicture: !!updatedUser?.profileImageId,
		},
	});
};

export const getUserProfile = async (
	req: AuthenticationRequest,
	res: Response<UserProfileResponse | ErrorMessage>
) => {
	const userId = req.user?.id;

	if (userId) {
		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ error: 'User not found' });

		const response = {
			success: true,
			user: {
				id: user._id,
				username: user.username,
				profilePictureUrl: user.profileImageId
					? `${FRONTEND_URL}api/profile/profile-image/${user.profileImageId}`
					: null,
			},
		};

		res.status(200).json(response);
	}
};

export const downloadProfileImage = async (
	req: Request<{ imageId: string }, unknown, unknown>,
	res: Response
) => {
	const imageId = new mongoose.Types.ObjectId(req.params.imageId);

	const files = await gfs.find({ _id: imageId }).toArray();

	if (!files || files.length === 0)
		return res.status(404).json({ error: 'Image not found' });

	// Set the content type;
	res.set('Content-Type', files[0].contentType);

	const downloadStream = gfs.openDownloadStream(imageId);
	downloadStream.pipe(res);
};
