class Warning extends Error {
  isWarning = true;
  static count = 0;
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    Warning.count++;
  }
}

export { Warning };
