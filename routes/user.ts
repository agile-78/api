import { Router } from "express";
import { deleteUser, updateUser } from "../controllers/user";

export const router = Router();

router.route("/users").delete(deleteUser).patch(updateUser);
