"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const rentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fuel: {
        type: String,
        required: true,
    },
    gear: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    imageUrls: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        optional: true,
        default: null,
    },
    category: {
        type: mongoose_1.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    pickUpLocations: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Location",
        default: [],
    },
    dropOffLocations: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Location",
        default: [],
    },
    review: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Review",
        default: [],
    },
    showInRecommendation: {
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
const Rent = mongoose_1.default.model("Rent", rentSchema);
exports.default = Rent;
