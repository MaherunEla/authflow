"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    type: string;
    createdAt: string;
    ip: string;
    location: string;
    actionTaken: string;
    userId: string;
  };
};

export function DropDownMenu({ user }: Props) {
  const router = useRouter();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertReason, setAlertReason] = useState(
    "We noticed unusual activity on your account, such as a login from a new device or a change in your location/IP address."
  );

  console.log(user.id);
  const handlelockaccount = async () => {
    try {
      const res = await axios.patch(`/api/admin/users/${user.userId}`, {
        status: "LOCKED",
        action: "lock",
        source: "SUSPICIOUS_ACTIVITY",
      });
      console.log(res);
      toast("User account successfully locked.");

      router.refresh();
    } catch (error) {
      console.error("lockaccount error", error);
    }
  };

  const handforcelogout = async () => {
    try {
      const res = await axios.delete("/api/suspend-user", {
        data: {
          id: user.userId,
          tableid: user.id,
          actionTargetType: "SUSPICIOUS_ACTIVITY",
          notes: "new device or location/IP address change",
        },
      });
      console.log(res);
      toast("User has been logged out.");
      router.refresh();
    } catch (error) {
      console.error("lockaccount error", error);
    }
  };

  const handleConfirmAlert = async () => {
    console.log("alert reason", alertReason);

    try {
      const res = await axios.post("/api/alert", {
        id: user.id,
        email: user.email,
        alert: alertReason,
      });
      console.log(res);
      toast("Alert has been sent successfully.");
      router.refresh();
    } catch (error) {
      console.error("warn error", error);
    }

    setAlertDialogOpen(false);
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
          <DropdownMenuItem onClick={handleConfirmAlert}>
            Send Alert
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handforcelogout}>
            Force Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alert User</DialogTitle>
            <DialogDescription>
              Please provide a reason for alert user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertReason" className="text-right">
                Reason
              </Label>
              <Input
                id="alertReason"
                value={alertReason}
                className="col-span-3"
                onChange={(e) => setAlertReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmAlert}>Confirm Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
