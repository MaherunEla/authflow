import { getServerSessionUnified } from "@/lib/getServerSessionUnified";
import { logout } from "@/lib/lib";

import Link from "next/link";
import React from "react";
import { MobileMenu } from "./MobileMenu";

export default async function Navbar() {
  const session = await getServerSessionUnified();
  // console.log(session?.source);
  console.log(session);
  //const session = await getSession();

  return (
    <header className="flex items-center justify-between py-4 md:py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 text-2xl font-bold text-black md:text-3xl"
        aria-label="logo"
      >
        <svg
          width="95"
          height="94"
          viewBox="0 0 95 94"
          className="h-auto w-6 text-indigo-500"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M96 0V47L48 94H0V47L48 0H96Z" />
        </svg>
        AuthFlow
      </Link>

      <div className="-ml-8 hidden flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
        {session?.user ? (
          <Link
            href="/profile"
            className="inline-block rounded-lg px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:text-indigo-500 focus-visible:ring active:text-indigo-600 md:text-base cursor-pointer"
          >
            {session?.user?.name || session?.user?.email}
          </Link>
        ) : (
          <a
            href="/login"
            className="inline-block rounded-lg px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:text-indigo-500 focus-visible:ring active:text-indigo-600 md:text-base cursor-pointer"
          >
            Log in
          </a>
        )}

        {session ? (
          <form
            action={async () => {
              "use server";
              await logout();
            }}
          >
            <button
              type="submit"
              className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base cursor-pointer"
            >
              Log out
            </button>
          </form>
        ) : (
          <a
            href="/signup"
            className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base cursor-pointer"
          >
            Sign up
          </a>
        )}
      </div>
      <MobileMenu user={session?.user} />

      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    </header>
  );
}
