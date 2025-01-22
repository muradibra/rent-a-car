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
const reservation_1 = __importDefault(require("../mongoose/schemas/reservation"));
const rent_1 = __importDefault(require("../mongoose/schemas/rent"));
const location_1 = __importDefault(require("../mongoose/schemas/location"));
const utils_1 = require("../utils");
const reservation_2 = require("../types/reservation");
const user_1 = require("../types/user");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const filter = {};
        if (user.role !== user_1.UserRole.ADMIN) {
            filter.customer = user._id;
        }
        const reservation = yield reservation_1.default.find(filter)
            .populate("rent", "title price discountPrice description imageUrls")
            .populate("pickUpLocation")
            .populate("dropOffLocation");
        reservation.forEach((reservation) => {
            reservation.rent.imageUrls = reservation.rent.imageUrls.map((url) => {
                if (url.startsWith("http"))
                    return url;
                return `${process.env.BASE_URL}${url}`;
            });
        });
        res.status(200).json({
            message: "Reservations fetched successfully!",
            items: reservation,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { billing, pickUpLocation, pickUpDate, dropOffLocation, dropOffDate, rent, } = req.matchedData;
        const [rentExists, pickUpLocationExists, dropOffLocationExists] = yield Promise.all([
            rent_1.default.findById(rent),
            location_1.default.findById(pickUpLocation),
            location_1.default.findById(dropOffLocation),
        ]);
        if (!rentExists || !pickUpLocationExists || !dropOffLocationExists) {
            res.status(400).json({ message: "Invalid data!" });
            return;
        }
        if (new Date(pickUpDate) > new Date(dropOffDate)) {
            res
                .status(400)
                .json({ message: " Pick up date should be less than drop off date!" });
            return;
        }
        if (new Date(pickUpDate) < new Date()) {
            res
                .status(400)
                .json({ message: "Pick up date should be greater than current date!" });
            return;
        }
        if (new Date(dropOffDate) < new Date()) {
            res.status(400).json({
                message: "Drop off date should be greater than current date!",
            });
            return;
        }
        const reservationExists = yield reservation_1.default.findOne({
            rent,
            dropOffDate: {
                $gte: pickUpDate,
            },
            pickUpDate: {
                $lte: dropOffDate,
            },
        });
        if (reservationExists) {
            res
                .status(400)
                .json({ message: "Rent is not available between theese dates." });
            return;
        }
        const rentDays = (0, utils_1.calculateDaysBetween)(new Date(pickUpDate), new Date(dropOffDate));
        const total = (rentExists.discountPrice || rentExists.price) * rentDays;
        const reservation = yield reservation_1.default.create({
            billingInfo: billing,
            pickUpLocation,
            pickUpDate,
            dropOffLocation,
            dropOffDate,
            rent,
            customer: req.user._id,
            total,
        });
        res.status(201).json({
            message: "Reservation created successfully!",
            item: reservation,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = req.user.role;
        const { status } = req.matchedData;
        if (status !== reservation_2.ReservationStatus.Cancelled && role !== user_1.UserRole.ADMIN) {
            res
                .status(403)
                .json({ message: "You are not allowed to change status!" });
            return;
        }
        const reservation = yield reservation_1.default.findById(id);
        if (!reservation) {
            res.status(404).json({ message: "Reservation not found!" });
            return;
        }
        if (reservation.status === status) {
            res.status(400).json({ message: "Reservation already has this status!" });
            return;
        }
        if (reservation.status === reservation_2.ReservationStatus.Cancelled) {
            res.status(400).json({ message: "Reservation is already cancelled!" });
            return;
        }
        if (reservation.status !== reservation_2.ReservationStatus.Pending &&
            status === reservation_2.ReservationStatus.Cancelled) {
            res
                .status(400)
                .json({ message: "You can only cancel pending reservations!" });
            return;
        }
        if (status === reservation_2.ReservationStatus.Approved &&
            reservation.status !== reservation_2.ReservationStatus.Pending) {
            res
                .status(400)
                .json({ message: "You can only approve pending reservations!" });
            return;
        }
        reservation.status = status;
        yield reservation.save();
        res.status(200).json({
            message: "Reservation status changed successfully!",
            item: reservation,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const reservationController = {
    getAll,
    create,
    changeStatus,
};
exports.default = reservationController;
