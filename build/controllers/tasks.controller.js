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
exports.createTask = exports.getTasks = void 0;
const task_1 = __importDefault(require("../models/task"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const slugify_1 = __importDefault(require("slugify"));
const user_1 = __importDefault(require("../models/user"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const tasks = yield task_1.default.find({ user: authUserId });
    res.status(200).json(tasks);
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authRequest = req;
    const accessToken = authRequest.cookies.accessToken;
    const { taskName, dueDate, priority, status } = req.body;
    const decodedToken = jsonwebtoken_1.default.verify(accessToken, config_1.JWT_SECRET);
    if (!decodedToken.id)
        return res.status(401).json({ error: 'token missing or expire' });
    const userInfo = yield user_1.default.findById(decodedToken.id);
    if (userInfo) {
        const task = new task_1.default({
            taskName: taskName,
            dueDate: dueDate,
            priority: priority,
            status: status,
            slug: (0, slugify_1.default)(taskName, { lower: true }),
            user: userInfo._id,
        });
        let savedTask = yield task.save();
        userInfo.tasks = userInfo.tasks.concat(savedTask._id);
        yield userInfo.save();
        const newTask = yield task_1.default.findById(savedTask._id);
        if (newTask) {
            savedTask = yield newTask.populate([
                { path: 'user', select: 'email username' },
            ]);
            return res.status(201).json(savedTask);
        }
        return res.status(404).json({ error: 'Task not found failed to populate' });
    }
    return res.status(404).json({ error: 'User is not found!' });
});
exports.createTask = createTask;
