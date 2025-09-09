import { randomBytes } from "crypto";

export function generateId(): string {
  return randomBytes(6).toString("hex");
}
