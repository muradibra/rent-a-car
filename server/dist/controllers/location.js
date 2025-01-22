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
const location_1 = __importDefault(require("../mongoose/schemas/location"));
const rent_1 = __importDefault(require("../mongoose/schemas/rent"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = yield location_1.default.find();
        res.status(200).json({
            message: "Locations fetched successfully!",
            count: locations.length,
            items: locations,
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
        const location = yield location_1.default.findById(id);
        if (!location) {
            res.status(404).json({ message: "Location not found!" });
            return;
        }
        res.status(200).json({
            message: "Location fetched successfully!",
            item: location,
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
        const location = yield location_1.default.findByIdAndUpdate(id, { title }, { new: true });
        if (!location) {
            res.status(404).json({ message: "Location not found!" });
            return;
        }
        res.status(200).json({
            message: "Location updated successfully!",
            item: location,
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
        const location = yield location_1.default.create({ title });
        res.status(201).json({
            message: "Location created successfully",
            item: location,
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
            $or: [
                {
                    pickUpLocations: {
                        $in: [id],
                    },
                },
                {
                    dropOffLocations: {
                        $in: [id],
                    },
                },
            ],
        });
        if (hasAnyRent) {
            res.status(400).json({ message: "Location is in use!" });
            return;
        }
        const location = yield location_1.default.findByIdAndDelete(id);
        if (!location) {
            res.status(404).json({ message: "Location not found!" });
            return;
        }
        res.status(200).json({ message: "Location deleted successfully!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const locationController = {
    getAll,
    create,
    remove,
    update,
    getById,
};
exports.default = locationController;
