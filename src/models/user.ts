import mongoose, { Document, HydratedDocument } from 'mongoose';
import { IUser } from '../types';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema<IUser>(
	{
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
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Task',
			},
		],
		isVerified: { type: Boolean, default: false },
		rememberUser: { type: Boolean, default: false },
		refreshToken: { type: String },
	},
	{
		timestamps: true,
		methods: {
			comparePassword(this: HydratedDocument<IUser>, inputPassword: string) {
				return bcrypt.compare(inputPassword, this.password);
			},
		},
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error as Error);
	}
});

userSchema.set('toJSON', {
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		if (returnedObject._id instanceof mongoose.Types.ObjectId) {
			returnedObject.id = returnedObject._id.toString() || returnedObject.id;
		}
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
