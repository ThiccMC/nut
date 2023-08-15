import { PrismaClient } from "@prisma/client";
import * as mysql from "mysql2";
import env from "../utils/env";

export const pool = mysql.createPool(env.mysql);

export const prisma = new PrismaClient();

export async function mySQL({ q, v }: { q: string; v: any }) {
  const promisePool = pool.promise();
  const data = await promisePool.query(q, v);
  return data[0] as mysql.RowDataPacket[];
}
