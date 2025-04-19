import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SectionCards } from "../components/section-card";
import { SiteHeader } from "../components/site-header";
import { AppSidebar } from "../components/app-sidebar";
import UserTable from "../components/usertable";
export type Role = "ADMIN" | "USER" | "GUEST";
type TableUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  twofactor: string;
};

export default function Home() {
  const dummyUsers: TableUser[] = [
    {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      role: "ADMIN",
      status: "active",
      twofactor: "enable",
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@example.com",
      role: "USER",
      status: "active",
      twofactor: "enable",
    },
    {
      id: "3",
      name: "Carol",
      email: "carol@example.com",
      role: "GUEST",
      status: "suspend",
      twofactor: "disable",
    },
  ];
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
            <UserTable data={dummyUsers} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
