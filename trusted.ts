/**
 * This interface allow allies in swarm who share the same private key
 *  in order to verify enemy hash
 */

import { build, u } from "serdebin/helper";
import { Deserialization, extract_str, makeFixed } from "serdebin";
import pkgjson from "./package.json";
import Engine from "./utils/token";
import { trimStartPad } from "./utils/bytewise";

const pk = process.env.PRIVATE_KEY,
  proto = pkgjson.proto;

if (!pk)
  throw "Please run with PRIVATE_KEY enviroment variable, or add it into .env file";
const tokener = new Engine(pk);

/**
 * To keep long number remain compact, binary is used.
 * 
 * Unfortunaltely, you have to copy the size from serialize function to deserialize function.
 * There is no automation
 *
 * Example, current time in UNIX is 13 character, but under number bit level, it only cost 5 and 1/4 byte.
 */
export module protocol {
  /**
   * swarmer have anility to grant the token.
   *
   * however the main job upon the OAuth server
   * @param username player's username
   */
  export function serialize(username: string) {
    return build(
      // bit-pad ofuscator
      false,
      // protocol version
      u(7, proto),
      // username
      makeFixed(extract_str(username), 16 * 8),
      // validUntil
      u(42, Date.now())
    );
  }
  /**
   * once data is trustable, deserialize it
   * @param reader Data reader
   */
  export function deserialize(reader: Deserialization) {
    reader.b(); // left pad
    return {
      proto: reader.u(7),
      username: trimStartPad(reader.s(16)),
      expire: reader.u(42),
    };
  }
}

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
