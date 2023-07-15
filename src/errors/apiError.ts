class ApiErrors extends Error {
  public readonly status!: number;
  public readonly message!: string;
  public readonly hasToDisplay!: boolean;

  constructor(status: number, message: string, hasToDisplay = false) {
    super(message);
    this.status = status;
    this.hasToDisplay = hasToDisplay;
  }
}

export default ApiErrors;
