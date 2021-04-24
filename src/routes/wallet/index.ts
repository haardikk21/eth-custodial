import { PrismaClient } from "@prisma/client";
import { Wallet } from "ethers";
import { Router, Request, Response } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post("/:id/sign-message", async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({
      message: "You need to pass a message to sign",
    });
  }
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
      message: "User with given id not found",
    });
  }

  const wallet = new Wallet(user.wallet[0].privateKey);
  const signedMessage = await wallet.signMessage(message);
  return res.json({
    signed: signedMessage,
  });
});

export default router;
