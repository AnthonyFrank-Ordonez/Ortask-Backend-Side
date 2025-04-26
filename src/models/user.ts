import mongoose, { Document } from 'mongoose';
import { MongoUser } from '../types';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema<MongoUser>({
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
	passwordHash: {
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

const User = mongoose.model<MongoUser>('User', userSchema);

export default User;
