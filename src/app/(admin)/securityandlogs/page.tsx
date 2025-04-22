import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import UserLoginTable, { userlogin } from "./components/userlogintable";
import FailedLoginTable, { userfaillogin } from "./components/failedlogintable";
import SuspiciousTable, { suspiciousUser } from "./components/suspicioustable";
import { recentLoginActivity } from "@/lib/recentLoginActivity";
import { failedLogin } from "@/lib/failedLogin";

const SuspiciouseUsers: suspiciousUser[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    activitytype: "",
    time: "",
    ipaddress: "",
    location: "",
    action: "",
  },
  {
    id: "2",
    name: "Alice",
    email: "alice@example.com",
    activitytype: "",
    time: "",
    ipaddress: "",
    location: "",
    action: "",
  },
];
const page = async () => {
  const users = await recentLoginActivity();
  const recentuser: userlogin[] = users.map((user) => ({
    id: user.user.id,
    name: user.user.name,
    email: user.user.email,
    lastlogin: user.user.lastLoginAt
      ? user.user.lastLoginAt.toISOString()
      : "Unknown",
    ipaddress: user.ip,
    location: user.location || "",
    device: user.device?.name || "",
  }));
  const failedattempt: userfaillogin[] = await failedLogin();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader header="Security & Logs" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <h2 className="text-xl font-bold p-8">User Login Activity</h2>
            <UserLoginTable data={recentuser} />
            <h2 className="text-xl font-bold p-8">Failed Login Attempts</h2>
            <FailedLoginTable data={failedattempt} />
            <h2 className="text-xl font-bold p-8"> Suspicious Activity</h2>
            <SuspiciousTable data={SuspiciouseUsers} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default page;
