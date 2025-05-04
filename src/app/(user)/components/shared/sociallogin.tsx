"use client";
import { signIn } from "next-auth/react";
import React from "react";

const Sociallogin = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="relative flex items-center justify-center">
        <span className="absolute inset-x-0 h-px bg-gray-300"></span>
        <span className="relative bg-white px-4 text-sm text-gray-400">
          Log in with social
        </span>
      </div>

      <button
        onClick={() => signIn("github")}
        className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-800 focus-visible:ring active:bg-gray-700 md:text-base cursor-pointer"
      >
        <svg
          className="h-5 w-5 shrink-0"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0.296875C5.37255 0.296875 0 5.69336 0 12.3516C0 17.7656 3.43877 22.291 8.2075 23.8125C8.80782 23.9219 9.0275 23.5625 9.0275 23.2578C9.0275 22.9844 9.01637 22.1797 9.01157 21.1797C5.67187 21.9609 4.96832 19.4922 4.96832 19.4922C4.42207 18.1328 3.67187 17.7734 3.67187 17.7734C2.61001 17.0703 3.75194 17.0859 3.75194 17.0859C4.9225 17.1719 5.53063 18.2969 5.53063 18.2969C6.57845 20.1406 8.31157 19.6016 9.025 19.2734C9.13394 18.4766 9.44875 17.9297 9.7925 17.6406C7.14363 17.3516 4.34363 16.3125 4.34363 11.7656C4.34363 10.4766 4.77563 9.39844 5.48482 8.57031C5.35332 8.28125 4.97832 7.0625 5.59482 5.42969C5.59482 5.42969 6.60907 5.11719 8.99313 6.57031C9.96187 6.29688 10.9997 6.16406 12.0325 6.15625C13.0653 6.16406 14.1031 6.29688 15.0719 6.57031C17.4559 5.11719 18.4691 5.42969 18.4691 5.42969C19.0865 7.0625 18.7115 8.28125 18.58 8.57031C19.2891 9.39844 19.7211 10.4766 19.7211 11.7656C19.7211 16.3281 16.9169 17.3438 14.2613 17.625C14.7116 17.9844 15.0947 18.6719 15.0947 19.6797C15.0947 21.1484 15.0782 22.5547 15.0782 23.2578C15.0782 23.5625 15.2979 23.9219 15.8982 23.8125C20.6669 22.291 24.1057 17.7656 24.1057 12.3516C24 5.69336 18.6275 0.296875 12 0.296875Z" />
        </svg>
        Continue with GitHub
      </button>

      <button
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-3 text-center text-sm font-semibold text-gray-800 outline-none ring-gray-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base cursor-pointer"
      >
        <svg
          className="h-5 w-5 shrink-0"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.7449 12.27C23.7449 11.48 23.6749 10.73 23.5549 10H12.2549V14.51H18.7249C18.4349 15.99 17.5849 17.24 16.3249 18.09V21.09H20.1849C22.4449 19 23.7449 15.92 23.7449 12.27Z"
            fill="#4285F4"
          />
          <path
            d="M12.2549 24C15.4949 24 18.2049 22.92 20.1849 21.09L16.3249 18.09C15.2449 18.81 13.8749 19.25 12.2549 19.25C9.12492 19.25 6.47492 17.14 5.52492 14.29H1.54492V17.38C3.51492 21.3 7.56492 24 12.2549 24Z"
            fill="#34A853"
          />
          <path
            d="M5.52488 14.29C5.27488 13.57 5.14488 12.8 5.14488 12C5.14488 11.2 5.28488 10.43 5.52488 9.71V6.62H1.54488C0.724882 8.24 0.254883 10.06 0.254883 12C0.254883 13.94 0.724882 15.76 1.54488 17.38L5.52488 14.29Z"
            fill="#FBBC05"
          />
          <path
            d="M12.2549 4.75C14.0249 4.75 15.6049 5.36 16.8549 6.55L20.2749 3.13C18.2049 1.19 15.4949 0 12.2549 0C7.56492 0 3.51492 2.7 1.54492 6.62L5.52492 9.71C6.47492 6.86 9.12492 4.75 12.2549 4.75Z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>
    </div>
  );
};

export default Sociallogin;
