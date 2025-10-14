class ErrorHandler extends Error {
  constructor(
    message: string,
    public statusCode: number,
    stack = ''
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export class UnauthorizedError extends ErrorHandler {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
export class NotFoundError extends ErrorHandler {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export default ErrorHandler;
