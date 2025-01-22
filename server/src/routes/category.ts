import { Router } from "express";
import { authorize } from "../middleware/auth";
import validateSchema from "../middleware/validate";
import categoryController from "../controllers/category";
import {
  createCategorySchema,
  editCategorySchema,
} from "../validation/category";

const router = Router();

router.get("/", categoryController.getAll);

router.get("/:id", categoryController.getById);
router.put(
  "/:id",
  validateSchema(editCategorySchema),
  authorize({ isAdmin: true }),
  categoryController.update
);

router.post(
  "/",
  authorize({ isAdmin: true }),
  validateSchema(createCategorySchema),
  categoryController.create
);
router.delete("/:id", authorize({ isAdmin: true }), categoryController.remove);

export default router;
