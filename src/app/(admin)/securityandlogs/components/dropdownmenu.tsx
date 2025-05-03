import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    attempts: number;
    lastattempt: string;
    ipaddress: string;
    location: string;
    status: string;
  };
};

export function DropDownMenu({ user }: Props) {
  const router = useRouter();
  console.log(user.id);
  const handlelockaccount = async () => {
    try {
      const res = await axios.patch(`/api/admin/users/${user.id}`, {
        status: "LOCKED",
        action: "lock",
        source: "FAILED_LOGIN",
      });
      console.log(res);
      toast("User account successfully locked.");
      router.refresh();
    } catch (error) {
      console.error("lockaccount error", error);
    }
  };
  const handleunlockaccount = async () => {
    try {
      const res = await axios.patch(`/api/admin/users/${user.id}`, {
        status: "ACTIVE",
        action: "lock",
        source: "FAILED_LOGIN",
      });
      console.log(res);
      toast("User account has been unlocked.");
      router.refresh();
    } catch (error) {
      console.error("lockaccount error", error);
    }
  };
  const handforcelogout = async () => {
    try {
      const res = await axios.delete("/api/suspend-user", {
        data: {
          id: user.id,
          actionTargetType: "FAILED_LOGIN",
          notes: "Multiple failed attempts",
        },
      });
      console.log(res);
      toast("User has been logged out.");
      router.refresh();
    } catch (error) {
      console.error("lockaccount error", error);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlelockaccount}>
            Lock Account
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleunlockaccount}>
            Unlock Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handforcelogout}>
            Force Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
