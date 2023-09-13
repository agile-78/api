import { Router } from "express";
import { classify } from "../controllers/ml";
import { fileUpload } from "../middleware/fileUpload";

export const router = Router();

router.route("/").post(fileUpload.single("image"), classify);
