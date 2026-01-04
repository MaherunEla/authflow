export class AppError extends Error {
  //To create a custom error that behaves like a native Error.
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message); // when extending a class, the parent constructor must run to initialize this
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor); //It removes internal constructor calls from the stack trace to make debugging cleaner.
  }
}
