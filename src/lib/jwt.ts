import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

type CustomJWTPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
  twoFaEnabled: boolean;
  iat: number;
  exp: number;
};
export function createCustomJWT(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  twoFaEnabled: boolean;
}) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      twoFaEnabled: user.twoFaEnabled,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
}
export function verifyCustomJWT(token: string): CustomJWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
  } catch {
    return null;
  }
}
