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
type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    twofactor: string;
  };
};

export const userformSchema = z.object({
  name: z.string().min(3, { message: "name is require" }).optional(),
  email: z.string().email({ message: "Invalid Email address" }).optional(),
  role: z.enum(["ADMIN", "USER", "GUEST"]).optional(),
});

export type FormValues = z.infer<typeof userformSchema>;

export function DropDownMenu({ user }: Props) {
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

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted", data);
  };

  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [warnReason, setWarnReason] = useState("");

  const [SuspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleConfirmWarn = () => {
    console.log("Warn reason", warnReason);

    setWarnDialogOpen(false);
  };

  const handleConfirmSuspend = () => {
    console.log("Warn reason", suspendReason);

    setSuspendDialogOpen(false);
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
                <DropdownMenuItem>Active</DropdownMenuItem>
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
          <DropdownMenuItem>Delete</DropdownMenuItem>
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
                value={warnReason}
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
    </>
  );
}
