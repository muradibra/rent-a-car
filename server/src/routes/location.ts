import { Router } from "express";
import { authorize } from "../middleware/auth";
import locationController from "../controllers/location";
import validateSchema from "../middleware/validate";
import { createLocationSchema } from "../validation/location";

const router = Router();

router.get("/", locationController.getAll);
router.get("/:id", locationController.getById);
router.put(
  "/:id",
  validateSchema(createLocationSchema),
  authorize({ isAdmin: true }),
  locationController.update
);
router.post(
  "/",
  authorize({ isAdmin: true }),
  validateSchema(createLocationSchema),
  locationController.create
);
router.delete("/:id", authorize({ isAdmin: true }), locationController.remove);

export default router;
