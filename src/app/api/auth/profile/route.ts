import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSessionUnified } from "@/lib/getServerSessionUnified";
import { Role } from "@prisma/client";

type User = {
  name: string;
  password?: string;
  email: string;
  role?: Role;
  twoFaEnabled: boolean;
  twoFaSecret?: string | null;
};

export const PUT = async (req: Request) => {
  try {
    const data = await req.json();
    const session = await getServerSessionUnified();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData: User = {
      name: data.name,
      email: data.email,
      twoFaEnabled: data.twoFaEnabled,
    };

    if (data.newpassword && session.user.role === "GUEST") {
      const hashedPassword = await bcrypt.hash(data.newpassword, 10);

      updateData.password = hashedPassword;
      updateData.role = "USER";
    }

    if (data.password && data.newpassword && data.role !== "GUEST") {
      const user = await prisma.user.findUnique({
        where: {
          id: session?.user?.id as string,
        },
      });
      if (!user?.password) {
        return NextResponse.json(
          { error: "User password not found" },
          { status: 400 }
        );
      }

      const passwordMatch = await bcrypt.compare(data.password, user?.password);

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Old password is incorrect" },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(data.newpassword, 10);
    }
    if (!data.twoFaEnabled) {
      updateData.twoFaSecret = null;
    }

    const updateuser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json(updateuser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.error();
  }
};
