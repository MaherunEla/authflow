"use client";
import {
  LayoutDashboardIcon,
  Fingerprint,
  UsersIcon,
  ChartNoAxesCombined,
  FolderLock,
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

// Menu items.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "User Management",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Security & Logs",
      url: "#",
      icon: FolderLock,
    },
    {
      title: "Authentication",
      url: "#",
      icon: Fingerprint,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartNoAxesCombined,
    },
  ],
};

export function AppSidebar() {
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
