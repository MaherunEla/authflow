"use server";

import { logout } from "@/lib/lib";

export async function logoutAction() {
  await logout();
}
