import { Router } from "express";
import { create } from "../controllers/activity";

export const router = Router();

router.route("/").post(create);
