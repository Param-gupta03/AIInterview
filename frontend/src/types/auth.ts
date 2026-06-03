export type User = {
  id: string;
  email: string;
  full_name: string;
};

export type AuthSession = {
  access_token: string;
  token_type: string;
  expires_at: number;
  user: User;
};

export type AuthMode = "login" | "signup";
