import React from "react";
import { SiteHeader } from "../components/site-header";
import UserLoginTable, { userlogin } from "./components/userlogintable";
import FailedLoginTable, { userfaillogin } from "./components/failedlogintable";
import SuspiciousTable, { suspiciousUser } from "./components/suspicioustable";
import { recentLoginActivity } from "@/lib/recentLoginActivity";
import { failedLogin } from "@/lib/failedLogin";
import { getSuspiciousActivity } from "@/lib/getSuspiciousActivity";
import AuditTable, { audit } from "./components/audittable";
import { getAuditlog } from "@/lib/getAuditlog";

const page = async () => {
  const users = await recentLoginActivity();
  const recentuser: userlogin[] = users.map((user) => ({
    id: user.user.id,
    name: user.user.name,
    email: user.user.email,
    lastlogin: user.user.lastLoginAt
      ? user.user.lastLoginAt.toISOString()
      : "Unknown",
    ipaddress: user.ip,
    location: user.location || "",
    device: user.device?.name || "",
  }));
  const failedattempt: userfaillogin[] = await failedLogin();
  const SuspiciousUser = await getSuspiciousActivity();
  const SuspiciousUserData: suspiciousUser[] = SuspiciousUser.map(
    (SuspiciousUser) => ({
      id: SuspiciousUser.id,
      name: SuspiciousUser.user.name,
      email: SuspiciousUser.user.email,
      type: SuspiciousUser.type,
      createdAt: SuspiciousUser.createdAt
        ? SuspiciousUser.createdAt.toISOString()
        : "Unknown",
      ip: SuspiciousUser.ip || "",
      location: SuspiciousUser.location || "",
      actionTaken: SuspiciousUser.actionTaken || "",
      userId: SuspiciousUser.user.id || "",
    })
  );

  const adminaudit = await getAuditlog();
  const adminauditdata: audit[] = adminaudit.map((a) => ({
    id: a.id,
    adminId: a.adminId,
    adminemail: a.admin.email,
    actiontargettype: a.actionTargetType,
    targetId: a.targetId,
    actionType: a.actionType,
    notes: a.notes ?? "",
    time: a.createdAt ? a.createdAt.toISOString() : "Unknown",
  }));

  return (
    <>
      <SiteHeader header="Security & Logs" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <h2 className="text-xl font-bold p-8">User Login Activity</h2>
          <UserLoginTable data={recentuser} />
          <h2 className="text-xl font-bold p-8">Failed Login Attempts</h2>
          <FailedLoginTable data={failedattempt} />
          <h2 className="text-xl font-bold p-8"> Suspicious Activity</h2>
          <SuspiciousTable data={SuspiciousUserData} />
          <h2 className="text-xl font-bold p-8"> Audit Log</h2>
          <AuditTable data={adminauditdata} />
        </div>
      </div>
    </>
  );
};

export default page;
