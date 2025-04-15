import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SessionPayload } from "../../types/authTypes";
import speakeasy from "speakeasy";
import { prisma } from "./prisma";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function login(formData: FormData) {
  const step = formData.get("step") || "credentials";
  if (step === "credentials") {
    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    if (!user.email || !user.password) {
      return { error: "Invalid email or password" };
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      }
    );
    console.log({ res });
    if (!res.ok) {
      return { error: "Invalid email or password" };
    }

    const data = await res.json();
    if (!data.user) {
      return { error: "User not found" };
    }

    if (data.twoFARequired) {
      return {
        requires2FA: true,
        userId: data.user.id,
        tempToken: data.tempToken,
      };
    }
    //create session
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const custom_jwt = await encrypt({ user: data.user, expires });

    return { custom_jwt };
  }

  if (step === "2fa") {
    const userId = formData.get("userId") as string;
    const token = formData.get("token") as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFaSecret) return { error: "Invalid 2FA setup" };

    const verified = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) return { error: "Invalid 2FA code" };
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const custom_jwt = await encrypt({ user, expires });

    return { custom_jwt };
  }

  // //save the session in a cookie
  // const cookieStore = await cookies();
  // cookieStore.set("custom_jwt", custom_jwt, { expires, httpOnly: true });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("custom_jwt", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0),
  });

  // Optionally clear NextAuth cookies if you're using OAuth
  cookieStore.set("next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
  });

  cookieStore.set("__Secure-next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const custom_jwt = cookieStore.get("custom_jwt")?.value;
  if (!custom_jwt) return null;
  return await decrypt(custom_jwt);
}

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const token = request.cookies.get("custom_jwt")?.value;

  if (!token) return response;

  try {
    const session = await decrypt(token);
    if (!session)
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const now = new Date();
    const expires = new Date(session.expires);

    if (expires < now) {
      response.cookies.delete("custom_jwt");
      return response;
    }

    // Optional: refresh session (extend 1 more hour)
    session.expires = new Date(now.getTime() + 60 * 60 * 1000);
    const newToken = await encrypt(session);

    response.cookies.set("custom_jwt", newToken, {
      httpOnly: true,
      expires: session.expires,
    });

    return response;
  } catch (err) {
    console.error("Session error:", err);
    response.cookies.delete("custom_jwt");
    return response;
  }
}
