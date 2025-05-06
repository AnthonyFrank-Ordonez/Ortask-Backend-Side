import { NextFunction, Request, Response } from 'express';

const asyncHandler =
	<TReq extends Request = Request, TRes extends Response = Response>(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (req: TReq, res: TRes, next: NextFunction) => Promise<any>
	) =>
	(req: TReq, res: TRes, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};

export default asyncHandler;
