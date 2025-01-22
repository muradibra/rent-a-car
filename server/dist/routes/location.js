"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const location_1 = __importDefault(require("../controllers/location"));
const validate_1 = __importDefault(require("../middleware/validate"));
const location_2 = require("../validation/location");
const router = (0, express_1.Router)();
router.get("/", location_1.default.getAll);
router.get("/:id", location_1.default.getById);
router.put("/:id", (0, validate_1.default)(location_2.createLocationSchema), (0, auth_1.authorize)({ isAdmin: true }), location_1.default.update);
router.post("/", (0, auth_1.authorize)({ isAdmin: true }), (0, validate_1.default)(location_2.createLocationSchema), location_1.default.create);
router.delete("/:id", (0, auth_1.authorize)({ isAdmin: true }), location_1.default.remove);
exports.default = router;
