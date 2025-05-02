import React from "react";
import { SiteHeader } from "../components/site-header";
import TwoFaTable, { twofatable } from "./components/2fatable";
import { gettwofatabledata } from "@/lib/twofatabledata";

const page = async () => {
  const twofatable: twofatable[] = await gettwofatabledata();
  return (
    <>
      <SiteHeader header="Authentication Management" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <h2 className="text-xl font-bold p-8">2FA Status Table</h2>
          <TwoFaTable data={twofatable} />
        </div>
      </div>
    </>
  );
};

export default page;
