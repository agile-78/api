import { Router } from "express";
import {
  deleteUser,
  getUser,
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
  .get(getUser)
  .patch(fileUpload.single("profilePic"), updateUser)
  .delete(deleteUser);
