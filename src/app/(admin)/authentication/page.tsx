import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import TwoFaTable, { twofatable } from "./components/2fatable";

const testData: twofatable[] = [
  {
    id: "1",
    name: "Ela",
    email: "hello@gmail.com",
    twofaenabled: "yes",
    lastupdated: "",
    actions: "",
  },
  {
    id: "2",
    name: "Ela",
    email: "hello2@gmail.com",
    twofaenabled: "yes",
    lastupdated: "",
    actions: "",
  },
];

const page = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader header="Session & Authentication Management" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <h2 className="text-xl font-bold p-8">Active Sessions Table</h2>
            <h2 className="text-xl font-bold p-8">2FA Status Table</h2>
            <TwoFaTable data={testData} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default page;
