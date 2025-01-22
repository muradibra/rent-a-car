import { Router } from "express";
import { authorize } from "../middleware/auth";
import rentController from "../controllers/rent";
import validateSchema from "../middleware/validate";
import {
  createRentSchema,
  editRentSchema,
  getAllRentSchema,
} from "../validation/rent";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", validateSchema(getAllRentSchema), rentController.getAll);
router.get("/popular", rentController.getPopular);
router.get("/:id", rentController.getById);
router.post(
  "/",
  authorize({ isAdmin: true }),
  upload.array("images", 10),
  validateSchema(createRentSchema),
  rentController.create
);
router.put(
  "/:id",
  authorize({ isAdmin: true }),
  upload.array("images", 10),
  validateSchema(editRentSchema),
  rentController.edit
);
router.delete("/:id", authorize({ isAdmin: true }), rentController.remove);

export default router;
