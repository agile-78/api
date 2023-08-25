import { Router } from "express";
import { login, register } from "../controllers/auth";
import { fileUpload } from "../middleware/fileUpload";

export const router = Router();

router.post("/login", login);
router.post("/register", fileUpload.single("profilePic"), register);
