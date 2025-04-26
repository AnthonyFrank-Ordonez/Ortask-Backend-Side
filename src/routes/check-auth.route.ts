import express from 'express';
import middleware from '../utils/middleware';
import { checkAuth } from '../controllers/check-auth.controller';

const checkAuthRouter = express.Router();

checkAuthRouter.get('/', middleware.authenticateToken, checkAuth);

export default checkAuthRouter;
