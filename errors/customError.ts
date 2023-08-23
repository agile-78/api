export class CustomApiError extends Error {
  public status?: number;

  constructor(msg: string) {
    super(msg);
  }
}
