import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Task from '../models/task';
import {
	AuthenticationRequest,
	ErrorMessage,
	NewTaskEntry,
	Tasks,
	TaskUpdate,
} from '../types';
import slugify from 'slugify';
import User from '../models/user';
import { JWT_SECRET } from '../utils/config';

export const getTasks = async (
	req: AuthenticationRequest,
	res: Response<Tasks[]>
) => {
	const authUserId = req.user?.id;
	const tasks = await Task.find({ user: authUserId });

	res.status(200).json(tasks);
};

export const createTask = async (
	req: Request<unknown, unknown, NewTaskEntry>,
	res: Response<Tasks | ErrorMessage>
) => {
	const authRequest = req as AuthenticationRequest;
	const user = authRequest.user;
	const { taskName, dueDate, priority, status } = req.body;

	if (user && !user?.id)
		return res
			.status(401)
			.json({ error: 'User not authenticated or token expire' });

	const userInfo = await User.findById(user?.id);

	if (userInfo) {
		const existingTask = await Task.find({ taskName });

		if (existingTask.length === 1)
			return res.status(400).json({ error: 'Task name already exists!' });

		const task = new Task({
			taskName: taskName,
			dueDate: dueDate,
			priority: priority,
			status: status,
			slug: slugify(taskName, { lower: true }),
			user: userInfo._id,
		});

		let savedTask = await task.save();

		userInfo.tasks = userInfo.tasks.concat(savedTask._id);

		await userInfo.save();

		const newTask = await Task.findById(savedTask._id);

		if (newTask) {
			savedTask = await newTask.populate([
				{ path: 'user', select: 'email username' },
			]);
			return res.status(201).json(savedTask);
		}

		return res.status(404).json({ error: 'Task not found failed to populate' });
	}

	return res.status(404).json({ error: 'User is not found!' });
};

export const updateTask = async (
	req: Request<{ id: string }, unknown, TaskUpdate>,
	res: Response<Tasks | ErrorMessage>
) => {
	const taskId = req.params.id;
	const { updatedStatus } = req.body;

	const task = await Task.findById(taskId);

	if (!task) return res.status(404).json({ error: 'Task Not Found' });

	const newUpdatedTask = {
		taskName: task.taskName,
		dueDate: task.dueDate,
		priority: task.priority,
		status: updatedStatus,
		slug: task.slug,
		user: task.user,
	};

	const updatedTask = await Task.findByIdAndUpdate(taskId, newUpdatedTask, {
		new: true,
		runValidators: true,
	});

	if (updatedTask) {
		return res.status(200).json(updatedTask);
	} else {
		return res.status(408).json({ error: 'Task failed to updated' });
	}
};

export const deleteTask = async (
	req: Request<{ blogId: string }, unknown, unknown>,
	res: Response
) => {
	const auth = req as unknown as AuthenticationRequest;
	const accessToken = auth.cookies.accessToken;
	const decodedToken = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;

	const blogId = req.params.blogId;
	const userId = auth.user?.id;

	if (userId?.toString() !== decodedToken.id)
		return res
			.status(401)
			.json({ error: 'User unauthorized to delete this blog' });

	// Delete the task also from the user:
	const user = await User.findById(decodedToken.id);

	if (user) {
		user.tasks = user.tasks.filter((taskId) => taskId.toString() !== blogId);

		await user.save();
		await Task.findByIdAndDelete(blogId);
		res.status(204).end();
	}
};
