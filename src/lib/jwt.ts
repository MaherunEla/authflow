import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

type TempTokenPayload = {
  userId: string;
  exp: number;
  iat: number;
};
export function createCustomJWT(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
export function verifyCustomJWT(token: string): string | null {
  try {
    return (jwt.verify(token, JWT_SECRET) as TempTokenPayload).userId;
  } catch {
    return null;
  }
}
