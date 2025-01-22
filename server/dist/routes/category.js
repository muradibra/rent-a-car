"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = __importDefault(require("../middleware/validate"));
const category_1 = __importDefault(require("../controllers/category"));
const category_2 = require("../validation/category");
const router = (0, express_1.Router)();
router.get("/", category_1.default.getAll);
router.get("/:id", category_1.default.getById);
router.put("/:id", (0, validate_1.default)(category_2.editCategorySchema), (0, auth_1.authorize)({ isAdmin: true }), category_1.default.update);
router.post("/", (0, auth_1.authorize)({ isAdmin: true }), (0, validate_1.default)(category_2.createCategorySchema), category_1.default.create);
router.delete("/:id", (0, auth_1.authorize)({ isAdmin: true }), category_1.default.remove);
exports.default = router;
