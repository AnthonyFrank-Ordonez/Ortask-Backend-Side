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
import { GridFSBucket } from 'mongodb';
import profileRouter from './routes/profile.route';

const app = express();

mongoose.set('strictQuery', false);
logger.info('CONNECTING TO MONGODB, PLEASE WAIT...');

mongoose
	.connect(MONGODB_URI)
	.then(() => logger.info('SUCCESSFULLY CONNECTED TO MONGODB'))
	.catch((error) => logger.error(error));

// SET UP GRIDFS:
let gfs: GridFSBucket;
mongoose.connection.once('open', () => {
	const { db } = mongoose.connection;
	if (db) {
		gfs = new GridFSBucket(db, {
			bucketName: 'profileImages',
		});
		console.log('GridFS connection established');
	}
});

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
app.use('/api/profile', profileRouter);

// MIDDLEWARES
app.use(middleware.unknowEndpoint);
app.use(middleware.errorMiddleware);

export { app, gfs };
