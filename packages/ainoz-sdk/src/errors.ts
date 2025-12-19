export class AinozError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'AINOZ_ERROR') {
    super(message);
    this.name = 'AinozError';
    this.code = code;
    Object.setPrototypeOf(this, AinozError.prototype);
  }
}

export class AinozNetworkError extends AinozError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'AinozNetworkError';
    Object.setPrototypeOf(this, AinozNetworkError.prototype);
  }
}

export class AinozValidationError extends AinozError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'AinozValidationError';
    Object.setPrototypeOf(this, AinozValidationError.prototype);
  }
}
