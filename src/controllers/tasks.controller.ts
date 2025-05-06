import { Request, Response } from 'express';
import Task from '../models/task';
import {
	AuthenticationRequest,
	ErrorMessage,
	NewTaskEntry,
	Tasks,
} from '../types';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';
import slugify from 'slugify';
import User from '../models/user';

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
	const accessToken = authRequest.cookies.accessToken;
	const { taskName, dueDate, priority, status } = req.body;

	const decodedToken = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;

	if (!decodedToken.id)
		return res.status(401).json({ error: 'token missing or expire' });

	const userInfo = await User.findById(decodedToken.id);

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
