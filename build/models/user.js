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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    role: {
        type: String,
        required: true,
    },
    tasks: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
    isVerified: { type: Boolean, default: false },
    rememberUser: { type: Boolean, default: false },
    refreshToken: { type: String },
    profileImageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
        required: false,
    },
}, {
    timestamps: true,
    methods: {
        comparePassword(inputPassword) {
            return bcrypt_1.default.compare(inputPassword, this.password);
        },
    },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            this.password = yield bcrypt_1.default.hash(this.password, salt);
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        if (returnedObject._id instanceof mongoose_1.default.Types.ObjectId) {
            returnedObject.id = returnedObject._id.toString() || returnedObject.id;
        }
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});
userSchema.plugin(mongoose_unique_validator_1.default);
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
