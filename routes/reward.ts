import { Router } from "express";
import { fileUpload } from "../middleware/fileUpload";
import { create, get } from "../controllers/reward";

export const router = Router();

router.route("/").get(get).post(fileUpload.single("logo"), create);
