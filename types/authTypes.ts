export type SessionPayload = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    twoFaEnabled?: boolean;
  };
  expires: Date;
};
