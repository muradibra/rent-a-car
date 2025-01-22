"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservationSchema = new mongoose_1.default.Schema({
    billingInfo: {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    },
    rent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Rent",
        required: true,
    },
    customer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    pickUpLocation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
    },
    dropOffLocation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
    },
    pickUpDate: {
        type: Date,
        required: true,
    },
    dropOffDate: {
        type: Date,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Cancelled"],
        default: "Pending",
    },
    hasReview: {
        type: Boolean,
        default: false,
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
const Reservation = mongoose_1.default.model("Reservation", reservationSchema);
exports.default = Reservation;
