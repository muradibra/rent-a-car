"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocationSchema = void 0;
exports.createLocationSchema = {
    title: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        isLength: {
            options: { min: 3 },
        },
    },
};
