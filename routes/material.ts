import { Router } from "express";
import { create, get, getAll } from "../controllers/material";

export const router = Router();

router.route("/").post(create).get(getAll);
router.route("/:id").get(get);
