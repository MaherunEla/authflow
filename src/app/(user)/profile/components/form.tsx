"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    twoFaEnabled: boolean;
    updatedAt: string;
  };
};

const profileformSchema = z
  .object({
    name: z.string().min(3, { message: "name is require" }).optional(),
    email: z.string().email({ message: "Invalid Email address" }).optional(),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "Password must be at least 8 characters",
      }),

    newpassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "New Password must be at least 8 characters",
      }),
    confirmnewpassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "Confirm Password must be at least 8 characters",
      }),
    twoFaEnabled: z.boolean(),
  })
  .refine((data) => data.newpassword === data.confirmnewpassword, {
    path: ["confirmnewpassword"],
    message: "New Passwords do not match",
  });

type FormValues = z.infer<typeof profileformSchema>;

const Profileedit = ({ user }: Props) => {
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: async () => {
      if (user) {
        return {
          name: user.name,
          email: user.email,
          password: "",
          role: user.role,
          twoFaEnabled: user.twoFaEnabled ?? false,
        };
      }
      return {
        name: "",
        email: "",
        password: "",
        role: Role.GUEST,
        twoFaEnabled: false,
      };
    },
    resolver: zodResolver(profileformSchema),
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted", data);
    try {
      const res = await axios.put("/api/auth/profile", data);
      console.log({ res });
      toast("Profile has been updated.");
      router.refresh();
      reset({
        password: "",
        newpassword: "",
        confirmnewpassword: "",
      });
    } catch (errors) {
      if (axios.isAxiosError(errors)) {
        console.error("Profile error", errors);
      } else {
        console.error("Unexpected error", errors);
      }
    }
  };

  const handleClick = () => {
    if (user.role === "GUEST") {
      setShowDialog(true);
    } else {
      router.push(`/twofa/${user.id}`);
    }
  };
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Profile Setting
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2  mb-10"
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message as string}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Email
            </label>
            <input
              {...register("email")}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>
          {errors.email && (
            <p className="text-red-600">{errors.email.message as string}</p>
          )}
          {user.role !== "GUEST" && (
            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Current Password
              </label>
              <input
                {...register("password")}
                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {errors.password && (
                <p className="text-red-600">
                  {errors.password.message as string}
                </p>
              )}
            </div>
          )}

          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              New Password
            </label>
            <input
              {...register("newpassword")}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>
          {errors.newpassword && (
            <p className="text-red-600">
              {errors.newpassword.message as string}
            </p>
          )}
          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Confirm NewPassword
            </label>
            <input
              {...register("confirmnewpassword")}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>
          {errors.confirmnewpassword && (
            <p className="text-red-600">
              {errors.confirmnewpassword.message as string}
            </p>
          )}
          {user.twoFaEnabled ? (
            <div className="sm:col-span-2">
              <label
                htmlFor="2fa"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                2FA
              </label>
              <Controller
                name="twoFaEnabled"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(val === "enable")}
                    value={field.value ? "enable" : "disable"}
                  >
                    <SelectTrigger className="w-full min-h-[42px] rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring">
                      <SelectValue placeholder="2FA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enable">Enable</SelectItem>
                      <SelectItem value="disable">Disable</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          ) : (
            <></>
          )}

          <div className="flex items-center justify-between sm:col-span-2">
            <button className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base cursor-pointer">
              Update Setting
            </button>
            <span className="text-sm text-gray-500">
              updated{" "}
              <span className="p-2">{user.updatedAt.split("T")[0]}</span>
            </span>
          </div>
        </form>

        <div className="mb-10 md:mb-10 py-4 ">
          <h2 className="text-center text-2xl font-bold text-gray-800  lg:text-3xl">
            Security Setting
          </h2>
        </div>
        <div className="mx-auto max-w-screen-md gap-2 flex flex-col border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="mb-4  text-xl font-semibold text-gray-800 md:mb-6 lg:text-2xl">
            🔐 Two-Factor Authentication
          </h3>
          <p className="text-base font-medium lg:text-lg text-gray-600">
            Add an extra layer of security to your account. Your two factor
            authentication is {user.twoFaEnabled ? "Enabled" : "not Enabled"}.{" "}
            <span
              className="ml-2 text-gray-400 cursor-help"
              title="2FA helps protect your account even if your password is compromised."
            >
              ℹ️
            </span>
          </p>

          {!user.twoFaEnabled && (
            <Button
              variant="link"
              className="text-base font-bold text-blue-600 lg:text-xl cursor-pointer "
              onClick={handleClick}
            >
              → Manage Two-Factor Authentication
            </Button>
          )}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set a password first</DialogTitle>
                <p className="text-sm text-gay-600">
                  To enable Two-Factor Authentication, please update you profile
                  with a password first.
                </p>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Profileedit;
