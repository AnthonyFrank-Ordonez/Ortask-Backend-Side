import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import {
	createTask,
	deleteTask,
	getTasks,
	updateTask,
} from '../controllers/tasks.controller';
import middleware from '../utils/middleware';

const tasksRouter = express.Router();

tasksRouter.get('/', middleware.verifyToken, asyncHandler(getTasks));
tasksRouter.post(
	'/',
	middleware.verifyToken,
	middleware.NewTaskParser,
	asyncHandler(createTask)
);
tasksRouter.put('/:id', middleware.verifyToken, asyncHandler(updateTask));
tasksRouter.delete(
	'/:blogId',
	middleware.verifyToken,
	asyncHandler(deleteTask)
);

export default tasksRouter;
