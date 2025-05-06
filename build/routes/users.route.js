"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../controllers/users.controller");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const usersRouter = express_1.default.Router();
usersRouter.get('/', (0, asyncHandler_1.default)(users_controller_1.getUser));
usersRouter.post('/register', middleware_1.default.NewUserParser, (0, asyncHandler_1.default)(users_controller_1.registerUser));
usersRouter.post('/logout', users_controller_1.logoutUser);
usersRouter.get('/verify-email', (0, asyncHandler_1.default)(users_controller_1.verifyUser));
usersRouter.post('/resend-verification', (0, asyncHandler_1.default)(users_controller_1.resendVerification));
exports.default = usersRouter;
