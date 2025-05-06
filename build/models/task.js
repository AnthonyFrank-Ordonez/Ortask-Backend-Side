"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const taskSchema = new mongoose_1.default.Schema({
    taskName: {
        type: String,
        required: true,
        minLength: 5,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        reduired: true,
    },
    status: {
        type: String,
        rquired: true,
    },
    slug: {
        type: String,
        required: true,
    },
    user: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});
taskSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        if (returnedObject._id instanceof mongoose_1.default.Types.ObjectId) {
            returnedObject.id = returnedObject._id.toString() || returnedObject.id;
        }
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});
taskSchema.plugin(mongoose_unique_validator_1.default);
const Task = mongoose_1.default.model('Task', taskSchema);
exports.default = Task;
