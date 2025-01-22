import { Router } from "express";
import userController from "../controllers/user";
import { authorize } from "../middleware/auth";
import validateSchema from "../middleware/validate";
import { editUserSchema } from "../validation/user";
import { uploadAvatar } from "../middleware/uploadAvatar";

const router = Router();

router.get("/", authorize({ isAdmin: true }), userController.getAll);
router.delete("/", authorize(), userController.remove);
router.put(
  "/:id",
  uploadAvatar.single("avatar"),
  validateSchema(editUserSchema),
  authorize(),
  userController.update
);
export default router;
