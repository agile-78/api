import { Router } from "express";
import { create, getAll } from "../controllers/material";

export const router = Router();

router.route("/").post(create).get(getAll);
