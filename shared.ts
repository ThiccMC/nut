import pkgjson from "./package.json";
import { build, u } from "serdebin/helper";
import { Deserialization, extract_str, makeFixed } from "serdebin";
import { trimStartPad } from "./utils/bytewise";

const proto = pkgjson.proto;

/**
 * To keep long number remain compact, binary is used.
 *
 * Unfortunaltely, you have to copy the size from serialize function to deserialize function.
 * There is no automation
 *
 * Example, current time in UNIX is 13 character, but under number bit level, it only cost 5 and 1/4 byte.
 * 
 * > ### This module is safe to share.
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
