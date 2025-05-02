"use client";
import {
  LayoutDashboardIcon,
  Fingerprint,
  UsersIcon,
  ChartNoAxesCombined,
  FolderLock,
  House,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
interface AppSidebarProps {
  username: string;
  useremail: string;
}

export function AppSidebar({ username, useremail }: AppSidebarProps) {
  const data = {
    user: {
      name: username,
      email: useremail,
      avatar: "https://github.com/shadcn.png",
    },
    navMain: [
      {
        title: "User Management",
        url: "/dashboard",
        icon: UsersIcon,
      },
      {
        title: "Security & Logs",
        url: "/securityandlogs",
        icon: FolderLock,
      },
      {
        title: "Authentication",
        url: "/authentication",
        icon: Fingerprint,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: ChartNoAxesCombined,
      },
      {
        title: "Home",
        url: "/",
        icon: House,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <LayoutDashboardIcon className="h-6 w-6" />
                <span className="text-base font-semibold">Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarContent>
              <NavUser user={data.user} />
              <NavMain items={data.navMain} />
            </SidebarContent>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
