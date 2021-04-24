import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  app.listen(process.env.PORT, () => {
    console.log(
      `ETH Custodial Wallet API listening on port ${process.env.PORT} 🔥🔥`
    );
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
