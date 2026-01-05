jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    device: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    suspiciousActivity: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_jwt_token"),
}));

jest.mock("@/lib/logLoginAttempt", () => ({
  LogLoginAttempt: jest.fn(),
}));

jest.mock("@/lib/tempToken", () => ({
  createTempToken: jest.fn(() => "temp_2fa_token"),
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

import { POST } from "@/app/api/auth/login/route";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const mockUser = {
  id: "user-1",
  email: "test@test.com",
  password: "hashed_password",
  status: "ACTIVE",
  role: "USER",
  name: "Test User",
  twoFaEnabled: false,
};

describe("Login API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (prisma.device.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.session.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.$transaction as jest.Mock).mockResolvedValue([
      {},
      { id: "device-1" },
    ]);
  });

  it("rejects login when email missing", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password: "123456" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects login when password missing", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@test.com" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects login when user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "123456",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects login when password incorrect", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "wrong-password",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("blocks suspended or locked user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockUser,
      status: "SUSPENDED",
    });

    const req = new Request("http://localhsot/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "123456",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("allows login and returns JWT", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (prisma.device.create as jest.Mock).mockResolvedValue({
      id: "device-1",
    });
    (prisma.session.create as jest.Mock).mockResolvedValue({});

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "user-agent": "jest",
        "x-forwarded-for": "127.0.0.1",
      },
      body: JSON.stringify({
        email: "test@test.com",
        password: "123456",
        fingerprint: "fp-1",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.token).toBe("mocked_jwt_token");
    expect(body.user.email).toBe("test@test.com");
  });
});
