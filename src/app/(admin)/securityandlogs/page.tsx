import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import UserLoginTable, { userlogin } from "./components/userlogintable";
import FailedLoginTable, { userfaillogin } from "./components/failedlogintable";
import SuspiciousTable, { suspiciousUser } from "./components/suspicioustable";

const dummyUsers: userlogin[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    lastlogin: "",
    ipaddress: "",
    location: "",
    device: "",
  },
  {
    id: "2",
    name: "Alice",
    email: "alice@example.com",
    lastlogin: "",
    ipaddress: "",
    location: "",
    device: "",
  },
];

const failedUsers: userfaillogin[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    attempts: "",
    lastattempt: "",
    ipaddress: "",
    location: "",
  },
  {
    id: "2",
    name: "Alice",
    email: "alice@example.com",
    attempts: "",
    lastattempt: "",
    ipaddress: "",
    location: "",
  },
];

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
const page = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader header="Security & Logs" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <h2 className="text-xl font-bold p-8">User Login Activity</h2>
            <UserLoginTable data={dummyUsers} />
            <h2 className="text-xl font-bold p-8">Failed Login Attempts</h2>
            <FailedLoginTable data={failedUsers} />
            <h2 className="text-xl font-bold p-8"> Suspicious Activity</h2>
            <SuspiciousTable data={SuspiciouseUsers} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default page;
