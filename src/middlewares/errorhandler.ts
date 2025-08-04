import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorId = uuidv4();
    const statusCode = err.statusCode || 500;
    const isProd = process.env.NODE_ENV === 'production';

    // Log the error details (could replace with Winston or Pino for production)
    console.error(`[${new Date().toISOString()}] [ErrorID: ${errorId}]`, {
        message: err.message,
        path: req.originalUrl,
        method: req.method,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        errorId,
        message: err.message || 'Internal Server Error',
        ...(isProd ? {} : { stack: err.stack }), // Only expose stack in dev
    });
};
