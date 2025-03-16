import { Request, Response, NextFunction } from "express";

class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
};

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
