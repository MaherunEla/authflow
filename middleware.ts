import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/lib";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return await updateSession(request, response);
}

// import { NextRequest } from "next/server";
// import { getSession, updateSession } from "@/lib/lib";
// import { cookies } from "next/headers";
// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";

// export async function middleware(request: NextRequest) {
//   // const session = await getSession();
//   //  const cookieStore = await cookies();

//   // if (!session || new Date(session.expires) < new Date()) {
//   //   cookieStore.delete("custom_jwt");
//   //   return null;
//   // }
//   return await updateSession(request);

//   //   const session = await getServerSession(authOptions);

//   //   if (!session) {
//   //     return NextResponse.redirect(new URL("/login", request.url));
//   //   }

//   //   return NextResponse.next();
//   // }
//   // export const config = {
//   //   matcher: [
//   //     "/dashboard/:path*",
//   //     "/profile/:path*",
//   //     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   //   ],
// }
