"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.default = asyncHandler;
