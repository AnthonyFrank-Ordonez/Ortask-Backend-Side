"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./utils/config");
const logger_1 = __importDefault(require("./utils/logger"));
app_1.app.listen(config_1.PORT, () => {
    logger_1.default.info(`SERVER STARTS...`);
});
