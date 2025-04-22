import { getServerSessionUnified } from "@/lib/getServerSessionUnified";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSessionUnified();

    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const userId = params.id;

    // const { name, email, role } = await req.json();
    const data = await req.json();

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: data,
    });
    return NextResponse.json(updateUser);
  } catch (error) {
    console.error("update error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSessionUnified();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = params.id;

    const Deleteuser = await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json(Deleteuser);
  } catch (error) {
    console.error("Delete user error ", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
