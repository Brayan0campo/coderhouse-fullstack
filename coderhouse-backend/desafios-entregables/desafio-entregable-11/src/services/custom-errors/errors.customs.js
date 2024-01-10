export default class CustomError {
  static createError({ name = "Error", cause, message, code = 4 }) {
    const error = new Error(message);
    error.name = name;
    error.code = code;
    error.cause = cause;

    const errorDetails = {
      name: error.name,
      message: error.message,
      code: error.code,
      cause: error.cause,
    };

    throw errorDetails;
  }
}
