jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { POST } from "@/app/api/auth/signup/route";
import bcrypt from "bcryptjs";

const { prisma } = jest.requireMock("@/lib/prisma");
jest.mock("bcryptjs");

describe("Signup API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_passwod");
  });

  it("should create user successfully", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@test.com",
    });

    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@test.com",
        password: "123456",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.message).toBe("User created successfully");
  });

  it("should return 409 if email exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "1" });

    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@test.com",
        password: "123456",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.error).toBe("Email already exists");
  });

  it("should return 400 for missing fields", async () => {
    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 500 for unexpected errors", async () => {
    (prisma.user.findUnique as jest.Mock).mockImplementation(() => {
      throw new Error("DB down");
    });

    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@test.com",
        password: "123456",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Internal server error");
  });
});
