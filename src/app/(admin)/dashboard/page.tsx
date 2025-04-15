import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SectionCards } from "../components/section-card";
import { SiteHeader } from "../components/site-header";
import { AppSidebar } from "../components/app-sidebar";
import UserTable from "../components/usertable";

export default function Home() {
  const dummyUsers = [
    {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      role: "admin",
      status: "active",
      twofactor: "enable",
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@example.com",
      role: "user",
      status: "active",
      twofactor: "enable",
    },
    {
      id: "3",
      name: "Carol",
      email: "carol@example.com",
      role: "moderator",
      status: "suspend",
      twofactor: "disable",
    },
  ];
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
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
