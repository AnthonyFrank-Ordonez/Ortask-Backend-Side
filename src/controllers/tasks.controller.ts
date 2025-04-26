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

export const getTasks = async (_req: Request, res: Response<Tasks[]>) => {
	const tasks = await Task.find({});

	res.status(200).json(tasks);
};

export const createTask = async (
	req: Request<unknown, unknown, NewTaskEntry>,
	res: Response<Tasks | ErrorMessage>
) => {
	const authRequest = req as AuthenticationRequest;
	const token = authRequest.cookies.token;
	const { taskName, dueDate, priority, status } = req.body;

	const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

	if (!decodedToken.id) {
		res.status(401).json({ error: 'token missing or expire' });
	} else {
		const userInfo = authRequest.user;

		if (userInfo) {
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
				res.status(201).json(savedTask);
			} else {
				res.status(404).json({ error: 'Task not found failed to populate' });
			}
		} else {
			res.status(404).json({ error: 'User is not found!' });
		}
	}
};
