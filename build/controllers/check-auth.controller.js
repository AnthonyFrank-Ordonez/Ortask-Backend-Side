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
exports.refreshUserToken = exports.checkAuth = void 0;
const user_1 = __importDefault(require("../models/user"));
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user || null;
    if (userData) {
        const user = yield user_1.default.findById(userData.id).select('-password -refreshToken');
        if (user)
            return res.status(200).json({ isAuthenticated: true, user: user });
        return res.status(404).json({ error: 'User Not Found!' });
    }
});
exports.checkAuth = checkAuth;
const refreshUserToken = (req, res) => {
    const user = req.user;
    res.status(200).json({
        user: {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email,
            username: user === null || user === void 0 ? void 0 : user.username,
        },
    });
};
exports.refreshUserToken = refreshUserToken;
