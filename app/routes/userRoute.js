import express from "express";

import { createUser, siginUser } from "../controllers/usersController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

// user Routes

router.post("/createuser", createUser);
router.post("/login", siginUser);
export default router;
