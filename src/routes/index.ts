import { Router } from "express";
import users from "./users";
import wallet from "./wallet";

const router = Router();

router.use("/users", users);
router.use("/wallet", wallet);

export default router;
