import { BanIcon, UserIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type Props = {
  totaluser: number;
  activeuser: number;
  suspenduser: number;
  newuser: number;
};
export function SectionCards({
  totaluser,
  activeuser,
  suspenduser,
  newuser,
}: Props) {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total User</CardDescription>

          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totaluser}
          </CardTitle>

          <UserIcon className="absolute right-4 top-4 text-muted-foreground" />
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {activeuser}
          </CardTitle>
          <UsersIcon className="absolute right-4 top-4 text-muted-foreground" />
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Suspended Accounts</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {suspenduser}
          </CardTitle>
          <BanIcon className="absolute right-4 top-4 text-muted-foreground" />
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>New Users</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {newuser}
          </CardTitle>
          <UserPlusIcon className="absolute right-4 top-4 text-muted-foreground" />
        </CardHeader>
      </Card>
    </div>
  );
}
