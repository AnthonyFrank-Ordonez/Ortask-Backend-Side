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
const schemas_1 = require("./schemas");
const logger_1 = __importDefault(require("./logger"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const user_1 = __importDefault(require("../models/user"));
const requestLogger = (req, _res, next) => {
    logger_1.default.info('Method:', req.method);
    logger_1.default.info('Path:  ', req.path);
    logger_1.default.info('Body:  ', req.body || 'NO-BODY');
    logger_1.default.info('---');
    next();
};
const unknowEndpoint = (_req, res) => {
    res.status(404).send({ error: 'Unknown Enpoint' });
    return;
};
const NewUserParser = (req, _res, next) => {
    try {
        schemas_1.NewUserSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const NewTaskParser = (req, _res, next) => {
    try {
        schemas_1.NewTaskSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            res.status(401).json({ error: 'User not authenticated or Logout' });
            return;
        }
        const user = jsonwebtoken_1.default.verify(accessToken, config_1.JWT_SECRET);
        if (!user.id)
            res.status(401).json({ error: 'Invalid Token' });
        const foundUser = yield user_1.default.findById(user.id);
        if (!foundUser) {
            res.clearCookie('accessToken');
            res.status(404).json({ error: 'User not found' });
            return;
        }
        req.user = {
            id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
        };
        next();
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token not found' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.JWT_SECRET);
        const user = yield user_1.default.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ error: 'Invalid Refresh Token' });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, config_1.JWT_SECRET, {
            expiresIn: '15m',
        });
        res.cookie('accessToken', accessToken, Object.assign(Object.assign({}, config_1.COOKIE_OPIONS), { maxAge: 15 * 60 * 1000 }));
        req.user = { id: user._id, email: user.email, username: user.username };
        next();
    }
    catch (error) {
        next(error);
    }
});
const errorMiddleware = (error, _req, res, next) => {
    try {
        if (error instanceof zod_1.z.ZodError) {
            logger_1.default.error(error.issues);
            res.status(400).send({ error: error.issues });
        }
        else if (error instanceof Error) {
            if (error.message === 'jwt expired') {
                logger_1.default.error(error.message);
                res.cookie('fromVerification', true, { httpOnly: false });
                res.redirect(`${config_1.FRONTEND_URL}expire`);
                return;
            }
            logger_1.default.error(error.message);
            res.status(400).send({ error: error.message });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    requestLogger,
    NewUserParser,
    NewTaskParser,
    errorMiddleware,
    unknowEndpoint,
    verifyToken,
    refreshToken,
};
