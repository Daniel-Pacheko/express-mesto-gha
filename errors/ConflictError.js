class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Conflict';
    this.statusCode = 500;
  }
}

module.exports = ConflictError;
