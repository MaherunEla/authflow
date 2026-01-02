import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function signupUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  if (!name || !email || !password) throw new Error("VALIDATION_ERROR");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("EMAIL_EXISTS");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, provider: "custom_jwt" },
  });

  return newUser;
}
