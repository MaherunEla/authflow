import { SectionCards } from "../components/section-card";
import { SiteHeader } from "../components/site-header";

import UserTable from "../components/usertable";
import { getUserFromDB } from "@/lib/getUserFromDB";
import { getcarddata } from "@/lib/carddata";

export type Role = "ADMIN" | "USER" | "GUEST";
export type TableUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  twoFaEnabled: boolean;
  lastLoginAt: string;
};

export default async function Home() {
  const users = await getUserFromDB();
  const userdata: TableUser[] = users.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    role: e.role,
    status: e.status,
    twoFaEnabled: e.twoFaEnabled,
    lastLoginAt: e.lastLoginAt ? e.lastLoginAt.toISOString() : "",
  }));

  const data = await getcarddata();

  return (
    <>
      <SiteHeader header={"User management"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              totaluser={data.totaluser}
              activeuser={data.activeuser}
              suspenduser={data.suspenduser}
              newuser={data.newuser}
            />
          </div>

          <div id="print-section">
            <UserTable data={userdata} />
          </div>
        </div>
      </div>
    </>
  );
}
