import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { loginSchema, normalizarIdentificador } from "@/lib/validations/login";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "NIP ou e-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const password = parsed.data.password;
        const identificador = normalizarIdentificador(parsed.data.identifier);

        const user = await prisma.user.findFirst({
          where:
            identificador.tipo === "nip"
              ? { nip: identificador.valor }
              : { email: identificador.valor },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        });

        if (!user) {
          return null;
        }

        const senhaValida = await bcrypt.compare(password, user.senhaHash);

        if (!senhaValida) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.nome,
          email: user.email,
          nome: user.nome,
          nip: user.nip,
          role: user.role.nome,
          permissions: user.role.permissions.map(
            (rolePermission) => rolePermission.permission.chave,
          ),
        };
      },
    }),
  ],
});
