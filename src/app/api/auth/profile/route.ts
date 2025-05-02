import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSessionUnified } from "@/lib/getServerSessionUnified";

type User = {
  name: string;
  password?: string;
  email: string;
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

    if (data.password && data.newpassword) {
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
