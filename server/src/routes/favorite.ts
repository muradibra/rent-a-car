import { Router } from "express";
import { authorize } from "../middleware/auth";
import favoriteController from "../controllers/favorite";

const router = Router();

router.get("/", favoriteController.getAll);
router.post("/:id", authorize(), favoriteController.toggle);

export default router;
