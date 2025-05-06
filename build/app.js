"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const login_route_1 = __importDefault(require("./routes/login.route"));
const check_auth_route_1 = __importDefault(require("./routes/check-auth.route"));
const tasks_route_1 = __importDefault(require("./routes/tasks.route"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./utils/logger"));
const config_1 = require("./utils/config");
const middleware_1 = __importDefault(require("./utils/middleware"));
const app = (0, express_1.default)();
exports.app = app;
mongoose_1.default.set('strictQuery', false);
logger_1.default.info('CONNECTING TO MONGODB, PLEASE WAIT...');
mongoose_1.default
    .connect(config_1.MONGODB_URI)
    .then(() => logger_1.default.info('SUCCESSFULLY CONNECTED TO MONGODB'))
    .catch((error) => logger_1.default.error(error));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (config_1.ALLOWED_ORIGINS.indexOf(origin) === -1)
            return callback(new Error('CORS Policy Violation'), false);
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// LOGGER
app.use(middleware_1.default.requestLogger);
// ROUTES
app.use('/api/login', login_route_1.default);
app.use('/api/check-auth', check_auth_route_1.default);
app.use('/api/users', users_route_1.default);
app.use('/api/tasks', tasks_route_1.default);
// MIDDLEWARES
app.use(middleware_1.default.unknowEndpoint);
app.use(middleware_1.default.errorMiddleware);
