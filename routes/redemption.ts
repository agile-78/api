import { Router } from "express";
import { create, getAll } from "../controllers/redemption";

export const router = Router();

router.route("/").get(getAll).post(create);
