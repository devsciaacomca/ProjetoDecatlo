import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nome: string;
      nip: string;
      email: string;
      role: string;
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    nome: string;
    nip: string;
    email: string;
    role: string;
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nome: string;
    nip: string;
    email?: string | null;
    role: string;
    permissions: string[];
  }
}
