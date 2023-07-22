/**
 * second-level timming *(cacheless)*
 * 
 * please store at `32` bit in *`unsigned interger`*
 * @returns current second in *unix* timestamp `floor(unix/1000)`
 */
export function nowSec() {
  return Math.floor(Date.now() / 1000);
}
