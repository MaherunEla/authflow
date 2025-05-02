"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";

import { useState } from "react";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    twoFaEnabled: boolean;
  };
};

export const userformSchema = z.object({
  name: z.string().min(3, { message: "name is require" }).optional(),
  email: z.string().email({ message: "Invalid Email address" }).optional(),
  role: z.enum(["ADMIN", "USER", "GUEST"]).optional(),
});

export type FormValues = z.infer<typeof userformSchema>;

export function DropDownMenu({ user }: Props) {
  //const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const form = useForm<FormValues>({
    defaultValues: async () => {
      if (user) {
        return {
          name: user.name,
          email: user.email,
          role: user.role as "ADMIN" | "USER" | "GUEST",
        };
      }
      return {
        name: "",
        email: "",
        role: "USER",
      };
    },
    resolver: zodResolver(userformSchema),
  });

  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted", data);
    try {
      const res = await axios.patch(`/api/admin/users/${user.id}`, data);
      console.log(res);
      toast("User updated successfully.");
      router.refresh();
    } catch (error) {
      console.error("Update error", error);
    }
  };

  const handleStatus = async () => {
    try {
      const res = await axios.patch(`/api/admin/users/${user.id}`, {
        status: "ACTIVE",
        action: "lock",
        source: "USER_MANAGEMENT",
      });
      console.log(res);
      toast("User Status updated successfully.");
      router.refresh();
    } catch (error) {
      console.error("Update error", error);
    }
  };

  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [warnReason, setWarnReason] = useState("");

  const [SuspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmWarn = async () => {
    console.log("Warn reason", warnReason);

    try {
      const res = await axios.post("/api/warn-user", {
        email: user.email,
        reason: warnReason,
      });
      console.log(res);
      toast("User has been warned.");
      router.refresh();
    } catch (error) {
      console.error("warn error", error);
    }

    setWarnDialogOpen(false);
  };

  const handleConfirmSuspend = async () => {
    console.log("Suspend reason", suspendReason);
    try {
      const res = await axios.post("/api/suspend-user", {
        email: user.email,
        reason: suspendReason,
      });
      console.log(res);
      toast("Suspension successful. They can no longer log in.");
      router.refresh();
    } catch (error) {
      console.error("Suspend error", error);
    }

    setSuspendDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(`/api/admin/users/${user.id}`);
      console.log(res);
      toast("User deleted", {
        description: "This action cannot be undone.",
      });
    } catch (error) {
      console.error("user Delete error", error);
    }

    setDeleteDialogOpen(false);
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={handleStatus}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWarnDialogOpen(true)}>
                  Warned
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setSuspendDialogOpen(true)}>
                  Suspended
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={warnDialogOpen} onOpenChange={setWarnDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Warn User</DialogTitle>
            <DialogDescription>
              Please provide a reason for warning the user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warnReason" className="text-right">
                Reason
              </Label>
              <Input
                id="warnReason"
                value={warnReason}
                className="col-span-3"
                onChange={(e) => setWarnReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmWarn}>Confirm Warn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={SuspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Please provide a reason for Suspend the user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warnReason" className="text-right">
                Reason
              </Label>
              <Input
                id="suspendReason"
                value={suspendReason}
                className="col-span-3"
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmSuspend}>Confirm Suspend</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to User Information. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" {...register("name")} className="col-span-3" />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 ">{errors.name.message}</p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" {...register("email")} className="col-span-3" />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 ">{errors.email.message}</p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {["ADMIN", "USER", "GUEST"].map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.role && (
              <p className="text-sm text-red-500 ml-[25%]">
                {errors.role.message}
              </p>
            )}
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>

            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
