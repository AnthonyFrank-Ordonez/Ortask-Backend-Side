"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadProfileImage = exports.getUserProfile = exports.updateUserProfile = void 0;
const user_1 = __importDefault(require("../models/user"));
const app_1 = require("../app");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../utils/config");
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authRequest = req;
    const userId = (_a = authRequest.user) === null || _a === void 0 ? void 0 : _a.id;
    const { username, profilePicture } = req.body;
    const updatedData = { username };
    if (profilePicture && profilePicture.startsWith('data:image')) {
        // Extract base64 Data:
        const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        // Delete exisiting profile image if it exists:
        const user = yield user_1.default.findById(userId);
        if (user === null || user === void 0 ? void 0 : user.profileImageId) {
            yield app_1.gfs.delete(new mongoose_1.default.Types.ObjectId(user.profileImageId));
        }
        // Create file name
        const fileName = `profile_${userId}_${Date.now()}.jpg`;
        // Create write stream to GridFS
        const uploadStream = app_1.gfs.openUploadStream(fileName, {
            contentType: 'image/jpeg',
            metadata: { userId },
        });
        // Store the ID to reference in the user document
        updatedData.profileImageId = uploadStream.id;
        // Write the buffer to GridFs
        uploadStream.end(buffer);
    }
    // Update user in database
    const updatedUser = yield user_1.default.findByIdAndUpdate(userId, updatedData, {
        new: true,
    });
    res.status(200).json({
        success: true,
        user: {
            id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id,
            username: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.username,
            hasProfilePicture: !!(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.profileImageId),
        },
    });
});
exports.updateUserProfile = updateUserProfile;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        const user = yield user_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const response = {
            success: true,
            user: {
                id: user._id,
                username: user.username,
                profilePictureUrl: user.profileImageId
                    ? `${config_1.FRONTEND_URL}api/profile/profile-image/${user.profileImageId}`
                    : null,
            },
        };
        res.status(200).json(response);
    }
});
exports.getUserProfile = getUserProfile;
const downloadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageId = new mongoose_1.default.Types.ObjectId(req.params.imageId);
    const files = yield app_1.gfs.find({ _id: imageId }).toArray();
    if (!files || files.length === 0)
        return res.status(404).json({ error: 'Image not found' });
    // Set the content type;
    res.set('Content-Type', files[0].contentType);
    const downloadStream = app_1.gfs.openDownloadStream(imageId);
    downloadStream.pipe(res);
});
exports.downloadProfileImage = downloadProfileImage;
