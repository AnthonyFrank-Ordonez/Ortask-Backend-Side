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
exports.resendVerification = exports.verifyUser = exports.logoutUser = exports.registerUser = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../utils/config");
const handlebars_1 = __importDefault(require("handlebars"));
// GET ALL USER CONTROLLER
const getUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.find({});
    res.status(200).json(user);
});
exports.getUser = getUser;
// REGISTER CONTROLLER
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, role } = req.body;
    const user = new user_1.default({
        email,
        username,
        password,
        role,
        isVerified: false,
        rememberUser: false,
    });
    const savedUser = yield user.save();
    const verificationToken = jsonwebtoken_1.default.sign({ userId: savedUser._id }, config_1.JWT_SECRET, {
        expiresIn: '5m',
    });
    const verificationURL = `${config_1.APP_URL}/api/users/verify-email?token=${verificationToken}`;
    const compiledTemplate = handlebars_1.default.compile(config_1.EMAIL_TEMPLATE);
    const emailHtml = compiledTemplate({
        userName: savedUser.username,
        verificationUrl: verificationURL,
        privacyUrl: 'https://example.com/',
        termsUrl: 'https://example.com/',
    });
    yield config_1.TRANSPORTER.sendMail({
        from: process.env.EMAIL_USER,
        to: savedUser.email,
        subject: 'Verify Your Email Address',
        html: emailHtml,
    });
    return res.status(200).json({
        message: 'User Registered. Please check your email to verify your account',
    });
});
exports.registerUser = registerUser;
// LOGOUT USER ROUTE
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        yield user_1.default.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout Successfully' });
});
exports.logoutUser = logoutUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    if (!token) {
        return res.redirect(`${config_1.FRONTEND_URL}expire`);
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
    const user = yield user_1.default.findById(decoded.userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    if (user === null || user === void 0 ? void 0 : user.isVerified)
        return res.redirect(`${config_1.FRONTEND_URL}`);
    if (user) {
        user.isVerified = true;
        yield user.save();
    }
    return res.redirect(`${config_1.FRONTEND_URL}`);
});
exports.verifyUser = verifyUser;
const resendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user)
        res.status(404).json({ error: 'User not found' });
    if (user === null || user === void 0 ? void 0 : user.isVerified)
        res.status(400).json({ error: 'User is already verified' });
    else {
        const verificationToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id }, config_1.JWT_SECRET, {
            expiresIn: '5m',
        });
        const verificationURL = `${config_1.APP_URL}/api/users/verify-email?token=${verificationToken}`;
        const compiledTemplate = handlebars_1.default.compile(config_1.EMAIL_TEMPLATE);
        const emailHtml = compiledTemplate({
            userName: user === null || user === void 0 ? void 0 : user.username,
            verificationUrl: verificationURL,
            privacyUrl: 'https://example.com/',
            termsUrl: 'https://example.com/',
        });
        yield config_1.TRANSPORTER.sendMail({
            from: process.env.EMAIL_USER,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: 'Verify Your Email Address',
            html: emailHtml,
        });
        res.status(200).json({ message: 'Verification Email Sent' });
    }
});
exports.resendVerification = resendVerification;
