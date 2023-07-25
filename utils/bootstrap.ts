import { ErrorMessage } from "../types";
import "./engine"

export type FutureResponse = Promise<Response>;
export type JSONAble = object | boolean | number | string | null | undefined;

export class JSONResponse extends Response {
  constructor(body: JSONAble, options?: ResponseInit) {
    const d = JSON.stringify(body);
    super(d, {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": d.length.toString(),
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
