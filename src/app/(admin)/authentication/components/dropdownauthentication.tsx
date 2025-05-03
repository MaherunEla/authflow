"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    twoFaEnabled: boolean;
  };
};
export function DropDownMenu({ user }: Props) {
  const router = useRouter();
  const id = user.id;
  const handleAction = async () => {
    try {
      const res = await axios.patch("/api/enable-2fa/reset", {
        id,
        actionTargetType: "AUTHENTICATION",
        notes: "2FA reset by admin due to user access loss.",
      });
      console.log(res);
      toast("Two-factor authentication reset completed successfully.");
      router.refresh();
    } catch (error) {
      console.error("Failed to resend setup email", error);
    }
  };

  return (
    <>
      {user.twoFaEnabled ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => handleAction()}>
              Resend
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Allow user to reconfigure their authenticator app</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <p></p>
      )}
    </>
  );
}
