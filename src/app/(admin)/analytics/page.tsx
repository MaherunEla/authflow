import { SiteHeader } from "../components/site-header";
import NewUserTable, { newuser } from "./components/newusertable";
import { getnewuserdata } from "@/lib/newusertable";
import UserBarChart from "./components/userbarchart";

const page = async () => {
  const newuser = await getnewuserdata();
  const newuserdata: newuser[] = newuser.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt ? user.createdAt.toISOString() : "Unknown",
    role: user.role,
    status: user.status,
  }));

  return (
    <>
      <SiteHeader header="Analytics" />
      <div className="flex flex-1 flex-col ">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <h2 className="text-xl font-bold p-6">
            User Registrations (Last 7 Days)
          </h2>
          <UserBarChart />
          <h2 className="text-xl font-bold p-8">
            New Users Table (Recent 10-15)
          </h2>
          <NewUserTable data={newuserdata} />
        </div>
      </div>
    </>
  );
};

export default page;
