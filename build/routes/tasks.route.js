"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const tasks_controller_1 = require("../controllers/tasks.controller");
const middleware_1 = __importDefault(require("../utils/middleware"));
const tasksRouter = express_1.default.Router();
tasksRouter.get('/', middleware_1.default.verifyToken, (0, asyncHandler_1.default)(tasks_controller_1.getTasks));
tasksRouter.post('/', middleware_1.default.verifyToken, middleware_1.default.NewTaskParser, (0, asyncHandler_1.default)(tasks_controller_1.createTask));
exports.default = tasksRouter;
