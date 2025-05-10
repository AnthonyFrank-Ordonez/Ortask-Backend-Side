"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const profile_controller_1 = require("../controllers/profile.controller");
const profileRouter = express_1.default.Router();
profileRouter.post('/', middleware_1.default.verifyToken, (0, asyncHandler_1.default)(profile_controller_1.updateUserProfile));
profileRouter.get('/', middleware_1.default.verifyToken, (0, asyncHandler_1.default)(profile_controller_1.getUserProfile));
profileRouter.get('/profile-image/:imageId', middleware_1.default.verifyToken, (0, asyncHandler_1.default)(profile_controller_1.downloadProfileImage));
exports.default = profileRouter;
