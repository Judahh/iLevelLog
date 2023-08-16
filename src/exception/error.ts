class SmartError extends Error {
  isWarning = false;
  static count = 0;
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    SmartError.count++;
  }
}

export { SmartError as Error };
