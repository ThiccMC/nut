/**
 * This interface allow allies in swarm who share the same private key
 *  in order to verify enemy hash
 */

import Engine from "./utils/token";

import { protocol } from "./shared";

const pk = process.env.PRIVATE_KEY;

if (!pk)
  throw "Please run with PRIVATE_KEY enviroment variable, or add it into .env file";
const tokener = new Engine(pk);

/**
 * This quantum function may share across trusted NodeJS server
 * @param hash hash stored in header
 * @returns payloads
 */
export function verify(hash: string) {
  const reader = tokener.verify(hash);
  return reader && protocol.deserialize(reader);
}

export { tokener };
