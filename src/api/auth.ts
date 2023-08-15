import { Elysia, t } from "elysia";
import { saltcheck } from "../../utils/cipher";
import { protocol } from "../../shared";
import { tokener } from "../../trusted";
import { prisma } from "../func/db";

const mgex = /^[a-zA-Z0-9_]{2,16}$/;

export default (app: Elysia) =>
  app.group("/auth", (app) =>
    app.post(
      "/",
      async ({ body: { username, password: ipassword }, set }) => {
        const fetch = await prisma.credential.findUnique({
          where: {
            username: username,
          },
          select: {
            password: true,
            realname: true,
            pf: {
              select: {
                id: true,
              },
            },
          },
        });
        if (fetch) {
          const { password, realname } = fetch;
          if (saltcheck(ipassword, password)) {
            const f = protocol.serialize(username, fetch.pf?.id);
            return {
              success: true,
              msg: "Authenticated as " + realname,
              token: tokener.sign(f),
            };
          }
          //   return new ErrorResponse(
          else {
            set.status = 400;
            return "Fail password";
          }
          //     401
          // );
        } else {
          set.status = 404;
          return "User not found";
        }
      },
      {
        body: t.Object({
          username: t.String({
            default: "Console",
            // format: "regex",
            // pattern: "/^[a-zA-Z0-9_]{2,16}$/",
            minLength: 2,
            maxLength: 16,
          }),
          password: t.String({
            default: "f".repeat(64),
            description:
              "The password, hashed with SHA256 Digest once, encode in Hex and lowercased.",
            // format: "regex",
            // pattern: "/^[0-9a-f]*$/",
            minLength: 64,
            maxLength: 64,
          }),
        }),
        response: {
          200: t.Object({
            success: t.Boolean({
              default: true,
            }),
            msg: t.String(),
            token: t.String(),
          }),
          401: t.String({
            default: "Fail password",
            description: "At this point if you tried to bruteforce your own brain to find the correct password, well the server would exaust!"
          }),
          404: t.String({
            default: "User not found",
            description: "At this point you realize your keyboard sucks."
          })
        },
      }
    )
  );

// async ({ body: { username, password: ipassword } }) => {
  // if (!mgex.test(username))
  //   return new ErrorResponse(
  //     {
  //       success: false,
  //       msg: "Wrong username format?",
  //     },
  //     400
  //   );
//   const fetch = await prisma.credential.findUnique({
//     where: {
//       username: username,
//     },
//     select: {
//       password: true,
//       realname: true,
//       pf: {
//         select: {
//           id: true,
//         },
//       },
//     },
//   });
//   if (fetch) {
//     const { password, realname } = fetch;
//     if (saltcheck(ipassword, password)) {
//       const f = protocol.serialize(username, fetch.pf?.id);
//       // return {
//       //   success: true,
//       //   msg: "Authenticated as " + realname,
//       //   token: tokener.sign(f),
//       // };
//     }
//     //  else
//     //   return new ErrorResponse(
//     //     { success: false, msg: "Password check failed!", code: "fpwd" },
//     //     401
//     //   );
//   } else {
//     return new ErrorResponse(
//       { success: false, msg: "User not found?", code: "nusr" },
//       404
//     );
//   }
// };
