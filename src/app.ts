import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.route';
import loginRouter from './routes/login.route';
import checkAuthRouter from './routes/check-auth.route';
import tasksRouter from './routes/tasks.route';
import mongoose from 'mongoose';
import logger from './utils/logger';
import { MONGODB_URI, ALLOWED_ORIGINS } from './utils/config';
import middleware from './utils/middleware';

const app = express();

mongoose.set('strictQuery', false);
logger.info('CONNECTING TO MONGODB, PLEASE WAIT...');

mongoose
	.connect(MONGODB_URI)
	.then(() => logger.info('SUCCESSFULLY CONNECTED TO MONGODB'))
	.catch((error) => logger.error(error));

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (ALLOWED_ORIGINS.indexOf(origin) === -1)
				return callback(new Error('CORS Policy Violation'), false);

			return callback(null, true);
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

// LOGGER
app.use(middleware.requestLogger);

// ROUTES
app.use('/api/login', loginRouter);
app.use('/api/check-auth', checkAuthRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);

// MIDDLEWARES
app.use(middleware.unknowEndpoint);
app.use(middleware.errorMiddleware);

export { app };
