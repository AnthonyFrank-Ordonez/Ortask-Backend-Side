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
exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../utils/config");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, rememberUser } = req.body;
    const user = yield user_1.default.findOne({ email: email });
    const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(password));
    if (!(user && isPasswordCorrect))
        return res.status(403).json({ error: 'Invalid Username or Pasword' });
    if (user) {
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, config_1.JWT_SECRET, {
            expiresIn: '15m',
        });
        const refreshTokenExpiration = rememberUser ? '2d' : '1d';
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET, {
            expiresIn: refreshTokenExpiration,
        });
        user.rememberUser = rememberUser ? true : false;
        user.refreshToken = refreshToken;
        yield user.save();
        if (rememberUser)
            config_1.COOKIE_OPIONS.maxAge = 3 * 24 * 60 * 60 * 1000;
        res.cookie('accessToken', accessToken, Object.assign({}, config_1.COOKIE_OPIONS));
        res.cookie('refreshToken', refreshToken, config_1.COOKIE_OPIONS);
        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                rememberUser: user.rememberUser,
                tasks: user.tasks,
            },
        });
    }
});
exports.loginUser = loginUser;
