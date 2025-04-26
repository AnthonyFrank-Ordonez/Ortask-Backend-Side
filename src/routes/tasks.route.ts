import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import { createTask, getTasks } from '../controllers/tasks.controller';
import middleware from '../utils/middleware';

const tasksRouter = express.Router();

tasksRouter.get('/', asyncHandler(getTasks));
tasksRouter.post(
	'/',
	middleware.authenticateToken,
	middleware.NewTaskParser,
	asyncHandler(createTask)
);

export default tasksRouter;
