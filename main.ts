import { PrismaClient } from "@prisma/client";
import { ErrorMessage } from "./types/shared";
import { saltcheck } from "./utils/cipher";
import { protocol, tokener, verify } from "./trusted";

const prisma = new PrismaClient();

const mgex = /^[a-zA-Z0-9_]{2,16}$/;

type FutureResponse = Promise<Response>;
type JSONAble = object | boolean | number | string | null | undefined;

class JSONResponse extends Response {
  constructor(body: JSONAble, options?: ResponseInit) {
    super(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  }
}

class ErrorResponse extends JSONResponse {
  constructor(body: ErrorMessage, status: number, options?: ResponseInit) {
    super(body, {
      status,
      ...options,
    });
  }
}

module api {
  /* Auth */
  /**
   * #### This route provide a user-token for user-related service
   * > Route accept `urlencoded form` body. `POST` only
   *
   * `username` is a minecraft username, lowercased
   *
   * `password` is user's password hashed in sha256
   */
  export async function auth(req: Request): FutureResponse {
    const fd = await req.formData();

    if (!fd.has("username") || !fd.has("password"))
      return new ErrorResponse(
        {
          success: false,
          msg: "Missing body parameters",
        },
        400
      );
    const username = (fd.get("username") as string).toLowerCase();
    if (!mgex.test(username))
      return new ErrorResponse(
        {
          success: false,
          msg: "Wrong username format?",
        },
        400
      );
    const fetch = await prisma.credential.findUnique({
      where: {
        username: username,
      },
      select: {
        password: true,
        realname: true,
      },
    });
    if (fetch) {
      const { password, realname } = fetch;
      if (saltcheck(fd.get("password") as string, password)) {
        const f = protocol.serialize(username);
        return new JSONResponse({
          success: true,
          msg: "Authenticated as " + realname,
          token: tokener.sign(f),
        });
      } else
        return new ErrorResponse(
          { success: false, msg: "Password check failed!", code: "fpwd" },
          401
        );
    } else {
      return new ErrorResponse(
        { success: false, msg: "User not found?", code: "nusr" },
        404
      );
    }
  }

  export async function auth_verify(req: Request) {
    const to = req.headers.get("Authorization")?.split(" "),
      ve = to && to[0] == "Bearer" && verify(to[1]);
    return ve
      ? new JSONResponse({
          success: true,
          msg: "Authenticated as " + ve.username,
          data: ve,
        })
      : new ErrorResponse(
          {
            success: false,
            msg: "Token invalid",
          },
          401
        );
  }
}

/* HTTP Flow */

class Resolver {
  readonly url: URL;
  readonly req: Request;
  constructor(req: Request) {
    this.req = req;
    this.url = new URL(req.url);
  }
  match(matcher: string) {
    const pathname = this.url.pathname;
    return pathname == matcher;
  }
  matchMethod(method: string, matcher: string) {
    return this.match(matcher) && this.req.method === method;
  }
}

Bun.serve({
  port: 8080,
  fetch(req: Request) {
    return new Promise<Response>((ok, panic) => {
      const rs = new Resolver(req);
      if (rs.matchMethod("POST", "/api/auth"))
        api.auth(req).then(ok).catch(panic);
      else if (rs.match("/api/auth/verify"))
        api.auth_verify(req).then(ok).catch(panic);
      else if (rs.match("/")) ok(new Response("Home"));
      else ok(new Response("no?", { status: 404 }));
    });
  },
});

export {};
