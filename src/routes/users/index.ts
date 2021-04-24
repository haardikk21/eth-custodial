import { PrismaClient } from "@prisma/client";
import { Wallet } from "ethers";
import { Router, Request, Response } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!(name && email)) {
    return res.status(400).json({
      message: "Missing name or email in request body",
    });
  }

  const newWallet = Wallet.createRandom();
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        wallet: {
          create: {
            privateKey: newWallet.privateKey,
          },
        },
      },
    });

    return res.json(user);
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong - ${e.message}`,
    });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  const allUsers = await prisma.user.findMany({
    include: {
      wallet: true,
    },
  });
  return res.json(allUsers);
});

router.get("/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(req.params.id),
    },
    include: {
      wallet: true,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  return res.json(user);
});

export default router;
