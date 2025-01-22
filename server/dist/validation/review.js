"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeReviewStatusSchema = exports.createReviewSchema = void 0;
exports.createReviewSchema = {
    content: {
        in: ["body"],
        isString: true,
        isLength: {
            errorMessage: "Content must be at least 5 characters long",
            options: { min: 5 },
        },
    },
    rate: {
        in: ["body"],
        isInt: {
            errorMessage: "Rate must be a number between 1 and 5",
            options: { min: 1, max: 5 },
        },
    },
    reservationId: {
        in: ["body"],
        isMongoId: true,
        errorMessage: "Invalid reservation id",
    },
};
exports.ChangeReviewStatusSchema = {
    status: {
        in: ["body"],
        isString: true,
        matches: {
            options: [/\b(?:Pending|Approved|Rejected)\b/],
            errorMessage: "Invalid status",
        },
        notEmpty: true,
    },
};
