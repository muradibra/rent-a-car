"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Rent",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
