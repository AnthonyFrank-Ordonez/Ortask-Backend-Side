import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import { loginUser } from '../controllers/login.controller';

const loginRouter = express.Router();

loginRouter.post('/', asyncHandler(loginUser));

export default loginRouter;
