import { getServerSessionUnified } from "@/lib/getServerSessionUnified";
import { prisma } from "@/lib/prisma";
import { AdminActionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSessionUnified();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).id;

    const { status, action, source, ...updatedData } = await req.json();

    let actiontype: AdminActionType = "UPDATE_USER_STATUS";

    if (action === "lock") {
      if (source === "USER_MANAGEMENT") {
        actiontype = "UPDATE_USER_STATUS";
      } else if (source === "FAILED_LOGIN" && status === "ACTIVE") {
        actiontype = "UNLOCK_ACCOUNT";
      } else {
        actiontype = "LOCK_ACCOUNT";
      }

      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: { status },
      });

      await prisma.adminActionLog.create({
        data: {
          adminId: session.user.id,
          actionTargetType: source || "USER_MANAGEMENT",
          targetId: userId,
          actionType: actiontype,
          notes: "User account action performed",
        },
      });
      return NextResponse.json(updateUser);
    } else {
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });
      return NextResponse.json(updateUser);
    }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSessionUnified();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (await params).id;

    const logsCount = await prisma.adminActionLog.count({
      where: { adminId: userId },
    });

    if (logsCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete admin with existing action logs.",
        },
        { status: 400 }
      );
    }

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
