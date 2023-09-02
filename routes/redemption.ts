import { Router } from "express";
import { create } from "../controllers/redemption";

export const router = Router();

router.route("/").post(create);
