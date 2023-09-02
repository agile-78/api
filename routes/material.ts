import { Router } from "express";
import { create } from "../controllers/material";

export const router = Router();

router.route("/").post(create);
