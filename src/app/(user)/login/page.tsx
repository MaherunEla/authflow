import { redirect } from "next/navigation";
import { login } from "@/lib/lib";

import { cookies, headers } from "next/headers";
import Sociallogin from "../components/shared/sociallogin";
import { use } from "react";
import FingerprintField from "../components/shared/FingerprintField";
import { getServerSessionUnified } from "@/lib/getServerSessionUnified";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { step, userId, error } = use(searchParams);

  const finalStep = step || "credentials";
  const finalUserId = userId || "";
  const finalError = error || "";
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
          Login
        </h2>
        <div className="mx-auto max-w-lg rounded-lg border">
          <form
            action={async (formData) => {
              "use server";
              const headersList = await headers();
              const userAgent = headersList.get("user-agent") || "";
              const ip = headersList.get("x-forwarded-for") || "unknown";
              const result = await login(formData, { userAgent, ip });

              if (result?.error) {
                redirect(
                  `/login?step=${formData.get("step")}&userId=${
                    formData.get("userId") || " "
                  }&error=${encodeURIComponent(result.error)}`
                );
              }

              if (result?.requires2FA) {
                redirect(`/login?step=2fa&userId=${result.userId}`);
              }

              if (result?.custom_jwt) {
                const cookieStore = await cookies();
                cookieStore.set("custom_jwt", result.custom_jwt, {
                  httpOnly: true,
                });
                const session = await getServerSessionUnified();
                if (session?.user?.role === "ADMIN") {
                  redirect("/dashboard");
                } else {
                  redirect("/");
                }
              }
            }}
          >
            <div className="flex flex-col gap-4 p-4 md:p-8">
              {finalStep === "2fa" ? (
                <>
                  <input type="hidden" name="step" value="2fa" />
                  <input type="hidden" name="userId" value={finalUserId} />
                  <label className="mb-2 inline-block text-sm text-gray-800 sm:text-sm ">
                    Enter 6-digit Code
                  </label>

                  <input
                    name="token"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-400"
                  />
                </>
              ) : (
                <>
                  <div>
                    <input type="hidden" name="step" value="credentials" />
                    <label
                      htmlFor="email"
                      className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                    >
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                    >
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                  </div>
                  <FingerprintField />
                  {finalError && (
                    <p className="text-red-500">
                      {decodeURIComponent(finalError)}
                    </p>
                  )}
                </>
              )}

              <button
                type="submit"
                className="block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base cursor-pointer"
              >
                {step === "2fa" ? "Verify Code" : "Log in"}
              </button>
            </div>
          </form>
          <Sociallogin />

          <div className="flex items-center justify-center bg-gray-100 p-4">
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700 cursor-pointer"
              >
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
