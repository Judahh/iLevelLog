class SmartError extends Error {
  isWarning = false;
  static count = 0;
  constructor(message: string | Error | unknown, options?: ErrorOptions) {
    super(
      typeof message === 'string' ? message : (message as Error).message,
      options
    );
    if ((message as Error).stack) {
      this.stack = (message as Error).stack;
    }
    SmartError.count++;
  }
}

export { SmartError as Error };
