
/**
 * @param {string} message string message of error
 * @description extends normall Error class but tailored to Json validation Errors
 */
class JsonValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "JsonValidationError";
  }
}

export { JsonValidationError };
