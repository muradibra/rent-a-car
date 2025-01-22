"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = __importDefault(require("../mongoose/schemas/category"));
const rent_1 = __importDefault(require("../mongoose/schemas/rent"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find();
        res.status(200).json({
            message: "Categories fetched successfully!",
            // count: categories.length,
            items: categories,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_1.default.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found!" });
            return;
        }
        res.status(200).json({
            message: "Category fetched successfully!",
            item: category,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title } = req.matchedData;
        const category = yield category_1.default.findByIdAndUpdate(id, { title }, { new: true });
        if (!category) {
            res.status(404).json({ message: "Category not found!" });
            return;
        }
        res.status(200).json({
            message: "Category updated successfully!",
            item: category,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.matchedData;
        const category = yield category_1.default.create({ title });
        res.status(201).json({
            message: "Category created successfully",
            item: category,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const hasAnyRent = yield rent_1.default.findOne({
            category: id,
        });
        if (hasAnyRent) {
            res.status(400).json({ message: "Category is in use!" });
            return;
        }
        const category = yield category_1.default.findByIdAndDelete(id);
        if (!category) {
            res.status(404).json({ message: "Category not found!" });
            return;
        }
        res.status(200).json({ message: "Category deleted successfully!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const categoryController = {
    getAll,
    create,
    update,
    getById,
    remove,
};
exports.default = categoryController;
