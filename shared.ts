import pkgjson from "./package.json";
import { build, u } from "serdebin/helper";
import { Deserialization, extract_str, makeFixed } from "serdebin";
import { trimStartPad } from "./utils/bytewise";
import { nowSec } from "./utils/momentum";

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
   * Are we mix apps token with user token? yes
   */
  export enum Scope {
    Full = 3, // Full
    /**
     * Generated
     */
    Interact = 2, // Allow user-like interaction and user-data modification
    UserSpecific = 1, // Allow to access userdata that is private-able: Email/Discord
    Global = 0, // Least
  }
  /**
   * swarmer have anility to grant the token.
   *
   * however the main job upon the OAuth server
   * @param username player's username
   */
  export function serialize(
    username: string,
    scope = Scope.Full,
    expire = 0,
    pfid?: number
  ) {
    return build(
      // bit-pad ofuscator
      false,
      // protocol version
      u(10, proto),
      // scope: `protocol.Scope`
      u(2, scope),
      // username
      makeFixed(extract_str(username), 16 * 8),
      // validUntil
      u(32, nowSec()),
      // check pfid
      Boolean(pfid),
      // profile id
      (scope > 2 && pfid && u(32, pfid)) || false
    );
  }
  /**
   * once data is trustable, deserialize it
   * @param reader Data reader
   */
  export function deserialize(reader: Deserialization) {
    reader.b(); // left pad
    const proto = reader.u(10),
      scope = Scope[reader.u(2)],
      username = trimStartPad(reader.s(16)),
      expire = reader.u(32),
      profileId = reader.b() && reader.u(32);
    return { proto, scope, username, expire, profileId };
  }
}
