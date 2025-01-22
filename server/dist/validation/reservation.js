"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeReservationStatusSchema = exports.createReservationSchema = void 0;
exports.createReservationSchema = {
    "billing.name": {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
    "billing.phoneNumber": {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
    "billing.address": {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
    "billing.city": {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
    pickUpLocation: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        isMongoId: true,
    },
    pickUpDate: {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
    dropOffLocation: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        isMongoId: true,
    },
    dropOffDate: {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
    rent: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        isMongoId: true,
    },
};
exports.changeReservationStatusSchema = {
    status: {
        in: ["body"],
        matches: {
            options: [/\b(?:Pending|Approved|Rejected|Cancelled)\b/],
            errorMessage: "Invalid Status",
        },
        isString: true,
        notEmpty: true,
    },
};
