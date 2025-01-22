"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rent_1 = __importDefault(require("../controllers/rent"));
const validate_1 = __importDefault(require("../middleware/validate"));
const rent_2 = require("../validation/rent");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.get("/", (0, validate_1.default)(rent_2.getAllRentSchema), rent_1.default.getAll);
router.get("/popular", rent_1.default.getPopular);
router.get("/:id", rent_1.default.getById);
router.post("/", (0, auth_1.authorize)({ isAdmin: true }), upload_1.upload.array("images", 10), (0, validate_1.default)(rent_2.createRentSchema), rent_1.default.create);
router.put("/:id", (0, auth_1.authorize)({ isAdmin: true }), upload_1.upload.array("images", 10), (0, validate_1.default)(rent_2.editRentSchema), rent_1.default.edit);
router.delete("/:id", (0, auth_1.authorize)({ isAdmin: true }), rent_1.default.remove);
exports.default = router;
