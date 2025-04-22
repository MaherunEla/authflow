import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type Props = {
  User: {
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
  const handlelockaccount = async () => {
    try {
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

          <DropdownMenuItem onClick={handlelockaccount}>
            Unlock Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlelockaccount}>
            Force Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
