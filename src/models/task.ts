import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { MongoTask } from '../types';

const taskSchema = new mongoose.Schema<MongoTask>({
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
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

taskSchema.set('toJSON', {
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		if (returnedObject._id instanceof mongoose.Types.ObjectId) {
			returnedObject.id = returnedObject._id.toString() || returnedObject.id;
		}
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

taskSchema.plugin(uniqueValidator);

const Task = mongoose.model<MongoTask>('Task', taskSchema);

export default Task;
