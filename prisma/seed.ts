import { PrismaClient, UserRole } from "@prisma/client";
import { Bcrypt } from "oslo/password";

const prisma = new PrismaClient();
const bycrypt = new Bcrypt();

const users = [
  {
    name: "Admin",
    email: "admin@mail.com",
    role: UserRole.ADMIN,
  },
];

async function main() {
  console.log("Seeding users...");
  const password = await bycrypt.hash("password");

  for (const user of users) {
    const result = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        password,
      },
    });

    console.log(`🆙 Created user: ${result.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding finished. Disconnecting...");
    await prisma.$disconnect();
    process.exit(0);
  });
