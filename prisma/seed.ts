import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { PERMISSIONS } from "../lib/permissions";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está definida.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const permissions = await Promise.all(
    PERMISSIONS.map((permission) =>
      prisma.permission.upsert({
        where: { chave: permission.chave },
        update: { descricao: permission.descricao },
        create: {
          chave: permission.chave,
          descricao: permission.descricao,
        },
      }),
    ),
  );

  const adminRole = await prisma.role.upsert({
    where: { nome: "Administrador" },
    update: { descricao: "Acesso completo ao sistema" },
    create: { nome: "Administrador", descricao: "Acesso completo ao sistema" },
  });

  const apresentadorRole = await prisma.role.upsert({
    where: { nome: "Apresentador" },
    update: { descricao: "Pode controlar a partida" },
    create: { nome: "Apresentador", descricao: "Pode controlar a partida" },
  });

  const cadastradorRole = await prisma.role.upsert({
    where: { nome: "Cadastrador" },
    update: { descricao: "Pode gerenciar perguntas" },
    create: { nome: "Cadastrador", descricao: "Pode gerenciar perguntas" },
  });

  const usuarioRole = await prisma.role.upsert({
    where: { nome: "Usuário" },
    update: { descricao: "Usuário padrão" },
    create: { nome: "Usuário", descricao: "Usuário padrão" },
  });

  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  const cadastradorPerms = permissions.filter(p => p.chave === "dashboard.acessar" || p.chave === "perguntas.gerenciar");
  
  // Remove permissões antigas do cadastrador (ex: usuarios.gerenciar) se houver
  await prisma.rolePermission.deleteMany({
    where: {
      roleId: cadastradorRole.id,
      permissionId: { notIn: cadastradorPerms.map(p => p.id) }
    }
  });

  await Promise.all(
    cadastradorPerms.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: cadastradorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: cadastradorRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  // Permissões do Apresentador
  const apresentadorPerms = permissions.filter(p => p.chave === "dashboard.acessar" || p.chave === "jogo.gerenciar" || p.chave === "telao.abrir");
  
  await prisma.rolePermission.deleteMany({
    where: {
      roleId: apresentadorRole.id,
      permissionId: { notIn: apresentadorPerms.map(p => p.id) }
    }
  });

  await Promise.all(
    apresentadorPerms.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: apresentadorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: apresentadorRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  const nome = process.env.SEED_ADMIN_NOME ?? "Administrador";
  const nip = process.env.SEED_ADMIN_NIP ?? "00000001";
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@decatlo.local").toLowerCase();
  const idade = Number(process.env.SEED_ADMIN_IDADE ?? 30);
  const senha = process.env.SEED_ADMIN_PASSWORD ?? "Decatlo@1";

  if (!/^\d{8}$/.test(nip)) {
    throw new Error("SEED_ADMIN_NIP deve ter exatamente 8 dígitos.");
  }

  if (!Number.isInteger(idade) || idade < 0) {
    throw new Error("SEED_ADMIN_IDADE deve ser um inteiro válido.");
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  await prisma.user.upsert({
    where: { nip },
    update: {
      nome,
      email,
      idade,
      senhaHash,
      roleId: adminRole.id,
    },
    create: {
      nome,
      nip,
      email,
      idade,
      senhaHash,
      roleId: adminRole.id,
    },
  });

  console.log("Seed concluído: role Administrador e usuário inicial criados.");
  console.log(`Login: NIP ${nip} ou e-mail ${email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
