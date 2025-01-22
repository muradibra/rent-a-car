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
const review_1 = __importDefault(require("../mongoose/schemas/review"));
const reservation_1 = __importDefault(require("../mongoose/schemas/reservation"));
const reservation_2 = require("../types/reservation");
const rent_1 = __importDefault(require("../mongoose/schemas/rent"));
const review_2 = require("../types/review");
const getAll = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_1.default.find()
            .populate("rent")
            .populate("author", "name username email avatar");
        res.status(200).json({
            items: reviews,
            message: "Reviews fetched successfully! ",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const getByRentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rentId } = req.params;
        const reviews = yield review_1.default.find({
            rent: rentId,
            status: review_2.ReviewStatus.Approved,
        })
            .populate("author", "name username email avatar")
            .populate("rent");
        res.status(200).json({
            items: reviews,
            message: "Reviews fetched successfully! ",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { content, rate, reservationId } = req.matchedData;
        const reservation = yield reservation_1.default.findById(reservationId);
        if (!reservation) {
            res.status(404).json({ message: "Reservation not found!" });
            return;
        }
        if (reservation.dropOffDate > new Date()) {
            res
                .status(400)
                .json({ message: "You can not leave a review after drop off date" });
            return;
        }
        if (reservation.status !== reservation_2.ReservationStatus.Approved) {
            res.status(400).json({
                message: "You can only review after the reservation is approved",
            });
            return;
        }
        if (reservation.customer.toString() !== user._id.toString()) {
            res.status(400).json({
                message: "You can only review your own reservation",
            });
            return;
        }
        if (reservation.hasReview) {
            res.status(400).json({
                message: "You already reviewed this reservation",
            });
            return;
        }
        reservation.hasReview = true;
        yield reservation.save();
        const review = yield review_1.default.create({
            author: user._id,
            content,
            rate,
            rent: reservation.rent,
        });
        yield rent_1.default.findByIdAndUpdate(reservation.rent, {
            $push: { reviews: review._id },
        });
        res.status(200).json({
            item: review,
            message: "Review created successfully!",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.matchedData;
    const review = yield review_1.default.findById(id);
    if (!review) {
        res.status(404).json({ message: "Review not found!" });
        return;
    }
    review.status = status;
    yield review.save();
    res.status(200).json({
        item: review,
        message: "Review status changed successfully!",
    });
});
const reviewController = {
    getAll,
    getByRentId,
    create,
    changeStatus,
};
exports.default = reviewController;
