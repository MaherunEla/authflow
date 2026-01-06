import { POST } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("@/lib/tempToken", () => ({
  createTempToken: jest.fn(() => "temp_2fa_token"),
}));

jest.mock("@/lib/logLoginAttempt", () => ({
  LogLoginAttempt: jest.fn(),
}));

jest.mock("@/lib/ip", () => ({
  getLocationFromIP: jest.fn(() => "Dhaka"),
}));

jest.mock("ua-parser-js", () => ({
  UAParser: jest.fn(() => ({
    setUA: jest.fn(),
    getBrowser: () => ({ name: "Chrome" }),
    getOS: () => ({ name: "Windows" }),
  })),
}));

const twoFaUser = {
  id: "user-2fa",
  email: "2fa@test.com",
  password: "hashed_password",
  status: "ACTIVE",
  role: "USER",
  name: "2FA User",
  twoFaEnabled: true,
};

describe("Login API - 2FA Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("triggers 2FA when user has twoFaEnabled", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(twoFaUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "user-agent": "jest",
        "x-forwarded-for": "127.0.0.1",
      },
      body: JSON.stringify({
        email: "2fa@test.com",
        password: "123456",
        fingerprint: "fp-2fa",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);

    expect(body.twoFARequired).toBe(true);
    expect(body.tempToken).toBe("temp_2fa_token");

    expect(body.token).toBeUndefined();

    expect(prisma.session.create).not.toHaveBeenCalled();
  });
});
