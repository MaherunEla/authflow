import jwt from "jsonwebtoken";

const TEMP_SECRET = process.env.TEMP_SECRET!;

type TempTokenPayload = {
  userId: string;
  exp: number;
  iat: number;
};
export function createTempToken(userId: string) {
  if (!userId) {
    throw new Error("Cannot create temp token: userId is undefined or null");
  }

  return jwt.sign({ userId }, TEMP_SECRET, { expiresIn: "5m" });
}

export function verifyTempToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, TEMP_SECRET) as TempTokenPayload;
    return payload.userId ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
