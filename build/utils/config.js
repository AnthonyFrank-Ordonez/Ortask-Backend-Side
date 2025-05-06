"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_OPIONS = exports.FRONTEND_URL = exports.EMAIL_TEMPLATE = exports.TRANSPORTER = exports.APP_URL = exports.JWT_SECRET = exports.ALLOWED_ORIGINS = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT;
exports.PORT = PORT;
const MONGODB_URI = process.env.MONGODB_URI;
exports.MONGODB_URI = MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_SECRET = JWT_SECRET;
const ALLOWED_ORIGINS = ['http://localhost:4173'];
exports.ALLOWED_ORIGINS = ALLOWED_ORIGINS;
const FRONTEND_URL = process.env.NODE_ENV !== 'production'
    ? process.env.LOCAL_FRONTEND_URL
    : process.env.PROD_FRONTEND_URL;
exports.FRONTEND_URL = FRONTEND_URL;
const APP_URL = process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_APP_URL
    : process.env.PROD_APP_URL;
exports.APP_URL = APP_URL;
const COOKIE_OPIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};
exports.COOKIE_OPIONS = COOKIE_OPIONS;
if (process.env.NODE_ENV !== 'production') {
    ALLOWED_ORIGINS.push('http://localhost:5173');
}
const TRANSPORTER = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
exports.TRANSPORTER = TRANSPORTER;
const EMAIL_TEMPLATE = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', 'template', 'verificationEmail.html'), 'utf-8');
exports.EMAIL_TEMPLATE = EMAIL_TEMPLATE;
