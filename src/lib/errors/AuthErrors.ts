import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, 400, "VALIDATION_ERROR");
  }
}
export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super("Email already exists", 409, "EMAIL_EXISTS");
  }
}
