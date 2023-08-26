import { Router } from "express";
import { deleteUser, updateUser } from "../controllers/user";
import { fileUpload } from "../middleware/fileUpload";

export const router = Router();

router
  .route("/users/:id")
  .patch(fileUpload.single("profilePic"), updateUser)
  .delete(deleteUser);
