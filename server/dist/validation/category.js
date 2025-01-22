"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCategorySchema = exports.createCategorySchema = void 0;
exports.createCategorySchema = {
    title: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        isLength: {
            options: { min: 3 },
        },
    },
};
exports.editCategorySchema = {
    title: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        isLength: {
            options: { min: 3 },
        },
    },
};
