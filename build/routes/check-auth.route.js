"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const check_auth_controller_1 = require("../controllers/check-auth.controller");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const checkAuthRouter = express_1.default.Router();
checkAuthRouter.get('/', middleware_1.default.verifyToken, (0, asyncHandler_1.default)(check_auth_controller_1.checkAuth));
checkAuthRouter.post('/refresh', middleware_1.default.refreshToken, check_auth_controller_1.refreshUserToken);
exports.default = checkAuthRouter;
