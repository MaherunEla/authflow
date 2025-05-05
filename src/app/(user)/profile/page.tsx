import React from "react";
import Profileedit from "./components/form";
import { getServerSessionUnified } from "@/lib/getServerSessionUnified";
import { redirect } from "next/navigation";
import { getprofiledata } from "@/lib/profiledata";
import { Role } from "@prisma/client";

export default async function Profilepage() {
  const session = await getServerSessionUnified();
  if (!session) {
    redirect("/login");
  }

  const user = await getprofiledata();
  let userdata;
  if (user) {
    userdata = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      twoFaEnabled: user.twoFaEnabled,
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : "",
    };
  } else {
    userdata = {
      id: "",
      name: session.user.name || "",
      email: session.user.email || "",
      twoFaEnabled: false,
      role: Role.GUEST,
      updatedAt: "",
    };
  }

  return <Profileedit user={userdata} />;
}
