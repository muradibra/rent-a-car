"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const favorite_1 = __importDefault(require("../controllers/favorite"));
const router = (0, express_1.Router)();
router.get("/", favorite_1.default.getAll);
router.post("/:id", (0, auth_1.authorize)(), favorite_1.default.toggle);
exports.default = router;
