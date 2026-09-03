import type { NextAuthConfig } from "next-auth";

export const SESSION_MAX_AGE = 8 * 60 * 60; // 8 horas
export const SESSION_IDLE_TIMEOUT = 30 * 60; // 30 minutos

export const authConfig = {
  trustHost: true,

  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
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

        // Momento em que a sessão foi criada
        token.sessionStartedAt = Date.now();

        // Última atividade
        token.lastActivityAt = Date.now();
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
        ? token.permissions.filter(
            (permission): permission is string =>
              typeof permission === "string",
          )
        : [];

      session.user.name = String(token.nome ?? "");

      return session;
    },
  },
} satisfies NextAuthConfig;
