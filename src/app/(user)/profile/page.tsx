import React from "react";
import Profileedit from "./components/form";
import { prisma } from "@/lib/prisma";
import { getServerSessionUnified } from "@/lib/getServerSessionUnified";
import { redirect } from "next/navigation";

export default async function Profilepage() {
  const session = await getServerSessionUnified();

  if (!session) {
    redirect("/login");
  }

  // Fetch user from DB using email from session
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      twoFaEnabled: true,
    }, // Don't fetch password!
  });

  const defaultUser = {
    id: "",
    name: "Guest",
    email: "N/A",
    twoFaEnabled: false,
  };

  return <Profileedit user={user || defaultUser} />;
}
