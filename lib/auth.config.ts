import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.nip = user.nip;
        token.email = user.email;
        token.role = user.role;
        token.permissions = user.permissions;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id ?? "");
      session.user.nome = String(token.nome ?? "");
      session.user.nip = String(token.nip ?? "");
      session.user.email = String(token.email ?? "");
      session.user.role = String(token.role ?? "");
      session.user.permissions = Array.isArray(token.permissions)
        ? token.permissions.filter((permission): permission is string => {
            return typeof permission === "string";
          })
        : [];
      session.user.name = String(token.nome ?? "");

      return session;
    },
  },
} satisfies NextAuthConfig;
