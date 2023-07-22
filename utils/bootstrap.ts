import { ErrorMessage } from "../types";

export type FutureResponse = Promise<Response>;
export type JSONAble = object | boolean | number | string | null | undefined;

export class JSONResponse extends Response {
  constructor(body: JSONAble, options?: ResponseInit) {
    super(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  }
}

export class ErrorResponse extends JSONResponse {
  constructor(body: ErrorMessage, status: number, options?: ResponseInit) {
    super(body, {
      status,
      ...options,
    });
  }
}