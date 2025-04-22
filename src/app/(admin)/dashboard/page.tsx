import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SectionCards } from "../components/section-card";
import { SiteHeader } from "../components/site-header";
import { AppSidebar } from "../components/app-sidebar";
import UserTable from "../components/usertable";
import { getUserFromDB } from "@/lib/getUserFromDB";
export type Role = "ADMIN" | "USER" | "GUEST";
export type TableUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  twoFaEnabled: boolean;
};

export default async function Home() {
  const users: TableUser[] = await getUserFromDB();
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader header={"User management"} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
            </div>
            <UserTable data={users} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
