import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { EmailAlreadyExistsError, ValidationError } from "./errors/AuthErrors";

export async function signupUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  if (!name || !email || !password)
    throw new ValidationError("Name, email and password are required");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new EmailAlreadyExistsError();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, provider: "custom_jwt" },
  });

  return newUser;
}
