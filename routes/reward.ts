import { Router } from "express";
import { fileUpload } from "../middleware/fileUpload";
import { create } from "../controllers/reward";

export const router = Router();

router.route("/").post(fileUpload.single("logo"), create);
