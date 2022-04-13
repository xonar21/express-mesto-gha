class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = 500;
  }
}

module.exports = ErrorNotFound;