import { sha256 } from "./digest";

export function saltcheck(phPwd: string, hashd: string): boolean {
  // $SHA$salt$hash, where hash := sha256(sha256(password) . salt)
  // somehow this thing might work
  const [_, __, salt, salten] = hashd.split("$");
  return sha256(phPwd + salt) === salten;
}
