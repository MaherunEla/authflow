"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { logoutAction } from "./Logoutaction";

type Props = {
  user?: {
    id: string;
    email?: string;
    name?: string;
    role?: string;
    twoFaEnabled?: boolean;
  };
};

export function MobileMenu({ user }: Props) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-2.5 py-2 text-sm font-semibold text-gray-500 ring-indigo-300 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Menu
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="lg:hidden">
          <DropdownMenuItem>
            {user ? (
              <Link
                href="/profile"
                className="text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:text-indigo-500 focus-visible:ring active:text-indigo-600 md:text-base"
              >
                {user?.name || user?.email}
              </Link>
            ) : (
              <a
                href="/login"
                className="inline-block rounded-lg text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:text-indigo-500 focus-visible:ring active:text-indigo-600 md:text-base"
              >
                Log in
              </a>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="lg:hidden">
            {user ? (
              <form action={logoutAction}>
                <button type="submit" className="cursor-pointer">
                  Log out
                </button>
              </form>
            ) : (
              <a
                href="/signup"
                className="inline-block  text-center text-sm font-semibold text-gray-500 outline-none md:text-base"
              >
                Sign up
              </a>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
