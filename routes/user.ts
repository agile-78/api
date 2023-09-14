import { Router } from "express";
import {
  deleteUser,
  getUserPoints,
  getUserRecycleCount,
  getUserReferredCount,
  updateUser,
} from "../controllers/user";
import { fileUpload } from "../middleware/fileUpload";

export const router = Router();
router.route("/:id/points").get(getUserPoints);
router.route("/:id/referralcount").get(getUserReferredCount);
router.route("/:id/recyclecount").get(getUserRecycleCount);

router
  .route("/:id")
  .patch(fileUpload.single("profilePic"), updateUser)
  .delete(deleteUser);
