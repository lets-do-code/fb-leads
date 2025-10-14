// error type
export interface TError {
  message: string;
  statusCode: number;
  stack?: string;
}
