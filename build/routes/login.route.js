"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const login_controller_1 = require("../controllers/login.controller");
const loginRouter = express_1.default.Router();
loginRouter.post('/', (0, asyncHandler_1.default)(login_controller_1.loginUser));
exports.default = loginRouter;
