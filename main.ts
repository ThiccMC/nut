import { PrismaClient } from "@prisma/client";

/**
 * Authentication helpers
 */
import { saltcheck } from "./utils/cipher";

/**
 * Token helpers
 */
import { protocol } from "./shared";
import { tokener, verify } from "./trusted";
import { JSONResponse, ErrorResponse, FutureResponse } from "./utils/bootstrap";

const prisma = new PrismaClient();

const mgex = /^[a-zA-Z0-9_]{2,16}$/;

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

type RouteFunc =
  | ((req: Request) => FutureResponse)
  | ((req: Request) => Response)
  | (() => FutureResponse)
  | (() => Response);

/* HTTP Flow */

type MatchParams = [string, RouteFunc];

class Resolver {
  readonly url: URL;
  readonly req: Request;
  constructor(req: Request) {
    this.req = req;
    this.url = new URL(req.url);
  }
  async match(matcher: string, lam: RouteFunc) {
    return this.url.pathname == matcher && (await lam(this.req));
  }
  async matchMethod(method: string, ...so: MatchParams) {
    return this.req.method === method && this.match(...so);
  }
}

Bun.serve({
  port: 8080,
  async fetch(req: Request) {
    const rs = new Resolver(req);
    return (
      (await rs.matchMethod("POST", "/api/auth", api.auth)) ||
      (await rs.match("/api/auth/verify", api.auth_verify)) ||
      (await rs.match("/", () => new Response("Home"))) ||
      new Response("no?", { status: 404 })
    );
  },
});

export {};
