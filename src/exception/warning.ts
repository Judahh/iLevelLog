class Warning extends Error {
  isWarning = true;
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export { Warning };
