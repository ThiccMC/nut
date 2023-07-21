import { Deserialization } from "serdebin";
import { en8, de8 } from "serdebin/helper";
import { joinu8a } from "./bytewise";

export default class Engine {
  private privateKey: Uint8Array;
  readonly hasher = new Bun.CryptoHasher("sha256");
  constructor(pk: string) {
    this.privateKey = en8(pk);
  }
  private mac(v: Uint8Array | string) {
    if (typeof v == "string") v = en8(v);
    return this.hasher
      .update(joinu8a(v, this.privateKey))
      .digest("base64")
      .replaceAll("=", "");
  }
  sign(d: Uint8Array) {
    const s = de8(d);
    return btoa(s).replaceAll("=", "") + "." + this.mac(s);
  }
  verify(hash: string): Deserialization | null {
    const [v, sign] = hash.split("."),
      a = atob(v);
    return sign === this.mac(a) ? new Deserialization(en8(a)) : null;
  }
}
