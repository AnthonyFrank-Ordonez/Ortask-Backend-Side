import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ITask } from '../types';

const taskSchema = new mongoose.Schema<ITask>(
	{
		taskName: {
			type: String,
			required: true,
			minLength: 5,
			unique: true,
		},
		dueDate: {
			type: Date,
			default: Date.now,
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
	},
	{
		timestamps: true,
	}
);

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

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
